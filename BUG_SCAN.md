# Scansione notturna dei bug — MyVehicle

Data scan: 2026-09-23 01:20 UTC
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json`, file generati con l'intestazione "GENERATO DA")
PR aperte al momento dello scan: nessuna (di nessun autore).

Ogni problema qui sotto e' stato verificato leggendo personalmente il codice indicato (file + righe).
Tutti i problemi assegnati nella scansione precedente risultano corretti dalle PR #42, #43 e #44 e
non sono ripetuti qui. Resta aperto soltanto il punto che richiede intervento umano (U1).

Sono stati esaminati e scartati alcuni rilievi della revisione automatica: la rimozione del file
dello schema quando anche la verifica della riga non riesce (compromesso esplicito e documentato
nel codice), la duplicazione delle tabelle scheda/categorie e l'API di sola lettura del contatore
(solo refactoring), e il reinvio dopo un errore del modello (scelta di prodotto).

## Bloccante

Nessun problema bloccante trovato in questa scansione.

## Importante

### I1 — Rafforzamento: generazioni contemporanee del riquadro motorsport sulla home pubblica
File: `web/lib/motorsport.ts:176-191`

La pausa dopo un tentativo non riuscito, introdotta ieri, scatta solo *dopo* che un tentativo si e'
concluso, e ogni tentativo puo' durare fino al timeout di 60 secondi (a cui si aggiungono i
ritentativi automatici dell'SDK). In quell'intervallo ogni visita alla home trova la cache vuota e
nessuna pausa registrata, quindi avvia una propria generazione a consumo: `unstable_cache` non
riunisce le richieste contemporanee sulla stessa chiave. Il numero di generazioni in corso cresce
quindi con i visitatori proprio nei momenti in cui il servizio e' lento.

Proposta: tenere per ciascuna lingua la promessa della generazione in corso e farla condividere
alle visite che arrivano nel frattempo, invece di avviarne un'altra.

### I2 — La chat non imposta un timeout sulla chiamata al modello e il ripiego non puo' mai scattare per lentezza
File: `web/app/api/agent/chat/route.ts:12, 59-72, 192-236`; client in `web/lib/anthropic.ts:6-15`

Il commento a riga 59 dice che il ripiego su OpenAI scatta anche in caso di timeout, ma la chiamata
ad Anthropic non passa alcun `timeout` e il client usa il valore predefinito dell'SDK (10 minuti,
piu' i ritentativi automatici). La funzione pero' ha `maxDuration = 90`: con un servizio lento la
piattaforma interrompe la funzione prima che l'SDK rinunci, il ripiego non parte, la risposta
d'assistente non viene salvata e il browser riceve una pagina d'errore della piattaforma invece
del JSON della route (vedi M1 per l'effetto sulla chat).

Proposta: passare `timeout` e `maxRetries` alla chiamata ad Anthropic (e un `timeout` a quella di
OpenAI) in modo che il caso peggiore dei due tentativi resti sotto `maxDuration`.

### I3 — Stesso problema nella ricerca: tre chiamate in fila senza timeout dentro 180 secondi
File: `web/app/api/agent/search/route.ts:16, 211-240, 408-451`

La ricerca puo' fare in sequenza il tentativo Anthropic, il ritentativo e il ripiego OpenAI, e
nessuna delle tre chiamate ha un timeout proprio. Se la prima rallenta, la funzione viene
interrotta a 180 secondi prima di arrivare al ritentativo o al ripiego: il giro di ricerche web e'
stato comunque consumato, ma nessun risultato viene salvato e l'utente riceve solo l'errore
generico di connessione.

Proposta: dare a ciascuna chiamata un `timeout` (e `maxRetries`) tali che la somma dei casi peggiori
resti sotto `maxDuration`.

## Minore

### M1 — Con una risposta d'errore non JSON la chat toglie una bolla gia' salvata
File: `web/components/ChatPanel.tsx:49-76`

Se la risposta non e' JSON (timeout della piattaforma, 502/504), `res.json()` lancia e il `catch`
chiama `restoreUnsent()` senza distinguere questo caso da un errore di rete. Ma quando il server ha
risposto, la route era gia' partita e la riga del messaggio dell'utente e' scritta prima della
chiamata al modello: la bolla sparisce, il testo torna nel campo e un reinvio lascia il messaggio
due volte in cronologia — proprio il caso che la correzione di ieri voleva evitare.

Proposta: leggere il corpo con `res.json().catch(() => null)` e, se il server ha risposto con
errore ma il corpo non e' leggibile, lasciare la bolla al suo posto.

### M2 — Due caratteristiche che differiscono solo per gli spazi si sovrascrivono in silenzio
File: `web/components/SectionEditor.tsx:59-78`

Dopo il `trim()` introdotto ieri, "peso" e "peso " diventano la stessa chiave e `Object.fromEntries`
tiene solo l'ultimo valore. Lo schermo mostra ancora due righe e conferma il salvataggio; al
ricaricamento una delle due e' sparita senza avviso.

Proposta: prima di salvare, se due nomi coincidono dopo il `trim()`, fermare il salvataggio e
mostrare un messaggio (nuova chiave tradotta in it/en/de).

### M3 — L'uscita anticipata per i documenti gia' elaborati legge l'intero testo estratto
File: `web/app/api/agent/process-document/route.ts:59-71`

La select ora comprende `extracted_text` (fino a 400.000 caratteri) solo per restituirne la
lunghezza nel caso `processed`. L'unico chiamante (`FileUploader`) guarda solo `res.ok`, quindi
ogni chiamata trasferisce dal database un campo che nel percorso normale non serve.

Proposta: togliere `extracted_text` dalla select e rispondere `{ ok: true }` quando il documento
e' gia' elaborato.

### M4 — L'elenco delle categorie nello schema dello strumento di ricerca e' ancora scritto a mano
File: `web/app/api/agent/search/route.ts:69`, lista unica in `web/lib/types.ts:55`

`RESOURCE_CATEGORIES` e' stato introdotto come unica fonte delle categorie, ma l'`enum` dello
strumento `submit_findings` ripete le otto voci come letterali: aggiungendo una categoria in
`types.ts` il modello non potrebbe mai restituirla.

Proposta: usare `enum: [...RESOURCE_CATEGORIES]`.

## Richiede intervento umano

### U1 — Il limite d'uso condiviso fra le istanze si appoggia a righe che l'account puo' rimuovere (invariato da ieri)
File: `web/lib/rateLimit.ts:74-86`, usato in `web/app/api/agent/chat/route.ts:95-108` e
`web/app/api/agent/search/route.ts:370-382`; policy in `supabase/migrations/0001_init.sql:175-182`

Il conteggio comune si basa su righe di tabelle che la stessa sessione puo' anche svuotare, e nella
ricerca cresce solo dopo una chiamata riuscita. Serve una struttura dedicata, con sola aggiunta,
incrementata prima della chiamata al modello: richiede una migrazione in `supabase/`.

### U2 — Pausa condivisa fra le istanze per il riquadro motorsport
File: `web/lib/motorsport.ts:176-191`

Il task su I1 riunisce le generazioni contemporanee dentro una stessa istanza; la pausa dopo un
tentativo non riuscito resta pero' in memoria di istanza. Renderla comune a tutte le istanze
richiede una struttura condivisa (tabella in `supabase/` o archivio chiave-valore) e quindi una
scelta di design.

## Gia' in PR

Nessuna: al momento dello scan non ci sono pull request aperte.
