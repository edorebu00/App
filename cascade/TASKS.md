Data (UTC): 2026-09-24

Riferimento completo: `BUG_SCAN.md` alla radice del branch `claude/nightly-bug-scan`.

## Task assegnabili

### T1 — Rafforzamento: limita i ritentativi automatici della generazione del riquadro motorsport
Gravita': Importante
File: `web/lib/motorsport.ts` (opzioni della chiamata `messages.create` a riga ~159)
Problema: la chiamata passa solo `{ timeout: REQUEST_TIMEOUT_MS }`, quindi l'SDK fa fino a 2 ritentativi automatici da 60 s ciascuno; ogni tentativo ripete le ricerche web a consumo e le visite alla home in attesa della promessa condivisa restano bloccate per oltre tre minuti.
Correzione: aggiungere `maxRetries: 0` alle opzioni della chiamata (come gia' fanno chat e ricerca), aggiornando il commento vicino a `REQUEST_TIMEOUT_MS` se ne parla.
Accettazione: la chiamata in `fetchBriefing` passa `{ timeout: REQUEST_TIMEOUT_MS, maxRetries: 0 }`; `npm run lint` e `npx tsc --noEmit` in `web/` passano.

### T2 — Timeout di Anthropic che usano anche la quota del ripiego quando OpenAI non e' configurato
Gravita': Importante
File: `web/app/api/agent/chat/route.ts:14-21, 226`; `web/app/api/agent/search/route.ts:18-23, 408-442`
Problema: i timeout riservano una parte di `maxDuration` al ripiego OpenAI anche quando `hasOpenAIFallback()` e' falso; senza ripiego una risposta della chat oltre 40 s o un primo tentativo di ricerca oltre 65 s falliscono con 500 pur avendo tempo per finire (e i token generati sono comunque a consumo).
Correzione: calcolare il timeout di Anthropic in base a `hasOpenAIFallback()`: con ripiego invariato; senza ripiego chat 75 s (40 + 35) e primo tentativo di ricerca 115 s (65 + 50), lasciando il ritentativo della ricerca a 45 s. Mantenere `maxRetries: 0` e aggiornare i commenti con i nuovi casi peggiori (chat < 90 s, ricerca 115 + 45 = 160 s < 180 s).
Accettazione: con `hasOpenAIFallback()` falso la chat usa 75 000 ms e il primo tentativo di ricerca 115 000 ms; con ripiego i valori restano 40 000 / 65 000; la somma dei casi peggiori documentata nei commenti resta sotto `maxDuration`; lint e typecheck passano.

### T3 — Rimettere il testo nel campo quando la richiesta della chat non e' arrivata alla route
Gravita': Minore
File: `web/components/ChatPanel.tsx:57-66`
Problema: con la sessione scaduta il middleware reindirizza la POST a `/login`, `fetch` riceve HTML, `data` e' `null` e il client non chiama `restoreUnsent()`: il messaggio non e' salvato, la bolla sparisce al ricaricamento e il testo scritto e' perso.
Correzione: chiamare `restoreUnsent()` anche quando `res.redirected` e' vero oppure quando `res.ok && data === null` (la route risponde sempre in JSON); lasciare invariato il caso `!res.ok && data === null` (502/504, la riga potrebbe essere gia' salvata). Aggiornare il commento sopra.
Accettazione: nel ramo `res.redirected || (res.ok && data === null)` viene chiamato `restoreUnsent()` e mostrato l'errore generico; il ramo `!res.ok` con corpo non JSON resta senza `restoreUnsent()`; lint e typecheck passano.

## Richiede intervento umano

- U1 — Limite d'uso condiviso fra le istanze basato su righe rimovibili dall'account: serve una struttura dedicata in `supabase/` (migrazione).
- U2 — Pausa e generazione condivise fra le istanze per il riquadro motorsport: serve una struttura condivisa (scelta di design).

## Gia' in PR

Nessuna.
