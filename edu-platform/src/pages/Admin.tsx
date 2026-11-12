import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import AdminCourses from '../components/AdminCourses'
const sections = ['نظرة عامة','الكورسات','المواد','الوحدات','الدروس','الطلاب','الاشتراكات','المدفوعات','محتوى الموقع','طرق الدفع','الإعدادات']
const tables: Record<string,string> = { 'الكورسات':'courses','الدروس':'lessons','الطلاب':'profiles','الاشتراكات':'subscriptions','المدفوعات':'payment_requests' }
export default function Admin() {
  const [n, setN] = useState<Record<string, number>>({}); const [tab, setTab] = useState(sections[0])
  useEffect(() => { Object.entries(tables).forEach(([k, t]) => supabase.from(t).select('*', { count:'exact', head:true }).then(({ count }) => setN(p => ({ ...p, [k]: count ?? 0 })))) }, [])
  return (<main className="max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-[220px_1fr] gap-6">
    <nav className="glass rounded-2xl p-2 flex md:flex-col gap-1 overflow-x-auto">{sections.map(s => <button key={s} onClick={() => setTab(s)} className={`px-3 py-2 rounded-xl text-start whitespace-nowrap ${tab === s ? 'bg-mist text-sky' : 'text-muted'}`}>{s}</button>)}</nav>
    <section className="glass rounded-2xl p-6"><h1 className="text-xl mb-4">{tab}</h1>
      {tab === 'نظرة عامة' ? <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{Object.keys(tables).map(k => <div key={k} className="bg-mist rounded-xl p-4"><b className="text-2xl text-sky">{n[k] ?? '…'}</b><div className="text-sm text-muted">{k}</div></div>)}</div>
        : tab === 'الكورسات' ? <AdminCourses />
        : <p className="text-muted">واجهة إدارة هذا القسم لم تُنفَّذ بعد. حاليًا تُدار البيانات من Supabase Table Editor.</p>}</section></main>)
}
