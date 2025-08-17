// Query Keys Factory
// Centralized management of React Query keys for consistency and type safety

export const queryKeys = {
  // Auth queries
  auth: {
    all: ['auth'] as const,
    profile: () => [...queryKeys.auth.all, 'profile'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // User queries
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    ttsSettings: () => [...queryKeys.user.all, 'tts-settings'] as const,
    stats: () => [...queryKeys.user.all, 'stats'] as const,
    achievements: () => [...queryKeys.user.all, 'achievements'] as const,
    preferences: () => [...queryKeys.user.all, 'preferences'] as const,
  },
  
  // Users queries (for admin/management)
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.users.lists(), { filters }] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    profile: (id: string) => [...queryKeys.users.detail(id), 'profile'] as const,
    settings: (id: string) => [...queryKeys.users.detail(id), 'settings'] as const,
  },

  // Deck queries
  decks: {
    all: ['decks'] as const,
    lists: () => [...queryKeys.decks.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.decks.lists(), { filters }] as const,
    details: () => [...queryKeys.decks.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.decks.details(), id] as const,
    cards: (deckId: string) => [...queryKeys.decks.detail(deckId), 'cards'] as const,
    stats: (deckId: string) => [...queryKeys.decks.detail(deckId), 'stats'] as const,
    marketplace: {
      all: () => [...queryKeys.decks.all, 'marketplace'] as const,
      list: (filters: Record<string, unknown>) => [...queryKeys.decks.marketplace.all(), { filters }] as const,
      featured: () => [...queryKeys.decks.marketplace.all(), 'featured'] as const,
    },
  },

  // Card queries
  cards: {
    all: ['cards'] as const,
    lists: () => [...queryKeys.cards.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.cards.lists(), { filters }] as const,
    details: () => [...queryKeys.cards.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.cards.details(), id] as const,
    byDeck: (deckId: string) => [...queryKeys.cards.all, 'deck', deckId] as const,
    search: (query: string) => [...queryKeys.cards.all, 'search', query] as const,
  },

  // Practice queries
  practice: {
    all: ['practice'] as const,
    sessions: () => [...queryKeys.practice.all, 'sessions'] as const,
    session: (id: string) => [...queryKeys.practice.sessions(), id] as const,
    dueCards: (deckId?: string) => 
      deckId 
        ? [...queryKeys.practice.all, 'due-cards', deckId] as const
        : [...queryKeys.practice.all, 'due-cards'] as const,
    progress: (deckId?: string) => 
      deckId 
        ? [...queryKeys.practice.all, 'progress', deckId] as const
        : [...queryKeys.practice.all, 'progress'] as const,
    stats: (deckId?: string) => 
      deckId 
        ? [...queryKeys.practice.all, 'stats', deckId] as const
        : [...queryKeys.practice.all, 'stats'] as const,
  },

  // Study queries (SRS)
  study: {
    all: ['study'] as const,
    schedule: () => [...queryKeys.study.all, 'schedule'] as const,
    dueToday: () => [...queryKeys.study.all, 'due-today'] as const,
    streak: () => [...queryKeys.study.all, 'streak'] as const,
    analytics: () => [...queryKeys.study.all, 'analytics'] as const,
    progress: (period: 'week' | 'month' | 'year') => 
      [...queryKeys.study.all, 'progress', period] as const,
  },

  // Analytics queries
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    progress: (timeframe: string) => [...queryKeys.analytics.all, 'progress', timeframe] as const,
    performance: (deckId?: string) => 
      deckId 
        ? [...queryKeys.analytics.all, 'performance', deckId] as const
        : [...queryKeys.analytics.all, 'performance'] as const,
    streaks: () => [...queryKeys.analytics.all, 'streaks'] as const,
    achievements: () => [...queryKeys.analytics.all, 'achievements'] as const,
  },

  // Search queries
  search: {
    all: ['search'] as const,
    global: (query: string) => [...queryKeys.search.all, 'global', query] as const,
    decks: (query: string, filters?: Record<string, unknown>) => 
      [...queryKeys.search.all, 'decks', query, ...(filters ? [filters] : [])] as const,
    cards: (query: string, filters?: Record<string, unknown>) => 
      [...queryKeys.search.all, 'cards', query, ...(filters ? [filters] : [])] as const,
  },
} as const;

// Helper function to invalidate related queries
export const queryInvalidation = {
  // Invalidate all auth-related queries
  auth: () => queryKeys.auth.all,
  
  // Invalidate deck-related queries
  deck: (deckId?: string) => 
    deckId ? queryKeys.decks.detail(deckId) : queryKeys.decks.all,
  
  // Invalidate card-related queries
  card: (cardId?: string) => 
    cardId ? queryKeys.cards.detail(cardId) : queryKeys.cards.all,
  
  // Invalidate practice-related queries
  practice: (deckId?: string) => 
    deckId ? [queryKeys.practice.all, deckId] : queryKeys.practice.all,
  
  // Invalidate study-related queries
  study: () => queryKeys.study.all,
  
  // Invalidate analytics
  analytics: () => queryKeys.analytics.all,
};

// Type helpers for query keys
export type QueryKey = typeof queryKeys;
export type AuthQueryKey = typeof queryKeys.auth;
export type DeckQueryKey = typeof queryKeys.decks;
export type CardQueryKey = typeof queryKeys.cards;
export type PracticeQueryKey = typeof queryKeys.practice;
export type StudyQueryKey = typeof queryKeys.study;
export type AnalyticsQueryKey = typeof queryKeys.analytics;
