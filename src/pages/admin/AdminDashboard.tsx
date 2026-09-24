import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Wrench, Image, ClipboardList, Settings, ArrowRight, Clock } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'

interface DashboardStats {
  servicesCount: number
  galleryCount: number
  ordersCount: number
  newOrdersCount: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    servicesCount: 0,
    galleryCount: 0,
    ordersCount: 0,
    newOrdersCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const [services, gallery, orders, newOrders] = await Promise.all([
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('gallery').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'baru'),
      ])

      setStats({
        servicesCount: services.count ?? 0,
        galleryCount: gallery.count ?? 0,
        ordersCount: orders.count ?? 0,
        newOrdersCount: newOrders.count ?? 0,
      })
      setLoading(false)
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Total Layanan', value: stats.servicesCount, icon: Wrench, to: '/admin/services', color: 'primary' },
    { label: 'Foto Galeri', value: stats.galleryCount, icon: Image, to: '/admin/gallery', color: 'accent' },
    { label: 'Total Pesanan', value: stats.ordersCount, icon: ClipboardList, to: '/admin/orders', color: 'neutral' },
    { label: 'Pesanan Baru', value: stats.newOrdersCount, icon: Clock, to: '/admin/orders', color: 'warning' },
  ]

  const colorMap: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
    neutral: 'bg-neutral-100 text-neutral-600',
    warning: 'bg-warning-50 text-warning-600',
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-1">Dashboard</h1>
        <p className="text-sm text-neutral-500">Ringkasan aktivitas website Grasela Teknik.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="w-10 h-10 rounded-lg bg-neutral-200 mb-3" />
              <div className="h-8 bg-neutral-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-neutral-100 rounded w-3/4" />
            </div>
          ))
        ) : (
          cards.map((card) => {
            const Icon = card.icon
            return (
              <Link key={card.label} to={card.to} className="card p-5 hover:shadow-md transition-shadow group">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorMap[card.color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-2xl font-heading font-bold text-neutral-900">{card.value}</p>
                <p className="text-sm text-neutral-500">{card.label}</p>
              </Link>
            )
          })
        )}
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="font-heading font-semibold text-neutral-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link to="/admin/settings" className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors group">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-neutral-700">Ubah Informasi Umum</span>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
          </Link>
          <Link to="/admin/services" className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors group">
            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-neutral-700">Kelola Layanan</span>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
          </Link>
          <Link to="/admin/gallery" className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors group">
            <div className="flex items-center gap-3">
              <Image className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-neutral-700">Unggah Foto Galeri</span>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
          </Link>
          <Link to="/admin/orders" className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50 transition-colors group">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-medium text-neutral-700">Lihat Pesanan Masuk</span>
            </div>
            <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
