// Export all stores and their types
export * from './auth-store'
export * from './deck-store'
export * from './practice-store'
export * from './ui-store'

// Re-export common types and utilities
export type { StateCreator } from 'zustand'
export { create } from 'zustand'
export { persist, createJSONStorage } from 'zustand/middleware'
export { immer } from 'zustand/middleware/immer'

// Store initialization helper
export const initializeStores = () => {
  // This function can be called to initialize stores
  // Currently all stores are lazy-loaded, so no initialization needed
  console.log('Zustand stores initialized')
}

// Store reset helper for testing/logout
export const resetAllStores = () => {
  // Clear all persisted store data
  const storageKeys = [
    'carden-auth-token',
    'carden-offline-decks', 
    'carden-practice-settings',
    'carden-user-preferences'
  ]
  
  storageKeys.forEach(key => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Failed to remove ${key} from localStorage:`, error)
    }
  })
  
  // Reload the page to reset all store states
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}
