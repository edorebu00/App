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

export const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-sonnet-5";

/**
 * I contatori di cache sono l'unica prova che il caching stia davvero funzionando: una modifica
 * al modo in cui si compone il prompt può azzerarlo senza che nulla fallisca — le richieste
 * continuano a funzionare, cambia solo il conto. Vanno riletti dopo ogni modifica al prompt.
 * In una chat a regime `read` deve dominare `fresh`, e `write` deve valere più o meno un turno.
 */
export function logTokenUsage(
  label: string,
  usage: {
    input_tokens?: number | null;
    output_tokens?: number | null;
    cache_read_input_tokens?: number | null;
    cache_creation_input_tokens?: number | null;
  } | null | undefined
) {
  if (!usage) return;

  const read = usage.cache_read_input_tokens ?? 0;
  const write = usage.cache_creation_input_tokens ?? 0;
  const fresh = usage.input_tokens ?? 0;
  const total = read + write + fresh;
  const hitRate = total ? Math.round((read / total) * 100) : 0;

  console.info(
    `[token] ${label}: input=${total} (cache read ${read}, write ${write}, nuovi ${fresh}, ` +
      `riuso ${hitRate}%), output=${usage.output_tokens ?? 0}`
  );
}
