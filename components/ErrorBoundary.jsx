import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, err: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, err: error };
  }
  componentDidCatch(error, info) {
    console.error("UI crash capturado:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl shadow-md p-6 bg-white dark:bg-slate-900">
            <h1 className="text-xl font-bold mb-2">Ops, algo falhou na interface</h1>
            <p className="text-sm opacity-80 mb-4">
              Tente recarregar a página. Se persistir, verifique suas chaves (Supabase/Gemini).
            </p>
            <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-3 rounded overflow-auto">
              {String(this.state.err)}
            </pre>
            <button
              onClick={() => { this.setState({ hasError: false, err: null }); location.reload(); }}
              className="mt-4 px-4 py-2 rounded bg-blue-600 text-white"
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
