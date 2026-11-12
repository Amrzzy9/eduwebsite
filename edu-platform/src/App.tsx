import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider, Protected } from './lib/auth'
import PublicLayout from './layouts/PublicLayout'
import Home from './pages/Home'; import Courses from './pages/Courses'; import CourseDetails from './pages/CourseDetails'
import Login from './pages/Login'; import Register from './pages/Register'; import Dashboard from './pages/Dashboard'
import Lesson from './pages/Lesson'; import Admin from './pages/Admin'; import NotFound from './pages/NotFound'

export default function App() {
  return (<BrowserRouter basename={import.meta.env.BASE_URL}><AuthProvider><Routes><Route element={<PublicLayout />}>
    <Route path="/" element={<Home />} /><Route path="/courses" element={<Courses />} /><Route path="/courses/:courseId" element={<CourseDetails />} />
    <Route path="/login" element={<Login />} /><Route path="/register" element={<Register />} />
    <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
    <Route path="/lessons/:lessonId" element={<Protected><Lesson /></Protected>} />
    <Route path="/admin" element={<Protected admin><Admin /></Protected>} /><Route path="*" element={<NotFound />} />
  </Route></Routes></AuthProvider></BrowserRouter>)
}
