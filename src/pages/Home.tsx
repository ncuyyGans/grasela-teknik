import { Link } from 'react-router-dom'
import {
  MessageCircle, Phone, MapPin, Clock, CheckCircle2, ArrowRight,
  Star, ShieldCheck, Clock3, Wallet, Award, type LucideIcon
} from 'lucide-react'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { useServices } from '../hooks/useServices'
import { getServiceIcon } from '../lib/icons'

const reasonIcons: Record<string, LucideIcon> = {
  'Teknisi berpengalaman dan tersertifikasi': Award,
  'Harga transparan, no hidden cost': Wallet,
  'Layanan cepat, responsif, dan tepat waktu': Clock3,
  'Garansi pengerjaan': ShieldCheck,
}

export function Home() {
  const { settings, loading: settingsLoading } = useSiteSettings()
  const { services, loading: servicesLoading } = useServices()
  const visibleServices = services.filter((s) => s.visible)
  const waNumber = settings?.whatsapp?.replace(/[^0-9]/g, '') || '085860895465'
  const waLink = `https://wa.me/62${waNumber.replace(/^0/, '')}`

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center text-white max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-sm font-medium mb-6 animate-slide-up">
              <span className="w-2 h-2 rounded-full bg-accent-300 animate-pulse" />
              {settingsLoading ? 'Service AC & Listrik' : settings?.tagline || 'Jasa Service AC & Listrik Profesional'}
            </div>
            <h1 className="text-3xl sm:text-5xl font-heading font-bold leading-tight mb-4 animate-slide-up">
              {settingsLoading ? 'Jasa Service AC & Listrik Terpercaya' : settings?.hero_title || 'Jasa Service AC & Listrik Terpercaya'}
            </h1>
            <p className="text-base sm:text-lg text-primary-100 leading-relaxed mb-8 animate-slide-up">
              {settingsLoading
                ? 'Perawatan, perbaikan, dan instalasi AC serta listrik untuk rumah, kantor, dan bisnis Anda — ditangani teknisi berpengalaman.'
                : settings?.hero_subtitle || 'Perawatan, perbaikan, dan instalasi AC serta listrik untuk rumah, kantor, dan bisnis Anda.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up">
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn bg-white text-primary-700 hover:bg-primary-50 shadow-lg px-6 py-3 text-base">
                <MessageCircle className="w-5 h-5" />
                Chat WhatsApp
              </a>
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="btn bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white/25 px-6 py-3 text-base">
                  <Phone className="w-5 h-5" />
                  {settings.phone}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="relative">
          <svg className="absolute bottom-0 w-full h-12 sm:h-16 text-neutral-50" viewBox="0 0 1440 80" preserveAspectRatio="none" fill="currentColor">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* Service Highlights */}
      <section className="section-padding bg-neutral-50">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">Layanan Kami</p>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-900">Sorotan Layanan</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="w-12 h-12 rounded-lg bg-neutral-200 mb-4" />
                  <div className="h-5 bg-neutral-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-neutral-100 rounded w-full mb-2" />
                  <div className="h-4 bg-neutral-100 rounded w-2/3" />
                </div>
              ))
            ) : (
              visibleServices.slice(0, 6).map((service) => {
                const Icon = getServiceIcon(service.icon)
                return (
                  <div key={service.id} className="card p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                    <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center mb-4 group-hover:bg-primary-100 transition-colors">
                      <Icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <h3 className="font-heading font-semibold text-neutral-900 mb-2">{service.name}</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-3 line-clamp-2">{service.description}</p>
                    <p className="text-sm font-semibold text-accent-600">{service.price}</p>
                  </div>
                )
              })
            )}
          </div>

          <div className="text-center mt-10">
            <Link to="/layanan" className="btn-secondary">
              Lihat Semua Layanan
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center mb-12">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">Mengapa Kami</p>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-neutral-900">Mengapa Memilih Grasela Teknik?</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(settings?.why_choose_us || []).map((reason, i) => {
              const Icon = reasonIcons[reason] || CheckCircle2
              return (
                <div key={i} className="text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <p className="text-sm font-medium text-neutral-700 leading-relaxed">{reason}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Service Area & Contact Info */}
      <section className="section-padding bg-neutral-50">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-neutral-900 mb-1">Area Layanan</h3>
                  <p className="text-sm text-neutral-600">{settings?.service_area || 'Kota dan sekitarnya'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent-50 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-accent-600" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-neutral-900 mb-1">Jam Operasional</h3>
                  <p className="text-sm text-neutral-600">{settings?.operating_hours || 'Senin–Sabtu: 08.00–20.00 | Minggu: Tutup'}</p>
                </div>
              </div>
            </div>

            <div className="card p-8 bg-gradient-to-br from-primary-600 to-accent-600 border-0">
              <h3 className="font-heading font-bold text-white text-xl mb-2">Siap Melayani Kebutuhan Anda</h3>
              <p className="text-primary-100 text-sm mb-6 leading-relaxed">
                Hubungi kami sekarang untuk konsultasi gratis atau langsung pesan layanan melalui WhatsApp.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn bg-white text-primary-700 hover:bg-primary-50 flex-1 justify-center">
                  <MessageCircle className="w-5 h-5" />
                  Chat WhatsApp
                </a>
                <Link to="/kontak" className="btn bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white/25 flex-1 justify-center">
                  Formulir Pemesanan
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
