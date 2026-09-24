Data (UTC): 2026-09-24

Riferimento: `cascade/TASKS.md` (branch `claude/nightly-bug-scan`). 3 task assegnabili, nessuna dipendenza tra loro: ogni task tocca un insieme di file disgiunto dagli altri due, quindi un task per lavoratore da' gia' il massimo bilanciamento senza rischio di conflitto tra le tre PR.

## Lavoratore 4 — T1

Task: T1 — Rafforzamento: limita i ritentativi automatici della generazione del riquadro motorsport (Importante)

File previsti:
- `web/lib/motorsport.ts` (opzioni della chiamata `messages.create` a riga ~159; eventuale aggiornamento del commento vicino a `REQUEST_TIMEOUT_MS`, riga ~42)

Motivazione: modifica isolata a una singola opzione (`maxRetries: 0`) in un solo file, non tocca ne' le route API ne' i componenti UI. Task piu' leggero del gruppo per numero di file e complessita'.

Rischi/conflitti: nessuno individuato. Nessun altro task tocca `web/lib/motorsport.ts`.

## Lavoratore 5 — T2

Task: T2 — Timeout di Anthropic che usano anche la quota del ripiego quando OpenAI non e' configurato (Importante)

File previsti:
- `web/app/api/agent/chat/route.ts` (righe ~14-21, 226)
- `web/app/api/agent/search/route.ts` (righe ~18-23, 408-442)

Motivazione: le due route condividono la stessa logica (timeout calcolato in base a `hasOpenAIFallback()`, definita in `web/lib/openai.ts` ma solo letta, non modificata) e vanno quindi coerenti tra loro: tenerle nello stesso gruppo evita che due lavoratori applichino la stessa correzione in modo divergente. E' il task piu' corposo (2 file, calcolo dei nuovi valori di timeout con verifica della somma dei casi peggiori sotto `maxDuration`), assegnato da solo per bilanciare il carico rispetto a T1 e T3.

Rischi/conflitti: nessuno individuato verso gli altri gruppi. Da verificare solo internamente che i commenti sui casi peggiori (chat < 90 s; ricerca 115 000 + 45 000 = 160 000 ms < `maxDuration` = 180 s) restino coerenti tra i due file dopo la modifica.

## Lavoratore 6 — T3

Task: T3 — Rimettere il testo nel campo quando la richiesta della chat non e' arrivata alla route (Minore)

File previsti:
- `web/components/ChatPanel.tsx` (righe ~49-66, dove vive `restoreUnsent`)

Motivazione: `restoreUnsent` e la logica di gestione della risposta sono interamente locali al componente (nessuna funzione o import condiviso con `web/lib/motorsport.ts` o le route in `web/app/api/agent/`), quindi il task resta isolato in un solo file e di dimensione contenuta, adatto a bilanciare il terzo gruppo.

Rischi/conflitti: nessuno individuato. Nessun altro task tocca `web/components/ChatPanel.tsx`.

## Punti da confermare all'agente 3

- Nessun file e' condiviso tra i tre gruppi: la divisione per task coincide gia' con la divisione per file, quindi non ho dovuto scegliere tra "stesso file" vs "stesso task" per nessun caso limite.
- `hasOpenAIFallback()` (in `web/lib/openai.ts`) e' usata da T2 ma non modificata: se in fase di implementazione emergesse la necessita' di cambiare anche `web/lib/openai.ts`, andrebbe verificato che nessun altro gruppo lo tocchi (al momento nessuno lo fa).
- Carico: T1 e T3 sono piu' leggeri (1 file ciascuno) rispetto a T2 (2 file, logica piu' articolata). Con solo 3 task ho preferito un task per lavoratore piuttosto che accorpare due task leggeri in un solo gruppo, per mantenere la corrispondenza 1:1 con l'assenza di dipendenze; se l'agente 3 preferisce bilanciare diversamente (es. accorpare T1+T3 e lasciare un lavoratore vuoto) i file restano comunque disgiunti in entrambi i casi.
