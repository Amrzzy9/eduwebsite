import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlayCircle } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { supabase } from '../lib/supabase'
type Row = { position_seconds: number; lesson: { id: string; title: string; duration_seconds: number|null; course: { title: string; thumbnail_url: string|null } } }
export default function LastWatched() {
  const { session } = useAuth(); const uid = session?.user.id; const [row, setRow] = useState<Row|null>(null)
  useEffect(() => {
    setRow(null); if (!uid) return
    let live = true
    supabase.from('lesson_progress').select('position_seconds, lesson:lessons(id,title,duration_seconds,course:courses(title,thumbnail_url))')
      .eq('user_id', uid).order('updated_at', { ascending: false }).limit(1).maybeSingle()
      .then(({ data }) => { if (live && data?.lesson) setRow(data as unknown as Row) })
    return () => { live = false }
  }, [uid])
  if (!uid || !row) return null   // hidden for visitors, new students, and while loading
  const d = row.lesson.duration_seconds, pct = d ? Math.min(100, Math.round(row.position_seconds / d * 100)) : null
  return (
    <Link to={`/lessons/${row.lesson.id}`} className="glass rounded-2xl p-4 flex gap-4 items-center">
      <div className="w-24 aspect-video rounded-xl bg-mist overflow-hidden shrink-0">{row.lesson.course.thumbnail_url && <img src={row.lesson.course.thumbnail_url} alt="" className="w-full h-full object-cover" />}</div>
      <div className="flex-1 min-w-0"><div className="text-muted text-xs">آخر درس شاهدته · {row.lesson.course.title}</div>
        <div className="font-bold truncate">{row.lesson.title}</div>
        {pct !== null && <div className="mt-2 h-1.5 rounded bg-white/10"><div className="h-full rounded bg-brand" style={{ width: `${pct}%` }} /></div>}</div>
      <PlayCircle className="text-sky shrink-0" />
    </Link>)
}
