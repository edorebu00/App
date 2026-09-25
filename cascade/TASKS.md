Data (UTC): 2026-09-25

PR aperte al momento dello scan: nessuna. PR aperte dei lavoratori (`claude/worker-`): 0.

## T1 — Toyota Urban Cruiser: ripristina la registrazione della prima generazione e l'anno 2025
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

## T2 — Hyundai Inster: togli le motorizzazioni doppie
Gravita': Importante
File: `web/lib/vehicleData.ts:1424-1427`; `web/lib/engineExtensions.ts:765-768`
Problema: il menu mostra 4 voci per 2 motori ("Elettrica Standard Range 97cv"/"Elettrica Long Range 115cv"
dal 2025 in ENGINE_DATA e "Elettrica 42 kWh 97cv"/"Elettrica 49 kWh 115cv" dal 2024 in ENGINE_EXTENSIONS).
Correzione richiesta: togliere la voce `Inster` da ENGINE_DATA (vehicleData.ts:1424-1427) e tenere solo
quella di engineExtensions.ts (kWh, dal 2024). `engine_code` e' testo libero salvato sul veicolo e non
esiste una pagina di modifica che lo confronti con il menu, quindi non serve alcuna migrazione dei dati.
Criterio di accettazione: `getEngineVariants("auto", "Hyundai", "Inster")` restituisce esattamente le 2 voci
in kWh con `yearFrom: 2024`; lint e typecheck passano.

## T3 — Dacia Bigster: togli le motorizzazioni doppie o errate
Gravita': Importante
File: `web/lib/engineExtensions.ts:791-794`; riferimento `web/lib/vehicleData.ts:1126-1130`
Problema: il menu unito mostra 5 voci, fra cui "1.2 Hybrid 155cv" (doppione errato di "1.8 Hybrid 155cv")
e "1.2 mild hybrid 140cv" (doppione di "1.2 TCe 140cv").
Correzione richiesta: togliere la voce `Bigster` dal blocco Dacia di `ENGINE_EXTENSIONS`
(engineExtensions.ts:791-794) e tenere le 3 voci di ENGINE_DATA. Non toccare le altre voci Dacia.
Criterio di accettazione: `getEngineVariants("auto", "Dacia", "Bigster")` restituisce esattamente
"1.2 TCe 140cv", "1.2 TCe 4x4 130cv" e "1.8 Hybrid 155cv"; lint e typecheck passano.

Nota di coordinamento: T2 e T3 modificano entrambi `web/lib/engineExtensions.ts` (blocchi diversi,
Hyundai e Dacia, uno accanto all'altro): meglio assegnarli allo stesso lavoratore o eseguirli in sequenza.

## Richiede intervento umano (non assegnare)

- U1 — Rendi il limite d'uso delle route agent indipendente da righe che l'account puo' rimuovere: serve una
  struttura dedicata con sola aggiunta (migrazione in `supabase/`).
- U2 — Rendi comuni a tutte le istanze la pausa dopo un tentativo non riuscito e la generazione condivisa del
  riquadro motorsport: serve una struttura condivisa (scelta di design, eventuale migrazione).

## Gia' in PR

Nessuna.
