Data (UTC): 2026-09-21

Origine: `cascade/TASKS.md` (agente 1) e `cascade/SPLIT.md` (agente 2), stesso giorno.
Questo documento e' la divisione DEFINITIVA e VINCOLANTE: i lavoratori 4, 5 e 6 seguono solo quanto scritto qui e non devono consultare altri file per conoscere il proprio compito.

Regola comune a tutti e tre i lavoratori:

- Ogni lavoratore puo' modificare SOLO i file elencati nella propria sezione "File ammessi". Gli insiemi sono disgiunti: nessun file compare in due gruppi.
- Vietato a tutti: `supabase/`, `.env*`, `package-lock.json`, i workflow, i file con l'intestazione "GENERATO DA" (`web/lib/appIcons.ts`, `web/scripts/generate-icons.mjs`), qualunque variabile d'ambiente nuova, qualunque pacchetto nuovo, qualunque migrazione.
- Nessuna funzionalita' nuova e nessun refactoring estetico: solo la correzione descritta.
- Prima di aprire la PR: `npm run check:cache`, `npm run lint` e `npm run build` devono passare.

---

## Accordo con l'agente 2

**Confermato** (riletti da me i file sotto `web/`, uno per uno):

1. **Tutti e nove i task sono assegnabili.** Nessuno tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file "GENERATO DA"; nessuno richiede una migrazione, un secret nuovo o una scelta di design. Le due voci sotto "Richiede intervento umano" di `TASKS.md` restano non assegnate. I task di rafforzamento T1, T2 e T3 sono solo codice sotto `web/` e quindi assegnabili: vanno per primi nel rispettivo gruppo.
2. **Punto 2 dell'agente 2 — T5 non tocca `process-document/route.ts`: confermato.** Ho letto `web/components/FileUploader.tsx:77-87` e `web/components/DocumentList.tsx:46-65`: la correzione e' interamente lato client (attendere l'esito della `fetch` e scrivere `documents.processing_error` sulla riga dell'utente) e `DocumentList` disegna gia' `processing_error` al posto della rotellina, quindi non va modificato. La rendo vincolante: `process-document/route.ts` NON e' fra i file ammessi del lavoratore che esegue T5.
3. **Punto 3 dell'agente 2 — T8 non tocca `web/lib/vehicleData.ts`: confermato.** Ho verificato voce per voce che le rimozioni richieste bastano a soddisfare il criterio di accettazione: `Elroq` 4 voci (base `web/lib/vehicleData.ts:2180-2185`), `Tavascan` 2, `Terramar` 3, `Monster` 3 (`797 803cc 73cv` dell'estensione + le 2 del catalogo base). `getEngineVariants` resta invariata.
4. **T3 non tocca `VehicleDetailTabs.tsx` ne' `searchPayload.ts`: confermato.** `initialResults`/`initialSpecs` sono calcolati solo in `web/app/(dashboard)/veicoli/[id]/page.tsx:56-58`; `sanitizePayload` va importata e riusata, non modificata.
5. **Nessuna sovrapposizione con PR aperte.** Verificato: al momento non risulta aperta alcuna pull request nel repository, di nessun autore. Nessun task viene tolto per questo motivo.
6. **Carico e granularita':** i nove task stanno in tre gruppi da tre (il massimo consentito) e ogni task e' abbastanza preciso da essere eseguito senza interpretazione, con file, righe e criterio di accettazione gia' scritti dall'agente 1.

**Cambiato** — un solo intervento, sul punto 1 sollevato dall'agente 2 (`web/messages/{it,en,de}.json` come file condiviso):

