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
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-graphite-50">I tuoi veicoli</h1>
        <Link href="/veicoli/nuovo" className="btn-primary">
          + Aggiungi veicolo
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="card text-center text-graphite-400">
          <p>Non hai ancora aggiunto nessun veicolo.</p>
          <Link href="/veicoli/nuovo" className="btn-primary mt-4 inline-flex">
            Aggiungi il primo veicolo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
