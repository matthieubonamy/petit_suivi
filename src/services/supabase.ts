import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://eyknrqblaphxulurbzpj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5a25ycWJsYXBoeHVsdXJienBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyNTEzMjMsImV4cCI6MjA5NjgyNzMyM30.dTwt1ArdhsNZKXsd2O9vPZlJC7hAx01vHoYW6HegG5k';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface AuthResult {
  success: boolean;
  error?: string;
  userId?: string;
  email?: string;
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, error: error.message };
    if (data.user) {
      return { success: true, userId: data.user.id, email: data.user.email ?? undefined };
    }
    return { success: false, error: 'Erreur inconnue' };
  } catch (e: any) {
    return { success: false, error: e.message ?? 'Erreur réseau' };
  }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    if (data.user) {
      return { success: true, userId: data.user.id, email: data.user.email ?? undefined };
    }
    return { success: false, error: 'Erreur inconnue' };
  } catch (e: any) {
    return { success: false, error: e.message ?? 'Erreur réseau' };
  }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message ?? 'Erreur réseau' };
  }
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
