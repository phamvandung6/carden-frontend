import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { STORAGE_KEYS } from '@/lib/constants'

// User interface
export interface User {
  id: string
  email: string
  displayName: string
  avatar?: string
  language: string
  timezone: string
  dailyGoal: number
  createdAt: string
  updatedAt: string
  emailVerified: boolean
}

// TTS Settings interface
export interface TtsSettings {
  enabled: boolean
  voice?: string
  rate: number
  pitch: number
  volume: number
  autoPlay: boolean
  preferredLanguages: string[]
}

// Auth state interface
interface AuthState {
  // User data
  user: User | null
  token: string | null
  refreshToken: string | null
  
  // Auth status
  isAuthenticated: boolean
  isLoading: boolean
  isInitialized: boolean
  
  // Settings
  ttsSettings: TtsSettings
  
  // Actions
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<void>
  
  // User actions
  updateProfile: (updates: Partial<User>) => Promise<void>
  updateTtsSettings: (settings: Partial<TtsSettings>) => void
  
  // Token management
  setTokens: (token: string, refreshToken: string) => void
  clearTokens: () => void
  
  // State management
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  
  // Password management
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, password: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

// Default TTS settings
const defaultTtsSettings: TtsSettings = {
  enabled: true,
  rate: 1.0,
  pitch: 1.0,
  volume: 1.0,
  autoPlay: false,
  preferredLanguages: ['en-US']
}

// Auth store implementation
export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      ttsSettings: defaultTtsSettings,

      // Auth actions
      login: async (email: string, password: string) => {
        set((state) => {
          state.isLoading = true
        })

        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          })

          if (!response.ok) {
            throw new Error('Invalid credentials')
          }

          const data = await response.json()
          
          set((state) => {
            state.user = data.user
            state.token = data.token
            state.refreshToken = data.refreshToken
            state.isAuthenticated = true
            state.isLoading = false
          })
        } catch (error) {
          set((state) => {
            state.isLoading = false
          })
          throw error
        }
      },

      register: async (email: string, password: string, displayName: string) => {
        set((state) => {
          state.isLoading = true
        })

        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, displayName })
          })

          if (!response.ok) {
            throw new Error('Registration failed')
          }

          const data = await response.json()
          
          set((state) => {
            state.user = data.user
            state.token = data.token
            state.refreshToken = data.refreshToken
            state.isAuthenticated = true
            state.isLoading = false
          })
        } catch (error) {
          set((state) => {
            state.isLoading = false
          })
          throw error
        }
      },

      logout: () => {
        set((state) => {
          state.user = null
          state.token = null
          state.refreshToken = null
          state.isAuthenticated = false
          state.isLoading = false
        })
      },

      refreshAuth: async () => {
        const { refreshToken } = get()
        
        if (!refreshToken) {
          get().logout()
          return
        }

        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          })

          if (!response.ok) {
            get().logout()
            return
          }

          const data = await response.json()
          
          set((state) => {
            state.token = data.token
            state.refreshToken = data.refreshToken
          })
        } catch {
          get().logout()
        }
      },

      // User profile actions
      updateProfile: async (updates: Partial<User>) => {
        const { user, token } = get()
        
        if (!user || !token) {
          throw new Error('Not authenticated')
        }

        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/profile', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
          })

          if (!response.ok) {
            throw new Error('Profile update failed')
          }

          const updatedUser = await response.json()
          
          set((state) => {
            state.user = updatedUser
          })
        } catch (error) {
          throw error
        }
      },

      updateTtsSettings: (settings: Partial<TtsSettings>) => {
        set((state) => {
          state.ttsSettings = { ...state.ttsSettings, ...settings }
        })
      },

      // Token management
      setTokens: (token: string, refreshToken: string) => {
        set((state) => {
          state.token = token
          state.refreshToken = refreshToken
        })
      },

      clearTokens: () => {
        set((state) => {
          state.token = null
          state.refreshToken = null
        })
      },

      // State setters
      setUser: (user: User | null) => {
        set((state) => {
          state.user = user
          state.isAuthenticated = !!user
        })
      },

      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading
        })
      },

      setInitialized: (initialized: boolean) => {
        set((state) => {
          state.isInitialized = initialized
        })
      },

      // Password management
      forgotPassword: async (email: string) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          })

          if (!response.ok) {
            throw new Error('Failed to send reset email')
          }
        } catch (error) {
          throw error
        }
      },

      resetPassword: async (token: string, password: string) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password })
          })

          if (!response.ok) {
            throw new Error('Password reset failed')
          }
        } catch (error) {
          throw error
        }
      },

      changePassword: async (currentPassword: string, newPassword: string) => {
        const { token } = get()
        
        if (!token) {
          throw new Error('Not authenticated')
        }

        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
          })

          if (!response.ok) {
            throw new Error('Password change failed')
          }
        } catch (error) {
          throw error
        }
      }
    })),
    {
      name: STORAGE_KEYS.AUTH_TOKEN,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        ttsSettings: state.ttsSettings
      })
    }
  )
)

// Auth store selectors for better performance
export const useAuth = () => useAuthStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  isLoading: state.isLoading,
  isInitialized: state.isInitialized
}))

export const useAuthActions = () => useAuthStore((state) => ({
  login: state.login,
  register: state.register,
  logout: state.logout,
  refreshAuth: state.refreshAuth,
  updateProfile: state.updateProfile,
  forgotPassword: state.forgotPassword,
  resetPassword: state.resetPassword,
  changePassword: state.changePassword
}))

export const useTtsSettings = () => useAuthStore((state) => ({
  settings: state.ttsSettings,
  updateSettings: state.updateTtsSettings
}))
