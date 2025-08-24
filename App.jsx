import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, NavLink, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore.js';
import Header from './components/Header.jsx';
import AccessibilityBar from './components/AccessibilityBar.jsx';

// Static imports to prevent runtime loading errors in a build-less environment
import Onboarding from './pages/Onboarding.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Planner from './pages/Planner.jsx';
import Tutor from './pages/Tutor.jsx';
import Simulados from './pages/Simulados.jsx';
import Flashcards from './pages/Flashcards.jsx';
import ExamInfo from './pages/ExamInfo.jsx';


const App = () => {
    const { isOnboardingComplete, accessibility } = useStore();
    
    useEffect(() => {
        document.documentElement.classList.toggle('dark', accessibility.highContrast);
        document.body.style.fontSize = `${accessibility.fontSize}rem`;
        document.body.style.letterSpacing = `${accessibility.letterSpacing}px`;
        if (accessibility.reduceMotion) {
            document.documentElement.classList.add('reduce-motion');
        } else {
            document.documentElement.classList.remove('reduce-motion');
        }
    }, [accessibility]);

    return (
        <HashRouter>
            <div className={`app-container font-sans ${accessibility.font === 'hyperlegible' ? 'font-[Atkinson_Hyperlegible]' : 'font-sans'}`}>
                <AccessibilityBar />
                <div className="flex min-h-screen">
                    {isOnboardingComplete && <Sidebar />}
                    <div className="flex-1 flex flex-col">
                         {isOnboardingComplete && <Header />}
                        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-100 dark:bg-slate-800">
                            <Routes>
                                <Route path="/" element={isOnboardingComplete ? <Navigate to="/dashboard" /> : <Navigate to="/onboarding" />} />
                                <Route path="/onboarding" element={<Onboarding />} />
                                <Route path="/dashboard" element={isOnboardingComplete ? <Dashboard /> : <Navigate to="/onboarding" />} />
                                <Route path="/planner" element={isOnboardingComplete ? <Planner /> : <Navigate to="/onboarding" />} />
                                <Route path="/tutor" element={isOnboardingComplete ? <Tutor /> : <Navigate to="/onboarding" />} />
                                <Route path="/simulados" element={isOnboardingComplete ? <Simulados /> : <Navigate to="/onboarding" />} />
                                <Route path="/flashcards" element={isOnboardingComplete ? <Flashcards /> : <Navigate to="/onboarding" />} />
                                <Route path="/exam-info" element={isOnboardingComplete ? <ExamInfo /> : <Navigate to="/onboarding" />} />
                            </Routes>
                        </main>
                    </div>
                </div>
            </div>
        </HashRouter>
    );
};


const Sidebar = () => {
    const navItems = [
        { href: '/dashboard', label: 'Painel', icon: <HomeIcon /> },
        { href: '/planner', label: 'Planejador', icon: <CalendarIcon /> },
        { href: '/tutor', label: 'Tutor IA', icon: <SparklesIcon /> },
        { href: '/simulados', label: 'Simulados', icon: <ClipboardCheckIcon /> },
        { href: '/flashcards', label: 'Flashcards', icon: <LayersIcon /> },
        { href: '/exam-info', label: 'Sobre a Prova', icon: <InfoIcon /> },
    ];

    const location = useLocation();

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex-shrink-0">
            <div className="p-4">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Coach UnB</h1>
            </div>
            <nav className="mt-4">
                <ul>
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <NavLink
                                to={item.href}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 ${
                                        isActive ? 'bg-slate-100 dark:bg-slate-800 border-r-4 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-semibold' : ''
                                    }`
                                }
                            >
                                <span className="mr-3">{item.icon}</span>
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

// SVG Icon Components
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 12l-2.293 2.293a1 1 0 01-1.414 0L4 12l2.293-2.293a1 1 0 011.414 0L10 12m3-6l2.293 2.293a1 1 0 010 1.414L13 12l-2.293 2.293a1 1 0 01-1.414 0L7 12l2.293-2.293a1 1 0 011.414 0L13 12m7-3l2.293 2.293a1 1 0 010 1.414L17 12l-2.293 2.293a1 1 0 01-1.414 0L11 12l2.293-2.293a1 1 0 011.414 0L17 12z" /></svg>;
const ClipboardCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
const LayersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


export default App;