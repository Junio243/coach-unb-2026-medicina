import React, { useState } from "react";
import { generateStudyPlan } from "../services/geminiService.js";

export default function PlannerPage() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");

  async function onGerarPlano() {
    try {
      setError("");
      setLoading(true);
      const data = await generateStudyPlan({
        objetivo: "Aprovação em Medicina na UnB 2026",
        pontosFracos: "Física e Matemática",
        disponibilidade: "Manhãs de segunda a sábado",
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

      <button
        onClick={onGerarPlano}
        disabled={loading}
        className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
      >
        {loading ? "Gerando..." : "Gerar Plano Semanal"}
      </button>

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
