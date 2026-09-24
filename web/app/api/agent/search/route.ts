import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";
import type Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { getAnthropicClient, CLAUDE_MODEL, EFFORT, logTokenUsage } from "@/lib/anthropic";
import { getOpenAIClient, hasOpenAIFallback, OPENAI_SEARCH_MODEL } from "@/lib/openai";
import { LOCALE_LANGUAGE_NAME, resolveLocale, type Locale } from "@/i18n/locales";
import { checkRateLimit, checkSharedRateLimit, rateWindowStart } from "@/lib/rateLimit";
import { clampText, isUuid } from "@/lib/validation";
import { MAX_RISORSE, sanitizePayload } from "@/lib/searchPayload";
import { RESOURCE_CATEGORIES, type SearchPayload } from "@/lib/types";

// La ricerca fa alcune chiamate allo strumento web_search piu' l'eventuale retry: teniamo un
// margine oltre alla durata attesa (~20-50s per tentativo), il piano Hobby di Vercel supporta
// funzioni fino a 300s.
export const maxDuration = 180;

// Timeout per ogni chiamata ai modelli, senza ritentativi automatici dell'SDK: nel caso peggiore
// (primo tentativo Anthropic + ritentativo + ripiego OpenAI) 65 + 45 + 50 = 160 s < 180 s, cosi'
// il ritentativo e il ripiego hanno sempre il tempo di partire prima di maxDuration.
const ANTHROPIC_SEARCH_TIMEOUT_MS = 65_000;
const ANTHROPIC_RETRY_TIMEOUT_MS = 45_000;
const OPENAI_SEARCH_TIMEOUT_MS = 50_000;

/** La query finisce nel prompt: un tetto evita richieste enormi (e costose) verso i modelli. */
const MAX_QUERY_CHARS = 200;
/** Ogni ricerca costa piu' chiamate al modello con web search: massimo 10 ogni 5 minuti per utente. */
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 5 * 60 * 1000;
/**
 * Numero di ricerche web concesse al modello: al primo tentativo e al ritentativo.
 *
 * Non è solo il prezzo della singola ricerca web: ogni risultato resta nel contesto e viene
 * rispedito a ogni giro successivo del ciclo, quindi la quarta ricerca si paga una volta come
 * ricerca e poi ancora a ogni turno come contesto. Tre ricerche mirate coprono le due priorità
 * (catalogo ricambi e piano di manutenzione) più una libera, che è quello che il prompt chiede.
 */
const MAX_WEB_SEARCHES = 3;
/** Il ritentativo serve a chiudere, non a rifare la ricerca: una sola verifica e via. */
const MAX_WEB_SEARCHES_RETRY = 1;
/**
 * Per quanto tempo una ricerca identica (stesso utente, stesso veicolo, stessa query) viene
 * riproposta dalla cronologia invece di rieseguirla. Le risorse online su un modello di
 * qualche anno fa non cambiano da un giorno all'altro, mentre rieseguirla costa ogni volta
 * l'intero giro di ricerche web.
 */
