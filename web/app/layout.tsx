import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import InstallPrompt from "@/components/InstallPrompt";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
});

// Serif editoriale per titoli e logotipo: da' carattere ed esclusivita' al brand
// invece del solito sans-serif geometrico usato ovunque nel SaaS "moderno".
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

/**
 * `viewport-fit=cover` e le safe area servono quando l'app gira installata a schermo intero:
 * senza, il contenuto finisce sotto la tacca e sotto la barra di sistema di iPhone.
 * `themeColor` colora la barra di stato in modo che si confonda con lo sfondo dell'app.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0908",
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return {
    title: t("title"),
    description: t("description"),
    applicationName: "My Vehicle",
    appleWebApp: {
      // Su iOS è questo, non il manifest, a far aprire l'app senza barra del browser.
      capable: true,
      title: "My Vehicle",
      statusBarStyle: "black-translucent",
    },
    formatDetection: { telephone: false },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${fraunces.variable}`}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <InstallPrompt />
        </NextIntlClientProvider>
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
