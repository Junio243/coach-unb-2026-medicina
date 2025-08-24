import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient.js';
import { useNavigate } from 'react-router-dom';

export default function PerfilPage() {
  const [fullName, setFullName] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      if (!user) {
        navigate('/login');
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, goal')
        .eq('user_id', user.id)
        .single();
      if (profile) {
        setFullName(profile.full_name || '');
        setGoal(profile.goal || '');
      }
      setLoading(false);
    });
  }, [navigate]);

  async function saveProfile() {
    try {
      setError('');
      setSaving(true);
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      const { error } = await supabase.from('profiles').upsert({
        user_id: user.id,
        full_name: fullName,
        goal,
      });
      if (error) throw error;
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  if (loading) return <div className="p-6">Carregando...</div>;

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Perfil</h1>
      <div className="grid gap-3 mb-4">
        <input
          className="border rounded px-3 py-2"
          placeholder="Nome completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          className="border rounded px-3 py-2"
          placeholder="Objetivo"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <button
          onClick={saveProfile}
          disabled={saving}
          className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
        <button
          onClick={signOut}
          className="bg-slate-600 text-white rounded px-4 py-2"
        >
          Sair
        </button>
      </div>
      {error && (
        <div className="bg-red-100 text-red-800 border border-red-300 rounded p-3">{error}</div>
      )}
    </main>
  );
}
