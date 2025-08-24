export function safeParseJSON(txt) {
  try { return JSON.parse(txt); }
  catch (e) {
    console.error("[Gemini] JSON malformado:", txt);
    throw new Error("Resposta inválida do modelo.");
  }
}
