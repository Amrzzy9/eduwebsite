import { useEffect, useMemo, useState } from 'react'
import { supabase, Course } from '../lib/supabase'
import CourseCard from '../components/CourseCard'
export default function Courses() {
  const [all, setAll] = useState<Course[]|null>(null); const [q, setQ] = useState(''); const [sort, setSort] = useState('new')
  useEffect(() => { supabase.from('courses').select('*').eq('is_published', true).order('created_at', { ascending:false }).then(({ data }) => setAll((data ?? []) as Course[])) }, [])
  const list = useMemo(() => [...(all ?? [])].filter(c => c.title.includes(q.trim())).sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0), [all, q, sort])
  return (<main className="max-w-6xl mx-auto px-4 py-10"><h1 className="text-3xl font-extrabold mb-6">الكورسات</h1>
    <div className="flex flex-wrap gap-3 mb-6"><input className="input flex-1 min-w-[200px]" value={q} onChange={e => setQ(e.target.value)} placeholder="ابحث عن كورس" />
      <select className="input w-auto" value={sort} onChange={e => setSort(e.target.value)}><option value="new">الأحدث</option><option value="low">الأقل سعرًا</option><option value="high">الأعلى سعرًا</option></select></div>
    {!all ? <div className="grid md:grid-cols-3 gap-5">{[0,1,2].map(i => <div key={i} className="skeleton h-72" />)}</div>
      : list.length === 0 ? <p className="text-muted">لا توجد كورسات مطابقة.</p> : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{list.map(c => <CourseCard key={c.id} c={c} />)}</div>}</main>)
}
