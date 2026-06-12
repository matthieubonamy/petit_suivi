import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '../types';
import { getSession, signIn, signOut, signUp, resetPassword } from '../services/supabase';

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const session = await getSession();
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? '' });
      }
    } catch {
      // Ignore - placeholders will fail
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, password: string) {
    const result = await signIn(email, password);
    if (result.success && result.userId && result.email) {
      setUser({ id: result.userId, email: result.email });
    }
    return { success: result.success, error: result.error };
  }

  async function register(email: string, password: string) {
    const result = await signUp(email, password);
    if (result.success && result.userId && result.email) {
      setUser({ id: result.userId, email: result.email });
    }
    return { success: result.success, error: result.error };
  }

  async function logout() {
    await signOut();
    setUser(null);
  }

  async function forgotPassword(email: string) {
    const result = await resetPassword(email);
    return { success: result.success, error: result.error };
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, forgotPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
