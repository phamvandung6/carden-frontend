import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS, CEFR_LEVELS } from '@/lib/constants'

// Deck interface
export interface Deck {
  id: string
  title: string
  description?: string
  category?: string
  tags: string[]
  isPublic: boolean
  language: string
  cefrLevel?: typeof CEFR_LEVELS[number]
  coverImage?: string
  cardCount: number
  userId: string
  createdAt: string
  updatedAt: string
  lastStudied?: string
  progress: {
    totalCards: number
    studiedCards: number
    masteredCards: number
    averageScore: number
  }
}

// Card interface
export interface Card {
  id: string
  deckId: string
  front: string
  back: string
  hint?: string
  example?: string
  synonyms: string[]
  antonyms: string[]
  tags: string[]
  difficulty?: number
  frontImage?: string
  backImage?: string
  frontAudio?: string
  backAudio?: string
  notes?: string
  createdAt: string
  updatedAt: string
  srsData: {
    easinessFactor: number
    interval: number
    repetitions: number
    nextReview: string
    lastReviewed?: string
  }
}

// Filter and sort options
export interface DeckFilters {
  search?: string
  category?: string
  tags?: string[]
  cefrLevel?: string
  isPublic?: boolean
  hasProgress?: boolean
}

export interface DeckSort {
  field: 'title' | 'createdAt' | 'updatedAt' | 'cardCount' | 'progress'
  direction: 'asc' | 'desc'
}

// Deck store state interface
interface DeckState {
  // Deck data
  decks: Deck[]
  currentDeck: Deck | null
  isLoading: boolean
  error: string | null
  
  // Cards data
  cards: Record<string, Card[]> // deckId -> cards
  isLoadingCards: boolean
  cardsError: string | null
  
  // Filters and pagination
  filters: DeckFilters
  sort: DeckSort
  currentPage: number
  totalPages: number
  hasMore: boolean
  
  // Actions - Deck CRUD
  fetchDecks: () => Promise<void>
  fetchDeck: (id: string) => Promise<Deck | null>
  createDeck: (deckData: Partial<Deck>) => Promise<Deck>
  updateDeck: (id: string, updates: Partial<Deck>) => Promise<Deck>
  deleteDeck: (id: string) => Promise<void>
  duplicateDeck: (id: string, title?: string) => Promise<Deck>
  
  // Actions - Card CRUD  
  fetchCards: (deckId: string) => Promise<void>
  createCard: (deckId: string, cardData: Partial<Card>) => Promise<Card>
  updateCard: (deckId: string, cardId: string, updates: Partial<Card>) => Promise<Card>
  deleteCard: (deckId: string, cardId: string) => Promise<void>
  bulkCreateCards: (deckId: string, cards: Partial<Card>[]) => Promise<Card[]>
  bulkUpdateCards: (deckId: string, updates: { cardId: string; data: Partial<Card> }[]) => Promise<void>
  bulkDeleteCards: (deckId: string, cardIds: string[]) => Promise<void>
  
  // Actions - Import/Export
  importDeck: (file: File, options: Record<string, unknown>) => Promise<Deck>
  exportDeck: (deckId: string, format: 'json' | 'csv' | 'anki') => Promise<Blob>
  
  // Actions - Sharing
  shareDeck: (deckId: string, permissions: Record<string, unknown>) => Promise<void>
  
  // Actions - Filters and sorting
  setFilters: (filters: Partial<DeckFilters>) => void
  setSort: (sort: DeckSort) => void
  clearFilters: () => void
  
