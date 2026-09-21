-- My Vehicle - tetto di dimensione per oggetto sui bucket Storage
-- Da eseguire nel SQL editor di Supabase (o via `supabase db push`)
--
-- Finora il limite di 20 MB (web/lib/files.ts, MAX_UPLOAD_BYTES) esisteva solo nel codice
-- dell'applicazione. Con questa migrazione diventa vincolante anche a livello di bucket,
-- indipendentemente da come viene fatta la richiesta di upload.
--
-- 20 * 1024 * 1024 = 20971520 byte. Se cambi MAX_UPLOAD_BYTES nel codice, cambia anche questo
-- valore. Non puo' superare il limite globale del progetto (Dashboard > Storage > Settings).
-- Idempotente: si puo' rieseguire senza effetti collaterali. I file gia' caricati non vengono toccati.

update storage.buckets
set file_size_limit = 20971520
where id in ('vehicle-files', 'vehicle-images');
