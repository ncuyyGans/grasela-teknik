import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone, MessageCircle } from 'lucide-react'
import { useSiteSettings } from '../hooks/useSiteSettings'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { settings, loading } = useSiteSettings()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const navLinks = [
    { to: '/', label: 'Beranda' },
    { to: '/layanan', label: 'Layanan' },
    { to: '/galeri', label: 'Galeri' },
    { to: '/kontak', label: 'Kontak' },
  ]

  const waNumber = settings?.whatsapp?.replace(/[^0-9]/g, '') || '085860895465'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center text-white font-heading font-bold text-lg shadow-sm group-hover:shadow-md transition-shadow">
              GT
            </div>
            <div className="hidden sm:block">
              <p className="font-heading font-bold text-neutral-900 text-base leading-tight">
                {loading ? 'Grasela Teknik' : settings?.business_name || 'Grasela Teknik'}
              </p>
              <p className="text-xs text-neutral-500 leading-tight">
                {loading ? 'Service AC & Listrik' : settings?.tagline || 'Service AC & Listrik'}
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/62${waNumber.replace(/^0/, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 btn-accent text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 animate-fade-in">
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={`https://wa.me/62${waNumber.replace(/^0/, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 btn-accent justify-center"
              >
                <MessageCircle className="w-4 h-4" />
                Hubungi WhatsApp
              </a>
              {settings?.phone && (
                <a href={`tel:${settings.phone}`} className="mt-1 btn-secondary justify-center">
                  <Phone className="w-4 h-4" />
                  {settings.phone}
                </a>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
