"use client";

import { useEffect } from "react";

/**
 * Registra il service worker. Sta in un componente a parte e non nel layout perché la
 * registrazione va fatta dal browser, dopo il caricamento, e non deve rallentare il primo
 * disegno della pagina.
 *
 * In sviluppo non si registra: un service worker attivo durante il lavoro serve pagine vecchie
 * e fa perdere tempo a capire perché una modifica "non si vede".
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registrazione fallita (contesto non sicuro, impostazioni del browser): l'app
        // funziona comunque, perde solo l'installabilità e la pagina offline.
      });
    };

    if (document.readyState === "complete") register();
    else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
