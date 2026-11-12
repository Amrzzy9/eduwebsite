import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import Avatar from '../components/Avatar';
import LastWatched from '../components/LastWatched';
export default function Dashboard() {
    const { session, profile } = useAuth();
    const uid = session.user.id;
    const [subs, setSubs] = useState([]);
    const [act, setAct] = useState([]);
    useEffect(() => {
        supabase.from('subscriptions').select('id,status,starts_at,expires_at,packages(name)').eq('user_id', uid).then(({ data }) => setSubs((data ?? [])));
        supabase.from('lesson_progress').select('lesson_id,completed,updated_at,lessons(title)').eq('user_id', uid).order('updated_at', { ascending: false }).limit(20).then(({ data }) => setAct((data ?? [])));
    }, [uid]);
    const active = subs.filter(s => s.status === 'active' && new Date(s.expires_at) > new Date());
    const done = act.filter(a => a.completed).length;
    const name = profile?.full_name || session.user.email || '';
    return (_jsxs("main", { className: "max-w-5xl mx-auto px-4 py-10 space-y-6", children: [_jsxs("div", { className: "bg-card rounded-3xl p-5 flex items-center gap-4", children: [_jsx(Avatar, { name: name, url: profile?.avatar_url, size: 64 }), _jsxs("div", { children: [_jsxs("h1", { className: "text-xl font-extrabold", children: ["\u0623\u0647\u0644\u0627\u064B ", name] }), _jsx("p", { className: "text-muted text-sm", children: session.user.email })] })] }), _jsx(LastWatched, {}), _jsx("div", { className: "grid grid-cols-3 gap-3 text-center", children: [['اشتراكات نشطة', active.length], ['دروس بدأتها', act.length], ['دروس مكتملة', done]].map(([t, n]) => _jsxs("div", { className: "bg-card rounded-2xl p-4", children: [_jsx("b", { className: "text-2xl text-sky", children: n }), _jsx("div", { className: "text-xs text-muted", children: t })] }, t)) }), _jsxs("section", { children: [_jsx("h2", { className: "font-bold mb-3", children: "\u0627\u0644\u0627\u0634\u062A\u0631\u0627\u0643\u0627\u062A" }), subs.length === 0 ? _jsxs("p", { className: "text-muted", children: ["\u0644\u0627 \u062A\u0648\u062C\u062F \u0627\u0634\u062A\u0631\u0627\u0643\u0627\u062A. ", _jsx(Link, { to: "/courses", className: "text-sky", children: "\u062A\u0635\u0641\u062D \u0627\u0644\u0643\u0648\u0631\u0633\u0627\u062A" })] }) :
                        subs.map(s => _jsxs("div", { className: "bg-card rounded-2xl p-4 mb-2 text-sm", children: [_jsx("b", { children: s.packages?.name }), " \u00B7 ", s.status, " \u00B7 \u062D\u062A\u0649 ", new Date(s.expires_at).toLocaleDateString('ar-EG')] }, s.id))] }), _jsxs("section", { children: [_jsx("h2", { className: "font-bold mb-3", children: "\u0627\u0644\u0646\u0634\u0627\u0637 \u0627\u0644\u0623\u062E\u064A\u0631" }), act.length === 0 ? _jsx("p", { className: "text-muted", children: "\u0644\u0627 \u064A\u0648\u062C\u062F \u0646\u0634\u0627\u0637 \u0628\u0639\u062F." }) :
                        act.slice(0, 5).map(a => _jsxs(Link, { to: `/lessons/${a.lesson_id}`, className: "block bg-card rounded-2xl p-3 mb-2 text-sm", children: [a.lessons?.title, " ", a.completed && '✓'] }, a.lesson_id))] })] }));
}
