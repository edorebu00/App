Data (UTC): 2026-09-21

Origine: `BUG_SCAN.md` alla radice (scan del 2026-09-21 09:47 UTC). Solo difetti osservati e verificati leggendo il codice: nessuna funzionalita' nuova, nessun refactoring estetico.
PR aperte al momento dello scan: nessuna, di nessun autore. Sezione "Gia' in PR": vuota.
PR aperte dei lavoratori (`claude/worker-`): 0 — nessun arretrato, la cascata puo' procedere.

I task T1, T2 e T3 sono interventi di rafforzamento e vanno per primi.

---

## T1 — Rendi il limite di frequenza delle route IA condiviso fra le istanze

- **Gravita':** Importante
- **File e righe:** `web/lib/rateLimit.ts:12-14`; chiamanti `web/app/api/agent/search/route.ts:360-366` e `web/app/api/agent/chat/route.ts:85-91`
- **Problema concreto:** il contatore e' una `Map` in memoria, quindi vale solo per l'istanza serverless che serve quella richiesta. Con piu' istanze attive insieme, lo stesso utente ottiene un multiplo delle 10 ricerche / 30 messaggi ogni 5 minuti previsti, e ogni chiamata in piu' e' a consumo. Il commento alle righe 6-11 di `rateLimit.ts` annota gia' il limite ma non e' mai stato rafforzato.
- **Correzione richiesta:** affiancare al controllo in memoria (che resta come primo filtro a costo zero) un conteggio condiviso che riusa le righe gia' scritte, senza tabelle nuove ne' dipendenze nuove:
  - chat: numero di righe `chat_messages` con `user_id` dell'utente, `role = 'user'` e `created_at >= now - RATE_WINDOW_MS` (la riga viene gia' inserita a ogni messaggio, `chat/route.ts:155-160`);
  - ricerca: numero di righe `search_results` con `user_id` dell'utente e `created_at >= now - RATE_WINDOW_MS` (`search/route.ts:449-454`).
  Se il conteggio raggiunge il tetto configurato, rispondere 429 con l'intestazione `Retry-After` esattamente come fa oggi il ramo in memoria. Il conteggio va fatto con `head: true` e `count: "exact"` (stesso schema gia' usato in `chat/route.ts:124`), quindi senza scaricare righe. NON toccare `process-document`: li' non esiste una riga per chiamata da contare, resta com'e'.
- **Criterio di accettazione:** in entrambe le route, il percorso che porta alla chiamata al modello attraversa sia il controllo in memoria sia il controllo basato sul conteggio delle righe; superato il tetto, la risposta e' 429 con `Retry-After` valorizzato. Nessuna modifica sotto `supabase/`, nessuna variabile d'ambiente nuova, nessun pacchetto nuovo. `npm run check:cache` continua a passare.

## T2 — Verifica la dimensione reale del documento prima di scaricarlo

- **Gravita':** Importante
- **File e righe:** `web/app/api/agent/process-document/route.ts:83-98`
- **Problema concreto:** il controllo della riga 83 usa `doc.size_bytes`, che e' scritto dal browser al caricamento ed e' facoltativo: se manca o non e' un numero il controllo viene saltato del tutto. Il controllo sulla dimensione vera e' alla riga 96, cioe' dopo che `supabase.storage.download()` ha gia' portato l'intero oggetto in memoria nella funzione. I bucket non dichiarano un tetto proprio, quindi un oggetto molto grande consuma memoria e tempo della funzione prima di essere rifiutato.
- **Correzione richiesta:** prima di `download()`, ricavare la dimensione effettiva dell'oggetto dai metadati dello Storage (per esempio elencando la cartella di `doc.storage_path` filtrando sul nome del file, con l'API gia' disponibile in `@supabase/supabase-js`) e confrontarla con `MAX_UPLOAD_BYTES`, uscendo con `failDocument(..., tErr("fileTooLarge"), 413)` se la supera. Tenere il controllo su `doc.size_bytes` come filtro rapido preliminare e lasciare al suo posto quello della riga 96 come ultima rete. Se i metadati non sono leggibili, proseguire come oggi (non bloccare un caricamento legittimo per una lettura fallita), registrando l'anomalia con `console.warn`.
- **Criterio di accettazione:** nel corpo della funzione, la lettura della dimensione reale dell'oggetto compare prima della chiamata a `.download(...)`, e il ramo che supera `MAX_UPLOAD_BYTES` esce con 413 senza aver scaricato il file. Nessuna modifica sotto `supabase/`, nessuna variabile d'ambiente nuova.

## T3 — Ricontrolla la forma della ricerca salvata anche nella pagina del veicolo

