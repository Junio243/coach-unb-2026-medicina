// services/geminiService.js
import { GoogleGenAI } from "@google/genai";

// Lida com a chave injetada pelo Vite (Render -> Environment Variables -> GEMINI_API_KEY)
const API_KEY = process.env.GEMINI_API_KEY || "";
const MODEL = "gemini-2.5-flash";

function ensureKey() {
  if (!API_KEY) {
    throw new Error(
      "GEMINI_API_KEY ausente. No Render, adicione a Client key do Google AI Studio e faça 'Clear build cache & deploy'."
    );
  }
}

// Schema de um bloco do plano (evita depender de enums do SDK no browser)
const blockSchema = {
  type: "object",
  properties: {
    id: { type: "string", description: "id único do bloco" },
    day: { type: "string", description: "dia da semana (PT-BR)" },
    startTime: { type: "string", description: "HH:MM" },
    endTime: { type: "string", description: "HH:MM" },
    subject: { type: "string", description: "disciplina" },
    topic: { type: "string", description: "tópico/conteúdo" },
    type: { type: "string", description: "ex.: teoria, exercício, revisão" }
  },
  required: ["id", "day", "startTime", "endTime", "subject", "type"]
};

function makeWeeklySchema() {
  const day = { type: "array", items: blockSchema };
  return {
    type: "object",
    properties: {
      monday: day, tuesday: day, wednesday: day,
      thursday: day, friday: day, saturday: day, sunday: day
    },
    required: ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]
  };
}

// Prompt básico; adapte se tiver store/contexto
function buildPrompt(ctx = {}) {
  const objetivo = ctx.objetivo || "Aprovação em Medicina na UnB 2026";
  const pontosFracos = ctx.pontosFracos || "Física e Matemática";
  const disponibilidade = ctx.disponibilidade || "Manhãs de segunda a sábado";
  return `Gere um plano de estudos semanal detalhado (foco: ${objetivo}).
- Pontos fracos: ${pontosFracos}
- Disponibilidade: ${disponibilidade}
Preencha todos os dias, sem texto solto: responda EXATAMENTE no JSON do schema.`;
}

/** === API PRINCIPAL USADA PELO Planner.jsx === */
export async function generateStudyPlan(userCtx = {}) {
  ensureKey();
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: buildPrompt(userCtx),
      config: {
        responseMimeType: "application/json",
        responseSchema: makeWeeklySchema(),
        temperature: 0.7
      }
    });

    // No SDK @google/genai, 'text' é propriedade (não método).
    const txt = response?.text ?? "";
    let data;
    try {
      data = JSON.parse(txt);
    } catch (e) {
      console.error("[Gemini] JSON inválido:", txt);
      throw new Error("Resposta inválida do modelo.");
    }
    return data;
  } catch (err) {
    console.error("[generateStudyPlan] erro:", err);
    // Deixa a UI mostrar a mensagem amigável em vez de quebrar a tela
    throw new Error("Falha ao gerar o plano. Verifique a chave/domínio no AI Studio.");
  }
}

/** Alias para compatibilidade com chamadas antigas do seu código */
export const gerarPlanoSemanal = (ctx) => generateStudyPlan(ctx);

/** Tutor em texto livre (se o app usar) */
export async function getTutorResponse(question) {
  ensureKey();
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const res = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ text: question }]}],
    config: { temperature: 0.5 }
  });
  return res?.text ?? "";
}
