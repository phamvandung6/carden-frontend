import React from 'react'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS, THEMES } from '@/lib/constants'

// Theme types
export type Theme = keyof typeof THEMES

// Notification types
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  isVisible: boolean
  createdAt: string
}

// Modal types
export interface Modal {
  id: string
  type: string
  title?: string
  content?: React.ReactNode
  props?: Record<string, unknown>
  isClosable?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onClose?: () => void
}

// Loading state
export interface LoadingState {
  global: boolean
  components: Record<string, boolean>
}

// Navigation state
export interface NavigationState {
  isSidebarOpen: boolean
  isMobileMenuOpen: boolean
  breadcrumbs: Array<{
    label: string
    href?: string
  }>
  activeSection?: string
}

// Search state
export interface SearchState {
  isOpen: boolean
  query: string
  results: unknown[]
  isLoading: boolean
  recentSearches: string[]
}

// UI preferences
export interface UIPreferences {
  theme: Theme
  sidebarCollapsed: boolean
  showAnimations: boolean
  showTooltips: boolean
  density: 'comfortable' | 'compact' | 'spacious'
  language: string
  fontSize: 'small' | 'medium' | 'large'
  reducedMotion: boolean
}

// Command palette
export interface CommandPaletteState {
  isOpen: boolean
  query: string
  commands: Array<{
    id: string
    label: string
    shortcut?: string
    icon?: string
    action: () => void
    group?: string
  }>
}

// UI store state interface
interface UIState {
  // Theme and preferences
  preferences: UIPreferences
  
  // Notifications
  notifications: Notification[]
  
  // Modals
  modals: Modal[]
  
  // Loading states
  loading: LoadingState
  
  // Navigation
  navigation: NavigationState
  
  // Search
  search: SearchState
  
  // Command palette
  commandPalette: CommandPaletteState
  
  // Screen size
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  
  // Actions - Theme and preferences
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  updatePreferences: (preferences: Partial<UIPreferences>) => void
  resetPreferences: () => void
  
  // Actions - Notifications
  addNotification: (notification: Omit<Notification, 'id' | 'isVisible' | 'createdAt'>) => string
  removeNotification: (id: string) => void
  clearNotifications: () => void
  markNotificationAsRead: (id: string) => void
  
  // Actions - Modals
  openModal: (modal: Omit<Modal, 'id'>) => string
  closeModal: (id: string) => void
  closeAllModals: () => void
  updateModal: (id: string, updates: Partial<Modal>) => void
  
  // Actions - Loading
  setGlobalLoading: (loading: boolean) => void
  setComponentLoading: (component: string, loading: boolean) => void
  clearComponentLoading: (component: string) => void
  
  // Actions - Navigation
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setMobileMenuOpen: (open: boolean) => void
  toggleMobileMenu: () => void
  setBreadcrumbs: (breadcrumbs: NavigationState['breadcrumbs']) => void
  setActiveSection: (section: string) => void
  
  // Actions - Search
  setSearchOpen: (open: boolean) => void
  setSearchQuery: (query: string) => void
  setSearchResults: (results: unknown[]) => void
  setSearchLoading: (loading: boolean) => void
  addRecentSearch: (query: string) => void
  clearRecentSearches: () => void
  
  // Actions - Command palette
  setCommandPaletteOpen: (open: boolean) => void
  setCommandPaletteQuery: (query: string) => void
  registerCommand: (command: CommandPaletteState['commands'][0]) => void
  unregisterCommand: (id: string) => void
  clearCommands: () => void
  
  // Actions - Screen size
  setScreenSize: (isMobile: boolean, isTablet: boolean, isDesktop: boolean) => void
}

// Default preferences
const defaultPreferences: UIPreferences = {
  theme: 'SYSTEM',
  sidebarCollapsed: false,
  showAnimations: true,
  showTooltips: true,
  density: 'comfortable',
  language: 'en',
  fontSize: 'medium',
  reducedMotion: false
}

// Default navigation state
const defaultNavigation: NavigationState = {
  isSidebarOpen: false,
  isMobileMenuOpen: false,
  breadcrumbs: [],
  activeSection: undefined
}

// Default search state
const defaultSearch: SearchState = {
  isOpen: false,
  query: '',
  results: [],
  isLoading: false,
  recentSearches: []
}

// Default command palette state
const defaultCommandPalette: CommandPaletteState = {
  isOpen: false,
  query: '',
  commands: []
}

