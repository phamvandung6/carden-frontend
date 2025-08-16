// User API Service
import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types';
import type {
  UserProfile,
  UserStats,
  UserAchievement,
  UpdateProfileRequest,
  UpdatePreferencesRequest,
  UpdateTTSSettingsRequest,
  UploadAvatarResponse
} from '../types';

export const userApi = {
  // Profile management
  async getProfile(userId?: string): Promise<ApiResponse<UserProfile>> {
    const endpoint = userId ? `/users/${userId}/profile` : '/users/profile';
    return apiClient.get(endpoint);
  },

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch('/users/profile', data);
  },

  async uploadAvatar(file: File): Promise<ApiResponse<UploadAvatarResponse>> {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiClient.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  async deleteAvatar(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete('/users/avatar');
  },

  // User preferences
  async updatePreferences(data: UpdatePreferencesRequest): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch('/users/preferences', data);
  },

  // TTS settings
  async updateTTSSettings(data: UpdateTTSSettingsRequest): Promise<ApiResponse<UserProfile>> {
    return apiClient.patch('/users/tts-settings', data);
  },

  // User statistics
  async getStats(userId?: string): Promise<ApiResponse<UserStats>> {
    const endpoint = userId ? `/users/${userId}/stats` : '/users/stats';
    return apiClient.get(endpoint);
  },

  // User achievements
  async getAchievements(userId?: string): Promise<ApiResponse<UserAchievement[]>> {
    const endpoint = userId ? `/users/${userId}/achievements` : '/users/achievements';
    return apiClient.get(endpoint);
  },

  // Account management
  async deleteAccount(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete('/users/account');
  },

  async exportData(): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiClient.post('/users/export');
  },

  // User search (for mentions, sharing, etc.)
  async searchUsers(query: string, limit = 10): Promise<ApiResponse<UserProfile[]>> {
    return apiClient.get('/users/search', {
      params: { q: query, limit }
    });
  },

  // Public profile (for viewing other users)
  async getPublicProfile(userId: string): Promise<ApiResponse<Omit<UserProfile, 'preferences' | 'ttsSettings'>>> {
    return apiClient.get(`/users/${userId}/public`);
  },

  // Follow system (if implemented)
  async followUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`/users/${userId}/follow`);
  },

  async unfollowUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`/users/${userId}/follow`);
  },

  async getFollowers(userId?: string): Promise<ApiResponse<UserProfile[]>> {
    const endpoint = userId ? `/users/${userId}/followers` : '/users/followers';
    return apiClient.get(endpoint);
  },

  async getFollowing(userId?: string): Promise<ApiResponse<UserProfile[]>> {
    const endpoint = userId ? `/users/${userId}/following` : '/users/following';
    return apiClient.get(endpoint);
  }
};
