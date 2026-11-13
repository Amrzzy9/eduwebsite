import { FormEvent, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import LessonFilesAdmin from './LessonFilesAdmin'

type C = { id: string; title: string; description: string | null; thumbnail_url: string | null; price: number; duration_days: number | null; is_published: boolean }
type L = { id: string; title: string; video_url: string | null; position: number; is_free: boolean; is_hidden: boolean; publish_at: string | null }
const empty = { id: '', title: '', description: '', price: '0', hasDur: false, dur: '30' }

const toLocal = (iso: string | null) => {
  if (!iso) return ''
  const d = new Date(iso); const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}
const status = (l: L) => l.is_hidden ? 'مخفي' : l.publish_at && new Date(l.publish_at) > new Date() ? 'مجدول: ' + new Date(l.publish_at).toLocaleString('ar-EG') : 'ظاهر'

function Lessons({ course, onBack }: { course: C; onBack: () => void }) {
  const [ls, setLs] = useState<L[]>([]); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false)
  const [n, setN] = useState({ title: '', url: '', free: false, when: '' })
  const [ed, setEd] = useState<{ id: string; title: string; url: string; when: string } | null>(null)
  const load = async () => {
    const { data, error } = await supabase.from('lessons').select('id,title,video_url,position,is_free,is_hidden,publish_at').eq('course_id', course.id).order('position')
    if (error) setErr(error.message); else setLs((data ?? []) as L[])
  }
  useEffect(() => { load() }, [course.id])
  const run = async (p: PromiseLike<{ error: { message: string } | null }>) => { const { error } = await p; if (error) setErr(error.message); else { setErr(''); load() } }

  const add = async (e: FormEvent) => {
    e.preventDefault(); setErr('')
    if (!n.title.trim() || !n.url.trim()) return setErr('اكتب عنوان الدرس ورابط الفيديو')
    setBusy(true)
    const pos = ls.length ? Math.max(...ls.map(l => l.position)) + 1 : 1
    const { error } = await supabase.from('lessons').insert({ course_id: course.id, title: n.title.trim(), video_url: n.url.trim(), position: pos, is_free: n.free, publish_at: n.when ? new Date(n.when).toISOString() : null })
    setBusy(false)
    if (error) return setErr(error.message)
    setN({ title: '', url: '', free: false, when: '' }); load()
  }
  const saveEdit = async () => {
    if (!ed || !ed.title.trim()) return setErr('العنوان مطلوب')
    await run(supabase.from('lessons').update({ title: ed.title.trim(), video_url: ed.url.trim(), publish_at: ed.when ? new Date(ed.when).toISOString() : null }).eq('id', ed.id))
    setEd(null)
  }
  const move = async (i: number, d: -1 | 1) => {
    const a = ls[i], b = ls[i + d]; if (!a || !b) return
    await supabase.from('lessons').update({ position: b.position }).eq('id', a.id)
    await supabase.from('lessons').update({ position: a.position }).eq('id', b.id); load()
  }
  const del = (id: string) => { if (confirm('حذف الدرس؟')) run(supabase.from('lessons').delete().eq('id', id)) }

  return (<div className="space-y-4">
    <button onClick={onBack} className="text-sky text-sm">← رجوع للكورسات</button>
    <h2 className="text-lg">دروس: {course.title}</h2>
    <form onSubmit={add} className="grid gap-3 bg-mist rounded-xl p-4">
      <input className="input" placeholder="عنوان الدرس" value={n.title} onChange={e => setN({ ...n, title: e.target.value })} />
      <input className="input" dir="ltr" placeholder="رابط الفيديو (https://...)" value={n.url} onChange={e => setN({ ...n, url: e.target.value })} />
      <label className="text-sm text-muted">موعد الظهور للطلاب (اتركه فاضي = يظهر فوراً)
        <input className="input mt-1" dir="ltr" type="datetime-local" value={n.when} onChange={e => setN({ ...n, when: e.target.value })} /></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={n.free} onChange={e => setN({ ...n, free: e.target.checked })} /> درس مجاني</label>
      <button className="btn btn-p" disabled={busy}>{busy ? '...' : 'إضافة درس'}</button>
    </form>
    {err && <p className="text-red-400 text-sm">{err}</p>}
    {ls.length === 0 ? <p className="text-muted">لا توجد دروس بعد.</p> :
      <ul className="divide-y divide-white/5">{ls.map((l, i) => <li key={l.id} className="py-3 space-y-2">
        {ed?.id === l.id ? <div className="grid gap-2 bg-mist rounded-xl p-3">
          <input className="input" value={ed.title} onChange={e => setEd({ ...ed, title: e.target.value })} />
          <input className="input" dir="ltr" value={ed.url} onChange={e => setEd({ ...ed, url: e.target.value })} />
          <input className="input" dir="ltr" type="datetime-local" value={ed.when} onChange={e => setEd({ ...ed, when: e.target.value })} />
          <div className="flex gap-2"><button className="btn btn-p" onClick={saveEdit}>حفظ</button><button className="btn" onClick={() => setEd(null)}>إلغاء</button></div>
        </div> : <>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div><b>{l.position}. {l.title}</b><div className="text-xs text-muted">{status(l)} · {l.is_free ? 'مجاني' : 'مدفوع'}</div></div>
            <div className="flex gap-3 text-sm flex-wrap">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="text-sky disabled:opacity-30">↑</button>
              <button onClick={() => move(i, 1)} disabled={i === ls.length - 1} className="text-sky disabled:opacity-30">↓</button>
              <button onClick={() => setEd({ id: l.id, title: l.title, url: l.video_url ?? '', when: toLocal(l.publish_at) })} className="text-sky">تعديل</button>
              <button onClick={() => run(supabase.from('lessons').update({ is_hidden: !l.is_hidden }).eq('id', l.id))} className="text-sky">{l.is_hidden ? 'إظهار' : 'إخفاء'}</button>
              <button onClick={() => run(supabase.from('lessons').update({ is_free: !l.is_free }).eq('id', l.id))} className="text-sky">{l.is_free ? 'اجعله مدفوع' : 'اجعله مجاني'}</button>
              <button onClick={() => del(l.id)} className="text-red-400">حذف</button>
            </div>
          </div></>}
      </li>)}</ul>}
  </div>)
}

