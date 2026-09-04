"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { clearStoredUser, getStoredUser, storeUser } from "@/lib/mock/auth";
import { createMockUser, demoUser, type MockUser } from "@/lib/mock/user";
import { delay } from "@/lib/mock/delay";

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  preferredLanguage: string;
  ageRange?: string;
}

interface AuthResult {
  ok: boolean;
  error?: string;
}

interface AuthContextValue {
  user: MockUser | null;
  /** True while restoring a session from storage on first load. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  loginAsDemo: () => Promise<void>;
  signup: (data: SignupData) => Promise<AuthResult>;
  logout: () => void;
  updateUser: (partial: Partial<MockUser>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Mock authentication only (master build prompt §3/§4) — no real backend
 * call, no real password check. Session is just a MockUser persisted to
 * localStorage so navigating the authenticated app feels like a real
 * logged-in session across page loads.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Deliberately deferred to an effect (not a lazy useState initializer):
    // this page is statically prerendered, so the server-rendered HTML
    // always has no session. Reading localStorage during render instead
    // would return a logged-in user on the client and cause a hydration
    // mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getStoredUser());
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    await delay(900);
    if (!email || !password) {
      return { ok: false, error: "Please enter your email and password." };
    }
    if (password.length < 6) {
      return { ok: false, error: "Incorrect email or password." };
    }
    const mockedUser = createMockUser({ id: email, email });
    storeUser(mockedUser);
    setUser(mockedUser);
    return { ok: true };
  };

  const loginAsDemo = async () => {
    await delay(500);
    storeUser(demoUser);
    setUser(demoUser);
  };

  const signup = async (data: SignupData): Promise<AuthResult> => {
    await delay(1100);
    if (!data.firstName || !data.lastName || !data.email || !data.password) {
      return { ok: false, error: "Please fill in all required fields." };
    }
    const mockedUser = createMockUser({
      id: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      preferredLanguage: data.preferredLanguage || "English",
      ageRange: data.ageRange,
    });
    storeUser(mockedUser);
    setUser(mockedUser);
    return { ok: true };
  };

  const logout = () => {
    clearStoredUser();
    setUser(null);
  };

  const updateUser = (partial: Partial<MockUser>) => {
    setUser((current) => {
      if (!current) return current;
      const updated = { ...current, ...partial };
      storeUser(updated);
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginAsDemo, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
