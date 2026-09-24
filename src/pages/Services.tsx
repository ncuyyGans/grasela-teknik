import { Link } from 'react-router-dom'
import { MessageCircle, ArrowRight } from 'lucide-react'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { useServices } from '../hooks/useServices'
import { getServiceIcon } from '../lib/icons'

export function Services() {
  const { settings } = useSiteSettings()
  const { services, loading } = useServices()
  const visibleServices = services.filter((s) => s.visible)
  const waNumber = settings?.whatsapp?.replace(/[^0-9]/g, '') || '085860895465'
  const waLink = `https://wa.me/62${waNumber.replace(/^0/, '')}`

  return (
    <div className="animate-fade-in pt-16">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-700 to-accent-600 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3">Layanan Kami</h1>
          <p className="text-primary-100 max-w-2xl mx-auto">
            Berbagai layanan service AC dan instalasi listrik profesional dengan harga transparan.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding bg-neutral-50">
        <div className="container-max">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-lg bg-neutral-200 shrink-0" />
                    <div className="flex-1">
                      <div className="h-5 bg-neutral-200 rounded w-1/2 mb-3" />
                      <div className="h-4 bg-neutral-100 rounded w-full mb-2" />
                      <div className="h-4 bg-neutral-100 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleServices.map((service, idx) => {
                const Icon = getServiceIcon(service.icon)
                return (
                  <div
                    key={service.id}
                    className="card p-6 hover:shadow-md transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex gap-4">
                      <div className="w-14 h-14 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <Icon className="w-7 h-7 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold text-neutral-900 mb-1">{service.name}</h3>
                        <p className="text-sm text-neutral-600 leading-relaxed mb-2">{service.description}</p>
                        <p className="text-sm font-semibold text-accent-600">{service.price}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 text-center">
            <div className="card p-8 bg-gradient-to-br from-primary-600 to-accent-600 border-0 max-w-2xl mx-auto">
              <h3 className="font-heading font-bold text-white text-xl mb-2">Butuh Layanan Lain?</h3>
              <p className="text-primary-100 text-sm mb-6">
                Hubungi kami untuk konsultasi atau layanan yang tidak tertera di daftar di atas.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn bg-white text-primary-700 hover:bg-primary-50">
                  <MessageCircle className="w-5 h-5" />
                  Chat WhatsApp
                </a>
                <Link to="/kontak" className="btn bg-white/15 backdrop-blur-sm text-white border border-white/30 hover:bg-white/25">
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