const REUSE_WINDOW_DAYS = 7;

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
              enum: [...RESOURCE_CATEGORIES],
            },
            sezione: {
              type: "string",
              description:
                "La sezione più specifica possibile. Usa 'generale' SOLO se la risorsa non è riconducibile " +
                "a nessuna delle altre (es. un forum generico sul marchio).",
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
          "Specifiche tecniche per sezione. 'motore' è OBBLIGATORIO con 3-6 voci, ricavate dalla ricerca web " +
          "e dalla tua conoscenza del modello (se un dato non è certo al 100% va bene il valore tipico di " +
          "quella motorizzazione). Le altre sezioni sono un bonus: compilale solo se hai già i dati sotto " +
          "mano, mai facendo ricerche aggiuntive — meglio ometterle che ritardare la chiamata. Per un " +
          "veicolo raro non inventare numeri: ometti la singola voce.",
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
          "'circa 150-180 €/anno (14 CV fiscali, Euro 5) — varia per regione'. Ricavala SENZA ricerche web " +
          "dedicate, dai CV fiscali/kW e dalla classe Euro già emersi per 'motore': formula ACI per le auto, " +
          "fascia di cilindrata per le moto (sotto i 150 cc di norma non è dovuto). Indica sempre un " +
          "intervallo, i CV fiscali/kW e la classe Euro usati, e ricorda che varia per regione (in Valle " +
          "d'Aosta e nelle Province di Trento e Bolzano non si paga). Ometti il campo del tutto se non " +
          "riesci a stimare nemmeno la fascia (mai inventare un numero a caso).",
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
 * Prompt di sistema come blocco unico con punto di cache.
 *
 * Il punto di cache qui vale molto più di quanto sembri. L'ordine con cui la richiesta viene
 * resa è `tools` -> `system` -> `messages`, quindi il marcatore sull'ultimo blocco di sistema
 * mette in cache anche lo schema di submit_findings, che da solo è la parte più grossa del
 * prefisso fisso. Ma soprattutto: quando una richiesta usa già il caching, lo strumento di
 * ricerca web aggiunge da sé un punto di cache dopo ogni blocco di risultati. È lì che sta il
 * risparmio vero — una ricerca è un ciclo, e a ogni giro il modello si rispedisce TUTTI i
 * risultati raccolti fino a quel momento: senza cache il costo cresce col quadrato del numero
 * di giri, con la cache i giri precedenti si rileggono a un decimo del prezzo.
 *
 * Senza un `cache_control` esplicito da qualche parte quell'aggiunta automatica non avviene, e
 * il ciclo si paga tutto a prezzo pieno. È il motivo per cui questo marcatore non si toglie.
 *
 * TTL predefinito (5 minuti) e non un'ora: qui non si aspetta una persona, i giri del ciclo
 * distano secondi l'uno dall'altro e la scrittura costa il 125% invece del 200%.
 */
function buildSearchSystemBlocks(language: string): Anthropic.TextBlockParam[] {
  return [
    {
      type: "text",
      text: buildSearchSystemPrompt(language),
      cache_control: { type: "ephemeral" },
    },
  ];
}

function buildSearchSystemPrompt(language: string) {
  // Le regole sui singoli campi (sezione, specifiche, bollo) stanno nelle descrizioni dello
  // schema di submit_findings, che viene comunque inviato a ogni richiesta: ripeterle qui
  // significherebbe pagarle due volte. Qui resta solo quello che lo schema non può dire —
  // l'obiettivo, il budget di ricerche e la strategia.
  return (
    "Sei l'assistente tecnico di My Vehicle. Quando un utente aggiunge un veicolo riempi le sue schede " +
    "(Motore, Carrozzeria, Assetto, Impianto frenante, Trasmissione, Elettronica) con informazioni utili, " +
    "così le trova già pronte senza compilare nulla a mano.\n\n" +
    `BUDGET: l'utente è in attesa. Hai ${MAX_WEB_SEARCHES} ricerche web in tutto: usale mirate, senza ripeterne di simili, poi ` +
    "chiama subito submit_findings. Completare la risposta conta più della completezza assoluta.\n\n" +
    "COSA CERCARE: forum dedicati, manuali e PDF di manutenzione, video YouTube (tutorial, riparazioni, " +
    "revisioni), schemi tecnici e viste esplose, cataloghi e negozi di ricambi pertinenti al modello e " +
    "alla motorizzazione indicati.\n\n" +
    "DUE RICERCHE PRIORITARIE, salvo veicolo troppo generico o raro:\n" +
    "1) il catalogo ricambi AUTODOC per questo esatto modello e motorizzazione. In Italia il dominio è " +
    "auto-doc.it, CON il trattino (autodoc.it senza trattino è un'altra azienda); altrove è " +
    "autodoc.<paese>, es. autodoc.co.uk, autodoc.de. Se non trovi la pagina del modello esatto usa la " +
    "ricerca generica di AutoDoc per quella marca/modello invece di ometterla. Categoria: catalogo_ricambi.\n" +
    "2) il piano di manutenzione ufficiale del costruttore (intervalli, cosa fare a quali km/anni), utile " +
    "a chi vuole fare da sé i tagliandi. Categoria: piano_manutenzione.\n\n" +
    `LINGUA: rispondi SEMPRE in ${language}, sia il riepilogo sia i valori testuali dentro lo strumento.`
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
  }, { timeout: OPENAI_SEARCH_TIMEOUT_MS, maxRetries: 0 });
  return response.output_text || "";
}

