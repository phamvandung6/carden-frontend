// User Types & Interfaces
// Based on API documentation: /v1/users/*

// Base User interface (matching backend response)
export interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  emailVerified: boolean;
  uiLanguage: 'EN' | 'VI';
  timezone: string;
  learningGoalCardsPerDay: number;
  profileImageUrl: string | null;
}

// User Profile (extends User for profile management)
export interface UserProfile extends User {
  // Additional profile-specific fields can be added here
  createdAt?: string;
  updatedAt?: string;
}

// Update Profile Request (all fields optional)
export interface UpdateUserProfileRequest {
  displayName?: string;
  email?: string;
  uiLanguage?: 'EN' | 'VI';
  timezone?: string;
  learningGoalCardsPerDay?: number;
  profileImageUrl?: string;
}

// TTS Settings
export interface TTSSettings {
  preferredVoice: string | null;
  speechRate: number; // 0.5 - 2.0
  speechPitch: number; // 0.5 - 2.0
  speechVolume: number; // 0.0 - 1.0
  ttsEnabled: boolean;
}

// Update TTS Settings Request (all fields optional)
export interface UpdateTTSSettingsRequest {
  preferredVoice?: string;
  speechRate?: number;
  speechPitch?: number;
  speechVolume?: number;
  ttsEnabled?: boolean;
}

// Avatar Upload Types
export interface PresignedUrlResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
  expiresAt: string;
}

export interface AvatarConfirmResponse {
  message: string;
  data: string; // The confirmed avatar URL
}

// User Preferences (for UI settings)
export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language: 'EN' | 'VI';
  timezone: string;
  learningGoal: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

// User Statistics (for dashboard/profile display)
export interface UserStats {
  totalDecks: number;
  totalCards: number;
  studyStreak: number;
  cardsStudiedToday: number;
  averageAccuracy: number;
  totalStudyTime: number; // in minutes
  level: number;
  experiencePoints: number;
  nextLevelXP: number;
}

// Achievement System
export interface Achievement {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
  category: 'study' | 'social' | 'streak' | 'mastery' | 'collection';
}

// User Store State
export interface UserState {
  // User data
  user: User | null;
  profile: UserProfile | null;
  ttsSettings: TTSSettings | null;
  preferences: UserPreferences | null;
  stats: UserStats | null;
  achievements: Achievement[];
  
  // Loading states
  isLoading: boolean;
  isProfileLoading: boolean;
  isTTSLoading: boolean;
  isStatsLoading: boolean;
  isAchievementsLoading: boolean;
  
  // Error states
  error: string | null;
  profileError: string | null;
  ttsError: string | null;
}

// Form Types
export interface ProfileFormData {
  displayName: string;
  email: string;
  uiLanguage: 'EN' | 'VI';
  timezone: string;
  learningGoalCardsPerDay: number;
}

export interface TTSFormData {
  preferredVoice: string;
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  ttsEnabled: boolean;
}

export interface PreferencesFormData {
  theme: 'light' | 'dark' | 'system';
  language: 'EN' | 'VI';
  timezone: string;
  learningGoal: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

// Avatar Upload Types
export interface AvatarUploadState {
  isUploading: boolean;
  uploadProgress: number;
  previewUrl: string | null;
  error: string | null;
}

// Export all types
export type {
  User as UserType,
  UserProfile as UserProfileType,
  UserStats as UserStatsType,
  Achievement as AchievementType,
  TTSSettings as TTSSettingsType,
  UserPreferences as UserPreferencesType,
  UserState as UserStateType,
};