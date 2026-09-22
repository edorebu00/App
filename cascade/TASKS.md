Data (UTC): 2026-09-22

Origine: `BUG_SCAN.md` alla radice (scansione del 2026-09-22 01:30 UTC).
Ambito consentito per tutti i task qui sotto: solo file sotto `web/`. Nessuna migrazione, nessun
segreto, nessuna variabile d'ambiente nuova.
PR aperte al momento dello scan: nessuna, quindi nessun task e' gia' coperto altrove.

---

## T1 — Limitare i tentativi ripetuti del riquadro motorsport quando la generazione non riesce
Gravita: Importante (rafforzamento — priorita' massima)
File: `web/lib/motorsport.ts:166-177` (e, se serve, un import da `web/lib/rateLimit.ts`)

Problema concreto: il risultato riuscito resta in cache 24 ore, ma il caso non riuscito non lascia
traccia. Finche' la generazione continua a non riuscire, ogni visita alla home pubblica
(`web/app/(public)/page.tsx:45-47` -> `web/components/MotorsportSection.tsx:15`) ne avvia una nuova,
e ogni tentativo e' una chiamata a consumo con ricerca web piu' un'attesa fino ai 60 secondi di
timeout. La home non richiede accesso e non passa da alcun limite di frequenza, quindi il numero di
tentativi cresce con il numero di visitatori.

Correzione richiesta: prima di avviare la generazione, verificare se un tentativo e' fallito di
recente e, in tal caso, restituire subito `EMPTY` senza chiamare il modello. Riutilizzare il
contatore in memoria gia' presente in `web/lib/rateLimit.ts` (`checkRateLimit`) con una chiave per
lingua, invece di introdurre una struttura nuova. Pausa fissa di 120 secondi, definita come costante
con commento accanto alle altre costanti del file. Il comportamento in caso di successo non cambia:
la cache di 24 ore resta com'e', e il `catch` resta fuori dalla funzione memorizzata.

Criterio di accettazione: con la generazione che solleva un errore, due chiamate consecutive a
`getMotorsportBriefing` con la stessa lingua eseguono `fetchBriefing` una volta sola; entrambe
restituiscono `{ news: [] }` e la home resta in piedi. Una chiamata andata a buon fine non e'
influenzata dalla pausa. `npm run lint` e `npx tsc --noEmit` passano.

---

## T2 — Non rielaborare un documento gia' elaborato
Gravita: Minore (rafforzamento — priorita' alta)
File: `web/app/api/agent/process-document/route.ts:59-67` (e il seguito della funzione)

Problema concreto: la route non guarda lo stato `processed` della riga. Richiamata sullo stesso
`documentId`, riscarica l'oggetto dallo Storage (fino a 20 MB) e rianalizza il PDF (fino a 500
pagine) tutte le volte, per poi riscrivere lo stesso testo estratto. Nell'uso normale la chiamata
parte una volta sola per caricamento (`web/components/FileUploader.tsx:81-85`), quindi l'uscita
anticipata non cambia nulla di visibile e toglie una fonte di lavoro e di traffico ripetuti.

Correzione richiesta: aggiungere `processed` (ed `extracted_text` solo se serve per la lunghezza)
alla select della riga e, quando risulta gia' vero, rispondere subito con lo stesso formato del
percorso riuscito (`{ ok: true, characters: ... }`) senza scaricare ne' analizzare il file.
Aggiungere un commento breve in italiano che spieghi il motivo, nello stile del file.

Criterio di accettazione: una seconda chiamata sullo stesso `documentId` gia' elaborato risponde 200
senza alcuna chiamata a `storage.download` e senza toccare `extracted_text`; la prima chiamata su un
documento non ancora elaborato si comporta esattamente come prima. `npm run lint` e
`npx tsc --noEmit` passano.

---

## T3 — La cronologia della chat deve mostrare i messaggi piu' recenti
Gravita: Importante
File: `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx:24-29`

Problema concreto: la query ordina per `created_at` crescente e poi applica `limit(50)`, quindi con
piu' di 50 messaggi restituisce i 50 piu' vecchi. Dopo il cinquantesimo messaggio, chi ricarica la
pagina non vede piu' ne' le domande recenti ne' le risposte appena ricevute. La route della chat
passa invece al modello la finestra finale (`web/app/api/agent/chat/route.ts:160`), quindi
l'assistente risponde tenendo conto di messaggi che a schermo non ci sono.

Correzione richiesta: leggere le righe in ordine decrescente con `limit(50)` e invertirle prima di
passarle a `ChatPanel`, cosi' che l'ordine a schermo resti dal piu' vecchio al piu' recente.
Aggiungere un commento breve in italiano che spieghi perche' si legge al contrario, nello stile
degli altri commenti del repo.

Criterio di accettazione: con piu' di 50 messaggi salvati per un veicolo, la pagina mostra gli
ultimi 50 in ordine cronologico crescente e l'ultimo messaggio a schermo e' il piu' recente
presente a database. Con meno di 50 messaggi il contenuto e l'ordine sono identici a prima.
`npm run lint` e `npx tsc --noEmit` passano.

---

## T4 — Rendere raggiungibili le risorse di categoria "altro"
Gravita: Importante
File: `web/components/VehicleDetailTabs.tsx:44-48`, `web/components/GlobalSearch.tsx:13-17`,
`web/lib/searchPayload.ts:17-34`

Problema concreto: lo schema dello strumento di ricerca prevede la categoria `altro`
(`web/app/api/agent/search/route.ts:69`) e `web/components/ResourceCategoryView.tsx:15` ha gia'
l'icona corrispondente, ma nessuna delle tre schede (Documenti / Forum / Video) la include nel
proprio elenco di categorie. Una risorsa restituita come `altro` viene quindi pagata nella ricerca,
salvata in `search_results`, occupa uno dei 10 posti disponibili e poi non compare in nessuna
schermata. Lo stesso vale per qualunque valore di `categoria` fuori elenco, perche' `sanitizePayload`
ricopia il campo senza verificarlo.

Correzione richiesta: (a) aggiungere `"altro"` all'elenco `categorie` della scheda `documenti` in
entrambi i componenti; (b) in `sanitizePayload`, verificare `categoria` contro l'elenco dei valori
previsti e ricondurre ad `"altro"` qualunque valore fuori elenco. Definire l'elenco dei valori una
volta sola (per esempio in `web/lib/types.ts` accanto al tipo `ResourceLink`, oppure in
`web/lib/searchPayload.ts`) e usarlo per la verifica, invece di ripeterlo a mano. Non toccare il
filtro per sezione di `VehicleDetailTabs.tsx:268-272`, che riguarda le sole schede tecniche.

Criterio di accettazione: una risorsa con `categoria: "altro"` e URL http/https compare nella scheda
Documenti sia nella pagina del veicolo sia nella ricerca globale; una risorsa con una `categoria`
non prevista viene salvata come `altro` e compare anch'essa; le risorse delle categorie gia'
esistenti restano nelle schede di prima. `npm run lint` e `npx tsc --noEmit` passano.

---

## T5 — Non sovrascrivere il motivo preciso del mancato trattamento di un documento
Gravita: Importante
File: `web/components/FileUploader.tsx:86-105`, `web/app/api/agent/process-document/route.ts:218-229`

Problema concreto: il client considera "route mai partita" qualunque risposta diversa da 2xx. Per le
risposte 413, 415 e 500 la route ha pero' gia' scritto in `processing_error` il motivo preciso
(file troppo grande, formato non supportato, errore di elaborazione), e subito dopo il client lo
sostituisce con "estrazione del testo non avviata, ricarica il file per riprovare". L'utente legge
quindi un invito a ricaricare lo stesso file, operazione che nei primi due casi non puo' riuscire, e
il motivo vero va perso.

Correzione richiesta: far dichiarare alla risposta di `failDocument` che l'esito e' gia' stato
registrato (per esempio un campo booleano accanto a `error` nel corpo JSON) e, nel client, scrivere
il messaggio di ripiego solo quando quel campo manca o la richiesta non ha prodotto alcuna risposta
(errore di rete). Non cambiare il testo dei messaggi ne' le traduzioni.

Criterio di accettazione: con una risposta 413 o 415 dalla route, il valore di `processing_error`
letto nella lista documenti resta quello scritto dalla route; con un errore di rete (nessuna
risposta) il messaggio di ripiego viene ancora scritto come prima; una risposta 2xx non scrive
nulla. `npm run lint` e `npx tsc --noEmit` passano.

---

## T6 — Non togliere dallo schermo un messaggio di chat che il server ha gia' salvato
Gravita: Minore
File: `web/components/ChatPanel.tsx:39-45, 55-57, 71-73`,
`web/app/api/agent/chat/route.ts:172-178, 237-240`

Problema concreto: `restoreUnsent()` presume che una richiesta non riuscita significhi "nulla
registrato dal server". La route scrive pero' la riga del messaggio dell'utente prima di chiamare il
modello: se la chiamata fallisce risponde 500 ma la riga resta. Il client toglie la bolla e rimette
il testo nel campo, cosi' al ricaricamento della pagina il messaggio ricompare, e se l'utente lo
reinvia ne resta una copia doppia in cronologia.

Correzione richiesta: nella route, tenere traccia dell'esito dell'inserimento del messaggio utente e
riportarlo nella risposta d'errore del `catch` finale (per esempio un campo booleano accanto a
`error`). Nel client, quando quel campo dice che il messaggio e' stato salvato, lasciare la bolla al
suo posto e non rimettere il testo nel campo di scrittura; l'errore a schermo resta come oggi. Il
comportamento per gli errori di rete e per le risposte 400/401/429 (dove l'inserimento non e' ancora
avvenuto) non cambia. Aggiornare il commento in italiano di `restoreUnsent`, che oggi afferma il
contrario.

