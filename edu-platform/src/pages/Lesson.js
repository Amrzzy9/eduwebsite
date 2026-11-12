import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { saveProgress } from '../lib/progress';
export default function Lesson() {
    const { lessonId } = useParams();
    const { session } = useAuth();
    const uid = session.user.id;
    const [l, setL] = useState(undefined);
    const [rel, setRel] = useState([]);
    const [start, setStart] = useState(null);
    const vid = useRef(null);
    const pos = useRef(0);
    const done = useRef(false);
    useEffect(() => {
        setL(undefined);
        setStart(null);
        (async () => {
            // RLS returns nothing for paid lessons the student cannot access.
            const { data } = await supabase.from('lessons').select('id,title,description,video_url,embed_url,course_id,courses(title)').eq('id', lessonId).maybeSingle();
            setL(data);
            if (!data)
                return;
            const p = await supabase.from('lesson_progress').select('position_seconds').eq('user_id', uid).eq('lesson_id', data.id).maybeSingle();
            setStart(p.data?.position_seconds ?? 0);
            const r = await supabase.from('lessons').select('id,title').eq('course_id', data.course_id).order('position');
            setRel(r.data ?? []);
            if (data.embed_url && !data.video_url)
                void saveProgress(uid, data.id, 0, false); // embeds expose no playback position: record that it was opened
        })();
    }, [lessonId, uid]);
    useEffect(() => {
        if (!l || !l.video_url)
            return;
        const save = () => { void saveProgress(uid, l.id, pos.current, done.current); };
        const iv = setInterval(save, 10000);
        addEventListener('pagehide', save);
        return () => { clearInterval(iv); removeEventListener('pagehide', save); save(); };
    }, [l, uid]);
    if (l === undefined)
        return _jsx("div", { className: "skeleton m-6 h-60" });
    if (l === null)
        return _jsxs("p", { className: "p-10 text-center text-muted", children: ["\u0627\u0644\u062F\u0631\u0633 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F \u0623\u0648 \u064A\u062A\u0637\u0644\u0628 \u0627\u0634\u062A\u0631\u0627\u0643\u064B\u0627. ", _jsx(Link, { to: "/courses", className: "text-sky", children: "\u0627\u0644\u0643\u0648\u0631\u0633\u0627\u062A" })] });
    return (_jsxs("main", { className: "max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsx("div", { className: "aspect-video rounded-2xl overflow-hidden bg-black", children: l.video_url ? _jsx("video", { ref: vid, src: l.video_url, controls: true, controlsList: "nodownload", className: "w-full h-full", onLoadedMetadata: e => { if (start)
                                e.currentTarget.currentTime = start; }, onTimeUpdate: e => { pos.current = e.currentTarget.currentTime; }, onEnded: () => { done.current = true; } })
                            : l.embed_url ? _jsx("iframe", { src: l.embed_url, title: l.title, allow: "fullscreen; picture-in-picture", className: "w-full h-full" })
                                : _jsx("div", { className: "h-full grid place-items-center text-muted", children: "\u0644\u0627 \u064A\u0648\u062C\u062F \u0641\u064A\u062F\u064A\u0648 \u0644\u0647\u0630\u0627 \u0627\u0644\u062F\u0631\u0633 \u0628\u0639\u062F" }) }), _jsx("p", { className: "text-muted text-sm mt-4", children: l.courses?.title }), _jsx("h1", { className: "text-2xl font-extrabold", children: l.title }), _jsx("p", { className: "text-muted mt-2", children: l.description })] }), _jsx("aside", { className: "bg-card rounded-2xl p-3 h-fit", children: rel.map(r => _jsx(Link, { to: `/lessons/${r.id}`, className: `block p-3 rounded-xl ${r.id === l.id ? 'bg-mist text-sky' : 'hover:bg-mist'}`, children: r.title }, r.id)) })] }));
}
