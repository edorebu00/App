import "server-only";
import { unstable_cache } from "next/cache";
import type Anthropic from "@anthropic-ai/sdk";
import { getAnthropicClient, CLAUDE_MODEL, EFFORT, logTokenUsage } from "./anthropic";
import { safeExternalUrl } from "./safeUrl";
import { clampText } from "./validation";
import { LOCALE_LANGUAGE_NAME, type Locale } from "@/i18n/locales";

/**
 * Notizie motorsport e prossime gare per la home page.
 *
 * I dati arrivano dall'agente IA con ricerca web, non da un elenco scritto a mano: un calendario
 * gare incollato nel codice sarebbe sbagliato entro poche settimane, e le date inventate sono
 * peggio di nessuna data. Il risultato e' messo in cache lato server per 24 ore e condiviso da
 * tutti i visitatori, quindi il costo e' di una chiamata al giorno per lingua effettivamente
 * visitata, non di una per visita.
 */

export interface MotorsportNews {
  titolo: string;
  fonte: string;
  url: string;
  sintesi: string;
}

export interface MotorsportRace {
  campionato: string;
  gara: string;
  circuito: string;
  data: string;
  urlBiglietti?: string;
}

export interface MotorsportBriefing {
  news: MotorsportNews[];
  races: MotorsportRace[];
}

const EMPTY: MotorsportBriefing = { news: [], races: [] };

const MAX_NEWS = 4;
const MAX_RACES = 6;
const MAX_TEXT_CHARS = 300;
/** Una chiamata al giorno per lingua: e' il compromesso fra freschezza e costo a consumo. */
const CACHE_SECONDS = 86_400;
/** Oltre questo tempo si rinuncia: la home non deve restare appesa a una ricerca lenta. */
const REQUEST_TIMEOUT_MS = 60_000;
/**
 * Due ricerche, non quattro: una per le notizie e una per i calendari, che e' esattamente quello
 * che chiede il prompt. Ogni risultato in piu' non si paga solo come ricerca — resta nel contesto
 * e viene rispedito a ogni giro successivo del ciclo, quindi la quarta ricerca la si paga una
 * volta come ricerca e poi ancora a ogni turno come contesto.
 */
const MAX_WEB_SEARCHES = 2;

const SUBMIT_BRIEFING_TOOL: Anthropic.Tool = {
  name: "submit_briefing",
  description:
    "Invia il risultato finale. Chiamalo come ULTIMO passo, una sola volta, dopo le ricerche web: " +
    "non scrivere il risultato come testo, usa sempre e solo questo strumento.",
  input_schema: {
    type: "object",
    properties: {
      news: {
        type: "array",
        maxItems: MAX_NEWS,
        description:
          `Al massimo ${MAX_NEWS} notizie di motorsport recenti e rilevanti (Formula 1, MotoGP, WEC, ` +
          "rally, Formula E). Solo notizie realmente trovate con la ricerca web, con l'URL dell'articolo " +
          "originale. Mai inventare un titolo o un indirizzo: meglio restituire meno notizie.",
        items: {
          type: "object",
          properties: {
            titolo: { type: "string", description: "Titolo della notizia, riscritto in modo sintetico." },
            fonte: { type: "string", description: "Nome della testata, es. 'Autosport', 'Motorsport.com'." },
            url: { type: "string", description: "URL dell'articolo, esattamente come trovato." },
            sintesi: { type: "string", description: "Una frase sola, massimo 25 parole." },
          },
          required: ["titolo", "fonte", "url", "sintesi"],
        },
      },
      races: {
        type: "array",
        maxItems: MAX_RACES,
        description:
          `Al massimo ${MAX_RACES} gare in programma DOPO la data odierna indicata nel messaggio, in ordine ` +
          "cronologico, dai principali campionati (Formula 1, MotoGP, WEC, Formula E). Solo gare confermate " +
          "dai calendari ufficiali trovati con la ricerca: se non riesci a confermare una data, ometti la gara.",
        items: {
          type: "object",
          properties: {
            campionato: { type: "string", description: "Es. 'Formula 1', 'MotoGP', 'WEC'." },
            gara: { type: "string", description: "Nome del Gran Premio o della gara." },
            circuito: { type: "string", description: "Nome del circuito e paese." },
            data: {
              type: "string",
              description:
                "Data o intervallo di date come riportato dal calendario ufficiale, nella lingua richiesta " +
                "(es. '5-7 settembre 2026'). Mai una data ricostruita a memoria.",
            },
            urlBiglietti: {
              type: "string",
              description:
                "URL della pagina biglietti ufficiale della gara o del circuito, se trovata con la ricerca. " +
                "Ometti il campo se non l'hai trovata: non costruire l'indirizzo a mano.",
            },
          },
          required: ["campionato", "gara", "circuito", "data"],
        },
      },
    },
    required: ["news", "races"],
  },
};