- **Problema riscontrato:** l'agente 2 ha considerato T4 e T7 gli unici task che possono richiedere chiavi di traduzione nuove, e li ha messi insieme per questo. Leggendo `web/messages/it.json` ho trovato che **anche T5 ne richiede una**: T5 chiede di scrivere in `documents.processing_error` "un messaggio tradotto", ma il namespace `fileUploader` contiene solo `uploadButton`, `uploading`, `supportedFormats`, `sessionExpired`, `saveError`, `unsupportedFileType`, `fileTooLarge` — nessuna adatta a "l'elaborazione non e' partita" (`saveError` e' "Errore durante il salvataggio del documento", cioe' l'inserimento della riga, un'altra cosa). Con la proposta dell'agente 2, T5 stava nel lavoratore 4 e T4/T7 nel lavoratore 6: i tre file di `web/messages/` sarebbero finiti in **due gruppi diversi**, violando la disgiunzione degli insiemi di file.
- **Correzione applicata:** ho scambiato **T5 e T9** fra il lavoratore 4 e il lavoratore 6. Cosi' i tre soli task che possono aggiungere chiavi di traduzione (T4 → `sectionEditor`, T7 → `vehicleNew`, T5 → `fileUploader`, tre namespace distinti) stanno tutti nel lavoratore 6, che e' l'unico autorizzato a modificare `web/messages/*.json`. T9 e' completamente isolato (`web/lib/motorsport.ts`) e si sposta senza attriti; il lavoratore 4 mantiene l'affinita' fra T1 e T2, e con `npm run check:cache` rilevante sia per T1 sia per T9 nello stesso gruppo.
- **Conseguenza vincolante su T6** (stesso punto 1 dell'agente 2): `web/messages/*.json` NON e' fra i file ammessi del lavoratore 5. Ho verificato che la chiave esistente `documentList.downloadError` ("Impossibile scaricare il file. Riprova tra poco.") copre correttamente anche il caso della finestra bloccata dal browser, quindi T6 la riusa e non serve alcuna chiave nuova — come del resto il task stesso prevede come prima opzione.
- **Il gruppo del lavoratore 5 (T3, T6, T8) resta esattamente quello proposto dall'agente 2.**

---

## Lavoratore 4

**Branch da usare:** `claude/worker-4-2026-09-21`

**Ordine di esecuzione:** T1, poi T2, poi T9. T1 e T2 sono i due task di rafforzamento del gruppo e vanno per primi; T9 e' di gravita' minore e chiude.

**File ammessi (gli unici modificabili):**
- `web/lib/rateLimit.ts`
- `web/app/api/agent/search/route.ts`
- `web/app/api/agent/chat/route.ts`
- `web/app/api/agent/process-document/route.ts`
- `web/lib/motorsport.ts`

### T1 — Rendi il limite di frequenza delle route IA condiviso fra le istanze

- **Gravita':** Importante
- **File e righe:** `web/lib/rateLimit.ts:12-14`; chiamanti `web/app/api/agent/search/route.ts:360-366` e `web/app/api/agent/chat/route.ts:85-91`
- **Problema concreto:** il contatore e' una `Map` in memoria, quindi vale solo per l'istanza serverless che serve quella richiesta. Con piu' istanze attive insieme, lo stesso utente ottiene un multiplo delle 10 ricerche / 30 messaggi ogni 5 minuti previsti, e ogni chiamata in piu' e' a consumo. Il commento alle righe 6-11 di `rateLimit.ts` annota gia' il limite ma non e' mai stato rafforzato.
- **Correzione richiesta:** affiancare al controllo in memoria (che resta come primo filtro a costo zero) un conteggio condiviso che riusa le righe gia' scritte, senza tabelle nuove ne' dipendenze nuove:
  - chat: numero di righe `chat_messages` con `user_id` dell'utente, `role = 'user'` e `created_at >= now - RATE_WINDOW_MS` (la riga viene gia' inserita a ogni messaggio, `chat/route.ts:155-160`);
  - ricerca: numero di righe `search_results` con `user_id` dell'utente e `created_at >= now - RATE_WINDOW_MS` (`search/route.ts:449-454`).
  Se il conteggio raggiunge il tetto configurato, rispondere 429 con l'intestazione `Retry-After` esattamente come fa oggi il ramo in memoria. Il conteggio va fatto con `head: true` e `count: "exact"` (stesso schema gia' usato in `chat/route.ts:124`), quindi senza scaricare righe. NON toccare `process-document`: li' non esiste una riga per chiamata da contare, resta com'e'.
