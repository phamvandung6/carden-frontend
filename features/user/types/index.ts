// User Feature Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  preferences: UserPreferences;
  ttsSettings: TTSSettings;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  studyReminders: boolean;
  dailyGoal: number; // cards per day
  weeklyGoal: number; // cards per week
  autoPlayAudio: boolean;
  showProgressInTitle: boolean;
}

export interface TTSSettings {
  enabled: boolean;
  voice: string; // voice ID from Web Speech API
  rate: number; // 0.1 to 10
  pitch: number; // 0 to 2
  volume: number; // 0 to 1
  autoPlay: boolean;
  language: string; // language code
}

export interface UserStats {
  totalDecks: number;
  totalCards: number;
  totalStudyTime: number; // in minutes
  currentStreak: number; // days
  longestStreak: number; // days
  cardsStudiedToday: number;
  cardsStudiedThisWeek: number;
  cardsStudiedThisMonth: number;
  averageAccuracy: number; // percentage
  level: number;
  xp: number;
  nextLevelXP: number;
}

export interface UserAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress?: {
    current: number;
    total: number;
  };
}

// API Request/Response types
export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: UserProfile['socialLinks'];
}

export interface UpdatePreferencesRequest {
  preferences: Partial<UserPreferences>;
}

export interface UpdateTTSSettingsRequest {
  ttsSettings: Partial<TTSSettings>;
}

export interface UploadAvatarRequest {
  file: File;
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}

// State types
export interface UserState {
  profile: UserProfile | null;
  stats: UserStats | null;
  achievements: UserAchievement[];
  isLoading: boolean;
  error: string | null;
}

// Form types
export interface ProfileFormData {
  displayName: string;
  bio: string;
  location: string;
  website: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
    github: string;
  };
}

export interface PreferencesFormData {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  studyReminders: boolean;
  dailyGoal: number;
  weeklyGoal: number;
  autoPlayAudio: boolean;
  showProgressInTitle: boolean;
}

export interface TTSFormData {
  enabled: boolean;
  voice: string;
  rate: number;
  pitch: number;
  volume: number;
  autoPlay: boolean;
  language: string;
}
