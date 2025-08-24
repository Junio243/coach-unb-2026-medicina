// services/geminiService.js
import { GoogleGenAI, Type } from "@google/genai";
import { PLANNER_PROMPT, TUTOR_PROMPT } from "../lib/prompts.js";

// Lê a API key injetada pelo Vite (via variável de ambiente no Render)
const apiKey = process.env.GEMINI_API_KEY || "";
if (!apiKey) {
  console.error(
    "GEMINI_API_KEY não configurada. Adicione a Client Key do Google AI Studio nas variáveis do Render e refaça o deploy com cache limpo."
  );
}
const ai = new GoogleGenAI({ apiKey });

/**
 * Gera um plano de estudos semanal estruturado (objeto JSON).
 * Exemplo de uso no Planner: const plano = await generateStudyPlan();
 */
export const generateStudyPlan = async () => {
  if (!apiKey) {
    throw new Error("API Key is not configurada.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    // Este texto inicial é um prompt genérico; adapte conforme seu app evoluir.
    contents: [
      {
        role: "user",
        parts: [
          {
            text:
              "Meu perfil é de um estudante de medicina com pontos fracos em física e matemática. Tenho as manhãs de segunda a sábado livres."
          }
        ]
      }
    ],
    config: {
      systemInstruction: PLANNER_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          monday: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                day: { type: Type.STRING },
                startTime: { type: Type.STRING },
                endTime: { type: Type.STRING },
                subject: { type: Type.STRING },
                topic: { type: Type.STRING },
                type: { type: Type.STRING }
              }
            }
          },
          tuesday: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                day: { type: Type.STRING },
                startTime: { type: Type.STRING },
                endTime: { type: Type.STRING },
                subject: { type: Type.STRING },
                topic: { type: Type.STRING },
                type: { type: Type.STRING }
              }
            }
          },
          wednesday: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                day: { type: Type.STRING },
                startTime: { type: Type.STRING },
                endTime: { type: Type.STRING },
                subject: { type: Type.STRING },
                topic: { type: Type.STRING },
                type: { type: Type.STRING }
              }
            }
          },
          thursday: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                day: { type: Type.STRING },
                startTime: { type: Type.STRING },
                endTime: { type: Type.STRING },
                subject: { type: Type.STRING },
                topic: { type: Type.STRING },
                type: { type: Type.STRING }
              }
            }
          },
          friday: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                day: { type: Type.STRING },
                startTime: { type: Type.STRING },
                endTime: { type: Type.STRING },
                subject: { type: Type.STRING },
                topic: { type: Type.STRING },
                type: { type: Type.STRING }
              }
            }
          },
          saturday: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                day: { type: Type.STRING },
                startTime: { type: Type.STRING },
                endTime: { type: Type.STRING },
                subject: { type: Type.STRING },
                topic: { type: Type.STRING },
                type: { type: Type.STRING }
              }
            }
          },
          sunday: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                day: { type: Type.STRING },
                startTime: { type: Type.STRING },
                endTime: { type: Type.STRING },
                subject: { type: Type.STRING },
                topic: { type: Type.STRING },
                type: { type: Type.STRING }
              }
            }
          }
        }
      },
      temperature: 0.7
    }
  });

  // A API retorna texto JSON; converte para objeto
  const jsonText = response.text?.trim() || "";
  return JSON.parse(jsonText);
};

/**
 * Envia uma pergunta ao tutor e recebe uma resposta em texto.
 */
export const getTutorResponse = async (question) => {
  if (!apiKey) {
    throw new Error("API Key is not configurada.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: question }] }],
    config: {
      systemInstruction: TUTOR_PROMPT,
      temperature: 0.5
    }
  });

  return response.text?.() || "";
};

/**
 * Função opcional para gerar plano passando um prompt customizado.
 * Por padrão, chama generateStudyPlan() sem argumentos.
 */
export async function gerarPlanoSemanal(prompt) {
  // Se quiser usar um prompt personalizado, substitua o generateStudyPlan() por chamada própria aqui.
  return generateStudyPlan();
}