// UI store implementation
export const useUIStore = create<UIState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      preferences: defaultPreferences,
      notifications: [],
      modals: [],
      loading: {
        global: false,
        components: {}
      },
      navigation: defaultNavigation,
      search: defaultSearch,
      commandPalette: defaultCommandPalette,
      isMobile: false,
      isTablet: false,
      isDesktop: true,

      // Theme and preferences actions
      setTheme: (theme: Theme) => {
        set((state) => {
          state.preferences.theme = theme
        })
      },

      toggleTheme: () => {
        set((state) => {
          const { theme } = state.preferences
          if (theme === 'light') {
            state.preferences.theme = 'dark'
          } else if (theme === 'dark') {
            state.preferences.theme = 'system'
          } else {
            state.preferences.theme = 'light'
          }
        })
      },

      updatePreferences: (preferences: Partial<UIPreferences>) => {
        set((state) => {
          state.preferences = { ...state.preferences, ...preferences }
        })
      },

      resetPreferences: () => {
        set((state) => {
          state.preferences = defaultPreferences
        })
      },

      // Notification actions
      addNotification: (notification: Omit<Notification, 'id' | 'isVisible' | 'createdAt'>) => {
        const id = `notification-${Date.now()}-${Math.random()}`
        
        set((state) => {
          state.notifications.push({
            ...notification,
            id,
            isVisible: true,
            createdAt: new Date().toISOString()
          })
        })

        // Auto-remove notification after duration
        if (notification.duration !== 0) {
          setTimeout(() => {
            get().removeNotification(id)
          }, notification.duration || 5000)
        }

        return id
      },

      removeNotification: (id: string) => {
        set((state) => {
          state.notifications = state.notifications.filter((n: Notification) => n.id !== id)
        })
      },

      clearNotifications: () => {
        set((state) => {
          state.notifications = []
        })
      },

      markNotificationAsRead: (id: string) => {
        set((state) => {
          const notification = state.notifications.find((n: Notification) => n.id === id)
          if (notification) {
            notification.isVisible = false
          }
        })
      },

      // Modal actions
      openModal: (modal: Omit<Modal, 'id'>) => {
        const id = `modal-${Date.now()}-${Math.random()}`
        
        set((state) => {
          state.modals.push({
            ...modal,
            id,
            isClosable: modal.isClosable !== false,
            size: modal.size || 'md'
          })
        })

        return id
      },

      closeModal: (id: string) => {
        set((state) => {
          const modal = state.modals.find((m: Modal) => m.id === id)
          if (modal?.onClose) {
            modal.onClose()
          }
          state.modals = state.modals.filter((m: Modal) => m.id !== id)
        })
      },

      closeAllModals: () => {
        set((state) => {
          state.modals.forEach((modal: Modal) => {
            if (modal.onClose) {
              modal.onClose()
            }
          })
          state.modals = []
        })
      },

      updateModal: (id: string, updates: Partial<Modal>) => {
        set((state) => {
          const index = state.modals.findIndex((m: Modal) => m.id === id)
          if (index >= 0) {
            state.modals[index] = { ...state.modals[index], ...updates }
          }
        })
      },

      // Loading actions
      setGlobalLoading: (loading: boolean) => {
        set((state) => {
          state.loading.global = loading
        })
      },

      setComponentLoading: (component: string, loading: boolean) => {
        set((state) => {
          if (loading) {
            state.loading.components[component] = true
          } else {
            delete state.loading.components[component]
          }
        })
      },

      clearComponentLoading: (component: string) => {
        set((state) => {
          delete state.loading.components[component]
        })
      },

      // Navigation actions
      setSidebarOpen: (open: boolean) => {
        set((state) => {
          state.navigation.isSidebarOpen = open
        })
      },

      toggleSidebar: () => {
        set((state) => {
          state.navigation.isSidebarOpen = !state.navigation.isSidebarOpen
        })
      },

      setMobileMenuOpen: (open: boolean) => {
        set((state) => {
          state.navigation.isMobileMenuOpen = open
        })
      },

      toggleMobileMenu: () => {
        set((state) => {
          state.navigation.isMobileMenuOpen = !state.navigation.isMobileMenuOpen
        })
      },

      setBreadcrumbs: (breadcrumbs: NavigationState['breadcrumbs']) => {
        set((state) => {
          state.navigation.breadcrumbs = breadcrumbs
        })
      },

      setActiveSection: (section: string) => {
        set((state) => {
          state.navigation.activeSection = section
        })
      },

      // Search actions
      setSearchOpen: (open: boolean) => {
        set((state) => {
          state.search.isOpen = open
          if (!open) {
            state.search.query = ''
            state.search.results = []
          }
        })
      },

      setSearchQuery: (query: string) => {
        set((state) => {
          state.search.query = query
        })
      },

      setSearchResults: (results: unknown[]) => {
        set((state) => {
          state.search.results = results
        })
      },

      setSearchLoading: (loading: boolean) => {
        set((state) => {
          state.search.isLoading = loading
        })
      },

      addRecentSearch: (query: string) => {
        set((state) => {
          const trimmedQuery = query.trim()
          if (trimmedQuery && !state.search.recentSearches.includes(trimmedQuery)) {
            state.search.recentSearches.unshift(trimmedQuery)
            // Keep only last 10 searches
            state.search.recentSearches = state.search.recentSearches.slice(0, 10)
          }
        })
      },

      clearRecentSearches: () => {
        set((state) => {
          state.search.recentSearches = []
        })
      },

      // Command palette actions
      setCommandPaletteOpen: (open: boolean) => {
        set((state) => {
          state.commandPalette.isOpen = open
          if (!open) {
            state.commandPalette.query = ''
          }
        })
      },

      setCommandPaletteQuery: (query: string) => {
        set((state) => {
          state.commandPalette.query = query
        })
      },

      registerCommand: (command: CommandPaletteState['commands'][0]) => {
        set((state) => {
          const existingIndex = state.commandPalette.commands.findIndex((c: CommandPaletteState['commands'][0]) => c.id === command.id)
          if (existingIndex >= 0) {
            state.commandPalette.commands[existingIndex] = command
          } else {
            state.commandPalette.commands.push(command)
          }
        })
      },

      unregisterCommand: (id: string) => {
        set((state) => {
          state.commandPalette.commands = state.commandPalette.commands.filter((c: CommandPaletteState['commands'][0]) => c.id !== id)
        })
      },

      clearCommands: () => {
        set((state) => {
          state.commandPalette.commands = []
        })
      },

      // Screen size actions
      setScreenSize: (isMobile: boolean, isTablet: boolean, isDesktop: boolean) => {
        set((state) => {
          state.isMobile = isMobile
          state.isTablet = isTablet
          state.isDesktop = isDesktop
          
          // Auto-close mobile menu on desktop
          if (isDesktop) {
            state.navigation.isMobileMenuOpen = false
          }
          
          // Auto-open sidebar on desktop if not collapsed in preferences
          if (isDesktop && !state.preferences.sidebarCollapsed) {
            state.navigation.isSidebarOpen = true
          }
        })
      }
    })),
    {
      name: STORAGE_KEYS.USER_PREFERENCES,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        search: {
          recentSearches: state.search.recentSearches
        }
      })
    }
  )
)