- **Criterio di accettazione:** in entrambe le route, il percorso che porta alla chiamata al modello attraversa sia il controllo in memoria sia il controllo basato sul conteggio delle righe; superato il tetto, la risposta e' 429 con `Retry-After` valorizzato. Nessuna modifica sotto `supabase/`, nessuna variabile d'ambiente nuova, nessun pacchetto nuovo. `npm run check:cache` continua a passare.

### T2 — Verifica la dimensione reale del documento prima di scaricarlo

- **Gravita':** Importante
- **File e righe:** `web/app/api/agent/process-document/route.ts:83-98`
- **Problema concreto:** il controllo della riga 83 usa `doc.size_bytes`, che e' scritto dal browser al caricamento ed e' facoltativo: se manca o non e' un numero il controllo viene saltato del tutto. Il controllo sulla dimensione vera e' alla riga 96, cioe' dopo che `supabase.storage.download()` ha gia' portato l'intero oggetto in memoria nella funzione. I bucket non dichiarano un tetto proprio, quindi un oggetto molto grande consuma memoria e tempo della funzione prima di essere rifiutato.
- **Correzione richiesta:** prima di `download()`, ricavare la dimensione effettiva dell'oggetto dai metadati dello Storage (per esempio elencando la cartella di `doc.storage_path` filtrando sul nome del file, con l'API gia' disponibile in `@supabase/supabase-js`) e confrontarla con `MAX_UPLOAD_BYTES`, uscendo con `failDocument(..., tErr("fileTooLarge"), 413)` se la supera. Tenere il controllo su `doc.size_bytes` come filtro rapido preliminare e lasciare al suo posto quello della riga 96 come ultima rete. Se i metadati non sono leggibili, proseguire come oggi (non bloccare un caricamento legittimo per una lettura fallita), registrando l'anomalia con `console.warn`.
- **Criterio di accettazione:** nel corpo della funzione, la lettura della dimensione reale dell'oggetto compare prima della chiamata a `.download(...)`, e il ramo che supera `MAX_UPLOAD_BYTES` esce con 413 senza aver scaricato il file. Nessuna modifica sotto `supabase/`, nessuna variabile d'ambiente nuova.

### T9 — Non conservare per 24 ore il riquadro motorsport rimasto vuoto per un errore

