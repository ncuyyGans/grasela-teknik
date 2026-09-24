import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Services } from './pages/Services'
import { Gallery } from './pages/Gallery'
import { Contact } from './pages/Contact'
import { AdminLogin } from './pages/admin/AdminLogin'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminSettings } from './pages/admin/AdminSettings'
import { AdminServices } from './pages/admin/AdminServices'
import { AdminGallery } from './pages/admin/AdminGallery'
import { AdminOrders } from './pages/admin/AdminOrders'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/layanan" element={<PublicLayout><Services /></PublicLayout>} />
          <Route path="/galeri" element={<PublicLayout><Gallery /></PublicLayout>} />
          <Route path="/kontak" element={<PublicLayout><Contact /></PublicLayout>} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
          <Route path="/admin/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
          <Route path="/admin/gallery" element={<ProtectedRoute><AdminGallery /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><AdminOrders /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
