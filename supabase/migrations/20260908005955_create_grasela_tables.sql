/*
# Grasela Teknik — Tables Only

Creates all tables for the Grasela Teknik website:
- profiles (links to auth.users, has is_admin flag)
- site_settings (single-row, all editable general info)
- services (AC & electrical services with prices)
- gallery (photo gallery)
- orders (customer bookings from the contact form)

No policies yet — those come in a follow-up migration after the is_admin() function is created.
*/

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- SITE SETTINGS TABLE (single row, id always 1)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id int PRIMARY KEY DEFAULT 1,
  business_name text NOT NULL DEFAULT 'Grasela Teknik',
  tagline text NOT NULL DEFAULT 'Jasa Service AC & Listrik Profesional',
  description text NOT NULL DEFAULT 'Grasela Teknik menyediakan jasa perbaikan dan perawatan AC serta instalasi listrik untuk rumah, kantor, dan bisnis Anda. Ditangani oleh teknisi berpengalaman dengan layanan yang cepat dan terpercaya.',
  phone text NOT NULL DEFAULT '0858-6089-5465',
  whatsapp text NOT NULL DEFAULT '085860895465',
  address text NOT NULL DEFAULT 'Jl. Contoh No. 123, Kota, Provinsi',
  operating_hours text NOT NULL DEFAULT 'Senin–Sabtu: 08.00–20.00 | Minggu: Tutup',
  service_area text NOT NULL DEFAULT 'Kota dan sekitarnya',
  hero_title text NOT NULL DEFAULT 'Jasa Service AC & Listrik Terpercaya',
  hero_subtitle text NOT NULL DEFAULT 'Perawatan, perbaikan, dan instalasi AC serta listrik untuk rumah, kantor, dan bisnis Anda — ditangani teknisi berpengalaman.',
  why_choose_us jsonb NOT NULL DEFAULT '["Teknisi berpengalaman dan tersertifikasi","Harga transparan, no hidden cost","Layanan cepat, responsif, dan tepat waktu","Garansi pengerjaan","Covers area kota dan sekitarnya"]'::jsonb,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- ============================================================
-- SERVICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'wrench',
  sort_order int NOT NULL DEFAULT 0,
  visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- GALLERY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title text NOT NULL DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL DEFAULT '',
  service_type text NOT NULL DEFAULT '',
  preferred_date text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'baru',
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO public.site_settings (id) VALUES (1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.services (name, description, price, icon, sort_order, visible) VALUES
('Cuci (Maintenance) AC', 'Pembersihan menyeluruh unit AC indoor dan outdoor untuk menjaga kinerja dan kualitas udara. Termasuk pembersihan filter, evaporator, dan kondensor.', 'Rp 75.000–100.000 / unit', 'wind', 1, true),
('Service AC', 'Perbaikan AC yang tidak dingin, bocor, atau bermasalah. Diagnosa menyeluruh dan penyelesaian tepat sasaran.', 'Rp 100.000–300.000', 'wrench', 2, true),
('Bongkar & Pasang AC', 'Pembongkaran AC dari lokasi lama dan pemasangan ulang di lokasi baru, termasuk pengetesan ulang sistem.', 'Rp 250.000–400.000 / unit', 'tool', 3, true),
('Isi / Tambah Freon', 'Pengisian atau penambahan refrigerant (freon) untuk AC yang kurang dingin akibat freon berkurang.', 'Rp 150.000–350.000', 'droplet', 4, true),
('Instalasi Listrik', 'Pemasangan instalasi listrik baru untuk rumah, kantor, atau ruangan — termasuk penambahan titik lampu dan stop kontak.', 'Rp 150.000–500.000', 'zap', 5, true),
('Perbaikan Listrik', 'Perbaikan masalah listrik seperti konslet, trip MCB, kabel putus, atau stop kontak rusak.', 'Rp 100.000–400.000', 'zap', 6, true),
('Lainnya', 'Layanan teknik lainnya termasuk pemasangan lampu, perbaikan saklar, pengecekan panel listrik, dan konsultasi teknis.', 'Hubungi untuk penawaran', 'settings', 7, true)
ON CONFLICT DO NOTHING;

INSERT INTO public.gallery (image_url, title, sort_order) VALUES
('https://images.pexels.com/photos/6447067/pexels-photo-6447067.jpeg?auto=compress&cs=tinysrgb&w=800', 'Perbaikan AC Split', 1),
('https://images.pexels.com/photos/6474190/pexels-photo-6474190.jpeg?auto=compress&cs=tinysrgb&w=800', 'Cuci AC Outdoor', 2),
('https://images.pexels.com/photos/8006462/pexels-photo-8006462.jpeg?auto=compress&cs=tinysrgb&w=800', 'Instalasi Listrik', 3),
('https://images.pexels.com/photos/8485668/pexels-photo-8485668.jpeg?auto=compress&cs=tinysrgb&w=800', 'Service AC Central', 4),
('https://images.pexels.com/photos/5691660/pexels-photo-5691660.jpeg?auto=compress&cs=tinysrgb&w=800', 'Pemasangan Titik Lampu', 5),
('https://images.pexels.com/photos/8006460/pexels-photo-8006460.jpeg?auto=compress&cs=tinysrgb&w=800', 'Perbaikan Panel Listrik', 6)
ON CONFLICT DO NOTHING;