Data (UTC): 2026-09-22

Origine: `cascade/TASKS.md` (8 task assegnabili T1-T8; U1 escluso perche' richiede intervento
umano) e `cascade/SPLIT.md` (proposta dell'agente 2).
Questo file e' la divisione DEFINITIVA e VINCOLANTE: i lavoratori 4, 5 e 6 seguono solo quanto
scritto qui e non devono cercare altrove.

Ambito valido per tutti: solo file sotto `web/`, e solo quelli elencati nel proprio gruppo.
Vietato a chiunque: `supabase/`, `.env*`, `package-lock.json`, i workflow, e i file generati
(`web/lib/appIcons.ts`, `web/scripts/generate-icons.mjs`). Nessuna migrazione, nessun segreto,
nessuna variabile d'ambiente nuova, nessuna dipendenza nuova.

---

## Accordo con l'agente 2

Ho riaperto personalmente tutti i file citati in `cascade/TASKS.md` e li ho verificati punto per
punto.

**Confermato**

- (a) Ogni task assegnabile compare esattamente una volta: T1-T8, otto task, nessun doppione e
  nessuna omissione. U1 resta fuori da tutti i gruppi.
- (b) Il vincolo "stesso file = stesso gruppo" e' corretto ed e' rispettato: T2+T5 condividono
  `web/app/api/agent/process-document/route.ts`, T7+T8 condividono
  `web/components/SectionEditor.tsx`. Confermo che restano accoppiati.
- (e) Nessun task tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file
  "GENERATO DA". Ho cercato l'intestazione "GENERATO DA" in tutto `web/`: compare solo in
  `web/lib/appIcons.ts` e `web/scripts/generate-icons.mjs`, che nessun task tocca.
- (f) `gh` non e' disponibile in questo ambiente; ho fatto la stessa verifica con l'API GitHub
  (elenco delle PR aperte su `edorebu00/App`, stato `open`): **nessuna PR aperta**. Nessun task
  va quindi tolto o rinviato, e nessun numero di PR e' da annotare.
- Massimo 3 task per lavoratore: rispettato (3 / 2 / 3).

**Cambiato**

1. **T3 passa dal lavoratore 5 al lavoratore 4** (riequilibrio del carico, punto (c)). Motivo: la
   correzione di T1 richiede anche una piccola aggiunta in `web/lib/rateLimit.ts` (vedi punto 2),
   quindi il gruppo del lavoratore 5 diventava il piu' delicato dei tre pur avendo gia' tre task.
   T3 e' la modifica piu' piccola dell'intero elenco (una query sola) e
   `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx` non e' modificato da nessun altro task,
   quindi lo spostamento non crea sovrapposizioni. Il risultato e' anche piu' coerente da
   rivedere: il lavoratore 4 raccoglie tutta la pagina documenti (caricamento, elaborazione,
   cronologia), il lavoratore 5 la home motorsport e il funzionamento della chat, il lavoratore 6
   le risorse e le schede di sezione.
2. **`web/lib/rateLimit.ts` entra fra i file del lavoratore 5**, contro quanto scritto in
   `cascade/SPLIT.md` ("legge `checkRateLimit` ma non lo modifica"). Verificando il file ho
   trovato che con le sole funzioni esportate oggi T1 non e' realizzabile rispettando i propri
   criteri di accettazione: `checkRateLimit` incrementa sempre il contatore alla chiamata, quindi
   usarlo per la verifica iniziale consumerebbe una posizione anche quando la generazione riesce,
   e la richiesta successiva riceverebbe `EMPTY` pur avendo un risultato buono in cache — cioe'
   esattamente il comportamento che il criterio "una chiamata andata a buon fine non e'
   influenzata dalla pausa" vieta. Serve una lettura del contatore che non lasci traccia. Ho
   quindi fissato l'aggiunta di una funzione di sola lettura sullo stesso contatore gia'
   esistente (nessuna struttura nuova, come chiede T1) e l'ho specificata per intero nel testo
   del lavoratore 5, cosi' non resta alcuna interpretazione. Nessun conflitto: nessun altro
   gruppo modifica `rateLimit.ts` (il lavoratore 4 lo importa soltanto), e la parte citata da U1
   (`checkSharedRateLimit`) resta intoccata.
3. **T4 non ha piu' parti opzionali**: in `cascade/SPLIT.md` restava aperto se centralizzare
   l'elenco delle categorie in `web/lib/types.ts` oppure no. Una scelta lasciata aperta viola il
   criterio (d), quindi l'ho decisa: l'elenco si definisce in `web/lib/types.ts` e il tipo
   `ResourceLink["categoria"]` ne viene derivato. `web/lib/types.ts` e' percio' un file assegnato
   al lavoratore 6 a tutti gli effetti, non un'eventualita'.

**Risposte ai "Punti da confermare all'agente 3"**

1. *Tenere insieme T2+T5 e T7+T8 anche se le righe non si sovrappongono, oppure imporre un ordine
   di merge fra le PR?* Si tengono insieme, e **non** serve alcun ordine di merge fra le tre PR.
   Ho verificato che gli insiemi di file modificati dai tre gruppi sono disgiunti: le tre PR
   possono essere unite in qualunque ordine. L'ordine conta solo *dentro* ciascun gruppo, ed e'
   scritto nella sezione del lavoratore.
2. *Raggruppamento piu' tematico (T3+T6 insieme per la chat)?* No. T3 riguarda la query della
   pagina, T6 il percorso d'errore fra client e route: non condividono ne' file ne' codice, e
   tenerli insieme non semplifica nulla. Ho spostato T3 per il carico (punto 1 dei cambiamenti),
   non per tema. Ho comunque verificato che lo spostamento non crea sovrapposizioni.
3. *T4 puo' toccare `web/lib/types.ts`?* Si', ed e' ora obbligatorio e specificato (punto 3 dei
   cambiamenti). Ho controllato tutti gli importatori di `@/lib/types`: quindici file, tutti in
   `import type`; l'aggiunta di una costante esportata e la derivazione del tipo `categoria` non
   cambiano nulla per loro. `web/lib/types.ts` esporta gia' un valore a runtime
   (`DEFAULT_SECTIONS`), quindi la costante non introduce un modo nuovo di usare il file.