/** Un tentativo di ricerca con Anthropic: ricerca web + output strutturato via submit_findings. */
async function callAnthropicSearch(
  userContent: string,
  systemBlocks: Anthropic.TextBlockParam[],
  maxSearches: number,
  timeoutMs: number
) {
  const anthropic = getAnthropicClient();
  const message = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 8000,
    // Vedi EFFORT: senza questa riga il modello girava a `high`, il default. Il ragionamento
    // si paga a tariffa di output e rientra nel tetto di max_tokens, quindi era anche la causa
    // piu' probabile delle risposte troncate prima di submit_findings — quelle che fanno
    // scattare il ritentativo, cioe' una seconda ricerca intera da pagare.
    output_config: { effort: EFFORT.search },
    system: systemBlocks,
    messages: [{ role: "user", content: userContent }],
    tools: [
      {
        // Variante con filtraggio dinamico dei risultati: scarta da sé la impaginazione delle
        // pagine trovate invece di riversarla nel contesto, dove verrebbe poi rispedita a ogni
        // iterazione del giro di ricerche. È la parte più pesante di una ricerca.
        type: "web_search_20260209",
        name: "web_search",
        max_uses: maxSearches,
      },
      SUBMIT_FINDINGS_TOOL,
    ],
  }, { timeout: timeoutMs, maxRetries: 0 });

  logTokenUsage(`ricerca (max ${maxSearches} web search)`, message.usage);

  const found = extractFindingsFromToolUse(message.content);
  return {
    payload: found?.payload ?? null,
    summary: found?.summary ?? "",
    stopReason: message.stop_reason ?? undefined,
  };
}

/**
 * Cerca in `search_results` una ricerca identica e recente dello stesso utente. Le policy RLS
 * limitano già la tabella alle proprie righe: nessun risultato viene condiviso fra utenti, il che
 * evita anche che qualcuno possa avvelenare la cache di qualcun altro.
 */
