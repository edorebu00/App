# My Vehicle

App per gestire e approfondire i propri veicoli (auto e moto): schede tecniche per sezione (motore,
carrozzeria, assetto, impianto frenante, trasmissione, elettronica), ricerca IA di risorse online
(forum, manuali PDF, video, schemi tecnici/esplosi) e chat IA sui documenti caricati (es. libretto
uso e manutenzione).

## Architettura

```
App/
├── web/              App Next.js (App Router) — frontend + backend IA → deploy su Vercel
└── supabase/         Migrazioni SQL (schema DB, RLS, storage buckets)
```

- **Supabase**: autenticazione (email/password), database Postgres, storage file.
- **Vercel**: hosting dell'intera app Next.js (frontend **e** le API route che parlano con Claude),
  piano gratuito Hobby sufficiente per un progetto personale/non commerciale.
- **Anthropic (Claude)**: usato dalle API route in `web/app/api/agent/*` per la ricerca web
  categorizzata e la chat sui documenti. È l'unico servizio a pagamento a consumo (nessun costo
  fisso mensile: paghi solo quando qualcuno usa davvero le funzioni IA).

Non c'è nessun backend separato: le API route di Next.js girano come funzioni serverless su Vercel,
usano la sessione Supabase dell'utente (quindi le query rispettano automaticamente le policy di Row
Level Security) e chiamano l'API Anthropic lato server, senza mai esporre la chiave al browser.

## 1. Configurare Supabase

