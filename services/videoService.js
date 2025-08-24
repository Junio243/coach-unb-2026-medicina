const BASE_URL = import.meta.env.VITE_VIDEO_PROXY_URL;

export async function fetchVideos({ queries = [], limit = 8 } = {}) {
  if (!BASE_URL) throw new Error("videos_unavailable");
  const map = new Map();
  for (const q of queries) {
    try {
      const res = await fetch(`${BASE_URL}/videos?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      for (const item of data.items || []) {
        if (!map.has(item.url)) map.set(item.url, item);
      }
    } catch (e) {
      console.error("[fetchVideos] erro:", e);
    }
  }
  return Array.from(map.values()).slice(0, limit);
}
