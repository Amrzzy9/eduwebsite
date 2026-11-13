import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase, Course } from '../lib/supabase'
import { useAuth } from '../lib/auth'
type Pkg = { id:string; name:string; kind:string; price:number; duration_days:number }
type Lesson = { id:string; title:string; is_free:boolean; is_hidden:boolean; publish_at:string|null }
export default function CourseDetails() {
  const { courseId } = useParams(); const { session } = useAuth()
  const [c, setC] = useState<Course|null|undefined>(undefined); const [pk, setPk] = useState<Pkg[]>([]); const [ls, setLs] = useState<Lesson[]>([])
  useEffect(() => { (async () => {
    const { data } = await supabase.from('courses').select('*').eq('id', courseId).eq('is_published', true).maybeSingle(); setC(data as Course|null)
    const p = await supabase.from('package_courses').select('packages(id,name,kind,price,duration_days,is_active)').eq('course_id', courseId)
    setPk(((p.data ?? []) as any[]).map(r => r.packages).filter((x: any) => x?.is_active))
    const l = await supabase.from('lessons').select('id,title,is_free,is_hidden,publish_at').eq('course_id', courseId).order('position')
    setLs(((l.data ?? []) as Lesson[]).filter(x => !x.is_hidden && (!x.publish_at || new Date(x.publish_at) <= new Date())))
  })() }, [courseId])
  if (c === undefined) return <div className="skeleton m-6 h-60" />
  if (c === null) return <p className="p-10 text-center text-muted">الكورس غير موجود.</p>
  return (<main className="max-w-4xl mx-auto px-4 py-10">
    <div className="aspect-video rounded-3xl bg-mist overflow-hidden mb-6">{c.thumbnail_url && <img src={c.thumbnail_url} alt={c.title} className="w-full h-full object-cover" />}</div>
    <h1 className="text-3xl font-extrabold">{c.title}</h1><p className="text-muted mt-2">{c.description}</p>
    <div className="mt-3"><span dir="rtl" className="neon-price text-xl">{c.price} ج.م</span></div>
    <h2 className="text-xl font-bold mt-8 mb-3">الدروس</h2>
    {ls.length === 0 ? <p className="text-muted">لا توجد دروس ظاهرة لك بعد. الدروس المدفوعة تظهر للمشتركين فقط.</p> :
      <ul className="glass rounded-2xl divide-y divide-white/5">{ls.map(l => <li key={l.id}><Link className="flex justify-between p-4 hover:text-sky" to={`/lessons/${l.id}`}><span>{l.title}</span>{l.is_free && <span className="text-xs text-sky">مجاني</span>}</Link></li>)}</ul>}
    <h2 className="text-xl font-bold mt-8 mb-3">الباقات</h2>
    {pk.length === 0 ? <p className="text-muted">لا توجد باقات متاحة حاليًا.</p> : pk.map(p => (
      <div key={p.id} className="glass rounded-2xl p-4 mb-3 flex items-center justify-between gap-3 flex-wrap">
        <div><b>{p.name}</b><div className="text-sm text-muted">{p.kind === 'bundle' ? 'باقة شاملة لعدة مواد' : 'مادة واحدة'} · {p.duration_days} يوم</div></div>
        <div className="flex items-center gap-3"><b dir="rtl" className="neon-price">{p.price} ج.م</b>
          {session ? <span className="text-sm text-muted">طلب الدفع: المرحلة القادمة</span> : <Link to="/login" state={{ from: `/courses/${c.id}` }} className="btn btn-p">سجّل الدخول للاشتراك</Link>}</div></div>))}
  </main>)
}
