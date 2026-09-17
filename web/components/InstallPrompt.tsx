"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Invito a installare l'app sulla schermata Home.
 *
 * I due sistemi si comportano in modo diverso e vanno trattati separatamente:
 * - Android/Chrome espone l'evento `beforeinstallprompt`, che si può intercettare per mostrare
 *   un pulsante e far comparire la finestra di sistema al momento giusto.
 * - iOS non ha nulla di simile: l'installazione passa per il menu Condividi di Safari, quindi
 *   l'unica cosa utile è spiegare all'utente dove guardare.
 *
 * In entrambi i casi l'invito sparisce se l'app è già installata e non torna più se viene
 * chiuso: un banner che si ripresenta a ogni visita è peggio di non averlo.
 */

const DISMISSED_KEY = "mv-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Vero quando l'app gira già come applicazione installata, non dentro il browser. */
function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS non implementa display-mode e usa una proprietà tutta sua.
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

function isIos() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

/** Lettura difensiva: in navigazione privata o con i dati del sito bloccati solleva eccezione. */
function wasDismissed() {
  try {
    return localStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

export default function InstallPrompt() {
  const t = useTranslations("install");
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone() || wasDismissed()) return;

    if (isIos()) {
      setShowIosHint(true);
      return;
    }

    const onBeforeInstall = (e: Event) => {
      // Senza preventDefault Chrome mostra il suo invito quando decide lui: intercettandolo
      // si può proporlo nel punto giusto dell'interfaccia.
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setDeferred(null);
      setShowIosHint(false);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  function dismiss() {
    setDeferred(null);
    setShowIosHint(false);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Niente da fare: l'invito ricomparirà alla prossima visita.
    }
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    // L'evento si può usare una sola volta, qualunque sia la scelta.
    setDeferred(null);
  }

  if (!deferred && !showIosHint) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 sm:left-auto sm:right-4 sm:w-80">
      <div className="card flex items-start gap-3 shadow-lg shadow-black/40">
        <span className="icon-badge shrink-0" aria-hidden>
          📲
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-semibold text-graphite-900">{t("title")}</p>
          <p className="mt-1 text-xs text-graphite-500">{showIosHint ? t("iosSteps") : t("text")}</p>

          <div className="mt-3 flex gap-2">
            {deferred && (
              <button onClick={install} className="btn-primary px-3 py-1.5 text-xs">
                {t("cta")}
              </button>
            )}
            <button onClick={dismiss} className="btn-secondary px-3 py-1.5 text-xs">
              {t("dismiss")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
