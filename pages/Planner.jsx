import React, { useEffect, useState } from "react";
import { generateStudyPlan } from "../services/geminiService.js";
import { saveHistory } from "../services/historyService.js";
import { listUserSubjects } from "../services/subjectsService.js";

export default function PlannerPage() {
  const [objetivo, setObjetivo] = useState("Aprovação em Medicina na UnB 2026");
  const [pontosFracos, setPontosFracos] = useState("Física e Matemática");
  const [disponibilidade, setDisponibilidade] = useState("Manhãs de segunda a sábado");

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    listUserSubjects().then(setSubjects).catch(() => {});
  }, []);

  async function onGerarPlano() {
    try {
      setError("");
      setInfo("");
      setLoading(true);
      const data = await generateStudyPlan({
        objetivo,
        pontosFracos,
        disponibilidade,
      });
      setPlan(data);
      try {
        await saveHistory({
          kind: "plan",
          subject: null,
          params: { objetivo, pontosFracos, disponibilidade },
          payload: data,
        });
        setInfo("Salvo no histórico.");
      } catch (err) {
        setInfo(err.message);
      }
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
        {subjects.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm">Minhas matérias:</span>
            {subjects.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setPontosFracos(s.subject)}
                className="px-2 py-1 bg-slate-200 rounded text-sm"
              >
                {s.subject}
              </button>
            ))}
          </div>
        )}

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
      {info && (
        <div className="bg-yellow-100 text-yellow-800 border border-yellow-300 rounded p-3 mt-4">
          {info}
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
