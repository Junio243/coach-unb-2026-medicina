import React, { useState } from "react";
import { generateFlashcards } from "../services/geminiService.js";

export default function FlashcardsPage() {
  const [assunto, setAssunto] = useState("Biologia celular");
  const [qtd, setQtd] = useState(10);
  const [nivel, setNivel] = useState("intermediario");

  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState("");

  async function onGerar() {
    try {
      setError("");
      setLoading(true);
      const data = await generateFlashcards({
        subject: assunto,
        count: Number(qtd) || 10,
        level: nivel,
      });
      setCards(data);
    } catch (e) {
      setError(e.message || "Falha ao gerar flashcards.");
    } finally {
      setLoading(false);
    }
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
