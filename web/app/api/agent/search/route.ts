import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import type Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient, CLAUDE_MODEL } from "@/lib/anthropic";
import { getOpenAIClient, hasOpenAIFallback, OPENAI_SEARCH_MODEL } from "@/lib/openai";
import { LOCALE_LANGUAGE_NAME, resolveLocale } from "@/i18n/locales";
import { checkRateLimit } from "@/lib/rateLimit";
import { safeExternalUrl } from "@/lib/safeUrl";
import { clampText, isUuid } from "@/lib/validation";
import type { ResourceLink, SearchPayload } from "@/lib/types";

// La ricerca fa alcune chiamate allo strumento web_search piu' l'eventuale retry: teniamo un
// margine oltre alla durata attesa (~20-50s per tentativo), il piano Hobby di Vercel supporta
// funzioni fino a 300s.
export const maxDuration = 180;

const MAX_RISORSE = 10;
/** La query finisce nel prompt: un tetto evita richieste enormi (e costose) verso i modelli. */
const MAX_QUERY_CHARS = 200;
const MAX_TEXT_FIELD_CHARS = 500;
const MAX_SPEC_ENTRIES = 12;
/** Ogni ricerca costa piu' chiamate al modello con web search: massimo 10 ogni 5 minuti per utente. */
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 5 * 60 * 1000;

/**
 * Tool "fittizio" (non eseguito da noi: e' il modo per chiedere a Claude un output
 * strutturato validato contro uno schema, invece di fargli scrivere un blocco ```json```
 * dentro un testo libero che poi dobbiamo estrarre con una regex. Elimina la classe di errori
 * piu' comune ("JSON troncato o malformato non estraibile dalla risposta").
 */
const SUBMIT_FINDINGS_TOOL: Anthropic.Tool = {
  name: "submit_findings",
  description:
    "Invia il risultato finale della ricerca. Chiamalo come ULTIMO passo, una sola volta, dopo aver fatto " +
    "le ricerche web necessarie: non scrivere il risultato come testo, usa sempre e solo questo strumento.",
  input_schema: {
    type: "object",
    properties: {
      summary: {
        type: "string",
        description: "Riepilogo testuale di massimo 2-3 frasi, nella lingua richiesta dal sistema.",
      },
      risorse: {
        type: "array",
        maxItems: MAX_RISORSE,
        description: `Al massimo ${MAX_RISORSE} risorse, solo URL realmente trovati tramite la ricerca web (mai inventati).`,
        items: {
          type: "object",
          properties: {
            categoria: {
              type: "string",
              enum: ["forum", "manuale_pdf", "video", "schema_tecnico", "pezzo_ricambio", "catalogo_ricambi", "piano_manutenzione", "altro"],
            },
            sezione: {
              type: "string",
              enum: ["motore", "carrozzeria", "assetto", "impianto_frenante", "trasmissione", "elettronica", "generale"],
            },
            titolo: { type: "string" },
            url: { type: "string" },
            descrizione: { type: "string" },
          },
          required: ["categoria", "titolo", "url", "descrizione"],
        },
      },
      specifiche: {
        type: "object",
        description:
          "Specifiche tecniche per sezione. 'motore' e' obbligatorio (3-6 voci). Le altre sezioni solo se " +
          "non rallentano la risposta: meglio ometterle che ritardare la chiamata a questo strumento.",
        properties: {
          motore: { type: "object", additionalProperties: { type: "string" } },
          carrozzeria: { type: "object", additionalProperties: { type: "string" } },
          assetto: { type: "object", additionalProperties: { type: "string" } },
          impianto_frenante: { type: "object", additionalProperties: { type: "string" } },
          trasmissione: { type: "object", additionalProperties: { type: "string" } },
        },
      },
      bollo: {
        type: "string",
        description:
          "Stima testuale del bollo (tassa di possesso) annuo per QUESTO veicolo, es. " +
          "'circa 150-180 €/anno (14 CV fiscali, Euro 5) — varia per regione'. Ometti il campo del tutto se " +
          "non riesci a stimare nemmeno la fascia approssimativa (mai inventare un numero a caso).",
      },
    },
    required: ["summary", "risorse", "specifiche"],
  },
};

