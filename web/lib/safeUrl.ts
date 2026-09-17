/**
 * Gli URL delle risorse non sono dati di cui fidarsi: arrivano dal modello IA, che a sua volta
 * li raccoglie da pagine web di terzi, e vengono poi salvati in `search_results.results`.
 * Renderizzarli tali e quali dentro un `href` permetterebbe schemi come `javascript:` o `data:`
 * (React non li blocca), cioè esecuzione di codice arbitrario al click dell'utente.
 * Qui accettiamo solo http/https: tutto il resto viene scartato.
 */
export function safeExternalUrl(url: unknown): string | null {
  if (typeof url !== "string") return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    // URL relativo o malformato: non è una risorsa esterna valida.
    return null;
  }
}
