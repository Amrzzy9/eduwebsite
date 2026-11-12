import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
export default function LastWatched() {
    const { session } = useAuth();
    const uid = session?.user.id;
    const [row, setRow] = useState(null);
    useEffect(() => {
        setRow(null);
        if (!uid)
            return;
        let live = true;
        supabase.from('lesson_progress').select('position_seconds, lesson:lessons(id,title,duration_seconds,course:courses(title,thumbnail_url))')
            .eq('user_id', uid).order('updated_at', { ascending: false }).limit(1).maybeSingle()
            .then(({ data }) => { if (live && data?.lesson)
            setRow(data); });
        return () => { live = false; };
    }, [uid]);
    if (!uid || !row)
        return null; // hidden for visitors, new students, and while loading
    const d = row.lesson.duration_seconds, pct = d ? Math.min(100, Math.round(row.position_seconds / d * 100)) : null;
    return (_jsxs(Link, { to: `/lessons/${row.lesson.id}`, className: "glass rounded-2xl p-4 flex gap-4 items-center", children: [_jsx("div", { className: "w-24 aspect-video rounded-xl bg-mist overflow-hidden shrink-0", children: row.lesson.course.thumbnail_url && _jsx("img", { src: row.lesson.course.thumbnail_url, alt: "", className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "text-muted text-xs", children: ["\u0622\u062E\u0631 \u062F\u0631\u0633 \u0634\u0627\u0647\u062F\u062A\u0647 \u00B7 ", row.lesson.course.title] }), _jsx("div", { className: "font-bold truncate", children: row.lesson.title }), pct !== null && _jsx("div", { className: "mt-2 h-1.5 rounded bg-white/10", children: _jsx("div", { className: "h-full rounded bg-brand", style: { width: `${pct}%` } }) })] }), _jsx(PlayCircle, { className: "text-sky shrink-0" })] }));
}