  // Actions - State management
  setCurrentDeck: (deck: Deck | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCardsLoading: (loading: boolean) => void
  setCardsError: (error: string | null) => void
  
  // Actions - Local state
  addDeckToLocal: (deck: Deck) => void
  updateDeckInLocal: (id: string, updates: Partial<Deck>) => void
  removeDeckFromLocal: (id: string) => void
  addCardsToLocal: (deckId: string, cards: Card[]) => void
  updateCardInLocal: (deckId: string, cardId: string, updates: Partial<Card>) => void
  removeCardFromLocal: (deckId: string, cardId: string) => void
}

// Default values
const defaultFilters: DeckFilters = {}
const defaultSort: DeckSort = { field: 'updatedAt', direction: 'desc' }

// Deck store implementation
export const useDeckStore = create<DeckState>()(
  persist(
    immer((set) => ({
      // Initial state
      decks: [],
      currentDeck: null,
      isLoading: false,
      error: null,
      cards: {},
      isLoadingCards: false,
      cardsError: null,
      filters: defaultFilters,
      sort: defaultSort,
      currentPage: 1,
      totalPages: 1,
      hasMore: false,

      // Deck CRUD actions
      fetchDecks: async () => {
        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/decks', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            }
          })

          if (!response.ok) {
            throw new Error('Failed to fetch decks')
          }

          const data = await response.json()
          
          set((state) => {
            state.decks = data.decks || []
            state.totalPages = data.totalPages || 1
            state.hasMore = data.hasMore || false
            state.isLoading = false
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Unknown error'
            state.isLoading = false
          })
        }
      },

      fetchDeck: async (id: string) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch(`/api/decks/${id}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            }
          })

          if (!response.ok) {
            throw new Error('Deck not found')
          }

          const deck = await response.json()
          
          set((state) => {
            const existingIndex = state.decks.findIndex((d: Deck) => d.id === id)
            if (existingIndex >= 0) {
              state.decks[existingIndex] = deck
            } else {
              state.decks.push(deck)
            }
          })

          return deck
        } catch (error) {
          throw error
        }
      },

      createDeck: async (deckData: Partial<Deck>) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch('/api/decks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            },
            body: JSON.stringify(deckData)
          })

          if (!response.ok) {
            throw new Error('Failed to create deck')
          }

          const newDeck = await response.json()
          
          set((state) => {
            state.decks.unshift(newDeck)
          })

          return newDeck
        } catch (error) {
          throw error
        }
      },

      updateDeck: async (id: string, updates: Partial<Deck>) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch(`/api/decks/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            },
            body: JSON.stringify(updates)
          })

          if (!response.ok) {
            throw new Error('Failed to update deck')
          }

          const updatedDeck = await response.json()
          
          set((state) => {
            const index = state.decks.findIndex((d: Deck) => d.id === id)
            if (index >= 0) {
              state.decks[index] = updatedDeck
            }
            if (state.currentDeck?.id === id) {
              state.currentDeck = updatedDeck
            }
          })

