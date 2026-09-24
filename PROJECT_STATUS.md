# Grasela Teknik — Status & Handover

Dokumen ini adalah catatan serah-terima teknis untuk project website Grasela Teknik. Perbarui dokumen ini setiap kali ada perubahan penting pada aplikasi, database, environment, atau deployment.

## 1. Ringkasan status

- **Status aplikasi:** Live dan dapat digunakan berdasarkan pengecekan manual pemilik project pada 24 September 2026.
- **Source of truth:** Repository GitHub ini, branch `main`.
- **Deployment:** Vercel terhubung ke repository GitHub ini. Push ke `main` menjadi kandidat deployment production.
- **Domain production:** `https://graselateknik.web.id/`
- **Repository:** `https://github.com/ncuyyGans/grasela-teknik`
- **Baseline yang diperiksa:** commit `937a360f74ccb47e8e624035f817a8f38b19a51b`.
- **Asal project:** Project web dari Bolt.new yang sebelumnya di-deploy melalui Vercel Drag & Drop, kemudian source code dimasukkan ke GitHub.

> Catatan penting: bagian “sudah selesai” di bawah berarti sudah tersedia di source code atau sudah dilaporkan bekerja. Bagian “belum dikonfirmasi” adalah daftar verifikasi lanjutan, bukan otomatis berarti bug.

## 2. Arsitektur aplikasi

```text
Pengunjung
   |
   v
Vercel — static SPA React/Vite
   |
   +--> Supabase Auth       (login/signup admin)
   +--> Supabase Database   (settings, services, gallery, orders, profiles)
   +--> Supabase Storage    (bucket gallery untuk foto)
```

### Stack utama

- React 18
- TypeScript
- Vite 5
- React Router DOM 6
- Tailwind CSS 3
- PostCSS dan Autoprefixer
- Supabase JS client
- Lucide React untuk ikon

### Struktur source utama

```text
public/                 Asset publik, termasuk favicon
src/
├── components/         Navbar, Footer, ProtectedRoute, layout admin
├── context/            AuthContext untuk session dan status admin
├── hooks/              useGallery, useServices, useSiteSettings
├── lib/                Client Supabase dan helper ikon
├── pages/              Halaman publik
│   └── admin/          Halaman login dan dashboard admin
├── App.tsx             Routing utama
├── index.css           Style global
├── main.tsx            Entry point React
└── types.ts            Tipe data aplikasi
supabase/
└── migrations/         Migration schema, function/trigger, dan RLS policy
```

## 3. Routing yang tersedia

### Halaman publik

| Route | Fungsi |
|---|---|
| `/` | Beranda, informasi usaha, hero, dan ringkasan layanan |
| `/layanan` | Daftar layanan AC dan listrik |
| `/galeri` | Galeri pekerjaan/foto |
| `/kontak` | Informasi kontak dan formulir pemesanan |

### Halaman admin

| Route | Fungsi |
|---|---|
| `/admin/login` | Login/signup melalui Supabase Auth |
| `/admin` | Dashboard admin |
| `/admin/settings` | Pengaturan informasi bisnis dan website |
| `/admin/services` | Kelola layanan |
| `/admin/gallery` | Kelola galeri dan upload foto |
| `/admin/orders` | Lihat dan kelola pesanan masuk |

Route admin dibungkus `ProtectedRoute` dan menggunakan `AuthContext` untuk session serta pengecekan `is_admin`.

## 4. Fitur yang sudah tersedia di source code

### Website publik

- Beranda Grasela Teknik.
- Halaman layanan AC dan listrik.
- Halaman galeri.
- Informasi telepon, WhatsApp, alamat, jam operasional, dan area layanan.
- Link telepon dan WhatsApp.
- Formulir pemesanan dengan nama, nomor HP, alamat, jenis layanan, tanggal preferensi, dan catatan.
- Formulir pemesanan menyimpan data ke tabel `orders` Supabase.
- Konten layanan, galeri, dan informasi bisnis diambil secara dinamis dari Supabase.

### Admin

