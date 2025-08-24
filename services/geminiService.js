// services/geminiService.js
import { GoogleGenAI } from "@google/genai";

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

function safeParseJSON(txt) {
  try { return JSON.parse(txt); }
  catch (e) {
    console.error("[Gemini] JSON malformado:", txt);
    throw new Error("Resposta inválida do modelo.");
  }
}

/** ===== FLASHCARDS =====
 * Gera um array de flashcards [{ id, front, back, difficulty? }]
 * Parâmetros:
 *   subject: string (ex.: "Citologia"), 
 *   count:   number (ex.: 12),
 *   level:   "iniciante" | "intermediario" | "avancado" (opcional)
 */
export async function generateFlashcards({ subject = "", count = 10, level = "intermediario" } = {}) {
  ensureKey();
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `
Gere ${count} flashcards em PT-BR sobre "${subject}" (nível: ${level}).
Campos esperados:
- id (string curto único)
- front (pergunta/termo)
- back (resposta/definição direta, clara)
- difficulty (iniciante|intermediario|avancado)
Responda APENAS no JSON do schema.
`;

  // Schema do array de flashcards
  const schema = {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        front: { type: "string" },
        back: { type: "string" },
        difficulty: { type: "string" }
      },
      required: ["id", "front", "back"]
    }
  };

  try {
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7
      }
    });

    const txt = res?.text ?? "";
    const data = safeParseJSON(txt);
    if (!Array.isArray(data)) throw new Error("Formato inesperado (esperava array).");
    return data;
  } catch (err) {
    console.error("[generateFlashcards] erro:", err);
    throw new Error("Falha ao gerar flashcards. Verifique a chave/domínio no AI Studio.");
  }
}

/** ===== SIMULADOS =====
 * Gera um simulado com questões de múltipla escolha:
 * Retorno:
 *   { questions: [{ id, statement, options[5], correctIndex, explanation? }] }
 * Parâmetros:
 *   subject: string (ex.: "Fisiologia"),
 *   count:   number (ex.: 10),
 *   level:   "iniciante" | "intermediario" | "avancado" (opcional)
 */
export async function generateSimulado({ subject = "", count = 10, level = "intermediario" } = {}) {
  ensureKey();
  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const prompt = `
Monte um simulado em PT-BR de ${count} questões de "${subject}" (nível: ${level}).
Cada questão deve ter:
- id (string curto)
- statement (enunciado claro)
- options (array de 5 alternativas em string)
- correctIndex (0..4)
- explanation (breve justificativa da correta)
Responda APENAS no JSON do schema a seguir.
`;

  // Schema do objeto com array de questões
  const schema = {
    type: "object",
    properties: {
      questions: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            statement: { type: "string" },
            options: {
              type: "array",
              items: { type: "string" },
              minItems: 5,
              maxItems: 5
            },
            correctIndex: { type: "integer" },
            explanation: { type: "string" }
          },
          required: ["id", "statement", "options", "correctIndex"]
        }
      }
    },
    required: ["questions"]
  };

  try {
    const res = await ai.models.generateContent({
      model: MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.7
      }
    });

    const txt = res?.text ?? "";
    const data = safeParseJSON(txt);
    if (!data?.questions || !Array.isArray(data.questions)) {
      throw new Error("Formato inesperado (esperava objeto com 'questions').");
    }
    return data;
  } catch (err) {
    console.error("[generateSimulado] erro:", err);
    throw new Error("Falha ao gerar simulado. Verifique a chave/domínio no AI Studio.");
  }
}

/** ===== ALIASES para compatibilidade com código antigo ===== */
export const gerarFlashcards = generateFlashcards;
export const gerarSimulado   = generateSimulado;
