import type Anthropic from "@anthropic-ai/sdk";

/**
 * Soglia prudenziale, in caratteri, oltre la quale vale la pena mettere un punto di cache.
 * La API ignora in silenzio un blocco troppo corto (il minimo di Claude Sonnet 5 è 1024 token,
 * più basso su Opus 5, più alto su Haiku), senza errori e senza addebiti: sotto questa soglia
 * il marcatore sarebbe solo rumore nel codice. ~4 caratteri per token, con margine.
 */
export const MIN_CACHEABLE_CHARS = 6000;

/**
 * Compone il prompt di sistema della chat in due blocchi, nell'ordine imposto dalla cache.
 *
 * La cache confronta il prefisso byte per byte: quello che non cambia va davanti, quello che
 * può cambiare va in coda. Qui davanti stanno istruzioni e documenti — stabili per tutta la
 * conversazione e responsabili della quasi totalità dei token — e in coda la lingua, che
 * l'utente può cambiare in qualsiasi momento. Con l'ordine inverso, un cambio di lingua
 * butterebbe via dalla cache l'intero manuale.
 */
export function buildChatSystemBlocks(context: string, language: string): Anthropic.TextBlockParam[] {
  const stable = context
    ? "Sei l'assistente di My Vehicle: rispondi alle domande dell'utente sul proprio veicolo basandoti " +
      "principalmente sui documenti caricati (libretti, manuali di manutenzione, ecc.) riportati sotto. " +
      "Se l'informazione richiesta non è presente nei documenti, dillo chiaramente e poi puoi rispondere " +
      "con la tua conoscenza generale, specificando che non proviene dai documenti caricati.\n\n" +
      `DOCUMENTI DISPONIBILI:${context}`
    : "Sei l'assistente di My Vehicle. L'utente non ha ancora caricato documenti per questo veicolo: " +
      "rispondi con la tua conoscenza generale su auto e moto, e suggerisci di caricare il libretto " +
      "d'uso e manutenzione per risposte più precise.";

  const languageBlock = `Rispondi SEMPRE in ${language}, in modo chiaro e pratico, indipendentemente dalla lingua dei documenti.`;

  return [
    {
      type: "text",
      text: stable,
      // Il punto di cache si mette solo se c'è abbastanza testo da giustificarlo: sotto il
      // minimo del modello la API lo ignora in silenzio (vedi MIN_CACHEABLE_CHARS).
      //
      // TTL di un'ora e non i 5 minuti predefiniti. Questa è una chat fra persone, non un ciclo
      // automatico: si legge la risposta, si va a guardare l'auto, si torna dopo dieci minuti.
      // Con 5 minuti la voce scade quasi sempre fra un messaggio e l'altro, e ogni messaggio
      // ripaga la scrittura al 125% — cioè costa PIÙ che senza cache. Con un'ora si paga il
      // 200% una volta sola e poi il 10% per messaggio.
      ...(stable.length >= MIN_CACHEABLE_CHARS
        ? { cache_control: { type: "ephemeral" as const, ttl: "1h" as const } }
        : {}),
    },
    { type: "text", text: languageBlock },
  ];
}

/** Il prompt unito, per il fallback OpenAI che non conosce i blocchi. */
export function flattenSystemBlocks(blocks: Anthropic.TextBlockParam[]) {
  return blocks.map((b) => b.text).join("\n\n");
}
