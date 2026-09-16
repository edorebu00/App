"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { CIRCUITS } from "@/lib/circuits";
import CircuitCard from "./CircuitCard";

export default function CircuitCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("circuitsSection");

  function scrollByCards(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-graphite-900">
            {t("carouselTitle")}
          </h2>
          <p className="mt-1 text-sm text-graphite-500">
            {t("carouselSubtitle")}
          </p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            className="btn-secondary h-9 w-9 !p-0 text-base"
            aria-label={t("prev")}
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            className="btn-secondary h-9 w-9 !p-0 text-base"
            aria-label={t("next")}
          >
            →
          </button>
        </div>
      </div>

      <div className="track-carousel-fade">
        <div ref={scrollerRef} className="track-carousel scrollbar-hide">
          {CIRCUITS.map((circuit) => (
            <CircuitCard key={circuit.slug} circuit={circuit} />
          ))}
        </div>
      </div>
    </section>
  );
}
