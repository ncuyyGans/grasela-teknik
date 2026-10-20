import { useState, useEffect, useCallback } from 'react'
import { tables, DATABASE_ID, COLLECTIONS, SETTINGS_DOC_ID, mapSettings } from '../lib/appwrite'
import type { SiteSettings } from '../types'

let cachedSettings: SiteSettings | null = null

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(cachedSettings)
  const [loading, setLoading] = useState(!cachedSettings)

  const fetchSettings = useCallback(async () => {
    try {
      const doc = await tables.getRow(DATABASE_ID, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID)
      cachedSettings = mapSettings(doc)
      setSettings(cachedSettings)
    } catch {
      // settings document may not exist yet; keep cached state
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
