import Link from "next/link";
import type { Vehicle } from "@/lib/types";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link href={`/veicoli/${vehicle.id}`} className="card block transition hover:border-brand-600 hover:shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-400">
          {vehicle.type === "moto" ? "Moto" : "Auto"}
        </span>
        {vehicle.year && <span className="text-xs text-graphite-500">{vehicle.year}</span>}
      </div>
      <h3 className="text-lg font-semibold text-graphite-50">
        {vehicle.make} {vehicle.model}
      </h3>
      {vehicle.engine_code && (
        <p className="mt-1 text-sm text-graphite-400">Motore: {vehicle.engine_code}</p>
      )}
      {vehicle.plate && <p className="mt-1 text-sm text-graphite-500">Targa: {vehicle.plate}</p>}
    </Link>
  );
}
