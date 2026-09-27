import { supabase, hasSupabaseConfig } from "./supabaseClient";

export async function signInWithSupabase(email, password) {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUpWithSupabase(email, password, extra = {}) {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: extra,
    },
  });

  if (error) throw error;
  return data;
}

export async function getSupabaseSession() {
  if (!hasSupabaseConfig || !supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function signOutSupabase() {
  if (!hasSupabaseConfig || !supabase) {
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
