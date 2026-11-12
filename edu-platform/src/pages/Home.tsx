import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ListChecks, LineChart, Layers } from 'lucide-react'
import { supabase, Course } from '../lib/supabase'
import CourseCard from '../components/CourseCard'
import LastWatched from '../components/LastWatched'
const why = [[Layers,'دروس منظمة'],[ListChecks,'تعلّم متدرج'],[ShieldCheck,'وصول آمن'],[LineChart,'متابعة التقدم']] as const
export default function Home() {
  const [courses, setCourses] = useState<Course[]|null>(null); const [err, setErr] = useState(false)
  useEffect(() => { supabase.from('courses').select('*').eq('is_published', true).order('created_at', { ascending:false }).limit(3)
    .then(({ data, error }) => error ? setErr(true) : setCourses(data as Course[])) }, [])
  return (<main className="max-w-6xl mx-auto px-4">
    <section className="pt-14 pb-16 grid md:grid-cols-2 gap-10 items-center">
      <div><h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-sky">تعلّم بخطوات واضحة، وتقدّم بثقة</h1>
        <p className="mt-4 text-muted text-lg">دروس مرتبة وفيديوهات محمية ومتابعة دقيقة لتقدمك في كل مادة.</p>
        <div className="mt-8 flex gap-3 flex-wrap"><Link to="/courses" className="btn btn-p">استكشف الكورسات</Link><Link to="/register" className="btn">سجّل الآن</Link></div></div>
      <div className="aspect-[4/3] rounded-[2rem] bg-gradient-to-br from-brand to-deep relative overflow-hidden p-5 flex items-end"><div className="w-full"><LastWatched /></div></div>
    </section>
    <section className="bg-card rounded-3xl p-6 mb-8"><h2 className="text-2xl font-extrabold mb-2">عن المنصة</h2><p className="text-muted">نؤمن بأن التعلم الجيد يبدأ بترتيب واضح: وحدات ثم دروس، وتقدّم تتابعه خطوة بخطوة.</p></section>
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {why.map(([I, t]) => <div key={t} className="bg-card rounded-3xl p-6 text-center"><I className="mx-auto text-sky mb-2" /><b>{t}</b></div>)}</section>
    <section className="py-14"><div className="flex justify-between mb-6"><h2 className="text-2xl font-extrabold">كورسات مميزة</h2><Link to="/courses" className="text-sky">عرض الكل</Link></div>
      {err ? <p className="text-red-400">تعذّر تحميل الكورسات.</p> : !courses ? <div className="grid md:grid-cols-3 gap-5">{[0,1,2].map(i => <div key={i} className="skeleton h-72" />)}</div>
        : courses.length === 0 ? <p className="text-muted">لا توجد كورسات منشورة بعد.</p> : <div className="grid md:grid-cols-3 gap-5">{courses.map(c => <CourseCard key={c.id} c={c} />)}</div>}</section>
  </main>)
}
