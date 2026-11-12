import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from './supabase';
const Ctx = createContext({ session: null, profile: null, loading: true });
export const useAuth = () => useContext(Ctx);
export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const apply = async (s) => {
            setSession(s);
            if (!s) {
                setProfile(null);
                setLoading(false);
                return;
            }
            const { data } = await supabase.from('profiles').select('full_name,phone,avatar_url,role').eq('id', s.user.id).maybeSingle();
            setProfile(data);
            setLoading(false);
        };
        supabase.auth.getSession().then(({ data }) => apply(data.session));
        const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { void apply(s); });
        return () => sub.subscription.unsubscribe();
    }, []);
    return _jsx(Ctx.Provider, { value: { session, profile, loading }, children: children });
}
// Role comes from the profiles table (protected by RLS), never from the browser.
export function Protected({ children, admin }) {
    const { session, profile, loading } = useAuth();
    const loc = useLocation();
    if (loading)
        return _jsx("div", { className: "skeleton m-6 h-40" });
    if (!session)
        return _jsx(Navigate, { to: "/login", replace: true, state: { from: loc.pathname } });
    if (admin && profile?.role !== 'admin')
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    return _jsx(_Fragment, { children: children });
}
