-- My Vehicle - schema iniziale
-- Da eseguire nel SQL editor di Supabase (o via `supabase db push`)

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- profiles: un profilo per ogni utente registrato (creato automaticamente)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- vehicles
-- ---------------------------------------------------------------------------
create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('auto', 'moto')),
  make text not null,
  model text not null,
  engine_code text,
  year int,
  plate text,
  vin text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index vehicles_user_id_idx on public.vehicles(user_id);

-- ---------------------------------------------------------------------------
-- vehicle_sections: motore, carrozzeria, assetto, impianto frenante, ecc.
-- ---------------------------------------------------------------------------
create table public.vehicle_sections (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  section_key text not null,
  label text not null,
  data jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (vehicle_id, section_key)
);

create index vehicle_sections_vehicle_id_idx on public.vehicle_sections(vehicle_id);

-- ---------------------------------------------------------------------------
-- section_images: esplosi/schemi tecnici, caricati dall'utente o trovati sul web
-- ---------------------------------------------------------------------------
create table public.section_images (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.vehicle_sections(id) on delete cascade,
  storage_path text,
  external_url text,
  source text not null check (source in ('upload', 'web')),
  caption text,
  created_at timestamptz not null default now(),
  constraint section_images_has_location check (storage_path is not null or external_url is not null)
);

create index section_images_section_id_idx on public.section_images(section_id);

-- ---------------------------------------------------------------------------
-- search_results: cronologia/cache delle ricerche dell'agente IA
-- ---------------------------------------------------------------------------
create table public.search_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  query text not null,
  results jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index search_results_user_id_idx on public.search_results(user_id);
create index search_results_vehicle_id_idx on public.search_results(vehicle_id);

-- ---------------------------------------------------------------------------
-- documents: file caricati dall'utente (libretti, manuali, ecc.)
-- ---------------------------------------------------------------------------
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  extracted_text text,
  processed boolean not null default false,
  processing_error text,
  created_at timestamptz not null default now()
);

create index documents_user_id_idx on public.documents(user_id);
create index documents_vehicle_id_idx on public.documents(vehicle_id);

-- ---------------------------------------------------------------------------
-- chat_messages: chat con l'agente IA sui documenti caricati
-- ---------------------------------------------------------------------------
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index chat_messages_user_id_idx on public.chat_messages(user_id);
create index chat_messages_vehicle_id_idx on public.chat_messages(vehicle_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_sections enable row level security;
alter table public.section_images enable row level security;
alter table public.search_results enable row level security;
alter table public.documents enable row level security;
alter table public.chat_messages enable row level security;

create policy "profiles: select own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

create policy "vehicles: full access to own" on public.vehicles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "vehicle_sections: full access via vehicle owner" on public.vehicle_sections
  for all using (
    exists (select 1 from public.vehicles v where v.id = vehicle_id and v.user_id = auth.uid())
  ) with check (
    exists (select 1 from public.vehicles v where v.id = vehicle_id and v.user_id = auth.uid())
  );

create policy "section_images: full access via vehicle owner" on public.section_images
  for all using (
    exists (
      select 1 from public.vehicle_sections s
      join public.vehicles v on v.id = s.vehicle_id
      where s.id = section_id and v.user_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.vehicle_sections s
      join public.vehicles v on v.id = s.vehicle_id
      where s.id = section_id and v.user_id = auth.uid()
    )
  );

create policy "search_results: full access to own" on public.search_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "documents: full access to own" on public.documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "chat_messages: full access to own" on public.chat_messages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Storage buckets (privati) + policy basate sul prefisso "<user_id>/..."
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('vehicle-files', 'vehicle-files', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('vehicle-images', 'vehicle-images', false)
on conflict (id) do nothing;

create policy "vehicle-files: owner read" on storage.objects
  for select using (bucket_id = 'vehicle-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "vehicle-files: owner write" on storage.objects
  for insert with check (bucket_id = 'vehicle-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "vehicle-files: owner delete" on storage.objects
  for delete using (bucket_id = 'vehicle-files' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "vehicle-images: owner read" on storage.objects
  for select using (bucket_id = 'vehicle-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "vehicle-images: owner write" on storage.objects
  for insert with check (bucket_id = 'vehicle-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "vehicle-images: owner delete" on storage.objects
  for delete using (bucket_id = 'vehicle-images' and (storage.foldername(name))[1] = auth.uid()::text);
