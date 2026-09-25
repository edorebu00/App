Data (UTC): 2026-09-25

## Accordo con l'agente 2

Verifica indipendente fatta aprendo `web/lib/vehicleData.ts` (righe 1126-1130, 1424-1427, 2299-2303,
funzione `getEngineVariants` a 2811-2825) e `web/lib/engineExtensions.ts` (righe 765-768, 791-794).

- (a) Assegnazione unica: T1, T2 e T3 sono assegnati una sola volta ciascuno. U1 e U2 non sono assegnati.
- (b) File disgiunti: confermata la lettura dell'agente 2. T1 e T2 scrivono in `web/lib/vehicleData.ts`
  (T2 rimuove la voce `Inster` da ENGINE_DATA; la voce `Inster` di `engineExtensions.ts` resta invariata).
  T3 scrive solo in `web/lib/engineExtensions.ts` (rimozione della voce `Bigster` Dacia); le righe
  1126-1130 di `vehicleData.ts` sono solo un riferimento. La nota di coordinamento di TASKS.md (T2+T3 su
  `engineExtensions.ts`) non corrisponde alle correzioni richieste. Gruppi: {T1, T2} su `vehicleData.ts`,
  {T3} su `engineExtensions.ts`: disgiunti.
- (c) Carico: 2 task piccoli al lavoratore 4, 1 al lavoratore 5, nessuno al lavoratore 6. Non e' possibile
  bilanciare meglio senza violare (b); tutti i task sono modifiche di poche righe, quindi va bene.
- (d) Precisione: i tre task indicano esattamente etichette, anni e blocchi da cambiare. Nessuna aggiunta.
- (e) Nessun task tocca `supabase/`, secret, `.env*`, `package-lock.json`, workflow o file "GENERATO DA"
  (verificato: nessuno dei due file ha quell'intestazione). Nessuna migrazione, secret o scelta di design.
  Nessun task di rafforzamento della sicurezza in questa tornata.
- (f) PR aperte al momento della verifica: nessuna. Nessun task rimosso.

Risposte ai punti da confermare:
1. Lettura dei file confermata: T1+T2 condividono `vehicleData.ts`, T3 e' da solo su `engineExtensions.ts`.
2. Schema alternativo (T2+T3 insieme) scartato: metterebbe T1 e T2 su due lavoratori diversi con lo
   stesso file, violando (b).
3. Lavoratore 6 senza task: accettato.

Cambiamenti rispetto alla proposta: nessuno nella divisione. Aggiunti testo completo dei task, file
ammessi, ordine e criteri di accettazione vincolanti.

## Lavoratore 4

Branch: `claude/worker-4-2026-09-25`

File ammessi (gli unici modificabili): `web/lib/vehicleData.ts`

Ordine di esecuzione: T1, poi T2.

### T1 — Toyota Urban Cruiser: ripristina la registrazione della prima generazione e l'anno 2025
Gravita': Importante
File: `web/lib/vehicleData.ts:2299-2303` (ENGINE_DATA.auto.Toyota["Urban Cruiser"])
Problema: le sole versioni elettriche (dal 2026) rendono il campo motore un menu obbligatorio. Chi ha un
Urban Cruiser 2009-2014 non trova il suo motore e, scelta una versione elettrica, gli anni partono dal 2026.
Anche le auto elettriche del 2025 non possono indicare il loro anno.
Correzione richiesta: aggiungere all'elenco `{ label: "1.33 Dual VVT-i 101cv", yearFrom: 2009, yearTo: 2014 }`
e `{ label: "1.4 D-4D 90cv", yearFrom: 2009, yearTo: 2014 }`, e portare `yearFrom` delle tre voci
"Elettrica ..." da 2026 a 2025. Non toccare altri modelli.
Criterio di accettazione: `getEngineVariants("auto", "Toyota", "Urban Cruiser")` restituisce 5 voci; le due
termiche hanno anni 2009-2014 e le tre elettriche `yearFrom: 2025`; `npm run lint` e `npx tsc --noEmit`
(in `web/`) passano.

### T2 — Hyundai Inster: togli le motorizzazioni doppie
Gravita': Importante
File: `web/lib/vehicleData.ts:1424-1427`; `web/lib/engineExtensions.ts:765-768`
Problema: il menu mostra 4 voci per 2 motori ("Elettrica Standard Range 97cv"/"Elettrica Long Range 115cv"
dal 2025 in ENGINE_DATA e "Elettrica 42 kWh 97cv"/"Elettrica 49 kWh 115cv" dal 2024 in ENGINE_EXTENSIONS).
Correzione richiesta: togliere la voce `Inster` da ENGINE_DATA (vehicleData.ts:1424-1427) e tenere solo
quella di engineExtensions.ts (kWh, dal 2024). `engine_code` e' testo libero salvato sul veicolo e non
esiste una pagina di modifica che lo confronti con il menu, quindi non serve alcuna migrazione dei dati.
Criterio di accettazione: `getEngineVariants("auto", "Hyundai", "Inster")` restituisce esattamente le 2 voci
in kWh con `yearFrom: 2024`; lint e typecheck passano.

Nota: `web/lib/engineExtensions.ts` NON va modificato da questo lavoratore (e' del lavoratore 5).
Non alterare le righe adiacenti ("Ioniq 6" sopra, "i40" sotto) e non toccare `Inster` nell'elenco dei
modelli (riga 169).

Criteri di accettazione complessivi: il diff tocca solo `web/lib/vehicleData.ts`, nei soli blocchi
"Urban Cruiser" (Toyota) e `Inster` (Hyundai, ENGINE_DATA); valgono i criteri di T1 e T2; in `web/`
passano `npm run lint` e `npx tsc --noEmit`.

## Lavoratore 5

Branch: `claude/worker-5-2026-09-25`

File ammessi (gli unici modificabili): `web/lib/engineExtensions.ts`

Ordine di esecuzione: T3.

### T3 — Dacia Bigster: togli le motorizzazioni doppie o errate
Gravita': Importante
File: `web/lib/engineExtensions.ts:791-794`; riferimento `web/lib/vehicleData.ts:1126-1130`
Problema: il menu unito mostra 5 voci, fra cui "1.2 Hybrid 155cv" (doppione errato di "1.8 Hybrid 155cv")
e "1.2 mild hybrid 140cv" (doppione di "1.2 TCe 140cv").
Correzione richiesta: togliere la voce `Bigster` dal blocco Dacia di `ENGINE_EXTENSIONS`
(engineExtensions.ts:791-794) e tenere le 3 voci di ENGINE_DATA. Non toccare le altre voci Dacia.
Criterio di accettazione: `getEngineVariants("auto", "Dacia", "Bigster")` restituisce esattamente
"1.2 TCe 140cv", "1.2 TCe 4x4 130cv" e "1.8 Hybrid 155cv"; lint e typecheck passano.

Nota: `web/lib/vehicleData.ts` e' solo riferimento e NON va modificato. Lasciare invariato il blocco
Hyundai `Inster` (engineExtensions.ts:765-768) e le altre voci Dacia ("Solenza" sopra).

Criteri di accettazione complessivi: il diff tocca solo `web/lib/engineExtensions.ts`, nel solo blocco
Dacia `Bigster`; vale il criterio di T3; in `web/` passano `npm run lint` e `npx tsc --noEmit`.

## Lavoratore 6

Nessun task assegnato.

## Richiede intervento umano (non assegnare)

- U1 — Limite d'uso delle route agent: serve una struttura dedicata (migrazione in `supabase/`).
- U2 — Stato condiviso fra le istanze per il riquadro motorsport: serve una scelta di design.
