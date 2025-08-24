import { supabase } from "./supabaseClient.js";

export async function listDifficulties() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("learning_difficulties")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createDifficulty({ subject, difficulty_type, description, intensity, interventions, follow_up_date }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Precisa estar logado.");
  const { data, error } = await supabase
    .from("learning_difficulties")
    .insert([{ user_id: user.id, subject, difficulty_type, description, intensity, interventions, follow_up_date }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDifficulty(id, patch) {
  const { data, error } = await supabase
    .from("learning_difficulties")
    .update(patch)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDifficulty(id) {
  const { error } = await supabase
    .from("learning_difficulties")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
