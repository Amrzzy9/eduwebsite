import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, GraduationCap } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import Avatar from './Avatar'
export default function Navbar() {
  const [open, setOpen] = useState(false); const { session, profile } = useAuth(); const nav = useNavigate()
  const main: [string, string][] = [['/', 'الرئيسية'], ['/courses', 'الكورسات'],
    ...(session ? [['/dashboard', 'لوحتي']] as [string,string][] : []),
    ...(profile?.role === 'admin' ? [['/admin', 'الإدارة']] as [string,string][] : [])]
  const pill = ({ isActive }: { isActive: boolean }) => 'rounded-full px-5 py-1.5 text-sm font-bold transition ' + (isActive ? 'bg-[#a881fb] text-white shadow-[0_0_18px_rgba(168,129,251,.55)]' : 'text-muted hover:text-white')
  const row = ({ isActive }: { isActive: boolean }) => 'px-3 py-3 rounded-xl font-bold ' + (isActive ? 'bg-[#a881fb] text-white' : 'text-white hover:bg-white/10')
  const out = async () => { await supabase.auth.signOut(); setOpen(false); nav('/') }
  return (
    <header className="sticky top-0 z-50 bg-[#0a0f1f]/95 backdrop-blur border-b border-white/5">
      <nav className="max-w-6xl mx-3 md:mx-auto my-3 rounded-2xl border border-white/10 px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid place-items-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#fb923c] to-[#e4572e] text-white"><GraduationCap /></span>
          <span className="leading-tight"><b className="block text-white text-lg font-extrabold">تيم الشاطر</b><small className="block text-[#fb923c] font-bold text-xs">منصة تعليمية متكاملة</small></span>
        </Link>
        <div className="hidden md:flex rounded-full border border-white/10 bg-white/5 p-1 gap-1">
          {main.map(([to, t]) => <NavLink key={to} to={to} end={to === '/'} className={pill}>{t}</NavLink>)}
        </div>
        <div className="hidden md:flex items-center gap-4">
          {session ? <><Avatar name={profile?.full_name || '?'} url={profile?.avatar_url} size={36} /><button onClick={out} className="text-muted hover:text-white font-bold">خروج</button></>
            : <><Link to="/login" className="text-white font-bold px-2">دخول</Link><Link to="/register" className="rounded-lg bg-[#a881fb] hover:bg-[#b99bfc] text-white font-bold px-6 py-2.5 transition">إنشاء حساب</Link></>}
        </div>
        <button className="md:hidden text-white" aria-label="القائمة" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </nav>
      {open && <div className="glass md:hidden mx-3 mb-3 rounded-2xl p-3 flex flex-col">
        {main.map(([to, t]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={row}>{t}</NavLink>)}
        {session ? <button onClick={out} className="px-3 py-3 text-start text-muted">خروج</button>
          : <><NavLink to="/login" onClick={() => setOpen(false)} className={row}>دخول</NavLink><NavLink to="/register" onClick={() => setOpen(false)} className={row}>إنشاء حساب</NavLink></>}
      </div>}
    </header>)
}
