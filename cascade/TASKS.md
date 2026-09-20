Data (UTC): 2026-09-20

Nessuna PR aperta dei lavoratori al momento dello scan: nessun task duplicato da annotare in "Gia' in PR".

## Task

### T1 — `SectionEditor` puo' sovrascrivere la scheda sbagliata con dati non salvati (Bloccante)
File: `web/components/VehicleDetailTabs.tsx:262-274` (dove viene renderizzato `SectionEditor`)
Problema: `SectionEditor` inizializza il proprio stato (`fields`, `notes`, `images`, ecc.) da `useState` seedato dalle props, ma il componente e' montato senza `key`. Cambiando tab (stessa `VehicleDetailTabs`, `activeId` cambia), React riusa la stessa istanza invece di rimontarla: lo stato interno resta quello della sezione precedente anche se la prop `section` e' gia' cambiata. Se l'utente modifica un campo su una sezione senza salvare, passa a un'altra tab e preme "Salva", i dati stantii della sezione precedente vengono scritti sulla riga `vehicle_sections` della sezione corrente (l'id e' corretto, il contenuto no): perdita dati reale.
Correzione richiesta: aggiungere `key={activeSection.id}` al `<SectionEditor .../>` in `VehicleDetailTabs.tsx` (circa riga 263), cosi' il componente si rimonta a ogni cambio sezione e il suo stato riparte dai dati corretti.
Criterio di accettazione: aprendo una scheda veicolo con almeno due sezioni, modificando un campo custom sulla prima sezione senza salvare, passando alla seconda sezione e salvando, la modifica non salvata sulla prima sezione NON deve comparire ne' essere scritta sulla seconda sezione (verificabile anche solo ispezionando che il valore mostrato nei campi della seconda sezione corrisponda ai suoi dati originali, non a quelli della prima).

### T2 — Cambiando veicolo dalla sidebar, la pagina mostra dati mescolati del veicolo precedente (Importante)
File: `web/app/(dashboard)/veicoli/[id]/page.tsx:86-97` (dove viene renderizzato `VehicleDetailTabs`)
Problema: `VehicleDetailTabs` inizializza `activeId`/`results`/`specs`/`bollo`/`hasSearchedOnce` da `useState` seedato dalle props, ma e' montato senza `key`. Navigando da un veicolo a un altro tramite i link della Sidebar (layout persistente, stessa struttura JSX), React riusa la stessa istanza: `sections` (prop) si aggiorna al nuovo veicolo ma lo stato interno (risultati di ricerca, specifiche, tab attiva) resta quello del veicolo precedente, mostrando link "Autodoc"/"piano di manutenzione" che appartengono al veicolo sbagliato.
Correzione richiesta: aggiungere `key={v.id}` al `<VehicleDetailTabs .../>` in `veicoli/[id]/page.tsx` (circa riga 86).
Criterio di accettazione: aprendo un veicolo A, eseguendo una ricerca online (cosi' che risultati/specifiche siano popolati), poi navigando a un veicolo B dalla sidebar senza refresh di pagina, la pagina di B non deve mostrare risultati di ricerca, specifiche o link "Autodoc"/"piano di manutenzione" provenienti da A.

### T3 — Creazione veicolo: se falliscono le sezioni di default, l'utente vede comunque "successo" (Importante)
File: `web/app/(dashboard)/veicoli/nuovo/page.tsx:135-150`
Problema: se l'insert di `vehicle_sections` (righe 135-142) fallisce, l'errore viene solo loggato in console (riga 145) e il flusso prosegue comunque mostrando l'overlay di successo (`setJustAdded`, riga 150) e reindirizzando come se tutto fosse andato a buon fine. Il veicolo resta permanentemente senza sezioni, senza che l'utente ne sia informato.
Correzione richiesta: se `sectionsError` e' presente, mostrare un messaggio d'errore all'utente (riusando lo stato `error` gia' presente nel componente) invece di procedere a `setJustAdded(...)`.
Criterio di accettazione: simulando un fallimento dell'insert di `vehicle_sections` (es. temporaneamente via un test/mock), l'utente deve vedere un messaggio di errore e NON l'overlay "veicolo aggiunto con successo".

