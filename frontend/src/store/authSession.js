import { hasSupabaseConfig, supabase } from "../lib/supabaseClient";
import { receiveUser, removeUser } from "./usersReducer";

export const restoreSession = async () => {
  if (!hasSupabaseConfig || !supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const subscribeToAuthState = (dispatch) => {
  if (!hasSupabaseConfig || !supabase) {
    return () => {};
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    if (session?.user) {
      dispatch(receiveUser({ id: session.user.id, email: session.user.email }));
    } else {
      dispatch(removeUser());
    }
  });

  return () => subscription.unsubscribe();
};
