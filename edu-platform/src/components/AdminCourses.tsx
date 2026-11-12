import { FormEvent, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type C = { id: string; title: string; description: string | null; thumbnail_url: string | null; price: number; is_published: boolean }
type L = { id: string; title: string; video_url: string | null; position: number; is_free: boolean }
const empty = { id: '', title: '', description: '', price: '0' }

function Lessons({ course, onBack }: { course: C; onBack: () => void }) {
  const [ls, setLs] = useState<L[]>([]); const [title, setTitle] = useState(''); const [url, setUrl] = useState('')
  const [free, setFree] = useState(false); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const load = async () => {
    const { data, error } = await supabase.from('lessons').select('id,title,video_url,position,is_free').eq('course_id', course.id).order('position')
    if (error) setErr(error.message); else setLs((data ?? []) as L[])
  }
  useEffect(() => { load() }, [course.id])
  const add = async (e: FormEvent) => {
    e.preventDefault(); setErr('')
    if (!title.trim() || !url.trim()) return setErr('اكتب عنوان الدرس ورابط الفيديو')
    setBusy(true)
    const pos = ls.length ? Math.max(...ls.map(l => l.position)) + 1 : 1
    const { error } = await supabase.from('lessons').insert({ course_id: course.id, title: title.trim(), video_url: url.trim(), position: pos, is_free: free })
    setBusy(false)
    if (error) return setErr(error.message)
    setTitle(''); setUrl(''); setFree(false); load()
  }
  const del = async (id: string) => {
    if (!confirm('حذف الدرس؟')) return
    const { error } = await supabase.from('lessons').delete().eq('id', id)
    if (error) setErr(error.message); else load()
  }
  const toggleFree = async (l: L) => {
    const { error } = await supabase.from('lessons').update({ is_free: !l.is_free }).eq('id', l.id)
    if (error) setErr(error.message); else load()
  }
  return (<div className="space-y-4">
    <button onClick={onBack} className="text-sky text-sm">← رجوع للكورسات</button>
    <h2 className="text-lg">دروس: {course.title}</h2>
    <form onSubmit={add} className="grid gap-3 bg-mist rounded-xl p-4">
      <input className="input" placeholder="عنوان الدرس" value={title} onChange={e => setTitle(e.target.value)} />
      <input className="input" dir="ltr" placeholder="رابط الفيديو (https://...)" value={url} onChange={e => setUrl(e.target.value)} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={free} onChange={e => setFree(e.target.checked)} /> درس مجاني</label>
      <button className="btn btn-p" disabled={busy}>{busy ? '...' : 'إضافة درس'}</button>
    </form>
    {err && <p className="text-red-400 text-sm">{err}</p>}
    {ls.length === 0 ? <p className="text-muted">لا توجد دروس بعد.</p> :
      <ul className="divide-y divide-white/5">{ls.map(l => <li key={l.id} className="flex items-center justify-between gap-3 py-3">
        <span>{l.position}. {l.title}</span>
        <span className="flex gap-3 text-sm"><button onClick={() => toggleFree(l)} className="text-sky">{l.is_free ? 'مجاني ✓' : 'مدفوع'}</button><button onClick={() => del(l.id)} className="text-red-400">حذف</button></span>
      </li>)}</ul>}
  </div>)
}

export default function AdminCourses() {
  const [cs, setCs] = useState<C[]>([]); const [f, setF] = useState(empty); const [file, setFile] = useState<File | null>(null)
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [open, setOpen] = useState<C | null>(null)
  const load = async () => {
    const { data, error } = await supabase.from('courses').select('id,title,description,thumbnail_url,price,is_published').order('created_at', { ascending: false })
    if (error) setErr(error.message); else setCs((data ?? []) as C[])
  }
  useEffect(() => { load() }, [])
  const save = async (e: FormEvent) => {
    e.preventDefault(); setErr('')
    if (!f.title.trim()) return setErr('اكتب عنوان الكورس')
    const price = Number(f.price); if (isNaN(price) || price < 0) return setErr('السعر غير صحيح')
    setBusy(true)
    let thumbnail_url: string | undefined
    if (file) {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const up = await supabase.storage.from('thumbnails').upload(path, file)
      if (up.error) { setBusy(false); return setErr('فشل رفع الصورة: ' + up.error.message) }
      thumbnail_url = supabase.storage.from('thumbnails').getPublicUrl(path).data.publicUrl
    }
    const body: Record<string, unknown> = { title: f.title.trim(), description: f.description.trim() || null, price }
    if (thumbnail_url) body.thumbnail_url = thumbnail_url
    const { error } = f.id ? await supabase.from('courses').update(body).eq('id', f.id) : await supabase.from('courses').insert({ ...body, is_published: false })
    setBusy(false)
    if (error) return setErr(error.message)
    setF(empty); setFile(null); load()
  }
  const publish = async (c: C) => {
    const { error } = await supabase.from('courses').update({ is_published: !c.is_published }).eq('id', c.id)
    if (error) setErr(error.message); else load()
  }
  const del = async (c: C) => {
    if (!confirm('حذف الكورس وكل دروسه؟')) return
    const { error } = await supabase.from('courses').delete().eq('id', c.id)
    if (error) setErr(error.message); else load()
  }
  if (open) return <Lessons course={open} onBack={() => setOpen(null)} />
  return (<div className="space-y-6">
    <form onSubmit={save} className="grid gap-3 bg-mist rounded-xl p-4">
      <h2 className="text-lg">{f.id ? 'تعديل كورس' : 'إضافة كورس'}</h2>
      <input className="input" placeholder="عنوان الكورس" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} />
      <input className="input" type="number" min="0" placeholder="السعر (ج.م)" value={f.price} onChange={e => setF({ ...f, price: e.target.value })} />
      <textarea className="input" rows={3} placeholder="وصف (اختياري)" value={f.description} onChange={e => setF({ ...f, description: e.target.value })} />
      <label className="text-sm text-muted">صورة الكورس {f.id && '(اتركها فارغة للإبقاء على الحالية)'}
        <input className="block mt-1" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} /></label>
      {err && <p className="text-red-400 text-sm">{err}</p>}
      <div className="flex gap-2"><button className="btn btn-p" disabled={busy}>{busy ? '...' : 'حفظ'}</button>
        {f.id && <button type="button" className="btn" onClick={() => { setF(empty); setFile(null) }}>إلغاء</button>}</div>
    </form>
    {cs.length === 0 ? <p className="text-muted">لا توجد كورسات بعد.</p> :
      <ul className="divide-y divide-white/5">{cs.map(c => <li key={c.id} className="flex items-center gap-3 py-3 flex-wrap">
        <div className="w-16 h-10 rounded-lg bg-mist overflow-hidden shrink-0">{c.thumbnail_url && <img src={c.thumbnail_url} alt="" className="w-full h-full object-cover" />}</div>
        <div className="flex-1 min-w-[140px]"><b>{c.title}</b><div className="text-xs text-muted">{c.price} ج.م · {c.is_published ? 'منشور' : 'مسودة'}</div></div>
        <div className="flex gap-3 text-sm">
          <button onClick={() => setOpen(c)} className="text-sky">الدروس</button>
          <button onClick={() => { setF({ id: c.id, title: c.title, description: c.description ?? '', price: String(c.price) }); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="text-sky">تعديل</button>
          <button onClick={() => publish(c)} className="text-sky">{c.is_published ? 'إخفاء' : 'نشر'}</button>
          <button onClick={() => del(c)} className="text-red-400">حذف</button>
        </div></li>)}</ul>}
  </div>)
}
