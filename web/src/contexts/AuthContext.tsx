'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { authService } from '@/services/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, companyName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authService.getCurrentUser();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (response.success && response.data) {
      localStorage.setItem('token', response.data.token);
      setUser({
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        role: response.data.role as any,
        companyId: response.data.companyId,
      });
    } else {
      throw new Error(response.error || 'Login failed');
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    companyName: string
  ) => {
    const response = await authService.register({ email, password, name, companyName });
    if (response.success && response.data) {
      localStorage.setItem('token', response.data.token);
      setUser({
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        role: response.data.role as any,
        companyId: response.data.companyId,
      });
    } else {
      throw new Error(response.error || 'Registration failed');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
