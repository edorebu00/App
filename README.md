# My Vehicle

App per gestire e approfondire i propri veicoli (auto e moto): schede tecniche per sezione (motore,
carrozzeria, assetto, impianto frenante, trasmissione, elettronica), ricerca IA di risorse online
(forum, manuali PDF, video, schemi tecnici/esplosi) e chat IA sui documenti caricati (es. libretto
uso e manutenzione).

## Architettura

```
App/
├── web/              Frontend Next.js (App Router) → deploy su Vercel
├── agent-service/    Backend Node/TypeScript per l'agente IA → deploy su Railway
└── supabase/         Migrazioni SQL (schema DB, RLS, storage buckets)
```

- **Supabase**: autenticazione (email/password), database Postgres, storage file.
- **Vercel**: hosting del frontend Next.js.
- **Railway**: hosting del servizio `agent-service`, che parla con l'API di Anthropic (Claude) per
  la ricerca web e la chat sui documenti, e con Supabase (chiave service role) per leggere/scrivere dati.

Il frontend non chiama mai direttamente Anthropic: passa dalle API route `web/app/api/agent/*`, che
inoltrano la richiesta al servizio Railway allegando il token di sessione Supabase dell'utente (verificato
lato Railway prima di rispondere).

## 1. Configurare Supabase

1. Crea un nuovo progetto su [supabase.com](https://supabase.com).
2. Vai su **SQL Editor** e incolla il contenuto di [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql), poi esegui. Questo crea tutte le tabelle, le policy di Row Level Security e i bucket di storage (`vehicle-files`, `vehicle-images`), entrambi privati.
3. In **Authentication > Providers** assicurati che *Email* sia abilitato (è il default). Se vuoi saltare la conferma email in fase di test, disattiva "Confirm email" in **Authentication > Settings**.
4. Recupera in **Project Settings > API**:
   - `Project URL` → `SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (segreta, mai esposta al frontend) → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Configurare l'agente IA (Anthropic)

1. Crea una API key su [console.anthropic.com](https://console.anthropic.com).
2. Servirà come `ANTHROPIC_API_KEY` per il servizio `agent-service`.

## 3. Deploy del backend IA su Railway

1. Su [railway.app](https://railway.app), crea un nuovo progetto e collega la repo GitHub `edorebu00/App`.
2. Aggiungi un servizio dalla repo e imposta come **Root Directory** `agent-service`.
3. Railway rileva `railway.json` e usa Nixpacks (Node) automaticamente. Variabili d'ambiente da impostare (Settings → Variables), vedi anche [`agent-service/.env.example`](agent-service/.env.example):
   - `ANTHROPIC_API_KEY`
   - `CLAUDE_MODEL` (default `claude-sonnet-5`)
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `WEB_APP_ORIGIN` (URL del frontend Vercel, es. `https://my-vehicle.vercel.app`; puoi lasciare `*` in fase di test)
4. Dopo il primo deploy, Railway assegna un dominio pubblico (Settings → Networking → Generate Domain). Copialo: servirà come `AGENT_SERVICE_URL` per il frontend.

## 4. Deploy del frontend su Vercel

1. Su [vercel.com](https://vercel.com), importa la repo GitHub `edorebu00/App`.
2. Imposta **Root Directory** su `web`.
3. Variabili d'ambiente (Settings → Environment Variables), vedi anche [`web/.env.example`](web/.env.example):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `AGENT_SERVICE_URL` (il dominio Railway del passo precedente, es. `https://agent-service-production.up.railway.app`)
4. Deploy. Una volta ottenuto l'URL Vercel definitivo, torna su Railway e aggiorna `WEB_APP_ORIGIN` con quell'URL (per restringere il CORS al solo frontend ufficiale).

## 5. Sviluppo locale

```bash
# Backend IA
cd agent-service
cp .env.example .env   # compila le variabili
npm install
npm run dev             # http://localhost:8080

# Frontend (in un altro terminale)
cd web
cp .env.example .env.local   # compila le variabili, AGENT_SERVICE_URL=http://localhost:8080
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
