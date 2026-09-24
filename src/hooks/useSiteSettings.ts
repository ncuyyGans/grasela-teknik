import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { SiteSettings } from '../types'

let cachedSettings: SiteSettings | null = null

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(cachedSettings)
  const [loading, setLoading] = useState(!cachedSettings)

  const fetchSettings = useCallback(async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()

    if (!error && data) {
      cachedSettings = data as SiteSettings
      setSettings(data as SiteSettings)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!cachedSettings) {
      fetchSettings()
    }
  }, [fetchSettings])

  return { settings, loading, refetch: fetchSettings }
}
