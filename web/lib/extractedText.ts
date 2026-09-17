/**
 * Pulizia del testo estratto dai PDF, applicata UNA volta in fase di caricamento.
 *
 * Il testo estratto finisce nel prompt di sistema della chat a ogni singolo messaggio: ogni
 * carattere risparmiato qui viene risparmiato per sempre, su tutte le conversazioni future.
 * L'estrazione grezza di un PDF porta con sé parecchia zavorra che non aggiunge informazione:
 * intestazioni e piè di pagina ripetuti su ogni pagina, numeri di pagina, spaziatura di
 * impaginazione e parole spezzate a fine riga.
 */

/** Sopra questa quota di pagine una riga di bordo è considerata intestazione/piè di pagina. */
const REPEAT_RATIO = 0.6;
/** Sotto questo numero di pagine la statistica sulle ripetizioni non è affidabile. */
const MIN_PAGES_FOR_REPEAT_DETECTION = 5;
/**
 * Quante righe, in cima e in fondo alla pagina, possono essere intestazione o piè di pagina.
 * È il vincolo che distingue una decorazione da un contenuto che si ripete: le etichette
 * uguali in mezzo a una tabella restano, l'intestazione in prima riga no.
 */
const EDGE_LINES = 3;
/** Una riga di intestazione è corta: oltre questa lunghezza è contenuto, non decorazione. */
const MAX_REPEATED_LINE_CHARS = 90;
/**
 * Fino a questa lunghezza le cifre vengono ignorate nel confronto fra righe, così "Pagina 3 di 8"
 * e "Pagina 4 di 8" risultano la stessa decorazione. Oltre, il confronto torna letterale: una riga
 * lunga che differisce solo per un numero è quasi sempre contenuto vero ("...della pagina 3 con
 * dati tecnici"), e appiattire le cifre la farebbe cancellare.
 */
const MAX_DIGIT_INSENSITIVE_CHARS = 40;
/** Rete di sicurezza: se resta meno di così, l'euristica ha sbagliato bersaglio. */
const MIN_KEPT_RATIO = 0.25;

/** Righe che sono solo un numero di pagina, in varie convenzioni tipografiche. */
const PAGE_NUMBER_RE =
  /^(?:[-–—\s]*\d{1,4}[-–—\s]*|(?:pag(?:ina)?|page|seite)\.?\s*\d{1,4}(?:\s*(?:\/|di|of|von)\s*\d{1,4})?|\d{1,4}\s*(?:\/|di|of|von)\s*\d{1,4})$/i;

/** Chiave di confronto fra righe: sulle righe corte i numeri variabili non impediscono il match. */
function repeatKey(line: string) {
  const normalized = line.toLowerCase().replace(/\s+/g, " ").trim();
  return normalized.length <= MAX_DIGIT_INSENSITIVE_CHARS
    ? normalized.replace(/\d+/g, "#")
    : normalized;
}

/** Collassa spazi e righe vuote senza toccare il contenuto. È anche il ripiego sicuro. */
export function collapseWhitespace(text: string) {
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/[\f\v­​]/g, "")
    .replace(/[ \t ]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Riunisce le parole spezzate dall'a-capo tipografico ("manuten-\nzione" -> "manutenzione").
 * Si limita al caso minuscola-trattino-a capo-minuscola: le parole composte con il trattino
 * ("anti-bloccaggio") stanno sulla stessa riga e non vengono toccate. Va applicata DOPO la
 * normalizzazione degli spazi, altrimenti uno spazio di impaginazione prima dell'a capo
 * impedisce il riconoscimento.
 */
function joinHyphenation(text: string) {
  return text.replace(/([a-zàèéìòùäöüß])-\n([a-zàèéìòùäöüß])/g, "$1$2");
}

/** Le righe non vuote in cima e in fondo alla pagina: le uniche candidate a essere decorazione. */
function edgeLines(page: string) {
  const lines = page.split("\n").map((l) => l.trim()).filter(Boolean);
  return [...lines.slice(0, EDGE_LINES), ...lines.slice(-EDGE_LINES)];
}

/**
 * Pulisce il testo pagina per pagina. `pages` è il testo grezzo di ogni pagina del PDF; con una
 * sola pagina (o un file di testo) la rimozione delle ripetizioni si disattiva da sé.
 */
export function normalizeExtractedPages(pages: string[]): string {
  const safe = collapseWhitespace(pages.join("\n\n"));
  if (!safe) return "";

  let repeated = new Set<string>();

  if (pages.length >= MIN_PAGES_FOR_REPEAT_DETECTION) {
    const pagesPerKey = new Map<string, number>();

    for (const page of pages) {
      // Una riga va contata una volta sola per pagina, altrimenti un bordo che si ripete
      // dentro la stessa pagina peserebbe più di quanto dovrebbe.
      const seen = new Set<string>();
      for (const line of edgeLines(page)) {
        if (line.length > MAX_REPEATED_LINE_CHARS) continue;
        const key = repeatKey(line);
        if (!key || seen.has(key)) continue;
        seen.add(key);
        pagesPerKey.set(key, (pagesPerKey.get(key) || 0) + 1);
      }
    }

    const threshold = Math.ceil(pages.length * REPEAT_RATIO);
    repeated = new Set([...pagesPerKey].filter(([, n]) => n >= threshold).map(([key]) => key));
  }

  const cleanedPages = pages.map((page) => {
    const lines = page.split("\n");
    // Solo i bordi sono eliminabili: si calcolano gli indici delle righe non vuote in testa e coda.
    const nonEmpty = lines.map((l, i) => [l.trim(), i] as const).filter(([l]) => l);
    const edgeIdx = new Set([
      ...nonEmpty.slice(0, EDGE_LINES).map(([, i]) => i),
      ...nonEmpty.slice(-EDGE_LINES).map(([, i]) => i),
    ]);

    return lines
      .filter((line, i) => {
        const trimmed = line.trim();
        if (!trimmed || !edgeIdx.has(i)) return true;
        if (PAGE_NUMBER_RE.test(trimmed)) return false;
        return !repeated.has(repeatKey(trimmed));
      })
      .join("\n");
  });

  const cleaned = joinHyphenation(collapseWhitespace(cleanedPages.join("\n\n")));

  // Un'euristica che cancella quasi tutto ha sbagliato bersaglio: meglio il testo solo ricompattato.
  if (cleaned.length < safe.length * MIN_KEPT_RATIO) return safe;

  return cleaned;
}
