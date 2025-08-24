// services/geminiService.js
import { GoogleGenAI } from "@google/genai";
import { safeParseJSON } from "./safeParseJSON.js";

const API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL   = "gemini-2.5-flash";

function ensureKey() {
  if (!API_KEY) {
    throw new Error(
      "GEMINI_API_KEY ausente. No Render, adicione a Client key do Google AI Studio " +
      "em Environment Variables e faça 'Clear build cache & deploy'."
    );
  }
}

function readText(res) {
  if (!res) return "";
  // O SDK expõe .text como string (amostra oficial usa response.text)
  try {
    if (typeof res.text === "function") return res.text();
    if (typeof res.text === "string")   return res.text;
    if (res.response && typeof res.response.text === "function") {
      return res.response.text();
    }
  } catch {}
  return "";
}

/* =============== PLANO SEMANAL =============== */
function buildWeeklyPrompt(ctx = {}) {
  const objetivo        = ctx.objetivo ?? "Aprovação em Medicina na UnB 2026";
  const pontosFracos    = ctx.pontosFracos ?? "Física e Matemática";
  const disponibilidade = ctx.disponibilidade ?? "Manhãs de segunda a sábado";
  return `Gere um plano de estudos semanal (PT-BR) para: ${objetivo}.
- Pontos fracos: ${pontosFracos}
- Disponibilidade: ${disponibilidade}

Responda APENAS com JSON válido no formato:
{
  "monday":[{"id":"1","day":"monday","startTime":"08:00","endTime":"09:30","subject":"...","topic":"...","type":"..."}],
  "tuesday":[...],
  "wednesday":[...],
  "thursday":[...],
  "friday":[...],
  "saturday":[...],
  "sunday":[...]
}`;
}

export async function generateStudyPlan(userCtx = {}) {
  ensureKey();
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: buildWeeklyPrompt(userCtx),
      // força JSON puro (evita texto extra que quebra o parse)
      config: { responseMimeType: "application/json", temperature: 0.7 }
    });

    const txt = readText(res);
    const data = safeParseJSON(txt);
    return data;
  } catch (err) {
    console.error("[generateStudyPlan] erro:", err);
    throw new Error("Falha ao gerar o plano. Verifique chave/domínio no AI Studio.");
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
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.7 }
    });

    const txt = readText(res);
    const data = safeParseJSON(txt);
    if (!Array.isArray(data)) throw new Error("Formato inesperado (esperava array).");
    return data;
  } catch (err) {
    console.error("[generateFlashcards] erro:", err);
    throw new Error("Falha ao gerar flashcards. Verifique chave/domínio no AI Studio.");
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
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: { responseMimeType: "application/json", temperature: 0.7 }
    });

    const txt = readText(res);
    const data = safeParseJSON(txt);
    if (!data?.questions || !Array.isArray(data.questions)) {
      throw new Error("Formato inesperado (esperava objeto com 'questions').");
    }
    return data;
  } catch (err) {
    console.error("[generateSimulado] erro:", err);
    throw new Error("Falha ao gerar simulado. Verifique chave/domínio no AI Studio.");
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
  return readText(res);
}
