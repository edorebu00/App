import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Vehicle",
  description: "Gestisci e approfondisci i tuoi veicoli: motore, carrozzeria, assetto, impianto frenante e altro.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
