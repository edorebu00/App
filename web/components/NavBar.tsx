"use client";

import Link from "next/link";
import LogoutButton from "./LogoutButton";
import LanguageSwitcher from "./LanguageSwitcher";
import { useScrolled } from "@/lib/useScrolled";

export default function NavBar() {
  const scrolled = useScrolled();

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-graphite-50/85 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "border-graphite-200 shadow-sm shadow-black/30" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-graphite-900">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-b from-brand-500 to-brand-400 text-base font-semibold text-graphite-50 shadow-sm shadow-black/40">M</span>
          <span>My<span className="text-brand-600">Vehicle</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
