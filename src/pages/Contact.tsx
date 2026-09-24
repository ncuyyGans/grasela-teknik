import { useState } from 'react'
import { Phone, MessageCircle, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { useServices } from '../hooks/useServices'
import { supabase } from '../lib/supabase'

export function Contact() {
  const { settings } = useSiteSettings()
  const { services } = useServices()
  const visibleServices = services.filter((s) => s.visible)
  const waNumber = settings?.whatsapp?.replace(/[^0-9]/g, '') || '085860895465'
  const waLink = `https://wa.me/62${waNumber.replace(/^0/, '')}`

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    service_type: '',
    preferred_date: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const { error: insertError } = await supabase.from('orders').insert({
      name: form.name,
      phone: form.phone,
      address: form.address,
      service_type: form.service_type,
      preferred_date: form.preferred_date,
      notes: form.notes,
    })

    if (insertError) {
      setError('Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi atau hubungi kami via WhatsApp.')
      setSubmitting(false)
    } else {
      setSubmitted(true)
      setSubmitting(false)
      setForm({ name: '', phone: '', address: '', service_type: '', preferred_date: '', notes: '' })
    }
  }

  return (
    <div className="animate-fade-in pt-16">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-700 to-accent-600 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3">Kontak & Pemesanan</h1>
          <p className="text-primary-100 max-w-2xl mx-auto">
            Hubungi kami untuk pemesanan atau konsultasi seputar layanan AC dan listrik.
          </p>
        </div>
      </section>

      <section className="section-padding bg-neutral-50">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-heading font-bold text-neutral-900 mb-6">Informasi Kontak</h2>
              <div className="space-y-4">
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="card p-5 flex items-start gap-4 hover:shadow-md transition-shadow group">
                    <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center shrink-0 group-hover:bg-primary-100 transition-colors">
                      <Phone className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 mb-0.5">Telepon</p>
                      <p className="font-semibold text-neutral-900">{settings.phone}</p>
                    </div>
                  </a>
                )}

                <a href={waLink} target="_blank" rel="noopener noreferrer" className="card p-5 flex items-start gap-4 hover:shadow-md transition-shadow group">
                  <div className="w-12 h-12 rounded-lg bg-success-50 flex items-center justify-center shrink-0 group-hover:bg-success-100 transition-colors">
                    <MessageCircle className="w-6 h-6 text-success-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500 mb-0.5">WhatsApp</p>
                    <p className="font-semibold text-neutral-900">{settings?.whatsapp || '0858-6089-5465'}</p>
                  </div>
                </a>

                {settings?.address && (
                  <div className="card p-5 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-accent-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-accent-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 mb-0.5">Alamat</p>
                      <p className="font-semibold text-neutral-900">{settings.address}</p>
                    </div>
                  </div>
                )}

                {settings?.operating_hours && (
                  <div className="card p-5 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-warning-50 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-warning-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 mb-0.5">Jam Operasional</p>
                      <p className="font-semibold text-neutral-900">{settings.operating_hours}</p>
                    </div>
                  </div>
                )}

                {settings?.service_area && (
                  <div className="card p-5 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500 mb-0.5">Area Layanan</p>
                      <p className="font-semibold text-neutral-900">{settings.service_area}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Form */}
            <div>
              <h2 className="text-xl font-heading font-bold text-neutral-900 mb-6">Formulir Pemesanan</h2>

              {submitted ? (
                <div className="card p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-success-600" />
                  </div>
                  <h3 className="font-heading font-bold text-neutral-900 text-lg mb-2">Pesanan Terkirim!</h3>
                  <p className="text-sm text-neutral-600 mb-6">
                    Terima kasih telah memesan. Kami akan menghubungi Anda segera untuk konfirmasi.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn-secondary">
                    Kirim Pesanan Lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                  <div>
                    <label className="label" htmlFor="name">Nama Lengkap *</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Nama Anda"
                    />
                  </div>

                  <div>
                    <label className="label" htmlFor="phone">Nomor HP *</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={handleChange}
                      className="input"
                      placeholder="08xx-xxxx-xxxx"
                    />
                  </div>

                  <div>
                    <label className="label" htmlFor="address">Alamat</label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={form.address}
                      onChange={handleChange}
                      className="input"
                      placeholder="Alamat lokasi service"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label" htmlFor="service_type">Jenis Layanan</label>
                      <select
                        id="service_type"
                        name="service_type"
                        value={form.service_type}
                        onChange={handleChange}
                        className="input"
                      >
                        <option value="">Pilih layanan</option>
                        {visibleServices.map((s) => (
                          <option key={s.id} value={s.name}>{s.name}</option>
                        ))}
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="label" htmlFor="preferred_date">Tanggal Preferensi</label>
                      <input
                        id="preferred_date"
                        name="preferred_date"
                        type="date"
                        value={form.preferred_date}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="notes">Catatan</label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={form.notes}
                      onChange={handleChange}
                      className="input resize-none"
                      placeholder="Detail tambahan tentang kebutuhan Anda"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-error-50 border border-error-200 text-sm text-error-700">
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    {submitting ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Kirim Pesanan
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
