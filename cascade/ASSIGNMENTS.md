Data (UTC): 2026-09-23

Riferimenti: `cascade/TASKS.md` (T1-T7), `cascade/SPLIT.md` (proposta dell'agente 2), `BUG_SCAN.md`.
Questo file e' la divisione DEFINITIVA e vincolante per i lavoratori 4, 5 e 6.

## Accordo con l'agente 2

Verifica indipendente fatta leggendo i file su `origin/main` (ad3d64e).

- (a) Copertura: T1-T7 assegnati ciascuno esattamente una volta; U1 e U2 non assegnati.
- (b) Disgiunzione: confermata. L4 = `web/lib/motorsport.ts`, `web/components/SectionEditor.tsx`,
  `web/messages/{it,en,de}.json`; L5 = `web/app/api/agent/chat/route.ts`,
  `web/components/ChatPanel.tsx`; L6 = `web/app/api/agent/search/route.ts`,
  `web/app/api/agent/process-document/route.ts`. Nessun file in due gruppi. T3 e T7 toccano lo
  stesso file e restano insieme.
- (c) Carico: 2/2/3 confermato; T6 e T7 sono modifiche di poche righe, il carico reale e' pari.
- (d) Precisione: T2 e T3 lasciavano al lavoratore la scelta dei valori di timeout; ho fissato
  valori concreti (vedi "Precisazioni vincolanti" nei gruppi 5 e 6). Ho precisato anche dove va
  la mappa di T1, la struttura del corpo nullo in T4, nome e testi della chiave di T5, e il valore
  di ritorno di T6. Il testo di TASKS.md e' riportato integralmente; le precisazioni prevalgono.
- (e) Nessun task tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file
  generati; nessuno richiede migrazioni, secret nuovi o scelte di design. T1 (rafforzamento, solo
  codice sotto `web/`) e' assegnabile ed e' il primo del lavoratore 4.
- (f) PR aperte: nessuna (verificato ora), quindi nessun task escluso.

Risposte ai "Punti da confermare all'agente 3":
1. Accoppiamento T2+T4 nel lavoratore 5: confermato, stesso flusso (timeout lato server ->
   risposta d'errore lato client) e verifica manuale piu' semplice in una sola PR.
2. T6 con T3+T7 nel lavoratore 6: confermato per bilanciamento; nessun conflitto di file.
3. Costanti di timeout condivise in `web/lib/anthropic.ts`/`web/lib/openai.ts`: NO. Ogni route
   dichiara le proprie costanti in testa al file (hanno budget diversi, 90 s e 180 s) e i due file
   di libreria restano esclusi, cosi' i gruppi 5 e 6 restano disgiunti.

Modifiche rispetto a SPLIT.md: solo precisazioni di esecuzione (sopra); gruppi e ordine invariati,
salvo l'ordine del lavoratore 6 fissato in T7 -> T3 -> T6 come suggerito dall'agente 2.

Regole comuni:
Prima di aprire la PR eseguire in `web/`: `npx tsc --noEmit`, `npx next lint` e `npm run build`.
Partire da `origin/main` aggiornato. Una sola PR verso `main`, un commit per task. Non modificare
nessun file fuori dall'elenco dei file ammessi (in particolare niente `supabase/`, `.env*`,
`package-lock.json`, workflow, file con intestazione 'GENERATO DA', `web/lib/anthropic.ts`,
`web/lib/openai.ts`, `web/lib/types.ts`).

## Lavoratore 4

Branch: `claude/worker-4-2026-09-23`

Ordine di esecuzione: T1 (rafforzamento, per primo), poi T5.

File ammessi (gli unici modificabili):
- `web/lib/motorsport.ts`
- `web/components/SectionEditor.tsx`
- `web/messages/it.json`
- `web/messages/en.json`
- `web/messages/de.json`

### T1 — Una sola generazione in corso per lingua nel riquadro motorsport
Gravita': Importante (rafforzamento)
File: `web/lib/motorsport.ts:165-191` (`getMotorsportBriefing`)
Problema: finche' una generazione e' in corso (fino a 60 s piu' i ritentativi dell'SDK) ogni visita
alla home trova la cache vuota e nessuna pausa registrata, e avvia una propria generazione a
consumo: `unstable_cache` non riunisce le richieste contemporanee.
Correzione: tenere a livello di modulo una `Map<Locale, Promise<MotorsportBriefing>>` con la
generazione in corso; le chiamate che arrivano nel frattempo attendono la stessa promessa. La voce
va tolta a promessa conclusa (riuscita o no, in un `finally`). Pausa dopo un fallimento, `EMPTY`
come ripiego e cache di 24 ore restano come sono.
Accettazione: con N chiamate contemporanee a `getMotorsportBriefing("it")` a cache vuota,
`fetchBriefing` viene invocata una sola volta (verificabile con un log o un contatore temporaneo);
dopo la conclusione la mappa non contiene piu' la voce; tsc, lint e build passano.

Precisazioni vincolanti T1:
- La mappa va dichiarata a livello di modulo in `motorsport.ts`, es.
  `const inFlight = new Map<Locale, Promise<MotorsportBriefing>>();`.
- In `getMotorsportBriefing`, subito dopo il controllo `isRateLimited(failureKey, 1)`: se la mappa
  contiene gia' una promessa per `locale`, restituirla. Altrimenti creare una promessa che esegue
  l'attuale blocco `try/catch` (cache + `catch` che registra la pausa e restituisce `EMPTY`),
  inserirla nella mappa, rimuoverla in un `finally` e restituirla. Cosi' la promessa condivisa non
  viene mai rifiutata, la pausa viene registrata una sola volta e tutte le visite in attesa
  ricevono `EMPTY` in caso di errore.
- Il contatore o log temporaneo usato per la verifica non va lasciato nel commit.

### T5 — Evitare che due caratteristiche con lo stesso nome si sovrascrivano
Gravita': Minore
File: `web/components/SectionEditor.tsx:54-78` (`handleSave`); messaggi in `web/messages/{it,en,de}.json`
Problema: dopo il `trim()` "peso" e "peso " diventano la stessa chiave e `Object.fromEntries` tiene
solo l'ultimo valore: lo schermo conferma il salvataggio ma al ricaricamento una voce e' sparita.
Correzione: prima dell'update, se due nomi non vuoti coincidono dopo `trim()`, non salvare e
impostare `saveError` con una nuova chiave tradotta (stesso namespace di `saveError`) nelle tre
lingue.
Accettazione: con due righe "peso" / "peso " il salvataggio non parte e compare il messaggio; con
nomi distinti il comportamento non cambia; le chiavi di `it`/`en`/`de` combaciano; tsc e lint passano.

Precisazioni vincolanti T5:
- Nuova chiave `duplicateFieldName` nel namespace `sectionEditor` (lo stesso di `saveError`, riga
  ~376 di ciascun file), subito dopo `saveError`, con questi testi:
  - it: "Due caratteristiche hanno lo stesso nome: rinominane una prima di salvare."
  - en: "Two fields have the same name: rename one of them before saving."
  - de: "Zwei Merkmale haben denselben Namen: benenne eines um, bevor du speicherst."
- Il controllo va all'inizio di `handleSave`, prima di `setSaving(true)`: se i nomi non vuoti
  dopo `trim()` contengono duplicati, `setSaveError(t("duplicateFieldName"))` e `return`.

Criteri di accettazione: quelli di T1 e T5 sopra; tsc, lint e build passano; nessun file fuori
dall'elenco modificato.

## Lavoratore 5

Branch: `claude/worker-5-2026-09-23`

Ordine di esecuzione: T2, poi T4.

File ammessi (gli unici modificabili):
- `web/app/api/agent/chat/route.ts`
- `web/components/ChatPanel.tsx`

### T2 — Timeout della chat compatibile con `maxDuration`
Gravita': Importante
File: `web/app/api/agent/chat/route.ts:12, 59-72, 192-236`
Problema: la chiamata `anthropic.messages.create` non passa `timeout`, quindi vale il default
dell'SDK (10 minuti, piu' i ritentativi automatici), molto oltre `maxDuration = 90`. Con un servizio
lento la funzione viene interrotta dalla piattaforma: il ripiego OpenAI non parte mai e il client
riceve una risposta non JSON.
Correzione: passare come secondo argomento di `messages.create` un oggetto `{ timeout, maxRetries }`
(come fa gia' `web/lib/motorsport.ts:157`) e un `timeout` anche a `openai.chat.completions.create`,
scegliendo costanti con nome tali che il caso peggiore (tentativi Anthropic + ripiego OpenAI +
salvataggi) resti sotto 90 s con qualche secondo di margine. Correggere il commento a riga 59 se
necessario.
Accettazione: le costanti sono dichiarate in testa al file con un commento che mostra la somma del
caso peggiore < 90 s; entrambe le chiamate ai modelli passano un `timeout`; tsc, lint e build passano.

Precisazioni vincolanti T2:
- Costanti in testa al file, vicino a `maxDuration`:
  `ANTHROPIC_TIMEOUT_MS = 40_000`, `ANTHROPIC_MAX_RETRIES = 0`, `OPENAI_TIMEOUT_MS = 35_000`.
  Commento con la somma del caso peggiore: 40 s + 35 s = 75 s, piu' i salvataggi, < 90 s.
- `anthropic.messages.create(body, { timeout: ANTHROPIC_TIMEOUT_MS, maxRetries: ANTHROPIC_MAX_RETRIES })`;
  `openai.chat.completions.create(body, { timeout: OPENAI_TIMEOUT_MS, maxRetries: 0 })`.
- Il commento sopra `chatWithOpenAI` resta corretto (il timeout ora scatta davvero); aggiornarlo
  solo se serve a renderlo esatto. Non modificare `web/lib/anthropic.ts` ne' `web/lib/openai.ts`.

### T4 — La chat non deve togliere la bolla quando la risposta d'errore non e' JSON
Gravita': Minore
File: `web/components/ChatPanel.tsx:49-76`
Problema: con una risposta non JSON (502/504 della piattaforma) `res.json()` lancia e il `catch`
chiama `restoreUnsent()`, ma a quel punto la route era partita e la riga dell'utente e' gia' salvata:
al reinvio il messaggio compare due volte in cronologia.
Correzione: leggere il corpo con `await res.json().catch(() => null)`; se `!res.ok` e il corpo non e'
leggibile, mostrare `t("errorGeneric")` senza chiamare `restoreUnsent()`. Il `catch` esterno (errore
di `fetch`, cioe' nessuna risposta dal server) resta com'e'.
Accettazione: con una risposta 504 con corpo HTML la bolla resta a schermo e il campo resta vuoto;
con 500 JSON e `userMessageSaved: false` il comportamento resta quello attuale; tsc e lint passano.

Precisazioni vincolanti T4:
- `const data = await res.json().catch(() => null);`
- Ramo `!res.ok`: `setError(data?.error || t("errorGeneric"));` e `restoreUnsent()` solo se
  `data !== null && !data.userMessageSaved`.
- Ramo ok con `data === null`: `setError(t("errorGeneric"))` senza aggiungere bolle e senza
  `restoreUnsent()`.
- Il `catch` esterno (nessuna risposta dal server) resta invariato.

Criteri di accettazione: quelli di T2 e T4 sopra; tsc, lint e build passano; nessun file fuori
dall'elenco modificato.

## Lavoratore 6

Branch: `claude/worker-6-2026-09-23`

Ordine di esecuzione: T7, poi T3, poi T6 (un commit per task).

File ammessi (gli unici modificabili):
- `web/app/api/agent/search/route.ts`
- `web/app/api/agent/process-document/route.ts`

### T7 — Usare `RESOURCE_CATEGORIES` nello schema dello strumento di ricerca
Gravita': Minore
File: `web/app/api/agent/search/route.ts:69`; lista in `web/lib/types.ts:55`
Problema: l'`enum` di `categoria` in `SUBMIT_FINDINGS_TOOL` ripete a mano le otto categorie invece di
usare la lista unica.
Correzione: importare `RESOURCE_CATEGORIES` da `@/lib/types` e usare `enum: [...RESOURCE_CATEGORIES]`.
Accettazione: nessun elenco letterale di categorie resta nel file della route; tsc, lint e build passano.

Precisazioni vincolanti T7: solo l'`enum` di `categoria` (riga ~69); l'`enum` di `sezione`
(riga ~76) resta invariato. `RESOURCE_CATEGORIES` si importa soltanto, `web/lib/types.ts` non si
modifica; se il tipo `readonly` crea errori di tsc, usare lo spread `[...RESOURCE_CATEGORIES]`.

### T3 — Timeout della ricerca compatibili con `maxDuration`
Gravita': Importante
File: `web/app/api/agent/search/route.ts:16, 211-240, 408-451`
Problema: tentativo Anthropic, ritentativo e ripiego OpenAI possono essere eseguiti in sequenza
senza timeout propri dentro `maxDuration = 180`; se il primo rallenta la funzione viene interrotta
prima del ritentativo o del ripiego e non viene salvato nulla.
Correzione: passare `{ timeout, maxRetries }` a `anthropic.messages.create` in `callAnthropicSearch`
e un `timeout` a `openai.responses.create` in `searchWithOpenAI`, con costanti con nome la cui somma
nel caso peggiore (due chiamate Anthropic + una OpenAI) resti sotto 180 s.
Accettazione: le costanti sono in testa al file con un commento sulla somma del caso peggiore
< 180 s; tutte e tre le chiamate passano un `timeout`; tsc, lint e build passano.

Precisazioni vincolanti T3:
- Costanti in testa al file, vicino a `maxDuration`: `ANTHROPIC_SEARCH_TIMEOUT_MS = 65_000`,
  `ANTHROPIC_RETRY_TIMEOUT_MS = 45_000`, `OPENAI_SEARCH_TIMEOUT_MS = 50_000`, tutte con
  `maxRetries: 0`. Commento: 65 + 45 + 50 = 160 s < 180 s.
- Aggiungere a `callAnthropicSearch` un parametro `timeoutMs` passato come
  `anthropic.messages.create(body, { timeout: timeoutMs, maxRetries: 0 })`: il primo tentativo
  usa `ANTHROPIC_SEARCH_TIMEOUT_MS`, il ritentativo `ANTHROPIC_RETRY_TIMEOUT_MS`.
- `openai.responses.create(body, { timeout: OPENAI_SEARCH_TIMEOUT_MS, maxRetries: 0 })`.
- Non modificare `web/lib/anthropic.ts` ne' `web/lib/openai.ts`.

### T6 — Non leggere il testo estratto per l'uscita anticipata di process-document
Gravita': Minore
File: `web/app/api/agent/process-document/route.ts:59-71`
Problema: la select comprende `extracted_text` (fino a 400.000 caratteri) solo per restituirne la
lunghezza quando il documento e' gia' elaborato; l'unico chiamante guarda solo `res.ok`.
Correzione: togliere `extracted_text` dalla select e rispondere `NextResponse.json({ ok: true })` nel
ramo `doc.processed`.
Accettazione: la select non contiene `extracted_text`; nessun altro punto del file lo legge da `doc`;
tsc, lint e build passano.

Precisazioni vincolanti T6: nel ramo `doc.processed` rispondere esattamente
`NextResponse.json({ ok: true })`; l'unico chiamante (`web/components/FileUploader.tsx:81`)
controlla solo `res.ok` e non va modificato. L'update a riga ~145 che scrive `extracted_text`
resta invariato.

Criteri di accettazione: quelli di T7, T3 e T6 sopra; tsc, lint e build passano; nessun file fuori
dall'elenco modificato.
