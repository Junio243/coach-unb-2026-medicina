export function safeParseJSON(txt) {
  try {
    if (typeof txt !== 'string') return txt;
    const match = txt.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return JSON.parse(txt);
  } catch (e) {
    console.error("[Gemini] JSON malformado:", txt);
    throw new Error("Resposta inválida do modelo.");
  }
}
