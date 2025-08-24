// vite.config.ts
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

// __dirname para ESM (porque "type": "module" no package.json)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // carrega variáveis no build (Render → Environment Variables)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Render serve na raiz do domínio
    base: '/',
    define: {
      // ⚠️ Use a Client Key do Google AI Studio com Allowed Domains
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            genai: ['@google/genai'],
          },
        },
      },
    },
  };
});
