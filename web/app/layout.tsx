import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "My Vehicle",
  description: "Gestisci e approfondisci i tuoi veicoli: motore, carrozzeria, assetto, impianto frenante e altro.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
