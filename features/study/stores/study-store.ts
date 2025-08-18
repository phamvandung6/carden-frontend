// Study Store - State management for SRS and practice sessions
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { 
  StudyStore,
  StudyActions
} from '../types/study-state';
import type {
  StudySessionState,
  StudyPreferences,
  StudyError
} from '../types/srs-types';
import type {
  PracticeCard,
  Grade,
  StudyMode,
  StartPracticeSessionRequest,
  DueCardsQueryParams,
  NewCardsQueryParams,
  LearningCardsQueryParams
} from '../types/practice-session';

interface StudyStoreImpl extends StudyStore, StudyActions {}

// Default preferences
const defaultPreferences: StudyPreferences = {
  defaultStudyMode: 'FLIP',
  maxNewCardsPerDay: 20,
  maxReviewCardsPerSession: 200,
  showAnswerAutomatically: false,
  autoPlayAudio: false,
  enableKeyboardShortcuts: true,
  reviewNotifications: true,
  studyReminders: false,
  preferredStudyTime: '09:00'
};

// Default session state
const defaultSessionState: StudySessionState = {
  isActive: false,
  currentSession: null,
  currentCard: null,
  sessionProgress: null,
  isPaused: false,
  pauseStartTime: null,
  totalPauseTime: 0,
  isComplete: false,
  nextAvailableStudyTime: undefined,
  minutesUntilNextCard: undefined,
  canStudyNow: undefined
};

