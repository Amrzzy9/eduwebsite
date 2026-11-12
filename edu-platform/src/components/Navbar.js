import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import Avatar from './Avatar';
export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { session, profile } = useAuth();
    const nav = useNavigate();
    const links = [['/', 'الرئيسية'], ['/courses', 'الكورسات'],
        ...(session ? [['/dashboard', 'لوحتي']] : [['/login', 'تسجيل الدخول'], ['/register', 'إنشاء حساب']]),
        ...(profile?.role === 'admin' ? [['/admin', 'الإدارة']] : [])];
    const cls = ({ isActive }) => isActive ? 'text-sky font-bold' : 'text-ink hover:text-sky';
    const out = async () => { await supabase.auth.signOut(); setOpen(false); nav('/'); };
    return (_jsxs("header", { className: "sticky top-3 z-50 mx-3 md:mx-auto max-w-6xl", children: [_jsxs("nav", { className: "glass rounded-2xl px-4 py-3 flex items-center justify-between", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-2 font-extrabold text-sky", children: [_jsx(GraduationCap, {}), " \u0645\u0646\u0635\u062A\u064A"] }), _jsxs("div", { className: "hidden md:flex gap-6 items-center", children: [links.map(([to, t]) => _jsx(NavLink, { to: to, end: to === '/', className: cls, children: t }, to)), session && _jsxs(_Fragment, { children: [_jsx("button", { onClick: out, className: "text-muted hover:text-sky", children: "\u062E\u0631\u0648\u062C" }), _jsx(Avatar, { name: profile?.full_name || '?', url: profile?.avatar_url, size: 32 })] })] }), _jsx("button", { className: "md:hidden", "aria-label": "\u0627\u0644\u0642\u0627\u0626\u0645\u0629", onClick: () => setOpen(!open), children: open ? _jsx(X, {}) : _jsx(Menu, {}) })] }), open && _jsxs("div", { className: "glass md:hidden mt-2 rounded-2xl p-3 flex flex-col", children: [links.map(([to, t]) => _jsx(NavLink, { to: to, end: to === '/', onClick: () => setOpen(false), className: (s) => cls(s) + ' px-3 py-3 rounded-xl', children: t }, to)), session && _jsx("button", { onClick: out, className: "px-3 py-3 text-start text-muted", children: "\u062E\u0631\u0648\u062C" })] })] }));
}
