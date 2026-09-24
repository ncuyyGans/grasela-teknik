import { useState, useEffect } from 'react'
import { Save, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import type { SiteSettings } from '../../types'

export function AdminSettings() {
  const { settings, refetch } = useSiteSettings()
  const [form, setForm] = useState<SiteSettings | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newReason, setNewReason] = useState('')

  useEffect(() => {
    if (settings) {
      setForm(settings)
    }
  }, [settings])

  const handleChange = (field: keyof SiteSettings, value: string) => {
    if (!form) return
    setForm({ ...form, [field]: value })
  }

  const handleAddReason = () => {
    if (!form || !newReason.trim()) return
    setForm({ ...form, why_choose_us: [...form.why_choose_us, newReason.trim()] })
    setNewReason('')
  }

  const handleRemoveReason = (idx: number) => {
    if (!form) return
    setForm({ ...form, why_choose_us: form.why_choose_us.filter((_, i) => i !== idx) })
  }

  const handleSave = async () => {
    if (!form) return
    setSaving(true)
    setError(null)
    setSaved(false)

    const { error: updateError } = await supabase
      .from('site_settings')
      .update({
        business_name: form.business_name,
        tagline: form.tagline,
        description: form.description,
        phone: form.phone,
        whatsapp: form.whatsapp,
        address: form.address,
        operating_hours: form.operating_hours,
        service_area: form.service_area,
        hero_title: form.hero_title,
        hero_subtitle: form.hero_subtitle,
        why_choose_us: form.why_choose_us,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 1)

    if (updateError) {
      setError('Gagal menyimpan perubahan. Silakan coba lagi.')
    } else {
      setSaved(true)
      refetch()
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  if (!form) {
    return (
      <AdminLayout>
        <div className="card p-8 animate-pulse">
          <div className="h-6 bg-neutral-200 rounded w-1/4 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-neutral-100 rounded" />
            ))}
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-neutral-900 mb-1">Informasi Umum</h1>
        <p className="text-sm text-neutral-500">Ubah informasi yang tampil di website Anda.</p>
      </div>

      <div className="space-y-6">
        {/* Business Info */}
        <div className="card p-6">
          <h2 className="font-heading font-semibold text-neutral-900 mb-4">Identitas Usaha</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Nama Usaha</label>
              <input className="input" value={form.business_name} onChange={(e) => handleChange('business_name', e.target.value)} />
            </div>
            <div>
              <label className="label">Tagline</label>
              <input className="input" value={form.tagline} onChange={(e) => handleChange('tagline', e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Deskripsi</label>
              <textarea className="input resize-none" rows={3} value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="card p-6">
          <h2 className="font-heading font-semibold text-neutral-900 mb-4">Kontak & Lokasi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Nomor Telepon</label>
              <input className="input" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="0858-6089-5465" />
            </div>
            <div>
              <label className="label">Nomor WhatsApp</label>
              <input className="input" value={form.whatsapp} onChange={(e) => handleChange('whatsapp', e.target.value)} placeholder="085860895465" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Alamat</label>
              <input className="input" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
            </div>
            <div>
              <label className="label">Jam Operasional</label>
              <input className="input" value={form.operating_hours} onChange={(e) => handleChange('operating_hours', e.target.value)} />
            </div>
            <div>
              <label className="label">Area Layanan</label>
              <input className="input" value={form.service_area} onChange={(e) => handleChange('service_area', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Home Page Content */}
        <div className="card p-6">
          <h2 className="font-heading font-semibold text-neutral-900 mb-4">Teks Beranda</h2>
          <div className="space-y-4">
            <div>
              <label className="label">Judul Utama (Hero)</label>
              <input className="input" value={form.hero_title} onChange={(e) => handleChange('hero_title', e.target.value)} />
            </div>
            <div>
              <label className="label">Sub-judul (Hero)</label>
              <textarea className="input resize-none" rows={2} value={form.hero_subtitle} onChange={(e) => handleChange('hero_subtitle', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="card p-6">
          <h2 className="font-heading font-semibold text-neutral-900 mb-4">Alasan Memilih Kami</h2>
          <div className="space-y-2 mb-4">
            {form.why_choose_us.map((reason, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input className="input flex-1" value={reason} onChange={(e) => {
                  const updated = [...form.why_choose_us]
                  updated[idx] = e.target.value
                  setForm({ ...form, why_choose_us: updated })
                }} />
                <button onClick={() => handleRemoveReason(idx)} className="btn-ghost p-2.5 shrink-0 text-error-500 hover:bg-error-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="input flex-1"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddReason())}
              placeholder="Tambah alasan baru..."
            />
            <button onClick={handleAddReason} className="btn-secondary shrink-0">
              <Plus className="w-4 h-4" />
              Tambah
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="sticky bottom-4 card p-4 flex items-center justify-between">
          {error ? (
            <div className="flex items-center gap-2 text-sm text-error-600">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          ) : saved ? (
            <div className="flex items-center gap-2 text-sm text-success-600">
              <CheckCircle2 className="w-4 h-4" />
              Perubahan berhasil disimpan!
            </div>
          ) : (
            <p className="text-sm text-neutral-500">Klik simpan untuk menerapkan perubahan.</p>
          )}
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
