// services/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Se não tiver envs, exporta um stub inofensivo pra evitar tela branca.
export const supabase = (url && anon)
  ? createClient(url, anon, { auth: { persistSession: true, autoRefreshToken: true } })
  : {
      auth: {
        async getSession() { return { data: { session: null } }; },
        async getUser() { return { data: { user: null } }; },
        async signInWithPassword() { throw new Error("Login indisponível: Supabase não configurado."); },
        async signUp() { throw new Error("Cadastro indisponível: Supabase não configurado."); },
        async signOut() {}
      },
      from() {
        const err = new Error("Banco indisponível: Supabase não configurado.");
        return {
          select: async () => ({ data: null, error: err }),
          upsert: async () => ({ data: null, error: err })
        };
      }
    };
