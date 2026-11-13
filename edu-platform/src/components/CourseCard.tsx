import { Link } from 'react-router-dom'
import { Clock, BookOpen } from 'lucide-react'
import type { Course } from '../lib/supabase'
export default function CourseCard({ c }: { c: Course }) {
  return (
    <Link to={`/courses/${c.id}`} className="glass rounded-3xl overflow-hidden block relative aspect-square group">
      {c.thumbnail_url
        ? <img src={c.thumbnail_url} alt={c.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition duration-300 group-hover:scale-105" />
        : <div className="absolute inset-0 bg-mist" />}
      <div className="absolute inset-x-0 bottom-0 p-4 pt-16 bg-gradient-to-t from-[#0a0f1f] via-[#0a0f1f]/80 to-transparent">
        <h3 className="font-bold text-lg text-white truncate">{c.title}</h3>
        <div className="mt-1 flex items-center justify-between gap-3">
          <div className="flex gap-3 text-xs text-muted">
            {c.duration_days ? <span className="flex gap-1 items-center"><Clock size={14} />{c.duration_days} يوم</span> : null}
            <span className="flex gap-1 items-center"><BookOpen size={14} />{c.lessons_count ?? 0} درس</span>
          </div>
          <b dir="rtl" className="neon-price">{c.price} ج.م</b>
        </div>
      </div>
    </Link>)
}
