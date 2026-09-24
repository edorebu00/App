Data (UTC): 2026-09-24

Versione finale e vincolante. Fonti: `cascade/TASKS.md` (agente 1), `cascade/SPLIT.md` (agente 2), verifica indipendente dell'agente 3 sul codice sotto `web/`.

## Accordo con l'agente 2

Confermata la divisione proposta: un task per lavoratore (T1 -> 4, T2 -> 5, T3 -> 6).

Verifica indipendente:
- (a) Copertura: T1, T2 e T3 sono assegnati ciascuno esattamente una volta; U1 e U2 restano non assegnati.
- (b) File disgiunti: gruppo 4 = `web/lib/motorsport.ts`; gruppo 5 = `web/app/api/agent/chat/route.ts`, `web/app/api/agent/search/route.ts`; gruppo 6 = `web/components/ChatPanel.tsx`. Nessuna sovrapposizione.
- (c) Carico: T2 e' il piu' corposo ma con 3 task indipendenti l'assegnazione 1:1 e' la piu' bilanciata possibile; accorpare T1+T3 lascerebbe un lavoratore vuoto senza vantaggi.
- (d) Precisione: verificato nel codice che `web/lib/motorsport.ts` passa solo `{ timeout: REQUEST_TIMEOUT_MS }` (riga ~159); che la chat usa `ANTHROPIC_TIMEOUT_MS = 40_000` (riga 18, usato a riga ~226) e la ricerca `ANTHROPIC_SEARCH_TIMEOUT_MS = 65_000` (riga 21, usato a riga ~423) indipendentemente da `hasOpenAIFallback()`; che in `web/components/ChatPanel.tsx` il ramo `res.ok && data === null` non chiama `restoreUnsent()`. Unica precisazione aggiunta (a T3): il nuovo controllo va valutato PRIMA del ramo `!res.ok`, cosi' una richiesta reindirizzata ripristina il testo qualunque sia lo stato finale.
- (e) Nessun task tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file "GENERATO DA"; nessuno richiede migrazioni, secret nuovi o scelte di design. T1 e' un rafforzamento solo codice sotto `web/`: assegnabile, ed e' il primo (e unico) task del suo gruppo.
- (f) PR aperte al momento della verifica: nessuna. Nessun task rimosso.

Risposte ai "Punti da confermare all'agente 3":
- File condivisi: confermato, nessuno.
- `web/lib/openai.ts`: resta in sola lettura per il lavoratore 5 e NON e' fra i file ammessi. Se la correzione sembrasse richiederne la modifica, il lavoratore si ferma e lo segnala nella PR invece di modificarlo.
- Carico: confermato un task per lavoratore.

## Lavoratore 4

Branch: `claude/worker-4-2026-09-24`

Task assegnati (in ordine di esecuzione):

