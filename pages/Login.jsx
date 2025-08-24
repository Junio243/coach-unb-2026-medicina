import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient.js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleAuth(type) {
    try {
      setError('');
      setLoading(true);
      const fn = type === 'signin' ? supabase.auth.signInWithPassword : supabase.auth.signUp;
      const { error } = await fn({ email, password });
      if (error) throw error;
      navigate('/perfil');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <div className="grid gap-3 mb-4">
        <input
          type="email"
          className="border rounded px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border rounded px-3 py-2"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={() => handleAuth('signin')}
          disabled={loading}
          className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {loading ? 'Aguarde...' : 'Entrar'}
        </button>
        <button
          onClick={() => handleAuth('signup')}
          disabled={loading}
          className="bg-slate-600 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          Cadastrar
        </button>
      </div>
      {error && (
        <div className="bg-red-100 text-red-800 border border-red-300 rounded p-3">{error}</div>
      )}
    </main>
  );
}
