import { useEffect, useState } from 'react'
import { Paperclip } from 'lucide-react'
import { supabase } from '../lib/supabase'

type F = { id: string; name: string; url: string }
export default function LessonFiles({ lessonId }: { lessonId: string }) {
  const [fs, setFs] = useState<F[]>([])
  useEffect(() => {
    supabase.from('lesson_files').select('id,name,url').eq('lesson_id', lessonId).order('position')
      .then(({ data }) => setFs((data ?? []) as F[]))
  }, [lessonId])
  if (fs.length === 0) return null
  return (
    <section className="glass rounded-2xl p-4 mt-6">
      <h3 className="text-lg mb-3 flex items-center gap-2"><Paperclip size={18} className="text-sky" />ملفات مرفقة</h3>
      <ul className="grid gap-2">
        {fs.map(f => (
          <li key={f.id}>
            <a href={f.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 rounded-xl bg-white/5 hover:bg-white/10 px-4 py-3 transition">
              <span className="truncate">{f.name}</span><span className="text-sky text-sm shrink-0">فتح ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
