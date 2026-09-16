"use client";

import Link from "next/link";
import { useState } from "react";

export default function PublicHeader({ loggedIn }: { loggedIn: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-graphite-800/80 bg-graphite-900/75 shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-xl font-bold uppercase tracking-[0.08em] text-white"
        >
          <span className="grid h-8 w-8 place-items-center rounded bg-brand-600 text-base shadow-lg shadow-brand-900/50">M</span>
          <span><span className="text-brand-500">My</span>Vehicle</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-graphite-300 sm:flex">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <Link href="/circuiti" className="transition hover:text-white">
            Circuiti
          </Link>
        </nav>
        <div className="hidden items-center gap-3 sm:flex">
          {loggedIn ? (
            <Link href="/dashboard" className="btn-primary">
              Il mio garage
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-graphite-300 transition hover:text-white">
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
          className="flex h-9 w-9 items-center justify-center rounded-md text-graphite-300 hover:bg-graphite-800 hover:text-white sm:hidden"
          aria-label={menuOpen ? "Chiudi il menu" : "Apri il menu"}
          aria-expanded={menuOpen}
        >
          <span className="text-xl" aria-hidden>
            {menuOpen ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-graphite-800 bg-graphite-900 px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-1 text-sm font-medium text-graphite-300">
            <Link href="/" className="rounded-md px-2 py-2 transition hover:bg-graphite-800 hover:text-white">
              Home
            </Link>
            <Link
              href="/circuiti"
              className="rounded-md px-2 py-2 transition hover:bg-graphite-800 hover:text-white"
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
                  className="rounded-md px-2 py-2 transition hover:bg-graphite-800 hover:text-white"
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

      <div className="flag-stripe" />
    </header>
  );
}
