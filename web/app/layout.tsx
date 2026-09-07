import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import "./globals.css";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "My Vehicle",
  description: "Gestisci e approfondisci i tuoi veicoli: motore, carrozzeria, assetto, impianto frenante e altro.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={rajdhani.variable}>
      <body>{children}</body>
    </html>
  );
}
