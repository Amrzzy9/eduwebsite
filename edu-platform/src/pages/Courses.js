import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import CourseCard from '../components/CourseCard';
export default function Courses() {
    const [all, setAll] = useState(null);
    const [q, setQ] = useState('');
    const [sort, setSort] = useState('new');
    useEffect(() => { supabase.from('courses').select('*').eq('is_published', true).order('created_at', { ascending: false }).then(({ data }) => setAll((data ?? []))); }, []);
    const list = useMemo(() => [...(all ?? [])].filter(c => c.title.includes(q.trim())).sort((a, b) => sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : 0), [all, q, sort]);
    return (_jsxs("main", { className: "max-w-6xl mx-auto px-4 py-10", children: [_jsx("h1", { className: "text-3xl font-extrabold mb-6", children: "\u0627\u0644\u0643\u0648\u0631\u0633\u0627\u062A" }), _jsxs("div", { className: "flex flex-wrap gap-3 mb-6", children: [_jsx("input", { className: "input flex-1 min-w-[200px]", value: q, onChange: e => setQ(e.target.value), placeholder: "\u0627\u0628\u062D\u062B \u0639\u0646 \u0643\u0648\u0631\u0633" }), _jsxs("select", { className: "input w-auto", value: sort, onChange: e => setSort(e.target.value), children: [_jsx("option", { value: "new", children: "\u0627\u0644\u0623\u062D\u062F\u062B" }), _jsx("option", { value: "low", children: "\u0627\u0644\u0623\u0642\u0644 \u0633\u0639\u0631\u064B\u0627" }), _jsx("option", { value: "high", children: "\u0627\u0644\u0623\u0639\u0644\u0649 \u0633\u0639\u0631\u064B\u0627" })] })] }), !all ? _jsx("div", { className: "grid md:grid-cols-3 gap-5", children: [0, 1, 2].map(i => _jsx("div", { className: "skeleton h-72" }, i)) })
                : list.length === 0 ? _jsx("p", { className: "text-muted", children: "\u0644\u0627 \u062A\u0648\u062C\u062F \u0643\u0648\u0631\u0633\u0627\u062A \u0645\u0637\u0627\u0628\u0642\u0629." }) : _jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: list.map(c => _jsx(CourseCard, { c: c }, c.id)) })] }));
}
