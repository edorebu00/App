# Scansione notturna dei bug — MyVehicle

Data scan: 2026-09-24 01:21 UTC
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json`, file generati con l'intestazione "GENERATO DA")
PR aperte al momento dello scan: nessuna (di nessun autore).

Ogni problema qui sotto e' stato verificato leggendo personalmente il codice indicato (file + righe).
I task della scansione precedente risultano corretti dalle PR #46, #47 e #48 e non sono ripetuti qui.
I nuovi rilievi riguardano soprattutto gli effetti delle correzioni di ieri.

Rilievi esaminati e scartati: il contesto di `unstable_cache` condiviso fra le richieste in attesa
(nessun `revalidateTag` nel progetto, quindi nessun effetto pratico); le motorizzazioni nuove scritte
in `ENGINE_DATA` invece che in `ENGINE_EXTENSIONS` (`ENGINE_DATA` contiene gia' altri modelli recenti:
solo organizzazione del codice); dubbi sui dati di catalogo EV5/C10 (non verificabili con certezza
dal codice); forma diversa della risposta "gia' elaborato" in `process-document` (nessun chiamante
legge `characters`); opzioni di timeout ripetute a ogni chiamata (solo refactoring); `maxRetries: 0`
nella chat e nella ricerca (scelta documentata nel commento per restare dentro `maxDuration`).

## Bloccante

Nessun problema bloccante trovato in questa scansione.

## Importante

### I1 — Rafforzamento: limita i ritentativi automatici della generazione del riquadro motorsport
File: `web/lib/motorsport.ts:125-160` (opzioni della chiamata a riga 159), `REQUEST_TIMEOUT_MS` a riga 42

Chat e ricerca ora passano `maxRetries: 0`, questa chiamata no: resta il valore predefinito dell'SDK
(2 ritentativi). Con un servizio lento una singola generazione puo' durare 3 x 60 s piu' le attese,
e ogni tentativo ripete le ricerche web a consumo. Dopo l'introduzione della promessa condivisa,
tutte le visite alla home in quell'intervallo aspettano la stessa catena: il riquadro resta in
caricamento per oltre tre minuti (o il rendering viene interrotto dalla piattaforma).

Proposta: passare `maxRetries: 0` (come nelle route della chat e della ricerca) accanto a `timeout`.

### I2 — Senza ripiego OpenAI configurato, chat e ricerca rinunciano presto a risposte che arriverebbero in tempo
File: `web/app/api/agent/chat/route.ts:14-21, 226`; `web/app/api/agent/search/route.ts:18-23, 257, 408-442`

I nuovi timeout dividono `maxDuration` fra Anthropic e il ripiego OpenAI (chat 40 s + 35 s, ricerca
65 s + 45 s + 50 s). Ma quando `hasOpenAIFallback()` e' falso la quota riservata al ripiego resta
inutilizzata: una risposta della chat lunga (fino a 4096 token di ragionamento + testo, con molto
contesto documentale) che richiede 45-80 s viene interrotta a 40 s e restituisce 500, pur rientrando
in `maxDuration = 90`; i token gia' generati sono comunque a consumo. Nella ricerca un primo tentativo
oltre i 65 s lancia un errore, che salta anche il ritentativo snello e finisce subito in 500.

Proposta: scegliere il timeout di Anthropic in base a `hasOpenAIFallback()`: senza ripiego assegnare
ad Anthropic anche la quota del ripiego (chat 75 s; ricerca primo tentativo 115 s), sempre con
`maxRetries: 0` e con la somma dei casi peggiori sotto `maxDuration`.

## Minore

### M1 — Con la sessione scaduta la chat perde il testo del messaggio
File: `web/components/ChatPanel.tsx:57-66`; `web/middleware.ts:44-48`

Se la sessione e' scaduta il middleware rimanda `POST /api/agent/chat` a `/login`: `fetch` segue il
reindirizzamento e riceve una pagina HTML. `data` diventa `null` e il client lascia la bolla e non
rimette il testo nel campo (che era gia' stato svuotato). Ma in quel caso la route non e' mai stata
eseguita e nulla e' salvato: al ricaricamento la bolla sparisce e il testo scritto e' perso. Lo stesso
vale per ogni risposta `res.ok` non JSON: la route risponde sempre in JSON, quindi un 2xx non JSON
significa che la richiesta non e' arrivata alla route.

Proposta: chiamare `restoreUnsent()` anche quando `res.redirected` e' vero o quando `res.ok` e `data === null`.

## Richiede intervento umano

### U1 — Il limite d'uso condiviso fra le istanze si appoggia a righe che l'account puo' rimuovere (invariato)
File: `web/lib/rateLimit.ts:74-86`, usato in `web/app/api/agent/chat/route.ts:95-108` e
`web/app/api/agent/search/route.ts:370-382`; policy in `supabase/migrations/0001_init.sql:175-182`

Serve una struttura dedicata, con sola aggiunta, incrementata prima della chiamata al modello:
richiede una migrazione in `supabase/`.

### U2 — Pausa condivisa fra le istanze per il riquadro motorsport (invariato)
File: `web/lib/motorsport.ts:177-205`

La pausa dopo un tentativo non riuscito e la promessa condivisa restano in memoria di istanza.
Renderle comuni a tutte le istanze richiede una struttura condivisa (tabella in `supabase/` o
archivio chiave-valore) e quindi una scelta di design.

## Gia' in PR

Nessuna: al momento dello scan non ci sono pull request aperte.