- Login dan session menggunakan Supabase Auth.
- Pembatasan halaman admin dengan `ProtectedRoute`.
- Kelola pengaturan website melalui `site_settings`.
- Kelola data layanan melalui `services`.
- Kelola foto dan data galeri melalui `gallery` serta storage bucket `gallery`.
- Kelola pesanan melalui `orders`.
- Status admin ditentukan melalui kolom `profiles.is_admin`.

### Database dan keamanan

Migration yang tersimpan di repository:

1. `20260908005955_create_grasela_tables.sql`
2. `20260908010011_create_functions_and_triggers.sql`
3. `20260908010025_create_rls_policies.sql`

Tabel yang didefinisikan:

- `profiles`
- `site_settings`
- `services`
- `gallery`
- `orders`

Function dan trigger penting:

- `public.is_admin()` untuk pemeriksaan hak admin.
- `public.handle_new_user()` untuk membuat profile saat user baru mendaftar.
- Berdasarkan migration saat ini, user pertama yang mendaftar otomatis menjadi admin jika belum ada admin.

Model akses RLS yang dirancang:

- `site_settings`, `services`, dan `gallery` dapat dibaca publik.
- Perubahan `site_settings`, `services`, dan `gallery` hanya untuk admin terautentikasi.
- `orders` dapat dibuat oleh pengunjung, tetapi hanya admin yang dapat membaca, mengubah, atau menghapusnya.
- Bucket storage `gallery` dapat dibaca publik, sedangkan upload, perubahan, dan penghapusan dibatasi untuk admin.

## 5. Konfigurasi build dan deployment

### Script npm

```text
npm run dev      -> vite
npm run build    -> tsc -b && vite build
npm run preview  -> vite preview
```

### Pengaturan build Vercel yang diharapkan

```text
Framework Preset: Vite
Root Directory: .
Install Command: npm install atau npm ci
Build Command: npm run build
Output Directory: dist
Production Branch: main
```

Vercel dapat mendeteksi sebagian besar pengaturan tersebut secara otomatis. Jika pengaturan di dashboard berbeda, prioritaskan script pada `package.json` dan hasil build aktual project.

### Environment variables

Client Supabase menggunakan variable berikut:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Nilai rahasia tidak boleh disimpan di repository. Set nilainya di Vercel untuk environment yang sesuai, minimal **Production** dan **Preview** jika preview juga harus dapat menggunakan backend.

File `.env` dikecualikan oleh `.gitignore`. Jangan menghapus pengecualian tersebut atau meng-commit token, password, service role key, atau credential lain.

## 6. Hal yang sudah terverifikasi

### Terverifikasi dari repository

- Repository berisi source project utama pada branch `main`.
- `package.json` dan `package-lock.json` tersedia.
- Folder `src`, `public`, dan `supabase` tersedia.
- Routing publik dan admin tercantum di `src/App.tsx`.
- Client Supabase membaca `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
- Migration database dan RLS tersimpan di repository.
- `.env` tidak berada di root repository pada baseline yang diperiksa.

### Terverifikasi secara manual oleh pemilik project

- Website production setelah koneksi GitHub–Vercel dilaporkan dapat dibuka dan bekerja.
- Domain production tetap digunakan setelah repository dihubungkan ke project Vercel yang sama.

## 7. Hal yang belum dikonfirmasi

Item berikut perlu dicek sebelum perubahan besar atau sebelum menyerahkan project ke developer lain:

- Apakah nilai `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` sudah benar pada Vercel Production dan Preview.
- Apakah ketiga migration Supabase sudah dijalankan pada project Supabase production yang dipakai oleh Vercel.
- Apakah user admin sudah tersedia dan kolom `profiles.is_admin` bernilai `true` untuk akun yang benar.
- Uji end-to-end login admin.
- Uji perubahan settings, layanan, galeri, upload foto, dan pengelolaan order.
- Uji bahwa RLS benar-benar mencegah user biasa membaca atau mengubah data admin/order.
- Uji pengiriman formulir kontak dari website sampai muncul di halaman admin orders.
- Uji hard refresh langsung pada route bersarang seperti `/admin` dan `/layanan` di domain production.
- Uji deployment Preview dari branch selain `main`.
- Uji proses rollback ke deployment Vercel sebelumnya.
- Backup database dan prosedur pemulihan belum didokumentasikan.
- Monitoring, alerting, analytics, dan pemeriksaan broken link belum dikonfirmasi.

## 8. Langkah aman untuk melanjutkan project

### Sebelum mengubah source code

1. Pastikan working tree bersih dan branch saat ini diketahui.
2. Catat atau tag commit production yang sedang stabil.
3. Jangan mengubah migration yang sudah terlanjur diterapkan di production. Buat migration baru dengan timestamp baru.
4. Jangan memasukkan `.env` atau secret ke GitHub.
5. Untuk perubahan database, backup atau pastikan ada prosedur restore sebelum menjalankan perubahan.

### Workflow perubahan fitur

```bash
# Ambil source terbaru
git checkout main
git pull origin main

