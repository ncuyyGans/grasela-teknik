import { useState } from 'react'
import { Plus, Trash2, Pencil, X, GripVertical, Eye, EyeOff, Save } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { useServices } from '../../hooks/useServices'
import { supabase } from '../../lib/supabase'
import { getServiceIcon, availableIcons } from '../../lib/icons'
import type { Service } from '../../types'

export function AdminServices() {
  const { services, loading, refetch } = useServices()
  const [editing, setEditing] = useState<Service | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const blankService: Service = {
    id: '',
    name: '',
    description: '',
    price: '',
    icon: 'wrench',
    sort_order: services.length + 1,
    visible: true,
    created_at: '',
  }

  const handleSave = async (svc: Service) => {
    setSaving(true)
    setError(null)

    if (svc.id) {
      const { error: updateError } = await supabase
        .from('services')
        .update({
          name: svc.name,
          description: svc.description,
          price: svc.price,
          icon: svc.icon,
          sort_order: svc.sort_order,
          visible: svc.visible,
        })
        .eq('id', svc.id)
      if (updateError) setError('Gagal menyimpan perubahan.')
    } else {
      const { error: insertError } = await supabase
        .from('services')
        .insert({
          name: svc.name,
          description: svc.description,
          price: svc.price,
          icon: svc.icon,
          sort_order: svc.sort_order,
          visible: svc.visible,
        })
      if (insertError) setError('Gagal menambah layanan.')
    }

    setSaving(false)
    if (!error) {
      setShowForm(false)
      setEditing(null)
      refetch()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus layanan ini?')) return
    await supabase.from('services').delete().eq('id', id)
    refetch()
  }

  const toggleVisible = async (svc: Service) => {
    await supabase.from('services').update({ visible: !svc.visible }).eq('id', svc.id)
    refetch()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-1">Layanan</h1>
          <p className="text-sm text-neutral-500">Kelola daftar layanan dan harganya.</p>
        </div>
        <button
          onClick={() => { setEditing(blankService); setShowForm(true) }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Tambah Layanan
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-neutral-200 rounded w-1/3" />
                  <div className="h-4 bg-neutral-100 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((svc) => {
            const Icon = getServiceIcon(svc.icon)
            return (
              <div key={svc.id} className="card p-4 flex items-center gap-4 group">
                <div className="hidden sm:flex text-neutral-300">
                  <GripVertical className="w-5 h-5" />
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${svc.visible ? 'bg-primary-50' : 'bg-neutral-100'}`}>
                  <Icon className={`w-5 h-5 ${svc.visible ? 'text-primary-600' : 'text-neutral-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-semibold text-neutral-900 truncate">{svc.name}</h3>
                    {!svc.visible && (
                      <span className="badge bg-neutral-100 text-neutral-500">Tersembunyi</span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 truncate">{svc.description || 'Tanpa deskripsi'}</p>
                  <p className="text-sm font-semibold text-accent-600 mt-0.5">{svc.price}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => toggleVisible(svc)} className="btn-ghost p-2" title={svc.visible ? 'Sembunyikan' : 'Tampilkan'}>
                    {svc.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setEditing(svc); setShowForm(true) }} className="btn-ghost p-2" title="Ubah">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(svc.id)} className="btn-ghost p-2 text-error-500 hover:bg-error-50" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )
          })}
          {services.length === 0 && (
            <div className="card p-12 text-center">
              <p className="text-neutral-500">Belum ada layanan. Klik "Tambah Layanan" untuk memulai.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      {showForm && editing && (
        <ServiceForm
          service={editing}
          saving={saving}
          error={error}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); setError(null) }}
        />
      )}
    </AdminLayout>
  )
}

function ServiceForm({
  service, saving, error, onSave, onClose,
}: {
  service: Service
  saving: boolean
  error: string | null
  onSave: (svc: Service) => void
  onClose: () => void
}) {
  const [form, setForm] = useState<Service>(service)

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="card p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-bold text-neutral-900 text-lg">
            {service.id ? 'Ubah Layanan' : 'Tambah Layanan'}
          </h2>
          <button onClick={onClose} className="btn-ghost p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">Nama Layanan</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Cuci AC" />
          </div>
          <div>
            <label className="label">Deskripsi</label>
            <textarea className="input resize-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="label">Harga / Kisaran Harga</label>
            <input className="input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Rp 100.000–300.000" />
          </div>
          <div>
            <label className="label">Ikon</label>
            <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
              {availableIcons.map((ic) => {
                const Icon = getServiceIcon(ic.name)
                return (
                  <button
                    key={ic.name}
                    type="button"
                    onClick={() => setForm({ ...form, icon: ic.name })}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      form.icon === ic.name
                        ? 'bg-primary-600 text-white'
                        : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                    }`}
                    title={ic.label}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                )
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Urutan</label>
              <input type="number" className="input" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            </div>
            <div>
              <label className="label">Tampil?</label>
              <div className="flex items-center h-[46px]">
                <label className="flex items-center gap-2 cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, visible: !form.visible })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${form.visible ? 'bg-primary-600' : 'bg-neutral-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.visible ? 'translate-x-6' : ''}`} />
                  </button>
                  <span className="text-sm text-neutral-600">{form.visible ? 'Tampil' : 'Tersembunyi'}</span>
                </label>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-error-50 border border-error-200 text-sm text-error-700">{error}</div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Batal</button>
          <button onClick={() => onSave(form)} disabled={saving || !form.name} className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Simpan</>}
          </button>
        </div>
      </div>
    </div>
  )
}
