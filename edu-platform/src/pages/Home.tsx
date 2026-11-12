import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, ListChecks, LineChart, Layers } from 'lucide-react'
import { supabase, Course } from '../lib/supabase'
import CourseCard from '../components/CourseCard'
import LastWatched from '../components/LastWatched'

const why = [[Layers,'دروس منظمة'],[ListChecks,'تعلّم متدرج'],[ShieldCheck,'وصول آمن'],[LineChart,'متابعة التقدم']] as const

export default function Home() {
  const [courses, setCourses] = useState<Course[]|null>(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    supabase.from('courses').select('*').eq('is_published', true).order('created_at', { ascending:false }).limit(6)
      .then(({ data, error }) => error ? setErr(true) : setCourses(data as Course[]))
  }, [])

  return (
    <main className="max-w-6xl mx-auto px-4">
      <section className="pt-14 pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[15px] font-bold text-sky">
            <span className="w-2 h-2 rounded-full bg-[#fb923c]" />
            تيم  الشاطر  يرحب  بكم
          </span>

          <h1 className="mt-6 text-white">
            {/* 1st Sentence */}
            <span 
              style={{ 
                fontSize: '100px', 
                display: 'block', 
                // NOTE: Change vertical space (distance between 1st and 2nd sentence) here:
                marginBottom: '-40px', 
                // NOTE: Change horizontal space (letter spacing / distance between letters) here:
                letterSpacing: '0px'   
              }} 
            >
              أنت قدّها ...
            </span>

            {/* 2nd Sentence (forced to stay in one single line using 'whitespace-nowrap') */}
<span
  style={{ fontSize: '55px' }}
  className="inline-block bg-gradient-to-l from-[#fb923c] via-[#d68aa6] to-[#a46cf5] bg-clip-text text-transparent whitespace-nowrap text-[35px] md:text-[50px]"
>
  مهما كانت التحديات.
</span>
          </h1>

          <p className="mt-5 text-muted text-[18px] leading-loose max-w-xl">
            افتكر إنك مش بتذاكر علشان تعدّي امتحان وبس ..... أنت بتبني لنفسك مستقبل تستحق تفتخر بيه.
          </p>

          <div className="mt-8 flex gap-3 flex-wrap">
            <Link to="/courses" className="btn btn-p">استكشف الكورسات</Link>
            <Link to="/register" className="btn">سجّل الآن</Link>
          </div>
        </div>


<div className="relative mx-auto w-full max-w-[26rem] aspect-square">
          <div className="absolute -inset-6 rounded-full border border-dashed border-white/10" />
          <div
            className="absolute inset-0 rounded-full border border-white/10 overflow-hidden flex items-end justify-center"
            style={{background:'radial-gradient(circle at 50% 40%,rgba(196,140,255,.55),rgba(124,58,237,.35) 45%,#222a4a 80%)'}}
          >
            {/* Person image clipped inside the circle */}
            <img 
              src="/dr-yasin.png" 
              alt="Person" 
              className="absolute bottom-0 h-[85%] w-auto object-contain pointer-events-none" 
            />

            <div className="relative z-10 w-full p-8">
              <LastWatched />
            </div>
          </div>
        </div>


        
      </section>

      <section className="glass rounded-3xl p-6 mb-8">
        <h2 className="text-2xl mb-2 text-white">عن المنصة</h2>
        <p className="text-muted">
          نؤمن بأن التعلم الجيد يبدأ بترتيب واضح: وحدات ثم دروس، وتقدّم تتابعه خطوة بخطوة.
        </p>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {why.map(([I, t]) => (
          <div key={t} className="glass rounded-3xl p-6 text-center">
            <I className="mx-auto text-sky mb-2" />
            <b className="text-white">{t}</b>
          </div>
        ))}
      </section>

      <section className="py-14">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl text-white">أحدث الكورسات</h2>
          <Link to="/courses" className="text-sky">عرض الكل</Link>
        </div>

        {err ? (
          <p className="text-red-400">تعذّر تحميل الكورسات. تأكد من ربط Supabase.</p>
        ) : !courses ? (
          <div className="grid md:grid-cols-3 gap-5">
            {[0,1,2].map(i => <div key={i} className="skeleton h-72" />)}
          </div>
        ) : courses.length === 0 ? (
          <p className="text-muted">لا توجد كورسات بعد. أي كورس تنشره هيظهر هنا تلقائياً.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {courses.map(c => <CourseCard key={c.id} c={c} />)}
          </div>
        )}
      </section>
    </main>
  )
}
