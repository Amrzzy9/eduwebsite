import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { configured } from '../lib/supabase'
export default function PublicLayout() {
  return <><Navbar />{!configured && <div className="m-3 rounded-xl bg-amber-500/15 text-amber-200 text-center text-sm p-2">لم يتم ضبط Supabase بعد. انظر README.</div>}<Outlet /><Footer /></>
}
