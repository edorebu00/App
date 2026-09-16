import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import VehicleCard from "@/components/VehicleCard";
import type { Vehicle } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  const list = (vehicles || []) as Vehicle[];

  return (
    <div>
      <div className="hero-panel mb-8 px-6 py-8 sm:px-8">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">La tua collezione</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-graphite-900">
              Il mio garage
            </h1>
            <p className="mt-1 text-sm text-graphite-500">
              {list.length === 0
                ? "Aggiungi il tuo primo veicolo per iniziare."
                : `${list.length} veicol${list.length === 1 ? "o" : "i"} in collezione.`}
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <div className="flex gap-2">
              <div className="metric-chip">
                <p className="font-display text-xl font-bold text-graphite-900">{list.length}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-500">in garage</p>
              </div>
              <div className="metric-chip">
                <p className="font-display text-xl font-bold text-brand-600">24/7</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-graphite-500">pronto</p>
              </div>
            </div>
            <Link href="/veicoli/nuovo" className="btn-primary self-start sm:self-auto">
              + Aggiungi veicolo
            </Link>
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="card animate-rise-in text-center text-graphite-500">
          <p className="text-3xl">🏁</p>
          <p className="mt-2">Non hai ancora aggiunto nessun veicolo.</p>
          <Link href="/veicoli/nuovo" className="btn-primary mt-4 inline-flex">
            Aggiungi il primo veicolo
          </Link>
        </div>
      ) : (
        <div className="animate-stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
