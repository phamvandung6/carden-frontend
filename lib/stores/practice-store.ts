import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS, PRACTICE_MODES, DIFFICULTY_LEVELS } from '@/lib/constants'
import type { Card } from './deck-store'

// Practice session types
export type PracticeMode = keyof typeof PRACTICE_MODES
export type DifficultyRating = 0 | 1 | 2 | 3 // again, hard, good, easy

export interface PracticeCard extends Card {
  isReviewed: boolean
  userAnswer?: string
  timeSpent: number
  difficulty: DifficultyRating
  wasCorrect?: boolean
}

export interface PracticeSession {
  id: string
  deckId: string
  mode: PracticeMode
  cards: PracticeCard[]
  currentCardIndex: number
  startTime: string
  endTime?: string
  totalTimeSpent: number
  isCompleted: boolean
  stats: {
    totalCards: number
    reviewedCards: number
    correctAnswers: number
    averageTimePerCard: number
    difficultyBreakdown: Record<DifficultyRating, number>
  }
}

export interface StudyProgress {
  deckId: string
  totalSessions: number
  totalTimeSpent: number
  totalCardsStudied: number
  averageScore: number
  streak: number
  lastStudied: string
  nextReview: string
  cardProgress: Record<string, {
    timesStudied: number
    averageDifficulty: number
    lastReviewed: string
    nextReview: string
    easinessFactor: number
    interval: number
    repetitions: number
  }>
}

export interface PracticeSettings {
  defaultMode: PracticeMode
  sessionSize: number
  showHints: boolean
  autoAdvance: boolean
  shuffleCards: boolean
  enableSpacedRepetition: boolean
  maxNewCardsPerDay: number
  maxReviewsPerDay: number
  autoPlayTTS: boolean
  showTimer: boolean
}

// Practice store state interface
interface PracticeState {
  // Current session
  currentSession: PracticeSession | null
  isSessionActive: boolean
  isPaused: boolean
  
  // Session queue and history
  sessions: PracticeSession[]
  queuedCards: Card[]
  dueCards: Card[]
  
  // Progress tracking
  progress: Record<string, StudyProgress> // deckId -> progress
  
  // Settings
  settings: PracticeSettings
  
  // UI state
  showAnswer: boolean
  isLoading: boolean
  error: string | null
  
  // Actions - Session management
  startSession: (deckId: string, mode: PracticeMode, cardLimit?: number) => Promise<void>
  pauseSession: () => void
  resumeSession: () => void
  endSession: () => Promise<void>
  abortSession: () => void
  
  // Actions - Card navigation and review
  nextCard: () => void
  previousCard: () => void
  goToCard: (index: number) => void
  reviewCard: (difficulty: DifficultyRating, userAnswer?: string) => void
  skipCard: () => void
  toggleShowAnswer: () => void
  
  // Actions - Progress and stats
  updateCardProgress: (deckId: string, cardId: string, difficulty: DifficultyRating) => void
  calculateNextReview: (difficulty: DifficultyRating, currentInterval: number, easinessFactor: number) => { interval: number; easinessFactor: number }
  getDueCards: (deckId: string) => Card[]
  getStudyStats: (deckId: string, period: 'day' | 'week' | 'month') => {
    sessionsCompleted: number
    totalTimeSpent: number
    totalCardsStudied: number
    averageAccuracy: number
  }
  
  // Actions - Settings
  updateSettings: (settings: Partial<PracticeSettings>) => void
  resetSettings: () => void
  
  // Actions - State management
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

// Default settings
const defaultSettings: PracticeSettings = {
  defaultMode: 'FLIP_CARDS',
  sessionSize: 20,
  showHints: true,
  autoAdvance: false,
  shuffleCards: true,
  enableSpacedRepetition: true,
  maxNewCardsPerDay: 20,
  maxReviewsPerDay: 100,
  autoPlayTTS: false,
  showTimer: true
}

// SRS algorithm helpers
const calculateEasinessFactor = (difficulty: DifficultyRating, currentEF: number): number => {
  const newEF = currentEF + (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02))
  return Math.max(1.3, newEF)
}

