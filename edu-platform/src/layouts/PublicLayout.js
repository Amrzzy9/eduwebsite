import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { configured } from '../lib/supabase';
export default function PublicLayout() {
    return _jsxs(_Fragment, { children: [_jsx(Navbar, {}), !configured && _jsx("div", { className: "m-3 rounded-xl bg-amber-500/15 text-amber-200 text-center text-sm p-2", children: "\u0644\u0645 \u064A\u062A\u0645 \u0636\u0628\u0637 Supabase \u0628\u0639\u062F. \u0627\u0646\u0638\u0631 README." }), _jsx(Outlet, {}), _jsx(Footer, {})] });
}
