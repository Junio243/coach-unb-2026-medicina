import { supabase } from "./supabaseClient.js";
import { discoverExamProfile } from "./geminiService.js";
import { addUserSubject } from "./subjectsService.js";

export async function autoPrepareExam({ targetExam = "", university = "", location = "" }) {
  const profile = await discoverExamProfile({ targetExam, university, location });

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("exam_profiles").upsert({
        user_id: user.id,
        target_exam: targetExam,
        university,
        location,
        profile_json: profile,
      });

      for (const s of profile?.exam_overview?.subjects || []) {
        try { await addUserSubject(s); } catch {}
      }
    }
  } catch (e) {
    console.error("[autoPrepareExam] erro:", e);
  }

  return profile;
}
