import { Link } from 'react-router-dom'
import { Clock, BookOpen } from 'lucide-react'
import type { Course } from '../lib/supabase'
export default function CourseCard({ c }: { c: Course }) {
  return (
    <article className="bg-card rounded-3xl overflow-hidden flex flex-col border border-white/5">
      <div className="aspect-video bg-mist">{c.thumbnail_url && <img src={c.thumbnail_url} alt={c.title} loading="lazy" className="w-full h-full object-cover" />}</div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-bold text-lg">{c.title}</h3>
        <p className="text-muted text-sm line-clamp-2">{c.description}</p>
        <div className="flex gap-4 text-sm text-muted"><span className="flex gap-1"><Clock size={16} />{c.duration_days} يوم</span><span className="flex gap-1"><BookOpen size={16} />{c.lessons_count} درس</span></div>
        <div className="mt-auto flex items-center justify-between"><b className="text-sky">{c.price} ج.م</b>
          <Link to={`/courses/${c.id}`} className="btn btn-p text-sm">عرض التفاصيل</Link></div>
      </div></article>)
}
