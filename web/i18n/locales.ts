export const LOCALES = ["it", "en", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "it";

export const LOCALE_LABELS: Record<Locale, string> = {
  it: "Italiano",
  en: "English",
  de: "Deutsch",
};

/** Nome della lingua in inglese, usato nei prompt di sistema per istruire il modello sulla lingua di risposta. */
export const LOCALE_LANGUAGE_NAME: Record<Locale, string> = {
  it: "Italian",
  en: "English",
  de: "German",
};

export function resolveLocale(value: unknown): Locale {
  return typeof value === "string" && isLocale(value) ? value : DEFAULT_LOCALE;
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
