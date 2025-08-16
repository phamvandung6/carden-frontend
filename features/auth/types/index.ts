// Authentication Feature Types
// Based on backend API documentation

import type { ApiResponse } from '@/types';

export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  role: 'USER' | 'ADMIN';
  emailVerified: boolean;
  uiLanguage: string;
  timezone: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: User;
  timestamp: string;
}

// Request types
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface LogoutRequest {
  // No body needed, token sent via Authorization header
}

// Form types for UI
export interface LoginFormData {
  usernameOrEmail: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  agreeToTerms: boolean;
}

// Auth state management
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  tokenExpiry: number | null;
}

// Token management
export interface TokenData {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  timestamp: string;
}

export interface StoredTokenData {
  accessToken: string;
  expiresAt: number; // timestamp when token expires
  user: User;
}

// Auth context types
export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<ApiResponse<AuthResponse>>;
  register: (userData: RegisterRequest) => Promise<ApiResponse<AuthResponse>>;
  logout: () => Promise<ApiResponse<{ message: string }>>;
  clearError: () => void;
}

// Route protection types
export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: User['role'];
  fallback?: React.ReactNode;
}

// API error types specific to auth
export interface AuthError {
  success: false;
  message: string;
  errors?: {
    username?: string[];
    email?: string[];
    password?: string[];
    usernameOrEmail?: string[];
    fullName?: string[];
  };
  code?: 'INVALID_CREDENTIALS' | 'USER_EXISTS' | 'VALIDATION_ERROR' | 'TOKEN_EXPIRED';
}
