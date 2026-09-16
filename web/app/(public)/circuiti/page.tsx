import { CIRCUITS } from "@/lib/circuits";
import CircuitCard from "@/components/CircuitCard";

export default function CircuitiIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="eyebrow">Motorsport</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-graphite-900">
        I circuiti più leggendari
      </h1>
      <p className="mt-2 max-w-xl text-sm text-graphite-500">
        Storia, curve simbolo e link ai siti ufficiali per restare aggiornato sulle gare in programma.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CIRCUITS.map((circuit) => (
          <CircuitCard key={circuit.slug} circuit={circuit} gridMode />
        ))}
      </div>
    </div>
  );
}
