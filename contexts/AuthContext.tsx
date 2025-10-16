"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authAPI, type User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; full_name: string; phone?: string; address?: string; preferred_brand?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      if (response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    if (response.error) {
      throw new Error(response.error);
    }
    if (response.data) {
      // Store token in localStorage
      const token = (response.data as any).token;
      if (token) {
        localStorage.setItem('auth_token', token);
      }
      // Store user data (without token)
      const user = (response.data as any).user || response.data;
      setUser(user);
    }
  };

  const register = async (data: { email: string; password: string; full_name: string; phone?: string; address?: string; preferred_brand?: string }) => {
    const response = await authAPI.register(data);
    if (response.error) {
      throw new Error(response.error);
    }
    if (response.data) {
      // Store token in localStorage
      const token = (response.data as any).token;
      if (token) {
        localStorage.setItem('auth_token', token);
      }
      // Store user data (without token)
      const user = (response.data as any).user || response.data;
      setUser(user);
    }
  };

  const logout = async () => {
    await authAPI.logout();
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
