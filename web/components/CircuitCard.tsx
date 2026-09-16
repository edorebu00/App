"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Circuit } from "@/lib/circuits";
import CircuitIllustration from "./CircuitIllustration";

export default function CircuitCard({
  circuit,
  gridMode,
}: {
  circuit: Circuit;
  /** true nelle griglie statiche (es. indice circuiti): riempie la cella. */
  gridMode?: boolean;
}) {
  const t = useTranslations("circuitsData");

  return (
    <Link
      href={`/circuiti/${circuit.slug}`}
      className={`track-card block ${gridMode ? "track-card-grid" : ""}`}
    >
      <div className="track-card-inner">
        <CircuitIllustration circuit={circuit} />
      </div>
      <div className="mt-3">
        <p className="font-display text-sm font-semibold text-graphite-900">
          {t(`${circuit.slug}.name`)}
        </p>
        <p className="mt-0.5 text-xs font-medium text-brand-600">{t(`${circuit.slug}.country`)}</p>
        <p className="mt-1 text-xs text-graphite-500">{t(`${circuit.slug}.tagline`)}</p>
      </div>
    </Link>
  );
}
