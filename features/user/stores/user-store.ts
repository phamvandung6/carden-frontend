// User Store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  UserProfile, 
  UserStats, 
  UserAchievement, 
  UserState,
  UserPreferences,
  TTSSettings 
} from '../types';

interface UserStore extends UserState {
  // Actions
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setStats: (stats: UserStats | null) => void;
  updateStats: (updates: Partial<UserStats>) => void;
  setAchievements: (achievements: UserAchievement[]) => void;
  addAchievement: (achievement: UserAchievement) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  updateTTSSettings: (settings: Partial<TTSSettings>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearUser: () => void;
  
  // Computed getters
  getPreference: <K extends keyof UserPreferences>(key: K) => UserPreferences[K] | undefined;
  getTTSSetting: <K extends keyof TTSSettings>(key: K) => TTSSettings[K] | undefined;
  isProfileComplete: () => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    immer((set, get) => ({
      // Initial state
      profile: null,
      stats: null,
      achievements: [],
      isLoading: false,
      error: null,

      // Actions
      setProfile: (profile) => {
        set((state) => {
          state.profile = profile;
          state.error = null;
        });
      },

      updateProfile: (updates) => {
        set((state) => {
          if (state.profile) {
            Object.assign(state.profile, updates);
          }
        });
      },

      setStats: (stats) => {
        set((state) => {
          state.stats = stats;
        });
      },

      updateStats: (updates) => {
        set((state) => {
          if (state.stats) {
            Object.assign(state.stats, updates);
          }
        });
      },

      setAchievements: (achievements) => {
        set((state) => {
          state.achievements = achievements;
        });
      },

      addAchievement: (achievement) => {
        set((state) => {
          const exists = state.achievements.find((a: UserAchievement) => a.id === achievement.id);
          if (!exists) {
            state.achievements.push(achievement);
          }
        });
      },

      updatePreferences: (preferences) => {
        set((state) => {
          if (state.profile) {
            Object.assign(state.profile.preferences, preferences);
          }
        });
      },

      updateTTSSettings: (settings) => {
        set((state) => {
          if (state.profile) {
            Object.assign(state.profile.ttsSettings, settings);
          }
        });
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

      clearUser: () => {
        set((state) => {
          state.profile = null;
          state.stats = null;
          state.achievements = [];
          state.error = null;
          state.isLoading = false;
        });
      },

      // Computed getters
      getPreference: (key) => {
        const { profile } = get();
        return profile?.preferences[key];
      },

      getTTSSetting: (key) => {
        const { profile } = get();
        return profile?.ttsSettings[key];
      },

      isProfileComplete: () => {
        const { profile } = get();
        if (!profile) return false;
        
        return !!(
          profile.displayName &&
          profile.preferences.language &&
          profile.preferences.timezone
        );
      },
    })),
    {
      name: 'user-storage',
      partialize: (state) => ({
        profile: state.profile,
        achievements: state.achievements,
        // Don't persist loading states and errors
      }),
    }
  )
);

// Selectors for easier access
export const userSelectors = {
  profile: (state: UserStore) => state.profile,
  stats: (state: UserStore) => state.stats,
  achievements: (state: UserStore) => state.achievements,
  preferences: (state: UserStore) => state.profile?.preferences,
  ttsSettings: (state: UserStore) => state.profile?.ttsSettings,
  isLoading: (state: UserStore) => state.isLoading,
  error: (state: UserStore) => state.error,
  isProfileComplete: (state: UserStore) => state.isProfileComplete(),
  
  // Specific preference selectors
  theme: (state: UserStore) => state.profile?.preferences.theme || 'system',
  language: (state: UserStore) => state.profile?.preferences.language || 'en',
  dailyGoal: (state: UserStore) => state.profile?.preferences.dailyGoal || 20,
  
  // TTS selectors
  ttsEnabled: (state: UserStore) => state.profile?.ttsSettings.enabled || false,
  ttsVoice: (state: UserStore) => state.profile?.ttsSettings.voice,
  ttsRate: (state: UserStore) => state.profile?.ttsSettings.rate || 1,
};