async function findReusableSearch(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  vehicleId: string | null,
  query: string,
  locale: Locale
): Promise<SearchPayload | null> {
  const since = new Date(Date.now() - REUSE_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();

  let q = supabase
    .from("search_results")
    .select("results")
    .eq("user_id", userId)
    .eq("query", query)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1);

  q = vehicleId ? q.eq("vehicle_id", vehicleId) : q.is("vehicle_id", null);

  const { data } = await q.maybeSingle();
  const results = data?.results;

  // Le righe salvate prima di questa versione hanno una forma diversa (un semplice array di
  // risorse, senza specifiche né riepilogo): non sono riutilizzabili, si rifà la ricerca.
  if (!results || Array.isArray(results) || typeof results !== "object") return null;
  // La riga e' scrivibile dal browser: se `risorse` non e' un array la si scarta invece di far
  // lanciare un'eccezione a sanitizePayload (che qui sta fuori dal try della route).
  if (!Array.isArray((results as { risorse?: unknown }).risorse)) return null;

  // I testi salvati sono nella lingua in cui il modello li ha scritti: riproporli a chi sta
  // usando un'altra lingua sarebbe un risparmio pagato dall'utente. Le righe più vecchie non
  // hanno il campo e per prudenza non vengono riusate.
  if (results.locale !== locale) return null;

  // La riga viene risanificata anche in lettura, non solo in scrittura: `search_results` è una
  // tabella che il browser può scrivere direttamente (la RLS controlla di chi è la riga, non
  // cosa contiene), quindi il suo contenuto non è più affidabile di quello che arriva dal
  // modello. Se dopo la pulizia non resta nulla di valido, si rifà la ricerca.
  const sanitized = sanitizePayload(results as SearchPayload);
  return sanitized.risorse.length ? sanitized : null;
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

  const resolvedLocale = resolveLocale(locale);
  const language = LOCALE_LANGUAGE_NAME[resolvedLocale];

  // Ricerca identica già fatta di recente: si ripropone il risultato salvato. Il controllo sta
  // prima del limite di frequenza perché una risposta che arriva dal database non costa nulla
  // al modello e non ha senso che consumi quota.
  const reused = await findReusableSearch(supabase, user.id, vehicleId, query, resolvedLocale);
  if (reused) {
    // La query non finisce nel log: è testo dell'utente, e con un a capo si falsificherebbero
    // righe di log. Per il conteggio dei token basta sapere che la chiamata non c'è stata.
    console.info("[token] ricerca: riuso di un risultato salvato, nessuna chiamata al modello.");
    return NextResponse.json({
      query,
      risorse: reused.risorse,
      specifiche: reused.specifiche,
      bollo: reused.bollo,
      summary: reused.summary ?? "",
    });
  }

  const limit = checkRateLimit(`search:${user.id}`, RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: tErr("rateLimited") },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  // Il controllo qui sopra vale solo per l'istanza che serve la richiesta. Ogni ricerca eseguita
  // lascia gia' una riga in `search_results`: contarle e' un limite comune a tutte le istanze.
  const { count: recentSearches } = await supabase
    .from("search_results")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", rateWindowStart(RATE_WINDOW_MS));

  const sharedLimit = checkSharedRateLimit(recentSearches ?? null, RATE_LIMIT, RATE_WINDOW_MS);
  if (!sharedLimit.allowed) {
    return NextResponse.json(
      { error: tErr("rateLimited") },
      { status: 429, headers: { "Retry-After": String(sharedLimit.retryAfterSeconds) } }
    );
  }

  const searchSystemPrompt = buildSearchSystemPrompt(language);
  const searchSystemBlocks = buildSearchSystemBlocks(language);

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
      const first = await callAnthropicSearch(
        userContent,
        searchSystemBlocks,
        MAX_WEB_SEARCHES,
        ANTHROPIC_SEARCH_TIMEOUT_MS
      );
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
        // Il ritentativo serve a chiudere, non a ricominciare da capo: meno ricerche web, che
        // sono il grosso del costo, e istruzioni per andare dritto allo strumento.
        const retry = await callAnthropicSearch(
          `${userContent}\n\n(Il tentativo precedente si e' interrotto prima di completare. Sii piu' conciso: ` +
            'massimo 5 risorse e specifiche solo per "motore", poi chiama SUBITO submit_findings.)',
          searchSystemBlocks,
          MAX_WEB_SEARCHES_RETRY,
          ANTHROPIC_RETRY_TIMEOUT_MS
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

    const safePayload = sanitizePayload({ ...payload, summary, locale: resolvedLocale });

    const { error: saveError } = await supabase.from("search_results").insert({
      user_id: user.id,
      vehicle_id: vehicleId,
      query,
      results: safePayload,
    });
    if (saveError) console.error("Ricerca IA: salvataggio del risultato non riuscito:", saveError);

    // Il bollo e' una proprieta' del veicolo (non della singola ricerca): la persistiamo sulla
    // riga del veicolo cosi' resta visibile in testata senza dover riaprire l'ultima ricerca.
    if (vehicleId && safePayload.bollo) {
      const { error: bolloError } = await supabase
        .from("vehicles")
        .update({ bollo_stimato: safePayload.bollo })
        .eq("id", vehicleId);
      if (bolloError) console.error("Ricerca IA: salvataggio del bollo non riuscito:", bolloError);
    }

    return NextResponse.json({
      query,
      risorse: safePayload.risorse,
      specifiche: safePayload.specifiche,
      bollo: safePayload.bollo,
      summary: safePayload.summary ?? "",
    });
  } catch (err) {
    console.error("Errore ricerca IA:", err);
    return NextResponse.json({ error: tErr("searchError") }, { status: 500 });
  }
}
