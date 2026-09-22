# Scansione notturna dei bug — MyVehicle

Data scan: 2026-09-22 01:30 UTC
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json`, file generati con l'intestazione "GENERATO DA")
PR aperte al momento dello scan: nessuna (di nessun autore).

Ogni problema qui sotto e' stato verificato leggendo personalmente il codice indicato (file + righe).
I problemi della scansione precedente (limite di frequenza fra istanze, controllo dimensione dal
metadato dello Storage, ripiego offline, messaggio di chat perso, immagine orfana nello storage,
esito elaborazione non registrato) risultano corretti dalle PR #38, #39, #40 e non sono ripetuti qui.

Verifiche automatiche eseguite: le chiavi di traduzione di `it`/`en`/`de` combaciano una a una
(273 chiavi per lingua, nessuna mancante ne' in eccesso); nessuna chiave usata nel codice risulta
assente dai file dei messaggi; tutti gli `href` verso risorse esterne di provenienza IA passano da
`safeExternalUrl`; nessun uso di `dangerouslySetInnerHTML`. Non e' stato possibile eseguire
`npm run lint` / `check:cache` in questa sessione perche' le dipendenze non sono installate
nell'ambiente.

## Bloccante

Nessun problema bloccante trovato in questa scansione.

## Importante

### I1 — La home pubblica puo' rifare la chiamata al modello a ogni visita quando la generazione non riesce
File: `web/lib/motorsport.ts:166-177`, usato da `web/components/MotorsportSection.tsx:15` sulla home
pubblica `web/app/(public)/page.tsx:45-47`

Il risultato riuscito viene conservato per 24 ore, quindi a regime costa una generazione al giorno
per lingua. Il caso non riuscito pero' non lascia traccia in cache: finche' la generazione continua
a non riuscire, ogni singola visita alla home ne avvia una nuova, e ogni tentativo e' una chiamata a
consumo con ricerca web piu' un'attesa che puo' arrivare ai 60 secondi di timeout. La home e'
pubblica e non passa da alcun limite di frequenza, quindi il numero di tentativi cresce con il
numero di visitatori.

Proposta: dopo un tentativo non riuscito, imporre una pausa prima del successivo riutilizzando il
contatore gia' presente in `web/lib/rateLimit.ts`, restituendo nel frattempo il riquadro vuoto.

### I2 — La cronologia della chat mostra i 50 messaggi piu' VECCHI invece dei piu' recenti
File: `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx:24-29`

La query ordina per `created_at` crescente e poi applica `limit(50)`: con piu' di 50 messaggi
salvati vengono restituiti i primi 50, cioe' i piu' vecchi. Dopo il cinquantesimo messaggio, chi
ricarica la pagina non vede piu' ne' le proprie domande recenti ne' le risposte appena ricevute — la
chat sembra tornata indietro nel tempo. La route della chat, al contrario, passa correttamente al
modello la finestra finale (`historyWindow` in `web/app/api/agent/chat/route.ts:160`), quindi
l'assistente risponde tenendo conto di messaggi che a schermo non compaiono.

Proposta: leggere le righe in ordine decrescente con `limit(50)` e invertirle prima di passarle a
`ChatPanel`.

### I3 — Le risorse di categoria "altro" non compaiono in nessuna schermata
File: `web/components/VehicleDetailTabs.tsx:44-48` e `web/components/GlobalSearch.tsx:13-17`;
categoria prevista in `web/app/api/agent/search/route.ts:69` e in `web/lib/types.ts:60`

Lo schema dello strumento di ricerca permette esplicitamente la categoria `altro`, e
`ResourceCategoryView.tsx:15` ha gia' l'icona corrispondente, ma nessuna delle tre schede
(Documenti / Forum / Video) la include nel proprio elenco di categorie, e nemmeno il filtro per
sezione in `VehicleDetailTabs.tsx:268-272`. Il risultato: una risorsa restituita come `altro` viene
pagata nella ricerca, salvata in `search_results`, occupa uno dei 10 posti disponibili e poi non e'
raggiungibile da nessuna parte nell'interfaccia. Lo stesso vale per qualunque valore di `categoria`
fuori elenco, perche' `sanitizePayload` (`web/lib/searchPayload.ts:25-31`) ricopia il campo senza
verificarlo.

Proposta: includere `altro` fra le categorie della scheda Documenti in entrambi i componenti e far
ricondurre ad `altro` in `sanitizePayload` ogni categoria non prevista.

### I4 — Un errore specifico dell'elaborazione documento viene sovrascritto con un messaggio generico
File: `web/components/FileUploader.tsx:86-105`, in coppia con
`web/app/api/agent/process-document/route.ts:218-229`

Il client considera "route mai partita" qualunque risposta diversa da 2xx. Ma per le risposte 413
(file troppo grande), 415 (formato non supportato) e 500 (errore di elaborazione) la route ha gia'
scritto in `processing_error` il motivo preciso; subito dopo il client lo sostituisce con
"estrazione del testo non avviata, ricarica il file per riprovare". L'utente legge quindi un invito
a ricaricare lo stesso file, operazione che per un file troppo grande o di formato non supportato
non puo' riuscire, e il motivo vero va perso.

Proposta: far distinguere al client i casi in cui la route ha gia' registrato l'esito (per esempio
con un campo nella risposta d'errore) e scrivere il messaggio di ripiego solo negli altri.

## Minore

### M1 — Una bolla di chat gia' salvata viene tolta dallo schermo quando la risposta non arriva
File: `web/components/ChatPanel.tsx:39-45, 55-57, 71-73`, in coppia con
`web/app/api/agent/chat/route.ts:172-177, 237-240`

`restoreUnsent()` parte dal presupposto che una richiesta non riuscita significhi "nulla e' stato
registrato dal server". La route pero' scrive la riga del messaggio dell'utente *prima* di chiamare
il modello: se la chiamata fallisce si risponde 500 ma la riga resta. Il client toglie la bolla e
rimette il testo nel campo, cosi' al ricaricamento della pagina il messaggio ricompare, e se
l'utente lo reinvia ne resta una copia doppia in cronologia.

Proposta: far indicare alla route, nella risposta d'errore, se il messaggio dell'utente e' stato
salvato, e in quel caso lasciare la bolla al suo posto senza rimettere il testo nel campo.

### M2 — Rafforzamento: un documento gia' elaborato viene riscaricato e rianalizzato a ogni richiesta
File: `web/app/api/agent/process-document/route.ts:59-63, 95-134`

La route non controlla lo stato `processed` della riga prima di procedere: richiamata sullo stesso
`documentId` riscarica l'oggetto dallo Storage (fino a 20 MB) e rianalizza il PDF (fino a 500
pagine) tutte le volte, sovrascrivendo poi lo stesso testo estratto. Nell'uso normale la chiamata
parte una sola volta per caricamento, quindi uscire subito quando il documento risulta gia'
elaborato non cambia il comportamento visibile e toglie una fonte di lavoro e di traffico ripetuti.

Proposta: leggere anche `processed` nella select e rispondere subito con esito positivo quando e'
gia' vero.

### M3 — Dopo un salvataggio non riuscito il file dello schema puo' essere tolto pur avendo una riga valida
File: `web/components/SectionEditor.tsx:107-121`

Il ripristino (`remove([path])`) scatta per qualunque errore restituito dall'inserimento, compreso
il caso in cui la risposta si perde per un problema di rete dopo che la riga e' stata effettivamente
creata. In quello scenario il file viene cancellato ma la riga `section_images` resta, e nella lista
degli schemi compare una voce il cui file non esiste piu'.

Proposta: prima di cancellare il file, verificare se esiste gia' una riga con quello
`storage_path`; se c'e', tenere il file e aggiungere la riga all'elenco a schermo.

### M4 — I nomi delle caratteristiche non vengono ripuliti prima del salvataggio
File: `web/components/SectionEditor.tsx:59`

Il filtro scarta le righe con nome vuoto usando `k.trim()`, ma poi `Object.fromEntries` salva la
chiave grezza. Una caratteristica scritta con uno spazio davanti o dietro viene quindi salvata con
lo spazio: a schermo sembra identica a quella senza, ma sono due voci distinte, e riaprendo la
scheda si vedono due righe apparentemente uguali.

Proposta: applicare `trim()` al nome della caratteristica anche in fase di salvataggio.

## Richiede intervento umano

### U1 — Il limite d'uso condiviso fra le istanze si appoggia a righe che l'account puo' rimuovere, e nella ricerca cresce solo dopo una chiamata riuscita
File: `web/lib/rateLimit.ts:53-69`, usato in `web/app/api/agent/chat/route.ts:95-108` e
`web/app/api/agent/search/route.ts:370-382`; policy in `supabase/migrations/0001_init.sql:175-182`

Il secondo controllo, quello valido per tutte le istanze, conta le righe gia' scritte in
`chat_messages` e `search_results`. Sono tabelle che la stessa sessione autenticata puo' anche
svuotare (le policy sono `for all`), quindi il conteggio non e' un valore su cui si possa contare
come tetto. Inoltre, nella route di ricerca, la riga viene scritta solo dopo una chiamata andata a
buon fine: i tentativi che si concludono con un errore non incrementano il contatore comune, pur
avendo gia' consumato il giro di ricerche web.

Un contatore affidabile va tenuto su una struttura che il client non possa ridurre e va incrementato
prima della chiamata al modello: serve quindi una migrazione in `supabase/` (nuova tabella con
policy di sola aggiunta, oppure restrizione della rimozione sulle tabelle attuali) e una scelta su
cosa fare quando la scrittura del contatore non riesce. Non e' automatizzabile sotto `web/`.

## Gia' in PR

Nessuna: al momento dello scan non ci sono pull request aperte.
