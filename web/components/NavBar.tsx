"use client";

import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { useScrolled } from "@/lib/useScrolled";

export default function NavBar() {
  const scrolled = useScrolled();

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-white/90 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "border-graphite-200 shadow-sm shadow-graphite-900/5" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-graphite-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-base text-white shadow-sm shadow-brand-600/30">M</span>
          <span>My<span className="text-brand-600">Vehicle</span></span>
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}
