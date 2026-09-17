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
