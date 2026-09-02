"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { getToken, getStoredUser, removeToken, fetchCurrentUser, signup as apiSignup, login as apiLogin, googleVerify as apiGoogleVerify, type AuthResponse, type SignupPayload, type LoginPayload } from "./api";

export interface User {
  _id: string; name: string; email?: string; username?: string;
  role: number; avatar?: string; verified: boolean; provider: string;
}

interface AuthState { user: User | null; loading: boolean; authenticated: boolean; }
interface AuthContextValue extends AuthState {
  signup: (p: SignupPayload) => Promise<void>;
  login: (p: LoginPayload) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, authenticated: false });

  const refreshUser = useCallback(async () => {
    try {
      const user = await fetchCurrentUser();
      setState({ user, loading: false, authenticated: true });
    } catch {
      removeToken();
      setState({ user: null, loading: false, authenticated: false });
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();
    if (token && storedUser) {
      setState({ user: storedUser, loading: false, authenticated: true });
    } else if (token) {
      void refreshUser();
    } else {
      setState(s => ({ ...s, loading: false }));
    }
  }, [refreshUser]);

  const signup = useCallback(async (p: SignupPayload) => {
    const res: AuthResponse = await apiSignup(p);
    setState({ user: res.user, loading: false, authenticated: true });
  }, []);

  const login = useCallback(async (p: LoginPayload) => {
    const res: AuthResponse = await apiLogin(p);
    setState({ user: res.user, loading: false, authenticated: true });
  }, []);

  const googleLogin = useCallback(async (idToken: string) => {
    const res: AuthResponse = await apiGoogleVerify({ idToken });
    setState({ user: res.user, loading: false, authenticated: true });
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setState({ user: null, loading: false, authenticated: false });
    window.location.href = "/login";
  }, []);

  return <AuthContext.Provider value={{ ...state, signup, login, googleLogin, logout, refreshUser }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
