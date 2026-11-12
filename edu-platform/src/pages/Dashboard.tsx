import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
import Avatar from '../components/Avatar'
import LastWatched from '../components/LastWatched'
type Sub = { id:string; status:string; starts_at:string; expires_at:string; packages:{ name:string }|null }
type Act = { lesson_id:string; completed:boolean; updated_at:string; lessons:{ title:string }|null }
export default function Dashboard() {
  const { session, profile } = useAuth(); const uid = session!.user.id
  const [subs, setSubs] = useState<Sub[]>([]); const [act, setAct] = useState<Act[]>([])
  useEffect(() => {
    supabase.from('subscriptions').select('id,status,starts_at,expires_at,packages(name)').eq('user_id', uid).then(({ data }) => setSubs((data ?? []) as unknown as Sub[]))
    supabase.from('lesson_progress').select('lesson_id,completed,updated_at,lessons(title)').eq('user_id', uid).order('updated_at', { ascending:false }).limit(20).then(({ data }) => setAct((data ?? []) as unknown as Act[]))
  }, [uid])
  const active = subs.filter(s => s.status === 'active' && new Date(s.expires_at) > new Date()); const done = act.filter(a => a.completed).length
  const name = profile?.full_name || session!.user.email || ''
  return (<main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
    <div className="bg-card rounded-3xl p-5 flex items-center gap-4"><Avatar name={name} url={profile?.avatar_url} size={64} /><div><h1 className="text-xl font-extrabold">أهلاً {name}</h1><p className="text-muted text-sm">{session!.user.email}</p></div></div>
    <LastWatched />
    <div className="grid grid-cols-3 gap-3 text-center">{[['اشتراكات نشطة', active.length], ['دروس بدأتها', act.length], ['دروس مكتملة', done]].map(([t, n]) => <div key={t as string} className="bg-card rounded-2xl p-4"><b className="text-2xl text-sky">{n}</b><div className="text-xs text-muted">{t}</div></div>)}</div>
    <section><h2 className="font-bold mb-3">الاشتراكات</h2>{subs.length === 0 ? <p className="text-muted">لا توجد اشتراكات. <Link to="/courses" className="text-sky">تصفح الكورسات</Link></p> :
      subs.map(s => <div key={s.id} className="bg-card rounded-2xl p-4 mb-2 text-sm"><b>{s.packages?.name}</b> · {s.status} · حتى {new Date(s.expires_at).toLocaleDateString('ar-EG')}</div>)}</section>
    <section><h2 className="font-bold mb-3">النشاط الأخير</h2>{act.length === 0 ? <p className="text-muted">لا يوجد نشاط بعد.</p> :
      act.slice(0, 5).map(a => <Link key={a.lesson_id} to={`/lessons/${a.lesson_id}`} className="block bg-card rounded-2xl p-3 mb-2 text-sm">{a.lessons?.title} {a.completed && '✓'}</Link>)}</section>
  </main>)
}
