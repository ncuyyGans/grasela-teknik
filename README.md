<div align="center">
  <img src="public/grasela-logo-mark.svg" alt="Logo Grasela Teknik" width="96" />

# Grasela Teknik

Website layanan service AC dan instalasi listrik dengan konten dinamis, formulir pemesanan, galeri pekerjaan, serta panel admin.

[Website Production](https://graselateknik.web.id) · [Status Teknis](PROJECT_STATUS.md)
</div>

## Tentang proyek

Grasela Teknik adalah aplikasi web untuk mempromosikan dan mengelola layanan perawatan, perbaikan, serta instalasi AC dan listrik. Pengunjung dapat melihat layanan, membuka lokasi di Google Maps, menghubungi WhatsApp, melihat galeri, dan mengirim pesanan. Pemilik usaha dapat mengelola konten tersebut melalui panel admin.

Proyek dibuat menggunakan Bolt.new, kemudian source code dipindahkan ke GitHub dan deployment production dihubungkan ke Vercel.

## Fitur

### Website publik

- Beranda dengan informasi usaha dan sorotan layanan.
- Daftar layanan beserta deskripsi dan harga.
- Galeri hasil pekerjaan dengan lightbox.
- Bagian lokasi khusus yang dapat membuka Google Maps.
- Tombol telepon dan WhatsApp.
- Formulir pemesanan layanan.
- Tampilan responsif untuk desktop dan mobile.

### Panel admin

- Autentikasi menggunakan Supabase Auth.
- Dashboard ringkasan.
- Pengaturan identitas usaha, kontak, operasional, lokasi, dan teks beranda.
- Pengelolaan layanan dan harga.
- Pengelolaan galeri serta upload gambar.
- Pengelolaan pesanan pelanggan.
- Pembatasan akses berdasarkan `profiles.is_admin`.

## Teknologi

- React 18
- TypeScript
- Vite 5
- React Router DOM 6
- Tailwind CSS 3
- Supabase Auth, Database, dan Storage
- Lucide React
- Vercel

## Menjalankan secara lokal

### Persyaratan

- Node.js 18 atau lebih baru
- npm
- Project Supabase yang sesuai dengan schema aplikasi

### Instalasi

```bash
git clone https://github.com/ncuyyGans/grasela-teknik.git
cd grasela-teknik
npm ci
```

Buat file `.env` di root project:

```env
VITE_SUPABASE_URL=https://PROJECT-REF.supabase.co
VITE_SUPABASE_ANON_KEY=SUPABASE_ANON_KEY
```

Jalankan development server:

```bash
npm run dev
```

Vite akan menampilkan alamat lokal, biasanya `http://localhost:5173`.

> Jangan commit file `.env`, password, service-role key, atau kredensial lain ke repository.

## Script npm

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Menjalankan development server Vite |
| `npm run build` | Memeriksa TypeScript dan membuat production build |
| `npm run preview` | Menjalankan preview dari hasil build |

## Route aplikasi

### Publik

| Route | Deskripsi |
|---|---|
| `/` | Beranda |
| `/layanan` | Daftar layanan |
| `/galeri` | Galeri pekerjaan |
| `/kontak` | Lokasi, kontak, dan formulir pemesanan |

### Admin

| Route | Deskripsi |
|---|---|
| `/admin/login` | Login admin |
| `/admin` | Dashboard |
| `/admin/settings` | Informasi umum dan pengaturan website |
| `/admin/services` | Kelola layanan |
| `/admin/gallery` | Kelola galeri |
| `/admin/orders` | Kelola pesanan |

## Database Supabase

Migration tersedia di folder [`supabase/migrations`](supabase/migrations):

1. Pembuatan tabel utama.
2. Function dan trigger autentikasi/admin.
3. Row Level Security (RLS) dan policy akses.

Tabel utama:

- `profiles` — profil pengguna dan status admin.
- `site_settings` — informasi usaha serta konten website.
- `services` — daftar layanan dan harga.
- `gallery` — metadata galeri.
- `orders` — pesanan pelanggan.

Storage bucket `gallery` digunakan untuk gambar galeri.

### Catatan link Google Maps

Panel admin menyediakan field alamat dan link Google Maps secara terpisah. Untuk menjaga kompatibilitas dengan database Bolt yang sudah ada, aplikasi menyimpan keduanya melalui field `address` menggunakan helper di `src/lib/address.ts`. Tidak diperlukan migration database tambahan untuk fitur ini.

## Autentikasi dan hak akses

- Login menggunakan Supabase Auth dengan email dan password.
- Route admin dilindungi oleh `ProtectedRoute`.
- Hak admin dibaca dari `profiles.is_admin`.
- Berdasarkan migration repository, pengguna pertama dapat dijadikan admin secara otomatis jika belum ada admin.
- Data publik dapat dibaca oleh pengunjung sesuai policy RLS.
- Perubahan settings, layanan, galeri, dan pesanan dibatasi untuk admin.

## Build dan deployment

Repository menggunakan branch `main` sebagai source deployment production di Vercel.

Pengaturan Vercel yang disarankan:

```text
Framework Preset: Vite
Root Directory: .
Install Command: npm ci
Build Command: npm run build
Output Directory: dist
Production Branch: main
```

Tambahkan environment variables berikut di Vercel untuk Production dan Preview:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Setelah environment variable diubah, lakukan redeploy agar nilainya masuk ke bundle Vite terbaru.

## Struktur project

```text
public/                 Asset publik dan logo
src/
├── components/         Komponen publik dan admin
├── context/            Context autentikasi
├── hooks/              Hook settings, services, dan gallery
├── lib/                Supabase client dan helper
├── pages/              Halaman publik
│   └── admin/          Halaman panel admin
├── App.tsx             Routing aplikasi
├── index.css           Style global
└── types.ts            Tipe data
supabase/
└── migrations/         Schema, function, trigger, dan RLS
```

## Catatan kepemilikan backend

Deployment awal berasal dari Bolt.new dan menggunakan konfigurasi Supabase dari file `.env`. Pastikan `VITE_SUPABASE_URL` menunjuk ke project Supabase yang benar-benar Anda miliki atau dapat Anda kelola. Sebelum melakukan perubahan database besar, konfirmasikan akses dashboard, backup data, migration yang sudah diterapkan, dan akun admin production.

## Kontribusi dan pemeliharaan

1. Buat branch baru dari `main`.
2. Lakukan perubahan yang terfokus.
3. Jalankan `npm run build`.
4. Uji tampilan desktop dan mobile.
5. Buat pull request dan periksa Preview Deployment.
6. Merge setelah hasil preview valid.

Dokumentasi teknis dan checklist serah-terima yang lebih lengkap tersedia di [`PROJECT_STATUS.md`](PROJECT_STATUS.md).
