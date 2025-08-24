import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { psychoPlan } from "../services/geminiService.js";
import { listDifficulties, createDifficulty, deleteDifficulty } from "../services/psychoService.js";
import { getHistoryItem } from "../services/historyService.js";

export default function PsychoPage() {
  const [params] = useSearchParams();
  const historyId = params.get("history");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [description, setDescription] = useState("");
  const [intensity, setIntensity] = useState(3);
  const [followUp, setFollowUp] = useState("");
  const [plan, setPlan] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadList();
  }, []);

  useEffect(() => {
    if (historyId) {
      getHistoryItem(historyId)
        .then((h) => setPlan(h.payload))
        .catch(() => setError("Falha ao carregar histórico."));
    }
  }, [historyId]);

  async function loadList() {
    try {
      const data = await listDifficulties();
      setList(data);
    } catch {}
  }

  async function onGenerate(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const res = await psychoPlan({
        subject,
        difficulty_type: difficulty,
        description,
        intensity: Number(intensity),
      });
      setPlan(res);
    } catch (e) {
      setError(e.message || "Falha ao gerar plano.");
    } finally {
      setLoading(false);
    }
  }

  async function onSave() {
    try {
      await createDifficulty({
        subject,
        difficulty_type: difficulty,
        description,
        intensity: Number(intensity),
        interventions: plan?.interventions || [],
        follow_up_date: followUp || null,
      });
      setSubject("");
      setDifficulty("");
      setDescription("");
      setPlan(null);
      loadList();
    } catch (e) {
      setError(e.message || "Falha ao salvar.");
    }
  }

  async function onDelete(id) {
    if (!window.confirm("Excluir registro?")) return;
    await deleteDifficulty(id);
    loadList();
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Psicopedagogo</h1>
      {!historyId && (
        <form onSubmit={onGenerate} className="space-y-3 mb-6">
          <div>
            <label className="block text-sm">Matéria</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm">Tipo de dificuldade</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm">Descrição</label>
            <textarea
              className="border rounded px-2 py-1 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm">Intensidade (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                className="border rounded px-2 py-1 w-full"
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm">Acompanhar em</label>
              <input
                type="date"
                className="border rounded px-2 py-1 w-full"
                value={followUp}
                onChange={(e) => setFollowUp(e.target.value)}
              />
            </div>
          </div>
          <button disabled={loading} className="bg-blue-600 text-white rounded px-4 py-2">
            {loading ? "Gerando..." : "Gerar Intervenções"}
          </button>
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </form>
      )}

      {plan && (
        <section className="space-y-4 mb-6">
          <div className="p-4 bg-white rounded shadow">
            <div className="font-semibold mb-2">{plan.summary}</div>
            {plan.interventions && (
              <div className="mt-2">
                <h3 className="font-semibold mb-1">Intervenções</h3>
                <ul className="list-disc list-inside text-sm">
                  {plan.interventions.map((i, idx) => (
                    <li key={idx}>{i.name}: {i.how}</li>
                  ))}
                </ul>
              </div>
            )}
            {plan.weekly_adjustments && (
              <div className="mt-2">
                <h3 className="font-semibold mb-1">Ajustes semanais</h3>
                <ul className="list-disc list-inside text-sm">
                  {plan.weekly_adjustments.map((w, idx) => (
                    <li key={idx}>{w.day}: {w.change} ({w.minutes}m)</li>
                  ))}
                </ul>
              </div>
            )}
            {plan.monitoring && (
              <div className="mt-2">
                <h3 className="font-semibold mb-1">Monitoramento</h3>
                <ul className="list-disc list-inside text-sm">
                  {plan.monitoring.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
            {!historyId && (
              <button onClick={onSave} className="mt-3 bg-green-600 text-white rounded px-3 py-1">
                Salvar dificuldade
              </button>
            )}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold mb-3">Dificuldades cadastradas</h2>
        <div className="space-y-2">
          {list.map((d) => (
            <div key={d.id} className="p-3 bg-white rounded shadow flex justify-between items-center">
              <div>
                <div className="font-medium">{d.subject}</div>
                <div className="text-xs text-slate-600">{d.difficulty_type}</div>
              </div>
              <button onClick={() => onDelete(d.id)} className="text-red-600 text-sm">
                Excluir
              </button>
            </div>
          ))}
          {list.length === 0 && <div className="text-sm">Nenhuma dificuldade salva.</div>}
        </div>
      </section>
    </main>
  );
}
