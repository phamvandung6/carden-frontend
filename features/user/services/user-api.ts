// User API Service
// Based on backend API documentation: /v1/users/*

import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types';
import type {
  User,
  UserProfile,
  UpdateUserProfileRequest,
  TTSSettings,
  UpdateTTSSettingsRequest,
  PresignedUrlResponse,
  AvatarConfirmResponse
} from '../types';

export const userApi = {
  /**
   * Get current user profile
   * GET /v1/users/me
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get('/v1/users/me');
  },

  /**
   * Update user profile
   * PATCH /v1/users/me
   */
  async updateProfile(data: UpdateUserProfileRequest): Promise<ApiResponse<User>> {
    return apiClient.patch('/v1/users/me', data);
  },

  /**
   * Get TTS settings
   * GET /v1/users/me/tts-settings
   */
  async getTTSSettings(): Promise<ApiResponse<TTSSettings>> {
    return apiClient.get('/v1/users/me/tts-settings');
  },

  /**
   * Update TTS settings
   * PATCH /v1/users/me/tts-settings
   */
  async updateTTSSettings(data: UpdateTTSSettingsRequest): Promise<ApiResponse<TTSSettings>> {
    return apiClient.patch('/v1/users/me/tts-settings', data);
  },

  /**
   * Get presigned URL for avatar upload
   * POST /v1/users/me/avatar/presign?contentType={content_type}
   */
  async getAvatarPresignedUrl(contentType: string): Promise<ApiResponse<PresignedUrlResponse>> {
    return apiClient.post(`/v1/users/me/avatar/presign?contentType=${encodeURIComponent(contentType)}`);
  },

  /**
   * Confirm avatar upload
   * POST /v1/users/me/avatar/confirm?publicUrl={public_url}
   */
  async confirmAvatarUpload(publicUrl: string): Promise<ApiResponse<AvatarConfirmResponse>> {
    return apiClient.post(`/v1/users/me/avatar/confirm?publicUrl=${encodeURIComponent(publicUrl)}`);
  },
};

export default userApi;