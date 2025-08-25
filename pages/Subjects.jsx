import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listUserSubjects, addUserSubject, removeUserSubject } from "../services/subjectsService.js";
import defaultSubjects from "../data/subjects.json";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");
      const data = await listUserSubjects();
      setSubjects(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onAdd(e) {
    e.preventDefault();
    try {
      await addUserSubject(name.trim());
      setName("");
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  async function onRemove(id) {
    try {
      await removeUserSubject(id);
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="p-6 max-w-lg mx-auto space-y-8">
      <section>
        <h1 className="text-2xl font-bold mb-4">Disciplinas do preparatório</h1>
        <p className="mb-4">
          Nossa plataforma indica a teoria essencial e oferece questões no modelo Cebraspe,
          minissimulados por matéria, testes práticos comentados e exercícios de aprofundamento.
        </p>
        <ul className="space-y-4">
          {defaultSubjects.map((s) => (
            <li key={s.id}>
              <Link to={`/subjects/${s.id}`} className="block p-4 border rounded-lg bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{s.name}</h3>
                <p className="text-slate-600 dark:text-slate-300 mt-1">{s.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Minhas matérias</h2>

      <form onSubmit={onAdd} className="flex gap-2 mb-4">
        <input
          className="border rounded px-3 py-2 flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nova matéria"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2"
          disabled={!name.trim()}
        >
          Adicionar
        </button>
      </form>

      {error && (
        <div className="bg-red-100 text-red-800 border border-red-300 rounded p-3 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <ul className="space-y-2">
          {subjects.map((s) => (
            <li key={s.id} className="p-4 border rounded-lg bg-white dark:bg-slate-800 shadow-sm flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{s.name}</h3>
              <button
                onClick={() => onRemove(s.id)}
                className="text-red-600 hover:text-red-800 dark:hover:text-red-400"
                aria-label={`Remover ${s.name}`}
              >
                Excluir
              </button>
            </li>
          ))}
          {subjects.length === 0 && <li className="text-slate-500 dark:text-slate-400">Nenhuma matéria salva.</li>}
        </ul>
      )}
      </section>
    </main>
  );
}