export const useStudyStore = create<StudyStoreImpl>()(
  persist(
    immer((set, get) => ({
      // Initial state
      currentSession: defaultSessionState,
      dueCards: [],
      newCards: [],
      learningCards: [],
      currentCard: null,
      statistics: null,
      srsMetrics: null,
      learningProgress: [],
      reviewSchedule: null,
      dueCardsCount: null,
      preferences: defaultPreferences,
      isLoading: false,
      error: null,
      dueCardsPagination: null,

      // Session actions
      startSession: async (request: StartPracticeSessionRequest) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          // This will be implemented when we create the API service
          const studyApi = await import('../services/study-api');
          const response = await studyApi.startPracticeSession(request);
          
          if (response.success && response.data) {
            set((state) => {
              state.currentSession.isActive = true;
              state.currentSession.currentSession = response.data;
              state.currentSession.isComplete = false; // Reset complete flag
              state.currentSession.nextAvailableStudyTime = response.data.nextAvailableStudyTime;
              state.currentSession.minutesUntilNextCard = response.data.minutesUntilNextCard;
              state.currentSession.canStudyNow = response.data.canStudyNow;
              state.isLoading = false;
            });

            return response.data;
          } else {
            throw new Error(response.message || 'Failed to start session');
          }
        } catch (error) {
          set((state) => {
            state.error = {
              code: 'NETWORK_ERROR',
              message: 'Failed to start practice session',
              details: error
            };
            state.isLoading = false;
          });
          throw error;
        }
      },

      getCurrentSession: async () => {
        try {
          const studyApi = await import('../services/study-api');
          const apiResponse = await studyApi.getCurrentSession();
          
          if (apiResponse && apiResponse.success && apiResponse.data) {
            set((state) => {
              state.currentSession.currentSession = apiResponse.data;
            });
            return apiResponse.data;
          }
          
          return null;
        } catch (error) {
          set((state) => {
            state.error = {
              code: 'SESSION_NOT_FOUND',
              message: 'No active session found',
              details: error
            };
          });
          return null;
        }
      },

      completeSession: async (sessionId: number) => {
        set((state) => {
          state.isLoading = true;
        });

        try {
          const studyApi = await import('../services/study-api');
          const apiResponse = await studyApi.completeSession(sessionId);
          
          if (apiResponse.success && apiResponse.data) {
            set((state) => {
              state.currentSession = defaultSessionState;
              state.currentCard = null;
              state.dueCardsCount = null; // Reset due cards count to force refetch
              state.isLoading = false;
            });

            return apiResponse.data;
          } else {
            throw new Error(apiResponse.message || 'Failed to complete session');
          }
        } catch (error) {
          set((state) => {
            state.error = {
              code: 'NETWORK_ERROR',
              message: 'Failed to complete session',
              details: error
            };
            state.isLoading = false;
          });
          throw error;
        }
      },

      pauseSession: () => {
        set((state) => {
          state.currentSession.isPaused = true;
          state.currentSession.pauseStartTime = Date.now();
        });
      },

      resumeSession: () => {
        set((state) => {
          const pauseTime = state.currentSession.pauseStartTime 
            ? Date.now() - state.currentSession.pauseStartTime 
            : 0;
          state.currentSession.totalPauseTime += pauseTime;
          state.currentSession.isPaused = false;
          state.currentSession.pauseStartTime = null;
        });
      },

      // Card actions
      getNextCard: async (deckId?: number) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const studyApi = await import('../services/study-api');
          const apiResponse = await studyApi.getNextCard(deckId);
          
          if (apiResponse && apiResponse.success && apiResponse.data) {
            set((state) => {
              state.currentCard = apiResponse.data;
              state.currentSession.currentCard = apiResponse.data;
              state.isLoading = false;
            });

            return apiResponse.data;
          } else {
            // API returned success: false - no more cards available
            set((state) => {
              state.currentCard = null;
              state.currentSession.currentCard = null;
              state.currentSession.isComplete = true; // Mark session as complete
              state.isLoading = false;
              state.error = {
                code: 'NO_CARDS_AVAILABLE',
                message: apiResponse?.message || 'No cards available for practice',
                details: null
              };
            });
            return null;
          }
        } catch (error) {
          set((state) => {
            state.error = {
              code: 'NETWORK_ERROR',
              message: 'Failed to get next card',
              details: error
            };
            state.currentCard = null;
            state.currentSession.currentCard = null;
            state.isLoading = false;
          });
          return null;
        }
      },

      submitReview: async (cardId: number, grade: Grade, responseTime?: number) => {
        try {
          const studyApi = await import('../services/study-api');
          const apiResponse = await studyApi.submitReview(cardId, {
            grade,
            responseTimeMs: responseTime
          });
          
          if (apiResponse.success && apiResponse.data) {
            const result = apiResponse.data;
            set((state) => {
              // Update session progress
              if (result.sessionProgress) {
                state.currentSession.sessionProgress = result.sessionProgress;
              }
              
              // Set next card
              if (result.nextCard) {
                state.currentCard = result.nextCard;
                state.currentSession.currentCard = result.nextCard;
              } else {
                state.currentCard = null;
                state.currentSession.currentCard = null;
              }
            });

            return result;
          } else {
            throw new Error(apiResponse.message || 'Failed to submit review');
          }
        } catch (error) {
          set((state) => {
            state.error = {
              code: 'NETWORK_ERROR',
              message: 'Failed to submit review',
              details: error
            };
          });
          throw error;
        }
      },

      getDueCards: async (params?: DueCardsQueryParams) => {
        set((state) => {
          state.isLoading = true;
        });

        try {
          const studyApi = await import('../services/study-api');
          const apiResponse = await studyApi.getDueCards(params);
          
          if (apiResponse.success && apiResponse.data) {
            const response = apiResponse.data;
            set((state) => {
              state.dueCards = response.content;
              state.dueCardsPagination = {
                currentPage: response.number,
                totalPages: response.totalPages,
                pageSize: response.size,
                totalElements: response.totalElements,
                first: response.first,
                last: response.last,
                numberOfElements: response.numberOfElements,
                empty: response.empty
              };
              state.isLoading = false;
            });
          } else {
            throw new Error(apiResponse.message || 'Failed to load due cards');
          }
        } catch (error) {
          set((state) => {
            state.error = {
              code: 'NETWORK_ERROR',
              message: 'Failed to load due cards',
              details: error
            };
            state.isLoading = false;
          });
        }
      },

      getNewCards: async (params?: NewCardsQueryParams) => {
        try {
          const studyApi = await import('../services/study-api');
          const apiResponse = await studyApi.getNewCards(params);
          
          if (apiResponse.success && apiResponse.data) {
            set((state) => {
              state.newCards = apiResponse.data.content;
            });
          } else {
            throw new Error(apiResponse.message || 'Failed to load new cards');
          }
        } catch (error) {
          set((state) => {
            state.error = {
              code: 'NETWORK_ERROR',
              message: 'Failed to load new cards',
              details: error
            };
          });
        }
      },

      getLearningCards: async (params?: LearningCardsQueryParams) => {
        try {
          const studyApi = await import('../services/study-api');
          const apiResponse = await studyApi.getLearningCards(params);
          
          if (apiResponse.success && apiResponse.data) {
            set((state) => {
              state.learningCards = apiResponse.data;
            });
          } else {
            throw new Error(apiResponse.message || 'Failed to load learning cards');
          }
        } catch (error) {
          set((state) => {
            state.error = {
              code: 'NETWORK_ERROR',
              message: 'Failed to load learning cards',
              details: error
            };
          });
        }
      },

      getDueCardsCount: async (deckId?: number) => {
        try {
          const studyApi = await import('../services/study-api');
          const apiResponse = await studyApi.getDueCardsCount(deckId);
          
          if (apiResponse.success && apiResponse.data) {
            set((state) => {
              state.dueCardsCount = apiResponse.data;
            });

            return apiResponse.data;
          } else {
            throw new Error(apiResponse.message || 'Failed to load due cards count');
          }
        } catch (error) {
          set((state) => {
            state.error = {
              code: 'NETWORK_ERROR',
              message: 'Failed to load due cards count',
              details: error
            };
          });
          throw error;
        }
      },

      // Statistics actions
      getStudyStatistics: async () => {
        try {
          const studyApi = await import('../services/study-api');
          const apiResponse = await studyApi.getStudyStatistics();
          
          if (apiResponse.success && apiResponse.data) {
            set((state) => {
              state.statistics = apiResponse.data;
            });

            return apiResponse.data;
          } else {
            throw new Error(apiResponse.message || 'Failed to load statistics');
          }
        } catch (error) {
          set((state) => {
            state.error = {
              code: 'NETWORK_ERROR',
              message: 'Failed to load statistics',
              details: error
            };
          });
          throw error;
        }
      },

      getSRSMetrics: async () => {
        try {
          const studyApi = await import('../services/study-api');
          const apiResponse = await studyApi.getSRSMetrics();
          
          if (apiResponse.success && apiResponse.data) {
            set((state) => {
              state.srsMetrics = apiResponse.data;
            });

            return apiResponse.data;
          } else {
            throw new Error(apiResponse.message || 'Failed to load SRS metrics');
          }
        } catch (error) {
          set((state) => {
            state.error = {
              code: 'NETWORK_ERROR',
              message: 'Failed to load SRS metrics',
              details: error
            };
          });
          throw error;
        }
      },

      getLearningProgress: async () => {
        try {
          const studyApi = await import('../services/study-api');
          const apiResponse = await studyApi.getLearningProgress();
          
          if (apiResponse.success && apiResponse.data) {
            set((state) => {
              state.learningProgress = apiResponse.data;
            });

            return apiResponse.data;
          } else {
            throw new Error(apiResponse.message || 'Failed to load learning progress');
          }
        } catch (error) {
          set((state) => {
            state.error = {
              code: 'NETWORK_ERROR',
              message: 'Failed to load learning progress',
              details: error
            };
          });
          throw error;
        }
      },

      getReviewSchedule: async () => {
        try {
          const studyApi = await import('../services/study-api');
          const apiResponse = await studyApi.getReviewSchedule();
          
          if (apiResponse.success && apiResponse.data) {
            set((state) => {
              state.reviewSchedule = apiResponse.data;
            });

            return apiResponse.data;
          } else {
            throw new Error(apiResponse.message || 'Failed to load review schedule');
          }
        } catch (error) {
          set((state) => {
            state.error = {
              code: 'NETWORK_ERROR',
              message: 'Failed to load review schedule',
              details: error
            };
          });
          throw error;
        }
      },

      getDeckStatistics: async (deckId: number) => {
        try {
          const studyApi = await import('../services/study-api');
          const apiResponse = await studyApi.getDeckStatistics(deckId);
          
          if (apiResponse.success && apiResponse.data) {
            return apiResponse.data;
          } else {
            throw new Error(apiResponse.message || 'Failed to load deck statistics');
          }
        } catch (error) {
          set((state) => {
            state.error = {
              code: 'NETWORK_ERROR',
              message: 'Failed to load deck statistics',
              details: error
            };
          });
          throw error;
        }
      },

      // Preferences actions
      updatePreferences: async (preferences: Partial<StudyPreferences>) => {
        set((state) => {
          state.preferences = { ...state.preferences, ...preferences };
        });
        
        // TODO: Sync with backend if needed
      },

      // Utility actions
      setCurrentCard: (card: PracticeCard | null) => {
        set((state) => {
          state.currentCard = card;
          state.currentSession.currentCard = card;
        });
      },

      setError: (error: StudyError | null) => {
        set((state) => {
          state.error = error;
        });
      },

      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading;
        });
      },

      clearState: () => {
        set((state) => {
          state.currentSession = defaultSessionState;
          state.dueCards = [];
          state.newCards = [];
          state.learningCards = [];
          state.currentCard = null;
          state.statistics = null;
          state.srsMetrics = null;
          state.learningProgress = [];
          state.reviewSchedule = null;
          state.dueCardsCount = null;
          state.error = null;
          state.isLoading = false;
          state.dueCardsPagination = null;
        });
      }
    })),
    {
      name: 'study-store',
      partialize: (state) => ({
        preferences: state.preferences,
        // Don't persist session state, statistics, or cards
      }),
    }
  )
);

// Selector hooks for better performance
export const useStudySession = () => useStudyStore((state) => state.currentSession);
export const useCurrentCard = () => useStudyStore((state) => state.currentCard);
export const useDueCardsState = () => useStudyStore((state) => state.dueCards);
export const useStudyPreferences = () => useStudyStore((state) => state.preferences);
export const useStudyError = () => useStudyStore((state) => state.error);
export const useStudyLoading = () => useStudyStore((state) => state.isLoading);