          return updatedDeck
        } catch (error) {
          throw error
        }
      },

      deleteDeck: async (id: string) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch(`/api/decks/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            }
          })

          if (!response.ok) {
            throw new Error('Failed to delete deck')
          }
          
          set((state) => {
            state.decks = state.decks.filter((d: Deck) => d.id !== id)
            if (state.currentDeck?.id === id) {
              state.currentDeck = null
            }
            delete state.cards[id]
          })
        } catch (error) {
          throw error
        }
      },

      duplicateDeck: async (id: string, title?: string) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch(`/api/decks/${id}/duplicate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            },
            body: JSON.stringify({ title })
          })

          if (!response.ok) {
            throw new Error('Failed to duplicate deck')
          }

          const duplicatedDeck = await response.json()
          
          set((state) => {
            state.decks.unshift(duplicatedDeck)
          })

          return duplicatedDeck
        } catch (error) {
          throw error
        }
      },

      // Card CRUD actions
      fetchCards: async (deckId: string) => {
        set((state) => {
          state.isLoadingCards = true
          state.cardsError = null
        })

        try {
          // TODO: Replace with actual API call
          const response = await fetch(`/api/decks/${deckId}/cards`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            }
          })

          if (!response.ok) {
            throw new Error('Failed to fetch cards')
          }

          const cards = await response.json()
          
          set((state) => {
            state.cards[deckId] = cards
            state.isLoadingCards = false
          })
        } catch (error) {
          set((state) => {
            state.cardsError = error instanceof Error ? error.message : 'Unknown error'
            state.isLoadingCards = false
          })
        }
      },

      createCard: async (deckId: string, cardData: Partial<Card>) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch(`/api/decks/${deckId}/cards`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            },
            body: JSON.stringify(cardData)
          })

          if (!response.ok) {
            throw new Error('Failed to create card')
          }

          const newCard = await response.json()
          
          set((state) => {
            if (!state.cards[deckId]) {
              state.cards[deckId] = []
            }
            state.cards[deckId].push(newCard)
            
            // Update deck card count
            const deck = state.decks.find((d: Deck) => d.id === deckId)
            if (deck) {
              deck.cardCount += 1
            }
          })

          return newCard
        } catch (error) {
          throw error
        }
      },

      updateCard: async (deckId: string, cardId: string, updates: Partial<Card>) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch(`/api/decks/${deckId}/cards/${cardId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            },
            body: JSON.stringify(updates)
          })

          if (!response.ok) {
            throw new Error('Failed to update card')
          }

          const updatedCard = await response.json()
          
          set((state) => {
            if (state.cards[deckId]) {
              const index = state.cards[deckId].findIndex((c: Card) => c.id === cardId)
              if (index >= 0) {
                state.cards[deckId][index] = updatedCard
              }
            }
          })

          return updatedCard
        } catch (error) {
          throw error
        }
      },

      deleteCard: async (deckId: string, cardId: string) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch(`/api/decks/${deckId}/cards/${cardId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            }
          })

          if (!response.ok) {
            throw new Error('Failed to delete card')
          }
          
          set((state) => {
            if (state.cards[deckId]) {
              state.cards[deckId] = state.cards[deckId].filter((c: Card) => c.id !== cardId)
              
              // Update deck card count
              const deck = state.decks.find((d: Deck) => d.id === deckId)
              if (deck) {
                deck.cardCount = Math.max(0, deck.cardCount - 1)
              }
            }
          })
        } catch (error) {
          throw error
        }
      },

      bulkCreateCards: async (deckId: string, cards: Partial<Card>[]) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch(`/api/decks/${deckId}/cards/bulk`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            },
            body: JSON.stringify({ cards })
          })

          if (!response.ok) {
            throw new Error('Failed to create cards')
          }

          const newCards = await response.json()
          
          set((state) => {
            if (!state.cards[deckId]) {
              state.cards[deckId] = []
            }
            state.cards[deckId].push(...newCards)
            
            // Update deck card count
            const deck = state.decks.find((d: Deck) => d.id === deckId)
            if (deck) {
              deck.cardCount += newCards.length
            }
          })

          return newCards
        } catch (error) {
          throw error
        }
      },

      bulkUpdateCards: async (deckId: string, updates: { cardId: string; data: Partial<Card> }[]) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch(`/api/decks/${deckId}/cards/bulk`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            },
            body: JSON.stringify({ updates })
          })

          if (!response.ok) {
            throw new Error('Failed to update cards')
          }
          
          set((state) => {
            if (state.cards[deckId]) {
              updates.forEach(({ cardId, data }) => {
                const index = state.cards[deckId].findIndex((c: Card) => c.id === cardId)
                if (index >= 0) {
                  state.cards[deckId][index] = { ...state.cards[deckId][index], ...data }
                }
              })
            }
          })
        } catch (error) {
          throw error
        }
      },

      bulkDeleteCards: async (deckId: string, cardIds: string[]) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch(`/api/decks/${deckId}/cards/bulk`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            },
            body: JSON.stringify({ cardIds })
          })

          if (!response.ok) {
            throw new Error('Failed to delete cards')
          }
          
          set((state) => {
            if (state.cards[deckId]) {
              state.cards[deckId] = state.cards[deckId].filter((c: Card) => !cardIds.includes(c.id))
              
              // Update deck card count
              const deck = state.decks.find((d: Deck) => d.id === deckId)
              if (deck) {
                deck.cardCount = Math.max(0, deck.cardCount - cardIds.length)
              }
            }
          })
        } catch (error) {
          throw error
        }
      },

      // Import/Export actions
      importDeck: async (file: File, options: Record<string, unknown>) => {
        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('options', JSON.stringify(options))

          // TODO: Replace with actual API call
          const response = await fetch('/api/decks/import', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            },
            body: formData
          })

          if (!response.ok) {
            throw new Error('Failed to import deck')
          }

          const importedDeck = await response.json()
          
          set((state) => {
            state.decks.unshift(importedDeck)
          })

          return importedDeck
        } catch (error) {
          throw error
        }
      },

      exportDeck: async (deckId: string, format: 'json' | 'csv' | 'anki') => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch(`/api/decks/${deckId}/export?format=${format}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            }
          })

          if (!response.ok) {
            throw new Error('Failed to export deck')
          }

          return await response.blob()
        } catch (error) {
          throw error
        }
      },

      // Sharing actions
      shareDeck: async (deckId: string, permissions: Record<string, unknown>) => {
        try {
          // TODO: Replace with actual API call
          const response = await fetch(`/api/decks/${deckId}/share`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            },
            body: JSON.stringify(permissions)
          })

          if (!response.ok) {
            throw new Error('Failed to share deck')
          }
        } catch (error) {
          throw error
        }
      },

      // Filter and sort actions
      setFilters: (filters: Partial<DeckFilters>) => {
        set((state) => {
          state.filters = { ...state.filters, ...filters }
          state.currentPage = 1
        })
      },

      setSort: (sort: DeckSort) => {
        set((state) => {
          state.sort = sort
          state.currentPage = 1
        })
      },

      clearFilters: () => {
        set((state) => {
          state.filters = defaultFilters
          state.currentPage = 1
        })
      },

      // State management actions
      setCurrentDeck: (deck: Deck | null) => {
        set((state) => {
          state.currentDeck = deck
        })
      },

      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading
        })
      },

      setError: (error: string | null) => {
        set((state) => {
          state.error = error
        })
      },

      setCardsLoading: (loading: boolean) => {
        set((state) => {
          state.isLoadingCards = loading
        })
      },

      setCardsError: (error: string | null) => {
        set((state) => {
          state.cardsError = error
        })
      },

      // Local state actions
      addDeckToLocal: (deck: Deck) => {
        set((state) => {
          state.decks.unshift(deck)
        })
      },

      updateDeckInLocal: (id: string, updates: Partial<Deck>) => {
        set((state) => {
          const index = state.decks.findIndex((d: Deck) => d.id === id)
          if (index >= 0) {
            state.decks[index] = { ...state.decks[index], ...updates }
          }
        })
      },

      removeDeckFromLocal: (id: string) => {
        set((state) => {
          state.decks = state.decks.filter((d: Deck) => d.id !== id)
          delete state.cards[id]
        })
      },

      addCardsToLocal: (deckId: string, cards: Card[]) => {
        set((state) => {
          if (!state.cards[deckId]) {
            state.cards[deckId] = []
          }
          state.cards[deckId].push(...cards)
        })
      },

      updateCardInLocal: (deckId: string, cardId: string, updates: Partial<Card>) => {
        set((state) => {
          if (state.cards[deckId]) {
            const index = state.cards[deckId].findIndex((c: Card) => c.id === cardId)
            if (index >= 0) {
              state.cards[deckId][index] = { ...state.cards[deckId][index], ...updates }
            }
          }
        })
      },

      removeCardFromLocal: (deckId: string, cardId: string) => {
        set((state) => {
          if (state.cards[deckId]) {
            state.cards[deckId] = state.cards[deckId].filter((c: Card) => c.id !== cardId)
          }
        })
      }
    })),
    {
      name: STORAGE_KEYS.OFFLINE_DECKS,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        decks: state.decks,
        cards: state.cards,
        filters: state.filters,
        sort: state.sort
      })
    }
  )
)

// Deck store selectors
export const useDecks = () => useDeckStore((state) => ({
  decks: state.decks,
  isLoading: state.isLoading,
  error: state.error,
  filters: state.filters,
  sort: state.sort
}))

export const useDeckActions = () => useDeckStore((state) => ({
  fetchDecks: state.fetchDecks,
  createDeck: state.createDeck,
  updateDeck: state.updateDeck,
  deleteDeck: state.deleteDeck,
  duplicateDeck: state.duplicateDeck,
  setFilters: state.setFilters,
  setSort: state.setSort,
  clearFilters: state.clearFilters
}))

export const useCards = (deckId: string) => useDeckStore((state) => ({
  cards: state.cards[deckId] || [],
  isLoading: state.isLoadingCards,
  error: state.cardsError
}))

export const useCardActions = () => useDeckStore((state) => ({
  fetchCards: state.fetchCards,
  createCard: state.createCard,
  updateCard: state.updateCard,
  deleteCard: state.deleteCard,
  bulkCreateCards: state.bulkCreateCards,
  bulkUpdateCards: state.bulkUpdateCards,
  bulkDeleteCards: state.bulkDeleteCards
}))
