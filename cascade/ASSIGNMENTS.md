Data (UTC): 2026-09-26

Versione finale e vincolante della divisione dei task di `cascade/TASKS.md`. I lavoratori modificano
SOLO i file elencati come ammessi nella propria sezione. U1 e U2 non sono assegnati.

## Accordo con l'agente 2

Divisione confermata senza modifiche: Lavoratore 4 = T2 + T3, Lavoratore 5 = T1, Lavoratore 6 = T4.
Verifica indipendente (file aperti sotto `web/`):
- (a) Ogni task assegnabile (T1-T4) e' assegnato esattamente una volta; U1/U2 restano fuori.
- (b) Insiemi di file disgiunti: `web/lib/vehicleData.ts` (L4), `web/middleware.ts` (L5), `web/lib/motorsport.ts` (L6).
  Righe citate in TASKS.md verificate: MG4 576-580, Bigster 1127-1131, Peugeot 508 2008-2012, GR Corolla 2306,
  middleware 44-48, `extractBriefing`/`fetchBriefing` in motorsport.ts. Nessun import incrociato fra i tre file.
- (c) Carico: L4 ha piu' righe ma sono voci di dati meccaniche nello stesso oggetto; L5 e L6 hanno una modifica
  logica ciascuno. Accettabile: il vincolo del file condiviso prevale.
- (d) I task indicano valori, posizioni e criteri esatti: eseguibili senza interpretazione.
- (e) Nessun task tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file generati, e nessuno
  richiede migrazioni, secret nuovi o scelte di design. T1 (rafforzamento sulla gestione della sessione, solo
  codice sotto `web/`) e' assegnabile ed e' il primo task del suo gruppo.
- (f) PR aperte al momento della verifica: nessuna (0). Nessun task rimosso.

Risposte ai "Punti da confermare all'agente 3":
1. Lo sbilanciamento del Lavoratore 4 e' accettato: una sola PR con due commit distinti (prima T2, poi T3).
2. Confermato: per T1 l'unico file modificabile e' `web/middleware.ts`. `GlobalSearch.tsx`, `VehicleDetailTabs.tsx`,
   `ChatPanel.tsx` e `FileUploader.tsx` si leggono solo per la verifica. Nota di verifica aggiunta: anche
   `web/components/FileUploader.tsx` chiama `/api/agent/process-document`; con il 401 la risposta non e' piu'
   `ok` e il componente registra correttamente l'esito "non avviato" invece di considerarla riuscita.
   Le tre route agent hanno gia' il proprio 401; non esistono route `/api/` che debbano restare pubbliche.

## Lavoratore 4

Branch: `claude/worker-4-2026-09-26`

File ammessi: `web/lib/vehicleData.ts` (solo `ENGINE_DATA`: voci MG4, Dacia Bigster, Toyota GR Corolla, Peugeot 508).

Ordine di esecuzione: 1) T2 (commit dedicato); 2) T3 (commit dedicato).

## T2 — Catalogo: MG4 64 kWh, Dacia Bigster GPL e anno 2022 della Toyota GR Corolla
Gravita': Importante
File: `web/lib/vehicleData.ts:576-580` (MG4), `web/lib/vehicleData.ts:1127-1131` (Bigster), `web/lib/vehicleData.ts:2306` (GR Corolla)
Problema: il campo motore e' un menu obbligatorio senza voce "altro" e gli anni seguono la voce scelta.
Il proprietario di una MG4 64 kWh non trova il suo motore; quello di una Bigster a GPL deve salvarla come
benzina; una GR Corolla immatricolata nel 2022 non puo' indicare il suo anno (voce aggiunta dalla PR #56 con `yearFrom: 2023`).
Correzione richiesta: in ENGINE_DATA aggiungere a `MG4` `{ label: "Elettrica Long Range 204cv", yearFrom: 2022, yearTo: null }`
(fra la Standard e la Extended); aggiungere a `Bigster` `{ label: "1.2 TCe ECO-G 140cv GPL", yearFrom: 2025, yearTo: null }`;
portare `yearFrom` di `"GR Corolla"` da 2023 a 2022. Non toccare altri modelli.
Criterio di accettazione: `getEngineVariants("auto", "MG", "MG4")` restituisce 4 voci incluse quella da 204cv;
`getEngineVariants("auto", "Dacia", "Bigster")` restituisce 4 voci inclusa quella GPL;
`getEngineVariants("auto", "Toyota", "GR Corolla")` ha `yearFrom: 2022`; lint e typecheck passano.

