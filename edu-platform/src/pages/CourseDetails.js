import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
export default function CourseDetails() {
    const { courseId } = useParams();
    const { session } = useAuth();
    const [c, setC] = useState(undefined);
    const [pk, setPk] = useState([]);
    const [ls, setLs] = useState([]);
    useEffect(() => {
        (async () => {
            const { data } = await supabase.from('courses').select('*').eq('id', courseId).eq('is_published', true).maybeSingle();
            setC(data);
            const p = await supabase.from('package_courses').select('packages(id,name,kind,price,duration_days,is_active)').eq('course_id', courseId);
            setPk((p.data ?? []).map(r => r.packages).filter((x) => x?.is_active));
            const l = await supabase.from('lessons').select('id,title,is_free').eq('course_id', courseId).order('position');
            setLs((l.data ?? []));
        })();
    }, [courseId]);
    if (c === undefined)
        return _jsx("div", { className: "skeleton m-6 h-60" });
    if (c === null)
        return _jsx("p", { className: "p-10 text-center text-muted", children: "\u0627\u0644\u0643\u0648\u0631\u0633 \u063A\u064A\u0631 \u0645\u0648\u062C\u0648\u062F." });
    return (_jsxs("main", { className: "max-w-4xl mx-auto px-4 py-10", children: [_jsx("div", { className: "aspect-video rounded-3xl bg-mist overflow-hidden mb-6", children: c.thumbnail_url && _jsx("img", { src: c.thumbnail_url, alt: c.title, className: "w-full h-full object-cover" }) }), _jsx("h1", { className: "text-3xl font-extrabold", children: c.title }), _jsx("p", { className: "text-muted mt-2", children: c.description }), _jsx("h2", { className: "text-xl font-bold mt-8 mb-3", children: "\u0627\u0644\u062F\u0631\u0648\u0633" }), ls.length === 0 ? _jsx("p", { className: "text-muted", children: "\u0644\u0627 \u062A\u0648\u062C\u062F \u062F\u0631\u0648\u0633 \u0638\u0627\u0647\u0631\u0629 \u0644\u0643 \u0628\u0639\u062F. \u0627\u0644\u062F\u0631\u0648\u0633 \u0627\u0644\u0645\u062F\u0641\u0648\u0639\u0629 \u062A\u0638\u0647\u0631 \u0644\u0644\u0645\u0634\u062A\u0631\u0643\u064A\u0646 \u0641\u0642\u0637." }) :
                _jsx("ul", { className: "bg-card rounded-2xl divide-y divide-white/5", children: ls.map(l => _jsx("li", { children: _jsxs(Link, { className: "flex justify-between p-4 hover:text-sky", to: `/lessons/${l.id}`, children: [_jsx("span", { children: l.title }), l.is_free && _jsx("span", { className: "text-xs text-sky", children: "\u0645\u062C\u0627\u0646\u064A" })] }) }, l.id)) }), _jsx("h2", { className: "text-xl font-bold mt-8 mb-3", children: "\u0627\u0644\u0628\u0627\u0642\u0627\u062A" }), pk.length === 0 ? _jsx("p", { className: "text-muted", children: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0628\u0627\u0642\u0627\u062A \u0645\u062A\u0627\u062D\u0629 \u062D\u0627\u0644\u064A\u064B\u0627." }) : pk.map(p => (_jsxs("div", { className: "bg-card rounded-2xl p-4 mb-3 flex items-center justify-between gap-3 flex-wrap", children: [_jsxs("div", { children: [_jsx("b", { children: p.name }), _jsxs("div", { className: "text-sm text-muted", children: [p.kind === 'bundle' ? 'باقة شاملة لعدة مواد' : 'مادة واحدة', " \u00B7 ", p.duration_days, " \u064A\u0648\u0645"] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("b", { className: "text-sky", children: [p.price, " \u062C.\u0645"] }), session ? _jsx("span", { className: "text-sm text-muted", children: "\u0637\u0644\u0628 \u0627\u0644\u062F\u0641\u0639: \u0627\u0644\u0645\u0631\u062D\u0644\u0629 \u0627\u0644\u0642\u0627\u062F\u0645\u0629" }) : _jsx(Link, { to: "/login", state: { from: `/courses/${c.id}` }, className: "btn btn-p", children: "\u0633\u062C\u0651\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0644\u0644\u0627\u0634\u062A\u0631\u0627\u0643" })] })] }, p.id)))] }));
}
