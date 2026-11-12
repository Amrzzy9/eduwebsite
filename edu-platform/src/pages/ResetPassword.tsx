import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const nav = useNavigate()
  const [ready, setReady] = useState(false)
  const [pw, setPw] = useState(''); const [pw2, setPw2] = useState('')
  const [err, setErr] = useState(''); const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) setReady(true) })
    const { data: sub } = supabase.auth.onAuthStateChange((ev, s) => { if (ev === 'PASSWORD_RECOVERY' || s) setReady(true) })
    return () => sub.subscription.unsubscribe()
  }, [])

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr(''); setMsg('')
    if (pw.length < 8) return setErr('كلمة المرور 8 أحرف على الأقل')
    if (pw !== pw2) return setErr('كلمتا المرور غير متطابقتين')
    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password: pw })
    setBusy(false)
    if (error) return setErr(error.message)
    setMsg('تم تغيير كلمة المرور. جاري تحويلك...')
    setTimeout(() => nav('/dashboard', { replace: true }), 1500)
  }

  if (!ready) return (<main className="max-w-md mx-auto px-4 py-12"><div className="glass rounded-3xl p-6 space-y-4">
    <h1 className="text-2xl">رابط غير صالح</h1>
    <p className="text-muted text-sm">الرابط منتهي أو غير صحيح. اطلب رابط جديد.</p>
    <Link to="/forgot-password" className="btn btn-p inline-block">طلب رابط جديد</Link></div></main>)

  return (<main className="max-w-md mx-auto px-4 py-12"><form onSubmit={submit} className="glass rounded-3xl p-6 space-y-4">
    <h1 className="text-2xl">كلمة مرور جديدة</h1>
    <input className="input text-right" dir="rtl" type="password" required placeholder="كلمة المرور الجديدة" value={pw} onChange={e => setPw(e.target.value)} />
    <input className="input text-right" dir="rtl" type="password" required placeholder="تأكيد كلمة المرور" value={pw2} onChange={e => setPw2(e.target.value)} />
    {err && <p className="text-red-400 text-sm">{err}</p>}{msg && <p className="text-sky text-sm">{msg}</p>}
    <button className="btn btn-p w-full" disabled={busy}>{busy ? '...' : 'حفظ'}</button></form></main>)
}
