import { CIRCUITS } from "@/lib/circuits";
import CircuitCard from "@/components/CircuitCard";

export default function CircuitiIndexPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="eyebrow-gold">Motorsport</p>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">
        I circuiti più leggendari
      </h1>
      <p className="mt-2 max-w-xl text-sm text-graphite-400">
        Storia, curve simbolo e link ai siti ufficiali per restare aggiornato sulle gare in programma.
      </p>
      <div className="flag-stripe mt-5 w-16 rounded-full" />

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CIRCUITS.map((circuit) => (
          <CircuitCard key={circuit.slug} circuit={circuit} gridMode />
        ))}
      </div>
    </div>
  );
}
