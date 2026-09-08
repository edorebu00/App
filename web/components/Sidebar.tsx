"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Vehicle } from "@/lib/types";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`block rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-brand-600 text-white shadow shadow-brand-900/40"
          : "text-graphite-300 hover:translate-x-0.5 hover:bg-graphite-700 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}

export default function Sidebar({ vehicles }: { vehicles: Vehicle[] }) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 border-graphite-700 md:w-60 md:border-r">
      <nav className="space-y-1 py-6 pr-4">
        <NavLink href="/">🏠 Home</NavLink>
        <NavLink href="/dashboard">🚗 Il mio garage</NavLink>
        <NavLink href="/circuiti">🏁 Circuiti</NavLink>
        <NavLink href="/ricerca">🔍 Ricerca</NavLink>

        <div className="pt-4">
          <p className="label px-3">I miei veicoli</p>
          <div className="mt-1 space-y-1">
            {vehicles.map((v) => {
              const href = `/veicoli/${v.id}`;
              const active = pathname === href;
              return (
                <Link
                  key={v.id}
                  href={href}
                  className={`block truncate rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-brand-600 text-white shadow shadow-brand-900/40"
                      : "text-graphite-300 hover:translate-x-0.5 hover:bg-graphite-700 hover:text-white"
                  }`}
                >
                  {v.type === "moto" ? "🏍️" : "🚗"} {v.make} {v.model}
                </Link>
              );
            })}
            {vehicles.length === 0 && (
              <p className="px-3 text-xs text-graphite-500">Nessun veicolo aggiunto.</p>
            )}
            <Link
              href="/veicoli/nuovo"
              className="block rounded-md px-3 py-2 text-sm font-medium text-brand-400 hover:bg-graphite-700"
            >
              + Aggiungi veicolo
            </Link>
          </div>
        </div>
      </nav>
    </aside>
  );
}
