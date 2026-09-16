"use client";

import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/i18n/locales";

const LOCALE_COOKIE = "locale";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function setLocale(next: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; SameSite=Lax`;
    setOpen(false);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={isPending}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm font-medium text-graphite-600 transition hover:bg-graphite-100 hover:text-graphite-900 disabled:opacity-60"
      >
        <span aria-hidden>🌐</span>
        <span className="uppercase">{locale}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden />
          <ul
            role="listbox"
            className="absolute right-0 z-50 mt-1 w-36 overflow-hidden rounded-lg border border-graphite-200 bg-white py-1 shadow-lg shadow-graphite-900/10"
          >
            {LOCALES.map((l) => (
              <li key={l}>
                <button
                  type="button"
                  role="option"
                  aria-selected={l === locale}
                  onClick={() => setLocale(l)}
                  className={`flex w-full items-center justify-between px-3 py-1.5 text-left text-sm transition ${
                    l === locale ? "bg-brand-50 font-medium text-brand-700" : "text-graphite-600 hover:bg-graphite-50"
                  }`}
                >
                  {LOCALE_LABELS[l]}
                  {l === locale && <span aria-hidden>✓</span>}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
