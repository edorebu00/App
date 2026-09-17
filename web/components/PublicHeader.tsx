"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useScrolled } from "@/lib/useScrolled";
import LanguageSwitcher from "./LanguageSwitcher";

export default function PublicHeader({ loggedIn }: { loggedIn: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const scrolled = useScrolled();
  const t = useTranslations("publicHeader");
  const tNav = useTranslations("nav");

  const NAV_LINKS = [
    { href: "/", label: tNav("home") },
    { href: "/circuiti", label: tNav("circuits") },
  ];

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-graphite-50/80 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "border-graphite-200 shadow-sm shadow-black/30" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-graphite-900"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-b from-brand-500 to-brand-400 text-base font-semibold text-graphite-50 shadow-sm shadow-black/40">M</span>
          <span>My<span className="text-brand-500">Vehicle</span></span>
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
          <LanguageSwitcher />
          {loggedIn ? (
            <Link href="/dashboard" className="btn-primary">
              {t("myGarage")}
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-graphite-600 transition hover:text-graphite-900">
                {t("login")}
              </Link>
              <Link href="/registrati" className="btn-primary">
                {t("register")}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 sm:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-graphite-600 hover:bg-graphite-100 hover:text-graphite-900"
            aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
            aria-expanded={menuOpen}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
              {menuOpen ? (
                <path d="M4 4 L14 14 M14 4 L4 14" />
              ) : (
                <path d="M2.5 5 H15.5 M2.5 9 H15.5 M2.5 13 H15.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-graphite-200 bg-graphite-50 px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-1 text-sm font-medium text-graphite-600">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-2 transition hover:bg-graphite-50 hover:text-graphite-900"
              >
                {link.label}
              </Link>
            ))}
            {loggedIn ? (
              <Link href="/dashboard" className="btn-primary mt-2 justify-center">
                {t("myGarage")}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-md px-2 py-2 transition hover:bg-graphite-50 hover:text-graphite-900"
                >
                  {t("login")}
                </Link>
                <Link href="/registrati" className="btn-primary mt-2 justify-center">
                  {t("register")}
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
