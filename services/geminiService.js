// services/geminiService.js
import { GoogleGenAI } from "@google/genai";
import { safeParseJSON } from "./safeParseJSON.js";
import { saveHistory } from "./historyService.js";

const API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL = "gemini-2.5-flash";

function ensureKey() {
  if (!API_KEY) {
    throw new Error(
      "GEMINI_API_KEY ausente. No Render, adicione a Client key do Google AI Studio " +
      "em Environment Variables e faça 'Clear build cache & deploy'."
    );
  }
}

async function readText(res) {
  if (!res) return "";
  try {
    if (typeof res.text === "function") return await res.text();
    if (typeof res.text === "string") return res.text;
    if (res.response && typeof res.response.text === "function") {
      return await res.response.text();
    }
  } catch {}
  return "";
}

function handleError(err, defaultMsg) {
  const status = err?.status || err?.response?.status;
  if (status === 401 || status === 403) {
    return new Error("Verifique chave/domínio no AI Studio.");
  }
  return new Error(defaultMsg);
}

async function retryable(fn, attempt = 1) {
  try {
    return await fn();
  } catch (err) {
    const status = err?.status || err?.response?.status;
    if (attempt < 2 && (status === 429 || status >= 500)) {
      await new Promise((r) => setTimeout(r, 500 * attempt));
      return retryable(fn, attempt + 1);
    }
    throw err;
  }
}

/* =============== EXAM PROFILE =============== */

function buildExamProfilePrompt({ targetExam = "", university = "", location = "" }) {
  return `Você é um orientador de estudos para iniciantes absolutos. Dado o exame "${targetExam}" da universidade "${university}" em "${location}", descubra as matérias e perfil geral dessa prova.
Responda APENAS com JSON válido no formato:
{
  "exam_overview": {
    "exam_name": "string",
    "format": "string",
    "subjects": ["string"],
    "skills_required": ["string"],
    "strategy_tips": ["string"]
  },
  "syllabus_map": { "Matemática": ["Módulo 1"], "Biologia": ["..."] },
  "flashcards_seeds": ["string"],
  "quiz_seeds": ["string"]
}
Se não houver dados oficiais, use formulações cautelosas como "tipicamente" ou "frequente em vestibulares brasileiros" e organize as matérias do básico ao avançado.`;
}

export async function discoverExamProfile(ctx = {}) {
  ensureKey();
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = buildExamProfilePrompt(ctx);

  try {
    const res = await retryable(() =>
      ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: { responseMimeType: "application/json", temperature: 0.7 },
      })
    );

    const txt = await readText(res);
    const data = safeParseJSON(txt);

    try {
      await saveHistory({
        kind: "plan",
        subject: ctx?.targetExam || "Exame",
        params: { ...ctx, kind: "exam_profile" },
        payload: data,
      });
    } catch (e) {
      console.error("[discoverExamProfile] saveHistory erro:", e);
    }

    return data;
  } catch (err) {
    console.error("[discoverExamProfile] erro:", err);
    throw handleError(err, "Falha ao descobrir o perfil do exame.");
  }
}

/* =============== PLANO DE ESTUDOS COMPLETO =============== */

function buildPlanPrompt(ctx = {}) {
  const targetExam = ctx.targetExam || "prova";
  const university = ctx.university || "";
  const location = ctx.location || "";
  const favs = Array.isArray(ctx.favorites) && ctx.favorites.length
    ? ctx.favorites.join(", ")
    : "nenhuma";
  const weaknesses = ctx.weaknesses || "";
  const minutes = ctx.daily_minutes || 120;
  const discovered = Array.isArray(ctx.discoveredSubjects) && ctx.discoveredSubjects.length
    ? ctx.discoveredSubjects.join(", ")
    : "";

  return `Você é um tutor para iniciantes absolutos. Crie um plano de estudos em PT-BR para ${targetExam} (${university} ${location}).
Matérias do exame: ${discovered || "utilize matérias comuns de vestibulares brasileiros"}.
Contexto do usuário:
- Matérias favoritas: ${favs}
- Pontos fracos: ${weaknesses}
- Carga diária disponível: ${minutes} minutos

Cada bloco do week_plan deve ter o formato:
{
  "id": "string",
  "day": "monday|tuesday|...",
  "startTime": "HH:MM",
  "endTime": "HH:MM",
  "subject": "string",
  "topic": "string",
  "type": "Teoria|Exercícios|Revisão|Simulado|Redação",
  "why": "explicação curta do porquê desse bloco para iniciantes",
  "resources": ["vídeo/playlist sugerida", "capítulo genérico", "tipo de exercício"],
  "task": "tarefa simples que um iniciante consegue executar"
}

Gere um plano completo seguindo exatamente o schema abaixo e responda APENAS com JSON válido:
{
  "exam_overview": {
    "exam_name": "string",
    "format": "string",
    "subjects": ["string"],
    "skills_required": ["string"],
    "strategy_tips": ["string"]
  },
  "onboarding_zero": {
    "week_goal": "string",
    "micro_lessons": [
      { "title": "string", "objective": "string", "resources": ["string"], "practice": "string" }
    ]
  },
  "roadmap": [
    { "week": 1, "focus": "string", "outcomes": ["string"] },
    { "week": 2, "focus": "string", "outcomes": ["string"] },
    { "week": 3, "focus": "string", "outcomes": ["string"] },
    { "week": 4, "focus": "string", "outcomes": ["string"] }
  ],
  "week_plan": {
    "monday":    [],
    "tuesday":   [],
    "wednesday": [],
    "thursday":  [],
    "friday":    [],
    "saturday":  [],
    "sunday":    []
  },
  "flashcards_seeds": ["string"],
  "quiz_seeds": ["string"],
  "habits": ["string"],
  "metrics": { "daily_minutes_target": 120, "pomodoro_minutes": 25, "review_cycles_per_week": 3 }
}`;
}

