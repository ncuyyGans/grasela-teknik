import { Client, Account, TablesDB, Storage, Teams, ID, Query, Permission, Role } from "appwrite"
import type { Models } from "appwrite"
export type { Models }
type AppwriteRow = Models.DefaultRow
import type { SiteSettings, Service, GalleryItem, Order, Profile } from '../types'

const configuredEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT as string | undefined
const configuredProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID as string | undefined

export const isAppwriteConfigured = Boolean(configuredEndpoint && configuredProjectId)

const endpoint = configuredEndpoint || 'https://cloud.appwrite.io/v1'

const client = new Client()
client.setEndpoint(endpoint)
if (configuredProjectId) {
  client.setProject(configuredProjectId)
}

export const account = new Account(client)
export const tables = new TablesDB(client)
export const storage = new Storage(client)
export const teams = new Teams(client)

export { ID, Query, Permission, Role }

export const DATABASE_ID = 'grasela'
export const COLLECTIONS = {
  PROFILES: 'profiles',
  SETTINGS: 'site_settings',
  SERVICES: 'services',
  GALLERY: 'gallery',
  ORDERS: 'orders',
} as const
export const GALLERY_BUCKET = 'gallery'
export const ADMINS_TEAM_ID = 'admins'
export const SETTINGS_DOC_ID = 'main'

// ============================================================
// Document -> model mappers (Appwrite system fields to our types)
// ============================================================

export function mapProfile(doc: AppwriteRow): Profile {
  return {
    id: (doc.user_id as string) ?? '',
    is_admin: Boolean(doc.is_admin),
    created_at: doc.$createdAt,
  }
}

export function mapSettings(doc: AppwriteRow): SiteSettings {
  return {
    id: doc.$id,
    business_name: (doc.business_name as string) ?? '',
    tagline: (doc.tagline as string) ?? '',
    description: (doc.description as string) ?? '',
    phone: (doc.phone as string) ?? '',
    whatsapp: (doc.whatsapp as string) ?? '',
    address: (doc.address as string) ?? '',
    operating_hours: (doc.operating_hours as string) ?? '',
    service_area: (doc.service_area as string) ?? '',
    hero_title: (doc.hero_title as string) ?? '',
    hero_subtitle: (doc.hero_subtitle as string) ?? '',
    why_choose_us: (doc.why_choose_us as string[]) ?? [],
  }
}

export function mapService(doc: AppwriteRow): Service {
  return {
    id: doc.$id,
    name: (doc.name as string) ?? '',
    description: (doc.description as string) ?? '',
    price: (doc.price as string) ?? '',
    icon: (doc.icon as string) ?? 'wrench',
    sort_order: Number(doc.sort_order ?? 0),
    visible: Boolean(doc.visible ?? true),
    created_at: doc.$createdAt,
  }
}

export function mapGalleryItem(doc: AppwriteRow): GalleryItem {
  return {
    id: doc.$id,
    image_url: (doc.image_url as string) ?? '',
    title: (doc.title as string) ?? '',
    sort_order: Number(doc.sort_order ?? 0),
    storage_file_id: (doc.storage_file_id as string) ?? undefined,
    created_at: doc.$createdAt,
  }
}

export function mapOrder(doc: AppwriteRow): Order {
  const status = (doc.status as string) ?? 'baru'
  return {
    id: doc.$id,
    name: (doc.name as string) ?? '',
    phone: (doc.phone as string) ?? '',
    address: (doc.address as string) ?? '',
    service_type: (doc.service_type as string) ?? '',
    preferred_date: (doc.preferred_date as string) ?? '',
    notes: (doc.notes as string) ?? '',
    status: status === 'diproses' || status === 'selesai' ? status : 'baru',
    created_at: doc.$createdAt,
  }
}

/** Public view/download URL for a file in the gallery bucket. */
export function galleryFileUrl(fileId: string): string {
  return storage.getFileView(GALLERY_BUCKET, fileId)
}