### T4 — La chat esclude silenziosamente un documento grande e dichiara "nessun documento caricato" (Importante)
File: `web/app/api/agent/chat/route.ts:15,129-134`
Problema: il budget di contesto chat e' `MAX_CONTEXT_CHARS = 250_000`, ma un singolo documento elaborato puo' arrivare fino a 400.000 caratteri (tetto di `process-document/route.ts`). Il controllo `if (context.length + chunk.length > MAX_CONTEXT_CHARS) break;` (riga 132) avviene prima di appendere: se il primo documento da solo supera il budget, il ciclo si interrompe subito e `context` resta vuoto, facendo scrivere nel prompt di sistema che l'utente non ha documenti caricati (vedi `web/lib/chatPrompt.ts:20-29`), anche se un manuale e' stato caricato con successo.
Correzione richiesta: quando un singolo `chunk` supera lo spazio residuo in `context`, troncarlo al budget rimanente e aggiungerlo comunque (invece di saltarlo interamente con `break`), cosi' la chat ha sempre accesso almeno a una porzione del documento.
Criterio di accettazione: con un documento la cui `extracted_text` supera 250.000 caratteri, dopo l'elaborazione la chat su quel veicolo deve includere nel prompt di sistema una porzione (troncata) del documento, non una stringa vuota; il prompt non deve piu' affermare che non ci sono documenti caricati quando ce n'e' almeno uno elaborato.

### T5 — La chat "senza veicolo" mescola documenti e cronologia di tutti i veicoli dell'utente (Importante)
File: `web/app/api/agent/chat/route.ts:114-127,140-148`
Problema: quando `vehicleId` e' `null`, le query su `documents` (114-120), sul conteggio di `chat_messages` (122-123) e sulla cronologia (140-146) applicano il filtro per veicolo solo con `if (vehicleId) ...`, senza alcun ramo `else`: quando manca il vehicleId, la query non filtra affatto e restituisce le righe di TUTTI i veicoli dell'utente insieme, invece dei soli documenti/messaggi "senza veicolo". La route di ricerca gestisce correttamente lo stesso caso con `.is("vehicle_id", null)` (`web/app/api/agent/search/route.ts:287`).
Correzione richiesta: applicare lo stesso pattern di `search/route.ts:287` alle tre query in `chat/route.ts`: quando `vehicleId` e' `null`, filtrare esplicitamente con `.is("vehicle_id", null)` invece di non filtrare.
Criterio di accettazione: chiamando l'API di chat con `vehicleId` omesso/non valido, i documenti e la cronologia restituiti/usati nel prompt devono provenire solo dalle righe con `vehicle_id IS NULL`, non da tutti i veicoli dell'utente.

