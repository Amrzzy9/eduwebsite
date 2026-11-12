import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
export type Profile = { full_name: string; phone: string|null; avatar_url: string|null; role: string }
const Ctx = createContext<{ session: Session|null; profile: Profile|null; loading: boolean }>({ session:null, profile:null, loading:true })
export const useAuth = () => useContext(Ctx)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session|null>(null); const [profile, setProfile] = useState<Profile|null>(null); const [loading, setLoading] = useState(true)
  useEffect(() => {
    const apply = async (s: Session|null) => {
      setSession(s)
      if (!s) { setProfile(null); setLoading(false); return }
      const { data } = await supabase.from('profiles').select('full_name,phone,avatar_url,role').eq('id', s.user.id).maybeSingle()
      setProfile(data as Profile|null); setLoading(false)
    }
    supabase.auth.getSession().then(({ data }) => apply(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { void apply(s) })
    return () => sub.subscription.unsubscribe()
  }, [])
  return <Ctx.Provider value={{ session, profile, loading }}>{children}</Ctx.Provider>
}
// Role comes from the profiles table (protected by RLS), never from the browser.
export function Protected({ children, admin }: { children: ReactNode; admin?: boolean }) {
  const { session, profile, loading } = useAuth(); const loc = useLocation()
  if (loading) return <div className="skeleton m-6 h-40" />
  if (!session) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  if (admin && profile?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