- **Gravita':** Minore
- **File e righe:** `web/lib/motorsport.ts:114-161` (il `try/catch` e' dentro `fetchBriefing`) e `:163-172`
- **Problema concreto:** `getMotorsportBriefing` avvolge `fetchBriefing` in `unstable_cache` con `revalidate: 86400`, ma il `catch` che trasforma un errore in `EMPTY` sta dentro la funzione memorizzata: per la cache un fallimento e' un risultato valido come un altro, quindi l'elenco vuoto viene conservato con la stessa durata di uno buono. Un solo timeout o errore di rete fa sparire il riquadro notizie dalla home per un giorno intero, anche se il servizio torna disponibile un minuto dopo.
- **Correzione richiesta:** spostare la gestione del fallimento fuori dalla funzione memorizzata: lasciare che l'errore esca da `fetchBriefing` (continuando a registrarlo con `console.error`, come oggi alla riga 158) e racchiudere la chiamata alla funzione memorizzata in `getMotorsportBriefing` in un `try/catch` che restituisce `EMPTY`. Non cambiare `revalidate`, `tags`, il modello, il numero di ricerche web ne' il prompt: `MotorsportSection` deve continuare a ricevere sempre un `MotorsportBriefing` valido e la home a restare in piedi senza notizie.
- **Criterio di accettazione:** in `lib/motorsport.ts` il `catch` che restituisce `EMPTY` si trova fuori dalla funzione passata a `unstable_cache`, e `getMotorsportBriefing` non propaga mai un errore al chiamante. `npm run check:cache` continua a passare (il controllo "riquadro motorsport: la ricerca web gira dentro una richiesta con caching" deve restare verde).

---

## Lavoratore 5

**Branch da usare:** `claude/worker-5-2026-09-21`

**Ordine di esecuzione:** T3, poi T6, poi T8. T3 e' il task di rafforzamento del gruppo e va per primo.

**File ammessi (gli unici modificabili):**
- `web/app/(dashboard)/veicoli/[id]/page.tsx`
- `web/components/DocumentList.tsx`
- `web/lib/engineExtensions.ts`

Nota vincolante: `web/messages/*.json` NON e' modificabile da questo lavoratore. T6 riusa la chiave gia' esistente `documentList.downloadError`, verificata adeguata anche per il caso della finestra bloccata. `web/lib/searchPayload.ts`, `web/components/VehicleDetailTabs.tsx` e `web/lib/vehicleData.ts` vanno solo letti/riusati, mai modificati.

### T3 — Ricontrolla la forma della ricerca salvata anche nella pagina del veicolo

- **Gravita':** Importante
- **File e righe:** `web/app/(dashboard)/veicoli/[id]/page.tsx:46-58`; effetto in `web/components/VehicleDetailTabs.tsx:268,281`
- **Problema concreto:** la riga di `search_results` e' scrivibile direttamente dal browser (la policy verifica di chi e' la riga, non cosa contiene). Per questo la route di ricerca la risanifica anche in lettura, con un commento esplicito (`web/app/api/agent/search/route.ts:294-309`). La pagina del veicolo no: legge `rawResults?.risorse` e lo passa a `VehicleDetailTabs`, dove viene usato con `.filter(...)` alle righe 268 e 281. Se il contenuto salvato non e' un array, la pagina del veicolo si interrompe con un errore di esecuzione e non e' piu' apribile. Lo stesso vale per `rawResults?.specifiche` alla riga 58.
- **Correzione richiesta:** far passare `lastSearch?.results` dalle stesse difese gia' presenti nella route: scartare il valore se non e' un oggetto, se `risorse` non e' un array, e poi applicare `sanitizePayload` da `web/lib/searchPayload.ts`. Mantenere la compatibilita' con il vecchio formato ad array documentata alle righe 54-55. Se dopo il controllo non resta nulla di valido, usare elenco vuoto e specifiche vuote, come gia' avviene quando non c'e' alcuna ricerca salvata.
- **Criterio di accettazione:** `initialResults` e' sempre un array e `initialSpecs` sempre un oggetto, qualunque sia il contenuto della riga letta; con una riga malformata la pagina del veicolo si apre normalmente mostrando "nessuna informazione ancora" invece di interrompersi. La sanificazione riusa `sanitizePayload`, senza duplicarne la logica.

### T6 — Segnala quando il download del documento viene bloccato dal browser

- **Gravita':** Importante
- **File e righe:** `web/components/DocumentList.tsx:13-24`
- **Problema concreto:** lo stato `downloadError` copre solo il fallimento di `createSignedUrl`. La `window.open` della riga 23 parte dopo un `await`, quindi fuori dal gesto dell'utente: i browser la classificano come finestra non richiesta e la bloccano, restituendo `null`. Il valore di ritorno non viene controllato, quindi nel caso di blocco — il piu' frequente dei due — il pulsante "Scarica" non produce alcun effetto visibile e nessun messaggio.
- **Correzione richiesta:** raccogliere il valore restituito da `window.open` e, se e' nullo (o se l'oggetto restituito e' inutilizzabile), attivare lo stesso avviso `downloadError` gia' previsto alle righe 32-36, oppure esporre il link firmato come ancora cliccabile che l'utente puo' aprire con un gesto diretto. Riusare la chiave di traduzione `documentList.downloadError` gia' esistente se il testo resta adeguato; se ne serve una nuova, aggiungerla a tutti e tre i file di `web/messages/`.
- **Criterio di accettazione:** nessun percorso di `handleDownload` termina senza aver aperto il file o aver mostrato un avviso; il valore di ritorno di `window.open` viene controllato.

  *Precisazione vincolante di questa assegnazione:* la chiave `documentList.downloadError` e' stata verificata adeguata, quindi si riusa quella e non si aggiungono chiavi nuove; `web/messages/*.json` non e' fra i file ammessi di questo lavoratore.

