import "server-only";
import { unstable_cache } from "next/cache";
import type Anthropic from "@anthropic-ai/sdk";
import { getAnthropicClient, CLAUDE_MODEL, EFFORT, logTokenUsage } from "./anthropic";
import { safeExternalUrl } from "./safeUrl";
import { clampText } from "./validation";
import { checkRateLimit, isRateLimited } from "./rateLimit";
import { LOCALE_LANGUAGE_NAME, type Locale } from "@/i18n/locales";

/**
 * Notizie motorsport per la home page.
 *
 * Solo le notizie passano dall'agente IA con ricerca web: un titolo scritto a mano sarebbe
 * vecchio in un giorno. Il calendario delle gare no — vedi `lib/motorsportCalendars.ts` — perché
 * per quello basta il link al sito ufficiale del campionato, sempre corretto e a costo zero,
 * mentre farlo verificare gara per gara a un modello (comprese le date e i link ai biglietti,
 * cioè i dati dove un errore costa di più) voleva dire una seconda ricerca web ad ogni
 * rigenerazione senza guadagnarci nulla che il link diretto non dia già.
 *
 * Il risultato è in cache lato server per 24 ore e condiviso da tutti i visitatori, quindi il
 * costo è di una chiamata al giorno per lingua effettivamente visitata, non di una per visita.
 */

export interface MotorsportNews {
  titolo: string;
  fonte: string;
  url: string;
  sintesi: string;
}

export interface MotorsportBriefing {
  news: MotorsportNews[];
}

const EMPTY: MotorsportBriefing = { news: [] };

const MAX_NEWS = 4;
const MAX_TEXT_CHARS = 300;
/** Una chiamata al giorno per lingua: e' il compromesso fra freschezza e costo a consumo. */
const CACHE_SECONDS = 86_400;
/** Oltre questo tempo si rinuncia (un solo tentativo): la home non deve restare appesa a una ricerca lenta. */
const REQUEST_TIMEOUT_MS = 60_000;
/** Una sola ricerca: solo le notizie passano dal modello, il calendario è un link statico. */
const MAX_WEB_SEARCHES = 1;
/**
 * Pausa dopo un tentativo non riuscito. Il caso riuscito lo tiene la cache, quello non riuscito no:
 * senza questa pausa, finché la generazione continua a non riuscire ogni singola visita alla home
 * ne avvierebbe una nuova, e la home è pubblica.
 */
const FAILURE_PAUSE_MS = 120_000;
/** Generazione in corso per lingua, condivisa dalle visite che arrivano nel frattempo. */
const inFlight = new Map<Locale, Promise<MotorsportBriefing>>();

const SUBMIT_BRIEFING_TOOL: Anthropic.Tool = {
  name: "submit_briefing",
  description:
    "Invia il risultato finale. Chiamalo come ULTIMO passo, una sola volta, dopo la ricerca web: " +
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
    },
    required: ["news"],
  },
};

function buildSystemPrompt(language: string) {
  return (
    "Sei il redattore motorsport di My Vehicle. Prepari il riquadro delle notizie del momento sulla home " +
    "page (il calendario delle gare non passa da te: è un link fisso al sito ufficiale di ogni campionato).\n\n" +
    `BUDGET: fai al massimo ${MAX_WEB_SEARCHES} ricerca web mirata, poi chiama subito submit_briefing.\n\n` +
    "REGOLA NON NEGOZIABILE: ogni titolo deve venire da una pagina realmente trovata con la ricerca web. " +
    "Se non trovi notizie affidabili, restituisci un elenco vuoto piuttosto che inventarne una.\n\n" +
    `LINGUA: scrivi titoli e sintesi in ${language}.`
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

  return { news };
}

async function fetchBriefing(locale: Locale): Promise<MotorsportBriefing> {
  const language = LOCALE_LANGUAGE_NAME[locale];

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
          text: buildSystemPrompt(language),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: "Prepara il riquadro notizie motorsport della home page: le più rilevanti di questi giorni.",
        },
      ],
      tools: [{ type: "web_search_20260209", name: "web_search", max_uses: MAX_WEB_SEARCHES }, SUBMIT_BRIEFING_TOOL],
    },
    // Nessun ritentativo automatico dell'SDK: ognuno ripeterebbe la ricerca web a consumo e
    // terrebbe le visite in attesa della generazione condivisa oltre REQUEST_TIMEOUT_MS.
    { timeout: REQUEST_TIMEOUT_MS, maxRetries: 0 }
  );

  logTokenUsage(`home motorsport (${locale})`, message.usage);
  return extractBriefing(message.content);
}

/**
 * Versione in cache. La chiave comprende la lingua, così ogni lingua ha il suo riquadro ma solo
 * quelle effettivamente visitate vengono generate.
 *
 * Il fallimento si gestisce qui, fuori dalla funzione memorizzata: per la cache un risultato vale
 * l'altro, quindi un `catch` la' dentro farebbe conservare l'elenco vuoto per le stesse 24 ore di
 * uno buono e un singolo timeout toglierebbe il riquadro dalla home per un giorno. Lasciando
 * uscire l'errore la voce non viene memorizzata e la richiesta successiva riprova — ma non subito:
 * fra un tentativo non riuscito e il successivo passa `FAILURE_PAUSE_MS`, altrimenti sarebbero i
 * visitatori a decidere quante generazioni a consumo avviare.
 */
export async function getMotorsportBriefing(locale: Locale): Promise<MotorsportBriefing> {
  const failureKey = `motorsport-failure:${locale}`;
  // Lettura che non lascia traccia: il percorso riuscito non deve consumare posizioni, altrimenti
  // la visita successiva vedrebbe il riquadro vuoto pur avendo un risultato buono in cache.
  if (isRateLimited(failureKey, 1)) return EMPTY;

  // `unstable_cache` non riunisce le richieste contemporanee: finche' una generazione e' in corso
  // le visite che arrivano la attendono invece di avviarne un'altra.
  const pending = inFlight.get(locale);
  if (pending) return pending;

  const promise = (async () => {
    try {
      return await unstable_cache(() => fetchBriefing(locale), ["motorsport-briefing", locale], {
        revalidate: CACHE_SECONDS,
        tags: ["motorsport-briefing"],
      })();
    } catch (err) {
      // La home deve restare in piedi anche senza: la sezione semplicemente non compare.
      console.error("Riquadro motorsport non disponibile:", err);
      checkRateLimit(failureKey, 1, FAILURE_PAUSE_MS);
      return EMPTY;
    }
  })();
  inFlight.set(locale, promise);
  // La voce si toglie dopo averla inserita: cosi' resta corretto anche se il blocco sopra si
  // conclude subito. La promessa non viene mai rifiutata (il `catch` restituisce `EMPTY`).
  void promise.finally(() => inFlight.delete(locale));
  return promise;
}