### T6 — Una riga `search_results` corrotta manda in crash la route di ricerca fuori dalla gestione errori (Importante)
File: `web/app/api/agent/search/route.ts:269-307,343`, `web/lib/searchPayload.ts:17-20`
Problema: `findReusableSearch` (search/route.ts:269-307) valida che `results` sia un oggetto non-array (riga 294) ma non valida che `results.risorse` sia specificamente un array. `sanitizePayload` (searchPayload.ts:20) itera con `for (const risorsa of payload.risorse || [])`: se `risorse` e' un valore non-array non falsy (es. un oggetto), il `for...of` lancia un'eccezione non catturata, perche' la chiamata a `findReusableSearch` (riga 343) avviene prima del blocco `try` della route (che inizia a riga 385). La route risponde quindi con l'errore generico 500 di Next.js invece del formato JSON abituale, e questo puo' avvenire ripetutamente perche' accade prima del controllo di rate limit.
Correzione richiesta: in `findReusableSearch`, dopo il controllo esistente a riga 294, validare esplicitamente che `results.risorse` sia un array (altrimenti trattare come non riutilizzabile e ritornare `null`, come gia' fatto per il vecchio formato ad array puro).
Criterio di accettazione: con una riga `search_results.results` che ha `risorse` non-array (es. un oggetto), una richiesta di ricerca che la incontra come candidato di riuso deve ricadere sul percorso "rifai la ricerca" (o restituire un errore JSON gestito), senza mai propagare un'eccezione non gestita fuori dalla route.

### T7 — Errori di download documento ignorati senza alcun feedback all'utente (Importante)
File: `web/components/DocumentList.tsx:11-19`
Problema: `handleDownload` non gestisce il caso in cui `createSignedUrl` fallisca o non restituisca un `signedUrl`: il click su "Scarica" non produce alcun messaggio ne' indicatore, l'utente non sa se il click ha funzionato.
Correzione richiesta: quando `error` e' presente o `data?.signedUrl` manca, mostrare un messaggio di errore visibile (uno stato locale + testo, seguendo lo stesso pattern gia' usato in altri componenti come `SectionEditor.tsx` con `uploadError`).
Criterio di accettazione: simulando un fallimento di `createSignedUrl` (es. path inesistente), il click su "Scarica" deve mostrare un messaggio di errore visibile all'utente invece di non fare nulla.

### T8 — Diverse scritture Supabase ignorano l'errore restituito, mascherando i fallimenti da successo (Minore)
File: `web/app/api/agent/chat/route.ts:150-155,205-210`; `web/app/api/agent/search/route.ts:446-451,455-457`; `web/app/api/agent/process-document/route.ts:128-131`
Problema: in tutti questi punti il risultato `{error}` dell'insert/update Supabase viene scartato. Il caso piu' concreto e' `process-document/route.ts:128-133`: se l'`update` che marca il documento come elaborato fallisce, la route risponde comunque `{ ok: true, ... }` al client mentre in DB il documento resta bloccato senza diagnostica.
Correzione richiesta: in ciascuno dei punti indicati, controllare `{error}` e almeno loggarlo con `console.error`; per `process-document/route.ts:128-131` in particolare, se l'update fallisce non restituire `{ ok: true }` ma un errore (stesso schema di `failDocument`).
Criterio di accettazione: se una di queste scritture fallisce, l'errore deve comparire nei log del server e, per `process-document`, la risposta al client non deve piu' affermare successo (`ok: true`) quando l'update e' fallito.

### T9 — Eliminazione veicolo: errori nelle query di raccolta file ignorati, oggetti storage orfani (Minore)
File: `web/components/DeleteVehicleButton.tsx:22-45`
Problema: le select su `documents` (22-25) e su `vehicle_sections`/`section_images` (32-39) distrutturano solo `data`, scartando `error`. Se una di queste query fallisce, le liste di path risultano vuote e i corrispondenti `storage.remove(...)` vengono saltati; il veicolo viene comunque eliminato e l'utente vede un successo, lasciando file orfani nello storage.
Correzione richiesta: controllare l'`error` di queste select; se presente, interrompere l'operazione con un messaggio d'errore (stesso pattern gia' usato per l'errore di `vehicles.delete()` a riga 49-53) invece di procedere come se non ci fossero file da rimuovere.
Criterio di accettazione: simulando un fallimento della select su `documents` o `vehicle_sections`, l'eliminazione del veicolo deve interrompersi con un messaggio d'errore visibile, non completarsi silenziosamente.

## Richiede intervento umano

- Finding di sicurezza: 2 (dettagli nel riepilogo della sessione) — non assegnabili, li gestisce il proprietario.
- Nessun altro elemento tocca `supabase/`, secret, variabili d'ambiente o richiede una scelta di design in questa scansione.
