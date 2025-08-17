// User Store
// Zustand store for user profile management, separate from auth

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import type {
  User,
  UserProfile,
  TTSSettings,
  UserPreferences,
  UserStats,
  Achievement,
  UserState,
  AvatarUploadState
} from '../types';

interface UserStore extends UserState {
  // Actions
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setTTSSettings: (settings: TTSSettings | null) => void;
  setPreferences: (preferences: UserPreferences | null) => void;
  setStats: (stats: UserStats | null) => void;
  setAchievements: (achievements: Achievement[]) => void;
  
  // Loading states
  setLoading: (loading: boolean) => void;
  setProfileLoading: (loading: boolean) => void;
  setTTSLoading: (loading: boolean) => void;
  setStatsLoading: (loading: boolean) => void;
  setAchievementsLoading: (loading: boolean) => void;
  
  // Error states
  setError: (error: string | null) => void;
  setProfileError: (error: string | null) => void;
  setTTSError: (error: string | null) => void;
  
  // Avatar upload state
  avatarUpload: AvatarUploadState;
  setAvatarUpload: (state: Partial<AvatarUploadState>) => void;
  
  // Utility actions
  clearUser: () => void;
  clearErrors: () => void;
  updateUserField: <K extends keyof User>(field: K, value: User[K]) => void;
  
  // Getters
  getFullName: () => string;
  getInitials: () => string;
  isProfileComplete: () => boolean;
}

// Initial state
const initialState: UserState = {
  user: null,
  profile: null,
  ttsSettings: null,
  preferences: null,
  stats: null,
  achievements: [],
  
  isLoading: false,
  isProfileLoading: false,
  isTTSLoading: false,
  isStatsLoading: false,
  isAchievementsLoading: false,
  
  error: null,
  profileError: null,
  ttsError: null,
};

const initialAvatarUpload: AvatarUploadState = {
  isUploading: false,
  uploadProgress: 0,
  previewUrl: null,
  error: null,
};

export const useUserStore = create<UserStore>()(
  persist(
    immer((set, get) => ({
      ...initialState,
      avatarUpload: initialAvatarUpload,

      // User actions
      setUser: (user) => {
        set((state) => {
          state.user = user;
          // Also update profile if user data changes
          if (user && state.profile) {
            state.profile = { ...state.profile, ...user };
          }
        });
      },

      setProfile: (profile) => {
        set((state) => {
          state.profile = profile;
          // Also update user data if profile changes
          if (profile && state.user) {
            state.user = {
              ...state.user,
              displayName: profile.displayName,
              email: profile.email,
              uiLanguage: profile.uiLanguage,
              timezone: profile.timezone,
              learningGoalCardsPerDay: profile.learningGoalCardsPerDay,
              profileImageUrl: profile.profileImageUrl,
            };
          }
        });
      },

      setTTSSettings: (settings) => {
        set((state) => {
          state.ttsSettings = settings;
        });
      },

      setPreferences: (preferences) => {
        set((state) => {
          state.preferences = preferences;
        });
      },

      setStats: (stats) => {
        set((state) => {
          state.stats = stats;
        });
      },

      setAchievements: (achievements) => {
        set((state) => {
          state.achievements = achievements;
        });
      },

      // Loading states
      setLoading: (loading) => {
        set((state) => {
          state.isLoading = loading;
        });
      },

      setProfileLoading: (loading) => {
        set((state) => {
          state.isProfileLoading = loading;
        });
      },

      setTTSLoading: (loading) => {
        set((state) => {
          state.isTTSLoading = loading;
        });
      },

      setStatsLoading: (loading) => {
        set((state) => {
          state.isStatsLoading = loading;
        });
      },

      setAchievementsLoading: (loading) => {
        set((state) => {
          state.isAchievementsLoading = loading;
        });
      },

      // Error states
      setError: (error) => {
        set((state) => {
          state.error = error;
        });
      },

      setProfileError: (error) => {
        set((state) => {
          state.profileError = error;
        });
      },

      setTTSError: (error) => {
        set((state) => {
          state.ttsError = error;
        });
      },

      // Avatar upload
      setAvatarUpload: (newState) => {
        set((state) => {
          state.avatarUpload = { ...state.avatarUpload, ...newState };
        });
      },

      // Utility actions
      clearUser: () => {
        set((state) => {
          state.user = null;
          state.profile = null;
          state.ttsSettings = null;
          state.preferences = null;
          state.stats = null;
          state.achievements = [];
          state.avatarUpload = initialAvatarUpload;
        });
      },

      clearErrors: () => {
        set((state) => {
          state.error = null;
          state.profileError = null;
          state.ttsError = null;
          state.avatarUpload.error = null;
        });
      },

      updateUserField: (field, value) => {
        set((state) => {
          if (state.user) {
            (state.user as any)[field] = value;
          }
          if (state.profile) {
            (state.profile as any)[field] = value;
          }
        });
      },

      // Getters
      getFullName: () => {
        const { user } = get();
        return user?.displayName || user?.username || 'Unknown User';
      },

      getInitials: () => {
        const { user } = get();
        const name = user?.displayName || user?.username || 'UU';
        return name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase())
          .slice(0, 2)
          .join('');
      },

      isProfileComplete: () => {
        const { user } = get();
        if (!user) return false;
        
        return !!(
          user.displayName &&
          user.email &&
          user.timezone &&
          user.uiLanguage
        );
      },
    })),
    {
      name: 'user-store',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        ttsSettings: state.ttsSettings,
        preferences: state.preferences,
        // Don't persist loading states, errors, or avatar upload state
      }),
    }
  )
);

// Selectors for easy access
export const userSelectors = {
  user: (state: UserStore) => state.user,
  profile: (state: UserStore) => state.profile,
  ttsSettings: (state: UserStore) => state.ttsSettings,
  preferences: (state: UserStore) => state.preferences,
  stats: (state: UserStore) => state.stats,
  achievements: (state: UserStore) => state.achievements,
  
  isLoading: (state: UserStore) => state.isLoading,
  isProfileLoading: (state: UserStore) => state.isProfileLoading,
  isTTSLoading: (state: UserStore) => state.isTTSLoading,
  isStatsLoading: (state: UserStore) => state.isStatsLoading,
  isAchievementsLoading: (state: UserStore) => state.isAchievementsLoading,
  
  error: (state: UserStore) => state.error,
  profileError: (state: UserStore) => state.profileError,
  ttsError: (state: UserStore) => state.ttsError,
  
  avatarUpload: (state: UserStore) => state.avatarUpload,
  
  fullName: (state: UserStore) => state.getFullName(),
  initials: (state: UserStore) => state.getInitials(),
  isProfileComplete: (state: UserStore) => state.isProfileComplete(),
};

export default useUserStore;