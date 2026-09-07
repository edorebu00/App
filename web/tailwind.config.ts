import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Rosso "livrea da corsa": accento primario dell'app
        brand: {
          50: "#2b0b0a",
          100: "#3d0f0d",
          200: "#5c130f",
          300: "#7d1811",
          400: "#ff6b57",
          500: "#ff4433",
          600: "#ff2d1a",
          700: "#e01f0f",
          800: "#b3170a",
          900: "#7d0f06",
        },
        // Scala neutra scura per sfondi/testo (tema "carbonio")
        graphite: {
          50: "#f4f4f5",
          100: "#e4e4e7",
          200: "#c7c7cc",
          300: "#9d9da5",
          400: "#75757e",
          500: "#55555e",
          600: "#3d3d44",
          700: "#28282d",
          800: "#1a1a1d",
          900: "#0c0c0e",
        },
        flag: "#f5c400",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
