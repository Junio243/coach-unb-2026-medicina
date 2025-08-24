import React, { useState } from "react";
import { generateSimulado } from "../services/geminiService.js";

export default function SimuladosPage() {
  const [materia, setMateria] = useState("Fisiologia");
  const [qtd, setQtd] = useState(10);
  const [nivel, setNivel] = useState("intermediario");

  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState({ questions: [] });
  const [error, setError] = useState("");

  async function onGerar() {
    try {
      setError("");
      setLoading(true);
      const data = await generateSimulado({
        subject: materia,
        count: Number(qtd) || 10,
        level: nivel,
      });
      setQuiz(data); // { questions: [...] }
    } catch (e) {
      setError(e.message || "Falha ao gerar simulado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gerar Simulado</h1>

      <div className="grid gap-3 mb-4">
        <label className="grid gap-1">
          <span>Matéria</span>
          <input
            className="border rounded px-3 py-2"
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            placeholder="Ex.: Fisiologia"
          />
        </label>

        <label className="grid gap-1">
          <span>Quantidade de questões</span>
          <input
            type="number"
            min="1"
            className="border rounded px-3 py-2"
            value={qtd}
            onChange={(e) => setQtd(e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span>Nível</span>
          <select
            className="border rounded px-3 py-2"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
          >
            <option value="iniciante">iniciante</option>
            <option value="intermediario">intermediário</option>
            <option value="avancado">avancado</option>
          </select>
        </label>

        <button
          onClick={onGerar}
          disabled={loading}
          className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Gerando..." : "Gerar Simulado"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 border border-red-300 rounded p-3 mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-4">
        {quiz.questions?.map((q) => (
          <div key={q.id} className="border rounded p-3">
            <div className="font-semibold mb-2">{q.statement}</div>
            <ol className="list-decimal pl-5 space-y-1">
              {q.options?.map((opt, i) => (
                <li key={i}>
                  {opt}
                  {/* Para marcar a correta, descomente: */}
                  {/* {i === q.correctIndex ? " ✅" : ""} */}
                </li>
              ))}
            </ol>
            {q.explanation && (
              <div className="mt-2 text-sm text-slate-600">
                Explicação: {q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
