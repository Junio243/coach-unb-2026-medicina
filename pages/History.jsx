import React, { useEffect, useState } from "react";
import { listHistory } from "../services/historyService.js";
import { createQuizFromPayload } from "../services/quizService.js";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const [kind, setKind] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function load() {
    try {
      setLoading(true);
      setError("");
      const data = await listHistory({ kind: kind || undefined });
      setItems(data);
    } catch (e) {
      setError(e.message || "Falha ao carregar histórico.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [kind]);

  async function onPlay(item) {
    try {
      const quiz = await createQuizFromPayload({
        subject: item.subject,
        meta: item.params,
        questions: item.payload?.questions || [],
      });
      navigate(`/quiz/${quiz.id}`);
    } catch (e) {
      alert(e.message);
    }
  }

  function onStudy(item) {
    navigate(`/flashcards/${item.id}`);
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Histórico</h1>

      <div className="mb-4">
        <label className="mr-2">Filtrar:</label>
        <select
          className="border rounded px-2 py-1"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
        >
          <option value="">todos</option>
          <option value="plan">planos</option>
          <option value="flashcards">flashcards</option>
          <option value="quiz">simulados</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 border border-red-300 rounded p-3 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="border rounded p-4 bg-white">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <div className="font-semibold">{item.kind}</div>
                  {item.subject && <div className="text-sm text-slate-600">{item.subject}</div>}
                  <div className="text-xs text-slate-500">
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>
                {item.kind === "quiz" && (
                  <button
                    onClick={() => onPlay(item)}
                    className="bg-blue-600 text-white rounded px-3 py-1"
                  >
                    Jogar
                  </button>
                )}
                {item.kind === "flashcards" && (
                  <button
                    onClick={() => onStudy(item)}
                    className="bg-green-600 text-white rounded px-3 py-1"
                  >
                    Estudar
                  </button>
                )}
              </div>
              {item.kind === "plan" && (
                <pre className="bg-slate-100 p-2 rounded overflow-auto text-xs">
{JSON.stringify(item.payload, null, 2)}
                </pre>
              )}
            </li>
          ))}
          {items.length === 0 && <li>Nenhum registro.</li>}
        </ul>
      )}
    </main>
  );
}
