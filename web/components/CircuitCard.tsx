import Link from "next/link";
import type { Circuit } from "@/lib/circuits";
import CircuitIllustration from "./CircuitIllustration";

export default function CircuitCard({
  circuit,
  tiltClass,
  gridMode,
}: {
  circuit: Circuit;
  /** Classe di inclinazione 3D opzionale (usata nel carosello di Home). */
  tiltClass?: string;
  /** true nelle griglie statiche (es. indice circuiti): riempie la cella. */
  gridMode?: boolean;
}) {
  return (
    <Link
      href={`/circuiti/${circuit.slug}`}
      className={`track-card ${gridMode ? "track-card-grid" : ""} ${tiltClass ?? ""}`}
    >
      <div className="track-card-inner">
        <CircuitIllustration circuit={circuit} />
      </div>
      <div className="mt-3">
        <p className="font-display text-sm font-semibold uppercase tracking-wide text-graphite-100">
          {circuit.name}
        </p>
        <p className="mt-0.5 text-xs text-gold-500">{circuit.country}</p>
        <p className="mt-1 text-xs text-graphite-500">{circuit.tagline}</p>
      </div>
    </Link>
  );
}
