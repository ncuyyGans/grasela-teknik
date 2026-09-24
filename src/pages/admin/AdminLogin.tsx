import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Lock, Mail, LogIn, UserPlus, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function AdminLogin() {
  const { signIn, signUp, session, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (session && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const fn = mode === 'login' ? signIn : signUp
    const { error: err } = await fn(email, password)

    if (err) {
      setError(err)
      setSubmitting(false)
    } else if (mode === 'register') {
      setError(null)
      setSubmitting(false)
      navigate('/admin')
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-100 via-primary-50 to-accent-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center text-white font-heading font-bold text-2xl mx-auto mb-4 shadow-lg">
            GT
          </div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Panel Admin</h1>
          <p className="text-sm text-neutral-500 mt-1">Grasela Teknik — Jasa Service AC & Listrik</p>
        </div>

        <div className="card p-8">
          <div className="flex gap-1 p-1 bg-neutral-100 rounded-lg mb-6">
            <button
              onClick={() => { setMode('login'); setError(null) }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                mode === 'login' ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => { setMode('register'); setError(null) }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                mode === 'register' ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Daftar
            </button>
          </div>

          {mode === 'register' && (
            <div className="mb-4 p-3 rounded-lg bg-primary-50 border border-primary-100 text-xs text-primary-700">
              Akun pertama yang didaftarkan otomatis menjadi admin. Pastikan email Anda benar.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="admin@email.com"
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="password">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-error-50 border border-error-200 text-sm text-error-700">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  Masuk
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Daftar
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-neutral-400 mt-6">
          Hanya untuk akun admin Grasela Teknik.
        </p>
      </div>
    </div>
  )
}
