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
