import React from 'react';
import { useParams } from 'react-router-dom';
import subjects from '../data/subjects.json';
import Spinner from '../components/Spinner.jsx';

export default function SubjectDetailsPage() {
  const { subjectId } = useParams();
  const subject = subjects.find(s => s.id === subjectId);

  if (!subject) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Disciplina não encontrada</h1>
        <p>A disciplina que você está procurando não existe.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{subject.name}</h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">{subject.description}</p>
      </header>

      <section>
        <h2 className="text-2xl font-bold border-b pb-2 mb-4">Tópicos da Matéria</h2>
        <div className="text-slate-500">
            <p>Em breve, os tópicos de estudo para esta matéria serão exibidos aqui.</p>
        </div>
      </section>
    </div>
  );
}
