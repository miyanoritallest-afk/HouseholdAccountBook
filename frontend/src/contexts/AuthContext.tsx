"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@/types";
import apiClient from "@/lib/apiClient";
import { saveAuthData, clearAuthData, getUser } from "@/lib/auth";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getUser());
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiClient.post<{ token: string; user: User }>("/api/v1/auth/login", {
      email,
      password,
    });
    saveAuthData(res.data.token, res.data.user);
    setUser(res.data.user);
  };

  const signup = async (email: string, password: string) => {
    const res = await apiClient.post<{ token: string; user: User }>("/api/v1/auth/signup", {
      email,
      password,
    });
    saveAuthData(res.data.token, res.data.user);
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await apiClient.delete("/api/v1/auth/logout");
    } finally {
      clearAuthData();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
