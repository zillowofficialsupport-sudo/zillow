import { hasSupabaseConfig, supabase } from "../lib/supabaseClient";
import { signInWithSupabase, signOutSupabase, signUpWithSupabase } from "../lib/auth";

// ACTION TYPES
const RECEIVE_USER = "users/RECEIVE_USER";
const REMOVE_USER = "users/REMOVE_USER";

// ACTION CREATORS
export const receiveUser = (user) => ({
  type: RECEIVE_USER,
  user,
});

export const removeUser = () => ({
  type: REMOVE_USER,
});

export const getActiveUser = () => (state) => {
  if (state && state.session.user) {
    return state.session.user;
  }

  return null;
};

export const loginUser = (userCredentials) => async (dispatch) => {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error("Supabase is not configured. Add the project URL and anon key.");
  }
  const { user } = await signInWithSupabase(userCredentials.email, userCredentials.password);
  dispatch(receiveUser({ id: user.id, email: user.email }));
};

export const logoutUser = () => async (dispatch) => {
  await signOutSupabase();
  dispatch(removeUser());
};

export const createUser = (user) => async (dispatch) => {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error("Supabase is not configured. Add the project URL and anon key.");
  }
  const { user: createdUser, session } = await signUpWithSupabase(user.email, user.password, {
    full_name: user.fullName || user.email,
  });
  if (!createdUser) throw new Error("Account creation did not return a user.");
  if (!session) {
    throw new Error("Account created. Verify your email, then sign in.");
  }
  dispatch(receiveUser({ id: createdUser.id, email: createdUser.email }));
};

export const fetchCurrentUser = () => async (dispatch) => {
  if (!hasSupabaseConfig || !supabase) {
    dispatch(removeUser());
    return;
  }
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  const user = data?.session?.user;
  dispatch(user ? receiveUser({ id: user.id, email: user.email }) : removeUser());
};

// REDUCER
const userReducer = (state = {}, action) => {
  const nextState = { ...state };

  switch (action.type) {
    case RECEIVE_USER:
      nextState.user = action.user;
      return nextState;
    case REMOVE_USER:
      nextState["user"] = null;
      return nextState;
    default:
      return state;
  }
};

export default userReducer;
