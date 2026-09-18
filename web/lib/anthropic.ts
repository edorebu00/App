import "server-only";
import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient() {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY deve essere impostata.");
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

/**
 * ATTENZIONE cambiando questa variabile d'ambiente: i percorsi IA passano `output_config.effort`,
 * che non tutti i modelli accettano (i modelli piu' vecchi rispondono 400). Sostituendo il
 * modello con uno che non lo supporta va tolto anche `output_config` dalle tre chiamate.
 */
export const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5";

/**
 * Livello di "sforzo" per ciascun percorso IA.
 *
 * Non impostarlo NON vuol dire "nessun ragionamento": su Claude Sonnet 5 il ragionamento
 * adattivo è acceso di default e `effort` vale `high` quando non lo si dichiara. I token di
 * ragionamento sono token di output a tutti gli effetti — si pagano alla tariffa di output,
 * la più cara — e non compaiono nella risposta, quindi finora si pagavano senza vederli.
 * Peggio: `max_tokens` è un tetto su ragionamento PIÙ risposta, per cui un tetto stretto con
 * `high` produce una risposta troncata dopo aver pagato il ragionamento per intero.
 *
 * I tre percorsi qui sotto sono tutti "ricerca e sintesi": è la forma di lavoro su cui la
 * curva sforzo/qualità è più piatta (a `medium` la qualità resta quella del default a circa
 * il 70-85% del costo). Da qui la scelta, un livello per percorso e non uno globale:
 *
 * - `chat`: domande sui documenti del proprio veicolo. È il caso che la documentazione indica
 *   esplicitamente per `low` (chat e consultazioni semplici): si cerca nel manuale e si
 *   spiega, non si risolve un problema a più passi.
 * - `search`: qui un passo di ragionamento c'è davvero — decidere quali ricerche fare, capire
 *   quale motorizzazione corrisponde al veicolo, ricavare la stima del bollo dai CV fiscali e
 *   dalla classe Euro. `medium` è il gradino sotto il default, non il fondo della scala.
 * - `motorsport`: leggere i risultati di ricerca e riempire uno schema. Estrazione pura.
 *
 * Il valore è fisso per percorso e non cambia da una richiesta all'altra: cambiarlo a metà
 * invaliderebbe la cache dei prompt.
 */
export const EFFORT = {
  chat: "low",
  search: "medium",
  motorsport: "low",
} as const satisfies Record<string, Anthropic.OutputConfig["effort"]>;

/**
 * Tariffe di Claude Sonnet 5, in dollari per milione di token, piu' il prezzo della ricerca web.
 *
 * Servono solo a stampare una stima accanto ai token: nessuna decisione del codice dipende da
 * questi numeri. Sono comunque da ricontrollare sulla pagina dei prezzi ogni tanto — un listino
 * cambia, e una stima sbagliata e' peggio di nessuna stima. I moltiplicatori della cache invece
 * sono strutturali: lettura un decimo dell'ingresso, scrittura 1,25 volte a 5 minuti e 2 volte
 * a un'ora.
 */
const PRICE = {
  input: 2 / 1_000_000,
  output: 10 / 1_000_000,
  cacheRead: 0.1 * (2 / 1_000_000),
  cacheWrite5m: 1.25 * (2 / 1_000_000),
  cacheWrite1h: 2 * (2 / 1_000_000),
  webSearch: 10 / 1000,
};

/**
 * I contatori di cache sono l'unica prova che il caching stia davvero funzionando: una modifica
 * al modo in cui si compone il prompt può azzerarlo senza che nulla fallisca — le richieste
 * continuano a funzionare, cambia solo il conto. Vanno riletti dopo ogni modifica al prompt.
 * In una chat a regime `read` deve dominare `fresh`, e `write` deve valere più o meno un turno.
 */
export function logTokenUsage(label: string, usage: Anthropic.Usage | null | undefined) {
  if (!usage) return;

  const read = usage.cache_read_input_tokens ?? 0;
  const write = usage.cache_creation_input_tokens ?? 0;
  const fresh = usage.input_tokens ?? 0;
  const total = read + write + fresh;
  const hitRate = total ? Math.round((read / total) * 100) : 0;

  const output = usage.output_tokens ?? 0;
  // I token di ragionamento sono già dentro `output_tokens` e si pagano alla stessa tariffa:
  // il dettaglio serve solo a vedere quanta parte del conto se ne va in ragionamento invece
  // che in risposta. È il numero da guardare dopo aver cambiato il livello di sforzo.
  const thinking = usage.output_tokens_details?.thinking_tokens ?? 0;
  const searches = usage.server_tool_use?.web_search_requests ?? 0;

  // Le scritture in cache costano diversamente a seconda della durata, e la API le separa: usare
  // il totale indistinto darebbe una stima sbagliata proprio dove si e' scelta la durata.
  const write1h = usage.cache_creation?.ephemeral_1h_input_tokens ?? 0;
  const write5m = usage.cache_creation?.ephemeral_5m_input_tokens ?? write - write1h;

  const cost =
    read * PRICE.cacheRead +
    write5m * PRICE.cacheWrite5m +
    write1h * PRICE.cacheWrite1h +
    fresh * PRICE.input +
    output * PRICE.output +
    searches * PRICE.webSearch;

  console.info(
    `[token] ${label}: input=${total} (cache read ${read}, write ${write}, nuovi ${fresh}, ` +
      `riuso ${hitRate}%), output=${output} (di cui ragionamento ${thinking})` +
      (searches ? `, ricerche web ${searches}` : "") +
      `, stima ${cost.toFixed(4)} $`
  );
}
