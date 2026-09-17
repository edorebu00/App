import "server-only";

/**
 * Limite di frequenza per le route IA (Anthropic/OpenAI sono a consumo: senza un freno, una
 * singola sessione autenticata può generare costi arbitrari con un ciclo di fetch).
 *
 * ATTENZIONE, limite noto: il contatore vive in memoria nell'istanza serverless che serve la
 * richiesta, quindi con più istanze attive il limite effettivo è più alto di quello configurato.
 * Serve a fermare l'abuso banale (loop da un browser), NON è una difesa contro un attacco
 * distribuito: per quello servirebbe un contatore condiviso (es. tabella Postgres o Upstash).
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
