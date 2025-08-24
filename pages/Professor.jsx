import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { professorExplain, generateFlashcards, generateSimulado } from "../services/geminiService.js";
import { fetchVideos } from "../services/videoService.js";
import { getHistoryItem } from "../services/historyService.js";
import { listUserSubjects } from "../services/subjectsService.js";
import Spinner from "../components/Spinner.jsx";

export default function ProfessorPage() {
  const [params] = useSearchParams();
  const historyId = params.get("history");
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState("");
  const [level, setLevel] = useState("iniciante");
  const [minutes, setMinutes] = useState(30);
  const [data, setData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [videoError, setVideoError] = useState("");
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
          if (h.payload?.video_queries) loadVideos(h.payload.video_queries);
        })
        .catch(() => setError("Falha ao carregar histórico."));
    }
  }, [historyId]);

  async function loadVideos(queries) {
    try {
      setVideoError("");
      const vids = await fetchVideos({ queries });
      setVideos(vids);
    } catch (e) {
      setVideos([]);
      setVideoError("vídeos indisponíveis");
    }
  }

  async function onGenerate(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const res = await professorExplain({ topic, subject, level, minutes });
      setData(res);
      if (res.video_queries) loadVideos(res.video_queries);
    } catch (e) {
      setError(e.message || "Falha ao gerar explicação.");
    } finally {
      setLoading(false);
    }
  }

  async function onFlashcards() {
    const seeds = data?.flashcards_seeds || [];
    if (seeds.length) await generateFlashcards({ subject: seeds.join(", ") });
  }

  async function onQuiz() {
    const seeds = data?.quiz_seeds || [];
    if (seeds.length) await generateSimulado({ subject: seeds.join(", ") });
  }

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Professor</h1>
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
              required
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

      {loading && <Spinner fullPage label="Gerando" />}

      {data && !loading && (
        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">{data.title}</h2>
            <p className="text-sm">{data.overview}</p>
          </div>
          {data.step_by_step && (
            <div>
              <h3 className="font-semibold mb-1">Passo a passo</h3>
              <ol className="list-decimal list-inside text-sm space-y-1">
                {data.step_by_step.map((s, i) => (
                  <li key={i}>{s.step}: {s.detail}</li>
                ))}
              </ol>
            </div>
          )}
          {data.examples && (
            <div>
              <h3 className="font-semibold mb-1">Exemplos</h3>
              <ul className="text-sm space-y-2">
                {data.examples.map((ex, i) => (
                  <li key={i} className="p-2 bg-slate-100 rounded">
                    <div className="font-medium">{ex.input}</div>
                    <div>{ex.solution}</div>
                    <div className="text-xs text-slate-600">{ex.why}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {data.misconceptions && (
            <div>
              <h3 className="font-semibold mb-1">Erros comuns</h3>
              <ul className="list-disc list-inside text-sm">
                {data.misconceptions.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
          {data.practice && (
            <div>
              <h3 className="font-semibold mb-1">Mini-prática</h3>
              <ul className="text-sm space-y-1">
                {data.practice.map((p, i) => (
                  <li key={i}>{p.task}</li>
                ))}
              </ul>
            </div>
          )}
          {data.reading_list && (
            <div>
              <h3 className="font-semibold mb-1">Leituras</h3>
              <ul className="list-disc list-inside text-sm">
                {data.reading_list.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h3 className="font-semibold mb-1">Vídeos recomendados</h3>
            {videoError ? (
              <div className="text-sm text-slate-600">{videoError}</div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {videos.map((v, i) => (
                  <a key={i} href={v.url} target="_blank" rel="noreferrer" className="p-2 bg-white rounded shadow">
                    <div className="font-medium text-sm">{v.title}</div>
                    <div className="text-xs text-slate-600">{v.channel}</div>
                  </a>
                ))}
                {videos.length === 0 && (
                  <div className="text-sm text-slate-600">Nenhum vídeo.</div>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={onFlashcards} className="bg-green-600 text-white rounded px-3 py-1">
              Gerar Flashcards
            </button>
            <button onClick={onQuiz} className="bg-indigo-600 text-white rounded px-3 py-1">
              Gerar Simulado
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
