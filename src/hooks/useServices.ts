import { useState, useEffect, useCallback } from 'react'
import { Query } from 'appwrite'
import { tables, DATABASE_ID, COLLECTIONS, mapService } from '../lib/appwrite'
import type { Service } from '../types'

export function useServices() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  const fetchServices = useCallback(async () => {
    try {
      const res = await tables.listRows(DATABASE_ID, COLLECTIONS.SERVICES, [
        Query.orderAsc('sort_order'),
        Query.limit(100),
      ])
      setServices(res.rows.map(mapService))
    } catch {
      // keep previous state; backend may be temporarily unavailable
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  return { services, loading, refetch: fetchServices }
}
