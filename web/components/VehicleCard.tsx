"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Vehicle } from "@/lib/types";

// Tempo di attesa prima della navigazione: deve coincidere con la durata
// della transizione .garage-door in globals.css, cosi' la saracinesca fa
// in tempo a "arrotolarsi" prima di cambiare pagina.
const OPEN_DELAY_MS = 550;

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const router = useRouter();
  const [opening, setOpening] = useState(false);

  function openGarage() {
    if (opening) return;
    setOpening(true);
    setTimeout(() => router.push(`/veicoli/${vehicle.id}`), OPEN_DELAY_MS);
  }

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={openGarage}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openGarage();
        }
      }}
      aria-label={`Apri la scheda di ${vehicle.make} ${vehicle.model}`}
      className={`group relative block cursor-pointer overflow-hidden rounded-xl border border-graphite-700 bg-graphite-900 shadow-lg shadow-black/30 transition-shadow duration-300 hover:shadow-2xl hover:shadow-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 ${
        opening ? "garage-bay-open" : ""
      }`}
    >
      {/* Interno del box: la scheda del veicolo, rivelata quando la saracinesca si apre */}
      <div className="relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br from-graphite-700 via-graphite-800 to-graphite-900">
        <div
          className="absolute inset-0 opacity-40"
          style={{ background: "radial-gradient(closest-side, rgba(255,45,26,0.35), transparent 75%)" }}
        />
        <span className="relative z-10 text-5xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
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

        <div className="mt-4 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gold-500">
          Apri scheda
          <span aria-hidden>→</span>
        </div>
      </div>

      {/* Saracinesca: si "arrotola" verso l'alto al click, rivelando la scheda sottostante */}
      <div className="garage-door absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 px-3 text-center">
        <span className="text-3xl">{vehicle.type === "moto" ? "🏍️" : "🚗"}</span>
        <p className="font-display text-sm font-bold uppercase tracking-wide text-white">
          {vehicle.make} {vehicle.model}
        </p>
        {vehicle.year && (
          <span className="rounded-full bg-graphite-900/60 px-2 py-0.5 text-[11px] text-gold-400">
            {vehicle.year}
          </span>
        )}
        <span className="garage-door-light" aria-hidden />
      </div>
    </div>
  );
}