### T8 — Elimina le motorizzazioni duplicate dal menu di creazione veicolo

- **Gravita':** Importante
- **File e righe:** da rimuovere in `web/lib/engineExtensions.ts:830-839` (blocco `Cupra` con Tavascan e Terramar), `:855-858` (Skoda Elroq) e `:866` (Ducati Monster, la sola voce `937 937cc 111cv`); voci da conservare in `web/lib/vehicleData.ts:1095-1103`, `:2180-2185`, `:2583-2586`; funzione di unione in `web/lib/vehicleData.ts:2767-2781`
- **Problema concreto:** `getEngineVariants` unisce catalogo base ed estensioni scartando i doppioni per confronto esatto della sigla. Quattro modelli hanno lo stesso motore registrato nei due file con sigle diverse, quindi il confronto non lo riconosce e il menu propone due voci per lo stesso propulsore: Skoda Elroq (`Elettrica 50 170cv` / `Elettrica 55 kWh 170cv` e `Elettrica 85 286cv` / `Elettrica 82 kWh 286cv`), Cupra Tavascan (`Endurance Elettrica 286cv` / `Elettrica 77 kWh 286cv` e `VZ Elettrica 340cv` / `Elettrica 77 kWh 340cv`), Cupra Terramar (`1.5 Hybrid 150cv` / `1.5 eTSI 150cv` e `2.0 TSI VZ 265cv` / `2.0 TSI 265cv`), Ducati Monster (`937cc 111cv` / `937 937cc 111cv`). Chi aggiunge una Elroq vede sei motorizzazioni invece di quattro, e due utenti con la stessa identica auto finiscono con `engine_code` diversi: ricerche IA diverse e nessun riuso della ricerca gia' pagata.
- **Correzione richiesta:** togliere da `ENGINE_EXTENSIONS` le sette voci elencate sopra, applicando la regola gia' scritta nel codice ("a parita' di sigla vince la voce gia' presente" — qui estesa allo stesso motore sotto sigla diversa). Togliere anche le chiavi che restano vuote: `Tavascan` e `Terramar` perdono tutte le voci, quindi va rimosso l'intero blocco `Cupra`; `Elroq` perde tutte le voci e va rimosso, ma la marca `Škoda` resta (conserva `Felicia` e `Favorit`); di `Ducati` -> `Monster` va tolta solo la voce duplicata, il resto resta. NON aggiungere motorizzazioni nuove e non modificare `getEngineVariants`.
- **Criterio di accettazione:** per Skoda Elroq, Cupra Tavascan, Cupra Terramar e Ducati Monster, `getEngineVariants` restituisce rispettivamente 4, 2, 3 e 3 voci, senza due sigle che indichino lo stesso motore; nessuna voce presente prima in `vehicleData.ts` e' stata rimossa o rinominata; `web/lib/engineExtensions.ts` resta sintatticamente valido.

---

## Lavoratore 6

**Branch da usare:** `claude/worker-6-2026-09-21`

**Ordine di esecuzione:** T4, poi T7, poi T5. Nessuno dei tre e' un task di rafforzamento. Questo e' l'unico gruppo autorizzato a modificare `web/messages/{it,en,de}.json`: i tre task aggiungono chiavi in tre namespace distinti (`sectionEditor` per T4, `vehicleNew` per T7, `fileUploader` per T5), quindi vanno eseguiti **in quest'ordine e in commit separati**, verificando ogni volta che le tre lingue restino allineate chiave per chiave. Aggiungere una chiave solo se nessuna esistente e' adeguata.

**File ammessi (gli unici modificabili):**
- `web/components/SectionEditor.tsx`
- `web/components/DeleteVehicleButton.tsx`
- `web/app/(dashboard)/veicoli/nuovo/page.tsx`
- `web/components/FileUploader.tsx`
- `web/messages/it.json`
- `web/messages/en.json`
- `web/messages/de.json`

