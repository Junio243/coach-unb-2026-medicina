import React, { useEffect, useState } from "react";
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
        <ul className="list-disc pl-5">
          {defaultSubjects.map((s) => (
            <li key={s}>{s}</li>
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
            <li key={s.id} className="border rounded px-3 py-2 flex justify-between items-center bg-white">
              <span>{s.subject}</span>
              <button
                onClick={() => onRemove(s.id)}
                className="text-red-600"
              >
                Excluir
              </button>
            </li>
          ))}
          {subjects.length === 0 && <li>Nenhuma matéria salva.</li>}
        </ul>
      )}
      </section>
    </main>
  );
}
