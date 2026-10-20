import { ID, Query } from 'appwrite'
import { tables, DATABASE_ID, COLLECTIONS, SETTINGS_DOC_ID } from './appwrite'

// Seed content mirrored from the original Supabase migration.
// Inserted once by the first admin (see AuthContext) when the tables
// are still empty, because that account holds the write permissions.

export const DEFAULT_SETTINGS = {
  business_name: 'Grasela Teknik',
  tagline: 'Jasa Service AC & Listrik Profesional',
  description:
    'Grasela Teknik menyediakan jasa perbaikan dan perawatan AC serta instalasi listrik untuk rumah, kantor, dan bisnis Anda. Ditangani oleh teknisi berpengalaman dengan layanan yang cepat dan terpercaya.',
  phone: '0858-6089-5465',
  whatsapp: '085860895465',
  address: 'Jl. Contoh No. 123, Kota, Provinsi',
  operating_hours: 'Senin–Sabtu: 08.00–20.00 | Minggu: Tutup',
  service_area: 'Kota dan sekitarnya',
  hero_title: 'Jasa Service AC & Listrik Terpercaya',
  hero_subtitle:
    'Perawatan, perbaikan, dan instalasi AC serta listrik untuk rumah, kantor, dan bisnis Anda — ditangani teknisi berpengalaman.',
  why_choose_us: [
    'Teknisi berpengalaman dan tersertifikasi',
    'Harga transparan, no hidden cost',
    'Layanan cepat, responsif, dan tepat waktu',
    'Garansi pengerjaan',
    'Covers area kota dan sekitarnya',
  ],
}

const DEFAULT_SERVICES = [
  { name: 'Cuci (Maintenance) AC', description: 'Pembersihan menyeluruh unit AC indoor dan outdoor untuk menjaga kinerja dan kualitas udara. Termasuk pembersihan filter, evaporator, dan kondensor.', price: 'Rp 75.000–100.000 / unit', icon: 'wind', sort_order: 1, visible: true },
  { name: 'Service AC', description: 'Perbaikan AC yang tidak dingin, bocor, atau bermasalah. Diagnosa menyeluruh dan penyelesaian tepat sasaran.', price: 'Rp 100.000–300.000', icon: 'wrench', sort_order: 2, visible: true },
  { name: 'Bongkar & Pasang AC', description: 'Pembongkaran AC dari lokasi lama dan pemasangan ulang di lokasi baru, termasuk pengetesan ulang sistem.', price: 'Rp 250.000–400.000 / unit', icon: 'tool', sort_order: 3, visible: true },
  { name: 'Isi / Tambah Freon', description: 'Pengisian atau penambahan refrigerant (freon) untuk AC yang kurang dingin akibat freon berkurang.', price: 'Rp 150.000–350.000', icon: 'droplet', sort_order: 4, visible: true },
  { name: 'Instalasi Listrik', description: 'Pemasangan instalasi listrik baru untuk rumah, kantor, atau ruangan — termasuk penambahan titik lampu dan stop kontak.', price: 'Rp 150.000–500.000', icon: 'zap', sort_order: 5, visible: true },
  { name: 'Perbaikan Listrik', description: 'Perbaikan masalah listrik seperti konslet, trip MCB, kabel putus, atau stop kontak rusak.', price: 'Rp 100.000–400.000', icon: 'zap', sort_order: 6, visible: true },
  { name: 'Lainnya', description: 'Layanan teknik lainnya termasuk pemasangan lampu, perbaikan saklar, pengecekan panel listrik, dan konsultasi teknis.', price: 'Hubungi untuk penawaran', icon: 'settings', sort_order: 7, visible: true },
]

const DEFAULT_GALLERY = [
  { image_url: 'https://images.pexels.com/photos/6447067/pexels-photo-6447067.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Perbaikan AC Split', sort_order: 1 },
  { image_url: 'https://images.pexels.com/photos/6474190/pexels-photo-6474190.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Cuci AC Outdoor', sort_order: 2 },
  { image_url: 'https://images.pexels.com/photos/8006462/pexels-photo-8006462.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Instalasi Listrik', sort_order: 3 },
  { image_url: 'https://images.pexels.com/photos/8485668/pexels-photo-8485668.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Service AC Central', sort_order: 4 },
  { image_url: 'https://images.pexels.com/photos/5691660/pexels-photo-5691660.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Pemasangan Titik Lampu', sort_order: 5 },
  { image_url: 'https://images.pexels.com/photos/8006460/pexels-photo-8006460.jpeg?auto=compress&cs=tinysrgb&w=800', title: 'Perbaikan Panel Listrik', sort_order: 6 },
]

let seedAttempted = false

/**
 * Create the default site settings document and the starter services/gallery
 * rows if they do not exist yet. Must be called with an admin session (write
 * permissions live on the "admins" team). Safe to call repeatedly.
 */
export async function seedInitialDataIfEmpty(): Promise<void> {
  if (seedAttempted) return
  seedAttempted = true

  try {
    await tables.getRow(DATABASE_ID, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID)
  } catch {
    try {
      await tables.createRow(DATABASE_ID, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID, DEFAULT_SETTINGS)
    } catch {
      // another session may have created it first
    }
  }

  const seedIfEmpty = async (collection: string, rows: Record<string, unknown>[]) => {
    try {
      const res = await tables.listRows(DATABASE_ID, collection, [Query.limit(1)])
      if (res.total > 0) return
      for (const row of rows) {
        await tables.createRow(DATABASE_ID, collection, ID.unique(), row)
      }
    } catch {
      // best effort; admin can add content manually from the panel
    }
  }

  await seedIfEmpty(COLLECTIONS.SERVICES, DEFAULT_SERVICES)
  await seedIfEmpty(COLLECTIONS.GALLERY, DEFAULT_GALLERY)
}