Criterio di accettazione: con la chiamata al modello che fallisce dopo l'inserimento, la bolla
dell'utente resta a schermo, il campo di scrittura resta vuoto, e ricaricando la pagina non
compaiono doppioni; con un errore di rete la bolla viene ancora tolta e il testo rimesso nel campo.
`npm run lint` e `npx tsc --noEmit` passano.

---

## T7 — Non cancellare il file dello schema quando la riga e' stata comunque creata
Gravita: Minore
File: `web/components/SectionEditor.tsx:107-121`

Problema concreto: il ripristino (`remove([path])`) scatta per qualunque errore restituito
dall'inserimento, compreso il caso in cui la risposta si perde per un problema di rete dopo che la
riga e' stata effettivamente creata. In quello scenario il file viene cancellato ma la riga
`section_images` resta, e nella lista degli schemi compare una voce il cui file non esiste piu',
senza alcun modo di toglierla dall'interfaccia.

Correzione richiesta: in caso di errore dell'inserimento, prima di rimuovere il file cercare in
`section_images` una riga con quello `storage_path` (la RLS limita gia' la ricerca alle proprie
righe). Se la riga esiste, tenere il file e aggiungerla all'elenco a schermo come nel percorso
riuscito; se non esiste, rimuovere il file e mostrare l'errore come oggi. Se anche la verifica non
riesce, comportarsi come oggi (rimuovere il file), cosi' il caso peggiore resta quello attuale e non
uno nuovo.

