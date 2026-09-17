import { getTranslations } from "next-intl/server";

/**
 * Pagina mostrata dal service worker quando il telefono è offline. Deve essere raggiungibile
 * senza sessione (è in PUBLIC_EXACT_PATHS) perché viene messa in cache all'installazione del
 * service worker, prima che qualcuno abbia fatto l'accesso.
 */
export default async function OfflinePage() {
  const t = await getTranslations("offline");

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="card max-w-sm text-center">
        <p className="text-4xl" aria-hidden>
          📡
        </p>
        <h1 className="mt-3 font-display text-xl font-bold text-graphite-900">{t("title")}</h1>
        <p className="mt-2 text-sm text-graphite-500">{t("text")}</p>
      </div>
    </div>
  );
}
