"use client";

import { useRef } from "react";

type Track = {
  id: string;
  title: string;
  tagline: string;
  d: string;
  viewBox: string;
  start: [number, number];
};

const TRACKS: Track[] = [
  {
    id: "gp",
    title: "Gran Premio",
    tagline: "Rettilineo lungo e curve ad alta velocita'",
    viewBox: "0 0 300 180",
    d: "M40 130 C20 100 20 60 50 45 C80 30 110 55 140 50 C170 45 180 20 210 22 C250 25 265 55 250 80 C238 100 205 95 195 115 C185 135 200 155 175 162 C140 172 100 168 70 158 C50 151 52 142 40 130 Z",
    start: [40, 130],
  },
  {
    id: "citta",
    title: "Circuito Cittadino",
    tagline: "Curve a 90 gradi tra i palazzi",
    viewBox: "0 0 300 180",
    d: "M30 40 L200 40 L200 90 L120 90 L120 150 L260 150 L260 100 L230 100 L230 60 L270 60 M30 40 L30 150 L90 150",
    start: [30, 40],
  },
  {
    id: "rally",
    title: "Rally di Montagna",
    tagline: "Tornanti stretti in salita",
    viewBox: "0 0 300 180",
    d: "M20 160 C40 120 15 100 35 70 C55 40 90 55 95 30 C100 10 130 8 150 25 C170 42 155 65 175 80 C200 98 235 75 255 95 C275 115 265 145 235 150 C205 155 190 130 165 140 C140 150 145 170 115 168 C85 166 70 150 20 160 Z",
    start: [20, 160],
  },
  {
    id: "endurance",
    title: "Endurance 24h",
    tagline: "Chicane tecniche, tanti doppiaggi",
    viewBox: "0 0 300 180",
    d: "M35 100 C25 70 45 40 80 38 C110 36 115 60 140 60 C165 60 165 35 195 35 C230 35 250 60 245 85 C240 108 210 100 200 120 C190 140 210 155 190 168 C165 184 125 175 100 160 C75 145 80 125 60 120 C45 116 42 112 35 100 Z",
    start: [35, 100],
  },
  {
    id: "costa",
    title: "Pista Costiera",
    tagline: "Serie di esse lungo il mare",
    viewBox: "0 0 300 180",
    d: "M25 90 C55 60 55 120 85 120 C115 120 115 60 145 60 C175 60 175 120 205 120 C235 120 235 60 270 60",
    start: [25, 90],
  },
];

function TrackIllustration({ track }: { track: Track }) {
  return (
    <svg
      viewBox={track.viewBox}
      className="h-full w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d={track.d} stroke="#3f3f46" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d={track.d}
        stroke="#f5c400"
        strokeWidth="1.5"
        strokeDasharray="6 7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
      <g transform={`translate(${track.start[0] - 6}, ${track.start[1] - 6})`}>
        <rect width="12" height="12" fill="#f4f4f5" />
        <rect width="6" height="6" fill="#0c0c0e" />
        <rect x="6" y="6" width="6" height="6" fill="#0c0c0e" />
      </g>
    </svg>
  );
}

export default function TrackCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollByCards(direction: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  }

  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-graphite-200">
            🏁 Circuiti leggendari
          </h2>
          <p className="text-sm text-graphite-500">Un giro d&apos;onore prima di rimetterti in pista.</p>
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
          {TRACKS.map((track, i) => (
            <div key={track.id} className={`track-card ${i % 2 === 0 ? "track-card-tilt-a" : "track-card-tilt-b"}`}>
              <div className="track-card-inner">
                <TrackIllustration track={track} />
              </div>
              <div className="mt-3">
                <p className="font-display text-sm font-semibold uppercase tracking-wide text-graphite-100">
                  {track.title}
                </p>
                <p className="mt-0.5 text-xs text-graphite-500">{track.tagline}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