/** Estrae il risultato dal blocco tool_use di submit_findings (nessun parsing di testo libero). */
function extractFindingsFromToolUse(
  content: Anthropic.ContentBlock[]
): { payload: SearchPayload; summary: string } | null {
  const toolUse = [...content].reverse().find(
    (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === "submit_findings"
  );
  if (!toolUse || typeof toolUse.input !== "object" || toolUse.input === null) return null;

  const input = toolUse.input as Record<string, unknown>;
  return {
    payload: {
      risorse: Array.isArray(input.risorse) ? (input.risorse as SearchPayload["risorse"]) : [],
      specifiche: typeof input.specifiche === "object" && input.specifiche ? (input.specifiche as SearchPayload["specifiche"]) : {},
      bollo: typeof input.bollo === "string" && input.bollo.trim() ? input.bollo.trim() : undefined,
    },
    summary: typeof input.summary === "string" ? input.summary : "",
  };
}

// Fallback testuale (regex su blocco ```json```), usato solo dal percorso OpenAI: la Responses
// API di OpenAI qui non e' collegata allo stesso meccanismo di tool strutturato di Anthropic.
function extractPayloadFromText(text: string): SearchPayload | null {
  const match = text.match(/```json\s*([\s\S]*?)```/) || text.match(/(\{[\s\S]*\})/);
  if (!match) return null;
  try {
    const parsed = JSON.parse(match[1]);
    return {
      risorse: Array.isArray(parsed.risorse) ? parsed.risorse : [],
      specifiche: typeof parsed.specifiche === "object" && parsed.specifiche ? parsed.specifiche : {},
      bollo: typeof parsed.bollo === "string" && parsed.bollo.trim() ? parsed.bollo.trim() : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Il payload arriva dal modello (che a sua volta cita pagine web di terzi): prima di salvarlo e
 * rimandarlo al browser scartiamo gli URL non http/https (`javascript:` diventerebbe XSS al click
 * nel momento in cui il link viene renderizzato) e tagliamo i campi testuali, cosi' una risposta
 * anomala non riempie il database.
 */
function sanitizePayload(payload: SearchPayload): SearchPayload {
  const risorse: ResourceLink[] = [];

  for (const risorsa of payload.risorse || []) {
    const url = safeExternalUrl(risorsa?.url);
    const titolo = clampText(risorsa?.titolo, MAX_TEXT_FIELD_CHARS);
    if (!url || !titolo) continue;

    risorse.push({
      categoria: risorsa.categoria,
      sezione: risorsa.sezione,
      titolo,
      url,
      descrizione: clampText(risorsa?.descrizione, MAX_TEXT_FIELD_CHARS) || "",
    });

    if (risorse.length >= MAX_RISORSE) break;
  }

  const specifiche: SearchPayload["specifiche"] = {};
  for (const [sezione, voci] of Object.entries(payload.specifiche || {})) {
    if (!voci || typeof voci !== "object") continue;
    const clean: Record<string, string> = {};
    for (const [key, value] of Object.entries(voci).slice(0, MAX_SPEC_ENTRIES)) {
      const cleanKey = clampText(key, 80);
      const cleanValue = clampText(value, MAX_TEXT_FIELD_CHARS);
      if (cleanKey && cleanValue) clean[cleanKey] = cleanValue;
    }
    if (Object.keys(clean).length) {
      specifiche[sezione as keyof SearchPayload["specifiche"]] = clean;
    }
  }

  return {
    risorse,
    specifiche,
    bollo: clampText(payload.bollo, MAX_TEXT_FIELD_CHARS) || undefined,
  };
}

function buildSearchSystemPrompt(language: string) {
  return (
  "Sei l'assistente tecnico di My Vehicle. Quando un utente aggiunge un veicolo, il tuo compito è " +
  "riempire SUBITO le sue schede (Motore, Carrozzeria, Assetto, Impianto frenante, Trasmissione, " +
  "Elettronica) con informazioni utili, cosi' l'utente trova già tutto pronto senza dover compilare nulla " +
  "a mano. Usa lo strumento di ricerca web per trovare forum dedicati, manuali/PDF di manutenzione, video " +
  "YouTube (tutorial/riparazioni/revisioni), schemi tecnici/viste esplose, e negozi/cataloghi di pezzi di " +
  "ricambio pertinenti al modello e alla motorizzazione indicati. L'utente è in attesa: sii efficiente, fai " +
  "al massimo 3-4 ricerche mirate (non ripetere ricerche simili) e vai dritto al risultato senza divagare. " +
  "La velocita' e il completare la risposta contano piu' della completezza assoluta.\n\n" +
  "DUE RICERCHE SONO PRIORITARIE e vanno fatte quasi sempre (salvo che il veicolo sia troppo generico/raro): " +
  "1) la pagina del catalogo ricambi di AUTODOC (dominio auto-doc.it per l'Italia, CON il trattino — NON " +
  "autodoc.it senza trattino, che è un'azienda diversa e non centrata; per altri paesi il dominio è " +
  "autodoc.<paese>, es. autodoc.co.uk, autodoc.de) per questo esatto modello e " +
  "motorizzazione, da salvare con categoria 'catalogo_ricambi'; 2) il piano di manutenzione/tagliandi " +
  "ufficiale del costruttore (intervalli di manutenzione, cosa fare a quali km/anni), da salvare con " +
  "categoria 'piano_manutenzione' — utile a chi vuole fare da sé i tagliandi senza andare dal meccanico. " +
  "Se non trovi una pagina AutoDoc specifica per il modello esatto, usa la pagina di ricerca generica di " +
  "AutoDoc per quella marca/modello invece di ometterla del tutto.\n\n" +
  "REGOLA IMPORTANTE su \"sezione\": per OGNI risultato scegli la sezione più specifica possibile tra " +
  "motore, carrozzeria, assetto, impianto_frenante, trasmissione, elettronica. Usa 'generale' SOLO come " +
  "ultima risorsa se davvero non è riconducibile a nessuna di queste (es. un forum generale sul marchio).\n\n" +
  "REGOLA IMPORTANTE su \"specifiche\": è OBBLIGATORIO valorizzare SOLO 'motore', con 3-6 voci, usando la " +
  "ricerca web E la tua conoscenza generale del modello/motorizzazione indicati (se non trovi un dato preciso " +
  "al 100%, va bene il valore tipico/più diffuso per quella motorizzazione). Le altre sezioni " +
  "('carrozzeria', 'assetto', 'impianto_frenante', 'trasmissione') sono un bonus: valorizzale SOLO se hai " +
  "già i dati a portata di mano senza fare ricerche aggiuntive — è molto meglio chiamare subito lo strumento " +
  "con 'motore' compilato e le altre sezioni vuote, piuttosto che ritardare o troncare la risposta per " +
  "inseguire la completezza. Non inventare mai numeri specifici per un veicolo troppo raro o sconosciuto: " +
  "in quel caso ometti solo quella singola voce.\n\n" +
  "REGOLA IMPORTANTE su \"bollo\": valorizzalo SENZA fare ricerche web dedicate, usando solo la tua conoscenza " +
  "generale e i CV fiscali/kW e la classe emissioni (Euro 0-6) gia' emersi per la sezione 'motore' — non e' " +
  "una delle 3-4 ricerche prioritarie. Per le auto usa la formula ACI standard (€/kW in base alla classe " +
  "Euro); per le moto la fascia in base alla cilindrata (sotto i 150 cc di norma non e' dovuto). Presentalo " +
  "sempre come stima di massima con un intervallo (es. 'circa 150-180 €/anno'), specifica i CV fiscali/kW e " +
  "la classe Euro usati per calcolarlo, e ricorda che l'importo varia per regione (in Valle d'Aosta e nelle " +
  "Province di Trento e Bolzano non si paga). Ometti il campo del tutto se il veicolo o la motorizzazione " +
  "sono troppo generici per una stima sensata: mai inventare un numero secco senza intervallo ne' contesto.\n\n" +
  `Rispondi SEMPRE in ${language} (sia il riepilogo sia i valori testuali dentro lo strumento, es. "titolo", ` +
  `"descrizione", i nomi delle caratteristiche in "specifiche"). Quando hai finito le ricerche, chiama SUBITO ` +
  "lo strumento \"submit_findings\" con il risultato: non scrivere mai il risultato come testo o come blocco " +
  "di codice, usa sempre e solo quello strumento, una sola volta. " +
  'I valori delle chiavi fisse "categoria" e "sezione" restano SEMPRE nei codici elencati sopra (mai tradotti), ' +
  "cosi' l'app puo' continuare a interpretarli correttamente."
  );
}

// Fallback su OpenAI se Anthropic non risponde affatto (rete/5xx/rate limit) o se anche con un
// retry non produce un risultato strutturato utilizzabile. Usa lo stesso system prompt (compreso
// il promemoria sul blocco ```json```, ancora valido come istruzione di riserva per un modello
// che non supporta i tool nello stesso modo) e il parsing testuale legacy.
async function searchWithOpenAI(systemPrompt: string, userContent: string): Promise<string> {
  const openai = getOpenAIClient();
  const response = await openai.responses.create({
    model: OPENAI_SEARCH_MODEL,
    tools: [{ type: "web_search_preview" }],
    input: [
      { role: "system", content: `${systemPrompt}\n\nTermina la risposta con un blocco \`\`\`json\`\`\` contenente un oggetto {"summary": "...", "risorse": [...], "specifiche": {...}, "bollo": "..."} (campo "bollo" omesso se non stimabile).` },
      { role: "user", content: userContent },
    ],
  });
  return response.output_text || "";
}

/** Un tentativo di ricerca con Anthropic: ricerca web + output strutturato via submit_findings. */
async function callAnthropicSearch(userContent: string, systemPrompt: string) {
  const anthropic = getAnthropicClient();
  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 8000,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 4,
      } as any,
      SUBMIT_FINDINGS_TOOL,
    ],
  });

  const found = extractFindingsFromToolUse(message.content);
  return {
    payload: found?.payload ?? null,
    summary: found?.summary ?? "",
    stopReason: message.stop_reason ?? undefined,
  };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const tErr = await getTranslations("apiErrors");
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: tErr("notAuthenticated") }, { status: 401 });
  }

  const limit = checkRateLimit(`search:${user.id}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: tErr("rateLimited") },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  let body: { query?: unknown; vehicleId?: unknown; locale?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: tErr("invalidRequest") }, { status: 400 });
  }

  const query = clampText(body.query, MAX_QUERY_CHARS);
  if (!query || query.length < 2) {
    return NextResponse.json({ error: tErr("searchQueryTooShort") }, { status: 400 });
  }

  // Un id non-UUID farebbe fallire la query PostgREST con un errore di parsing: meglio
  // trattarlo come "nessun veicolo di riferimento".
  const vehicleId = isUuid(body.vehicleId) ? body.vehicleId : null;
  const locale = typeof body.locale === "string" ? body.locale : undefined;

  const language = LOCALE_LANGUAGE_NAME[resolveLocale(locale)];
  const searchSystemPrompt = buildSearchSystemPrompt(language);

  let vehicleContext = "";
  if (vehicleId) {
    const { data: vehicle } = await supabase
      .from("vehicles")
      .select("type, make, model, engine_code, year")
      .eq("id", vehicleId)
      .maybeSingle();

    if (vehicle) {
      vehicleContext = `Veicolo di riferimento: ${vehicle.type === "moto" ? "moto" : "auto"} ${vehicle.make} ${vehicle.model}${
        vehicle.year ? ` (${vehicle.year})` : ""
      }${vehicle.engine_code ? `, motorizzazione ${vehicle.engine_code}` : ""}.`;
    }
  }

  const userContent = `${vehicleContext}\nRicerca: ${query}`.trim();

  try {
    let payload: SearchPayload | null = null;
    let summary = "";
    let stopReason: string | undefined;
    let anthropicThrew = false;

    try {
      const first = await callAnthropicSearch(userContent, searchSystemPrompt);
      payload = first.payload;
      summary = first.summary;
      stopReason = first.stopReason;

      // Un solo retry automatico, piu' snello: copre il caso piu' comune di errore (risposta
      // troncata prima di chiamare submit_findings) senza far aspettare l'utente per un secondo
      // tentativo identico al primo.
      if (!payload) {
        console.warn(
          `Ricerca IA: nessun risultato strutturato al primo tentativo (stop_reason=${stopReason}), riprovo in modo piu' snello...`
        );
        const retry = await callAnthropicSearch(
          `${userContent}\n\n(Il tentativo precedente si e' interrotto prima di completare. Sii piu' conciso: ` +
            'massimo 5 risorse e specifiche solo per "motore", poi chiama SUBITO submit_findings.)',
          searchSystemPrompt
        );
        payload = retry.payload;
        summary = retry.summary;
        stopReason = retry.stopReason;
      }
    } catch (primaryErr) {
      anthropicThrew = true;
      console.error("Anthropic non disponibile per la ricerca:", primaryErr);
      if (!hasOpenAIFallback()) throw primaryErr;
    }

    // Fallback su OpenAI sia se Anthropic ha lanciato un errore, sia se ha risposto ma senza
    // produrre un risultato strutturato utilizzabile (prima non scattava in questo secondo caso).
    if (!payload && hasOpenAIFallback() && (anthropicThrew || stopReason !== undefined)) {
      console.warn("Uso il fallback OpenAI per la ricerca.");
      const fullText = await searchWithOpenAI(searchSystemPrompt, userContent);
      const openaiPayload = extractPayloadFromText(fullText);
      if (openaiPayload) {
        payload = openaiPayload;
        summary = fullText.replace(/```json[\s\S]*?```/, "").trim();
      }
    }

    if (!payload) {
      console.error(`Ricerca IA: nessun risultato utilizzabile dopo retry/fallback (stop_reason=${stopReason}).`);
      return NextResponse.json(
        {
          error: stopReason === "max_tokens" ? tErr("searchTruncated") : tErr("searchNoUsableResult"),
        },
        { status: 502 }
      );
    }

    const safePayload = sanitizePayload(payload);

    await supabase.from("search_results").insert({
      user_id: user.id,
      vehicle_id: vehicleId,
      query,
      results: safePayload,
    });

    // Il bollo e' una proprieta' del veicolo (non della singola ricerca): la persistiamo sulla
    // riga del veicolo cosi' resta visibile in testata senza dover riaprire l'ultima ricerca.
    if (vehicleId && safePayload.bollo) {
      await supabase.from("vehicles").update({ bollo_stimato: safePayload.bollo }).eq("id", vehicleId);
    }

    return NextResponse.json({
      query,
      risorse: safePayload.risorse,
      specifiche: safePayload.specifiche,
      bollo: safePayload.bollo,
      summary: summary.slice(0, 2000),
    });
  } catch (err) {
    console.error("Errore ricerca IA:", err);
    return NextResponse.json({ error: tErr("searchError") }, { status: 500 });
  }
}
