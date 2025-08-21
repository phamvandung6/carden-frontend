'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useClientStudyStore } from '../stores/client-study-store';
import type { ClientDifficulty, ClientStudyStats, ClientStudySession, ClientStudyPreferences } from '../types';

export interface UseClientStudyReturn {
  // State
  currentSession: ClientStudySession | null;
  isLoading: boolean;
  error: string | null;
  
  // Session actions
  startStudySession: (deckId: number, deckTitle: string, cards?: any[]) => Promise<void>;
  endStudySession: () => ClientStudyStats | null;
  resetSession: () => void;
  
  // Card actions
  showAnswer: () => void;
  rateCard: (difficulty: ClientDifficulty) => void;
  
  // Preferences
  preferences: ClientStudyPreferences;
  updatePreferences: (preferences: Partial<ClientStudyPreferences>) => void;
  
  // Getters
  sessionStats: ClientStudyStats | null;
}

export function useClientStudy(): UseClientStudyReturn {
  const router = useRouter();
  
  // Store state and actions
  const {
    currentSession,
    preferences,
    isLoading,
    error,
    startStudySession: storeStartSession,
    endStudySession: storeEndSession,
    showAnswer: storeShowAnswer,
    rateCard: storeRateCard,
    resetSession: storeResetSession,
    updatePreferences: storeUpdatePreferences,
    getSessionStats
  } = useClientStudyStore();

  // Get session stats
  const sessionStats = getSessionStats();

  // Unified start study session method
  const startStudySession = useCallback(async (deckId: number, deckTitle: string, cards?: any[]) => {
    try {
      let cardsToUse = cards;
      
      // If cards not provided, fetch them
      if (!cardsToUse) {
        const { default: CardsApiService } = await import('@/features/flashcards/services/cards-api');
        const cardsResponse = await CardsApiService.getCardsByDeck(deckId, { page: 0, size: 1000 });
        cardsToUse = cardsResponse?.content;
      }
      
      if (!cardsToUse || cardsToUse.length === 0) {
        toast.error('No cards found in this deck');
        return;
      }

      // Start the session with the cards
      storeStartSession(deckId, deckTitle, cardsToUse);
      toast.success(`Started studying "${deckTitle}" with ${cardsToUse.length} cards`);
    } catch (error) {
      console.error('Failed to start study session:', error);
      toast.error('Failed to start study session');
    }
  }, [storeStartSession]);

  // End study session with stats display
  const endStudySession = useCallback(() => {
    const stats = storeEndSession();
    
    if (stats) {
      // Show completion toast with stats
      const completionRate = Math.round(stats.completionRate);
      const studyTime = Math.round(stats.studyTime * 10) / 10; // Round to 1 decimal
      
      toast.success('Study session completed!', {
        description: `${stats.easyCards}/${stats.totalCards} cards mastered (${completionRate}%) in ${studyTime} minutes`,
        duration: 6000
      });
    }
    
    return stats;
  }, [storeEndSession]);

  // Rate card with feedback
  const rateCard = useCallback((difficulty: ClientDifficulty) => {
    const wasActive = currentSession?.isActive;
    
    storeRateCard(difficulty);
    
    // Show subtle feedback
    if (difficulty === 'easy') {
      toast.success('Card mastered! ✅', { duration: 1500 });
    } else {
      toast.info('Card needs more practice 📚', { duration: 1500 });
    }

    // Check if session just completed after rating
    setTimeout(() => {
      const newSession = useClientStudyStore.getState().currentSession;
      
      if (wasActive && newSession?.isComplete) {
        const stats = getSessionStats();
        if (stats) {
          toast.success('🎉 All cards completed!', {
            description: `You've mastered all ${stats.easyCards} cards in this deck!`,
            duration: 5000
          });
        }
      }
    }, 100);
  }, [currentSession?.isActive, storeRateCard, getSessionStats]);

  // Reset session with navigation
  const resetSession = useCallback(() => {
    storeResetSession();
    router.push('/study');
  }, [storeResetSession, router]);

  return {
    // State
    currentSession,
    isLoading,
    error,
    
    // Session actions
    startStudySession,
    endStudySession,
    resetSession,
    
    // Card actions
    showAnswer: storeShowAnswer,
    rateCard,
    
    // Preferences
    preferences,
    updatePreferences: storeUpdatePreferences,
    
    // Getters
    sessionStats
  };
}

// Convenience hook for just checking if a study session is active
export function useClientStudyStatus() {
  const currentSession = useClientStudyStore(state => state.currentSession);
  
  return {
    isActive: currentSession?.isActive || false,
    isComplete: currentSession?.isComplete || false,
    deckId: currentSession?.deckId,
    deckTitle: currentSession?.deckTitle,
    progress: currentSession ? {
      current: currentSession.currentCardIndex + 1,
      total: currentSession.totalCards,
      completed: currentSession.completedCards.length
    } : null
  };
}
