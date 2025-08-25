import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { professorExplain } from "../services/geminiService.js";
import { getHistoryItem } from "../services/historyService.js";
import { listUserSubjects } from "../services/subjectsService.js";
import Spinner from "../components/Spinner.jsx";
import ReactMarkdown from "react-markdown";

export default function ProfessorPage() {
  const [params] = useSearchParams();
  const historyId = params.get("history");
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState("");
  const [level, setLevel] = useState("iniciante");
  const [minutes, setMinutes] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSubjects() {
      try {
        setSubjectsLoading(true);
        setSubjectsError("");
        const res = await listUserSubjects();
        setSubjects(res);
      } catch (e) {
        setSubjectsError("Falha ao carregar matérias");
      } finally {
        setSubjectsLoading(false);
      }
    }
    loadSubjects();
  }, []);

  useEffect(() => {
    if (historyId) {
      getHistoryItem(historyId)
        .then((h) => {
          setData(h.payload);
        })
        .catch(() => setError("Falha ao carregar histórico."));
    }
  }, [historyId]);

  async function onGenerate(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const res = await professorExplain({ topic, subject, level, minutes });
      setData(res);
    } catch (e) {
      setError(e.message || "Falha ao gerar explicação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{data ? data.title : "Professor"}</h1>
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
            {subjectsLoading ? (
              <Spinner label="Carregando" />
            ) : subjectsError ? (
              <div className="text-red-600 text-sm mt-1">{subjectsError}</div>
            ) : subjects.length > 0 ? (
              <div className="flex flex-wrap gap-1 mt-2">
                {subjects.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSubject(s.subject)}
                    className={`px-2 py-1 rounded-full text-xs border ${subject === s.subject ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}
                  >
                    {s.subject}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-600 mt-1">
                Nenhuma matéria salva — adicione em <a href="#/subjects" className="underline">/#/subjects</a>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm">Tópico</label>
            <input
              className="border rounded px-2 py-1 w-full"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm">Nível</label>
              <select
                className="border rounded px-2 py-1 w-full"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="iniciante">iniciante</option>
                <option value="intermediario">intermediario</option>
                <option value="avancado">avancado</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm">Minutos</label>
              <input
                type="number"
                className="border rounded px-2 py-1 w-full"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
              />
            </div>
          </div>
          <button
            disabled={loading}
            className="bg-blue-600 text-white rounded px-4 py-2 flex items-center justify-center"
          >
            {loading ? <Spinner label="" /> : "Gerar Aula"}
          </button>
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </form>
      )}

      {loading && (
        <Spinner fullPage label="Gerando sua aula (30-60s)..." />
      )}

      {data && !loading && (
        <section className="space-y-6">
          {data.intro && <ReactMarkdown className="text-sm">{data.intro}</ReactMarkdown>}
          {Array.isArray(data.sections) &&
            data.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h2 className="text-xl font-semibold">{sec.heading}</h2>
                <ReactMarkdown className="text-sm">{sec.content}</ReactMarkdown>
                {sec.examples && sec.examples.length > 0 && (
                  <ul className="list-disc list-inside text-sm">
                    {sec.examples.map((ex, i) => (
                      <li key={i}>
                        <ReactMarkdown className="inline">{ex}</ReactMarkdown>
                      </li>
                    ))}
                  </ul>
                )}
                {sec.exercise && (
                  <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded text-sm">
                    <ReactMarkdown>{sec.exercise}</ReactMarkdown>
                  </div>
                )}
              </div>
            ))}
          {data.conclusion && (
            <div>
              <h2 className="text-xl font-semibold">Conclusão</h2>
              <ReactMarkdown className="text-sm">{data.conclusion}</ReactMarkdown>
            </div>
          )}
          {data.recommendations && data.recommendations.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Recomendações</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.recommendations.map((rec, i) => (
                  <a
                    key={i}
                    href={rec.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-white rounded shadow"
                  >
                    <div className="font-medium text-sm">{rec.title}</div>
                    <div className="text-xs text-slate-600 capitalize">{rec.type}</div>
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={() =>
                navigate(
                  `/flashcards?subject=${encodeURIComponent(subject || topic)}`
                )
              }
              className="bg-green-600 text-white rounded px-4 py-2"
            >
              Gerar flashcards do que aprendi
            </button>
            <button
              onClick={() =>
                navigate(
                  `/simulados?subject=${encodeURIComponent(subject || topic)}&count=5`
                )
              }
              className="bg-purple-600 text-white rounded px-4 py-2"
            >
              Criar simulado rápido
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
