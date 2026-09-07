"use client";

import { useEffect } from "react";
import type { VehicleType } from "@/lib/types";

function CarSilhouette() {
  return (
    <svg viewBox="0 0 140 60" width="140" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 44 L20 44 L27 28 C29 24 34 21 40 21 L92 21 C98 21 103 24 106 29 L114 44 L128 44 L128 50 L10 50 Z"
        fill="#f4f4f5"
      />
      <path d="M33 28 L41 28 L45 22.5 L36 22.5 Z" fill="#ff2d1a" />
      <path d="M49 28 L88 28 L83 22.5 L54 22.5 Z" fill="#ff2d1a" />
      <circle cx="34" cy="50" r="9" fill="#0c0c0e" />
      <circle cx="34" cy="50" r="4" fill="#c7c7cc" />
      <circle cx="104" cy="50" r="9" fill="#0c0c0e" />
      <circle cx="104" cy="50" r="4" fill="#c7c7cc" />
    </svg>
  );
}

function MotoSilhouette() {
  return (
    <svg viewBox="0 0 140 60" width="140" height="60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="46" r="12" fill="none" stroke="#f4f4f5" strokeWidth="4" />
      <circle cx="108" cy="46" r="12" fill="none" stroke="#f4f4f5" strokeWidth="4" />
      <path
        d="M30 46 L52 30 L70 30 L78 20 L100 20 M52 30 L64 46 L108 46 M70 30 L78 44"
        stroke="#f4f4f5"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M60 22 L84 22 L80 14 L64 14 Z" fill="#ff2d1a" />
      <circle cx="64" cy="46" r="4" fill="#c7c7cc" />
    </svg>
  );
}

export default function VehicleAddedOverlay({
  type,
  label,
  onDone,
}: {
  type: VehicleType;
  label: string;
  onDone: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDone, 1550);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Vehicle = type === "moto" ? MotoSilhouette : CarSilhouette;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-graphite-900/95 backdrop-blur-sm">
      <div className="flag-stripe w-full" />

      <div className="scene-3d relative flex w-full flex-1 items-center justify-center overflow-hidden">
        {/* Linee di velocita' su due livelli per un effetto di profondita' */}
        <div
          className="absolute inset-x-0 top-[calc(50%+22px)] h-0.5 opacity-20 animate-speed-lines-fast"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #9d9da5 0, #9d9da5 24px, transparent 24px, transparent 60px)",
          }}
        />
        <div
          className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 opacity-30 animate-speed-lines"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #9d9da5 0, #9d9da5 40px, transparent 40px, transparent 80px)",
          }}
        />
        <div
          className="absolute inset-x-0 top-[calc(50%-22px)] h-0.5 opacity-15 animate-speed-lines-fast"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, #9d9da5 0, #9d9da5 24px, transparent 24px, transparent 60px)",
          }}
        />

        {/* Scia dietro al veicolo */}
        <div className="absolute left-0 top-1/2 animate-drive-trail" aria-hidden>
          <Vehicle />
        </div>
        <div className="absolute left-0 top-1/2 animate-drive-across">
          <Vehicle />
        </div>

        <div className="animate-pop-in text-center">
          <p className="text-3xl">🏁</p>
          <h2 className="mt-2 text-xl font-bold text-white">{label}</h2>
          <p className="mt-1 text-sm text-graphite-400">Veicolo aggiunto! Stiamo cercando le prime info online…</p>
        </div>
      </div>

      <div className="flag-stripe w-full" />
    </div>
  );
}
