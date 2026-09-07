import Link from "next/link";
import type { Vehicle } from "@/lib/types";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link href={`/veicoli/${vehicle.id}`} className="card card-interactive group block">
      <div className="mb-3 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-400">
          <span>{vehicle.type === "moto" ? "🏍️" : "🚗"}</span>
          {vehicle.type === "moto" ? "Moto" : "Auto"}
        </span>
        {vehicle.year && <span className="text-xs text-graphite-500">{vehicle.year}</span>}
      </div>
      <h3 className="font-display text-lg font-semibold tracking-tight text-graphite-50">
        {vehicle.make} {vehicle.model}
      </h3>
      {vehicle.engine_code && (
        <p className="mt-1 text-sm text-graphite-400">Motore: {vehicle.engine_code}</p>
      )}
      {vehicle.plate && <p className="mt-1 text-sm text-graphite-500">Targa: {vehicle.plate}</p>}

      <div className="mt-4 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-brand-500 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
        Apri scheda
        <span aria-hidden>→</span>
      </div>
    </Link>
  );
}
