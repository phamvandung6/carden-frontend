'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import type { AuthContextValue } from '@/features/auth/types';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  useEffect(() => {
    // Check authentication status on mount
    auth.checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue: AuthContextValue = {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    login: async (credentials) => {
      const result = await auth.login(credentials);
      return result;
    },
    register: async (userData) => {
      const result = await auth.register(userData);
      return result;
    },
    logout: async () => {
      const result = await auth.logout();
      return result;
    },
    clearError: auth.clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