function buildSystemPrompt(language: string, today: string) {
  return (
    "Sei il redattore motorsport di My Vehicle. Prepari il riquadro della home page con le notizie del " +
    "momento e le prossime gare.\n\n" +
    `OGGI E' IL ${today}. "Prossime gare" significa gare che si corrono DOPO questa data: non elencare gare ` +
    "gia' disputate.\n\n" +
    `BUDGET: hai ${MAX_WEB_SEARCHES} ricerche web in tutto (una per le notizie, una per i calendari), poi ` +
    "chiama subito submit_briefing.\n\n" +
    "REGOLA NON NEGOZIABILE: ogni titolo, data e indirizzo deve venire da una pagina realmente trovata con " +
    "la ricerca web. Non ricostruire calendari o date a memoria e non costruire URL a mano: se un dato non " +
    "lo hai trovato, ometti la voce. Un riquadro con tre gare vere e' migliore di uno con sei gare di cui " +
    "due sbagliate.\n\n" +
    `LINGUA: scrivi titoli, sintesi e date in ${language}.`
  );
}

function extractBriefing(content: Anthropic.ContentBlock[]): MotorsportBriefing {
  const toolUse = [...content]
    .reverse()
    .find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === "submit_briefing");

  if (!toolUse || typeof toolUse.input !== "object" || toolUse.input === null) return EMPTY;
  const input = toolUse.input as Record<string, unknown>;

  const news: MotorsportNews[] = [];
  for (const raw of Array.isArray(input.news) ? input.news : []) {
    const item = raw as Record<string, unknown>;
    // Gli URL arrivano dal modello: fuori da http/https non diventano link cliccabili.
    const url = safeExternalUrl(item?.url);
    const titolo = clampText(item?.titolo, MAX_TEXT_CHARS);
    if (!url || !titolo) continue;
    news.push({
      titolo,
      fonte: clampText(item?.fonte, 80) || "",
      url,
      sintesi: clampText(item?.sintesi, MAX_TEXT_CHARS) || "",
    });
    if (news.length >= MAX_NEWS) break;
  }

  const races: MotorsportRace[] = [];
  for (const raw of Array.isArray(input.races) ? input.races : []) {
    const item = raw as Record<string, unknown>;
    const gara = clampText(item?.gara, MAX_TEXT_CHARS);
    const data = clampText(item?.data, 80);
    if (!gara || !data) continue;
    races.push({
      campionato: clampText(item?.campionato, 60) || "",
      gara,
      circuito: clampText(item?.circuito, 120) || "",
      data,
      urlBiglietti: safeExternalUrl(item?.urlBiglietti) || undefined,
    });
    if (races.length >= MAX_RACES) break;
  }

  return { news, races };
}

async function fetchBriefing(locale: Locale): Promise<MotorsportBriefing> {
  const language = LOCALE_LANGUAGE_NAME[locale];
  const today = new Date().toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });

  try {
    const anthropic = getAnthropicClient();
    const message = await anthropic.messages.create(
      {
        model: CLAUDE_MODEL,
        // Tetto su ragionamento PIU' risposta: se il ragionamento se lo mangia, il riquadro
        // sparisce dalla home senza un errore. Il margine inutilizzato non si paga.
        max_tokens: 8000,
        // Vedi EFFORT: leggere risultati di ricerca e riempire uno schema non ha bisogno del
        // livello `high` che si otteneva non dichiarando nulla.
        output_config: { effort: EFFORT.motorsport },
        // Blocco unico con punto di cache. L'ordine di resa e' `tools` -> `system` -> `messages`,
        // quindi il marcatore sull'ultimo blocco di sistema mette in cache anche lo schema di
        // submit_briefing. Ma la ragione principale e' un'altra: quando una richiesta usa gia' il
        // caching, lo strumento di ricerca web aggiunge da se' un punto di cache dopo ogni blocco
        // di risultati. Senza un `cache_control` esplicito quell'aggiunta non avviene e il ciclo
        // si rispedisce tutti i risultati raccolti a prezzo pieno a ogni giro.
        // TTL predefinito: i giri del ciclo distano secondi, un'ora costerebbe il doppio in
        // scrittura per una voce che nessuno rileggera' (la chiamata e' una al giorno).
        system: [
          {
            type: "text",
            text: buildSystemPrompt(language, today),
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          {
            role: "user",
            content:
              "Prepara il riquadro motorsport della home page: le notizie piu' rilevanti di questi giorni e " +
              "le prossime gare in calendario con i link ai biglietti.",
          },
        ],
        tools: [{ type: "web_search_20260209", name: "web_search", max_uses: MAX_WEB_SEARCHES }, SUBMIT_BRIEFING_TOOL],
      },
      { timeout: REQUEST_TIMEOUT_MS }
    );

    logTokenUsage(`home motorsport (${locale})`, message.usage);
    return extractBriefing(message.content);
  } catch (err) {
    // La home deve restare in piedi anche senza: la sezione semplicemente non compare.
    console.error("Riquadro motorsport non disponibile:", err);
    return EMPTY;
  }
}

/**
 * Versione in cache. La chiave comprende la lingua, così ogni lingua ha il suo riquadro ma solo
 * quelle effettivamente visitate vengono generate.
 */
export function getMotorsportBriefing(locale: Locale): Promise<MotorsportBriefing> {
  return unstable_cache(() => fetchBriefing(locale), ["motorsport-briefing", locale], {
    revalidate: CACHE_SECONDS,
    tags: ["motorsport-briefing"],
  })();
}