- **Gravita':** Importante
- **File e righe:** `web/app/(dashboard)/veicoli/[id]/page.tsx:46-58`; effetto in `web/components/VehicleDetailTabs.tsx:268,281`
- **Problema concreto:** la riga di `search_results` e' scrivibile direttamente dal browser (la policy verifica di chi e' la riga, non cosa contiene). Per questo la route di ricerca la risanifica anche in lettura, con un commento esplicito (`web/app/api/agent/search/route.ts:294-309`). La pagina del veicolo no: legge `rawResults?.risorse` e lo passa a `VehicleDetailTabs`, dove viene usato con `.filter(...)` alle righe 268 e 281. Se il contenuto salvato non e' un array, la pagina del veicolo si interrompe con un errore di esecuzione e non e' piu' apribile. Lo stesso vale per `rawResults?.specifiche` alla riga 58.
- **Correzione richiesta:** far passare `lastSearch?.results` dalle stesse difese gia' presenti nella route: scartare il valore se non e' un oggetto, se `risorse` non e' un array, e poi applicare `sanitizePayload` da `web/lib/searchPayload.ts`. Mantenere la compatibilita' con il vecchio formato ad array documentata alle righe 54-55. Se dopo il controllo non resta nulla di valido, usare elenco vuoto e specifiche vuote, come gia' avviene quando non c'e' alcuna ricerca salvata.
- **Criterio di accettazione:** `initialResults` e' sempre un array e `initialSpecs` sempre un oggetto, qualunque sia il contenuto della riga letta; con una riga malformata la pagina del veicolo si apre normalmente mostrando "nessuna informazione ancora" invece di interrompersi. La sanificazione riusa `sanitizePayload`, senza duplicarne la logica.

## T4 — Mostra l'errore quando il salvataggio di una scheda non riesce

