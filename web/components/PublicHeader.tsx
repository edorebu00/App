"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useScrolled } from "@/lib/useScrolled";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/circuiti", label: "Circuiti" },
];

export default function PublicHeader({ loggedIn }: { loggedIn: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const scrolled = useScrolled();

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white/85 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "border-graphite-200 shadow-sm shadow-graphite-900/5" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-graphite-900"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-base text-white shadow-sm shadow-brand-600/30">M</span>
          <span>My<span className="text-brand-600">Vehicle</span></span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm font-medium text-graphite-600 sm:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-md px-3 py-1.5 transition-colors ${active ? "text-graphite-900" : "hover:text-graphite-900"}`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="public-nav-underline"
                    className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-brand-600"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          {loggedIn ? (
            <Link href="/dashboard" className="btn-primary">
              Il mio garage
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-graphite-600 transition hover:text-graphite-900">
                Accedi
              </Link>
              <Link href="/registrati" className="btn-primary">
                Registrati
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-graphite-600 hover:bg-graphite-100 hover:text-graphite-900 sm:hidden"
          aria-label={menuOpen ? "Chiudi il menu" : "Apri il menu"}
          aria-expanded={menuOpen}
        >
          <span className="text-xl" aria-hidden>
            {menuOpen ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-graphite-200 bg-white px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-1 text-sm font-medium text-graphite-600">
            <Link href="/" className="rounded-md px-2 py-2 transition hover:bg-graphite-50 hover:text-graphite-900">
              Home
            </Link>
            <Link
              href="/circuiti"
              className="rounded-md px-2 py-2 transition hover:bg-graphite-50 hover:text-graphite-900"
            >
              Circuiti
            </Link>
            {loggedIn ? (
              <Link href="/dashboard" className="btn-primary mt-2 justify-center">
                Il mio garage
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-2 py-2 transition hover:bg-graphite-50 hover:text-graphite-900"
                >
                  Accedi
                </Link>
                <Link href="/registrati" className="btn-primary mt-2 justify-center">
                  Registrati
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
