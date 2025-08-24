const BASE_URL = import.meta.env.VITE_NEWS_PROXY_URL;

export function buildNewsQueries({ targetExam = "", university = "", location = "" } = {}) {
  const set = new Set();
  if (targetExam) set.add(targetExam);
  if (university) {
    set.add(`${university} vestibular`);
    set.add(`vestibular ${university}`);
  }
  if (targetExam && university) set.add(`${targetExam} ${university}`);
  if (targetExam && location) set.add(`${targetExam} ${location}`);
  return Array.from(set);
}

export async function fetchNews({ queries = [], limit = 10 } = {}) {
  if (!BASE_URL) throw new Error("NEWS proxy não configurado.");
  const map = new Map();
  for (const q of queries) {
    try {
      const res = await fetch(`${BASE_URL}/news?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      for (const item of data.items || []) {
        if (!map.has(item.url)) {
          map.set(item.url, item);
        }
      }
    } catch (e) {
      console.error("[fetchNews] erro:", e);
    }
  }
  const arr = Array.from(map.values());
  arr.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  return arr.slice(0, limit);
}
