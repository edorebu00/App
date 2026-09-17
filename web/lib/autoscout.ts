import type { Locale } from "@/i18n/locales";

/**
 * Link alla ricerca annunci di AutoScout24 per marca e modello del veicolo.
 *
 * L'indirizzo si costruisce qui invece di farlo cercare all'agente IA: e' una ricerca, non una
 * pagina da scovare, quindi non vale una chiamata al modello ne' l'attesa che comporta.
 */
const DOMAIN: Record<Locale, string> = {
  it: "www.autoscout24.it",
  de: "www.autoscout24.de",
  en: "www.autoscout24.com",
};

/**
 * Riduce marca e modello alla forma usata negli indirizzi: minuscolo, senza accenti, parole
 * unite dal trattino. "Alfa Romeo" -> "alfa-romeo", "Citroën" -> "citroen", "C3 Aircross" ->
 * "c3-aircross".
 */
export function toUrlSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function autoscoutSearchUrl(make: string, model: string, locale: Locale): string | null {
  const makeSlug = toUrlSlug(make || "");
  if (!makeSlug) return null;

  const modelSlug = toUrlSlug(model || "");
  const base = `https://${DOMAIN[locale]}/lst/${makeSlug}`;

  // Senza un modello riconoscibile si resta sulla pagina della marca, che e' comunque valida.
  return modelSlug ? `${base}/${modelSlug}` : base;
}
