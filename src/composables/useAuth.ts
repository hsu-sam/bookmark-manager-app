import { computed, ref } from "vue";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/utils/supabase";

const user = ref<User | null>(null);
const session = ref<Session | null>(null);
const isReady = ref(false);

let initPromise: Promise<void> | null = null;

function initAuth(): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = supabase.auth.getSession().then(({ data }) => {
    session.value = data.session;
    user.value = data.session?.user ?? null;
    isReady.value = true;

    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession;
      user.value = newSession?.user ?? null;
    });
  });

  return initPromise;
}

const isAuthenticated = computed(() => !!session.value);

async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { error };
}

async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  return { data, error };
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

async function sendPasswordReset(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { error };
}

async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { error };
}

export function useAuth() {
  return {
    user,
    session,
    isReady,
    isAuthenticated,
    initAuth,
    signIn,
    signUp,
    signOut,
    sendPasswordReset,
    updatePassword,
  };
}
