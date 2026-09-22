import "server-only";

/**
 * Limite di frequenza per le route IA (Anthropic/OpenAI sono a consumo: senza un freno, una
 * singola sessione autenticata può generare costi arbitrari con un ciclo di fetch).
 *
 * Il contatore in memoria vive nell'istanza serverless che serve la richiesta, quindi da solo con
 * più istanze attive concederebbe un multiplo del tetto configurato. Resta come primo filtro a
 * costo zero (ferma il loop da un browser senza toccare il database); il tetto effettivo lo fa
 * rispettare `checkSharedRateLimit`, che conta le righe già scritte a database nella finestra ed
 * è quindi comune a tutte le istanze.
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function sweep(now: number) {
  // La mappa è piccola (una voce per utente attivo), ma senza pulizia crescerebbe all'infinito
  // sulle istanze longeve.
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  if (buckets.size > 500) sweep(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Sola lettura sullo stesso contatore: dice se la chiave ha già raggiunto il tetto nella finestra
 * in corso senza creare voci né incrementare nulla. Serve a chi deve sapere se è il caso di
 * riprovare prima di decidere se consumare una posizione; voce assente o finestra scaduta valgono
 * come "non limitato".
 */
export function isRateLimited(key: string, limit: number): boolean {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= Date.now()) return false;
  return bucket.count >= limit;
}

/** Istante da cui contare le righe della finestra corrente, nel formato accettato da Postgres. */
export function rateWindowStart(windowMs: number): string {
  return new Date(Date.now() - windowMs).toISOString();
}

/**
 * Secondo controllo, condiviso fra le istanze: il conteggio arriva dalle righe che ogni chiamata
 * lascia comunque a database (un messaggio in `chat_messages`, una ricerca in `search_results`),
 * quindi non servono tabelle nuove e il conteggio si fa con `head: true`, senza scaricare righe.
 *
 * Un conteggio non leggibile non blocca la richiesta: davanti resta il filtro in memoria, e
 * rifiutare per un errore di lettura costerebbe all'utente una funzione che funziona.
 */
export function checkSharedRateLimit(
  count: number | null,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSeconds: number } {
  if (count === null || count < limit) return { allowed: true, retryAfterSeconds: 0 };
  // Senza leggere le righe non si sa quando scade la più vecchia: si attende l'intera finestra.
  return { allowed: false, retryAfterSeconds: Math.ceil(windowMs / 1000) };
}
