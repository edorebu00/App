# Scansione notturna dei bug — MyVehicle

Data scan: 2026-09-26 01:21 UTC
Ambito: `web/` (esclusi `node_modules/`, `.next/`, `package-lock.json`, file generati con l'intestazione "GENERATO DA")
PR aperte al momento dello scan: nessuna (di nessun autore).

Ogni problema qui sotto e' stato verificato leggendo personalmente il codice indicato (file + righe).
I rilievi I1, I2 e I3 della scansione precedente risultano corretti dalle PR #54 e #55 e non sono ripetuti.

Rilievi esaminati e scartati (gia' valutati nelle scansioni precedenti, invariati): rimozione della bolla
in chat quando una risposta 2xx non si legge; scadenza delle route agent calcolata dall'inizio della
chiamata al modello invece che della richiesta, e condizione `hasOpenAIFallback()` duplicata fra chat e
ricerca (refactoring; con i valori attuali restano sotto `maxDuration`); "Epiq" in doppio fra
`CATALOGUE_EXTENSIONS` e `CATALOGUE_SWEEP` (nessun effetto visibile). Il rilievo sul caricamento dei
documenti a sessione scaduta e' stato ridimensionato: l'upload su Storage e l'inserimento della riga
avvengono subito prima con la stessa sessione, quindi il caso e' solo teorico; resta il difetto generale
descritto in M2.

## Bloccante

Nessun problema bloccante trovato in questa scansione.

## Importante

### I1 — Catalogo: alcuni proprietari non possono registrare il proprio motore o anno
File: `web/lib/vehicleData.ts:576-580` (MG4), `web/lib/vehicleData.ts:1127-1131` (Dacia Bigster),
`web/lib/vehicleData.ts:2306` (Toyota GR Corolla); menu in `web/app/(dashboard)/veicoli/nuovo/page.tsx:58-67, 280-291`

Quando un modello ha motorizzazioni in catalogo il campo motore e' un menu obbligatorio senza voce
"altro", e gli anni proposti seguono `yearFrom`/`yearTo` della voce scelta. Mancano quindi:
- MG4: la versione 64 kWh 204cv (Long Range), la piu' diffusa; oggi il proprietario deve scegliere 170cv o 245cv.
- Dacia Bigster: la versione a GPL ECO-G 140cv, molto comune in Italia; oggi finisce salvata come benzina.
- Toyota GR Corolla (voce aggiunta dalla PR #56): `yearFrom: 2023`, ma la vettura e' immatricolata dal 2022;
  prima della PR il campo era libero, ora un'auto del 2022 non puo' indicare il suo anno.
L'etichetta scelta finisce in `engine_code` ed e' usata dalla ricerca IA, quindi il dato sbagliato peggiora anche i risultati.

Proposta: aggiungere le due versioni mancanti e portare `yearFrom` della GR Corolla a 2022.

### I2 — Peugeot 508: la prima generazione (2010-2018) non si puo' registrare
File: `web/lib/vehicleData.ts:2008-2012`

La chiave "508" copre entrambe le generazioni, ma le motorizzazioni in catalogo partono dal 2018. Il
proprietario di una 508 del 2014 (es. 2.0 HDi) deve scegliere un motore del 2018 o successivo, e il menu
degli anni parte allora dal 2018. Difetto preesistente, reso piu' visibile dalla PR #56 che ha aggiunto la PSE.

Proposta: aggiungere le motorizzazioni principali della prima generazione con `yearTo: 2018`.

## Minore

### M1 — Riquadro motorsport: un esito senza notizie compilate resta in cache per 24 ore
File: `web/lib/motorsport.ts:96-101, 123-166, 190-195`

`extractBriefing` restituisce l'elenco vuoto anche quando la risposta del modello non contiene affatto la
chiamata a `submit_briefing` (per esempio se si ferma per il tetto di token o con `pause_turn`).
`fetchBriefing` non lancia errore, quindi `unstable_cache` conserva il riquadro vuoto per `CACHE_SECONDS`
(24 ore) e la pausa con nuovo tentativo, pensata proprio per questo caso (commento alle righe 172-177), non scatta.

Proposta: distinguere "chiamata assente" da "elenco vuoto" e lanciare un errore nel primo caso.

### M2 — Le richieste alle API senza sessione valida ricevono la pagina di login invece di un 401
File: `web/middleware.ts:44-48`; chiamanti `web/components/GlobalSearch.tsx:36-54`, `web/components/VehicleDetailTabs.tsx:72-80`

Il middleware reindirizza a `/login` anche i percorsi `/api/*`. Le route agent hanno gia' il proprio
controllo con risposta 401 JSON e messaggio tradotto (`notAuthenticated`), ma non vengono mai raggiunte: a
sessione scaduta la ricerca riceve HTML, `res.json()` fallisce e l'utente vede "Impossibile raggiungere il
servizio di ricerca" invece di un invito a rientrare. La chat ha un rimedio locale (`res.redirected`).

Proposta: per i percorsi che iniziano con `/api/` rispondere 401 JSON invece di reindirizzare.

## Richiede intervento umano

### U1 — Il limite d'uso condiviso fra le istanze si appoggia a righe che l'account puo' rimuovere (invariato)
File: `web/lib/rateLimit.ts`, usato in `web/app/api/agent/chat/route.ts` e `web/app/api/agent/search/route.ts`;
policy in `supabase/migrations/0001_init.sql:175-182`

Serve una struttura dedicata, con sola aggiunta, incrementata prima della chiamata al modello: richiede una migrazione in `supabase/`.

### U2 — Pausa condivisa fra le istanze per il riquadro motorsport (invariato)
File: `web/lib/motorsport.ts` (pausa dopo un tentativo non riuscito e promessa condivisa)

Restano in memoria di istanza; renderle comuni richiede una struttura condivisa (tabella o archivio chiave-valore), quindi una scelta di design.

## Gia' in PR

Nessuna: al momento dello scan non ci sono pull request aperte.
