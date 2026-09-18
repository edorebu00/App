/**
 * Service worker di My Vehicle.
 *
 * Serve a due cose: rendere l'app installabile (Chrome lo pretende, con un gestore di `fetch`)
 * e dare una pagina decente quando il telefono è offline invece dell'errore del browser.
 *
 * È deliberatamente prudente. Un service worker troppo aggressivo su un'app con login e
 * contenuti per utente è un ottimo modo per servire a qualcuno i dati di una sessione
 * precedente, o per lasciare tutti bloccati su una versione vecchia: qui non si mette mai in
 * cache nulla che riguardi l'autenticazione, le API o una pagina con dati personali.
 */

const VERSION = "v1";
const SHELL_CACHE = `shell-${VERSION}`;
const ASSET_CACHE = `assets-${VERSION}`;
const OFFLINE_URL = "/offline";

/**
 * Risorse statiche del guscio, messe in cache all'installazione. Solo la pagina offline: le
 * icone hanno l'impronta nel nome (cambiano a ogni cambio di logo) e la pagina offline non ne
 * usa nessuna, quindi elencarle qui sarebbe solo un riferimento da tenere aggiornato a mano.
 */
const SHELL_ASSETS = [OFFLINE_URL];

/**
 * Percorsi che non devono MAI passare dalla cache: sessione, scambio del codice OAuth e le
 * route IA. Servire una risposta vecchia qui significherebbe, nel migliore dei casi, una
 * risposta sbagliata; nel peggiore, dati di un altro accesso.
 */
const NEVER_CACHE = ["/api/", "/auth/"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS))
      // Se una risorsa del guscio non c'è, l'installazione non deve fallire: il service
      // worker serve comunque da fallback di rete.
      .catch(() => undefined)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== SHELL_CACHE && k !== ASSET_CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Solo GET: le POST (chat, ricerca, upload) non si mettono in cache né si riprovano.
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Nulla di cross-origin: Supabase Storage e le API esterne restano affare del browser.
  if (url.origin !== self.location.origin) return;

  if (NEVER_CACHE.some((prefix) => url.pathname.startsWith(prefix))) return;

  // Asset immutabili di Next (hash nel nome): cache-first, è il caso in cui conviene davvero.
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(ASSET_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
    return;
  }

  // Navigazione fra pagine: sempre dalla rete, perché il contenuto dipende da chi ha fatto
  // l'accesso. Offline si mostra la pagina dedicata, mai una copia in cache di dati altrui.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
  }
});
