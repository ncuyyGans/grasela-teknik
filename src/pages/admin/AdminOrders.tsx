import { useState, useEffect } from 'react'
import { MessageCircle, Trash2, Calendar, MapPin, Phone, StickyNote, X } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import type { Order } from '../../types'

const statusConfig = {
  baru: { label: 'Baru', badge: 'badge-new' },
  diproses: { label: 'Diproses', badge: 'badge-processing' },
  selesai: { label: 'Selesai', badge: 'badge-done' },
} as const

type StatusKey = keyof typeof statusConfig

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | StatusKey>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setOrders(data as Order[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusChange = async (order: Order, status: StatusKey) => {
    await supabase.from('orders').update({ status }).eq('id', order.id)
    setOrders(orders.map((o) => (o.id === order.id ? { ...o, status } : o)))
    if (selectedOrder?.id === order.id) {
      setSelectedOrder({ ...order, status })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus pesanan ini?')) return
    await supabase.from('orders').delete().eq('id', id)
    setOrders(orders.filter((o) => o.id !== id))
    setSelectedOrder(null)
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

  const waLink = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, '').replace(/^0/, '62')
    return `https://wa.me/${cleaned}`
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const counts = {
    all: orders.length,
    baru: orders.filter((o) => o.status === 'baru').length,
    diproses: orders.filter((o) => o.status === 'diproses').length,
    selesai: orders.filter((o) => o.status === 'selesai').length,
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-1">Pesanan Masuk</h1>
        <p className="text-sm text-neutral-500">Kelola pesanan dari formulir pemesanan website.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg mb-6 overflow-x-auto">
        {(['all', 'baru', 'diproses', 'selesai'] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
              filter === key
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {key === 'all' ? 'Semua' : statusConfig[key].label}
            <span className="ml-1.5 text-xs text-neutral-400">{counts[key]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-neutral-200 rounded w-1/4" />
                  <div className="h-4 bg-neutral-100 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-neutral-500">Belum ada pesanan{filter !== 'all' ? ` dengan status "${statusConfig[filter].label}"` : ''}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="card p-4 sm:p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={statusConfig[order.status as StatusKey].badge}>
                      {statusConfig[order.status as StatusKey].label}
                    </span>
                    <span className="text-xs text-neutral-400">{formatDateTime(order.created_at)}</span>
                  </div>
                  <h3 className="font-heading font-semibold text-neutral-900 mb-1">{order.name}</h3>
                  <div className="space-y-1 text-sm text-neutral-600">
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      {order.phone}
                    </p>
                    {order.service_type && (
                      <p className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 text-neutral-400 shrink-0 text-center text-xs font-bold">S</span>
                        {order.service_type}
                      </p>
                    )}
                    {order.preferred_date && (
                      <p className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        {formatDate(order.preferred_date)}
                      </p>
                    )}
                    {order.address && (
                      <p className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                        <span className="truncate">{order.address}</span>
                      </p>
                    )}
                    {order.notes && (
                      <p className="flex items-start gap-2">
                        <StickyNote className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{order.notes}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
                  <a
                    href={waLink(order.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bg-success-500 text-white hover:bg-success-600 px-3 py-2 text-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </a>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value as StatusKey)}
                    className="input text-sm py-1.5 px-2 w-auto"
                  >
                    <option value="baru">Baru</option>
                    <option value="diproses">Diproses</option>
                    <option value="selesai">Selesai</option>
                  </select>
                  <button onClick={() => handleDelete(order.id)} className="btn-ghost p-2 text-error-500 hover:bg-error-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedOrder(null)}>
          <div className="card p-6 w-full max-w-md animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-neutral-900">Detail Pesanan</h2>
              <button onClick={() => setSelectedOrder(null)} className="btn-ghost p-2">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
