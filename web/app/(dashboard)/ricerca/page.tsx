import { getTranslations } from "next-intl/server";
import GlobalSearch from "@/components/GlobalSearch";

export default async function RicercaPage() {
  const t = await getTranslations("search");

  return (
    <div>
      <div className="hero-panel mb-8 px-6 py-8 text-center">
        <div className="relative z-10">
          <p className="eyebrow justify-center">{t("eyebrow")}</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-graphite-900">{t("title")}</h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-graphite-500">
            {t("subtitle")}
          </p>
        </div>
      </div>
      <GlobalSearch />
    </div>
  );
}