4. *Impossibile eseguire `npm run lint` / `npx tsc --noEmit` (dipendenze non installate).* Stessa
   situazione qui, confermata: la verifica e' statica, per lettura dei file. I comandi restano
   nei criteri di accettazione: li esegue il lavoratore, che installa le dipendenze nel proprio
   ambiente. Se in quell'ambiente l'installazione non riesce, il lavoratore lo scrive nella
   propria PR invece di dichiarare i controlli passati.

**Verifica di disgiunzione dei file (b)** — nessun file compare in due gruppi:

| Lavoratore | File modificati |
| --- | --- |
| 4 | `web/app/api/agent/process-document/route.ts`, `web/components/FileUploader.tsx`, `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx` |
| 5 | `web/lib/motorsport.ts`, `web/lib/rateLimit.ts`, `web/components/ChatPanel.tsx`, `web/app/api/agent/chat/route.ts` |
| 6 | `web/lib/types.ts`, `web/lib/searchPayload.ts`, `web/components/VehicleDetailTabs.tsx`, `web/components/GlobalSearch.tsx`, `web/components/SectionEditor.tsx` |

Attenzione: alcuni file di un gruppo ne *importano* altri di un gruppo diverso (la pagina del
lavoratore 4 usa `ChatPanel` del lavoratore 5; i componenti del lavoratore 6 importano i tipi che
lo stesso lavoratore 6 modifica). Nessuno dei task cambia la firma pubblica di un componente o di
un tipo usato altrove, quindi le tre PR restano indipendenti. Se un lavoratore si accorge che la
propria correzione richiede di modificare un file non elencato nel proprio gruppo, **si ferma e lo
scrive nella PR** invece di toccarlo.

---

## Lavoratore 4

Branch da usare: `claude/worker-4-2026-09-22`

File ammessi (gli unici modificabili):
- `web/app/api/agent/process-document/route.ts`
- `web/components/FileUploader.tsx`
- `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx`

Ordine di esecuzione: **T2 prima di tutto** (rafforzamento), poi **T5**, poi **T3**. T2 e T5
toccano lo stesso file in punti distinti (T2 subito dopo la select della riga `documents`, T5
dentro `failDocument` in fondo al file): facendoli in quest'ordine non si sovrappongono. T3 e'
indipendente dagli altri due.

### T2 — Non rielaborare un documento gia' elaborato
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

### T5 — Non sovrascrivere il motivo preciso del mancato trattamento di un documento
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

Precisazioni vincolanti aggiunte in questa assegnazione:
- Il campo nuovo va aggiunto **solo** alla risposta prodotta da `failDocument`. I rami che non
  passano da `failDocument` (400 richiesta non valida, 401, 404 documento non trovato, 429 limite
  di frequenza) restano identici: forma della risposta, stato e testo invariati.
- Nel client la catena `.then((res) => res.ok)` va sostituita con una che legga anche il corpo
  della risposta quando `res.ok` e' falso; il ripiego resta quello di oggi (stesso testo
  `t("processingNotStarted")`, stesso `router.refresh()`, stessa gestione di `markError`).

### T3 — La cronologia della chat deve mostrare i messaggi piu' recenti
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

