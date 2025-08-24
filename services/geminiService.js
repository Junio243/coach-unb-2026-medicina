// services/geminiService.js
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.GEMINI_API_KEY || ""; // Vite injeta no build
const MODEL_ID = "gemini-2.5-flash"; // modelo gratuito informado

function ensureKey() {
  if (!API_KEY) {
    throw new Error(
      "GEMINI_API_KEY ausente. No Render, adicione a Client key do Google AI Studio em Environment Variables e faça 'Clear build cache & deploy'."
    );
  }
}

/**
 * Gera um plano semanal usando o Gemini 2.5 Flash.
 * @param {string} prompt - Texto com suas instruções (matérias, horas, etc.)
 * @returns {Promise<string>} - Texto gerado pelo modelo.
 */
export async function gerarPlanoSemanal(prompt) {
  try {
    ensureKey();

    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const res = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt
      // Se quiser raciocínio explícito (opcional):
      // thinkingConfig: { thinkingBudget: -1 } // -1 = dinâmico; 0 = desligado
    });

    const text = res?.text?.() ?? res?.response?.text?.() ?? "";
    if (!text.trim()) throw new Error("Resposta vazia do modelo.");
    return text;
  } catch (err) {
    console.error("[Gemini] Erro:", err);
    throw new Error("Falha ao gerar o plano. Verifique sua chave de API e o domínio permitido.");
  }
}
