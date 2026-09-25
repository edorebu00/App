Data (UTC): 2026-09-25

Metodo: per ogni task ho aperto i file citati in `cascade/TASKS.md` e verificato riga per riga quale file
verra' davvero modificato (a differenza di un file semplicemente citato come riferimento/contesto).

Verifica effettuata:
- T1 modifica solo `web/lib/vehicleData.ts` (blocco Toyota "Urban Cruiser", righe 2299-2303: aggiunta di
  due voci termiche e correzione di `yearFrom` sulle tre voci elettriche).
- T2 modifica solo `web/lib/vehicleData.ts` (blocco Hyundai `Inster` in `ENGINE_DATA`, righe 1424-1427:
  rimozione dell'intera voce). Il blocco `Inster` in `web/lib/engineExtensions.ts:765-768` va SOLO
  mantenuto com'e', non modificato: T2 non tocca quel file.
- T3 modifica solo `web/lib/engineExtensions.ts` (blocco Dacia `Bigster` in `ENGINE_EXTENSIONS`, righe
  791-794: rimozione dell'intera voce). `web/lib/vehicleData.ts:1126-1130` e' solo un riferimento di
  contesto (le 3 voci Dacia Bigster gia' corrette in ENGINE_DATA), non viene modificato da T3.

Conclusione sui file realmente toccati: T1 e T2 condividono `web/lib/vehicleData.ts` e vanno quindi nello
stesso gruppo. T3 tocca solo `web/lib/engineExtensions.ts`, un file che nessun altro task modifica
davvero, quindi puo' stare in un gruppo separato. La nota di coordinamento in TASKS.md (T2 e T3
condividerebbero `engineExtensions.ts`) non corrisponde a cosa viene effettivamente scritto dalle due
correzioni richieste; vedi sezione finale.

## Lavoratore 4

Task assegnati: T1, T2 (in quest'ordine)

File previsti:
- `web/lib/vehicleData.ts` — blocco Toyota "Urban Cruiser" (~2299-2303) per T1
- `web/lib/vehicleData.ts` — blocco Hyundai "Inster" in ENGINE_DATA (~1424-1427) per T2

Motivazione: entrambi i task scrivono nello stesso file (`vehicleData.ts`), in due blocchi Marca/Modello
lontani tra loro (Toyota vs Hyundai) e indipendenti nel contenuto: nessuna dipendenza logica tra T1 e T2,
solo la necessita' di evitare che due PR diverse tocchino lo stesso file. L'ordine T1 poi T2 e' arbitrario
(nessuna dipendenza reale); si puo' anche invertire.

Rischi/conflitti: minimi. Le modifiche sono in punti diversi del file, quindi un solo commit che le
applichi entrambe (o due commit in sequenza sullo stesso branch/lavoratore) non genera conflitti interni.
Attenzione a non alterare per errore righe adiacenti (es. Ioniq 5/6 sopra Inster) durante la rimozione
della voce Inster.

## Lavoratore 5

Task assegnati: T3

File previsti:
- `web/lib/engineExtensions.ts` — blocco Dacia "Bigster" in ENGINE_EXTENSIONS (~791-794)

Motivazione: unico task che scrive in `engineExtensions.ts`; nessuna condivisione di file con T1/T2, quindi
puo' procedere in una PR indipendente senza rischio di conflitto con il lavoratore 4.

Rischi/conflitti: nessuno con gli altri gruppi. Attenzione a non toccare il blocco Hyundai "Inster"
(righe 765-768, poco sopra) che va lasciato invariato.

## Lavoratore 6

Task assegnati: nessuno (solo 3 task disponibili, gia' distribuiti su 2 gruppi per via del vincolo sui
file condivisi tra T1 e T2; nessun task residuo da assegnare).

## Punti da confermare all'agente 3

- Ho ricostruito la reale disgiunzione dei file leggendo il codice invece di fidarmi della nota di
  coordinamento in `cascade/TASKS.md` (che indica T2+T3 come condivisori di `engineExtensions.ts`): dai
  contenuti letti, T2 modifica solo `vehicleData.ts` e T3 modifica solo `engineExtensions.ts`, mentre sono
  T1+T2 a condividere `vehicleData.ts`. Chiedo conferma di questa lettura prima di renderla definitiva,
  visto che contraddice la nota scritta dall'agente 1.
- Se l'agente 3 preferisce comunque seguire la nota originale (T2+T3 insieme per prudenza), lo schema
  alternativo sarebbe: lavoratore 4 = T1 da solo; lavoratore 5 = T2+T3 insieme (in tal caso pero'
  bisognerebbe verificare a mano che le due sezioni Hyundai/Dacia in `engineExtensions.ts` non si
  sovrappongano in un unico diff). Non l'ho scelto come opzione principale perche' dalla lettura del
  codice T2 non scrive in quel file.
- Il lavoratore 6 resta senza task con questa suddivisione: da confermare che sia accettabile con solo
  3 task disponibili, oppure se preferite un ribilanciamento diverso (es. spostare T1 da solo a un
  lavoratore e lasciare T2 da solo a un altro, accettando il rischio di conflitto su file condiviso che il
  criterio (a) vorrebbe invece evitare).
