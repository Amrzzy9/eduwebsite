import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// رقم مصري: +20 ثم 10 أو 11 أو 12 أو 15 ثم 8 أرقام
const PHONE_RE = /^\+20(10|11|12|15)\d{8}$/

// يقبل 01012345678 أو 201012345678 أو +201012345678 ويحوّله لـ +20...
const normalizePhone = (v: string) => {
  const d = v.replace(/[\s\-()]/g, '')
  if (/^01\d{9}$/.test(d)) return '+2' + d
  if (/^20\d{10}$/.test(d)) return '+' + d
  return d
}

export default function Register() {
  const nav = useNavigate()
  const [f, setF] = useState({ name: '', email: '', phone: '', pw: '', pw2: '' })
  const [err, setErr] = useState(''); const [msg, setMsg] = useState('')
  const [step, setStep] = useState<'form' | 'code'>('form')
  const [code, setCode] = useState(''); const [busy, setBusy] = useState(false)
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })

  const submit = async (e: FormEvent) => {
    e.preventDefault(); setErr(''); setMsg('')
    const email = f.email.trim(); const phone = normalizePhone(f.phone)
    if (!f.name.trim()) return setErr('اكتب الاسم الكامل')
    if (!EMAIL_RE.test(email)) return setErr('البريد الإلكتروني غير صحيح، لازم يحتوي على @ ونطاق مثل gmail.com')
    if (!PHONE_RE.test(phone)) return setErr('رقم الهاتف لازم يكون مصري بصيغة +201012345678')
    if (f.pw.length < 8) return setErr('كلمة المرور 8 أحرف على الأقل')
    if (f.pw !== f.pw2) return setErr('كلمتا المرور غير متطابقتين')
    setBusy(true)
    const { data, error } = await supabase.auth.signUp({ email, password: f.pw, options: { data: { full_name: f.name.trim(), phone } } })
    setBusy(false)
    if (error) return setErr(error.message)
    if (data.session) return nav('/dashboard', { replace: true })
    setStep('code'); setMsg('أرسلنا كود التأكيد إلى بريدك. اكتبه هنا.')
  }

  const verify = async (e: FormEvent) => {
    e.preventDefault(); setErr(''); setMsg('')
    if (!/^\d{6,8}$/.test(code.trim())) return setErr('الكود من 6 إلى 8 أرقام')
    setBusy(true)
    const { data, error } = await supabase.auth.verifyOtp({ email: f.email.trim(), token: code.trim(), type: 'signup' })
    setBusy(false)
    if (error) return setErr('الكود غير صحيح أو انتهت صلاحيته')
    if (data.session) nav('/dashboard', { replace: true })
  }

  const resend = async () => {
    setErr(''); setMsg('')
    const { error } = await supabase.auth.resend({ type: 'signup', email: f.email.trim() })
    if (error) setErr(error.message); else setMsg('تم إرسال كود جديد إلى بريدك.')
  }

  if (step === 'code') return (
    <main className="max-w-md mx-auto px-4 py-12"><form onSubmit={verify} className="glass rounded-3xl p-6 space-y-4">
      <h1 className="text-2xl">تأكيد البريد</h1>
      <p className="text-muted text-sm">أرسلنا كودًا إلى <b className="text-white" dir="ltr">{f.email.trim()}</b></p>
      <input className="input text-center tracking-[0.4em]" dir="ltr" inputMode="numeric" maxLength={8} placeholder="------"
        value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} />
      {err && <p className="text-red-400 text-sm">{err}</p>}{msg && <p className="text-sky text-sm">{msg}</p>}
      <button className="btn btn-p w-full" disabled={busy}>{busy ? '...' : 'تأكيد'}</button>
      <button type="button" onClick={resend} className="text-sm text-sky">إعادة إرسال الكود</button>
    </form></main>)

  return (<main className="max-w-md mx-auto px-4 py-12"><form onSubmit={submit} className="glass rounded-3xl p-6 space-y-4" noValidate>
    <h1 className="text-2xl">إنشاء حساب</h1>
    <input className="input" required placeholder="الاسم الكامل" value={f.name} onChange={set('name')} />
    <input className="input" dir="ltr" type="email" required placeholder="البريد الإلكتروني (name@gmail.com)" value={f.email} onChange={set('email')} />
    <input className="input" dir="ltr" type="tel" required placeholder="+201012345678" value={f.phone} onChange={set('phone')} />
    <input className="input" type="password" required placeholder="كلمة المرور" value={f.pw} onChange={set('pw')} />
    <input className="input" type="password" required placeholder="تأكيد كلمة المرور" value={f.pw2} onChange={set('pw2')} />
    {err && <p className="text-red-400 text-sm">{err}</p>}{msg && <p className="text-sky text-sm">{msg}</p>}
    <button className="btn btn-p w-full" disabled={busy}>{busy ? '...' : 'إنشاء الحساب'}</button>
    <p className="text-sm text-muted">لديك حساب؟ <Link to="/login" className="text-sky">تسجيل الدخول</Link></p></form></main>)
}
