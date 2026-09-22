Data (UTC): 2026-09-22

Origine: `cascade/TASKS.md` (8 task assegnabili T1-T8, piu' U1 escluso perche' richiede intervento
umano). Suddivisione in 3 gruppi per i lavoratori 4, 5, 6, con insiemi di file disgiunti cosi' che
le tre PR non possano mai andare in conflitto tra loro.

---

## Lavoratore 4 — T2, T5

File previsti:
- `web/app/api/agent/process-document/route.ts` (T2 e T5)
- `web/components/FileUploader.tsx` (T5)

Motivazione: T2 (non rielaborare un documento gia' elaborato) e T5 (non sovrascrivere il motivo
preciso del mancato trattamento) modificano lo stesso file `process-document/route.ts`, quindi
devono stare nello stesso gruppo per il criterio dei file disgiunti. Le due modifiche toccano
pero' regioni diverse e indipendenti del file: T2 agisce subito dopo la select della riga
`documents` (righe 59-67, aggiunta di un'uscita anticipata quando `processed` e' gia' vero), T5
agisce dentro `failDocument` (righe 218-229, aggiunta di un campo che segnala l'esito gia'
registrato) e nel client `FileUploader.tsx` (righe 86-105). Nessuna dipendenza funzionale tra i
due: si possono implementare in qualunque ordine all'interno della stessa PR; suggerito T2 prima
(piu' semplice, tocca solo la route) poi T5 (route + client).

Rischi/conflitti: basso rischio di conflitto interno perche' le righe toccate non si sovrappongono.
Da tenere d'occhio: se la trasformazione di T5 sul JSON d'errore di `failDocument` cambia la forma
della risposta usata anche dal ramo 401/400/429 (che non passa da `failDocument`), verificare che
quei rami restino invariati come richiesto dal criterio di accettazione di T5.

Carico: 2 task (1 Importante, 1 Minore-rafforzamento), 2 file. Gruppo piu' leggero per compensare
il fatto che i due task sono vincolati allo stesso file.

---

## Lavoratore 5 — T1, T3, T6

File previsti:
- `web/lib/motorsport.ts` (T1; legge `checkRateLimit` da `web/lib/rateLimit.ts` ma non lo modifica)
- `web/app/(dashboard)/veicoli/[id]/documenti/page.tsx` (T3)
- `web/components/ChatPanel.tsx` e `web/app/api/agent/chat/route.ts` (T6)

Motivazione: i tre task non condividono alcun file tra loro ne' con gli altri due gruppi. T1
(rafforzamento, priorita' massima secondo `cascade/TASKS.md`) e T3 sono modifiche isolate e
circoscritte (una funzione sola per T1, una query sola per T3). T6 e' imparentato a livello di
dominio con T3 (entrambi riguardano la cronologia chat: T3 la mostra, T6 ne evita la perdita
apparente) mentre tecnicamente ha piu' punti di contatto con T5 (stesso schema "segnalare
nella risposta d'errore se il salvataggio e' gia' avvenuto"): li ho tenuti separati perche' non
condividono file, ma vale la pena che i lavoratori 4 e 5 sappiano che implementano lo stesso
pattern in due file diversi, cosi' restano coerenti nella forma del campo aggiunto alla risposta
JSON.

Rischi/conflitti: nessun conflitto di file. Unico punto di attenzione: sia T1 sia T2 (lavoratore 4)
importano `checkRateLimit`/`checkSharedRateLimit` da `web/lib/rateLimit.ts` ma nessuno dei due lo
modifica, quindi non c'e' rischio reale di conflitto — lo segnalo solo per completezza.

Carico: 3 task (2 Importante, 1 Minore), 4 file. Carico medio.

---

## Lavoratore 6 — T4, T7, T8

File previsti:
- `web/components/VehicleDetailTabs.tsx`, `web/components/GlobalSearch.tsx`,
  `web/lib/searchPayload.ts` (T4; eventualmente anche `web/lib/types.ts` se li' viene centralizzato
  l'elenco delle categorie valide, come suggerito dal task)
- `web/components/SectionEditor.tsx` (T7 e T8)

Motivazione: T7 (non cancellare il file dello schema quando la riga e' stata comunque creata,
righe 107-121) e T8 (ripulire il nome della caratteristica in salvataggio, riga 59) modificano lo
stesso file `SectionEditor.tsx` e vanno quindi nello stesso gruppo; le righe toccate non si
sovrappongono, quindi possono essere implementati in qualunque ordine. T4 (rendere raggiungibili le
risorse di categoria "altro") non condivide file con T7/T8 ne' con gli altri gruppi, ed e' stato
aggiunto qui per bilanciare il numero di task tra i tre lavoratori: e' il task piu' esteso per
numero di file (3-4) ma le modifiche in ciascuno sono piccole (aggiungere una voce a un elenco,
centralizzare una validazione).

Rischi/conflitti: se T4 decide di centralizzare l'elenco delle categorie valide in
`web/lib/types.ts`, verificare che nessun altro gruppo tocchi quel file nel frattempo (dall'analisi
fatta, nessuno lo fa). Nessun altro rischio noto.

Carico: 3 task (1 Importante piu' esteso, 2 Minore piccoli), 4-5 file. Carico medio-alto ma
compensato dalla semplicita' di T7/T8.

---

## Task non assegnati

U1 (richiede migrazione Supabase e decisioni umane) resta escluso da tutti i gruppi, come richiesto
da `cascade/TASKS.md`.

## Punti da confermare all'agente 3

1. Il vincolo "stesso file = stesso gruppo" ha forzato T2+T5 nel lavoratore 4 e T7+T8 nel
   lavoratore 6: va bene tenerli insieme anche se all'interno del file le righe toccate non si
   sovrappongono, o preferite comunque un ordine di merge esplicito tra le tre PR per sicurezza?
2. Ho scelto di raggruppare T1/T3/T6 nel lavoratore 5 solo perche' sono gli unici task rimasti
   senza vincoli di file, non per affinita' tematica forte (T1 e' motorsport, T3/T6 sono chat).
   Se preferite un raggruppamento piu' tematico (es. T3+T6 insieme per la chat, T1 altrove) va
   comunque verificato che non si creino sovrapposizioni di file con gli altri due gruppi.
3. T4 puo' opzionalmente toccare `web/lib/types.ts` per centralizzare l'elenco delle categorie
   valide (nessun altro task tocca quel file, quindi nessun conflitto atteso, ma segnalo la
   possibilita' per completezza).
4. Non ho potuto eseguire `npm run lint` / `npx tsc --noEmit` in questo ambiente (dipendenze non
   installate), quindi la divisione si basa solo sulla lettura statica dei file elencati in
   `cascade/TASKS.md` e dei loro importatori diretti.
