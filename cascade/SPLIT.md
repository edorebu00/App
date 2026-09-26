Data (UTC): 2026-09-26

Suddivisione dei 4 task di `cascade/TASKS.md` fra i lavoratori 4, 5 e 6. Nessun task della sezione
"Richiede intervento umano" e' stato assegnato (U1, U2 restano fuori).

## Lavoratore 4 — T2 + T3

Task: T2 (Catalogo: MG4 64 kWh, Bigster GPL, anno 2022 GR Corolla), T3 (Peugeot 508 prima generazione)

File previsti: `web/lib/vehicleData.ts` (unico file toccato da entrambi i task; T2 alle righe 576-580,
1127-1131, 2306; T3 alle righe 2008-2012 — blocchi distanti nello stesso file).

Motivazione: T2 e T3 modificano lo stesso file (`ENGINE_DATA` in `vehicleData.ts`), come gia' segnalato
dalla nota di coordinamento in TASKS.md; per il criterio (a) (insiemi di file disgiunti fra i tre gruppi)
devono stare nello stesso lavoratore, altrimenti due PR toccherebbero lo stesso file e rischierebbero
conflitti/merge in ordine arbitrario. Nessuna dipendenza reale fra i due (blocchi di `ENGINE_DATA` diversi:
MG/Dacia/Toyota per T2, Peugeot per T3): possono essere eseguiti in un ordine qualsiasi all'interno dello
stesso branch, ma vanno applicati come commit distinti per chiarezza.

Rischi/conflitti: e' il gruppo con piu' modifiche testuali (due gravita' "Importante", tre modelli diversi
in T2 + dieci voci nuove in T3); nessun altro gruppo tocca `vehicleData.ts quindi nessun conflitto atteso
con gli altri due lavoratori. Attenzione a non toccare le tre voci Peugeot 508 gia' esistenti (T3) ne' le
voci di altri modelli oltre MG4/Bigster/GR Corolla (T2).

## Lavoratore 5 — T1

Task: T1 (Middleware: risposta 401 JSON per le API invece del rinvio a `/login`)

File previsti: `web/middleware.ts` (unica modifica). `web/components/GlobalSearch.tsx`,
`web/components/VehicleDetailTabs.tsx` e `web/components/ChatPanel.tsx` sono citati in TASKS.md solo come
chiamanti che beneficiano della correzione (verifica del comportamento), ma il criterio di accettazione non
richiede modifiche li' — TASKS.md dice esplicitamente di lasciare invariato il ramo `res.redirected` in
ChatPanel — quindi restano fuori dall'insieme dei file modificati.

Motivazione: file isolato (`middleware.ts`, 66 righe), nessuna dipendenza da `vehicleData.ts` o
`motorsport.ts` (verificato: nessun import incrociato fra i tre file). Task piu' piccolo e autonomo, adatto
a un lavoratore da solo.

Rischi/conflitti: nessuno atteso con gli altri due gruppi. Rischio interno: assicurarsi che il redirect a
`/login` per le pagine (non-`/api/`) resti invariato, e che nessun percorso `/api/` diventi pubblico.

## Lavoratore 6 — T4

Task: T4 (Riquadro motorsport: non mettere in cache una risposta senza `submit_briefing`)

File previsti: `web/lib/motorsport.ts` (unica modifica, funzioni `extractBriefing` e `fetchBriefing`).

Motivazione: file isolato (208 righe), nessuna sovrapposizione con `vehicleData.ts` o `middleware.ts`.
Task piu' contenuto (gravita' Minore, una sola funzione di validazione da cambiare), bilancia il carico
rispetto al Lavoratore 5 pur riguardando un file diverso.

Rischi/conflitti: nessuno atteso con gli altri due gruppi. Rischio interno: non alterare `max_tokens`, i
tentativi ne' la durata della cache (24h), come richiesto dal criterio di accettazione; distinguere bene
"nessuna chiamata a submit_briefing" da "news: []" (quest'ultimo resta valido e va comunque in cache).

## Punti da confermare all'agente 3

- Il gruppo del Lavoratore 4 (T2+T3) e' piu' corposo degli altri due in termini di sostanza (2 task
  "Importante" contro 1 "Minore" ciascuno per gli altri lavoratori), ma la costrizione del file condiviso
  `vehicleData.ts` non lascia alternative se si vuole garantire l'assenza di conflitti fra le PR; confermare
  che questo sbilanciamento e' accettabile o se preferite un'unica PR con due commit separati e revisione
  piu' attenta per quel lavoratore.
- Ho escluso `GlobalSearch.tsx`, `VehicleDetailTabs.tsx` e `ChatPanel.tsx` dai file effettivamente modificati
  per T1, basandomi sul criterio di accettazione di TASKS.md che parla solo di `middleware.ts` e lascia
  esplicitamente invariato il ramo `res.redirected` in ChatPanel. Se in fase di implementazione emergesse la
  necessita' di toccare anche uno di questi componenti, va verificato che non entri in conflitto con altri
  lavoratori (nessuno dei due li tocca comunque, quindi il rischio e' basso anche in quel caso).
