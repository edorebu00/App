"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { Vehicle } from "@/lib/types";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`relative block rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
        active ? "text-graphite-50" : "text-graphite-600 hover:text-graphite-900"
      }`}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active-pill"
          className="absolute inset-0 rounded-md bg-gradient-to-b from-brand-500 to-brand-400 shadow-sm shadow-black/30"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </Link>
  );
}

const ICONS = {
  home: "M2.5 9 L9 3.2 L15.5 9 M4.5 7.5 V15 H13.5 V7.5",
  garage: "M2.5 15 V9.5 L4 5.5 H14 L15.5 9.5 V15 M2.5 15 H15.5 M4.5 12 H4.51 M13.5 12 H13.51",
  flag: "M4 15.5 V2.5 M4 3 H13 L11 6 L13 9 H4",
  search: "M8 13.5 A5.5 5.5 0 1 0 8 2.5 A5.5 5.5 0 0 0 8 13.5 Z M12 12 L16 16",
} as const;

function NavIcon({ d }: { d: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0" aria-hidden>
      <path d={d} />
    </svg>
  );
}

export default function Sidebar({ vehicles }: { vehicles: Vehicle[] }) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <aside className="w-full shrink-0 border-graphite-200 md:w-60 md:border-r">
      <nav className="space-y-1 py-6 pr-4">
        <NavLink href="/"><NavIcon d={ICONS.home} /> {t("home")}</NavLink>
        <NavLink href="/dashboard"><NavIcon d={ICONS.garage} /> {t("garage")}</NavLink>
        <NavLink href="/circuiti"><NavIcon d={ICONS.flag} /> {t("circuits")}</NavLink>
        <NavLink href="/ricerca"><NavIcon d={ICONS.search} /> {t("search")}</NavLink>

        <div className="pt-4">
          <p className="label px-3">{t("myVehicles")}</p>
          <div className="mt-1 space-y-1">
            {vehicles.map((v) => {
              const href = `/veicoli/${v.id}`;
              const active = pathname === href;
              return (
                <Link
                  key={v.id}
                  href={href}
                  className={`relative block truncate rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    active ? "text-graphite-50" : "text-graphite-600 hover:text-graphite-900"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 rounded-md bg-gradient-to-b from-brand-500 to-brand-400 shadow-sm shadow-black/30"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">
                    {v.type === "moto" ? "🏍️" : "🚗"} {v.make} {v.model}
                  </span>
                </Link>
              );
            })}
            {vehicles.length === 0 && (
              <p className="px-3 text-xs text-graphite-400">{t("noVehicles")}</p>
            )}
            <Link
              href="/veicoli/nuovo"
              className="block rounded-md px-3 py-2 text-sm font-medium text-brand-600 hover:bg-graphite-100"
            >
              {t("addVehicle")}
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
}
