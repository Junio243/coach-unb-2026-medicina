import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient.js";
import { useNavigate } from "react-router-dom";

export default function PerfilPage() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [nome, setNome] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return nav("/login");
      setUser(user);

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, goal")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") { // not found
        setErr(error.message); return;
      }
      if (data) {
        setNome(data.full_name || "");
        setObjetivo(data.goal || "");
      }
    })();
  }, [nav]);

  async function salvar() {
    if (!user) return;
    setErr(""); setMsg(""); setLoading(true);
    try {
      const row = { user_id: user.id, full_name: nome, goal: objetivo };
      const { error } = await supabase.from("profiles").upsert(row).select().single();
      if (error) throw error;
      setMsg("Perfil salvo!");
    } catch (er) {
      setErr(er.message || "Falha ao salvar perfil");
    } finally {
      setLoading(false);
    }
  }

  async function sair() {
    await supabase.auth.signOut();
    nav("/login");
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>

      <div className="grid gap-3">
        <label className="grid gap-1">
          <span>Nome</span>
          <input className="border rounded px-3 py-2" value={nome}
                 onChange={(e)=>setNome(e.target.value)} />
        </label>

        <label className="grid gap-1">
          <span>Objetivo</span>
          <input className="border rounded px-3 py-2" value={objetivo}
                 onChange={(e)=>setObjetivo(e.target.value)} />
        </label>

        <div className="flex gap-2">
          <button onClick={salvar} disabled={loading}
                  className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50">
            {loading ? "Salvando..." : "Salvar"}
          </button>
          <button onClick={sair} className="border rounded px-4 py-2">Sair</button>
        </div>

        {msg && <div className="mt-2 p-2 border rounded bg-green-50 text-green-700">{msg}</div>}
        {err && <div className="mt-2 p-2 border rounded bg-red-50 text-red-700">{err}</div>}
      </div>
    </main>
  );
}
