import { useState, useEffect, useCallback } from 'react'
import { Query } from 'appwrite'
import { tables, DATABASE_ID, COLLECTIONS, mapGalleryItem } from '../lib/appwrite'
import type { GalleryItem } from '../types'

export function useGallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGallery = useCallback(async () => {
    try {
      const res = await tables.listRows(DATABASE_ID, COLLECTIONS.GALLERY, [
        Query.orderAsc('sort_order'),
        Query.limit(100),
      ])
      setGallery(res.rows.map(mapGalleryItem))
    } catch {
      // keep previous state; backend may be temporarily unavailable
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchGallery()
  }, [fetchGallery])

  return { gallery, loading, refetch: fetchGallery }
}
