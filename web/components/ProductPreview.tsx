"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

/**
 * Mockup statico del prodotto (non e' un iframe/screenshot reale): ricrea in miniatura la
 * dashboard per dare alla hero della home un centro visivo concreto, invece di solo testo.
 * Fluttua lentamente per un tocco "vivo" tipico delle hero dei prodotti SaaS premium.
 */
export default function ProductPreview() {
  const t = useTranslations("nav");

  const navItems: Array<{ icon: string; label: string; active?: boolean }> = [
    { icon: "🏠", label: t("home") },
    { icon: "🚗", label: t("garage"), active: true },
    { icon: "🏁", label: t("circuits") },
    { icon: "🔍", label: t("search") },
  ];

  return (
    <div className="relative mx-auto mt-14 max-w-3xl px-4">
      {/* Bagliore di appoggio: da' "peso" al mockup senza un'ombra dura */}
      <div className="pointer-events-none absolute inset-x-10 -bottom-6 top-10 -z-10 rounded-[2rem] bg-brand-500/15 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 28, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 1400 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="overflow-hidden rounded-2xl border border-graphite-200 bg-graphite-100"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(246,242,234,0.04), 0 1px 2px rgba(0,0,0,0.3), 0 40px 70px -24px rgba(0,0,0,0.65), 0 12px 24px -12px rgba(204,165,88,0.12)",
          }}
        >
          {/* Barra del browser */}
          <div className="flex items-center gap-3 border-b border-graphite-200 bg-graphite-50 px-4 py-2.5">
            <div className="flex gap-1.5" aria-hidden>
              <span className="h-2.5 w-2.5 rounded-full bg-graphite-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-graphite-300" />
              <span className="h-2.5 w-2.5 rounded-full bg-graphite-300" />
            </div>
            <div className="mx-auto flex items-center gap-1.5 rounded-full bg-graphite-100 px-3 py-1 text-[11px] text-graphite-500 shadow-sm">
              <span aria-hidden>🔒</span> myvehicle.app/dashboard
            </div>
          </div>

          {/* Corpo: sidebar + contenuto in miniatura */}
          <div className="flex text-left">
            <div className="hidden w-36 shrink-0 space-y-1 border-r border-graphite-200 p-3 sm:block">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] font-medium ${
                    item.active ? "bg-gradient-to-b from-brand-500 to-brand-400 text-graphite-50" : "text-graphite-500"
                  }`}
                >
                  <span aria-hidden>{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </div>

            <div className="flex-1 space-y-3 p-4">
              <div className="rounded-lg border border-graphite-200 bg-gradient-to-br from-brand-50 to-graphite-100 p-3">
                <div className="skeleton-line h-2 w-20" />
                <div className="skeleton-line mt-2 h-3 w-32" />
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {[
                  { icon: "🏍️", badge: "Moto" },
                  { icon: "🚗", badge: "Auto" },
                  { icon: "🚙", badge: "Auto" },
                ].map((v, i) => (
                  <div key={i} className="rounded-lg border border-graphite-200 bg-graphite-50 p-2 shadow-sm">
                    <div className="flex h-10 items-center justify-center rounded-md bg-gradient-to-br from-brand-50 to-graphite-100 text-lg">
                      <span aria-hidden>{v.icon}</span>
                    </div>
                    <div className="skeleton-line mt-2 h-1.5 w-full" />
                    <div className="skeleton-line mt-1 h-1.5 w-2/3" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Badge fluttuante: sfalsato rispetto al frame principale per un leggero effetto di profondita' */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.9 },
          scale: { duration: 0.5, delay: 0.9 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.9 },
        }}
        className="absolute -right-2 top-10 hidden items-center gap-2 rounded-xl border border-graphite-200 bg-graphite-100 px-3 py-2 text-xs font-medium text-graphite-700 shadow-lg shadow-black/50 sm:flex"
      >
        <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/15 text-emerald-400" aria-hidden>✓</span>
        <span aria-hidden>🤖</span> AI
      </motion.div>
    </div>
  );
}
