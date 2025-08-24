return {
  base: '/',  // importante para Render (site na raiz)
  define: {
    'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') }
  }
};
