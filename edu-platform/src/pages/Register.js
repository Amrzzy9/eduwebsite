import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
export default function Register() {
    const nav = useNavigate();
    const [f, setF] = useState({ name: '', email: '', phone: '', pw: '', pw2: '' });
    const [err, setErr] = useState('');
    const [msg, setMsg] = useState('');
    const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
    const submit = async (e) => {
        e.preventDefault();
        setErr('');
        if (f.pw.length < 8)
            return setErr('كلمة المرور 8 أحرف على الأقل');
        if (f.pw !== f.pw2)
            return setErr('كلمتا المرور غير متطابقتين');
        const { data, error } = await supabase.auth.signUp({ email: f.email, password: f.pw, options: { data: { full_name: f.name.trim(), phone: f.phone.trim() } } });
        if (error)
            return setErr(error.message);
        if (data.session)
            nav('/dashboard', { replace: true });
        else
            setMsg('تم إنشاء الحساب. تحقق من بريدك لتفعيله ثم سجّل الدخول.');
    };
    return (_jsx("main", { className: "max-w-md mx-auto px-4 py-12", children: _jsxs("form", { onSubmit: submit, className: "bg-card rounded-3xl p-6 space-y-4", children: [_jsx("h1", { className: "text-2xl font-extrabold", children: "\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628" }), _jsx("input", { className: "input", required: true, placeholder: "\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644", value: f.name, onChange: set('name') }), _jsx("input", { className: "input", type: "email", required: true, placeholder: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A", value: f.email, onChange: set('email') }), _jsx("input", { className: "input", type: "tel", required: true, placeholder: "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062A\u0641", value: f.phone, onChange: set('phone') }), _jsx("input", { className: "input", type: "password", required: true, placeholder: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631", value: f.pw, onChange: set('pw') }), _jsx("input", { className: "input", type: "password", required: true, placeholder: "\u062A\u0623\u0643\u064A\u062F \u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631", value: f.pw2, onChange: set('pw2') }), err && _jsx("p", { className: "text-red-400 text-sm", children: err }), msg && _jsx("p", { className: "text-sky text-sm", children: msg }), _jsx("button", { className: "btn btn-p w-full", children: "\u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062D\u0633\u0627\u0628" }), _jsxs("p", { className: "text-sm text-muted", children: ["\u0644\u062F\u064A\u0643 \u062D\u0633\u0627\u0628\u061F ", _jsx(Link, { to: "/login", className: "text-sky", children: "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" })] })] }) }));
}