Precisazione vincolante: la modifica riguarda la sola query `chat_messages` e l'inversione prima
di passare i dati a `ChatPanel`. Non toccare la query `documents` della stessa pagina, ne' le
proprieta' passate a `FileUploader` e `DocumentList` (`FileUploader` e' modificato in questa
stessa PR da T5, ma solo al suo interno: la sua firma non cambia).

### Criteri di accettazione del gruppo
- I tre task sono completati; nessun file fuori dall'elenco "File ammessi" e' stato modificato.
- `npm run lint` e `npx tsc --noEmit` passano sull'intero `web/`. Se le dipendenze non si
  installano nell'ambiente, scriverlo esplicitamente nella PR invece di dichiarare i controlli
  passati.
- Nessuna dipendenza nuova, nessuna variabile d'ambiente nuova, nessun file sotto `supabase/`.
- Commenti nuovi in italiano, nello stile dei commenti gia' presenti nei file toccati.

---

## Lavoratore 5

Branch da usare: `claude/worker-5-2026-09-22`

File ammessi (gli unici modificabili):
- `web/lib/motorsport.ts`
- `web/lib/rateLimit.ts` (**solo aggiunta** della funzione descritta in T1: le funzioni
  `checkRateLimit`, `rateWindowStart` e `checkSharedRateLimit` gia' presenti non vanno modificate,
  ne' nel comportamento ne' nella firma)
- `web/components/ChatPanel.tsx`
- `web/app/api/agent/chat/route.ts`

