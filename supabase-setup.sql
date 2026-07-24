-- Jalankan seluruh isi file ini di Supabase: SQL Editor > New query > paste > Run

create table if not exists kv_store (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

-- Izinkan aplikasi (pakai anon key) membaca & menulis tabel ini.
-- Catatan: ini setara dengan akses tanpa login, aman untuk tim kecil
-- karena tetap dibatasi kode akses di dalam aplikasi, tapi bukan
-- keamanan tingkat bank. Jangan simpan data super sensitif (no. rekening
-- pribadi peserta, dsb) di sini kalau bisa dihindari.

alter table kv_store enable row level security;

create policy "allow all read" on kv_store
  for select using (true);

create policy "allow all write" on kv_store
  for insert with check (true);

create policy "allow all update" on kv_store
  for update using (true);
