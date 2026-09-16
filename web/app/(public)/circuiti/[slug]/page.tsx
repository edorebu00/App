import Link from "next/link";
import { notFound } from "next/navigation";
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/circuiti" className="text-sm font-medium text-graphite-500 transition hover:text-graphite-900">
        ← Tutti i circuiti
      </Link>

      <div className="mt-4 flex flex-col items-center gap-6 text-center">
        <div className="w-full max-w-md overflow-hidden rounded-xl border border-graphite-200 bg-graphite-900 p-6">
          <CircuitIllustration circuit={circuit} />
        </div>
        <div>
          <p className="eyebrow justify-center">{circuit.country}</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-graphite-900 sm:text-4xl">
            {circuit.name}
          </h1>
          <p className="mt-1 text-sm font-medium text-brand-600">{circuit.tagline}</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {circuit.facts.map((fact) => (
          <div key={fact.label} className="card text-center">
            <p className="text-xs uppercase tracking-wide text-graphite-400">{fact.label}</p>
            <p className="mt-1 font-display text-sm font-semibold text-graphite-900">{fact.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <p className="eyebrow">Storia</p>
        <div className="mt-3 space-y-4">
          {circuit.history.map((paragraph, i) => (
            <p key={i} className="text-graphite-600">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <div className="glass-panel mt-10 flex flex-col items-center gap-3 text-center">
        <p className="eyebrow justify-center">Gare in programma</p>
        <p className="max-w-md text-sm text-graphite-500">
          I calendari cambiano ogni stagione: per le date aggiornate delle prossime gare su questo circuito,
          consulta il sito ufficiale.
        </p>
        <a
          href={circuit.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-2 inline-flex"
        >
          Vai al sito ufficiale ↗
        </a>
      </div>
    </div>
  );
}