Criterio di accettazione: quando l'inserimento ha comunque creato la riga, il file resta nello
storage e la voce compare nell'elenco degli schemi; quando la riga non esiste, il file viene rimosso
e l'errore compare come prima. `npm run lint` e `npx tsc --noEmit` passano.

---

## T8 — Ripulire il nome della caratteristica anche in salvataggio
Gravita: Minore
File: `web/components/SectionEditor.tsx:59`

Problema concreto: il filtro scarta le righe con nome vuoto usando `k.trim()`, ma `Object.fromEntries`
salva poi la chiave grezza. Una caratteristica scritta con uno spazio davanti o dietro viene quindi
salvata con lo spazio: a schermo sembra identica a quella senza, ma sono due voci distinte, e
riaprendo la scheda si vedono due righe apparentemente uguali.

Correzione richiesta: applicare `trim()` al nome della caratteristica nel momento in cui si compone
l'oggetto `data`, mantenendo l'ultimo valore in caso di nomi che dopo la ripulitura coincidono. Non
toccare il valore, che puo' legittimamente contenere spazi significativi.

Criterio di accettazione: salvando una caratteristica scritta come `" peso "` con valore `"1200 kg"`,
la riga salvata ha chiave `"peso"`; due righe che dopo la ripulitura hanno lo stesso nome producono
una sola voce. Le schede gia' salvate continuano a caricarsi senza modifiche. `npm run lint` e
`npx tsc --noEmit` passano.

---

## Richiede intervento umano (NON assegnare)

### U1 — Il limite d'uso condiviso fra le istanze va reso indipendente da dati modificabili dal client
File: `web/lib/rateLimit.ts:53-69`, `web/app/api/agent/chat/route.ts:95-108`,
`web/app/api/agent/search/route.ts:370-382`, `supabase/migrations/0001_init.sql:175-182`

Il controllo valido per tutte le istanze conta le righe gia' scritte in `chat_messages` e
`search_results`, tabelle sulle quali la stessa sessione autenticata ha accesso pieno; il conteggio
non e' quindi un valore su cui contare come tetto. Inoltre, nella route di ricerca, la riga viene
scritta solo dopo una chiamata riuscita: i tentativi che si concludono con un errore non
incrementano il contatore comune pur avendo gia' consumato il giro di ricerche web.

Serve una struttura che il client non possa ridurre, incrementata prima della chiamata al modello:
migrazione in `supabase/` (tabella dedicata con policy di sola aggiunta, oppure restrizione della
rimozione sulle tabelle attuali) piu' una decisione su come comportarsi quando la scrittura del
contatore non riesce. Fuori dall'ambito automatizzabile sotto `web/`.

## Gia' in PR

Nessuna: al momento dello scan non ci sono pull request aperte.
