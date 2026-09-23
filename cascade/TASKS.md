Data (UTC): 2026-09-23

Riferimento completo: `BUG_SCAN.md` alla radice del branch `claude/nightly-bug-scan`.
Tutti i task sono modifiche sotto `web/`, verificate sul codice di `main` al 2026-09-23.
Prima di aprire la PR eseguire in `web/`: `npx tsc --noEmit`, `npx next lint` e `npm run build`.

## T1 — Una sola generazione in corso per lingua nel riquadro motorsport
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

## T2 — Timeout della chat compatibile con `maxDuration`
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

## T3 — Timeout della ricerca compatibili con `maxDuration`
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

## T4 — La chat non deve togliere la bolla quando la risposta d'errore non e' JSON
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

## T5 — Evitare che due caratteristiche con lo stesso nome si sovrascrivano
Gravita': Minore
File: `web/components/SectionEditor.tsx:54-78` (`handleSave`); messaggi in `web/messages/{it,en,de}.json`
Problema: dopo il `trim()` "peso" e "peso " diventano la stessa chiave e `Object.fromEntries` tiene
solo l'ultimo valore: lo schermo conferma il salvataggio ma al ricaricamento una voce e' sparita.
Correzione: prima dell'update, se due nomi non vuoti coincidono dopo `trim()`, non salvare e
impostare `saveError` con una nuova chiave tradotta (stesso namespace di `saveError`) nelle tre
lingue.
Accettazione: con due righe "peso" / "peso " il salvataggio non parte e compare il messaggio; con
nomi distinti il comportamento non cambia; le chiavi di `it`/`en`/`de` combaciano; tsc e lint passano.

## T6 — Non leggere il testo estratto per l'uscita anticipata di process-document
Gravita': Minore
File: `web/app/api/agent/process-document/route.ts:59-71`
Problema: la select comprende `extracted_text` (fino a 400.000 caratteri) solo per restituirne la
lunghezza quando il documento e' gia' elaborato; l'unico chiamante guarda solo `res.ok`.
Correzione: togliere `extracted_text` dalla select e rispondere `NextResponse.json({ ok: true })` nel
ramo `doc.processed`.
Accettazione: la select non contiene `extracted_text`; nessun altro punto del file lo legge da `doc`;
tsc, lint e build passano.

## T7 — Usare `RESOURCE_CATEGORIES` nello schema dello strumento di ricerca
Gravita': Minore
File: `web/app/api/agent/search/route.ts:69`; lista in `web/lib/types.ts:55`
Problema: l'`enum` di `categoria` in `SUBMIT_FINDINGS_TOOL` ripete a mano le otto categorie invece di
usare la lista unica.
Correzione: importare `RESOURCE_CATEGORIES` da `@/lib/types` e usare `enum: [...RESOURCE_CATEGORIES]`.
Accettazione: nessun elenco letterale di categorie resta nel file della route; tsc, lint e build passano.

## Richiede intervento umano (non assegnare)
- U1 — Contatore d'uso condiviso su una struttura di sola aggiunta, incrementato prima della
  chiamata al modello: richiede una migrazione in `supabase/` (vedi `BUG_SCAN.md`).
- U2 — Pausa del riquadro motorsport condivisa fra le istanze: richiede una struttura condivisa
  (tabella o archivio chiave-valore) e una scelta di design.

## Gia' in PR
Nessuna PR aperta al momento dello scan.
