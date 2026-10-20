import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { ID, Query, Permission, Role } from '../lib/appwrite'
import type { Models } from '../lib/appwrite'
import { account, tables, teams } from '../lib/appwrite'
import { DATABASE_ID, COLLECTIONS, ADMINS_TEAM_ID } from '../lib/appwrite'
import { seedInitialDataIfEmpty } from '../lib/seed'

type AppwriteUser = Models.User<Models.Preferences>

interface AuthContextType {
  user: AppwriteUser | null
  isAdmin: boolean
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppwriteUser | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkAdmin = async (userId: string): Promise<boolean> => {
    try {
      const res = await tables.listRows(DATABASE_ID, COLLECTIONS.PROFILES, [
        Query.equal('user_id', userId),
        Query.limit(1),
      ])
      const admin = (res.rows[0]?.is_admin as boolean | undefined) ?? false
      setIsAdmin(admin)
      return admin
    } catch {
      setIsAdmin(false)
      return false
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        const me = await account.get()
        setUser(me)
        await checkAdmin(me.$id)
      } catch {
        setUser(null)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      try {
        await account.deleteSession('current')
      } catch {
        // no active session — fine
      }
      await account.createEmailPasswordSession(email, password)
      const me = await account.get()
      setUser(me)
      const admin = await checkAdmin(me.$id)
      if (admin) {
        await seedInitialDataIfEmpty()
      }
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login gagal. Silakan coba lagi.'
      return { error: message }
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password)
      await account.createEmailPasswordSession(email, password)
      const me = await account.get()
      setUser(me)

      // The first registered user becomes admin: if no admin profile exists
      // yet, mark this user admin and make them owner of the "admins" team
      // (the team gates all write permissions on the collections).
      let becomeAdmin = false
      try {
        const admins = await tables.listRows(DATABASE_ID, COLLECTIONS.PROFILES, [
          Query.equal('is_admin', true),
          Query.limit(1),
        ])
        becomeAdmin = admins.total === 0
      } catch {
        becomeAdmin = false
      }

      await tables.createRow(
        DATABASE_ID,
        COLLECTIONS.PROFILES,
        ID.unique(),
        { user_id: me.$id, is_admin: becomeAdmin },
        [Permission.read(Role.user(me.$id)), Permission.update(Role.user(me.$id))],
      )

      if (becomeAdmin) {
        try {
          await teams.create(ADMINS_TEAM_ID, 'Admins')
        } catch {
          // team already exists — membership must then be fixed from the console
        }
        // The first admin also seeds the default site content, since the
        // temp open-write permissions are not needed this way.
        await seedInitialDataIfEmpty()
      }

      setIsAdmin(becomeAdmin)
      return { error: null }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Pendaftaran gagal. Silakan coba lagi.'
      return { error: message }
    }
  }

  const signOut = async () => {
    try {
      await account.deleteSession('current')
    } catch {
      // already signed out
    }
    setUser(null)
    setIsAdmin(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
