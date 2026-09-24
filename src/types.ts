export interface SiteSettings {
  id: number
  business_name: string
  tagline: string
  description: string
  phone: string
  whatsapp: string
  address: string
  operating_hours: string
  service_area: string
  hero_title: string
  hero_subtitle: string
  why_choose_us: string[]
}

export interface Service {
  id: string
  name: string
  description: string
  price: string
  icon: string
  sort_order: number
  visible: boolean
  created_at: string
}

export interface GalleryItem {
  id: string
  image_url: string
  title: string
  sort_order: number
  created_at: string
}

export interface Order {
  id: string
  name: string
  phone: string
  address: string
  service_type: string
  preferred_date: string
  notes: string
  status: 'baru' | 'diproses' | 'selesai'
  created_at: string
}

export interface Profile {
  id: string
  is_admin: boolean
  created_at: string
}
