import { getTranslations } from "next-intl/server";
import { CIRCUITS } from "@/lib/circuits";
import CircuitCard from "@/components/CircuitCard";

export default async function CircuitiIndexPage() {
  const t = await getTranslations("circuitsSection");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="eyebrow">{t("eyebrow")}</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-graphite-900">
        {t("indexTitle")}
      </h1>
      <p className="mt-2 max-w-xl text-sm text-graphite-500">
        {t("indexSubtitle")}
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CIRCUITS.map((circuit) => (
          <CircuitCard key={circuit.slug} circuit={circuit} gridMode />
        ))}
      </div>
    </div>
  );
}
