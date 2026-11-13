import { FormEvent, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type F = { id: string; name: string; url: string; position: number }
export default function LessonFilesAdmin({ lessonId }: { lessonId: string }) {
  const [fs, setFs] = useState<F[]>([]); const [name, setName] = useState(''); const [url, setUrl] = useState('')
  const [err, setErr] = useState('')
  const load = async () => {
    const { data, error } = await supabase.from('lesson_files').select('id,name,url,position').eq('lesson_id', lessonId).order('position')
    if (error) setErr(error.message); else setFs((data ?? []) as F[])
  }
  useEffect(() => { load() }, [lessonId])
  const add = async (e: FormEvent) => {
    e.preventDefault(); setErr('')
    if (!name.trim() || !url.trim()) return setErr('اكتب اسم الملف والرابط')
    if (!/^https?:\/\//i.test(url.trim())) return setErr('الرابط لازم يبدأ بـ https://')
    const pos = fs.length ? Math.max(...fs.map(f => f.position)) + 1 : 1
    const { error } = await supabase.from('lesson_files').insert({ lesson_id: lessonId, name: name.trim(), url: url.trim(), position: pos })
    if (error) return setErr(error.message)
    setName(''); setUrl(''); load()
  }
  const del = async (id: string) => {
    if (!confirm('حذف الملف؟')) return
    const { error } = await supabase.from('lesson_files').delete().eq('id', id)
    if (error) setErr(error.message); else load()
  }
  return (
    <div className="bg-mist rounded-xl p-3 space-y-3">
      <h4 className="text-sm">الملفات المرفقة</h4>
      <form onSubmit={add} className="grid gap-2">
        <input className="input" placeholder="اسم الملف (مثال: ملخص الدرس PDF)" value={name} onChange={e => setName(e.target.value)} />
        <input className="input" dir="ltr" placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} />
        <button className="btn btn-p">إضافة ملف</button>
      </form>
      {err && <p className="text-red-400 text-sm">{err}</p>}
      {fs.length === 0 ? <p className="text-muted text-sm">لا توجد ملفات.</p> :
        <ul className="divide-y divide-white/5">{fs.map(f => (
          <li key={f.id} className="flex items-center justify-between gap-3 py-2 text-sm">
            <a href={f.url} target="_blank" rel="noopener noreferrer" className="truncate text-sky">{f.name}</a>
            <button onClick={() => del(f.id)} className="text-red-400 shrink-0">حذف</button>
          </li>))}
        </ul>}
    </div>
  )
}
