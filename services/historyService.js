import { supabase } from "./supabaseClient.js";

export async function saveHistory({ kind, subject, params, payload }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Precisa estar logado.");
  const { data, error } = await supabase
    .from("generated_history")
    .insert([{ user_id: user.id, kind, subject, params, payload }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function listHistory({ kind } = {}) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Precisa estar logado.");
  let q = supabase.from("generated_history").select("*").order("created_at", { ascending: false });
  if (kind) q = q.eq("kind", kind);
  const { data, error } = await q;
  if (error) throw error;
  return data || [];
}

export async function getHistoryById(id) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Precisa estar logado.");
  const { data, error } = await supabase
    .from("generated_history")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export const getHistoryItem = getHistoryById;
