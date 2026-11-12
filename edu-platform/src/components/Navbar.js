import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, GraduationCap } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import Avatar from './Avatar'
export default function Navbar() {
  const [open, setOpen] = useState(false); const { session, profile } = useAuth(); const nav = useNavigate()
  const links: [string, string][] = [['/', 'الرئيسية'], ['/courses', 'الكورسات'],
    ...(session ? [['/dashboard', 'لوحتي']] as [string,string][] : [['/login', 'تسجيل الدخول'], ['/register', 'إنشاء حساب']] as [string,string][]),
    ...(profile?.role === 'admin' ? [['/admin', 'الإدارة']] as [string,string][] : [])]
  const cls = ({ isActive }: { isActive: boolean }) => isActive ? 'text-sky font-bold' : 'text-white hover:text-sky transition-colors'
  const out = async () => { await supabase.auth.signOut(); setOpen(false); nav('/') }
  return (
    <header className="sticky top-3 z-50 mx-3 md:mx-auto max-w-6xl">
      <nav className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-white text-lg"><GraduationCap className="text-sky" /> تيم الشاطر</Link>
        <div className="hidden md:flex gap-6 items-center">
          {links.map(([to, t]) => <NavLink key={to} to={to} end={to === '/'} className={cls}>{t}</NavLink>)}
          {session && <><button onClick={out} className="text-muted hover:text-sky">خروج</button><Avatar name={profile?.full_name || '?'} url={profile?.avatar_url} size={32} /></>}
        </div>
        <button className="md:hidden text-white" aria-label="القائمة" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </nav>
      {open && <div className="glass md:hidden mt-2 rounded-2xl p-3 flex flex-col">
        {links.map(([to, t]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={(s) => cls(s) + ' px-3 py-3 rounded-xl hover:bg-white/10'}>{t}</NavLink>)}
        {session && <button onClick={out} className="px-3 py-3 text-start text-muted">خروج</button>}
      </div>}
    </header>)
}
