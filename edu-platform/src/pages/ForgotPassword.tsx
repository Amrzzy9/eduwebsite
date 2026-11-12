import { FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [err, setErr] = useState(''); const [msg, setMsg] = useState(''); const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr(''); setMsg('')
    const em = email.trim()
    if (!EMAIL_RE.test(em)) return setErr('البريد الإلكتروني غير صحيح')
    setBusy(true)
    const { error } = await supabase.auth.resetPasswordForEmail(em, { redirectTo: window.location.origin + '/reset-password' })
    setBusy(false)
    if (error) return setErr(error.message)
    setMsg('لو البريد مسجّل عندنا، هيوصلك رابط لتعيين كلمة مرور جديدة. شوف مجلد Spam كمان.')
  }

  return (<main className="max-w-md mx-auto px-4 py-12"><form onSubmit={submit} className="glass rounded-3xl p-6 space-y-4" noValidate>
    <h1 className="text-2xl">نسيت كلمة المرور</h1>
    <p className="text-muted text-sm">اكتب بريدك الإلكتروني وهنبعتلك رابط لتعيين كلمة مرور جديدة.</p>
    <input className="input text-right" dir="rtl" type="email" required placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} />
    {err && <p className="text-red-400 text-sm">{err}</p>}{msg && <p className="text-sky text-sm">{msg}</p>}
    <button className="btn btn-p w-full" disabled={busy}>{busy ? '...' : 'إرسال الرابط'}</button>
    <p className="text-sm text-muted"><Link to="/login" className="text-sky">الرجوع لتسجيل الدخول</Link></p></form></main>)
}
