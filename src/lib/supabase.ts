import { createClient } from '@supabase/supabase-js'

const configuredUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const configuredAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(configuredUrl && configuredAnonKey)

// Keep the public site renderable when a deployment is missing Vite env vars.
// Data-backed features still require the real values in the hosting environment.
const supabaseUrl = configuredUrl || 'https://missing-config.supabase.co'
const supabaseAnonKey = configuredAnonKey || 'missing-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

export const GALLERY_BUCKET = 'gallery'
