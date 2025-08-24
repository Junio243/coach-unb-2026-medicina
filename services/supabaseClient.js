// services/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const url  = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Query stub que nunca quebra a UI
function makeQueryStub() {
  const err = new Error("Banco indisponível: Supabase não configurado.");
  const q = {
    select: async () => ({ data: null, error: err }),
    insert: async () => ({ data: null, error: err }),
    upsert: async () => ({ data: null, error: err }),
    update: async () => ({ data: null, error: err }),
    delete: async () => ({ data: null, error: err }),
    order: () => q,
    eq: () => q,
    maybeSingle: async () => ({ data: null, error: err }),
    single: async () => ({ data: null, error: err })
  };
  return q;
}

// Stub de auth compatível com o v2 (tem onAuthStateChange)
function makeStub() {
  return {
    auth: {
      async getSession() { return { data: { session: null }, error: null }; },
      async getUser()    { return { data: { user: null },    error: null }; },
      onAuthStateChange(callback) {
        const subscription = { unsubscribe(){} };
        // chama callback uma vez para não quebrar fluxos
        try { if (typeof callback === "function") callback("INITIAL_SESSION", null); } catch {}
        return { data: { subscription }, error: null };
      },
      async signInWithPassword() { throw new Error("Login indisponível: Supabase não configurado."); },
      async signUp()             { throw new Error("Cadastro indisponível: Supabase não configurado."); },
      async signOut() {}
    },
    from() { return makeQueryStub(); }
  };
}

export const supabase = (url && anon)
  ? createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } })
  : makeStub();
