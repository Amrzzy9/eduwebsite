import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
export default function Register() {
  const nav = useNavigate(); const [f, setF] = useState({ name:'', email:'', phone:'', pw:'', pw2:'' }); const [err, setErr] = useState(''); const [msg, setMsg] = useState('')
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value })
  const submit = async (e: FormEvent) => { e.preventDefault(); setErr('')
    if (f.pw.length < 8) return setErr('كلمة المرور 8 أحرف على الأقل'); if (f.pw !== f.pw2) return setErr('كلمتا المرور غير متطابقتين')
    const { data, error } = await supabase.auth.signUp({ email: f.email, password: f.pw, options: { data: { full_name: f.name.trim(), phone: f.phone.trim() } } })
    if (error) return setErr(error.message)
    if (data.session) nav('/dashboard', { replace: true }); else setMsg('تم إنشاء الحساب. تحقق من بريدك لتفعيله ثم سجّل الدخول.') }
  return (<main className="max-w-md mx-auto px-4 py-12"><form onSubmit={submit} className="bg-card rounded-3xl p-6 space-y-4">
    <h1 className="text-2xl font-extrabold">إنشاء حساب</h1>
    <input className="input" required placeholder="الاسم الكامل" value={f.name} onChange={set('name')} />
    <input className="input" type="email" required placeholder="البريد الإلكتروني" value={f.email} onChange={set('email')} />
    <input className="input" type="tel" required placeholder="رقم الهاتف" value={f.phone} onChange={set('phone')} />
    <input className="input" type="password" required placeholder="كلمة المرور" value={f.pw} onChange={set('pw')} />
    <input className="input" type="password" required placeholder="تأكيد كلمة المرور" value={f.pw2} onChange={set('pw2')} />
    {err && <p className="text-red-400 text-sm">{err}</p>}{msg && <p className="text-sky text-sm">{msg}</p>}
    <button className="btn btn-p w-full">إنشاء الحساب</button>
    <p className="text-sm text-muted">لديك حساب؟ <Link to="/login" className="text-sky">تسجيل الدخول</Link></p></form></main>)
}
