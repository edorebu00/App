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
      className={`relative block rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
        active ? "text-white" : "text-graphite-600 hover:text-graphite-900"
      }`}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active-pill"
          className="absolute inset-0 rounded-md bg-brand-600 shadow-sm shadow-brand-600/25"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </Link>
  );
}

export default function Sidebar({ vehicles }: { vehicles: Vehicle[] }) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <aside className="w-full shrink-0 border-graphite-200 md:w-60 md:border-r">
      <nav className="space-y-1 py-6 pr-4">
        <NavLink href="/">🏠 {t("home")}</NavLink>
        <NavLink href="/dashboard">🚗 {t("garage")}</NavLink>
        <NavLink href="/circuiti">🏁 {t("circuits")}</NavLink>
        <NavLink href="/ricerca">🔍 {t("search")}</NavLink>

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
                  className={`relative block truncate rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                    active ? "text-white" : "text-graphite-600 hover:text-graphite-900"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 rounded-md bg-brand-600 shadow-sm shadow-brand-600/25"
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
