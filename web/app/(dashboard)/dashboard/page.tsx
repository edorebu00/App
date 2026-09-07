import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import TrackCarousel from "@/components/TrackCarousel";
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-graphite-50">I tuoi veicoli</h1>
          <p className="mt-1 text-sm text-graphite-400">
            {list.length === 0
              ? "Aggiungi il tuo primo veicolo per iniziare."
              : `${list.length} veicol${list.length === 1 ? "o" : "i"} in garage.`}
          </p>
          <div className="flag-stripe mt-3 w-16 rounded-full" />
        </div>
        <Link href="/veicoli/nuovo" className="btn-primary self-start sm:self-auto">
          + Aggiungi veicolo
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="card animate-rise-in relative overflow-hidden text-center text-graphite-400">
          <div className="hero-glow" />
          <p className="relative z-10 text-3xl">🏁</p>
          <p className="relative z-10 mt-2">Non hai ancora aggiunto nessun veicolo.</p>
          <Link href="/veicoli/nuovo" className="btn-primary relative z-10 mt-4 inline-flex">
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

      <TrackCarousel />
    </div>
  );
}
