import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, Protected } from './lib/auth';
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Lesson from './pages/Lesson';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
export default function App() {
    return (_jsx(BrowserRouter, { basename: import.meta.env.BASE_URL, children: _jsx(AuthProvider, { children: _jsx(Routes, { children: _jsxs(Route, { element: _jsx(PublicLayout, {}), children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/courses", element: _jsx(Courses, {}) }), _jsx(Route, { path: "/courses/:courseId", element: _jsx(CourseDetails, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(Protected, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/lessons/:lessonId", element: _jsx(Protected, { children: _jsx(Lesson, {}) }) }), _jsx(Route, { path: "/admin", element: _jsx(Protected, { admin: true, children: _jsx(Admin, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }) }) }));
}
