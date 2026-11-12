import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { saveProgress } from '../lib/progress'
type L = { id:string; title:string; description:string|null; video_url:string|null; embed_url:string|null; course_id:string; courses:{ title:string }|null }
export default function Lesson() {
  const { lessonId } = useParams(); const { session } = useAuth(); const uid = session!.user.id
  const [l, setL] = useState<L|null|undefined>(undefined); const [rel, setRel] = useState<{ id:string; title:string }[]>([]); const [start, setStart] = useState<number|null>(null)
  const vid = useRef<HTMLVideoElement>(null); const pos = useRef(0); const done = useRef(false)
  useEffect(() => { setL(undefined); setStart(null); (async () => {
    // RLS returns nothing for paid lessons the student cannot access.
    const { data } = await supabase.from('lessons').select('id,title,description,video_url,embed_url,course_id,courses(title)').eq('id', lessonId).maybeSingle()
    setL(data as unknown as L|null)
    if (!data) return
    const p = await supabase.from('lesson_progress').select('position_seconds').eq('user_id', uid).eq('lesson_id', data.id).maybeSingle()
    setStart(p.data?.position_seconds ?? 0)
    const r = await supabase.from('lessons').select('id,title').eq('course_id', data.course_id).order('position'); setRel(r.data ?? [])
    if (data.embed_url && !data.video_url) void saveProgress(uid, data.id, 0, false)   // embeds expose no playback position: record that it was opened
  })() }, [lessonId, uid])
  useEffect(() => {
    if (!l || !l.video_url) return
    const save = () => { void saveProgress(uid, l.id, pos.current, done.current) }
    const iv = setInterval(save, 10000); addEventListener('pagehide', save)
    return () => { clearInterval(iv); removeEventListener('pagehide', save); save() }
  }, [l, uid])
  if (l === undefined) return <div className="skeleton m-6 h-60" />
  if (l === null) return <p className="p-10 text-center text-muted">الدرس غير موجود أو يتطلب اشتراكًا. <Link to="/courses" className="text-sky">الكورسات</Link></p>
  return (<main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2"><div className="aspect-video rounded-2xl overflow-hidden bg-black">
      {l.video_url ? <video ref={vid} src={l.video_url} controls controlsList="nodownload" className="w-full h-full"
          onLoadedMetadata={e => { if (start) e.currentTarget.currentTime = start }}
          onTimeUpdate={e => { pos.current = e.currentTarget.currentTime }} onEnded={() => { done.current = true }} />
        : l.embed_url ? <iframe src={l.embed_url} title={l.title} allow="fullscreen; picture-in-picture" className="w-full h-full" />
        : <div className="h-full grid place-items-center text-muted">لا يوجد فيديو لهذا الدرس بعد</div>}</div>
      <p className="text-muted text-sm mt-4">{l.courses?.title}</p><h1 className="text-2xl font-extrabold">{l.title}</h1><p className="text-muted mt-2">{l.description}</p></div>
    <aside className="bg-card rounded-2xl p-3 h-fit">{rel.map(r => <Link key={r.id} to={`/lessons/${r.id}`} className={`block p-3 rounded-xl ${r.id === l.id ? 'bg-mist text-sky' : 'hover:bg-mist'}`}>{r.title}</Link>)}</aside>
  </main>)
}
