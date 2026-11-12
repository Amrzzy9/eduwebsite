import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
const sections = ['نظرة عامة', 'الكورسات', 'المواد', 'الوحدات', 'الدروس', 'الطلاب', 'الاشتراكات', 'المدفوعات', 'محتوى الموقع', 'طرق الدفع', 'الإعدادات'];
const tables = { 'الكورسات': 'courses', 'الدروس': 'lessons', 'الطلاب': 'profiles', 'الاشتراكات': 'subscriptions', 'المدفوعات': 'payment_requests' };
export default function Admin() {
    const [n, setN] = useState({});
    const [tab, setTab] = useState(sections[0]);
    useEffect(() => { Object.entries(tables).forEach(([k, t]) => supabase.from(t).select('*', { count: 'exact', head: true }).then(({ count }) => setN(p => ({ ...p, [k]: count ?? 0 })))); }, []);
    return (_jsxs("main", { className: "max-w-6xl mx-auto px-4 py-8 grid md:grid-cols-[220px_1fr] gap-6", children: [_jsx("nav", { className: "bg-card rounded-2xl p-2 flex md:flex-col gap-1 overflow-x-auto", children: sections.map(s => _jsx("button", { onClick: () => setTab(s), className: `px-3 py-2 rounded-xl text-start whitespace-nowrap ${tab === s ? 'bg-mist text-sky' : 'text-muted'}`, children: s }, s)) }), _jsxs("section", { className: "bg-card rounded-2xl p-6", children: [_jsx("h1", { className: "text-xl font-extrabold mb-4", children: tab }), tab === 'نظرة عامة' ? _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3", children: Object.keys(tables).map(k => _jsxs("div", { className: "bg-mist rounded-xl p-4", children: [_jsx("b", { className: "text-2xl text-sky", children: n[k] ?? '…' }), _jsx("div", { className: "text-sm text-muted", children: k })] }, k)) })
                        : _jsx("p", { className: "text-muted", children: "\u0648\u0627\u062C\u0647\u0629 \u0625\u062F\u0627\u0631\u0629 \u0647\u0630\u0627 \u0627\u0644\u0642\u0633\u0645 \u0644\u0645 \u062A\u064F\u0646\u0641\u064E\u0651\u0630 \u0628\u0639\u062F. \u062D\u0627\u0644\u064A\u064B\u0627 \u062A\u064F\u062F\u0627\u0631 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A \u0645\u0646 Supabase Table Editor\u060C \u0648\u0633\u064A\u0627\u0633\u0627\u062A RLS \u062A\u0633\u0645\u062D \u0644\u0644\u0645\u062F\u064A\u0631 \u0641\u0642\u0637." })] })] }));
}
