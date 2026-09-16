export type CircuitFact = { labelKey: string; value: string };

export type Circuit = {
  slug: string;
  officialUrl: string;
  /** Traccia stilizzata (approssimazione della sagoma reale, non un tracciato GPS esatto). */
  d: string;
  viewBox: string;
  start: [number, number];
};

/**
 * Geometria e link ufficiale dei circuiti (dati non testuali, non tradotti). Nome, paese,
 * tagline, storia e dati (facts) sono nei cataloghi di traduzione in messages/{locale}.json
 * sotto la chiave "circuitsData.<slug>", cosi' il contenuto e' disponibile in tutte le lingue.
 */
export const CIRCUITS: Circuit[] = [
  {
    slug: "monza",
    officialUrl: "https://www.monzanet.it",
    viewBox: "0 0 300 180",
    d: "M40 130 C20 100 20 60 50 45 C80 30 110 55 140 50 C170 45 180 20 210 22 C250 25 265 55 250 80 C238 100 205 95 195 115 C185 135 200 155 175 162 C140 172 100 168 70 158 C50 151 52 142 40 130 Z",
    start: [40, 130],
  },
  {
    slug: "spa-francorchamps",
    officialUrl: "https://www.spa-francorchamps.be",
    viewBox: "0 0 300 180",
    d: "M30 150 C25 120 45 110 55 90 C65 70 50 55 65 40 C80 25 110 30 125 45 C140 60 160 50 175 35 C195 15 225 20 235 45 C245 70 225 85 235 105 C245 125 270 120 265 95 C270 130 240 155 200 158 C160 161 120 150 90 158 C65 164 35 175 30 150 Z",
    start: [30, 150],
  },
  {
    slug: "silverstone",
    officialUrl: "https://www.silverstone.co.uk",
    viewBox: "0 0 300 180",
    d: "M35 60 C35 40 55 30 80 32 C100 34 105 50 125 52 C145 54 150 35 170 32 C195 28 210 45 200 62 C192 76 210 80 225 70 C245 57 265 70 260 92 C255 112 230 108 220 125 C210 142 185 148 165 138 C148 130 140 145 118 148 C90 152 70 165 50 150 C32 137 35 118 45 100 C52 88 35 78 35 60 Z",
    start: [35, 60],
  },
  {
    slug: "nurburgring-nordschleife",
    officialUrl: "https://www.nuerburgring.de",
    viewBox: "0 0 300 180",
    d: "M20 100 C15 80 30 70 25 55 C20 38 40 30 55 40 C70 50 65 65 80 68 C100 72 95 45 115 40 C135 35 150 55 140 72 C132 86 150 90 165 78 C185 62 210 70 205 92 C201 110 220 108 235 95 C255 78 275 90 270 112 C265 132 245 130 235 148 C225 165 200 168 185 155 C172 144 155 158 135 155 C110 151 100 168 75 162 C50 156 45 135 55 118 C63 104 45 98 35 108 C25 118 24 118 20 100 Z",
    start: [20, 100],
  },
  {
    slug: "le-mans",
    officialUrl: "https://www.24h-lemans.com",
    viewBox: "0 0 300 180",
    d: "M30 70 C30 50 50 42 70 45 C120 52 260 55 270 70 C278 82 270 95 250 95 C200 95 90 92 65 100 C45 106 40 120 55 130 C75 143 140 138 165 145 C185 150 190 165 170 170 C140 177 70 172 45 155 C25 141 22 120 28 100 C31 90 30 80 30 70 Z",
    start: [30, 70],
  },
  {
    slug: "suzuka",
    officialUrl: "https://www.suzukacircuit.jp",
    viewBox: "0 0 300 180",
    d: "M40 60 C60 40 90 40 105 60 C120 80 145 80 150 60 C155 40 180 25 205 35 C230 45 235 70 215 85 C195 100 195 120 215 130 C235 140 230 160 205 165 C180 170 155 155 150 130 C145 105 120 105 105 130 C90 155 60 160 45 140 C30 120 45 100 65 95 C85 90 85 75 65 75 C50 75 30 78 40 60 Z",
    start: [40, 60],
  },
];

export function getCircuit(slug: string): Circuit | undefined {
  return CIRCUITS.find((c) => c.slug === slug);
}
