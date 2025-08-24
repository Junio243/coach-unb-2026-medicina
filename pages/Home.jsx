import React, { useEffect, useState } from 'react';
import { listUserSubjects } from '../services/subjectsService.js';
import { supabase } from '../services/supabaseClient.js';
import Spinner from '../components/Spinner.jsx';

export default function Home() {
  const [user, setUser] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        try {
          const subs = await listUserSubjects();
          setSubjects(subs);
        } catch {
          // ignore
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <Spinner fullPage label="Carregando" />;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <section className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Coach UnB</h1>
        <p className="text-slate-700 mb-6">Estudo guiado do zero ao avançado</p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="#/planner" className="px-4 py-2 bg-indigo-600 text-white rounded">Começar pelo Plano</a>
          <a href="#/professor" className="px-4 py-2 bg-purple-600 text-white rounded">Aula com Professor IA</a>
          <a href="#/history" className="px-4 py-2 bg-slate-600 text-white rounded">Ver Histórico</a>
          {user ? (
            <a href="#/perfil" className="px-4 py-2 bg-green-600 text-white rounded">Perfil</a>
          ) : (
            <a href="#/login" className="px-4 py-2 bg-green-600 text-white rounded">Entrar</a>
          )}
        </div>
      </section>
      {user && (
        <section className="mb-8 text-center">
          <h2 className="text-xl font-semibold mb-3">Bem-vindo, {user.user_metadata?.full_name || user.email}</h2>
          {subjects.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              {subjects.map((s) => (
                <a
                  key={s.id}
                  href={`#/planner?subject=${encodeURIComponent(s.subject)}`}
                  className="px-3 py-1 bg-slate-200 rounded-full text-sm"
                >
                  {s.subject}
                </a>
              ))}
            </div>
          )}
        </section>
      )}
      <section className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl shadow-md">
          <h3 className="font-semibold mb-1">Plano inteligente</h3>
          <p className="text-sm">Organize sua rotina com IA.</p>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow-md">
          <h3 className="font-semibold mb-1">Professor IA</h3>
          <p className="text-sm">Aulas personalizadas em segundos.</p>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow-md">
          <h3 className="font-semibold mb-1">Flashcards</h3>
          <p className="text-sm">Memorize com técnica.</p>
        </div>
        <div className="p-4 bg-white rounded-2xl shadow-md">
          <h3 className="font-semibold mb-1">Simulados</h3>
          <p className="text-sm">Teste seus conhecimentos.</p>
        </div>
      </section>
    </div>
  );
}