### T1 — Rafforzamento: limita i ritentativi automatici della generazione del riquadro motorsport
Gravita': Importante
File: `web/lib/motorsport.ts` (opzioni della chiamata `messages.create` a riga ~159)
Problema: la chiamata passa solo `{ timeout: REQUEST_TIMEOUT_MS }`, quindi l'SDK fa fino a 2 ritentativi automatici da 60 s ciascuno; ogni tentativo ripete le ricerche web a consumo e le visite alla home in attesa della promessa condivisa restano bloccate per oltre tre minuti.
Correzione: aggiungere `maxRetries: 0` alle opzioni della chiamata (come gia' fanno chat e ricerca), aggiornando il commento vicino a `REQUEST_TIMEOUT_MS` se ne parla.
Accettazione: la chiamata in `fetchBriefing` passa `{ timeout: REQUEST_TIMEOUT_MS, maxRetries: 0 }`; `npm run lint` e `npx tsc --noEmit` in `web/` passano.

File ammessi (gli unici modificabili):
- `web/lib/motorsport.ts`

Ordine di esecuzione: T1.

Criteri di accettazione:
- La chiamata in `fetchBriefing` passa `{ timeout: REQUEST_TIMEOUT_MS, maxRetries: 0 }`.
- Il commento su `REQUEST_TIMEOUT_MS` (riga ~41) resta coerente (un solo tentativo da 60 s).
- `npm run lint` e `npx tsc --noEmit` in `web/` passano.
- Il diff tocca solo il file ammesso.

## Lavoratore 5

Branch: `claude/worker-5-2026-09-24`

Task assegnati (in ordine di esecuzione):

### T2 — Timeout di Anthropic che usano anche la quota del ripiego quando OpenAI non e' configurato
Gravita': Importante
File: `web/app/api/agent/chat/route.ts:14-21, 226`; `web/app/api/agent/search/route.ts:18-23, 408-442`
Problema: i timeout riservano una parte di `maxDuration` al ripiego OpenAI anche quando `hasOpenAIFallback()` e' falso; senza ripiego una risposta della chat oltre 40 s o un primo tentativo di ricerca oltre 65 s falliscono con 500 pur avendo tempo per finire (e i token generati sono comunque a consumo).
Correzione: calcolare il timeout di Anthropic in base a `hasOpenAIFallback()`: con ripiego invariato; senza ripiego chat 75 s (40 + 35) e primo tentativo di ricerca 115 s (65 + 50), lasciando il ritentativo della ricerca a 45 s. Mantenere `maxRetries: 0` e aggiornare i commenti con i nuovi casi peggiori (chat < 90 s, ricerca 115 + 45 = 160 s < 180 s).
Accettazione: con `hasOpenAIFallback()` falso la chat usa 75 000 ms e il primo tentativo di ricerca 115 000 ms; con ripiego i valori restano 40 000 / 65 000; la somma dei casi peggiori documentata nei commenti resta sotto `maxDuration`; lint e typecheck passano.

File ammessi (gli unici modificabili):
- `web/app/api/agent/chat/route.ts`
- `web/app/api/agent/search/route.ts`

(`web/lib/openai.ts` e' solo in lettura: `hasOpenAIFallback()` si importa gia' in entrambe le route.)

Ordine di esecuzione: T2 (prima la chat, poi la ricerca, con commenti coerenti fra i due file).

Criteri di accettazione:
- Chat: senza ripiego il timeout Anthropic e' 75 000 ms, con ripiego 40 000 ms; `maxRetries` resta 0.
- Ricerca: senza ripiego il primo tentativo usa 115 000 ms, con ripiego 65 000 ms; il ritentativo resta 45 000 ms; `maxRetries` resta 0.
- I commenti documentano i casi peggiori: chat 75 s + salvataggi < 90 s; ricerca 115 + 45 = 160 s < 180 s (senza ripiego) e 65 + 45 + 50 = 160 s < 180 s (con ripiego).
- `export const maxDuration` invariato in entrambi i file.
- `npm run lint` e `npx tsc --noEmit` in `web/` passano.
- Il diff tocca solo i file ammessi.

## Lavoratore 6

Branch: `claude/worker-6-2026-09-24`

Task assegnati (in ordine di esecuzione):

### T3 — Rimettere il testo nel campo quando la richiesta della chat non e' arrivata alla route
Gravita': Minore
File: `web/components/ChatPanel.tsx:57-66`
Problema: con la sessione scaduta il middleware reindirizza la POST a `/login`, `fetch` riceve HTML, `data` e' `null` e il client non chiama `restoreUnsent()`: il messaggio non e' salvato, la bolla sparisce al ricaricamento e il testo scritto e' perso.
Correzione: chiamare `restoreUnsent()` anche quando `res.redirected` e' vero oppure quando `res.ok && data === null` (la route risponde sempre in JSON); lasciare invariato il caso `!res.ok && data === null` (502/504, la riga potrebbe essere gia' salvata). Aggiornare il commento sopra.
Accettazione: nel ramo `res.redirected || (res.ok && data === null)` viene chiamato `restoreUnsent()` e mostrato l'errore generico; il ramo `!res.ok` con corpo non JSON resta senza `restoreUnsent()`; lint e typecheck passano.

Precisazione dell'agente 3: il ramo `res.redirected || (res.ok && data === null)` va valutato per primo, prima di `if (!res.ok)`, cosi' una richiesta reindirizzata ripristina il testo qualunque sia lo stato della pagina finale. Il ramo di successo (con `data` valido e non reindirizzato) resta invariato.

File ammessi (gli unici modificabili):
- `web/components/ChatPanel.tsx`

Ordine di esecuzione: T3.

Criteri di accettazione:
- Con `res.redirected` vero, oppure `res.ok` e `data === null`: `setError(t("errorGeneric"))` e `restoreUnsent()`.
- Con `!res.ok` (non reindirizzato): comportamento invariato (`restoreUnsent()` solo se `data !== null && !data.userMessageSaved`).
- Il commento sopra la gestione della risposta descrive il nuovo caso.
- `npm run lint` e `npx tsc --noEmit` in `web/` passano.
- Il diff tocca solo il file ammesso.

## Richiede intervento umano

- U1 — Limite d'uso condiviso fra le istanze: serve una struttura dedicata in `supabase/` (migrazione). Non assegnato.
- U2 — Pausa e generazione condivise fra le istanze per il riquadro motorsport: serve una struttura condivisa (scelta di design). Non assegnato.

## Gia' in PR

Nessuna PR aperta al momento della verifica.
