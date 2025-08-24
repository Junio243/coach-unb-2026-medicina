import { GoogleGenAI, Type } from "@google/genai";
import { PLANNER_PROMPT, TUTOR_PROMPT } from '../lib/prompts.js';

// WARNING: API key is exposed on the client side for this demo.
// In a real app, this MUST be handled on a backend server.
const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;

if (!apiKey) {
    console.error("API_KEY environment variable not set or not accessible in this environment. Please set it to use AI features.");
}
const ai = new GoogleGenAI({ apiKey: apiKey || 'MISSING_API_KEY' });

/**
 * Generates a study plan using the Gemini API.
 */
export const generateStudyPlan = async () => {
    if (!apiKey) throw new Error("API Key is not configured.");

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: "Meu perfil é de um estudante de medicina com pontos fracos em física e matemática. Tenho as manhãs de segunda a sábado livres."}] }],
        config: {
            systemInstruction: PLANNER_PROMPT,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    monday: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: {type: Type.STRING}, day: {type: Type.STRING}, startTime: {type: Type.STRING}, endTime: {type: Type.STRING}, subject: {type: Type.STRING}, topic: {type: Type.STRING}, type: {type: Type.STRING} } } },
                    tuesday: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: {type: Type.STRING}, day: {type: Type.STRING}, startTime: {type: Type.STRING}, endTime: {type: Type.STRING}, subject: {type: Type.STRING}, topic: {type: Type.STRING}, type: {type: Type.STRING} } } },
                    wednesday: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: {type: Type.STRING}, day: {type: Type.STRING}, startTime: {type: Type.STRING}, endTime: {type: Type.STRING}, subject: {type: Type.STRING}, topic: {type: Type.STRING}, type: {type: Type.STRING} } } },
                    thursday: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: {type: Type.STRING}, day: {type: Type.STRING}, startTime: {type: Type.STRING}, endTime: {type: Type.STRING}, subject: {type: Type.STRING}, topic: {type: Type.STRING}, type: {type: Type.STRING} } } },
                    friday: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: {type: Type.STRING}, day: {type: Type.STRING}, startTime: {type: Type.STRING}, endTime: {type: Type.STRING}, subject: {type: Type.STRING}, topic: {type: Type.STRING}, type: {type: Type.STRING} } } },
                    saturday: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: {type: Type.STRING}, day: {type: Type.STRING}, startTime: {type: Type.STRING}, endTime: {type: Type.STRING}, subject: {type: Type.STRING}, topic: {type: Type.STRING}, type: {type: Type.STRING} } } },
                    sunday: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: {type: Type.STRING}, day: {type: Type.STRING}, startTime: {type: Type.STRING}, endTime: {type: Type.STRING}, subject: {type: Type.STRING}, topic: {type: Type.STRING}, type: {type: Type.STRING} } } }
                }
            },
            temperature: 0.7,
        }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
};

/**
 * Gets a response from the AI Tutor.
 */
export const getTutorResponse = async (question) => {
    if (!apiKey) throw new Error("API Key is not configured.");
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: question }] }],
        config: {
            systemInstruction: TUTOR_PROMPT,
            temperature: 0.5,
        }
    });

    return response.text;
};