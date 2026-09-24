import { Link } from 'react-router-dom'
import { MessageCircle, Phone, MapPin, Clock, Mail } from 'lucide-react'
import { useSiteSettings } from '../hooks/useSiteSettings'

export function Footer() {
  const { settings, loading } = useSiteSettings()
  const waNumber = settings?.whatsapp?.replace(/[^0-9]/g, '') || '085860895465'

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center text-white font-heading font-bold text-lg">
                GT
              </div>
              <p className="font-heading font-bold text-white text-lg">
                {loading ? 'Grasela Teknik' : settings?.business_name || 'Grasela Teknik'}
              </p>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {loading ? 'Jasa Service AC & Listrik Profesional' : settings?.tagline || 'Jasa Service AC & Listrik Profesional'}
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Navigasi</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Beranda</Link></li>
              <li><Link to="/layanan" className="hover:text-primary-400 transition-colors">Layanan</Link></li>
              <li><Link to="/galeri" className="hover:text-primary-400 transition-colors">Galeri</Link></li>
              <li><Link to="/kontak" className="hover:text-primary-400 transition-colors">Kontak & Pemesanan</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-white mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              {settings?.phone && (
                <li className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-primary-400 transition-colors">{settings.phone}</a>
                </li>
              )}
              <li className="flex items-start gap-2">
                <MessageCircle className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                <a href={`https://wa.me/62${waNumber.replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                  WhatsApp: {settings?.whatsapp || '0858-6089-5465'}
                </a>
              </li>
              {settings?.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                  <span>{settings.address}</span>
                </li>
              )}
              {settings?.operating_hours && (
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                  <span>{settings.operating_hours}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} {settings?.business_name || 'Grasela Teknik'}. All rights reserved.
          </p>
          <Link to="/admin/login" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors flex items-center gap-1">
            <Mail className="w-3 h-3" />
            Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  )
}