// UI store selectors
export const useTheme = () => useUIStore((state) => ({
  theme: state.preferences.theme,
  setTheme: state.setTheme,
  toggleTheme: state.toggleTheme
}))

export const useNotifications = () => useUIStore((state) => ({
  notifications: state.notifications,
  addNotification: state.addNotification,
  removeNotification: state.removeNotification,
  clearNotifications: state.clearNotifications,
  markNotificationAsRead: state.markNotificationAsRead
}))

export const useModals = () => useUIStore((state) => ({
  modals: state.modals,
  openModal: state.openModal,
  closeModal: state.closeModal,
  closeAllModals: state.closeAllModals,
  updateModal: state.updateModal
}))

export const useLoading = () => useUIStore((state) => ({
  globalLoading: state.loading.global,
  componentLoading: state.loading.components,
  setGlobalLoading: state.setGlobalLoading,
  setComponentLoading: state.setComponentLoading,
  clearComponentLoading: state.clearComponentLoading
}))

export const useNavigation = () => useUIStore((state) => ({
  navigation: state.navigation,
  setSidebarOpen: state.setSidebarOpen,
  toggleSidebar: state.toggleSidebar,
  setMobileMenuOpen: state.setMobileMenuOpen,
  toggleMobileMenu: state.toggleMobileMenu,
  setBreadcrumbs: state.setBreadcrumbs,
  setActiveSection: state.setActiveSection
}))

export const useSearch = () => useUIStore((state) => ({
  search: state.search,
  setSearchOpen: state.setSearchOpen,
  setSearchQuery: state.setSearchQuery,
  setSearchResults: state.setSearchResults,
  setSearchLoading: state.setSearchLoading,
  addRecentSearch: state.addRecentSearch,
  clearRecentSearches: state.clearRecentSearches
}))

export const useCommandPalette = () => useUIStore((state) => ({
  commandPalette: state.commandPalette,
  setCommandPaletteOpen: state.setCommandPaletteOpen,
  setCommandPaletteQuery: state.setCommandPaletteQuery,
  registerCommand: state.registerCommand,
  unregisterCommand: state.unregisterCommand,
  clearCommands: state.clearCommands
}))

export const useScreenSize = () => useUIStore((state) => ({
  isMobile: state.isMobile,
  isTablet: state.isTablet,
  isDesktop: state.isDesktop,
  setScreenSize: state.setScreenSize
}))

export const useUIPreferences = () => useUIStore((state) => ({
  preferences: state.preferences,
  updatePreferences: state.updatePreferences,
  resetPreferences: state.resetPreferences
}))