const calculateInterval = (difficulty: DifficultyRating, currentInterval: number, repetitions: number): number => {
  if (difficulty === DIFFICULTY_LEVELS.AGAIN) {
    return 1
  } else if (repetitions === 0) {
    return 1
  } else if (repetitions === 1) {
    return 6
  } else {
    return Math.round(currentInterval * calculateEasinessFactor(difficulty, 2.5))
  }
}

// Practice store implementation
export const usePracticeStore = create<PracticeState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      currentSession: null,
      isSessionActive: false,
      isPaused: false,
      sessions: [],
      queuedCards: [],
      dueCards: [],
      progress: {},
      settings: defaultSettings,
      showAnswer: false,
      isLoading: false,
      error: null,

      // Session management
      startSession: async (deckId: string, mode: PracticeMode, cardLimit?: number) => {
        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          // TODO: Replace with actual API call to get cards
          const response = await fetch(`/api/practice/session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            },
            body: JSON.stringify({ deckId, mode, cardLimit })
          })

          if (!response.ok) {
            throw new Error('Failed to start practice session')
          }

          const { cards } = await response.json()
          
          const practiceCards: PracticeCard[] = cards.map((card: Card) => ({
            ...card,
            isReviewed: false,
            timeSpent: 0,
            difficulty: DIFFICULTY_LEVELS.AGAIN
          }))

          const session: PracticeSession = {
            id: `session-${Date.now()}`,
            deckId,
            mode,
            cards: practiceCards,
            currentCardIndex: 0,
            startTime: new Date().toISOString(),
            totalTimeSpent: 0,
            isCompleted: false,
            stats: {
              totalCards: practiceCards.length,
              reviewedCards: 0,
              correctAnswers: 0,
              averageTimePerCard: 0,
              difficultyBreakdown: {
                [DIFFICULTY_LEVELS.AGAIN]: 0,
                [DIFFICULTY_LEVELS.HARD]: 0,
                [DIFFICULTY_LEVELS.GOOD]: 0,
                [DIFFICULTY_LEVELS.EASY]: 0
              }
            }
          }

          set((state) => {
            state.currentSession = session
            state.isSessionActive = true
            state.isPaused = false
            state.showAnswer = false
            state.isLoading = false
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Unknown error'
            state.isLoading = false
          })
          throw error
        }
      },

      pauseSession: () => {
        set((state) => {
          state.isPaused = true
        })
      },

      resumeSession: () => {
        set((state) => {
          state.isPaused = false
        })
      },

      endSession: async () => {
        const { currentSession } = get()
        
        if (!currentSession) return

        try {
          const endTime = new Date().toISOString()
          const totalTimeSpent = Date.now() - new Date(currentSession.startTime).getTime()

          const completedSession: PracticeSession = {
            ...currentSession,
            endTime,
            totalTimeSpent,
            isCompleted: true,
            stats: {
              ...currentSession.stats,
              averageTimePerCard: currentSession.stats.reviewedCards > 0 
                ? totalTimeSpent / currentSession.stats.reviewedCards 
                : 0
            }
          }

          // TODO: Replace with actual API call
          const response = await fetch('/api/practice/session/complete', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)}`
            },
            body: JSON.stringify(completedSession)
          })

          if (!response.ok) {
            throw new Error('Failed to save session')
          }

          set((state) => {
            state.sessions.push(completedSession)
            state.currentSession = null
            state.isSessionActive = false
            state.isPaused = false
            state.showAnswer = false
          })

          // Update progress for each reviewed card
          completedSession.cards.forEach(card => {
            if (card.isReviewed) {
              get().updateCardProgress(currentSession.deckId, card.id, card.difficulty)
            }
          })
        } catch (error) {
          set((state) => {
            state.error = error instanceof Error ? error.message : 'Unknown error'
          })
          throw error
        }
      },

      abortSession: () => {
        set((state) => {
          state.currentSession = null
          state.isSessionActive = false
          state.isPaused = false
          state.showAnswer = false
        })
      },

      // Card navigation and review
      nextCard: () => {
        set((state) => {
          if (state.currentSession && state.currentSession.currentCardIndex < state.currentSession.cards.length - 1) {
            state.currentSession.currentCardIndex += 1
            state.showAnswer = false
          }
        })
      },

      previousCard: () => {
        set((state) => {
          if (state.currentSession && state.currentSession.currentCardIndex > 0) {
            state.currentSession.currentCardIndex -= 1
            state.showAnswer = false
          }
        })
      },

      goToCard: (index: number) => {
        set((state) => {
          if (state.currentSession && index >= 0 && index < state.currentSession.cards.length) {
            state.currentSession.currentCardIndex = index
            state.showAnswer = false
          }
        })
      },

      reviewCard: (difficulty: DifficultyRating, userAnswer?: string) => {
        set((state) => {
          if (state.currentSession) {
            const currentCard = state.currentSession.cards[state.currentSession.currentCardIndex]
            if (currentCard && !currentCard.isReviewed) {
              currentCard.isReviewed = true
              currentCard.difficulty = difficulty
              currentCard.userAnswer = userAnswer
              currentCard.wasCorrect = difficulty >= DIFFICULTY_LEVELS.GOOD

              // Update session stats
              state.currentSession.stats.reviewedCards += 1
              if (currentCard.wasCorrect) {
                state.currentSession.stats.correctAnswers += 1
              }
              state.currentSession.stats.difficultyBreakdown[difficulty] += 1
            }
          }
        })
      },

      skipCard: () => {
        set((state) => {
          if (state.currentSession) {
            const currentCard = state.currentSession.cards[state.currentSession.currentCardIndex]
            if (currentCard && !currentCard.isReviewed) {
              currentCard.isReviewed = true
              currentCard.difficulty = DIFFICULTY_LEVELS.AGAIN
              state.currentSession.stats.reviewedCards += 1
              state.currentSession.stats.difficultyBreakdown[DIFFICULTY_LEVELS.AGAIN] += 1
            }
          }
        })
      },

      toggleShowAnswer: () => {
        set((state) => {
          state.showAnswer = !state.showAnswer
        })
      },

      // Progress and stats
      updateCardProgress: (deckId: string, cardId: string, difficulty: DifficultyRating) => {
        set((state) => {
          if (!state.progress[deckId]) {
            state.progress[deckId] = {
              deckId,
              totalSessions: 0,
              totalTimeSpent: 0,
              totalCardsStudied: 0,
              averageScore: 0,
              streak: 0,
              lastStudied: new Date().toISOString(),
              nextReview: new Date().toISOString(),
              cardProgress: {}
            }
          }

          const deckProgress = state.progress[deckId]
          const cardProgress = deckProgress.cardProgress[cardId] || {
            timesStudied: 0,
            averageDifficulty: 0,
            lastReviewed: new Date().toISOString(),
            nextReview: new Date().toISOString(),
            easinessFactor: 2.5,
            interval: 1,
            repetitions: 0
          }

          // Update card-specific progress
          cardProgress.timesStudied += 1
          cardProgress.lastReviewed = new Date().toISOString()
          cardProgress.averageDifficulty = (cardProgress.averageDifficulty + difficulty) / cardProgress.timesStudied

          // SRS calculation
          if (difficulty >= DIFFICULTY_LEVELS.GOOD) {
            cardProgress.repetitions += 1
          } else {
            cardProgress.repetitions = 0
          }

          cardProgress.easinessFactor = calculateEasinessFactor(difficulty, cardProgress.easinessFactor)
          cardProgress.interval = calculateInterval(difficulty, cardProgress.interval, cardProgress.repetitions)

          // Calculate next review date
          const nextReviewDate = new Date()
          nextReviewDate.setDate(nextReviewDate.getDate() + cardProgress.interval)
          cardProgress.nextReview = nextReviewDate.toISOString()

          deckProgress.cardProgress[cardId] = cardProgress
          deckProgress.lastStudied = new Date().toISOString()
          deckProgress.totalCardsStudied += 1
        })
      },

      calculateNextReview: (difficulty: DifficultyRating, currentInterval: number, easinessFactor: number) => {
        const newEasinessFactor = calculateEasinessFactor(difficulty, easinessFactor)
        const newInterval = calculateInterval(difficulty, currentInterval, 1)
        return { interval: newInterval, easinessFactor: newEasinessFactor }
      },

      getDueCards: (deckId: string) => {
        const { progress } = get()
        const deckProgress = progress[deckId]
        
        if (!deckProgress) return []

        const now = new Date()
        Object.entries(deckProgress.cardProgress)
          .filter(([, cardProgress]) => new Date(cardProgress.nextReview) <= now)
          .map(([cardId]) => cardId)

        // TODO: Fetch actual card objects from deck store or API
        return []
      },

      getStudyStats: (deckId: string, period: 'day' | 'week' | 'month') => {
        const { sessions } = get()
        const deckSessions = sessions.filter(s => s.deckId === deckId && s.isCompleted)
        
        const now = new Date()
        const periodStart = new Date()
        
        switch (period) {
          case 'day':
            periodStart.setDate(now.getDate() - 1)
            break
          case 'week':
            periodStart.setDate(now.getDate() - 7)
            break
          case 'month':
            periodStart.setMonth(now.getMonth() - 1)
            break
        }

        const periodSessions = deckSessions.filter(s => 
          new Date(s.startTime) >= periodStart
        )

        return {
          sessionsCompleted: periodSessions.length,
          totalTimeSpent: periodSessions.reduce((sum, s) => sum + s.totalTimeSpent, 0),
          totalCardsStudied: periodSessions.reduce((sum, s) => sum + s.stats.reviewedCards, 0),
          averageAccuracy: periodSessions.length > 0 
            ? periodSessions.reduce((sum, s) => sum + (s.stats.correctAnswers / s.stats.reviewedCards || 0), 0) / periodSessions.length
            : 0
        }
      },

      // Settings
      updateSettings: (settings: Partial<PracticeSettings>) => {
        set((state) => {
          state.settings = { ...state.settings, ...settings }
        })
      },

      resetSettings: () => {
        set((state) => {
          state.settings = defaultSettings
        })
      },

      // State management
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

      clearError: () => {
        set((state) => {
          state.error = null
        })
      }
    })),
    {
      name: STORAGE_KEYS.PRACTICE_SETTINGS,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sessions: state.sessions,
        progress: state.progress,
        settings: state.settings
      })
    }
  )
)

// Practice store selectors
export const usePracticeSession = () => usePracticeStore((state) => ({
  currentSession: state.currentSession,
  isSessionActive: state.isSessionActive,
  isPaused: state.isPaused,
  showAnswer: state.showAnswer,
  isLoading: state.isLoading,
  error: state.error
}))

export const usePracticeActions = () => usePracticeStore((state) => ({
  startSession: state.startSession,
  pauseSession: state.pauseSession,
  resumeSession: state.resumeSession,
  endSession: state.endSession,
  abortSession: state.abortSession,
  nextCard: state.nextCard,
  previousCard: state.previousCard,
  goToCard: state.goToCard,
  reviewCard: state.reviewCard,
  skipCard: state.skipCard,
  toggleShowAnswer: state.toggleShowAnswer
}))

export const usePracticeSettings = () => usePracticeStore((state) => ({
  settings: state.settings,
  updateSettings: state.updateSettings,
  resetSettings: state.resetSettings
}))

export const usePracticeProgress = (deckId: string) => usePracticeStore((state) => ({
  progress: state.progress[deckId],
  getStudyStats: state.getStudyStats,
  getDueCards: state.getDueCards
}))
