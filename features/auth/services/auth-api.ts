// Authentication API Service
// Based on backend API documentation: /api/v1/auth/*

import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User
} from '../types';

export const authApi = {
  /**
   * Register new user account
   * POST /v1/auth/register
   */
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post('/v1/auth/register', {
      username: data.username,
      email: data.email,
      password: data.password,
      fullName: data.fullName
    });
  },

  /**
   * Login to system
   * POST /v1/auth/login
   */
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post('/v1/auth/login', {
      usernameOrEmail: data.usernameOrEmail,
      password: data.password
    });
  },

  /**
   * Logout from system
   * POST /v1/auth/logout
   * Requires Authorization header with Bearer token
   */
  async logout(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/v1/auth/logout');
  },

  /**
   * Get current user profile
   * GET /v1/users/me
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get('/v1/users/me');
  },

  /**
   * Refresh token (if endpoint exists)
   * This might be available as POST /v1/auth/refresh
   */
  async refreshToken(refreshToken?: string): Promise<ApiResponse<AuthResponse>> {
    return apiClient.post('/v1/auth/refresh', {
      refreshToken
    });
  },

  /**
   * Verify email (if endpoint exists)
   * This might be available as POST /v1/auth/verify-email
   */
  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/v1/auth/verify-email', {
      token
    });
  },

  /**
   * Send verification email (if endpoint exists)
   */
  async sendVerificationEmail(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/v1/auth/send-verification');
  },

  /**
   * Request password reset (if endpoint exists)
   */
  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/v1/auth/forgot-password', {
      email
    });
  },

  /**
   * Reset password (if endpoint exists)
   */
  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/v1/auth/reset-password', {
      token,
      newPassword
    });
  },

  /**
   * Change password (if endpoint exists)
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post('/v1/auth/change-password', {
      currentPassword,
      newPassword
    });
  }
};
