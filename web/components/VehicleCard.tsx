"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Vehicle } from "@/lib/types";

const MotionLink = motion.create(Link);

export default function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const t = useTranslations("vehicleCard");

  return (
    <MotionLink
      href={`/veicoli/${vehicle.id}`}
      aria-label={`Apri la scheda di ${vehicle.make} ${vehicle.model}`}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className="group block overflow-hidden rounded-xl border border-graphite-200 bg-white shadow-sm shadow-graphite-900/5 transition-[box-shadow,border-color] duration-200 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
    >
      <div className="relative flex h-32 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-50 to-white">
        <span className="text-5xl transition-transform duration-200 group-hover:scale-110">
          {vehicle.type === "moto" ? "🏍️" : "🚗"}
        </span>
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-brand-700 shadow-sm">
          {vehicle.type === "moto" ? t("moto") : t("auto")}
        </span>
        {vehicle.year && (
          <span className="absolute right-3 top-3 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-graphite-500 shadow-sm">
            {vehicle.year}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg font-semibold tracking-tight text-graphite-900">
          {vehicle.make} {vehicle.model}
        </h3>
        {vehicle.engine_code && (
          <p className="mt-1 text-sm text-graphite-500">{t("engineLabel")}: {vehicle.engine_code}</p>
        )}
        {vehicle.plate && <p className="mt-1 text-sm text-graphite-400">{t("plateLabel")}: {vehicle.plate}</p>}

        <div className="mt-4 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-brand-600">
          {t("openSheet")}
          <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </div>
      </div>
    </MotionLink>
  );
}