## T3 — Peugeot 508: aggiungi le motorizzazioni della prima generazione (2010-2018)
Gravita': Importante
File: `web/lib/vehicleData.ts:2008-2012` (ENGINE_DATA.auto.Peugeot["508"])
Problema: la chiave "508" copre entrambe le generazioni ma le voci partono dal 2018: una 508 del 2014 non
puo' registrare ne' il motore ne' l'anno (scelta una voce, il menu degli anni parte dal 2018).
Correzione richiesta: aggiungere in testa all'elenco, nello stesso formato delle voci esistenti:
`{ label: "1.6 VTi 120cv", yearFrom: 2010, yearTo: 2014 }`, `{ label: "1.6 THP 156cv", yearFrom: 2010, yearTo: 2018 }`,
`{ label: "1.6 e-HDi 112cv", yearFrom: 2011, yearTo: 2014 }`, `{ label: "2.0 HDi 140cv", yearFrom: 2010, yearTo: 2014 }`,
`{ label: "2.0 HDi 163cv", yearFrom: 2010, yearTo: 2014 }`, `{ label: "2.2 HDi 204cv", yearFrom: 2011, yearTo: 2014 }`,
`{ label: "2.0 HDi Hybrid4 200cv", yearFrom: 2012, yearTo: 2018 }`, `{ label: "1.6 BlueHDi 120cv", yearFrom: 2014, yearTo: 2018 }`,
`{ label: "2.0 BlueHDi 150cv", yearFrom: 2014, yearTo: 2018 }`, `{ label: "2.0 BlueHDi 180cv", yearFrom: 2014, yearTo: 2018 }`.
Lasciare invariate le tre voci esistenti.
Criterio di accettazione: `getEngineVariants("auto", "Peugeot", "508")` restituisce 13 voci senza etichette
duplicate e con almeno una voce che copre ogni anno dal 2010 al 2018; lint e typecheck passano.

Criteri di accettazione complessivi: quelli di T2 e T3; nessuna altra voce di `ENGINE_DATA` modificata;
`npm run lint` e `npx tsc --noEmit` in `web/` passano.

## Lavoratore 5

Branch: `claude/worker-5-2026-09-26`

File ammessi: `web/middleware.ts`.

Ordine di esecuzione: 1) T1 (unico task, rafforzamento: va eseguito per primo).

## T1 — Middleware: risposta 401 JSON per le API invece del rinvio alla pagina di login
Gravita': Minore (in cima perche' e' un intervento di rafforzamento sulla gestione della sessione)
File: `web/middleware.ts:44-48`; chiamanti `web/components/GlobalSearch.tsx:36-54`, `web/components/VehicleDetailTabs.tsx:72-80`, `web/components/ChatPanel.tsx:61-69`
Problema: senza sessione valida anche le richieste a `/api/*` vengono reindirizzate a `/login`. Il client
riceve HTML, `res.json()` fallisce e la ricerca mostra "servizio non raggiungibile" invece di un errore di
sessione; le route agent hanno gia' il loro 401 JSON (`notAuthenticated`) che pero' non viene mai raggiunto.
Correzione richiesta: in `middleware.ts`, quando `!user && !isPublic` e `request.nextUrl.pathname` inizia
con `/api/`, restituire `NextResponse.json({ error: "Not authenticated" }, { status: 401 })` invece del
redirect; il comportamento per le pagine resta invariato. Non rendere pubblico alcun percorso `/api/`.
Lasciare in ChatPanel il ramo `res.redirected` (innocuo). Verificare che con 401 la chat tolga la bolla e
rimetta il testo nel campo (`data !== null && !data.userMessageSaved` -> `restoreUnsent()`).
Criterio di accettazione: una POST a `/api/agent/search` senza cookie di sessione riceve 401 con corpo JSON
(nessun header `Location`); una GET a `/dashboard` senza sessione e' ancora reindirizzata a `/login`;
`npm run lint` e `npx tsc --noEmit` (in `web/`) passano.

Criteri di accettazione complessivi: quelli di T1; nessun percorso aggiunto a `PUBLIC_EXACT_PATHS` o
`PUBLIC_PREFIX_PATHS`; `matcher` invariato; lint e typecheck passano.

## Lavoratore 6

Branch: `claude/worker-6-2026-09-26`

File ammessi: `web/lib/motorsport.ts`.

Ordine di esecuzione: 1) T4 (unico task).

## T4 — Riquadro motorsport: non mettere in cache per 24 ore una risposta senza `submit_briefing`
Gravita': Minore
File: `web/lib/motorsport.ts:96-101` (`extractBriefing`), `web/lib/motorsport.ts:123-166` (`fetchBriefing`)
Problema: se la risposta del modello non contiene la chiamata a `submit_briefing` (tetto di token,
`pause_turn`, sola risposta testuale), `extractBriefing` restituisce `EMPTY` senza errore e `unstable_cache`
conserva il riquadro vuoto per 24 ore; la pausa con nuovo tentativo di `getMotorsportBriefing` non scatta.
Correzione richiesta: in `extractBriefing`, quando manca il blocco `tool_use` di `submit_briefing` (o il suo
`input` non e' un oggetto), lanciare un `Error` con `stop_reason` nel messaggio (passarlo come parametro da
`fetchBriefing`) invece di restituire `EMPTY`. Un `submit_briefing` con `news: []` resta un risultato valido
e va ancora in cache. Non cambiare `max_tokens`, i tentativi ne' la durata della cache.
Criterio di accettazione: con un `content` privo di `submit_briefing`, `fetchBriefing` rifiuta la promessa
(quindi `getMotorsportBriefing` passa dal `catch`, registra la pausa e restituisce `EMPTY` senza memorizzarlo);
con `submit_briefing` e `news: []` restituisce `{ news: [] }`; lint e typecheck passano.

Criteri di accettazione complessivi: quelli di T4; `getMotorsportBriefing`, `max_tokens`, tentativi e
`CACHE_SECONDS` invariati; lint e typecheck passano.

## Richiede intervento umano

- U1 — Limite d'uso condiviso fra le istanze: richiede una migrazione in `supabase/` (non assegnato).
- U2 — Pausa condivisa del riquadro motorsport: richiede una scelta di design (non assegnato).
