import { FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
export default function Login() {
  const nav = useNavigate(); const loc = useLocation(); const from = (loc.state as { from?: string } | null)?.from
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const submit = async (e: FormEvent) => { e.preventDefault(); setBusy(true); setErr('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pw })
    if (error || !data.user) { setErr('البريد أو كلمة المرور غير صحيحة'); setBusy(false); return }
    const { data: p } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle()
    nav(p?.role === 'admin' ? '/admin' : from && from !== '/admin' ? from : '/dashboard', { replace: true }) }
  return (<main className="max-w-md mx-auto px-4 py-12"><form onSubmit={submit} className="glass rounded-3xl p-6 space-y-4">
    <h1 className="text-2xl">تسجيل الدخول</h1>
    <input className="input text-right" dir="rtl" type="email" required placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} />
    <input className="input text-right" dir="rtl" type="password" required placeholder="كلمة المرور" value={pw} onChange={e => setPw(e.target.value)} />
    {err && <p className="text-red-400 text-sm">{err}</p>}
    <button disabled={busy} className="btn btn-p w-full">{busy ? '...' : 'دخول'}</button>
    <Link to="/forgot-password" className="block text-sm text-sky">نسيت كلمة المرور؟</Link>
    <p className="text-sm text-muted">ليس لديك حساب؟ <Link to="/register" className="text-sky">إنشاء حساب</Link></p></form></main>)
}
