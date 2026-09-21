# Scansione notturna dei bug — MyVehicle

Data scan: 2026-09-21 09:47 UTC
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json`, file generati con l'intestazione "GENERATO DA")
PR aperte al momento dello scan: nessuna (di nessun autore).

Ogni problema qui sotto e' stato verificato leggendo personalmente il codice indicato (file + righe). I problemi della notte precedente (perdita dati fra sezioni, veicoli mescolati, errori ignorati) risultano corretti dalla PR #35 e non sono ripetuti qui.

Verifiche automatiche eseguite senza trovare difetti: `npm run check:cache` (23 controlli su punti di cache, finestra della cronologia, pulizia del testo estratto, livelli di sforzo) passa interamente; le chiavi di traduzione di `it`/`en`/`de` combaciano una a una (240 chiavi usate, nessuna mancante); tutti i `href` verso l'esterno passano da `safeExternalUrl`; nessun uso di `dangerouslySetInnerHTML`.

## Bloccante

Nessun problema bloccante trovato in questa scansione.

## Importante

### I1 — Il limite di frequenza delle route IA non e' condiviso fra le istanze
File: `web/lib/rateLimit.ts:12-14`, usato in `web/app/api/agent/search/route.ts:360`, `web/app/api/agent/chat/route.ts:85`, `web/app/api/agent/process-document/route.ts:38`

Il contatore vive in una `Map` in memoria, quindi appartiene alla singola istanza serverless che serve la richiesta. Con piu' istanze attive contemporaneamente il numero di chiamate al modello effettivamente concesse a uno stesso utente e' un multiplo di quello configurato (10 ricerche / 30 messaggi ogni 5 minuti), e ogni chiamata in piu' e' a consumo. La limitazione e' gia' annotata nel commento del file, ma non e' ancora stata rafforzata.

Proposta: affiancare al contatore in memoria un conteggio condiviso che riusa le righe gia' salvate per utente nella finestra temporale (`chat_messages` per la chat, `search_results` per la ricerca), senza tabelle nuove.

### I2 — Il documento viene scaricato per intero prima che la dimensione reale sia verificata
File: `web/app/api/agent/process-document/route.ts:83-98`

Il controllo alla riga 83 usa `doc.size_bytes`, un valore scritto dal browser al momento del caricamento e facoltativo (`bigint` nullable in `supabase/migrations/0001_init.sql:109`): se manca o non e' un numero, il controllo viene semplicemente saltato. Il controllo sulla dimensione vera (riga 96) arriva invece dopo `supabase.storage.download()`, cioe' dopo che l'intero oggetto e' stato portato in memoria nella funzione. I bucket non dichiarano un tetto di dimensione proprio, quindi un file molto grande occupa memoria e tempo della funzione prima di essere rifiutato.

Proposta: leggere la dimensione dell'oggetto dai metadati dello Storage prima di scaricarlo e confrontarla con `MAX_UPLOAD_BYTES`, tenendo `size_bytes` solo come filtro rapido preliminare.

### I3 — La pagina del veicolo usa la ricerca salvata senza ricontrollarne la forma
File: `web/app/(dashboard)/veicoli/[id]/page.tsx:56-58`, effetto in `web/components/VehicleDetailTabs.tsx:268,281`

La riga di `search_results` e' scrivibile direttamente dal browser (la policy controlla di chi e' la riga, non cosa contiene): per questo `findReusableSearch` la risanifica anche in lettura, con un commento esplicito (`web/app/api/agent/search/route.ts:294-309`). La pagina del veicolo, invece, legge `results.risorse` e lo passa tale e quale a `VehicleDetailTabs`, dove viene usato con `.filter(...)`. Se il contenuto salvato non e' un array la pagina del veicolo si interrompe con un errore di esecuzione e non e' piu' apribile. Lo stesso vale per `results.specifiche` alla riga 58.

Proposta: far passare `lastSearch.results` dalla stessa sanificazione gia' usata in lettura dalla route di ricerca, e ripiegare su elenco vuoto se non resta nulla di valido.

### I4 — Il salvataggio di una scheda puo' fallire senza che l'utente lo sappia
File: `web/components/SectionEditor.tsx:59-68` (salvataggio), `web/components/SectionEditor.tsx:101-108` (immagine)

In `handleSave`, se l'aggiornamento di `vehicle_sections` restituisce un errore, il codice esce dal ramo `if (!error)` e non fa nulla: il pulsante torna a "Salva", non compare "Salvato" ne' alcun messaggio di errore. L'utente che non nota l'assenza della spunta verde crede di aver salvato e chiude la pagina: le modifiche sono perse senza alcun avviso.
Stesso schema in `handleImageUpload`: il file e' gia' stato caricato nello storage, ma se l'inserimento della riga `section_images` fallisce, `if (row)` e' falso, non compare alcun errore e l'immagine sparisce dall'elenco, lasciando l'oggetto nello storage senza righe che lo referenzino.

Proposta: mostrare un messaggio di errore in entrambi i casi, come gia' fa il ramo `uploadError` alla riga 98-99.

### I5 — Un documento puo' restare per sempre su "in elaborazione"
File: `web/components/FileUploader.tsx:78-82`, effetto in `web/components/DocumentList.tsx:55-64`

La chiamata a `/api/agent/process-document` e' volutamente asincrona, ma l'esito non viene mai letto: `.catch(() => {})` ignora gli errori di rete e nulla controlla `res.ok`. La route non scrive `processing_error` su tre dei suoi percorsi d'uscita — 401 (riga 34), 429 limite di frequenza (riga 39) e 400 corpo non valido (riga 50) — perche' escono prima ancora di leggere la riga del documento. In quei casi il documento resta con `processed = false` e `processing_error = null`, cioe' esattamente lo stato che `DocumentList` disegna come rotellina "in elaborazione": la rotellina non si ferma mai, nessun errore viene mostrato e dall'interfaccia non c'e' modo di riprovare.

Proposta: controllare `res.ok` nel caricatore e, in caso di esito negativo, registrare l'errore sulla riga del documento (o mostrarlo) invece di lasciare lo stato in sospeso.

### I6 — Il download di un documento puo' non fare nulla senza dirlo
File: `web/components/DocumentList.tsx:19-23`

Lo stato `downloadError` copre solo il fallimento di `createSignedUrl`. La `window.open` della riga 23 parte dopo un `await`, quindi fuori dal gesto dell'utente: i browser la classificano come finestra non richiesta e la bloccano, restituendo `null`. Il valore di ritorno non viene controllato, quindi nel caso di blocco — il piu' frequente dei due — il pulsante "Scarica" non produce alcun effetto visibile e nessun messaggio.

Proposta: controllare il valore restituito da `window.open` e, se e' nullo, mostrare lo stesso avviso gia' previsto (o offrire il link firmato come ancora cliccabile).

### I7 — Errori di pulizia ignorati durante l'eliminazione di un veicolo
File: `web/components/DeleteVehicleButton.tsx:36-38,65-67`; caso analogo in `web/app/(dashboard)/veicoli/nuovo/page.tsx:148`

Il commento alle righe 20-23 dichiara che ci si ferma se la pulizia non riesce, "altrimenti i file restano nello storage senza piu' alcuna riga che li referenzi". Le letture rispettano questa regola, ma le due `storage.remove()` (righe 37 e 66) scartano il proprio errore e il veicolo viene comunque eliminato subito dopo: se la rimozione non riesce, gli oggetti restano nello storage senza piu' alcuna riga collegata e nessuno se ne accorge — cioe' proprio la situazione che il commento dice di voler evitare.
Alla riga 148 di `veicoli/nuovo/page.tsx` la cancellazione compensativa del veicolo appena creato ignora a sua volta il proprio errore: se fallisce, resta in elenco un veicolo senza sezioni (la pagina di dettaglio non ha alcuna scheda selezionabile) e il secondo tentativo dell'utente crea il doppione che il commento dice di voler prevenire.

Proposta: controllare l'errore delle rimozioni e della cancellazione compensativa e avvisare l'utente, coerentemente con il trattamento gia' riservato alle letture.

### I8 — Motorizzazioni duplicate nel menu di creazione veicolo
File: `web/lib/vehicleData.ts:1095-1103,2180-2185,2583-2586` e `web/lib/engineExtensions.ts:831-838,855-858,865-867`

`getEngineVariants` (`web/lib/vehicleData.ts:2767-2781`) unisce catalogo base ed estensioni scartando i doppioni per confronto esatto della sigla. Quattro modelli hanno pero' lo stesso motore registrato nei due file con sigle diverse, quindi il confronto non lo riconosce e il menu propone due voci per lo stesso propulsore:

| Modello | Voce in `vehicleData.ts` | Voce in `engineExtensions.ts` |
| --- | --- | --- |
| Skoda Elroq | `Elettrica 50 170cv` | `Elettrica 55 kWh 170cv` |
| Skoda Elroq | `Elettrica 85 286cv` | `Elettrica 82 kWh 286cv` |
| Cupra Tavascan | `Endurance Elettrica 286cv` | `Elettrica 77 kWh 286cv` |
| Cupra Tavascan | `VZ Elettrica 340cv` | `Elettrica 77 kWh 340cv` |
| Cupra Terramar | `1.5 Hybrid 150cv` | `1.5 eTSI 150cv` |
| Cupra Terramar | `2.0 TSI VZ 265cv` | `2.0 TSI 265cv` |
| Ducati Monster | `937cc 111cv` | `937 937cc 111cv` |

In pratica: chi aggiunge una Elroq vede sei motorizzazioni al posto di quattro, e due utenti con la stessa identica auto finiscono con `engine_code` diversi — quindi con ricerche IA diverse e nessun riuso della ricerca gia' pagata.

Proposta: togliere dalle estensioni le voci che duplicano un motore gia' presente nel catalogo base, secondo la regola gia' scritta nel codice ("a parita' di sigla vince la voce gia' presente").

## Minore

### M1 — Un errore momentaneo svuota il riquadro motorsport per 24 ore
File: `web/lib/motorsport.ts:114-161` (il `try/catch` sta dentro `fetchBriefing`), `web/lib/motorsport.ts:167-172`

`getMotorsportBriefing` avvolge `fetchBriefing` in `unstable_cache` con `revalidate: 86400`. Ma il `catch` che trasforma un errore in `EMPTY` sta *dentro* la funzione memorizzata: per la cache un fallimento e' un risultato valido come un altro, quindi l'elenco vuoto viene conservato con la stessa durata di uno buono. Un solo timeout o errore di rete fa sparire il riquadro notizie dalla home per un giorno intero, anche se il servizio torna disponibile un minuto dopo.

Proposta: lasciare che il fallimento esca dalla funzione memorizzata e gestirlo fuori dalla cache, cosi' l'esito vuoto non viene conservato e la visita successiva riprova.

### M2 — Un messaggio di chat non inviato viene perso
File: `web/components/ChatPanel.tsx:29-34,45-47`

`setInput("")` svuota il campo prima della chiamata. Se la richiesta fallisce (rete, 429, 500) il testo non viene ripristinato: l'utente deve riscrivere il messaggio da capo. Inoltre la bolla aggiunta in modo ottimistico alla riga 31 resta a schermo anche quando il messaggio non e' stato salvato lato server (per esempio con un 429, che esce prima dell'inserimento in `chat_messages`): dopo un aggiornamento della pagina la bolla sparisce senza spiegazione.

Proposta: ripristinare il testo nel campo quando la richiesta non va a buon fine e togliere la bolla ottimistica corrispondente.

### M3 — La pagina offline puo' risolversi in nulla
File: `web/public/sw.js:88-90`

`caches.match(OFFLINE_URL)` restituisce `undefined` se l'installazione del guscio non e' riuscita (`sw.js:36-39` ingoia volutamente l'errore di `addAll`). `event.respondWith` riceve allora una promessa risolta a `undefined` e la navigazione fallisce con un errore di rete generico invece che con la pagina offline dedicata. L'effetto pratico e' limitato (si e' comunque offline), ma il ripiego previsto non c'e'.

Proposta: se la pagina offline non e' in cache, restituire una `Response` minima invece di `undefined`.

## Richiede intervento umano

- **Tetto di dimensione sui bucket di Storage.** `supabase/migrations/0001_init.sql:187-193` crea `vehicle-files` e `vehicle-images` senza dichiarare un limite di dimensione per oggetto: il tetto di 20 MB esiste solo nel codice dell'applicazione. Metterlo anche a livello di bucket richiede una migrazione in `supabase/`, quindi fuori dall'ambito automatizzabile.
- **Chiamata al modello dalla home pubblica.** `web/components/MotorsportSection.tsx:15` chiama `getMotorsportBriefing` da una pagina raggiungibile senza accesso. Il costo e' contenuto dalla cache di 24 ore per lingua (una chiamata al giorno per lingua visitata), ma se si vuole cambiare questo compromesso e' una scelta di prodotto, non una correzione.
