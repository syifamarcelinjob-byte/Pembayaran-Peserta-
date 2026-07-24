# Pembayaran Peserta — UI Academy

Panduan ini ditulis untuk yang belum pernah pakai GitHub/Vercel/Supabase sama sekali. Ikuti urut dari atas ke bawah, jangan diloncat.

Total waktu: sekitar 30-45 menit untuk yang pertama kali.

---

## Bagian 1 — Siapkan database (Supabase)

1. Buka https://supabase.com, klik **Start your project**, daftar pakai email/Google (gratis).
2. Klik **New project**. Isi nama bebas (mis. `pembayaran-peserta`), buat password database (simpan baik-baik, tapi tidak akan dipakai lagi setelah ini), pilih region **Southeast Asia (Singapore)** biar cepat, klik **Create new project**. Tunggu 1-2 menit sampai project siap.
3. Di sidebar kiri, klik ikon **SQL Editor**. Klik **New query**.
4. Buka file `supabase-setup.sql` yang ada di folder ini, copy semua isinya, paste ke SQL Editor, lalu klik **Run**. Kalau berhasil akan muncul "Success. No rows returned".
5. Di sidebar kiri, klik **Project Settings** (ikon gear) → **API**. Di situ ada dua nilai yang perlu dicatat:
   - **Project URL** (bentuknya `https://xxxxx.supabase.co`)
   - **anon public** key (deretan huruf/angka panjang)

   Simpan dua-duanya, nanti dipakai di Bagian 3.

---

## Bagian 2 — Upload kode ke GitHub

1. Buka https://github.com, klik **Sign up**, daftar akun (gratis).
2. Setelah login, klik tombol **+** di pojok kanan atas → **New repository**.
3. Isi nama repo, misalnya `pembayaran-peserta`. Biarkan **Public** atau pilih **Private** (keduanya boleh). Jangan centang apa pun yang lain. Klik **Create repository**.
4. Di halaman repo yang baru, klik link **uploading an existing file**.
5. Buka folder project ini di komputer kamu, **select semua file dan folder** (termasuk folder `src`), lalu **drag & drop** ke halaman GitHub tersebut. Tunggu sampai semua ter-upload (progress bar di tiap file).
6. Scroll ke bawah, klik **Commit changes**.

   Kalau drag-and-drop foldernya tidak jalan / strukturnya berantakan, cara amannya: upload semua file yang ada di root dulu (package.json, index.html, dll) → commit. Lalu klik **Add file → Create new file**, ketik nama `src/App.jsx` (garis miring otomatis bikin folder `src`), paste isinya, commit. Ulangi untuk `src/main.jsx`, `src/index.css`, `src/supabaseClient.js`.

---

## Bagian 3 — Deploy ke Vercel (dapat link/subdomain gratis)

1. Buka https://vercel.com, klik **Sign Up**, pilih **Continue with GitHub** (paling gampang, langsung terhubung).
2. Setelah masuk dashboard, klik **Add New... → Project**.
3. Cari repo `pembayaran-peserta` yang tadi dibuat, klik **Import**.
4. Sebelum klik Deploy, buka bagian **Environment Variables**. Tambahkan dua baris:
   - Name: `VITE_SUPABASE_URL` — Value: (Project URL dari Supabase, Bagian 1)
   - Name: `VITE_SUPABASE_ANON_KEY` — Value: (anon public key dari Supabase, Bagian 1)
5. Klik **Deploy**. Tunggu 1-2 menit.
6. Setelah selesai, Vercel kasih link seperti `pembayaran-peserta.vercel.app` — itu link yang kamu bagikan ke tim.

Setiap kali kamu (atau saya) mengubah kode dan upload ulang ke GitHub, Vercel otomatis deploy ulang tanpa perlu diulang dari Bagian 3.

---

## Bagian 4 — Pakai seperti biasa

Buka link Vercel-nya, akan muncul layar buat kode akses (sama seperti versi di Claude). Sisanya persis sama seperti yang sudah kamu pakai sebelumnya.

---

## Kalau nanti mau pakai domain sendiri

Di Vercel: buka project → **Settings → Domains** → masukkan domain kamu → ikuti instruksi untuk arahkan DNS domain ke Vercel (biasanya tinggal tambah 1 record CNAME/A di pengaturan domain). Bilang saja ke saya kalau sudah sampai tahap ini, saya bantu jelasin domain-nya bagian mana.

## Kalau ada error pas dibuka

Kirim screenshot error-nya (biasanya muncul di layar putih kosong dengan tulisan kecil, atau lewat tombol F12 → tab Console di browser), saya bantu diagnosa.
