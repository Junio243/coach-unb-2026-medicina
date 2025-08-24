import { supabase } from "./supabaseClient.js";

export async function createQuizFromPayload({ subject, meta, questions }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Precisa estar logado.");
  const { data, error } = await supabase
    .from("quizzes")
    .insert([{ user_id: user.id, subject, meta, questions }])
    .select()
    .single();
  if (error) throw error;
  return data; // {id,...}
}

export async function getQuizById(id) {
  const { data, error } = await supabase.from("quizzes").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function answerQuestion({ quizId, questionIndex, selectedIndex, correctIndex }) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Precisa estar logado.");
  const is_correct = Number(selectedIndex) === Number(correctIndex);
  const { error } = await supabase.from("quiz_answers").insert([
    {
      quiz_id: quizId,
      user_id: user.id,
      question_index: questionIndex,
      selected_index: selectedIndex,
      is_correct,
    },
  ]);
  if (error) throw error;
  return { is_correct };
}

export async function finishQuiz({ quizId, score }) {
  const { error } = await supabase
    .from("quizzes")
    .update({ score, finished_at: new Date().toISOString() })
    .eq("id", quizId);
  if (error) throw error;
}
