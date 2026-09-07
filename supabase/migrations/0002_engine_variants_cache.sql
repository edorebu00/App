-- Cache condivisa delle motorizzazioni trovate dall'agente IA per marca/modello.
-- Non e' dato personale dell'utente: una volta trovate le motorizzazioni di un modello,
-- restano disponibili istantaneamente per chiunque le richieda in seguito.

create table public.engine_variants_cache (
  id uuid primary key default gen_random_uuid(),
  vehicle_type text not null check (vehicle_type in ('auto', 'moto')),
  make text not null,
  model text not null,
  variants jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (vehicle_type, make, model)
);

alter table public.engine_variants_cache enable row level security;

create policy "engine_variants_cache: lettura per utenti autenticati" on public.engine_variants_cache
  for select using (auth.role() = 'authenticated');

create policy "engine_variants_cache: scrittura per utenti autenticati" on public.engine_variants_cache
  for insert with check (auth.role() = 'authenticated');
