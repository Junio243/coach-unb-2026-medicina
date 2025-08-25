export function safeParseJSON(txt) {
  try {
    if (typeof txt !== 'string') return txt;

    const start = txt.search(/[\[{]/);
    if (start !== -1) {
      let depth = 0;
      let inString = false;
      const startChar = txt[start];
      const endChar = startChar === '{' ? '}' : ']';
      for (let i = start; i < txt.length; i++) {
        const ch = txt[i];
        const prev = txt[i - 1];
        if (ch === '"' && prev !== '\\') inString = !inString;
        if (inString) continue;
        if (ch === startChar) depth++;
        else if (ch === endChar) {
          depth--;
          if (depth === 0) {
            const jsonPart = txt.slice(start, i + 1);
            return JSON.parse(jsonPart);
          }
        }
      }
    }

    return JSON.parse(txt);
  } catch (e) {
    console.error("[Gemini] JSON malformado:", txt);
    throw new Error("Resposta inválida do modelo.");
  }
}
