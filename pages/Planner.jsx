import React, { useEffect, useState } from "react";
import {
  generateStudyPlan,
  generateFlashcards,
  generateSimulado,
} from "../services/geminiService.js";
import { listUserSubjects } from "../services/subjectsService.js";
import { autoPrepareExam } from "../services/examProfileService.js";
import { fetchNews } from "../services/newsService.js";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function PlannerPage() {
  const [favorites, setFavorites] = useState([]);
  const [weaknesses, setWeaknesses] = useState("");
  const [dailyMinutes, setDailyMinutes] = useState(120);

  const [targetExam, setTargetExam] = useState("");
  const [university, setUniversity] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [profile, setProfile] = useState(null);
  const [discovered, setDiscovered] = useState([]);
  const [news, setNews] = useState([]);
  const [newsError, setNewsError] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    listUserSubjects().then(setSubjects).catch(() => {});
  }, []);

  const chipSubjects = Array.from(
    new Set([...(discovered || []), ...subjects.map((s) => s.subject)])
  );
  const examOverview = profile?.exam_overview || plan?.exam_overview || {};

  function toggleFavorite(subj) {
    setFavorites((prev) =>
      prev.includes(subj) ? prev.filter((s) => s !== subj) : [...prev, subj]
    );
  }

  async function onAutoPrepare() {
    try {
      setError("");
      setInfo("");
      setLoading(true);

      const prof = await autoPrepareExam({ targetExam, university, location });
      setProfile(prof);
      const subs = prof?.exam_overview?.subjects || [];
      setDiscovered(subs);

      const planData = await generateStudyPlan({
        discoveredSubjects: subs,
        targetExam,
        university,
        location,
      });
      setPlan(planData);
      setInfo("Plano gerado!");

      try {
        const newsItems = await fetchNews({
          queries: [targetExam, `${university} vestibular`],
          limit: 12,
        });
        setNews(newsItems);
        setNewsError("");
      } catch (e) {
        setNews([]);
        setNewsError("notícias indisponíveis no momento");
      }

      listUserSubjects().then(setSubjects).catch(() => {});
    } catch (e) {
      setError(e.message || "Falha ao preparar automaticamente.");
    } finally {
      setLoading(false);
    }
  }

  async function onGerarPlano() {
    try {
      setError("");
      setInfo("");
      setLoading(true);
      const data = await generateStudyPlan({
        favorites,
        weaknesses,
        daily_minutes: Number(dailyMinutes) || 120,
      });
      setPlan(data);
      setInfo("Plano gerado!");
    } catch (e) {
      setError(e.message || "Falha ao gerar plano.");
    } finally {
      setLoading(false);
    }
  }

  async function onGenerateFlashcards() {
    const seeds = profile?.flashcards_seeds || [];
    const seed = seeds.length
      ? seeds.slice(0, 2).join(", ")
      : favorites[0] || discovered[0];
    if (!seed) return;
    try {
      setError("");
      setInfo("");
      setActionLoading(true);
      await generateFlashcards({ subject: seed });
      setInfo("Flashcards gerados a partir do plano. Veja na aba de Flashcards.");
    } catch (e) {
      setError(e.message || "Falha ao gerar flashcards.");
    } finally {
      setActionLoading(false);
    }
  }

  async function onGenerateSimulado() {
    const seeds = profile?.quiz_seeds || [];
    const seed = seeds.length
      ? seeds.slice(0, 2).join(", ")
      : favorites[0] || discovered[0];
    if (!seed) return;
    try {
      setError("");
      setInfo("");
      setActionLoading(true);
      await generateSimulado({ subject: seed });
      setInfo("Simulado gerado a partir do plano. Veja na aba de Simulados.");
    } catch (e) {
      setError(e.message || "Falha ao gerar simulado.");
    } finally {
      setActionLoading(false);
    }
  }

  function onExportJSON() {
    if (!plan) return;
    try {
      navigator.clipboard.writeText(JSON.stringify(plan, null, 2));
      setInfo("JSON copiado para a área de transferência.");
    } catch {
      setError("Não foi possível copiar o JSON.");
    }
  }

  return (
    <main className="p-4 md:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Planner</h1>

      <div className="grid gap-2 sm:grid-cols-4 mb-6">
        <input
          className="border rounded px-3 py-2"
          placeholder="Exame"
          value={targetExam}
          onChange={(e) => setTargetExam(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Universidade"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Local/UF"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button
          onClick={onAutoPrepare}
          disabled={loading}
          className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Preparando..." : "Preparar tudo automaticamente"}
        </button>
      </div>

      <div className="space-y-4 mb-6">
        {chipSubjects.length > 0 && (
          <div>
            <div className="mb-2 text-sm">Matérias sugeridas</div>
            <div className="flex flex-wrap gap-2">
              {chipSubjects.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleFavorite(s)}
                  className={`px-2 py-1 rounded-2xl text-sm border ${favorites.includes(s) ? "bg-blue-600 text-white" : "bg-slate-100"}`}
                >
                  {s}
                </button>
              ))}
              <a
                href="/#/subjects"
                className="px-2 py-1 rounded-2xl text-sm border bg-slate-100"
              >
                + Minhas Matérias
              </a>
            </div>
          </div>
        )}

        <label className="grid gap-1 max-w-xs">
          <span>Pontos fracos</span>
          <input
            className="border rounded px-3 py-2"
            value={weaknesses}
            onChange={(e) => setWeaknesses(e.target.value)}
            placeholder="Ex.: Matemática"
          />
        </label>

        <label className="grid gap-1 max-w-xs">
          <span>Carga diária (min)</span>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={dailyMinutes}
            onChange={(e) => setDailyMinutes(e.target.value)}
          />
        </label>

        <button
          onClick={onGerarPlano}
          disabled={loading}
          className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? "Gerando..." : "Gerar Plano do Zero"}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 text-red-800 border border-red-300 rounded p-3 mb-4">
          {error}
        </div>
      )}
      {info && (
        <div className="bg-green-100 text-green-800 border border-green-300 rounded p-3 mb-4">
          {info}
        </div>
      )}

      {plan && (
        <div className="space-y-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={onGenerateFlashcards}
              disabled={actionLoading}
              className="bg-green-600 text-white rounded px-3 py-1 disabled:opacity-50"
            >
              Gerar Flashcards
            </button>
            <button
              onClick={onGenerateSimulado}
              disabled={actionLoading}
              className="bg-purple-600 text-white rounded px-3 py-1 disabled:opacity-50"
            >
              Gerar Simulado
            </button>
            <button
              onClick={onExportJSON}
              className="bg-slate-600 text-white rounded px-3 py-1"
            >
              Exportar JSON
            </button>
            <a
              href="/#/history"
              className="bg-slate-200 rounded px-3 py-1"
            >
              Ver Histórico
            </a>
          </div>

            <section>
              <h2 className="text-xl font-semibold mb-3">Visão da Prova</h2>
              <div className="bg-white rounded-2xl shadow-md p-5">
                <h3 className="text-lg font-bold">{examOverview.exam_name}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Formato: {examOverview.format}
                </p>
                {examOverview.subjects && (
                  <ul className="mt-3 list-disc list-inside text-sm">
                    {examOverview.subjects.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                )}
                {examOverview.skills_required && (
                  <ul className="mt-3 list-disc list-inside text-sm">
                    {examOverview.skills_required.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                )}
                {examOverview.strategy_tips && (
                  <ul className="mt-3 list-disc list-inside text-sm">
                    {examOverview.strategy_tips.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Comece Aqui (Semana 0)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {plan.onboarding_zero?.micro_lessons?.map((m, i) => (
                <div
                  key={i}
                  className="rounded-2xl shadow-md p-4 bg-white flex flex-col"
                >
                  <div className="font-semibold">{m.title}</div>
                  <p className="text-sm mt-1 flex-1">{m.objective}</p>
                  {m.resources?.length > 0 && (
                    <ul className="mt-2 list-disc list-inside text-sm">
                      {m.resources.map((r, j) => (
                        <li key={j}>{r}</li>
                      ))}
                    </ul>
                  )}
                  {m.practice && (
                    <p className="mt-2 text-sm italic">Prática: {m.practice}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">Roteiro (4 semanas)</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {plan.roadmap?.map((w) => (
                <div
                  key={w.week}
                  className="rounded-2xl shadow-md p-4 bg-white"
                >
                  <div className="font-semibold">Semana {w.week}</div>
                  <div className="text-sm mt-1">{w.focus}</div>
                  <ul className="mt-2 list-disc list-inside text-sm">
                    {(w.outcomes || []).map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Plano Semanal</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
                {DAYS.map((d) => (
                  <div key={d} className="flex flex-col gap-2">
                    <h3 className="text-center font-semibold capitalize">{d}</h3>
                    {(plan.week_plan?.[d] || []).map((b) => (
                      <div key={b.id} className="bg-white rounded-2xl shadow-md p-3 text-sm">
                        <div className="font-medium">
                          {b.startTime} - {b.endTime}
                        </div>
                        <div className="mt-1">
                          {b.subject} - {b.topic}
                        </div>
                        <span className="inline-block mt-1 text-xs rounded px-2 py-0.5 bg-blue-100 text-blue-800">
                          {b.type}
                        </span>
                        {b.why && (
                          <div className="mt-1 text-xs text-slate-600">{b.why}</div>
                        )}
                        {b.resources?.length > 0 && (
                          <ul className="mt-1 list-disc list-inside text-xs text-slate-700">
                            {b.resources.map((r, i) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        )}
                        {b.task && (
                          <div className="mt-1 text-xs italic">Tarefa: {b.task}</div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-xl font-semibold mb-3">Atualizações e Notícias</h2>
              {newsError ? (
                <div className="text-sm text-slate-600">{newsError}</div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {news.map((n, i) => (
                    <a
                      key={i}
                      href={n.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-white rounded-2xl shadow-md p-4 hover:bg-slate-50"
                    >
                      <div className="font-semibold text-sm">{n.title}</div>
                      <div className="text-xs text-slate-600 mt-1">
                        {n.source} - {new Date(n.publishedAt).toLocaleDateString("pt-BR")}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
    </main>
  );
}

