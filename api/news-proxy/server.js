import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import { parse } from "rss-to-json";

const app = express();
app.use(cors({ origin: process.env.ALLOW_ORIGIN || "*" }));

// Ex.: /news?q=vestibular%20unb
app.get("/news", async (req, res) => {
  try {
    const q = (req.query.q || "").toString();
    if (!q) return res.status(400).json({ error: "missing q" });

    // Google News RSS
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
    const rss = await parse(url);
    const items = (rss?.items || []).map(i => ({
      title: i.title,
      url: i.link,
      source: i.source?.title || "Google News",
      publishedAt: i.published
    }));
    res.json({ items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("news-proxy on " + port));
