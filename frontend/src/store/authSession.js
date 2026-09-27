import { hasSupabaseConfig, supabase } from "../lib/supabaseClient";

export const restoreSession = async () => {
  if (!hasSupabaseConfig || !supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};
