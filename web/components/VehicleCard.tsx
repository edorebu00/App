import Link from "next/link";
import type { Vehicle } from "@/lib/types";

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      href={`/veicoli/${vehicle.id}`}
      className="group block overflow-hidden rounded-xl border border-graphite-700 bg-graphite-800 shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-1 hover:border-gold-600/60 hover:shadow-2xl hover:shadow-black/50"
    >
      {/* Vetrina: zona "foto" con sfondo sfumato, come nelle schede da concessionaria */}
      <div className="relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br from-graphite-700 via-graphite-800 to-graphite-900">
        <div
          className="absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-70"
          style={{ background: "radial-gradient(closest-side, rgba(255,45,26,0.35), transparent 75%)" }}
        />
        <span className="relative z-10 text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] transition-transform duration-300 group-hover:scale-110">
          {vehicle.type === "moto" ? "🏍️" : "🚗"}
        </span>
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-graphite-900/70 px-2 py-0.5 text-xs font-medium text-brand-400 backdrop-blur-sm">
          {vehicle.type === "moto" ? "Moto" : "Auto"}
        </span>
        {vehicle.year && (
          <span className="absolute right-3 top-3 rounded-full bg-graphite-900/70 px-2 py-0.5 text-xs text-gold-400 backdrop-blur-sm">
            {vehicle.year}
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg font-semibold tracking-tight text-graphite-50">
          {vehicle.make} {vehicle.model}
        </h3>
        {vehicle.engine_code && (
          <p className="mt-1 text-sm text-graphite-400">Motore: {vehicle.engine_code}</p>
        )}
        {vehicle.plate && <p className="mt-1 text-sm text-graphite-500">Targa: {vehicle.plate}</p>}

        <div className="mt-4 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gold-500 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
          Apri scheda
          <span aria-hidden>→</span>
        </div>
      </div>
    </Link>
  );
}
