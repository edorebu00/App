Data (UTC): 2026-09-21

Origine: `cascade/TASKS.md` (agente 1, stesso giorno). Nessun task e' stato scartato: T1-T9 sono tutti assegnabili (nessuno ricade sotto "Richiede intervento umano").

Metodo: per ogni task ho riletto i file indicati nel task e i loro importi/dipendenze condivise (es. `sanitizePayload`, chiavi di traduzione) per capire l'insieme *reale* di file che la correzione tocchera', non solo quelli citati come "file e righe" nel task (che a volte includono anche file di solo effetto/lettura, non modificati).

---

## Lavoratore 4 — T1, T2, T5

**Task:** T1 (limite di frequenza condiviso), T2 (verifica dimensione documento prima del download), T5 (documento non piu' bloccato su "in elaborazione").

**File previsti:**
- `web/lib/rateLimit.ts`
- `web/app/api/agent/search/route.ts`
- `web/app/api/agent/chat/route.ts`
- `web/app/api/agent/process-document/route.ts`
- `web/components/FileUploader.tsx`

**Motivazione:** i tre task coprono l'intera catena "upload -> elaborazione IA" e sono naturalmente affini. Ho verificato che T1 esclude esplicitamente `process-document` (lo dice il testo del task), quindi non c'e' sovrapposizione con T2 sullo stesso file. Ho letto `web/components/FileUploader.tsx`: la correzione di T5 e' interamente lato client (attende la risposta della fetch e aggiorna `documents.processing_error` con il client Supabase, permesso dalle policy esistenti sulla riga dell'utente) e NON richiede modifiche a `process-document/route.ts` ne' a `DocumentList.tsx` (quest'ultimo legge gia' `processing_error` e lo mostra, l'ho verificato leggendo il componente). Ordine consigliato: T1, poi T2, poi T5 (nessuna dipendenza reale, solo lo stesso ordine di gravita' di TASKS.md).

**Rischi/possibili conflitti:** nessuno tra questi tre task. Rischio esterno: nessuno di questi file e' toccato da altri gruppi.

---

## Lavoratore 5 — T3, T6, T8

**Task:** T3 (ricontrolla la forma della ricerca salvata nella pagina veicolo), T6 (segnala il download bloccato dal browser), T8 (elimina le motorizzazioni duplicate).

**File previsti:**
- `web/app/(dashboard)/veicoli/[id]/page.tsx`
- `web/components/DocumentList.tsx`
- `web/lib/engineExtensions.ts`

**Motivazione:** ho letto `web/app/(dashboard)/veicoli/[id]/page.tsx`: `initialResults`/`initialSpecs` sono calcolati interamente li', e `sanitizePayload` (in `web/lib/searchPayload.ts`) va solo *riusata*, non modificata — quindi non serve toccare ne' `VehicleDetailTabs.tsx` ne' `searchPayload.ts`. Ho letto `DocumentList.tsx`: T6 tocca solo `handleDownload`, file gia' isolato. Ho letto la sezione di `engineExtensions.ts` indicata da T8: la correzione e' una rimozione di voci, non tocca `vehicleData.ts` (citato dal task solo come riferimento delle voci da conservare) ne' `getEngineVariants`. Tre task indipendenti tra loro e di difficolta' comparabile (T3 e T8 richiedono lettura attenta di dati/formati, T6 e' piu' piccolo). Ordine consigliato: T3, poi T6, poi T8.

**Rischi/possibili conflitti:** nessuno tra questi tre task. Vedi pero' il punto aperto sotto su `web/messages/*.json` per T6.

---

## Lavoratore 6 — T4, T7, T9

**Task:** T4 (mostra l'errore quando il salvataggio di una scheda non riesce), T7 (non ignorare gli errori di pulizia in eliminazione/creazione veicolo), T9 (non conservare 24 ore il riquadro motorsport vuoto per errore).

**File previsti:**
- `web/components/SectionEditor.tsx`
- `web/components/DeleteVehicleButton.tsx`
- `web/app/(dashboard)/veicoli/nuovo/page.tsx`
- `web/lib/motorsport.ts`
- `web/messages/it.json`, `web/messages/en.json`, `web/messages/de.json` (solo se servono chiavi nuove, vedi sotto)

**Motivazione:** T4 e T7 sono gli unici due task, tra tutti quelli assegnati, per cui la correzione descritta puo' plausibilmente richiedere una chiave di traduzione nuova (ho verificato leggendo `web/messages/it.json`: lo stato di errore di `handleSave` in `SectionEditor.tsx` non ha oggi una chiave dedicata nel namespace `sectionEditor`, mentre l'errore dell'immagine puo' riusare `imageUploadError` gia' presente; per `veicoli/nuovo/page.tsx` il messaggio da differenziare in caso di fallimento della cancellazione compensativa non ha oggi una chiave propria nel namespace `vehicleNew`, mentre `DeleteVehicleButton.tsx` puo' riusare `vehicleDetail.deleteError` gia' esistente senza modifiche). Ho messo apposta T4 e T7 nello stesso gruppo cosi', se entrambi finiscono per aggiungere righe a `web/messages/{it,en,de}.json`, lo fanno nella stessa PR e non in due PR separate che modificherebbero lo stesso file. T9 e' indipendente (solo `web/lib/motorsport.ts`) e di gravita' minore, va per ultimo.

**Rischi/possibili conflitti:** se sia T4 sia T7 aggiungono chiavi nuove, le modifiche ai tre file di `web/messages/` vanno fatte in commit separati o comunque senza sovrascriversi a vicenda (sono namespace diversi — `sectionEditor` per T4, `vehicleNew` per T7 — quindi il rischio e' basso, ma essendo lo stesso file va gestito con attenzione dal lavoratore).

---

## Punti da confermare all'agente 3

1. **`web/messages/{it,en,de}.json` come file potenzialmente condiviso.** Ho spostato T4 e T7 nello stesso gruppo perche' sono gli unici due task che, leggendo il codice, mi sembrano poter richiedere chiavi di traduzione nuove (rispettivamente nei namespace `sectionEditor` e `vehicleNew`). T6 dice esplicitamente di riusare `documentList.downloadError` "se il testo resta adeguato" — l'ho giudicato sufficiente e quindi non ho previsto una modifica ai file di traduzione per T6, ma se il lavoratore 5 decidesse comunque di introdurre una chiave nuova per T6, andrebbe verificato che non confligga con le righe toccate dal lavoratore 6 per T4/T7 (namespace diversi, quindi il rischio pratico è basso anche in quel caso, ma segnalo la possibilita').
2. **T5 non tocca `process-document/route.ts`.** Ho concluso che la correzione di T5 e' interamente lato client (`FileUploader.tsx`), sfruttando le policy Supabase gia' esistenti sulla riga del documento dell'utente. Se l'agente 3 (o il lavoratore 4) rilegge il task e conclude che serve invece un intervento anche lato server in `process-document/route.ts` per i tre percorsi d'uscita citati nella descrizione del problema (401/429/400), quel file resterebbe comunque nello stesso gruppo del lavoratore 4 (che gia' possiede T2 sullo stesso file), quindi non cambierebbe la divisione — lo segnalo solo perche' e' una lettura del task, non un fatto meccanico.
3. **T8 non tocca `web/lib/vehicleData.ts`.** Il task lo cita solo come elenco delle voci "da conservare" per verifica incrociata, la correzione richiesta rimuove solo voci da `engineExtensions.ts`. Se in fase di implementazione risultasse necessario toccare anche `vehicleData.ts`, andrebbe verificato che nessun altro gruppo lo tocchi (al momento nessuno lo fa, quindi anche in quel caso non ci sarebbe conflitto).
