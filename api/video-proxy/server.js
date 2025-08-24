import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors({ origin: process.env.ALLOW_ORIGIN || "*" }));

app.get("/videos", async (req, res) => {
  try {
    const q = (req.query.q || "").toString();
    if (!q) return res.status(400).json({ error: "missing q" });
    if (!process.env.YT_API_KEY) return res.status(500).json({ error: "YT_API_KEY missing" });

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(q)}&key=${process.env.YT_API_KEY}`;
    const r = await fetch(url);
    const j = await r.json();
    const items = (j.items || []).map(i => ({
      title: i.snippet.title,
      url: `https://www.youtube.com/watch?v=${i.id.videoId}`,
      channel: i.snippet.channelTitle,
      publishedAt: i.snippet.publishedAt
    }));
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("video-proxy on " + port));
