import React from 'react';
import { useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const getTitle = () => {
        switch(location.pathname) {
            case '/dashboard': return 'Painel de Progresso';
            case '/planner': return 'Planejador de Estudos';
            case '/tutor': return 'Tutor IA';
            case '/simulados': return 'Simulados Cebraspe';
            case '/flashcards': return 'Flashcards';
            case '/exam-info': return 'Sobre a Prova';
            default: return 'Coach UnB';
        }
    }

    return (
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{getTitle()}</h1>
            <div>
                {/* User Profile / Settings can go here */}
            </div>
        </header>
    );
};

export default Header;