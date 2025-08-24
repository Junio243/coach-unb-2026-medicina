import React, { useEffect, useState } from "react";
import { listHistory } from "../services/historyService.js";
import { createQuizFromPayload } from "../services/quizService.js";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const [kind, setKind] = useState("");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [showJson, setShowJson] = useState(false);
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

  const filtered = items.filter((i) =>
    search ? (i.subject || "").toLowerCase().includes(search.toLowerCase()) : true
  );

  function renderCard(item) {
    const date = new Date(item.created_at).toLocaleDateString("pt-BR");
    if (item.kind === "plan") {
      const subs = item.payload?.exam_overview?.subjects || [];
      return (
        <div key={item.id} className="rounded-2xl shadow-md p-4 bg-white">
          <div className="font-semibold">Plano salvo em {date}</div>
          {subs.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 text-xs">
              {subs.map((s, i) => (
                <span key={i} className="bg-slate-200 px-2 py-0.5 rounded-full">{s}</span>
              ))}
            </div>
          )}
          <button
            onClick={() => {
              setSelected(item);
              setShowJson(false);
            }}
            className="mt-3 bg-blue-600 text-white rounded px-3 py-1"
          >
            Abrir
          </button>
        </div>
      );
    }
    if (item.kind === "flashcards") {
      const count = Array.isArray(item.payload) ? item.payload.length : 0;
      return (
        <div key={item.id} className="rounded-2xl shadow-md p-4 bg-white">
          <div className="font-semibold">Flashcards</div>
          <div className="text-sm mt-1">{count} cards</div>
          <button
            onClick={() => onStudy(item)}
            className="mt-3 bg-green-600 text-white rounded px-3 py-1"
          >
            Estudar agora
          </button>
        </div>
      );
    }
    if (item.kind === "quiz") {
      const count = item.payload?.questions?.length || 0;
      return (
        <div key={item.id} className="rounded-2xl shadow-md p-4 bg-white">
          <div className="font-semibold">Simulado</div>
          <div className="text-sm mt-1">{count} questões</div>
          <button
            onClick={() => onPlay(item)}
            className="mt-3 bg-indigo-600 text-white rounded px-3 py-1"
          >
            Jogar agora
          </button>
        </div>
      );
    }
    if (item.kind === "professor") {
      return (
        <div key={item.id} className="rounded-2xl shadow-md p-4 bg-white">
          <div className="font-semibold">{item.payload?.title || item.subject}</div>
          <button
            onClick={() => navigate(`/professor?history=${item.id}`)}
            className="mt-3 bg-purple-600 text-white rounded px-3 py-1"
          >
            Ler explicação
          </button>
        </div>
      );
    }
    if (item.kind === "psycho") {
      return (
        <div key={item.id} className="rounded-2xl shadow-md p-4 bg-white">
          <div className="font-semibold">{item.payload?.summary || item.subject}</div>
          <button
            onClick={() => navigate(`/psycho?history=${item.id}`)}
            className="mt-3 bg-teal-600 text-white rounded px-3 py-1"
          >
            Ver intervenções
          </button>
        </div>
      );
    }
    return null;
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Histórico</h1>
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="mr-2">Filtrar:</label>
          <select
            className="border rounded px-2 py-1"
            value={kind}
            onChange={(e) => setKind(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="plan">Plan</option>
            <option value="flashcards">Flashcards</option>
            <option value="quiz">Quiz</option>
            <option value="professor">Professor</option>
            <option value="psycho">Psycho</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Buscar assunto"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 border border-red-300 rounded p-3 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div>Carregando...</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => renderCard(item))}
          {filtered.length === 0 && <div>Nenhum registro.</div>}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 max-w-xl w-full max-h-full overflow-y-auto">
            <div className="font-semibold mb-2">{selected.subject || selected.kind}</div>
            {selected.kind === "plan" && (
              <div className="text-sm mb-2">
                {selected.payload?.exam_overview?.exam_name}
              </div>
            )}
            <button
              onClick={() => setShowJson((s) => !s)}
              className="text-blue-600 text-sm underline"
            >
              {showJson ? "Ocultar JSON" : "Ver JSON"}
            </button>
            {showJson && (
              <pre className="bg-slate-100 p-2 rounded mt-2 overflow-auto text-xs">
                {JSON.stringify(selected.payload, null, 2)}
              </pre>
            )}
            <div className="text-right mt-4">
              <button
                onClick={() => setSelected(null)}
                className="bg-slate-600 text-white px-3 py-1 rounded"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
