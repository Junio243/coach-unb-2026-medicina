<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This repository contains everything you need to run the Coach UnB app locally or deploy it as a static site.

## Ambiente

- **Node**: 20.x
- **Variáveis de ambiente**:
  - `GEMINI_API_KEY` – Client Key do Google AI Studio
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_NEWS_PROXY_URL` – URL do serviço de notícias (ver abaixo)
  - `VITE_VIDEO_PROXY_URL` – URL do serviço de vídeos (ver abaixo)

Configure-as em `.env.local` para desenvolvimento e em _Environment Variables_ no Render para produção.

### Allowed Domains (Google AI Studio)

No [Google AI Studio](https://aistudio.google.com/app/apikey), crie uma Client Key e adicione o domínio do Render (sem barra final) em **Allowed Domains**. Use essa chave em `GEMINI_API_KEY`.

## Rodar localmente

1. Instale dependências: `npm install`
2. Inicie o ambiente: `npm run dev`

## Build e Deploy

1. Gerar build: `npm run build`
2. Pré-visualizar: `npm run preview`
3. No Render, suba o conteúdo de `dist/` e, se precisar, use **Clear build cache & deploy**.

## Supabase

Execute o script `supabase.sql` para criar as tabelas de histórico, quizzes e matérias favoritas com as políticas de RLS necessárias.

## News proxy

Há uma micro-API Node em `/api/news-proxy` usada para buscar notícias recentes do exame via Google News RSS.

No Render, crie um novo **Web Service** apontando para essa pasta (`api/news-proxy`) com **Node 20** e defina a env `ALLOW_ORIGIN=https://coach-unb-2026-medicina.onrender.com`.

Use a URL pública do serviço na variável `VITE_NEWS_PROXY_URL` do site principal.

## Video proxy

Há também uma micro-API em `/api/video-proxy` para buscar vídeos do YouTube.

No Render, crie um **Web Service** apontando para essa pasta com Node 20 e defina as variáveis:

- `YT_API_KEY` – chave da YouTube Data API
- `ALLOW_ORIGIN=https://coach-unb-2026-medicina.onrender.com`

No front, use a URL pública desse serviço em `VITE_VIDEO_PROXY_URL`.

## Disciplinas e recursos

A plataforma Coach UnB indica a teoria essencial para cada matéria e oferece baterias de questões padronizadas no modelo Cebraspe. Também há minissimulados por disciplina, testes práticos com respostas comentadas e exercícios de aprofundamento.

Disciplinas abordadas no preparatório:

- História
- Geografia
- Sociologia
- Filosofia
- Literatura e Interpretação de Texto
- Gramática
- Física
- Química
- Matemática
- Biologia
