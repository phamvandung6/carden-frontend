// Authentication Store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { User, AuthState, StoredTokenData } from '../types';

interface AuthStore extends AuthState {
  // Actions
  setUser: (user: User, tokenData: { accessToken: string; expiresIn: number }) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Token management
  setTokens: (accessToken: string, expiresIn: number) => void;
  clearTokens: () => void;
  isTokenExpired: () => boolean;
  getToken: () => string | null;
  
  // Computed getters
  isLoggedIn: () => boolean;
  getCurrentUser: () => User | null;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    immer((set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      accessToken: null,
      tokenExpiry: null,

      // Actions
      setUser: (user, tokenData) => {
        set((state) => {
          state.user = user;
          state.isAuthenticated = true;
          state.accessToken = tokenData.accessToken;
          state.tokenExpiry = Date.now() + (tokenData.expiresIn * 1000);
          state.error = null;
          state.isLoading = false;
        });

        // Store token in localStorage for API client
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', tokenData.accessToken);
        }
      },

      clearAuth: () => {
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.accessToken = null;
          state.tokenExpiry = null;
          state.error = null;
          state.isLoading = false;
        });

        // Clear tokens from localStorage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      },

      setLoading: (loading) => {
        set((state) => {
          state.isLoading = loading;
        });
      },

      setError: (error) => {
        set((state) => {
          state.error = error;
          state.isLoading = false;
        });
      },

      updateUser: (updates) => {
        set((state) => {
          if (state.user) {
            Object.assign(state.user, updates);
          }
        });
      },

      setTokens: (accessToken, expiresIn) => {
        set((state) => {
          state.accessToken = accessToken;
          state.tokenExpiry = Date.now() + (expiresIn * 1000);
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
        }
      },

      clearTokens: () => {
        set((state) => {
          state.accessToken = null;
          state.tokenExpiry = null;
        });

        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      },

      isTokenExpired: () => {
        const { tokenExpiry } = get();
        if (!tokenExpiry) return true;
        return Date.now() >= tokenExpiry;
      },

      getToken: () => {
        const { accessToken, isTokenExpired } = get();
        if (!accessToken || isTokenExpired()) return null;
        return accessToken;
      },

      // Computed getters
      isLoggedIn: () => {
        const { user, isAuthenticated, isTokenExpired } = get();
        return !!(user && isAuthenticated && !isTokenExpired());
      },

      getCurrentUser: () => {
        const { user, isLoggedIn } = get();
        return isLoggedIn() ? user : null;
      },
    })),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        tokenExpiry: state.tokenExpiry,
        // Don't persist loading states and errors
      }),
      
      // Rehydrate and validate stored data
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Check if token is expired on rehydration
          if (state.isTokenExpired()) {
            state.clearAuth();
          }
        }
      },
    }
  )
);

// Selectors for easier access
export const authSelectors = {
  user: (state: AuthStore) => state.user,
  isAuthenticated: (state: AuthStore) => state.isAuthenticated,
  isLoggedIn: (state: AuthStore) => state.isLoggedIn(),
  isLoading: (state: AuthStore) => state.isLoading,
  error: (state: AuthStore) => state.error,
  accessToken: (state: AuthStore) => state.accessToken,
  
  // User property selectors
  userId: (state: AuthStore) => state.user?.id,
  username: (state: AuthStore) => state.user?.username,
  email: (state: AuthStore) => state.user?.email,
  displayName: (state: AuthStore) => state.user?.displayName,
  role: (state: AuthStore) => state.user?.role,
  isEmailVerified: (state: AuthStore) => state.user?.emailVerified || false,
  
  // Permission checks
  isAdmin: (state: AuthStore) => state.user?.role === 'ADMIN',
  isUser: (state: AuthStore) => state.user?.role === 'USER',
};
