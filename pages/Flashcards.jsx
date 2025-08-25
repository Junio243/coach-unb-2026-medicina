import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { generateFlashcards } from "../services/geminiService.js";
import { saveHistory, getHistoryById } from "../services/historyService.js";
import { listUserSubjects } from "../services/subjectsService.js";

export default function FlashcardsPage() {
  const [assunto, setAssunto] = useState("Biologia celular");
  const [qtd, setQtd] = useState(10);
  const [nivel, setNivel] = useState("intermediario");

  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [subjects, setSubjects] = useState([]);
  const { historyId } = useParams();
  const [searchParams] = useSearchParams();
  const [studyIndex, setStudyIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    listUserSubjects().then(setSubjects).catch(() => {});
  }, []);

  useEffect(() => {
    const subj = searchParams.get("subject");
    if (subj) setAssunto(subj);
  }, [searchParams]);

  useEffect(() => {
    async function loadFromHistory() {
      if (!historyId) return;
      try {
        setLoading(true);
        const h = await getHistoryById(historyId);
        setCards(h.payload || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    loadFromHistory();
  }, [historyId]);

  async function onGerar() {
    try {
      setError("");
      setInfo("");
      setLoading(true);
      const data = await generateFlashcards({
        subject: assunto,
        count: Number(qtd) || 10,
        level: nivel,
      });
      setCards(data);
      try {
        await saveHistory({
          kind: "flashcards",
          subject: assunto,
          params: { count: Number(qtd) || 10, level: nivel },
          payload: data,
        });
        setInfo("Salvo no histórico.");
      } catch (err) {
        setInfo(err.message);
      }
    } catch (e) {
      setError(e.message || "Falha ao gerar flashcards.");
    } finally {
      setLoading(false);
    }
  }

  function nextCard() {
    setStudyIndex((i) => (i + 1) % cards.length);
    setShowBack(false);
  }

  if (historyId) {
    return (
      <main className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">Flashcards</h1>
        {loading && <div>Carregando...</div>}
        {error && (
          <div className="bg-red-100 text-red-800 border border-red-300 rounded p-3 mb-4">
            {error}
          </div>
        )}
        {cards.length > 0 && (
          <div className="text-center">
            <div
              className="border rounded p-6 mb-4 bg-white cursor-pointer"
              onClick={() => setShowBack(!showBack)}
            >
              {showBack ? cards[studyIndex].back : cards[studyIndex].front}
            </div>
            <button
              onClick={nextCard}
              className="bg-blue-600 text-white rounded px-4 py-2"
            >
              Próximo
            </button>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gerar Flashcards</h1>

      <div className="grid gap-3 mb-4">
        <label className="grid gap-1">
          <span>Assunto</span>
          <input
            className="border rounded px-3 py-2"
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            placeholder="Ex.: Citologia"
          />
        </label>
        {subjects.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm">Minhas matérias:</span>
            {subjects.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setAssunto(s.subject)}
                className="px-2 py-1 bg-slate-200 rounded text-sm"
              >
                {s.subject}
              </button>
            ))}
          </div>
        )}

        <label className="grid gap-1">
          <span>Quantidade</span>
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
          {loading ? "Gerando..." : "Gerar Flashcards"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 border border-red-300 rounded p-3 mb-4">
          {error}
        </div>
      )}
      {info && (
        <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded p-3 mb-4">
          {info}
        </div>
      )}

      <div className="grid gap-3">
        {cards.map((c) => (
          <div key={c.id} className="border rounded p-3">
            <div className="font-semibold">Q: {c.front}</div>
            <div className="mt-2">A: {c.back}</div>
            {c.difficulty && (
              <div className="mt-1 text-sm text-slate-600">
                dificuldade: {c.difficulty}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