export default function AdminCourses() {
  const [cs, setCs] = useState<C[]>([]); const [f, setF] = useState(empty); const [file, setFile] = useState<File | null>(null)
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [open, setOpen] = useState<C | null>(null)
  const load = async () => {
    const { data, error } = await supabase.from('courses').select('id,title,description,thumbnail_url,price,duration_days,is_published').order('created_at', { ascending: false })
    if (error) setErr(error.message); else setCs((data ?? []) as C[])
  }
  useEffect(() => { load() }, [])
  const save = async (e: FormEvent) => {
    e.preventDefault(); setErr('')
    if (!f.title.trim()) return setErr('اكتب عنوان الكورس')
    const price = Number(f.price); if (isNaN(price) || price < 0) return setErr('السعر غير صحيح')
    const dur = f.hasDur ? Number(f.dur) : null
    if (f.hasDur && (!dur || dur < 1)) return setErr('المدة غير صحيحة')
    setBusy(true)
    let thumbnail_url: string | undefined
    if (file) {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const up = await supabase.storage.from('thumbnails').upload(path, file)
      if (up.error) { setBusy(false); return setErr('فشل رفع الصورة: ' + up.error.message) }
      thumbnail_url = supabase.storage.from('thumbnails').getPublicUrl(path).data.publicUrl
    }
    const body: Record<string, unknown> = { title: f.title.trim(), description: f.description.trim() || null, price, duration_days: dur }
    if (thumbnail_url) body.thumbnail_url = thumbnail_url
    const { error } = f.id ? await supabase.from('courses').update(body).eq('id', f.id) : await supabase.from('courses').insert({ ...body, is_published: false })
    setBusy(false)
    if (error) return setErr(error.message)
    setF(empty); setFile(null); load()
  }
  const publish = async (c: C) => { const { error } = await supabase.from('courses').update({ is_published: !c.is_published }).eq('id', c.id); if (error) setErr(error.message); else load() }
  const del = async (c: C) => { if (!confirm('حذف الكورس وكل دروسه؟')) return; const { error } = await supabase.from('courses').delete().eq('id', c.id); if (error) setErr(error.message); else load() }
  if (open) return <Lessons course={open} onBack={() => setOpen(null)} />
  return (<div className="space-y-6">
    <form onSubmit={save} className="grid gap-3 bg-mist rounded-xl p-4">
      <h2 className="text-lg">{f.id ? 'تعديل كورس' : 'إضافة كورس'}</h2>
      <input className="input" placeholder="عنوان الكورس" value={f.title} onChange={e => setF({ ...f, title: e.target.value })} />
      <input className="input" type="number" min="0" placeholder="السعر (ج.م)" value={f.price} onChange={e => setF({ ...f, price: e.target.value })} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.hasDur} onChange={e => setF({ ...f, hasDur: e.target.checked })} /> تحديد مدة للكورس</label>
      {f.hasDur && <input className="input" type="number" min="1" placeholder="المدة بالأيام" value={f.dur} onChange={e => setF({ ...f, dur: e.target.value })} />}
      <textarea className="input" rows={3} placeholder="وصف (اختياري)" value={f.description} onChange={e => setF({ ...f, description: e.target.value })} />
      <label className="text-sm text-muted">صورة الكورس (الأفضل مربعة) {f.id && '(اتركها فارغة للإبقاء على الحالية)'}
        <input className="block mt-1" type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} /></label>
      {err && <p className="text-red-400 text-sm">{err}</p>}
      <div className="flex gap-2"><button className="btn btn-p" disabled={busy}>{busy ? '...' : 'حفظ'}</button>
        {f.id && <button type="button" className="btn" onClick={() => { setF(empty); setFile(null) }}>إلغاء</button>}</div>
    </form>
    {cs.length === 0 ? <p className="text-muted">لا توجد كورسات بعد.</p> :
      <ul className="divide-y divide-white/5">{cs.map(c => <li key={c.id} className="flex items-center gap-3 py-3 flex-wrap">
        <div className="w-14 h-14 rounded-lg bg-mist overflow-hidden shrink-0">{c.thumbnail_url && <img src={c.thumbnail_url} alt="" className="w-full h-full object-cover" />}</div>
        <div className="flex-1 min-w-[140px]"><b>{c.title}</b><div className="text-xs text-muted"><span dir="rtl">{c.price} ج.م</span> · {c.duration_days ? c.duration_days + ' يوم' : 'بدون مدة'} · {c.is_published ? 'منشور' : 'مسودة'}</div></div>
        <div className="flex gap-3 text-sm">
          <button onClick={() => setOpen(c)} className="text-sky">الدروس</button>
          <button onClick={() => { setF({ id: c.id, title: c.title, description: c.description ?? '', price: String(c.price), hasDur: !!c.duration_days, dur: String(c.duration_days ?? 30) }); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="text-sky">تعديل</button>
          <button onClick={() => publish(c)} className="text-sky">{c.is_published ? 'إخفاء' : 'نشر'}</button>
          <button onClick={() => del(c)} className="text-red-400">حذف</button>
        </div></li>)}</ul>}
  </div>)
}
