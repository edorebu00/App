import { safeExternalUrl } from "./safeUrl";
import { clampText } from "./validation";
import { RESOURCE_CATEGORIES } from "./types";
import type { ResourceLink, SearchPayload } from "./types";

/** Tetto al numero di risorse restituite. */
export const MAX_RISORSE = 10;
const MAX_TEXT_FIELD_CHARS = 500;
const MAX_SPEC_ENTRIES = 12;
const MAX_SUMMARY_CHARS = 2000;

/**
 * Il payload arriva dal modello (che a sua volta cita pagine web di terzi): prima di salvarlo e
 * rimandarlo al browser scartiamo gli URL non http/https (`javascript:` diventerebbe XSS al click
 * nel momento in cui il link viene renderizzato) e tagliamo i campi testuali, cosi' una risposta
 * anomala non riempie il database.
 */
export function sanitizePayload(payload: SearchPayload): SearchPayload {
  const risorse: ResourceLink[] = [];

  for (const risorsa of payload.risorse || []) {
    const url = safeExternalUrl(risorsa?.url);
    const titolo = clampText(risorsa?.titolo, MAX_TEXT_FIELD_CHARS);
    if (!url || !titolo) continue;

    // Anche la categoria arriva dal modello: un valore fuori elenco non comparirebbe in nessuna
    // scheda, quindi lo ricondurremo ad "altro" invece di lasciare la risorsa irraggiungibile.
    const categoria = RESOURCE_CATEGORIES.includes(risorsa?.categoria) ? risorsa.categoria : "altro";

    risorse.push({
      categoria,
      sezione: risorsa.sezione,
      titolo,
      url,
      descrizione: clampText(risorsa?.descrizione, MAX_TEXT_FIELD_CHARS) || "",
    });

    if (risorse.length >= MAX_RISORSE) break;
  }

  const specifiche: SearchPayload["specifiche"] = {};
  for (const [sezione, voci] of Object.entries(payload.specifiche || {})) {
    if (!voci || typeof voci !== "object") continue;
    const clean: Record<string, string> = {};
    for (const [key, value] of Object.entries(voci).slice(0, MAX_SPEC_ENTRIES)) {
      const cleanKey = clampText(key, 80);
      const cleanValue = clampText(value, MAX_TEXT_FIELD_CHARS);
      if (cleanKey && cleanValue) clean[cleanKey] = cleanValue;
    }
    if (Object.keys(clean).length) {
      specifiche[sezione as keyof SearchPayload["specifiche"]] = clean;
    }
  }

  return {
    risorse,
    specifiche,
    bollo: clampText(payload.bollo, MAX_TEXT_FIELD_CHARS) || undefined,
    summary: clampText(payload.summary, MAX_SUMMARY_CHARS) || undefined,
    locale: payload.locale,
  };
}
