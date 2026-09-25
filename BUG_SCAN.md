# Scansione notturna dei bug — MyVehicle

Data scan: 2026-09-25 01:25 UTC
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json`, file generati con l'intestazione "GENERATO DA")
PR aperte al momento dello scan: nessuna (di nessun autore).

Ogni problema qui sotto e' stato verificato leggendo personalmente il codice indicato (file + righe).
I rilievi I1, I2 e M1 della scansione precedente risultano corretti dalle PR #50, #51 e #52 e non sono
ripetuti. I nuovi rilievi riguardano i dati di catalogo aggiunti dalle PR #49 e #53.

Rilievi esaminati e scartati: nella chat, il caso "risposta 2xx con lettura del corpo fallita" dopo che la
route ha gia' salvato i messaggi (caso raro; la correzione di ieri e' voluta e ripristinarla riporterebbe
la perdita del testo); `maxRetries: 0` nel riquadro motorsport che non ritenta neanche gli errori
transitori rapidi (compromesso deciso ieri, gia' attenuato dalla pausa di 2 minuti); scadenza unica
calcolata dall'inizio della richiesta nelle route agent e lettura unica di `hasOpenAIFallback()` nella
ricerca (refactoring: con i valori attuali i casi peggiori restano sotto `maxDuration`); "Epiq" presente
sia in `CATALOGUE_EXTENSIONS` sia in `CATALOGUE_SWEEP` (il doppione viene gia' rimosso da `getModels`,
nessun effetto visibile).

## Bloccante

Nessun problema bloccante trovato in questa scansione.

## Importante

### I1 — Toyota Urban Cruiser: non si possono piu' registrare le auto della prima generazione
File: `web/lib/vehicleData.ts:2299-2303`; `web/app/(dashboard)/veicoli/nuovo/page.tsx:53-67, 280-291`

Prima la PR #53 il modello non aveva motorizzazioni in catalogo e il campo motore era un testo libero
facoltativo. Adesso `getEngineVariants` restituisce le sole tre versioni elettriche, quindi il campo
diventa un menu obbligatorio (`required`), senza la voce "altro". Chi ha un Urban Cruiser 2009-2014
(1.33 benzina o 1.4 diesel) e' costretto a scegliere una versione elettrica, e una volta scelta gli
anni proposti partono dal 2026. In piu' le versioni elettriche hanno `yearFrom: 2026`, ma sono
consegnate in Europa dal 2025: anche un'auto del 2025 non puo' indicare il suo anno.

Proposta: aggiungere le motorizzazioni della prima generazione (2009-2014) e portare `yearFrom` delle
versioni elettriche a 2025.

### I2 — Hyundai Inster: il menu del motore mostra ogni versione due volte, con anni diversi
File: `web/lib/vehicleData.ts:1424-1427`; `web/lib/engineExtensions.ts:765-768`; unione in `web/lib/vehicleData.ts:2811-2825`

La PR #49 aggiunge in `ENGINE_DATA` "Elettrica Standard Range 97cv" / "Elettrica Long Range 115cv"
(dal 2025), ma `ENGINE_EXTENSIONS` ha gia' "Elettrica 42 kWh 97cv" / "Elettrica 49 kWh 115cv" (dal 2024).
`getEngineVariants` toglie solo le etichette identiche, quindi il menu mostra 4 voci per 2 motori, con
anni d'inizio in contrasto.

Proposta: tenere una sola coppia di voci (quelle in kWh, dal 2024) e togliere l'altra.

### I3 — Dacia Bigster: motorizzazioni doppie e in contrasto nel menu
File: `web/lib/vehicleData.ts:1126-1130`; `web/lib/engineExtensions.ts:791-794`

Il menu unito mostra 5 voci, fra cui "1.8 Hybrid 155cv" e "1.2 Hybrid 155cv" (lo stesso ibrido con due
cilindrate diverse) e "1.2 TCe 140cv" e "1.2 mild hybrid 140cv" (lo stesso motore). L'etichetta scelta
viene salvata in `engine_code` e usata nella ricerca AI, quindi un dato sbagliato peggiora anche i risultati.

Proposta: togliere da `ENGINE_EXTENSIONS` le due voci Bigster doppie o errate (l'ibrido 155cv e' un 1.8).

## Minore

Nessun nuovo problema minore verificato.

## Richiede intervento umano

### U1 — Il limite d'uso condiviso fra le istanze si appoggia a righe che l'account puo' rimuovere (invariato)
File: `web/lib/rateLimit.ts:74-86`, usato in `web/app/api/agent/chat/route.ts` e `web/app/api/agent/search/route.ts`;
policy in `supabase/migrations/0001_init.sql:175-182`

Serve una struttura dedicata, con sola aggiunta, incrementata prima della chiamata al modello:
richiede una migrazione in `supabase/`.

### U2 — Pausa condivisa fra le istanze per il riquadro motorsport (invariato)
File: `web/lib/motorsport.ts` (pausa dopo un tentativo non riuscito e promessa condivisa)

Restano in memoria di istanza. Renderle comuni a tutte le istanze richiede una struttura condivisa
(tabella in `supabase/` o archivio chiave-valore) e quindi una scelta di design.

## Gia' in PR

Nessuna: al momento dello scan non ci sono pull request aperte.
