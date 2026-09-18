/**
 * Controlli sulle proprietà da cui dipende il riuso della cache dei prompt.
 *
 * La cache dei prompt muore in silenzio: le richieste continuano a funzionare, cambia solo il
 * conto a fine mese. Basta un dettaglio a monte — documenti letti in ordine non deterministico,
 * una data nel prompt di sistema, la finestra della cronologia che scorre di un messaggio alla
 * volta — perché il prefisso non coincida più e non venga mai riletto. Questi controlli
 * verificano che il prompt resti identico byte per byte fra un turno e l'altro.
 *
 *     npm run check:cache
 *
 * Da rieseguire dopo ogni modifica al modo in cui si compone un prompt.
 */
import { readFileSync } from "node:fs";
import { buildChatSystemBlocks } from "../lib/chatPrompt.ts";
import { historyWindow } from "../lib/chatHistory.ts";
import { normalizeExtractedPages } from "../lib/extractedText.ts";

let failed = 0;
function check(condition: boolean, message: string) {
  if (condition) {
    console.log(`  ok   ${message}`);
  } else {
    failed++;
    console.log(`  FAIL ${message}`);
  }
}

const HISTORY_LIMIT = 20;
const HISTORY_BLOCK = 6;

console.log("\nPrompt di sistema della chat");
const manual = "\n\n--- Documento: libretto.pdf ---\n" + "Contenuto tecnico del manuale. ".repeat(3000);
const turn1 = buildChatSystemBlocks(manual, "Italian");
const turn2 = buildChatSystemBlocks(manual, "Italian");

check(JSON.stringify(turn1) === JSON.stringify(turn2), "due turni producono byte identici");
check(turn1[0].cache_control?.type === "ephemeral", "punto di cache presente su un documento grande");
check(turn1.findIndex((b) => b.cache_control) === 0, "il blocco volatile sta dopo il punto di cache");
check(
  buildChatSystemBlocks(manual, "German")[0].text === turn1[0].text,
  "cambiare lingua non invalida il blocco dei documenti"
);
check(
  !buildChatSystemBlocks("", "Italian")[0].cache_control,
  "nessun punto di cache su un prompt troppo corto perché la API lo memorizzi"
);

console.log("\nFinestra della cronologia");
const skips = Array.from({ length: 81 }, (_, n) => historyWindow(n, HISTORY_LIMIT, HISTORY_BLOCK).skip);
const runs: number[] = [];
let run = 1;
for (let i = 1; i < skips.length; i++) {
  if (skips[i] === skips[i - 1]) run++;
  else {
    runs.push(run);
    run = 1;
  }
}
check(skips.every((s, i) => i === 0 || s >= skips[i - 1]), "il punto di partenza non torna mai indietro");
check(runs.slice(1).every((r) => r === HISTORY_BLOCK), `il prefisso resta fermo per ${HISTORY_BLOCK} turni di fila`);
check(
  Array.from({ length: 180 }, (_, i) => i + HISTORY_LIMIT).every((n) => {
    const { skip, take } = historyWindow(n, HISTORY_LIMIT, HISTORY_BLOCK);
    return n - skip >= HISTORY_LIMIT && n - skip <= take;
  }),
  `la finestra copre sempre almeno ${HISTORY_LIMIT} messaggi senza sforare`
);

console.log("\nPulizia del testo estratto");
const pages = Array.from({ length: 10 }, (_, i) =>
  [
    "MANUALE USO E MANUTENZIONE",
    "",
    `Contenuto specifico della pagina ${i + 1}: intervallo di manutenzio-`,
    `ne numero ${i + 1}, con valori tecnici differenti da ogni altra pagina del documento.`,
    "",
    "© 2024 Costruttore S.p.A. - tutti i diritti riservati",
    `Pagina ${i + 1} di 10`,
  ].join("\n")
);
const cleaned = normalizeExtractedPages(pages);
check(!cleaned.includes("MANUALE USO E MANUTENZIONE"), "intestazione ripetuta rimossa");
check(!cleaned.includes("tutti i diritti riservati"), "piè di pagina ripetuto rimosso");
check(!/Pagina \d+ di 10/.test(cleaned), "numeri di pagina rimossi");
check(cleaned.includes("manutenzione numero 7"), "sillabazione a fine riga ricomposta");
check(cleaned.includes("Contenuto specifico della pagina 3"), "contenuto reale conservato");
check(normalizeExtractedPages(["Anti-bloccaggio\ndel freno"]).includes("Anti-bloccaggio"), "trattini legittimi intatti");

const rawLength = pages.join("\n\n").length;
console.log(`\n  testo estratto: ${rawLength} -> ${cleaned.length} caratteri (-${Math.round((1 - cleaned.length / rawLength) * 100)}%)`);

console.log("\nPunti di cache sui percorsi con ricerca web");
// Questi due moduli non si possono importare qui (tirano dentro Supabase e le variabili
// d'ambiente), quindi si controlla il sorgente. Il controllo sembra grossolano ma protegge la
// cosa giusta: senza un `cache_control` esplicito nella richiesta, lo strumento di ricerca web
// non aggiunge i suoi punti di cache automatici dopo i risultati, e il ciclo di ricerca si
// rispedisce tutto il contesto accumulato a prezzo pieno a ogni giro. Non fallisce nulla: si
// paga e basta.
for (const [file, label] of [
  ["app/api/agent/search/route.ts", "ricerca veicolo"],
  ["lib/motorsport.ts", "riquadro motorsport"],
] as const) {
  const src = readFileSync(new URL(`../${file}`, import.meta.url), "utf-8");
  check(
    !/web_search_\d+/.test(src) || src.includes("cache_control"),
    `${label}: la ricerca web gira dentro una richiesta con caching (${file})`
  );
}

console.log(failed === 0 ? "\nTutti i controlli superati.\n" : `\n${failed} controlli falliti.\n`);
process.exit(failed === 0 ? 0 : 1);
