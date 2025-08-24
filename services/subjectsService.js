import { supabase } from "./supabaseClient.js";

export async function listUserSubjects() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("user_subjects")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function addUserSubject(name) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Precisa estar logado.");
  const { error } = await supabase
    .from("user_subjects")
    .insert([{ user_id: user.id, subject: name }]);
  if (error) throw error;
}

export async function removeUserSubject(id) {
  const { error } = await supabase
    .from("user_subjects")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
