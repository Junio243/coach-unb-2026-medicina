import React, { useEffect, useState } from "react";
import { listHistory } from "../services/historyService.js";
import { createQuizFromPayload } from "../services/quizService.js";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner.jsx";
import Modal from "../components/Modal.jsx";
import Badge from "../components/Badge.jsx";
import PlanView from "../components/history/PlanView.jsx";
import FlashcardsView from "../components/history/FlashcardsView.jsx";
import QuizView from "../components/history/QuizView.jsx";
import ProfessorView from "../components/history/ProfessorView.jsx";
import PsychoView from "../components/history/PsychoView.jsx";

export default function HistoryPage() {
  const [kind, setKind] = useState("");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(9);
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

  const filtered = items.filter((i) =>
    search ? (i.subject || "").toLowerCase().includes(search.toLowerCase()) : true
  );

  function renderCard(item) {
    const date = new Date(item.created_at).toLocaleDateString("pt-BR");
    const title = item.payload?.title || item.subject || item.kind;
    return (
      <div key={item.id} className="rounded-2xl shadow-md p-4 bg-white flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold">{title}</div>
              <div className="text-xs text-slate-600">{date}</div>
            </div>
            <Badge>{item.kind}</Badge>
          </div>
        </div>
        <button
          onClick={() => setSelected(item)}
          className="mt-3 bg-blue-600 text-white rounded px-3 py-1 self-start"
        >
          Abrir
        </button>
      </div>
    );
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
        <Spinner label="Carregando" fullPage />
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.slice(0, visible).map((item) => renderCard(item))}
            {filtered.length === 0 && <div>Nenhum registro.</div>}
          </div>
          {visible < filtered.length && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setVisible((v) => v + 9)}
                className="px-4 py-2 bg-slate-200 rounded"
              >
                Carregar mais
              </button>
            </div>
          )}
        </>
      )}

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.subject || selected?.payload?.title}
      >
        {selected?.kind === 'plan' && <PlanView payload={selected.payload} />}
        {selected?.kind === 'flashcards' && (
          <FlashcardsView payload={selected.payload} id={selected.id} />
        )}
        {selected?.kind === 'quiz' && (
          <QuizView payload={selected.payload} onPlay={() => onPlay(selected)} />
        )}
        {selected?.kind === 'professor' && <ProfessorView payload={selected.payload} />}
        {selected?.kind === 'psycho' && <PsychoView payload={selected.payload} />}
      </Modal>
    </main>
  );
}
