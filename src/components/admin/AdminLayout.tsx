import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Settings, Wrench, Image, ClipboardList,
  LogOut, Menu, X, ExternalLink
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/settings', label: 'Informasi Umum', icon: Settings },
  { to: '/admin/services', label: 'Layanan', icon: Wrench },
  { to: '/admin/gallery', label: 'Galeri', icon: Image },
  { to: '/admin/orders', label: 'Pesanan', icon: ClipboardList },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-neutral-900 text-neutral-300 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center text-white font-heading font-bold text-sm">
              GT
            </div>
            <div>
              <p className="font-heading font-bold text-white text-sm">Grasela Teknik</p>
              <p className="text-xs text-neutral-500">Panel Admin</p>
            </div>
          </div>
          <button className="lg:hidden text-neutral-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-primary-600 text-white'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-neutral-800 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            Lihat Website
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-error-400 hover:text-error-300 hover:bg-error-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-neutral-200 px-4 h-14 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-neutral-600">
            <Menu className="w-5 h-5" />
          </button>
          <p className="font-heading font-bold text-neutral-900 text-sm">Panel Admin</p>
        </div>

        <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
