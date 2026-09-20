# Scansione notturna dei bug — MyVehicle

Data scan: 2026-09-20 16:19 UTC
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json`, file generati)
PR aperte dei lavoratori al momento dello scan: nessuna.

Ogni problema qui sotto e' stato verificato leggendo personalmente il codice indicato (file + righe), non solo ipotizzato da un tool automatico.

## Bloccante

### B1 — `SectionEditor` puo' sovrascrivere la scheda sbagliata con dati non salvati (perdita dati)
File: `web/components/SectionEditor.tsx:30-39,53-62`, renderizzato senza `key` in `web/components/VehicleDetailTabs.tsx:262-274`

`SectionEditor` inizializza `fields`/`notes`/`images` con `useState(...)` a partire dalle props (`section.data`, `section.notes`, ecc.), ma viene montato senza una `key` legata a `section.id`. Cambiando tab (stessa pagina, `activeId` cambia ma il componente resta la stessa istanza React), lo stato interno NON si aggiorna con i dati della nuova sezione: restano quelli della sezione precedente. Se l'utente modifica un campo su "Motore" senza salvare, passa a "Carrozzeria" (che mostra ancora i dati di "Motore" per via dello stato non aggiornato) e preme "Salva", `handleSave` (righe 59-62) scrive `data`/`notes` (ancora quelli di Motore, stantii) sulla riga `vehicle_sections` di Carrozzeria (`section.id` e' invece corretto/aggiornato). Risultato: i dati di Carrozzeria vengono sovrascritti con quelli di Motore, e le modifiche originali a Motore sono perse — nessun errore, nessun avviso.

Proposta: aggiungere `key={activeSection.id}` al `<SectionEditor>` in `VehicleDetailTabs.tsx:263`, cosi' React rimonta il componente a ogni cambio sezione.

## Importante

### I1 — Cambiando veicolo dalla sidebar, la scheda veicolo mostra dati mescolati del veicolo precedente
File: `web/components/VehicleDetailTabs.tsx:50-58`, renderizzato senza `key` in `web/app/(dashboard)/veicoli/[id]/page.tsx:86-97`

`VehicleDetailTabs` inizializza `activeId`/`results`/`specs`/`bollo`/`hasSearchedOnce` da props via `useState`, ma la pagina lo monta senza `key={v.id}`. Navigando da un veicolo A a un veicolo B tramite i link della Sidebar (stessa struttura JSX, stesso layout persistente), React riusa la stessa istanza del componente: `sections` (prop) si aggiorna a quelle di B, ma `activeId` resta l'id di una sezione di A (quindi nessuna `SectionEditor` corrisponde e non viene mostrata), mentre `results`/`specs`/`bollo`/`hasSearchedOnce` restano quelli di A e vengono usati per costruire i link "Autodoc"/"piano di manutenzione" mostrati come se appartenessero a B. Un refresh completo della pagina risolve il problema (esiste un aggiramento), da cui la classificazione Importante e non Bloccante.

Proposta: aggiungere `key={v.id}` al `<VehicleDetailTabs>` in `veicoli/[id]/page.tsx:86`.

### I2 — Creazione veicolo: se falliscono le sezioni di default, l'utente vede comunque "successo"
File: `web/app/(dashboard)/veicoli/nuovo/page.tsx:135-150`

Dopo l'insert del veicolo, l'insert delle `vehicle_sections` di default puo' fallire (errore di rete/Postgres transitorio); l'errore viene solo loggato in console (`console.error(sectionsError)`, riga 145) e il flusso prosegue comunque a `setJustAdded(...)` (riga 150), che mostra l'overlay di conferma e reindirizza come se tutto fosse andato a buon fine. Il veicolo resta permanentemente senza `vehicle_sections`: aprendo poi la scheda veicolo, `VehicleDetailTabs` riceve `sections` vuoto e non mostra alcuna `SectionEditor`, senza alcuna indicazione che qualcosa e' andato storto.

Proposta: se `sectionsError` e' presente, mostrare un errore all'utente (o tentare un retry) invece di procedere silenziosamente al successo.

### I3 — La chat esclude silenziosamente un documento grande e dichiara "nessun documento caricato"
File: `web/app/api/agent/chat/route.ts:15,129-134` (confrontare con `web/app/api/agent/process-document/route.ts:13,119`)

Il budget di contesto per la chat e' `MAX_CONTEXT_CHARS = 250_000`, ma un singolo documento puo' arrivare fino a `MAX_EXTRACTED_CHARS = 400_000` (tetto di `process-document`). Il controllo nel ciclo (riga 132: `if (context.length + chunk.length > MAX_CONTEXT_CHARS) break;`) avviene PRIMA di appendere: se il primo documento da solo supera 250.000 caratteri, il ciclo si interrompe alla prima iterazione e `context` resta `""`. In `web/lib/chatPrompt.ts:20-29`, un `context` vuoto fa scrivere nel prompt di sistema "l'utente non ha ancora caricato documenti" anche se un manuale voluminoso e' stato caricato ed elaborato con successo: l'assistente risponde ignorando il documento, senza errore ne' avviso.

Proposta: troncare il singolo documento al budget residuo invece di scartarlo interamente quando supera lo spazio disponibile.

### I4 — La chat "senza veicolo" mescola documenti e cronologia di TUTTI i veicoli dell'utente
File: `web/app/api/agent/chat/route.ts:114-127,140-148` (confrontare con `web/app/api/agent/search/route.ts:287`)

Quando `vehicleId` e' `null` (assente o non valido nel corpo della richiesta), le query su `documents` (righe 114-120), sul conteggio di `chat_messages` (122-123) e sulla cronologia (140-146) applicano il filtro `.eq("vehicle_id", vehicleId)` SOLO se `vehicleId` e' presente (`if (vehicleId) ... `), senza alcun `else`. Risultato: quando manca il vehicleId, le query restituiscono le righe di TUTTI i veicoli dell'utente insieme, non quelle dei soli documenti "senza veicolo". La route search gestisce correttamente questo caso con `.is("vehicle_id", null)` (search/route.ts:287); la chat no. Non sfruttabile per vedere dati di altri utenti (solo propri), ma un bug di isolamento dati concreto, raggiungibile chiamando direttamente l'API autenticata (l'interfaccia attuale richiede sempre un `vehicleId`, quindi oggi non raggiungibile dalla UI spedita).

Proposta: replicare in chat/route.ts lo stesso pattern usato in search/route.ts (`.is("vehicle_id", null)` quando `vehicleId` e' assente).

### I5 — Una riga `search_results` corrotta manda in crash la route di ricerca fuori dalla gestione errori
File: `web/app/api/agent/search/route.ts:269-307,343` (chiamata fuori dal `try` che inizia a riga 385) e `web/lib/searchPayload.ts:17-20`

`findReusableSearch` valida che `results` sia un oggetto non-array (`search/route.ts:294`) ma non valida che `results.risorse` sia specificamente un array. `sanitizePayload` (searchPayload.ts:20) itera con `for (const risorsa of payload.risorse || [])`: se `risorse` e' un valore troncato/oggetto non-array e non falsy, il `for...of` lancia `TypeError: ... is not iterable`. La chiamata a `findReusableSearch` (riga 343) avviene PRIMA del blocco `try` della route (che inizia a riga 385), quindi l'eccezione non viene catturata: la route risponde con l'errore generico 500 di Next.js invece del formato JSON abituale (`{error: ...}`), e questo avviene anche prima del controllo di rate limit (riga 357). Il commento del codice stesso (righe 301-304) conferma che `search_results` e' scrivibile direttamente dal browser autenticato (la RLS verifica solo la proprieta' della riga, non il contenuto), quindi il contenuto non e' garantito valido.

Proposta: validare anche che `results.risorse` sia un array (o avvolgere la chiamata a `findReusableSearch`/`sanitizePayload` in un try/catch che ricade su "rifai la ricerca" invece di propagare l'eccezione).

### I6 — Errori di download documento ignorati senza alcun feedback all'utente
File: `web/components/DocumentList.tsx:11-19`

`handleDownload` non gestisce l'errore restituito da `createSignedUrl`: se fallisce (sessione scaduta, oggetto storage cancellato, problema RLS/rete), il click su "Scarica" non fa assolutamente nulla — nessun messaggio, nessun indicatore di caricamento. L'utente non ha modo di capire se il click e' stato registrato.

Proposta: mostrare un messaggio di errore (analogo a quello gia' usato in altri componenti del progetto) quando `error` e' presente o `data?.signedUrl` manca.

## Minore

### M1 — Diverse scritture Supabase ignorano l'errore restituito, mascherando i fallimenti da successo
File: `web/app/api/agent/chat/route.ts:150-155,205-210`; `web/app/api/agent/search/route.ts:446-451,455-457`; `web/app/api/agent/process-document/route.ts:128-131`

In tutti questi punti il risultato `{error}` dell'update/insert Supabase viene scartato. Il caso piu' concreto e' `process-document/route.ts:128-133`: se l'`update` che marca il documento come `processed: true` fallisce, la route risponde comunque `{ ok: true, ... }` al client, mentre in DB il documento resta `processed: false` senza alcun `processing_error` diagnostico — bloccato silenziosamente.

Proposta: controllare `{error}` su questi insert/update e, quantomeno, loggarlo/propagarlo come nelle altre route.

### M2 — Eliminazione veicolo: errori nelle query di raccolta file ignorati, oggetti storage orfani
File: `web/components/DeleteVehicleButton.tsx:22-45`

Le select su `documents` (righe 22-25) e `vehicle_sections`/`section_images` (32-39) distrutturano solo `data`, scartando `error`. Se una di queste query fallisce (rete/RLS transitorio), `filePaths`/`imagePaths` risultano vuoti e i corrispondenti `supabase.storage.remove(...)` vengono saltati; il veicolo viene comunque eliminato (riga 47) e l'utente vede un successo, ma i file nello storage restano orfani senza piu' alcuna riga che li referenzi.

Proposta: controllare l'`error` di queste select e, se presente, annullare l'operazione o avvisare l'utente invece di procedere come se non ci fossero file.

### M3 — Sessione scaduta su una POST verso `/api/agent/*`: l'utente vede un errore generico invece del prompt di login
File: `web/middleware.ts:40-48,63-65`, `web/components/ChatPanel.tsx:37-64` (stesso pattern in `VehicleDetailTabs.tsx`/ricerca)

Il matcher del middleware non esclude `/api/`. Se il cookie di sessione e' scaduto, una POST a `/api/agent/chat` (o `/search`) riceve un redirect 302 verso `/login` dal middleware (non un 401 JSON). `fetch()` segue i redirect di default, quindi il client riceve la pagina HTML di login con `res.ok === true`; il successivo `await res.json()` lancia un'eccezione, catturata dal blocco `catch` generico che mostra il messaggio "contatta il supporto" invece di indicare che serve rifare il login.

Proposta: nel middleware, per i percorsi sotto `/api/`, restituire un 401 JSON invece del redirect quando l'utente non e' autenticato.

### M4 — Osservazioni minori non promosse a task (impatto trascurabile)
- `web/app/(dashboard)/dashboard/page.tsx:10-13` e `web/app/(dashboard)/layout.tsx:8-11` eseguono ciascuno una `select("*") from vehicles` separata per la stessa richiesta (sidebar + griglia): solo duplicazione di round-trip, non un bug di correttezza.
- `web/app/(dashboard)/veicoli/nuovo/page.tsx`: `loading` non viene reimpostato a `false` sul percorso di successo (righe 111-113/129-133 lo fanno solo sugli errori); innocuo perche' il form viene subito coperto da `VehicleAddedOverlay`.
- `web/app/api/agent/search/route.ts`: il controllo di riuso (riga 343) e il rate limit (riga 357) sono due passaggi non atomici; due richieste identiche concorrenti possono entrambe superare il controllo di riuso e innescare due ricerche pagate invece di una — race a basso impatto, non sfruttabile per un vantaggio asimmetrico.

## Sicurezza

Finding di sicurezza: 2 (dettagli nel riepilogo della sessione)