export async function generateStudyPlan(userCtx = {}) {
  ensureKey();
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const res = await retryable(() =>
      ai.models.generateContent({
        model: MODEL,
        contents: buildPlanPrompt(userCtx),
        config: { responseMimeType: "application/json", temperature: 0.7 },
      })
    );

    const txt = await readText(res);
    const data = safeParseJSON(txt);

    try {
      await saveHistory({
        kind: "plan",
        subject: userCtx?.targetExam || "Prova",
        params: userCtx || {},
        payload: data,
      });
    } catch (e) {
      console.error("[generateStudyPlan] saveHistory erro:", e);
    }

    return data;
  } catch (err) {
    console.error("[generateStudyPlan] erro:", err);
    throw handleError(err, "Falha ao gerar o plano.");
  }
}
export const gerarPlanoSemanal = (ctx) => generateStudyPlan(ctx);

/* =============== FLASHCARDS =============== */
export async function generateFlashcards({ subject = "", count = 10, level = "intermediario" } = {}) {
  ensureKey();
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `
Gere ${count} flashcards em PT-BR sobre "${subject}" (nível: ${level}).
Cada item: { "id": "fc-1", "front": "pergunta/termo", "back": "resposta", "difficulty":"iniciante|intermediario|avancado" }
Responda APENAS com um array JSON (sem texto fora do JSON).`;

  try {
    const res = await retryable(() =>
      ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: { responseMimeType: "application/json", temperature: 0.7 },
      })
    );

    const txt = await readText(res);
    const data = safeParseJSON(txt);
    if (!Array.isArray(data)) throw new Error("Formato inesperado (esperava array).");
    return data;
  } catch (err) {
    console.error("[generateFlashcards] erro:", err);
    throw handleError(err, "Falha ao gerar flashcards.");
  }
}
export const gerarFlashcards = generateFlashcards;

/* =============== SIMULADO =============== */
export async function generateSimulado({ subject = "", count = 10, level = "intermediario" } = {}) {
  ensureKey();
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `
Monte um simulado em PT-BR de ${count} questões de "${subject}" (nível: ${level}).
Formato EXATO (JSON):
{
  "questions": [
    {
      "id": "q1",
      "statement": "enunciado claro",
      "options": ["A) ...","B) ...","C) ...","D) ...","E) ..."],
      "correctIndex": 0,
      "explanation": "por que a correta está correta"
    }
  ]
}
Sem texto fora do JSON.`;

  try {
    const res = await retryable(() =>
      ai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: { responseMimeType: "application/json", temperature: 0.7 },
      })
    );

    const txt = await readText(res);
    const data = safeParseJSON(txt);
    if (!data?.questions || !Array.isArray(data.questions)) {
      throw new Error("Formato inesperado (esperava objeto com 'questions').");
    }
    return data;
  } catch (err) {
    console.error("[generateSimulado] erro:", err);
    throw handleError(err, "Falha ao gerar simulado.");
  }
}
export const gerarSimulado = generateSimulado;

/* =============== Tutor (texto livre) =============== */
export async function getTutorResponse(question) {
  ensureKey();
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ text: question }]}],
    config: { temperature: 0.5 }
  });
  return await readText(res);
}
