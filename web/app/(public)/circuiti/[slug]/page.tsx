import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CIRCUITS, getCircuit } from "@/lib/circuits";
import CircuitIllustration from "@/components/CircuitIllustration";

export function generateStaticParams() {
  return CIRCUITS.map((c) => ({ slug: c.slug }));
}

export default async function CircuitDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const circuit = getCircuit(slug);

  if (!circuit) {
    notFound();
  }

  const t = await getTranslations("circuitsSection");
  const tData = await getTranslations("circuitsData");
  const tFacts = await getTranslations("factLabels");

  const name = tData(`${slug}.name`);
  const country = tData(`${slug}.country`);
  const tagline = tData(`${slug}.tagline`);
  const history = tData.raw(`${slug}.history`) as string[];
  const facts = tData.raw(`${slug}.facts`) as { labelKey: string; value: string }[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/circuiti" className="text-sm font-medium text-graphite-500 transition hover:text-graphite-900">
        {t("backToAll")}
      </Link>

      <div className="mt-4 flex flex-col items-center gap-6 text-center">
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-graphite-200 bg-graphite-900 p-6">
          <CircuitIllustration circuit={circuit} />
        </div>
        <div>
          <p className="eyebrow justify-center">{country}</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-graphite-900 sm:text-4xl">
            {name}
          </h1>
          <p className="mt-1 text-sm font-medium text-brand-600">{tagline}</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.labelKey} className="card text-center">
            <p className="text-xs uppercase tracking-wide text-graphite-400">{tFacts(fact.labelKey)}</p>
            <p className="mt-1 font-display text-sm font-semibold text-graphite-900">{fact.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <p className="eyebrow">{t("historyTitle")}</p>
        <div className="mt-3 space-y-4">
          {history.map((paragraph, i) => (
            <p key={i} className="text-graphite-600">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="glass-panel mt-10 flex flex-col items-center gap-3 text-center">
        <p className="eyebrow justify-center">{t("upcomingTitle")}</p>
        <p className="max-w-md text-sm text-graphite-500">
          {t("upcomingText")}
        </p>
        <a
          href={circuit.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-2 inline-flex"
        >
          {t("officialSite")}
        </a>
      </div>
    </div>
  );
}
