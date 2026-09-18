import type { MetadataRoute } from "next";
import { APP_ICONS } from "@/lib/appIcons";

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
    // I percorsi arrivano da un modulo generato insieme alle icone e contengono l'impronta del
    // logo: cambiando il logo cambia il manifest, ed e' l'unico modo perche' Chrome aggiorni
    // l'icona gia' installata sulla schermata Home. Le "maskable" sono dichiarate a parte
    // perche' Android ritaglia l'icona con forme diverse e usa quelle, che hanno il margine.
    icons: APP_ICONS,
    shortcuts: [
      { name: "Aggiungi veicolo", short_name: "Aggiungi", url: "/veicoli/nuovo" },
      { name: "Ricerca IA", short_name: "Ricerca", url: "/ricerca" },
    ],
  };
}
