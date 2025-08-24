import React, { useState } from "react";
import { generateStudyPlan } from "../services/geminiService.js";

export default function PlannerPage() {
  const [objetivo, setObjetivo] = useState("Aprovação em Medicina na UnB 2026");
  const [pontosFracos, setPontosFracos] = useState("Física e Matemática");
  const [disponibilidade, setDisponibilidade] = useState("Manhãs de segunda a sábado");

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");

  async function onGerarPlano() {
    try {
      setError("");
      setLoading(true);
      const data = await generateStudyPlan({
        objetivo,
        pontosFracos,
        disponibilidade,
      });
      setPlan(data);
    } catch (e) {
      setError(e.message || "Falha ao gerar plano.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Plano Semanal</h1>

      <div className="grid gap-3 mb-4 max-w-lg">
        <label className="grid gap-1">
          <span>Objetivo</span>
          <input
            className="border rounded px-3 py-2"
            value={objetivo}
            onChange={(e) => setObjetivo(e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span>Pontos fracos</span>
          <input
            className="border rounded px-3 py-2"
            value={pontosFracos}
            onChange={(e) => setPontosFracos(e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span>Disponibilidade</span>
          <input
            className="border rounded px-3 py-2"
            value={disponibilidade}
            onChange={(e) => setDisponibilidade(e.target.value)}
          />
        </label>

        <button
          onClick={onGerarPlano}
          disabled={loading}
          className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Gerando..." : "Gerar Plano Semanal"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 border border-red-300 rounded p-3 mt-4">
          {error}
        </div>
      )}

      {plan && (
        <pre className="mt-4 p-3 border rounded bg-slate-50 overflow-auto text-sm">
{JSON.stringify(plan, null, 2)}
        </pre>
      )}
    </main>
  );
}
