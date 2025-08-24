import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient.js";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [modo, setModo] = useState("login"); // login | signup
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) nav("/perfil");
    });
  }, [nav]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(""); setMsg(""); setLoading(true);
    try {
      if (modo === "signup") {
        const { error } = await supabase.auth.signUp({ email, password: senha });
        if (error) throw error;
        setMsg("Cadastro criado! Se pedir confirmação por e-mail, verifique sua caixa.");
        setModo("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
        nav("/perfil");
      }
    } catch (er) {
      setErr(er.message || "Falha no login/cadastro");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        {modo === "login" ? "Entrar" : "Criar conta"}
      </h1>

      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1">
          <span>Email</span>
          <input className="border rounded px-3 py-2" value={email}
                 onChange={(e)=>setEmail(e.target.value)} />
        </label>

        <label className="grid gap-1">
          <span>Senha</span>
          <input type="password" className="border rounded px-3 py-2" value={senha}
                 onChange={(e)=>setSenha(e.target.value)} />
        </label>

        <button disabled={loading}
                className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-50">
          {loading ? "Enviando..." : (modo === "login" ? "Entrar" : "Criar conta")}
        </button>
      </form>

      <div className="mt-3">
        <button className="underline" onClick={()=>setModo(modo === "login" ? "signup" : "login")}>
          {modo === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça login"}
        </button>
      </div>

      {msg && <div className="mt-3 p-2 border rounded bg-green-50 text-green-700">{msg}</div>}
      {err && <div className="mt-3 p-2 border rounded bg-red-50 text-red-700">{err}</div>}
    </main>
  );
}
