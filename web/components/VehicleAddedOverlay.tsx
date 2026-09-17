"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { VehicleType } from "@/lib/types";

export default function VehicleAddedOverlay({
  type,
  label,
  onDone,
}: {
  type: VehicleType;
  label: string;
  onDone: () => void;
}) {
  const t = useTranslations("vehicleAdded");

  useEffect(() => {
    const t = setTimeout(onDone, 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="glass-panel relative flex flex-col items-center gap-2 text-center"
      >
        <div className="relative mb-1 grid h-14 w-14 place-items-center">
          <motion.span
            initial={{ scale: 0.6, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut", repeat: Infinity, repeatDelay: 0.2 }}
            className="absolute inset-0 rounded-full bg-brand-500"
          />
          <span className="relative grid h-14 w-14 place-items-center rounded-full bg-brand-100 text-3xl">
            {type === "moto" ? "🏍️" : "🚗"}
          </span>
        </div>
        <motion.span
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 400, damping: 18 }}
          className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/15 text-sm text-emerald-400"
        >
          ✓
        </motion.span>
        <h2 className="mt-1 text-xl font-bold text-graphite-900">{label}</h2>
        <p className="mt-1 max-w-xs text-sm text-graphite-500">
          {t("text")}
        </p>
      </motion.div>
    </motion.div>
  );
}
