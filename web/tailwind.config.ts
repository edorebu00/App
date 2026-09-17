import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Accento primario: champagne/bronzo, ispirato a orologeria e case automobilistiche
        // di lusso (non un giallo "oro" saturo: e' smorzato, quasi metallico).
        brand: {
          50: "#2b2415",
          100: "#3c3119",
          200: "#5e4c22",
          300: "#8c7030",
          400: "#b6913f",
          500: "#cca558",
          600: "#d9b671",
          700: "#e6cb95",
          800: "#f0ddb8",
          900: "#f8ecd6",
        },
        // Scala neutra calda. ATTENZIONE: invertita rispetto alla convenzione Tailwind
        // (di norma 50 = piu' chiaro, 900 = piu' scuro): qui 50 e' il nero piu' profondo e
        // 900 e' l'avorio piu' chiaro. La app e' passata da tema chiaro a tema scuro senza
        // rinominare le classi (text-graphite-900, border-graphite-200, ecc. gia' usate
        // ovunque per testo/bordi restano semanticamente corrette), quindi la scala e'
        // stata capovolta invece di rinominata: non "correggere" l'ordine senza aggiornare
        // ogni utilizzo.
        graphite: {
          50: "#0a0908",
          100: "#141210",
          200: "#211e1a",
          300: "#332e27",
          400: "#5c5347",
          500: "#8a8072",
          600: "#a89e8f",
          700: "#c4bcae",
          800: "#e0dad0",
          900: "#f6f2ea",
        },
        // Accento secondario caldo (rame/ambra), per link e badge "di valore" — distinto
        // dal brand champagne cosi' le due funzioni restano leggibili una dall'altra.
        gold: {
          50: "#241708",
          100: "#331f0a",
          200: "#54300f",
          300: "#804a17",
          400: "#a8631f",
          500: "#c97f2e",
          600: "#d99a4f",
          700: "#e6b578",
          800: "#f0d0a8",
          900: "#f9e8d2",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
