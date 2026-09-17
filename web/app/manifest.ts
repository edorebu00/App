import type { MetadataRoute } from "next";

/**
 * Manifest della PWA: è quello che permette di installare l'app dalla schermata Home e di
 * aprirla senza la barra del browser.
 *
 * Il testo resta in italiano e non tradotto: il manifest è un file statico servito una volta
 * sola, mentre la lingua dell'app dipende da un cookie per utente. Tradurlo richiederebbe un
 * manifest per lingua e un `<link rel="manifest">` dinamico — complicazione che non ripaga per
 * un nome e una descrizione brevi.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My Vehicle — il tuo garage",
    short_name: "My Vehicle",
    description:
      "Gestisci auto e moto: schede tecniche, documenti, assistente IA e i circuiti più leggendari.",
    start_url: "/dashboard",
    // Se non c'è una sessione attiva il middleware rimanda al login: start_url punta comunque
    // al garage, così chi è già entrato apre l'app dove gli serve.
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#0a0908",
    theme_color: "#0a0908",
    lang: "it",
    dir: "ltr",
    categories: ["productivity", "lifestyle", "utilities"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Le maskable vanno dichiarate a parte: Android ritaglia l'icona con forme diverse a
      // seconda del telefono e usa queste, che hanno il margine di sicurezza.
      { src: "/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Aggiungi veicolo", short_name: "Aggiungi", url: "/veicoli/nuovo" },
      { name: "Ricerca IA", short_name: "Ricerca", url: "/ricerca" },
    ],
  };
}