Ordine di esecuzione: **T1 prima di tutto** (rafforzamento, priorita' massima), poi **T6**. I due
task non condividono alcun file.

### T1 — Limitare i tentativi ripetuti del riquadro motorsport quando la generazione non riesce
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

Precisazioni vincolanti aggiunte in questa assegnazione (necessarie perche' con le sole funzioni
esportate oggi il criterio di accettazione non e' raggiungibile: `checkRateLimit` incrementa sempre
il contatore, quindi usarlo per la verifica iniziale penalizzerebbe anche il percorso riuscito):
- In `web/lib/rateLimit.ts` aggiungere **una sola** funzione esportata, di sola lettura sulla mappa
  `buckets` gia' esistente: dato un `key` e un `limit`, dice se quella chiave ha gia' raggiunto il
  tetto nella finestra in corso, **senza creare voci e senza incrementare nulla** (voce assente o
  finestra gia' scaduta -> non limitato). Commento breve in italiano sopra la funzione, nello stile
  del file. Non aggiungere altro: nessuna struttura dati nuova, nessuna modifica alle funzioni
  esistenti. Questo e' l'unico intervento consentito su `rateLimit.ts`; il problema piu' ampio del
  contatore condiviso e' U1 e **non** va affrontato qui.
- In `web/lib/motorsport.ts`: chiave per lingua (per esempio `motorsport-failure:<locale>`);
  all'inizio di `getMotorsportBriefing`, se la lettura di sola lettura dice "limitato", restituire
  subito `EMPTY`; nel `catch` gia' presente, registrare il tentativo non riuscito con
  `checkRateLimit(chiave, 1, PAUSA_MS)` **dopo** il `console.error` esistente e prima del `return
  EMPTY`. Il `console.error` e il suo testo restano invariati.
- La costante della pausa va definita accanto alle altre costanti in cima al file (vicino a
  `CACHE_SECONDS`), valore 120 secondi, con commento in italiano.
- Non toccare `fetchBriefing`, `extractBriefing`, il blocco `unstable_cache` ne' i suoi parametri
  (`revalidate`, `tags`).

### T6 — Non togliere dallo schermo un messaggio di chat che il server ha gia' salvato
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

Precisazioni vincolanti aggiunte in questa assegnazione:
- La variabile che ricorda l'esito dell'inserimento va dichiarata **fuori** dal blocco `try`, cosi'
  da essere leggibile dal `catch` finale; il valore iniziale corrisponde a "non salvato", e diventa
  "salvato" solo quando l'insert del messaggio utente non restituisce errore. Il `console.error`
  gia' presente su `userInsertError` resta com'e'.
- La risposta d'errore del `catch` mantiene stato 500 e lo stesso testo `tErr("chatError")`: si
  aggiunge solo il campo nuovo.
- Nel client, `restoreUnsent` va chiamata come oggi nel ramo `catch` (errore di rete). Nel ramo
  `!res.ok` va chiamata solo quando il corpo della risposta non dichiara il messaggio salvato.
- Usare per il campo lo stesso nome scelto dal lavoratore 4 in T5 non e' richiesto e non va
  coordinato: le due PR sono indipendenti e non devono attendersi a vicenda.

### Criteri di accettazione del gruppo
- I due task sono completati; nessun file fuori dall'elenco "File ammessi" e' stato modificato, e
  su `web/lib/rateLimit.ts` risulta **solo** la funzione aggiunta.
- `npm run lint` e `npx tsc --noEmit` passano sull'intero `web/`. Se le dipendenze non si
  installano nell'ambiente, scriverlo esplicitamente nella PR invece di dichiarare i controlli
  passati.
- Nessuna dipendenza nuova, nessuna variabile d'ambiente nuova, nessun file sotto `supabase/`.
- Commenti nuovi in italiano, nello stile dei commenti gia' presenti nei file toccati.

---

## Lavoratore 6

Branch da usare: `claude/worker-6-2026-09-22`

File ammessi (gli unici modificabili):
- `web/lib/types.ts`
- `web/lib/searchPayload.ts`
- `web/components/VehicleDetailTabs.tsx`
- `web/components/GlobalSearch.tsx`
- `web/components/SectionEditor.tsx`

Ordine di esecuzione: **T4**, poi **T7**, poi **T8**. T7 e T8 toccano lo stesso file in punti
distinti (T7 la funzione di caricamento immagine, righe 107-121; T8 la composizione di `data` in
`handleSave`, riga 59): facendo T7 prima di T8 non si sovrappongono. T4 e' indipendente dagli
altri due.

### T4 — Rendere raggiungibili le risorse di categoria "altro"
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

Precisazioni vincolanti aggiunte in questa assegnazione (il task lasciava aperta la scelta del
punto in cui centralizzare l'elenco: la decisione e' presa qui, non va rivalutata):
- L'elenco va definito in `web/lib/types.ts`, accanto a `ResourceLink`, come costante esportata
  (array `as const`) con gli **otto** valori gia' previsti dal tipo, nello stesso ordine in cui
  compaiono oggi nell'unione: `forum`, `manuale_pdf`, `video`, `schema_tecnico`, `pezzo_ricambio`,
  `catalogo_ricambi`, `piano_manutenzione`, `altro`. Il campo `categoria` di `ResourceLink` va
  poi derivato da quella costante, cosi' che elenco e tipo non possano piu' divergere. Nessun
  altro tipo di `web/lib/types.ts` va toccato: `DEFAULT_SECTIONS`, `SectionKey`, `SearchPayload`,
  `Vehicle`, `ChatMessage`, `DocumentRow`, `SectionImage` restano identici.
- In `web/lib/searchPayload.ts` la verifica va fatta dentro il ciclo di `sanitizePayload`, sulla
  riga che oggi ricopia `categoria`. Il resto della funzione (controllo dell'URL, taglio dei campi
  testuali, `MAX_RISORSE`, le specifiche) resta invariato.
- Nei due componenti va aggiunto il solo valore `"altro"` in fondo all'elenco `categorie` della
  scheda `documenti`. Le schede `forum` e `video` non si toccano, e non vanno aggiunte etichette
  o traduzioni nuove (`ResourceCategoryView` ha gia' l'icona per `altro`).

### T7 — Non cancellare il file dello schema quando la riga e' stata comunque creata
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

Precisazione vincolante: il commento in italiano gia' presente sopra `remove([path])` va aggiornato
perche' oggi descrive il comportamento vecchio. Il ramo `uploadError` (caricamento nello storage non
riuscito) resta identico.

### T8 — Ripulire il nome della caratteristica anche in salvataggio
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

Precisazione vincolante: la modifica riguarda la sola composizione di `data` dentro `handleSave`.
Lo stato `fields` e quello che si vede a schermo mentre si scrive non vanno cambiati: la ripulitura
avviene al salvataggio, non durante la digitazione.

### Criteri di accettazione del gruppo
- I tre task sono completati; nessun file fuori dall'elenco "File ammessi" e' stato modificato.
- `npm run lint` e `npx tsc --noEmit` passano sull'intero `web/`. Se le dipendenze non si
  installano nell'ambiente, scriverlo esplicitamente nella PR invece di dichiarare i controlli
  passati.
- Nessuna dipendenza nuova, nessuna variabile d'ambiente nuova, nessun file sotto `supabase/`.
- Commenti nuovi in italiano, nello stile dei commenti gia' presenti nei file toccati.

---

## Richiede intervento umano (non assegnato a nessun lavoratore)

- **U1** — Il limite d'uso condiviso fra le istanze va reso indipendente da dati modificabili dal
  client (`cascade/TASKS.md`, sezione finale). Richiede una migrazione sotto `supabase/` e una
  decisione su come comportarsi quando la scrittura del contatore non riesce: fuori dall'ambito
  automatizzabile sotto `web/`. Confermo l'esclusione dell'agente 1 e dell'agente 2. Il lavoratore
  5 tocca `web/lib/rateLimit.ts` solo per l'aggiunta descritta in T1 e non deve modificare
  `checkSharedRateLimit` ne' i suoi punti di utilizzo.

## Task tolti per sovrapposizione con una PR aperta

Nessuno: al momento di questa verifica non risultano pull request aperte su `edorebu00/App`.
