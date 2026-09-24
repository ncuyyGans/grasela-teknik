import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Service } from '../types'

export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  const fetchServices = useCallback(async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('sort_order', { ascending: true })

    if (!error && data) {
      setServices(data as Service[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  return { services, loading, refetch: fetchServices }
}
