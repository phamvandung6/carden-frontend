// Application constants
export const APP_NAME = 'Carden'
export const APP_DESCRIPTION = 'Modern vocabulary learning platform with AI-powered deck generation'
export const APP_VERSION = '1.0.0'

// Local storage keys
export const STORAGE_KEYS = {
  THEME: 'carden-theme',
  USER_PREFERENCES: 'carden-user-preferences',
  PRACTICE_SETTINGS: 'carden-practice-settings',
  TTS_SETTINGS: 'carden-tts-settings',
  OFFLINE_DECKS: 'carden-offline-decks',
  AUTH_TOKEN: 'carden-auth-token',
  REFRESH_TOKEN: 'carden-refresh-token'
} as const

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  DECKS: {
    LIST: '/decks',
    CREATE: '/decks',
    UPDATE: (id: string) => `/decks/${id}`,
    DELETE: (id: string) => `/decks/${id}`,
    SHARE: (id: string) => `/decks/${id}/share`
  },
  CARDS: {
    LIST: (deckId: string) => `/decks/${deckId}/cards`,
    CREATE: (deckId: string) => `/decks/${deckId}/cards`,
    UPDATE: (deckId: string, cardId: string) => `/decks/${deckId}/cards/${cardId}`,
    DELETE: (deckId: string, cardId: string) => `/decks/${deckId}/cards/${cardId}`
  },
  PRACTICE: {
    SESSION: '/practice/session',
    PROGRESS: '/practice/progress',
    STATS: '/practice/stats'
  },
  AI: {
    GENERATE_DECK: '/ai/generate-deck',
    GENERATE_CARDS: '/ai/generate-cards'
  }
} as const

// Practice settings
export const PRACTICE_MODES = {
  FLIP_CARDS: 'flip-cards',
  TYPE_ANSWER: 'type-answer',
  MULTIPLE_CHOICE: 'multiple-choice'
} as const

export const DIFFICULTY_LEVELS = {
  EASY: 0,
  GOOD: 1,
  HARD: 2,
  AGAIN: 3
} as const

export const CEFR_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const

// Type-safe version for Zod
export const CEFR_LEVELS_ARRAY: [string, ...string[]] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

// Theme configuration
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_AUDIO_TYPES: ['audio/mp3', 'audio/wav', 'audio/ogg'],
  MAX_FILES_PER_UPLOAD: 10
} as const

// Validation limits
export const VALIDATION_LIMITS = {
  DECK_TITLE: { MIN: 1, MAX: 100 },
  DECK_DESCRIPTION: { MIN: 0, MAX: 500 },
  CARD_FRONT: { MIN: 1, MAX: 500 },
  CARD_BACK: { MIN: 1, MAX: 1000 },
  CARD_EXAMPLE: { MIN: 0, MAX: 300 },
  TAG_NAME: { MIN: 1, MAX: 50 },
  MAX_TAGS_PER_CARD: 10,
  MAX_CARDS_PER_DECK: 1000,
  MIN_CARDS_FOR_PRACTICE: 3
} as const

// TTS settings
export const TTS_SETTINGS = {
  DEFAULT_RATE: 1.0,
  DEFAULT_PITCH: 1.0,
  DEFAULT_VOLUME: 1.0,
  RATE_RANGE: { MIN: 0.5, MAX: 2.0 },
  PITCH_RANGE: { MIN: 0.5, MAX: 2.0 },
  VOLUME_RANGE: { MIN: 0.1, MAX: 1.0 }
} as const

// Animation durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  CARD_FLIP: 600,
  PAGE_TRANSITION: 400
} as const

// Breakpoints (should match Tailwind config)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const

// Default pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DECK_PAGE_SIZE: 12,
  CARD_PAGE_SIZE: 50
} as const

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTHENTICATION_ERROR: 'Please log in to continue.',
  AUTHORIZATION_ERROR: 'You do not have permission to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  FILE_TOO_LARGE: `File size must be less than ${UPLOAD_LIMITS.MAX_FILE_SIZE / 1024 / 1024}MB`,
  UNSUPPORTED_FILE_TYPE: 'File type not supported',
  DECK_NOT_FOUND: 'Deck not found',
  CARD_NOT_FOUND: 'Card not found'
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  DECK_CREATED: 'Deck created successfully',
  DECK_UPDATED: 'Deck updated successfully',
  DECK_DELETED: 'Deck deleted successfully',
  CARD_CREATED: 'Card created successfully',
  CARD_UPDATED: 'Card updated successfully',
  CARD_DELETED: 'Card deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  SETTINGS_SAVED: 'Settings saved successfully'
} as const