# Buat branch fitur
git checkout -b feature/nama-perubahan

# Install dependency dan cek build
npm ci
npm run build

# Setelah perubahan selesai
git add .
git commit -m "Jelaskan perubahan secara singkat"
git push -u origin feature/nama-perubahan
```

1. Biarkan Vercel membuat Preview Deployment dari branch fitur.
2. Cek halaman yang berubah, console browser, formulir, dan integrasi Supabase.
3. Merge ke `main` hanya setelah Preview valid.
4. Cek deployment production dan domain setelah merge.
5. Jika deployment production bermasalah, gunakan deployment Vercel sebelumnya untuk rollback dan perbaiki melalui branch baru.

### Checklist smoke test setelah deploy

- [ ] Beranda tampil tanpa error.
- [ ] `/layanan`, `/galeri`, dan `/kontak` dapat dibuka.
- [ ] Data settings, layanan, dan galeri tampil dari Supabase.
- [ ] Form kontak dapat dikirim dan menghasilkan order.
- [ ] Link telepon dan WhatsApp mengarah ke tujuan yang benar.
- [ ] Login admin berhasil.
- [ ] Admin dapat melihat orders.
- [ ] Admin dapat mengubah settings/services/gallery sesuai hak akses.
- [ ] Upload dan penghapusan foto mengikuti aturan admin.
- [ ] Refresh langsung pada route bersarang tidak menghasilkan 404.
- [ ] Tidak ada secret yang masuk ke commit.

## 9. Konvensi pemeliharaan

- Gunakan `main` hanya untuk versi yang siap production.
- Gunakan branch fitur untuk perubahan baru.
- Satu commit sebaiknya menjelaskan satu perubahan yang terkait.
- Update dokumen ini jika route, schema database, environment variable, deployment, atau hak akses berubah.
- Setelah perubahan penting, tambahkan catatan pada riwayat di bawah.

## 10. Riwayat perubahan dan serah-terima

| Tanggal | Perubahan | Verifikasi | Commit/deployment |
|---|---|---|---|
| 2026-09-24 | Source project Bolt dimasukkan ke GitHub dan Vercel dihubungkan ke repository | Pemilik project mengonfirmasi website live bekerja | `937a360f74ccb47e8e624035f817a8f38b19a51b` |
| 2026-09-24 | Dokumen status dan handover dibuat | Perlu ditinjau kembali setelah verifikasi Supabase dan smoke test lengkap | `main` |

## 11. Catatan untuk update berikutnya

Sebelum meminta perubahan baru pada project, sertakan informasi berikut jika relevan:

- Halaman atau route yang ingin diubah.
- Perubahan tampilan atau perilaku yang diharapkan.
- Apakah perubahan menyentuh Supabase/database.
- Apakah perubahan perlu environment variable baru.
- Screenshot atau contoh hasil yang diinginkan.
- Konfirmasi apakah perubahan boleh langsung ke `main` atau harus melalui branch/Preview terlebih dahulu.
