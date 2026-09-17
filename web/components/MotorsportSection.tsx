import { getLocale, getTranslations } from "next-intl/server";
import { getMotorsportBriefing } from "@/lib/motorsport";
import { resolveLocale } from "@/i18n/locales";

/**
 * Riquadro motorsport della home: notizie del momento e prossime gare con i link ai biglietti.
 * È un componente server asincrono: va avvolto in <Suspense> perché sul primo caricamento dopo
 * la scadenza della cache la ricerca web può prendere decine di secondi, e il resto della pagina
 * non deve aspettarla.
 */
export default async function MotorsportSection() {
  const locale = resolveLocale(await getLocale());
  const t = await getTranslations("motorsport");
  const { news, races } = await getMotorsportBriefing(locale);

  // Se la ricerca non ha prodotto nulla (chiave API assente, rete, nessun risultato affidabile)
  // la sezione sparisce invece di mostrare un riquadro vuoto.
  if (!news.length && !races.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-graphite-900">{t("title")}</h2>
      <p className="mt-1 text-sm text-graphite-500">{t("subtitle")}</p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {races.length > 0 && (
          <div>
            <h3 className="mb-3 font-display text-base font-semibold text-graphite-900">{t("racesTitle")}</h3>
            <ul className="space-y-2">
              {races.map((race, i) => (
                <li key={i} className="card flex items-start gap-3">
                  <span className="icon-badge shrink-0" aria-hidden>
                    🏁
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">
                      {race.campionato}
                    </p>
                    <p className="mt-0.5 font-display font-semibold text-graphite-900">{race.gara}</p>
                    <p className="mt-0.5 text-sm text-graphite-500">{race.circuito}</p>
                    <p className="mt-1 text-sm font-medium text-graphite-600">{race.data}</p>
                    {race.urlBiglietti && (
                      <a
                        href={race.urlBiglietti}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex text-sm font-medium text-gold-600 hover:underline"
                      >
                        🎟️ {t("ticketsCta")}
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {news.length > 0 && (
          <div>
            <h3 className="mb-3 font-display text-base font-semibold text-graphite-900">{t("newsTitle")}</h3>
            <ul className="space-y-2">
              {news.map((item, i) => (
                <li key={i} className="card">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display font-semibold text-brand-600 hover:underline"
                  >
                    {item.titolo}
                  </a>
                  <p className="mt-1 text-sm text-graphite-500">{item.sintesi}</p>
                  {item.fonte && <p className="mt-1.5 text-xs text-graphite-400">{item.fonte}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-graphite-500">{t("disclaimer")}</p>
    </section>
  );
}

/** Scheletro mostrato mentre il riquadro viene preparato. */
export function MotorsportSectionSkeleton() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12" aria-hidden>
      <div className="skeleton-line h-3 w-32" />
      <div className="skeleton-line mt-3 h-6 w-64" />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[0, 1].map((col) => (
          <div key={col} className="space-y-2">
            <div className="skeleton-line h-4 w-40" />
            {[0, 1, 2].map((row) => (
              <div key={row} className="card space-y-2">
                <div className="skeleton-line h-3 w-2/5" />
                <div className="skeleton-line h-2.5 w-4/5" />
                <div className="skeleton-line h-2.5 w-3/5" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
