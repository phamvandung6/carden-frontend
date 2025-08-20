'use client';

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Card } from '@/features/flashcards';
import type {
  ClientStudyStore,
  ClientStudySession,
  ClientStudyCard,
  ClientStudyStats,
  ClientStudyPreferences,
  ClientDifficulty
} from '../types';

// Default preferences
const defaultPreferences: ClientStudyPreferences = {
  showProgress: true,
  shuffleCards: true
};

// Helper function to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to convert Card to ClientStudyCard
function cardToClientStudyCard(card: Card): ClientStudyCard {
  return {
    ...card,
    timesStudied: 0,
    needsReview: true,
    clientDifficulty: undefined,
    lastStudied: undefined
  };
}

export const useClientStudyStore = create<ClientStudyStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        currentSession: null,
        preferences: defaultPreferences,
        isLoading: false,
        error: null,

        // Actions
        startStudySession: (deckId: number, deckTitle: string, cards: Card[]) => {
          set((state) => {
            if (cards.length === 0) {
              state.error = 'No cards available to study';
              return;
            }

            // Convert cards to client study cards
            let studyCards = cards.map(cardToClientStudyCard);

            // Shuffle if preference is enabled
            if (state.preferences.shuffleCards) {
              studyCards = shuffleArray(studyCards);
            }

            state.currentSession = {
              deckId,
              deckTitle,
              cards: studyCards,
              currentCardIndex: 0,
              currentCard: studyCards[0],
              studiedCards: [],
              completedCards: [],
              isActive: true,
              isComplete: false,
              showAnswer: false,
              startTime: new Date(),
              totalCards: studyCards.length,
              mode: 'study'
            };

            state.error = null;
          });
        },

        endStudySession: () => {
          const session = get().currentSession;
          if (!session) return null;

          const stats = get().getSessionStats();
          
          set((state) => {
            if (state.currentSession) {
              state.currentSession.endTime = new Date();
              state.currentSession.isActive = false;
              state.currentSession.isComplete = true;
            }
          });

          return stats;
        },

        showAnswer: () => {
          set((state) => {
            if (state.currentSession && !state.currentSession.showAnswer) {
              state.currentSession.showAnswer = true;
            }
          });
        },

        rateCard: (difficulty: ClientDifficulty) => {
          set((state) => {
            const session = state.currentSession;
            if (!session || !session.currentCard) return;

            const currentCard = session.currentCard;
            const cardId = currentCard.id;

            // Update card with rating
            currentCard.clientDifficulty = difficulty;
            currentCard.timesStudied += 1;
            currentCard.lastStudied = new Date();

            // Add to studied cards if not already there
            if (!session.studiedCards.includes(cardId)) {
              session.studiedCards.push(cardId);
            }

            // If rated as easy, mark as completed
            if (difficulty === 'easy') {
              currentCard.needsReview = false;
              if (!session.completedCards.includes(cardId)) {
                session.completedCards.push(cardId);
              }
            } else {
              // If rated as hard, mark for review
              currentCard.needsReview = true;
            }

            // Always auto advance after rating (no need for preference)
            get().nextCard();
          });
        },

        nextCard: () => {
          set((state) => {
            const session = state.currentSession;
            if (!session) return;

            // Hide answer for next card
            session.showAnswer = false;

            // Get all cards that still need review (from original deck)
            const allCards = session.cards; // This should be all original cards
            const cardsNeedingReview = allCards.filter(card => card.needsReview);
            
            // If no cards need review, session is complete
            if (cardsNeedingReview.length === 0) {
              session.isComplete = true;
              session.isActive = false;
              session.endTime = new Date();
              return;
            }

            // Find next card that needs review
            let nextCardIndex = -1;
            for (let i = session.currentCardIndex + 1; i < allCards.length; i++) {
              if (allCards[i].needsReview) {
                nextCardIndex = i;
                break;
              }
            }

            // If no next card found, start from beginning
            if (nextCardIndex === -1) {
              for (let i = 0; i <= session.currentCardIndex; i++) {
                if (allCards[i].needsReview) {
                  nextCardIndex = i;
                  break;
                }
              }
            }

            // Set next card
            if (nextCardIndex !== -1) {
              session.currentCardIndex = nextCardIndex;
              session.currentCard = allCards[nextCardIndex];
            } else {
              // This shouldn't happen, but just in case
              session.isComplete = true;
              session.isActive = false;
              session.endTime = new Date();
            }
          });
        },

        previousCard: () => {
          set((state) => {
            const session = state.currentSession;
            if (!session || session.currentCardIndex <= 0) return;

            session.currentCardIndex -= 1;
            session.currentCard = session.cards[session.currentCardIndex];
            session.showAnswer = false;
          });
        },

        resetSession: () => {
          set((state) => {
            state.currentSession = null;
            state.error = null;
          });
        },

        updatePreferences: (newPreferences: Partial<ClientStudyPreferences>) => {
          set((state) => {
            state.preferences = { ...state.preferences, ...newPreferences };
          });
        },

        // Getters
        getSessionStats: () => {
          const session = get().currentSession;
          if (!session) return null;

          const now = new Date();
          const studyTime = session.endTime 
            ? (session.endTime.getTime() - session.startTime.getTime()) / (1000 * 60)
            : (now.getTime() - session.startTime.getTime()) / (1000 * 60);

          const totalCards = session.totalCards;
          const studiedCards = session.studiedCards.length;
          const easyCards = session.completedCards.length;
          const hardCards = studiedCards - easyCards;

          return {
            totalCards,
            studiedCards,
            easyCards,
            hardCards,
            completionRate: totalCards > 0 ? (easyCards / totalCards) * 100 : 0,
            studyTime: Math.max(studyTime, 0),
            averageTimePerCard: studiedCards > 0 ? (studyTime * 60) / studiedCards : 0
          };
        },

        hasCardsToReview: () => {
          const session = get().currentSession;
          if (!session) return false;
          return session.cards.some(card => card.needsReview);
        },

        canGoNext: () => {
          const session = get().currentSession;
          if (!session || session.isComplete) return false;
          
          // Can go next if we've shown the answer or if we're not at the last card
          return session.showAnswer || session.currentCardIndex < session.cards.length - 1;
        },

        canGoPrevious: () => {
          const session = get().currentSession;
          if (!session || session.isComplete) return false;
          return session.currentCardIndex > 0;
        }
      })),
      {
        name: 'client-study-store',
        partialize: (state) => ({
          preferences: state.preferences
        })
      }
    ),
    { name: 'ClientStudyStore' }
  )
);

// Selector hooks for better performance
export const useClientStudySession = () => useClientStudyStore(state => state.currentSession);
export const useClientStudyPreferences = () => useClientStudyStore(state => state.preferences);
export const useClientStudyStats = () => useClientStudyStore(state => state.getSessionStats());