- **Gravita':** Importante
- **File e righe:** `web/components/SectionEditor.tsx:53-69` (salvataggio) e `web/components/SectionEditor.tsx:96-112` (immagine)
- **Problema concreto:** in `handleSave`, se l'aggiornamento di `vehicle_sections` restituisce un errore il codice esce dal ramo `if (!error)` e non fa nulla: nessun messaggio, nessuna spunta verde, il pulsante torna semplicemente a "Salva". Chi non nota l'assenza della spunta crede di aver salvato e chiude la pagina: le modifiche sono perse senza alcun avviso. Stesso schema in `handleImageUpload`: il file e' gia' nello storage, ma se l'inserimento della riga `section_images` fallisce `if (row)` e' falso, non compare alcun errore e l'immagine sparisce dall'elenco lasciando l'oggetto nello storage senza righe collegate.
- **Correzione richiesta:** introdurre uno stato di errore per il salvataggio (sulla falsariga di `uploadError`, gia' presente alla riga 38 e mostrato alla riga 244) e valorizzarlo quando `error` e' presente; estendere `uploadError` anche al caso in cui l'inserimento di `section_images` fallisce. Usare chiavi di traduzione esistenti dove possibile; se ne servono di nuove, aggiungerle a tutti e tre i file `web/messages/{it,en,de}.json`.
- **Criterio di accettazione:** entrambi i rami di errore valorizzano uno stato mostrato a schermo; nessun percorso di `handleSave` o `handleImageUpload` termina in silenzio dopo un errore. Se sono state aggiunte chiavi di traduzione, esistono identiche in `it.json`, `en.json` e `de.json`.

## T5 — Non lasciare un documento bloccato su "in elaborazione"

- **Gravita':** Importante
- **File e righe:** `web/components/FileUploader.tsx:77-82`; effetto in `web/components/DocumentList.tsx:55-64`; percorsi d'uscita interessati in `web/app/api/agent/process-document/route.ts:34-36,38-44,46-51`
- **Problema concreto:** la chiamata a `/api/agent/process-document` e' volutamente asincrona, ma l'esito non viene mai letto: `.catch(() => {})` ignora gli errori di rete e nulla controlla `res.ok`. La route non scrive `processing_error` su tre percorsi d'uscita (401, 429 per limite di frequenza, 400 per corpo non valido) perche' escono prima di leggere la riga del documento. In quei casi il documento resta con `processed = false` e `processing_error = null`, cioe' esattamente lo stato che `DocumentList` disegna come rotellina "in elaborazione": la rotellina non si ferma mai, nessun errore appare e dall'interfaccia non c'e' modo di riprovare.
- **Correzione richiesta:** in `handleUpload`, attendere la risposta (senza bloccare la chiusura del caricamento piu' del necessario) e, se `res.ok` e' falso o la `fetch` fallisce, registrare l'esito sulla riga appena creata aggiornando `documents.processing_error` con un messaggio tradotto (la riga e' dell'utente, quindi l'aggiornamento dal browser e' gia' consentito dalle policy esistenti), poi `router.refresh()` perche' l'elenco mostri lo stato reale. Non cambiare il comportamento del percorso che va a buon fine.
- **Criterio di accettazione:** dopo un esito negativo della route (compreso il 429), la voce nell'elenco documenti mostra il testo di errore al posto della rotellina, e non esiste piu' un percorso in cui `FileUploader` scarta l'esito della chiamata senza lasciarne traccia. Nessuna modifica sotto `supabase/`.

## T6 — Segnala quando il download del documento viene bloccato dal browser

- **Gravita':** Importante
- **File e righe:** `web/components/DocumentList.tsx:13-24`
- **Problema concreto:** lo stato `downloadError` copre solo il fallimento di `createSignedUrl`. La `window.open` della riga 23 parte dopo un `await`, quindi fuori dal gesto dell'utente: i browser la classificano come finestra non richiesta e la bloccano, restituendo `null`. Il valore di ritorno non viene controllato, quindi nel caso di blocco — il piu' frequente dei due — il pulsante "Scarica" non produce alcun effetto visibile e nessun messaggio.
- **Correzione richiesta:** raccogliere il valore restituito da `window.open` e, se e' nullo (o se l'oggetto restituito e' inutilizzabile), attivare lo stesso avviso `downloadError` gia' previsto alle righe 32-36, oppure esporre il link firmato come ancora cliccabile che l'utente puo' aprire con un gesto diretto. Riusare la chiave di traduzione `documentList.downloadError` gia' esistente se il testo resta adeguato; se ne serve una nuova, aggiungerla a tutti e tre i file di `web/messages/`.
- **Criterio di accettazione:** nessun percorso di `handleDownload` termina senza aver aperto il file o aver mostrato un avviso; il valore di ritorno di `window.open` viene controllato.

## T7 — Non ignorare gli errori di pulizia nell'eliminazione e nella creazione di un veicolo

- **Gravita':** Importante
- **File e righe:** `web/components/DeleteVehicleButton.tsx:36-38` e `:65-67`; `web/app/(dashboard)/veicoli/nuovo/page.tsx:144-152`
- **Problema concreto:** il commento alle righe 20-23 di `DeleteVehicleButton` dichiara che ci si ferma se la pulizia non riesce, "altrimenti i file restano nello storage senza piu' alcuna riga che li referenzi". Le letture rispettano la regola, ma le due `storage.remove()` (righe 37 e 66) scartano il proprio errore e il veicolo viene eliminato lo stesso subito dopo: gli oggetti restano nello storage senza righe collegate e nessuno se ne accorge — proprio la situazione che il commento dice di voler evitare. Alla riga 148 di `veicoli/nuovo/page.tsx` la cancellazione compensativa del veicolo appena creato ignora a sua volta il proprio errore: se fallisce, resta in elenco un veicolo senza sezioni (la pagina di dettaglio non ha alcuna scheda selezionabile) e il secondo tentativo dell'utente crea il doppione che il commento dice di voler prevenire.
- **Correzione richiesta:** controllare l'errore delle due `storage.remove()` e interrompere l'eliminazione avvisando l'utente con lo stesso `window.alert(t("deleteError", { message }))` gia' usato per le letture (righe 30, 46, 59), rimettendo `deleting` a `false`. In `veicoli/nuovo/page.tsx`, controllare l'errore della cancellazione compensativa e, se fallisce, dirlo nel messaggio mostrato all'utente invece di proporre un generico "riprova" che creerebbe un doppione.
- **Criterio di accettazione:** in `DeleteVehicleButton` nessuna chiamata allo storage o al database ha l'esito scartato; ogni fallimento porta a un avviso e a `setDeleting(false)`, e `vehicles.delete()` non viene raggiunta dopo una rimozione fallita. In `veicoli/nuovo/page.tsx` l'esito della cancellazione compensativa e' controllato e influenza il messaggio mostrato. Se sono state aggiunte chiavi di traduzione, esistono in tutti e tre i file di `web/messages/`.

## T8 — Elimina le motorizzazioni duplicate dal menu di creazione veicolo

- **Gravita':** Importante
- **File e righe:** da rimuovere in `web/lib/engineExtensions.ts:830-839` (blocco `Cupra` con Tavascan e Terramar), `:855-858` (Skoda Elroq) e `:866` (Ducati Monster, la sola voce `937 937cc 111cv`); voci da conservare in `web/lib/vehicleData.ts:1095-1103`, `:2180-2185`, `:2583-2586`; funzione di unione in `web/lib/vehicleData.ts:2767-2781`
- **Problema concreto:** `getEngineVariants` unisce catalogo base ed estensioni scartando i doppioni per confronto esatto della sigla. Quattro modelli hanno lo stesso motore registrato nei due file con sigle diverse, quindi il confronto non lo riconosce e il menu propone due voci per lo stesso propulsore: Skoda Elroq (`Elettrica 50 170cv` / `Elettrica 55 kWh 170cv` e `Elettrica 85 286cv` / `Elettrica 82 kWh 286cv`), Cupra Tavascan (`Endurance Elettrica 286cv` / `Elettrica 77 kWh 286cv` e `VZ Elettrica 340cv` / `Elettrica 77 kWh 340cv`), Cupra Terramar (`1.5 Hybrid 150cv` / `1.5 eTSI 150cv` e `2.0 TSI VZ 265cv` / `2.0 TSI 265cv`), Ducati Monster (`937cc 111cv` / `937 937cc 111cv`). Chi aggiunge una Elroq vede sei motorizzazioni invece di quattro, e due utenti con la stessa identica auto finiscono con `engine_code` diversi: ricerche IA diverse e nessun riuso della ricerca gia' pagata.
- **Correzione richiesta:** togliere da `ENGINE_EXTENSIONS` le sette voci elencate sopra, applicando la regola gia' scritta nel codice ("a parita' di sigla vince la voce gia' presente" — qui estesa allo stesso motore sotto sigla diversa). Togliere anche le chiavi che restano vuote: `Tavascan` e `Terramar` perdono tutte le voci, quindi va rimosso l'intero blocco `Cupra`; `Elroq` perde tutte le voci e va rimosso, ma la marca `Škoda` resta (conserva `Felicia` e `Favorit`); di `Ducati` -> `Monster` va tolta solo la voce duplicata, il resto resta. NON aggiungere motorizzazioni nuove e non modificare `getEngineVariants`.
- **Criterio di accettazione:** per Skoda Elroq, Cupra Tavascan, Cupra Terramar e Ducati Monster, `getEngineVariants` restituisce rispettivamente 4, 2, 3 e 3 voci, senza due sigle che indichino lo stesso motore; nessuna voce presente prima in `vehicleData.ts` e' stata rimossa o rinominata; `web/lib/engineExtensions.ts` resta sintatticamente valido.

## T9 — Non conservare per 24 ore il riquadro motorsport rimasto vuoto per un errore

- **Gravita':** Minore
- **File e righe:** `web/lib/motorsport.ts:114-161` (il `try/catch` e' dentro `fetchBriefing`) e `:163-172`
- **Problema concreto:** `getMotorsportBriefing` avvolge `fetchBriefing` in `unstable_cache` con `revalidate: 86400`, ma il `catch` che trasforma un errore in `EMPTY` sta dentro la funzione memorizzata: per la cache un fallimento e' un risultato valido come un altro, quindi l'elenco vuoto viene conservato con la stessa durata di uno buono. Un solo timeout o errore di rete fa sparire il riquadro notizie dalla home per un giorno intero, anche se il servizio torna disponibile un minuto dopo.
- **Correzione richiesta:** spostare la gestione del fallimento fuori dalla funzione memorizzata: lasciare che l'errore esca da `fetchBriefing` (continuando a registrarlo con `console.error`, come oggi alla riga 158) e racchiudere la chiamata alla funzione memorizzata in `getMotorsportBriefing` in un `try/catch` che restituisce `EMPTY`. Non cambiare `revalidate`, `tags`, il modello, il numero di ricerche web ne' il prompt: `MotorsportSection` deve continuare a ricevere sempre un `MotorsportBriefing` valido e la home a restare in piedi senza notizie.
- **Criterio di accettazione:** in `lib/motorsport.ts` il `catch` che restituisce `EMPTY` si trova fuori dalla funzione passata a `unstable_cache`, e `getMotorsportBriefing` non propaga mai un errore al chiamante. `npm run check:cache` continua a passare (il controllo "riquadro motorsport: la ricerca web gira dentro una richiesta con caching" deve restare verde).

---

## Gia' in PR

Nessuna: al momento dello scan non risultano pull request aperte nel repository, di nessun autore.

## Richiede intervento umano (NON assegnare)

- **Tetto di dimensione sui bucket di Storage.** `supabase/migrations/0001_init.sql:187-193` crea `vehicle-files` e `vehicle-images` senza dichiarare un limite di dimensione per oggetto: il tetto di 20 MB esiste solo nel codice dell'applicazione (`web/lib/files.ts:9`). Portarlo anche a livello di bucket richiede una migrazione sotto `supabase/`, fuori dall'ambito automatizzabile. Il T2 rafforza intanto il lato applicativo.
- **Chiamata al modello dalla home pubblica.** `web/components/MotorsportSection.tsx:15` chiama `getMotorsportBriefing` da una pagina raggiungibile senza accesso. Il costo e' contenuto dalla cache di 24 ore per lingua (una chiamata al giorno per lingua effettivamente visitata), ma cambiare questo compromesso e' una scelta di prodotto, non una correzione.
