import { create } from 'zustand';
import type { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase, supabaseConfigured } from '../lib/supabase';

type SignUpResult = { ok: true; needsConfirmation: boolean } | { ok: false; error: string };
type SignInResult = { ok: true } | { ok: false; error: string };
type ResetResult = { ok: true } | { ok: false; error: string };

const UNAVAILABLE = 'Sign in is currently unavailable. Please try again later.';

// Translate Supabase / network errors into short, user-friendly messages.
// Raw error strings are never shown to users — they only appear in dev logs.
function friendlyAuthError(err: AuthError | Error | unknown): string {
  if (__DEV__) {
    // eslint-disable-next-line no-console
    console.warn('[auth] error:', err);
  }
  if (!err) return UNAVAILABLE;
  const raw = (err as { message?: string }).message ?? String(err);
  const msg = raw.toLowerCase();

  if (msg.includes('invalid login credentials')) {
    return 'Incorrect email or password.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Please confirm your email first. Check your inbox for the link.';
  }
  if (msg.includes('user already registered') || msg.includes('already been registered')) {
    return 'An account with this email already exists. Try signing in.';
  }
  if (msg.includes('password should be at least') || msg.includes('weak password')) {
    return 'Use at least 6 characters for your password.';
  }
  if (msg.includes('rate limit') || msg.includes('for security purposes')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }
  if (msg.includes('unable to validate email') || msg.includes('invalid email')) {
    return 'That doesn’t look like a valid email address.';
  }
  if (msg.includes('network') || msg.includes('fetch') || msg.includes('timeout')) {
    return 'Couldn’t reach the server. Check your connection and try again.';
  }
  return UNAVAILABLE;
}

type AuthState = {
  session: Session | null;
  user: User | null;
  initializing: boolean;
  init: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<ResetResult>;
};

let subscription: { unsubscribe: () => void } | null = null;

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  initializing: true,

  init: async () => {
    if (subscription) return;
    if (!supabaseConfigured) {
      set({ initializing: false });
      return;
    }
    try {
      const { data } = await supabase.auth.getSession();
      set({
        session: data.session,
        user: data.session?.user ?? null,
        initializing: false,
      });
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null });
      });
      subscription = sub.subscription;
    } catch (err) {
      if (__DEV__) console.warn('[auth] init failed:', err);
      set({ initializing: false });
    }
  },

  signUp: async (email, password) => {
    if (!supabaseConfigured) {
      return { ok: false, error: UNAVAILABLE };
    }
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { ok: false, error: friendlyAuthError(error) };
      return { ok: true, needsConfirmation: !data.session };
    } catch (err) {
      return { ok: false, error: friendlyAuthError(err) };
    }
  },

  signIn: async (email, password) => {
    if (!supabaseConfigured) {
      return { ok: false, error: UNAVAILABLE };
    }
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { ok: false, error: friendlyAuthError(error) };
      return { ok: true };
    } catch (err) {
      return { ok: false, error: friendlyAuthError(err) };
    }
  },

  signOut: async () => {
    if (!supabaseConfigured) return;
    try {
      await supabase.auth.signOut();
    } catch (err) {
      if (__DEV__) console.warn('[auth] signOut failed:', err);
    }
  },

  sendPasswordReset: async (email) => {
    if (!supabaseConfigured) {
      return { ok: false, error: UNAVAILABLE };
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'onefaith://auth/reset',
      });
      if (error) return { ok: false, error: friendlyAuthError(error) };
      return { ok: true };
    } catch (err) {
      return { ok: false, error: friendlyAuthError(err) };
    }
  },
}));