1. Crea un nuovo progetto su [supabase.com](https://supabase.com).
2. Vai su **SQL Editor** e incolla il contenuto di [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql), poi esegui. Questo crea tutte le tabelle, le policy di Row Level Security e i bucket di storage (`vehicle-files`, `vehicle-images`), entrambi privati.
3. In **Authentication > Providers** assicurati che *Email* sia abilitato (è il default). Se vuoi saltare la conferma email in fase di test, disattiva "Confirm email" in **Authentication > Settings**.
4. Recupera in **Project Settings > API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Configurare l'agente IA (Anthropic)

1. Crea un account su [console.anthropic.com](https://console.anthropic.com) e acquista dei crediti (funziona a consumo, non è un abbonamento fisso).
2. Vai su **API Keys** e creane una nuova → `ANTHROPIC_API_KEY`.

## 3. Deploy su Vercel

1. Su [vercel.com](https://vercel.com), importa la repo GitHub `edorebu00/App`.
2. Imposta **Root Directory** su `web`.
3. Variabili d'ambiente (Settings → Environment Variables), vedi anche [`web/.env.example`](web/.env.example):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY`
   - `CLAUDE_MODEL` (opzionale, default `claude-sonnet-5`)
4. Deploy. Fatto: l'app è online, gratuita, e utilizzabile da chiunque abbia il link.

## 4. Sviluppo locale

```bash
cd web
cp .env.example .env.local   # compila le variabili
npm install
npm run dev              # http://localhost:3000
```

## Funzionalità principali

- **Registrazione/login** via email e password (Supabase Auth).
- **Aggiunta veicolo**: tipologia (auto/moto), marca, modello, codice motore, anno, targa.
- **Schede per sezione**: Motore, Carrozzeria, Assetto, Impianto frenante, Trasmissione, Elettronica —
  ognuna con caratteristiche personalizzabili (coppie chiave/valore), note libere e immagini/schemi
  (caricati dall'utente o trovati tramite la ricerca IA).
- **Ricerca IA**: inserendo modello o codice motore, l'agente (Claude con web search) restituisce link
  categorizzati a forum, manuali/PDF, video YouTube e schemi tecnici/esplosi realmente trovati online.
- **Documenti + chat IA**: upload di PDF/TXT (es. libretto uso e manutenzione), estrazione automatica
  del testo, e chat che risponde basandosi sui documenti caricati per quel veicolo. Ogni file è
  scaricabile in qualsiasi momento tramite link firmato temporaneo da Supabase Storage.

## Costi attesi

- **Supabase**: gratis (piano Free, ampiamente sufficiente per iniziare).
- **Vercel**: gratis (piano Hobby).
- **Anthropic**: a consumo, solo quando le funzioni IA vengono usate (pochi centesimi per ricerca/chat).

Nessun costo fisso mensile: paghi solo se e quando l'IA viene effettivamente utilizzata.

## Consumo di token (costo delle funzioni IA)

Il costo è dominato dalla chat: il testo dei documenti caricati viene rispedito al modello a
**ogni** messaggio, e un manuale di medie dimensioni vale da solo ~60.000 token per messaggio,
cioè centinaia di volte tutto il resto del prompt. Le scelte sono ordinate per questo.

- **Cache dei prompt sui documenti.** Il prompt di sistema della chat è diviso in due blocchi
  (`web/lib/chatPrompt.ts`): davanti istruzioni e documenti, con un punto di cache; in coda la
  lingua, che l'utente può cambiare. Dal secondo messaggio in poi i documenti si pagano ~un
  decimo. Su una conversazione di dieci messaggi sono circa il 75-80% in meno.
- **Stabilità del prefisso.** La cache confronta i byte del prefisso, quindi va difesa: i
  documenti si leggono con un `ORDER BY` esplicito (senza, Postgres può restituirli in ordine
  diverso e la cache non viene mai riletta) e la finestra della cronologia avanza a blocchi di
  sei messaggi invece che scorrere di uno alla volta.
- **Pulizia del testo estratto, una volta sola** (`web/lib/extractedText.ts`): intestazioni e piè
  di pagina ricorrenti, numeri di pagina, spaziatura e parole spezzate a fine riga vengono tolti
  al momento del caricamento. Quanto si risparmia dipende dal documento — su un manuale con
  intestazioni su ogni pagina è dell'ordine del 20-40% — e si risparmia su ogni messaggio futuro.
- **Ricerche identiche riproposte dalla cronologia**: stessa query, stesso veicolo, stessa lingua
  entro sette giorni non richiamano il modello. Le policy RLS tengono la cronologia separata per
  utente, quindi nessuno può inquinare i risultati di un altro.
- **Prompt di ricerca sfoltito**: le regole sui singoli campi stanno nelle descrizioni dello
  schema di `submit_findings`, che viene comunque inviato; erano ripetute anche nel prompt di
  sistema, e si pagavano due volte. ~36% in meno di testo fisso per chiamata, stesse regole.
- **Ricerca web con filtraggio dinamico** (`web_search_20260209`): i risultati arrivano ripuliti
  dall'impaginazione invece di riversarla nel contesto, dove verrebbe rispedita a ogni giro. Il
  ritentativo, quando serve, ha metà delle ricerche a disposizione: deve chiudere, non ricominciare.

### Verificare che la cache funzioni ancora

La cache dei prompt non si rompe con un errore: le richieste continuano a funzionare, cambia solo
il conto. Le due difese:

```bash
cd web && npm run check:cache
```

verifica le proprietà da cui dipende il riuso (prefisso identico fra turni, blocco volatile in
coda, finestra della cronologia stabile) — **da rieseguire dopo ogni modifica a un prompt** — e i
log del server, dove ogni chiamata stampa una riga `[token]` con token riletti dalla cache,
riscritti e nuovi. A regime i riletti devono dominare: se restano a zero, qualcosa a monte del
punto di cache sta cambiando a ogni richiesta.

## Sicurezza: com'è protetto l'accesso ai dati

- **Isolamento fra utenti**: tutte le tabelle hanno Row Level Security attiva e ogni query passa
  dalla sessione Supabase dell'utente (anche quelle dentro le API route). Non esiste da nessuna
  parte una `service_role key`, quindi non c'è modo di aggirare le policy: un id di un veicolo o
  di un documento altrui semplicemente non restituisce righe.
- **File**: i bucket `vehicle-files` e `vehicle-images` sono privati e le policy consentono
  lettura/scrittura/cancellazione solo sotto il prefisso `<user_id>/...`. I download avvengono con
  link firmati validi 60 secondi.
- **Link trovati dall'IA**: gli URL restituiti dal modello vengono filtrati (solo `http`/`https`)
  sia prima di essere salvati sia prima di essere renderizzati, così uno schema come `javascript:`
  non può diventare codice eseguito al click.
- **Limiti di frequenza**: le route IA hanno un tetto per utente (ricerca 10 / chat 30 /
  elaborazione documenti 20 ogni 5 minuti) per evitare che un ciclo di richieste generi consumo
  Anthropic/OpenAI incontrollato. Il contatore è in memoria nella singola istanza serverless:
  ferma l'abuso banale, non un attacco distribuito (per quello servirebbe un contatore condiviso).
- **Upload**: solo PDF/TXT per i documenti e immagini/PDF per gli schemi, massimo 20 MB, con il
  nome del file normalizzato prima di finire nella chiave di storage.
- **Header**: `frame-ancestors`/`X-Frame-Options` (anti clickjacking), `nosniff`,
  `Referrer-Policy`, `Permissions-Policy` e HSTS sono impostati in `next.config.mjs`.
- **Contenuti non fidati trattati come tali in lettura, non solo in scrittura**: la RLS stabilisce
  di chi è una riga, non che cosa contiene, e `search_results` è scrivibile direttamente dal
  browser. I risultati ripescati dalla cronologia vengono quindi risanificati anche quando si
  rileggono, esattamente come quelli appena arrivati dal modello.

### Rischio residuo noto: il parsing dei PDF

`pdf-parse` 1.1.1 include al suo interno una copia di pdf.js **1.10.100, del 2018**, e i PDF
caricati dagli utenti sono l'input non fidato più pesante che l'app elabori lato server.

L'esecuzione di codice nota su quelle versioni di pdf.js (CVE-2024-4367) passa dalla generazione
dei glifi durante il *rendering* su canvas: qui si chiama solo `getTextContent()`, quindi quel
percorso non viene attraversato. Resta il rischio generico di un parser vecchio e non più
mantenuto, limitato da `maxDuration = 90`, dal tetto di 20 MB per file, dal limite di frequenza e
dal tetto di 500 pagine analizzate.

La soluzione è passare a `pdf-parse` 2.x, che usa `pdfjs-dist` 5.x (2025). **Non è stato fatto
qui** perché la 2.x carica `@napi-rs/canvas`, un binario nativo, anche per la sola estrazione
testo: su Vercel va verificato sul deploy reale (dimensione della funzione, `serverExternalPackages`,
binari per piattaforma), e non aveva senso rischiare la produzione per chiudere un percorso che
non risulta raggiungibile. È un cambiamento a sé, da fare potendo verificare il deploy.

## Note sull'MVP e possibili evoluzioni future

- La chat sui documenti usa per ora "context stuffing" (il testo estratto viene passato direttamente
  al modello, entro un limite di caratteri) invece di un vero motore RAG con embeddings/vector DB:
  è la soluzione più semplice da mettere in piedi con un solo provider IA (Anthropic) e funziona bene
  per manuali di dimensioni tipiche. Per librerie di documenti molto grandi si può evolvere aggiungendo
  `pgvector` su Supabase e un modello di embeddings (es. Voyage AI, partner consigliato da Anthropic).
- L'estrazione testo è supportata per PDF e TXT; per DOCX/immagini scansionate servirebbe una libreria
  aggiuntiva (es. OCR) non ancora inclusa.
- Gli "esplosi" dei componenti sono gestiti come immagini collegate a ciascuna sezione: l'utente può
  caricarne una propria oppure trovarne una tramite la sezione Ricerca (i risultati con categoria
  "schema_tecnico" sono link esterni, non vengono scaricati automaticamente per motivi di copyright).
- Le API route di ricerca/chat/elaborazione documenti girano come funzioni serverless Vercel. Il
  piano Hobby supporta funzioni fino a 300s: la ricerca (che può fare più chiamate allo strumento
  web_search) usa `maxDuration = 180`, chat e processing documenti `maxDuration = 90`.
