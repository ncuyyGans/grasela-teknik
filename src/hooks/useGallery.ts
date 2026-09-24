import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { GalleryItem } from '../types'

export function useGallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGallery = useCallback(async () => {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('sort_order', { ascending: true })

    if (!error && data) {
      setGallery(data as GalleryItem[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchGallery()
  }, [fetchGallery])

  return { gallery, loading, refetch: fetchGallery }
}
