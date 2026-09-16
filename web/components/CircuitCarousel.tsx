"use client";

import { useRef } from "react";
import { CIRCUITS } from "@/lib/circuits";
import CircuitCard from "./CircuitCard";

export default function CircuitCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCards(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="eyebrow">Motorsport</p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-graphite-900">
            I circuiti più leggendari
          </h2>
          <p className="mt-1 text-sm text-graphite-500">
            Scegline uno per scoprirne la storia e i link alle gare in programma.
          </p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollByCards(-1)}
            className="btn-secondary h-9 w-9 !p-0 text-base"
            aria-label="Indietro"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByCards(1)}
            className="btn-secondary h-9 w-9 !p-0 text-base"
            aria-label="Avanti"
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
