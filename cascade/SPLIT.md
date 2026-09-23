Data (UTC): 2026-09-23

Riferimento: `cascade/TASKS.md` (task T1-T7) e `BUG_SCAN.md`, entrambi su questo branch.
Verifica fatta leggendo i file elencati in `cascade/TASKS.md` sul codice attuale di `web/`
(comprese le importazioni condivise: `web/lib/anthropic.ts` e `web/lib/types.ts` sono solo
letti/importati dai task che li citano, nessuno dei sette task li modifica).

## Lavoratore 4 — T1, T5

File previsti:
- `web/lib/motorsport.ts`
- `web/components/SectionEditor.tsx`
- `web/messages/it.json`
- `web/messages/en.json`
- `web/messages/de.json`

Motivazione: due correzioni indipendenti fra loro e senza file in comune con gli altri due
gruppi. T1 (deduplicazione delle generazioni contemporanee del riquadro motorsport) e' l'unico
task che tocca `motorsport.ts`. T5 (nomi di caratteristiche duplicati dopo il trim) e' l'unico
che tocca `SectionEditor.tsx` e le tre traduzioni; e' un'aggiunta di chiave scoperta gia'
verificata (namespace `sectionEditor`, vicino a `saveError` in ciascun file), quindi rischio di
conflitto sui JSON minimo.

Rischi: nessuno diretto. Nei tre file di traduzione la nuova chiave va inserita nello stesso
namespace `sectionEditor` in tutte e tre le lingue con la stessa struttura, altrimenti tsc/lint
non segnalano l'incoerenza a runtime.

## Lavoratore 5 — T2, T4

File previsti:
- `web/app/api/agent/chat/route.ts`
- `web/components/ChatPanel.tsx`

Motivazione: nessuno dei due file e' toccato da altri task, quindi la coppia e' disgiunta a
prescindere. Li ho raggruppati anche per coerenza tematica: T2 e' la causa (timeout lato server
non compatibile con `maxDuration`) e T4 e' il sintomo lato client descritto in `BUG_SCAN.md`
(M1 dipende in parte dal comportamento corretto da I2/T2) — una sola PR rende piu' facile
verificare a mano l'intero percorso "risposta lenta -> ripiego OpenAI -> bolla non persa".
Non c'e' una dipendenza di file fra i due: T4 si puo' applicare anche prima di T2.

Rischi: nessuno noto.

## Lavoratore 6 — T3, T7, T6

File previsti:
- `web/app/api/agent/search/route.ts` (T3 e T7)
- `web/app/api/agent/process-document/route.ts` (T6)

Motivazione: T3 e T7 toccano entrambi `search/route.ts` (T3 alle righe ~211-240 e ~408-451,
T7 alla riga ~69 nell'enum di `SUBMIT_FINDINGS_TOOL`) e devono quindi stare nello stesso gruppo
per costruzione, cosi' le tre PR restano senza conflitti fra loro. Le due modifiche non
dipendono l'una dall'altra e non si sovrappongono a livello di righe: consiglio di applicare
prima T7 (un'unica riga, isolata) e poi T3 (piu' ampia), cosi' il primo commit e' gia'
verificabile da solo. T6 e' stato aggiunto a questo gruppo per bilanciare il numero di task fra
i tre lavoratori (2/2/3): e' un file indipendente sotto la stessa cartella `app/api/agent/`,
nessuna sovrapposizione con T3/T7.

Rischi: dentro `search/route.ts`, T3 e T7 vanno applicati con attenzione a non farli confliggere
fra loro nello stesso file (intervalli di righe diversi, ma stesso file: consigliato un commit
separato per T7 prima di T3, come sopra).

## Punti da confermare all'agente 3

- L'accoppiamento T2+T4 nel lavoratore 5 e' una scelta tematica (causa/sintomo sullo stesso
  flusso di chat), non imposta da un file condiviso: i due file sono comunque disgiunti da tutti
  gli altri, quindi si potrebbero anche scambiare singolarmente con T1 o T6 senza creare
  conflitti, se si preferisce un bilanciamento diverso.
- T6 e' stato messo con T3+T7 solo per pareggiare il conteggio dei task (altrimenti il
  lavoratore 6 avrebbe avuto un solo task assegnato). Puo' essere spostato al lavoratore 4 o 5
  senza creare conflitti di file, se si preferisce isolarlo dal gruppo "ricerca".
- Ho verificato leggendo il codice che `web/lib/anthropic.ts` e `web/lib/types.ts` restano
  invariati per T2, T3 e T7 (sono solo importati); se l'agente 3 preferisce comunque isolare le
  costanti di timeout in `anthropic.ts`/`openai.ts` per riuso fra T2 e T3, questo introdurrebbe
  un file condiviso fra i lavoratori 5 e 6 e andrebbe rivalutato lo split.