Nota vincolante: `web/app/api/agent/process-document/route.ts` NON e' modificabile da questo lavoratore. La correzione di T5 e' interamente lato client, come descritto nel testo del task; `web/components/DocumentList.tsx` mostra gia' `processing_error` al posto della rotellina e non va toccato (appartiene al lavoratore 5).

### T4 — Mostra l'errore quando il salvataggio di una scheda non riesce

- **Gravita':** Importante
- **File e righe:** `web/components/SectionEditor.tsx:53-69` (salvataggio) e `web/components/SectionEditor.tsx:96-112` (immagine)
- **Problema concreto:** in `handleSave`, se l'aggiornamento di `vehicle_sections` restituisce un errore il codice esce dal ramo `if (!error)` e non fa nulla: nessun messaggio, nessuna spunta verde, il pulsante torna semplicemente a "Salva". Chi non nota l'assenza della spunta crede di aver salvato e chiude la pagina: le modifiche sono perse senza alcun avviso. Stesso schema in `handleImageUpload`: il file e' gia' nello storage, ma se l'inserimento della riga `section_images` fallisce `if (row)` e' falso, non compare alcun errore e l'immagine sparisce dall'elenco lasciando l'oggetto nello storage senza righe collegate.
- **Correzione richiesta:** introdurre uno stato di errore per il salvataggio (sulla falsariga di `uploadError`, gia' presente alla riga 38 e mostrato alla riga 244) e valorizzarlo quando `error` e' presente; estendere `uploadError` anche al caso in cui l'inserimento di `section_images` fallisce. Usare chiavi di traduzione esistenti dove possibile; se ne servono di nuove, aggiungerle a tutti e tre i file `web/messages/{it,en,de}.json`.
- **Criterio di accettazione:** entrambi i rami di errore valorizzano uno stato mostrato a schermo; nessun percorso di `handleSave` o `handleImageUpload` termina in silenzio dopo un errore. Se sono state aggiunte chiavi di traduzione, esistono identiche in `it.json`, `en.json` e `de.json`.

  *Riscontro di questa assegnazione:* il namespace `sectionEditor` non ha oggi una chiave per l'errore di salvataggio, quindi ne serve una nuova nelle tre lingue; per il ramo immagine e' riusabile `sectionEditor.imageUploadError`, gia' presente.

### T7 — Non ignorare gli errori di pulizia nell'eliminazione e nella creazione di un veicolo

- **Gravita':** Importante
- **File e righe:** `web/components/DeleteVehicleButton.tsx:36-38` e `:65-67`; `web/app/(dashboard)/veicoli/nuovo/page.tsx:144-152`
- **Problema concreto:** il commento alle righe 20-23 di `DeleteVehicleButton` dichiara che ci si ferma se la pulizia non riesce, "altrimenti i file restano nello storage senza piu' alcuna riga che li referenzi". Le letture rispettano la regola, ma le due `storage.remove()` (righe 37 e 66) scartano il proprio errore e il veicolo viene eliminato lo stesso subito dopo: gli oggetti restano nello storage senza righe collegate e nessuno se ne accorge — proprio la situazione che il commento dice di voler evitare. Alla riga 148 di `veicoli/nuovo/page.tsx` la cancellazione compensativa del veicolo appena creato ignora a sua volta il proprio errore: se fallisce, resta in elenco un veicolo senza sezioni (la pagina di dettaglio non ha alcuna scheda selezionabile) e il secondo tentativo dell'utente crea il doppione che il commento dice di voler prevenire.
- **Correzione richiesta:** controllare l'errore delle due `storage.remove()` e interrompere l'eliminazione avvisando l'utente con lo stesso `window.alert(t("deleteError", { message }))` gia' usato per le letture (righe 30, 46, 59), rimettendo `deleting` a `false`. In `veicoli/nuovo/page.tsx`, controllare l'errore della cancellazione compensativa e, se fallisce, dirlo nel messaggio mostrato all'utente invece di proporre un generico "riprova" che creerebbe un doppione.
- **Criterio di accettazione:** in `DeleteVehicleButton` nessuna chiamata allo storage o al database ha l'esito scartato; ogni fallimento porta a un avviso e a `setDeleting(false)`, e `vehicles.delete()` non viene raggiunta dopo una rimozione fallita. In `veicoli/nuovo/page.tsx` l'esito della cancellazione compensativa e' controllato e influenza il messaggio mostrato. Se sono state aggiunte chiavi di traduzione, esistono in tutti e tre i file di `web/messages/`.

  *Riscontro di questa assegnazione:* `DeleteVehicleButton` riusa `vehicleDetail.deleteError`, gia' presente, senza toccare i file di traduzione; per `veicoli/nuovo/page.tsx` il namespace `vehicleNew` ha solo `genericError`, che e' proprio il messaggio da differenziare, quindi per quel ramo serve una chiave nuova nelle tre lingue.

### T5 — Non lasciare un documento bloccato su "in elaborazione"

- **Gravita':** Importante
- **File e righe:** `web/components/FileUploader.tsx:77-82`; effetto in `web/components/DocumentList.tsx:55-64`; percorsi d'uscita interessati in `web/app/api/agent/process-document/route.ts:34-36,38-44,46-51`
- **Problema concreto:** la chiamata a `/api/agent/process-document` e' volutamente asincrona, ma l'esito non viene mai letto: `.catch(() => {})` ignora gli errori di rete e nulla controlla `res.ok`. La route non scrive `processing_error` su tre percorsi d'uscita (401, 429 per limite di frequenza, 400 per corpo non valido) perche' escono prima di leggere la riga del documento. In quei casi il documento resta con `processed = false` e `processing_error = null`, cioe' esattamente lo stato che `DocumentList` disegna come rotellina "in elaborazione": la rotellina non si ferma mai, nessun errore appare e dall'interfaccia non c'e' modo di riprovare.
- **Correzione richiesta:** in `handleUpload`, attendere la risposta (senza bloccare la chiusura del caricamento piu' del necessario) e, se `res.ok` e' falso o la `fetch` fallisce, registrare l'esito sulla riga appena creata aggiornando `documents.processing_error` con un messaggio tradotto (la riga e' dell'utente, quindi l'aggiornamento dal browser e' gia' consentito dalle policy esistenti), poi `router.refresh()` perche' l'elenco mostri lo stato reale. Non cambiare il comportamento del percorso che va a buon fine.
- **Criterio di accettazione:** dopo un esito negativo della route (compreso il 429), la voce nell'elenco documenti mostra il testo di errore al posto della rotellina, e non esiste piu' un percorso in cui `FileUploader` scarta l'esito della chiamata senza lasciarne traccia. Nessuna modifica sotto `supabase/`.

  *Riscontro di questa assegnazione:* `web/app/api/agent/process-document/route.ts` e `web/components/DocumentList.tsx` sono citati nel task solo come contesto e NON vanno modificati (appartengono rispettivamente al lavoratore 4 e al lavoratore 5); la correzione sta tutta in `FileUploader.tsx`. Il namespace `fileUploader` non ha oggi un messaggio adatto a "l'elaborazione non e' partita" (`saveError` riguarda l'inserimento della riga), quindi serve una chiave nuova nelle tre lingue.

---

## Richiede intervento umano (NON assegnato a nessun lavoratore)

Nessun task e' stato tolto dall'assegnazione in questa revisione: tutti e nove i task di `cascade/TASKS.md` sono assegnabili e nessuno tocca file o ambiti vietati.

Restano fuori dall'ambito automatizzabile le due voci gia' segnalate dall'agente 1, per le stesse ragioni: una richiede una modifica sotto `supabase/` (una migrazione), l'altra e' una scelta di prodotto sul compromesso costo/funzionalita' e non la correzione di un difetto.
