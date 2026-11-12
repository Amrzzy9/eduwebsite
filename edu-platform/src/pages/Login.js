import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
export default function Login() {
    const nav = useNavigate();
    const loc = useLocation();
    const from = loc.state?.from;
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [err, setErr] = useState('');
    const [busy, setBusy] = useState(false);
    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        setErr('');
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error || !data.user) {
            setErr('البريد أو كلمة المرور غير صحيحة');
            setBusy(false);
            return;
        }
        const { data: p } = await supabase.from('profiles').select('role').eq('id', data.user.id).maybeSingle();
        nav(p?.role === 'admin' ? '/admin' : from && from !== '/admin' ? from : '/dashboard', { replace: true });
    };
    return (_jsx("main", { className: "max-w-md mx-auto px-4 py-12", children: _jsxs("form", { onSubmit: submit, className: "bg-card rounded-3xl p-6 space-y-4", children: [_jsx("h1", { className: "text-2xl font-extrabold", children: "\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644" }), _jsx("input", { className: "input", type: "email", required: true, placeholder: "\u0627\u0644\u0628\u0631\u064A\u062F \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A", value: email, onChange: e => setEmail(e.target.value) }), _jsx("input", { className: "input", type: "password", required: true, placeholder: "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631", value: pw, onChange: e => setPw(e.target.value) }), err && _jsx("p", { className: "text-red-400 text-sm", children: err }), _jsx("button", { disabled: busy, className: "btn btn-p w-full", children: "\u062F\u062E\u0648\u0644" }), _jsxs("p", { className: "text-sm text-muted", children: ["\u0644\u064A\u0633 \u0644\u062F\u064A\u0643 \u062D\u0633\u0627\u0628\u061F ", _jsx(Link, { to: "/register", className: "text-sky", children: "\u0625\u0646\u0634\u0627\u0621 \u062D\u0633\u0627\u0628" })] })] }) }));
}
