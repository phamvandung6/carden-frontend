import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { StudyApi } from '../services/study-api';
import { useStudyStore } from '../stores/study-store';
import type { 
  StartPracticeSessionRequest,
  Grade,
  StudyMode,
  PracticeCard,
  SessionSummary,
  DueCardsCount
} from '../types/practice-session';
import type { UseSRSReturn } from '../types/study-state';

// Query keys for React Query
export const SRS_QUERY_KEYS = {
  all: ['srs'] as const,
  sessions: () => [...SRS_QUERY_KEYS.all, 'sessions'] as const,
  currentSession: () => [...SRS_QUERY_KEYS.sessions(), 'current'] as const,
  cards: () => [...SRS_QUERY_KEYS.all, 'cards'] as const,
  dueCards: (deckId?: number) => [...SRS_QUERY_KEYS.cards(), 'due', deckId] as const,
  newCards: (deckId?: number) => [...SRS_QUERY_KEYS.cards(), 'new', deckId] as const,
  learningCards: (deckId?: number) => [...SRS_QUERY_KEYS.cards(), 'learning', deckId] as const,
  nextCard: (deckId?: number) => [...SRS_QUERY_KEYS.cards(), 'next', deckId] as const,
  dueCount: (deckId?: number) => [...SRS_QUERY_KEYS.all, 'due-count', deckId] as const,
};

/**
 * Hook for SRS practice session management
 */
export function useSRS(): UseSRSReturn {
  const queryClient = useQueryClient();
  const {
    currentSession,
    currentCard,
    dueCardsCount,
    error,
    isLoading,
    startSession,
    completeSession,
    getNextCard,
    submitReview,
    getDueCardsCount,
    setError,
    setLoading,
    setCurrentCard
  } = useStudyStore();

  // Start study session mutation
  const startSessionMutation = useMutation({
    mutationFn: async ({ mode, deckId }: { mode: StudyMode; deckId?: number }) => {
      const request: StartPracticeSessionRequest = {
        studyMode: mode,
        deckId: deckId || null,
        maxNewCards: 20,
        maxReviewCards: 200,
        includeNewCards: true,
        includeReviewCards: true,
        includeLearningCards: true
      };
      
      return await startSession(request);
    },
    onSuccess: (session) => {
      toast.success(`Study session started with ${session.studyMode} mode`);
      // Invalidate current session query
      queryClient.invalidateQueries({ queryKey: SRS_QUERY_KEYS.currentSession() });
      // Get first card
      getNextCardMutation.mutate(session.deckId || undefined);
    },
    onError: (error: any) => {
      toast.error('Failed to start study session');
      setError({
        code: 'NETWORK_ERROR',
        message: 'Failed to start study session',
        details: error
      });
    }
  });

  // Get next card mutation
  const getNextCardMutation = useMutation({
    mutationFn: async (deckId?: number) => {
      setLoading(true);
      const card = await getNextCard(deckId);
      setLoading(false);
      return card;
    },
    onSuccess: (card) => {
      if (!card) {
        toast.success('No more cards to study!');
      }
    },
    onError: (error: any) => {
      toast.error('Failed to get next card');
      setError({
        code: 'CARD_NOT_FOUND',
        message: 'Failed to get next card',
        details: error
      });
      setLoading(false);
    }
  });

  // Submit card review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async ({ grade, responseTime }: { grade: Grade; responseTime?: number }) => {
      if (!currentCard) {
        throw new Error('No current card to review');
      }
      
      return await submitReview(currentCard.cardId, grade, responseTime);
    },
    onSuccess: (result) => {
      // Show feedback to user
      if (result.feedback) {
        if (result.isCorrect) {
          toast.success(result.feedback);
        } else {
          toast.error(result.feedback);
        }
      }
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: SRS_QUERY_KEYS.dueCount() });
      queryClient.invalidateQueries({ queryKey: SRS_QUERY_KEYS.dueCards() });
      
      // Force refetch due cards count immediately after each review
      queryClient.refetchQueries({ queryKey: SRS_QUERY_KEYS.dueCount() });
    },
    onError: (error: any) => {
      toast.error('Failed to submit review');
      setError({
        code: 'NETWORK_ERROR',
        message: 'Failed to submit review',
        details: error
      });
    }
  });

  // Complete session mutation
  const completeSessionMutation = useMutation({
    mutationFn: async () => {
      if (!currentSession.currentSession) {
        throw new Error('No active session to complete');
      }
      
      return await completeSession(currentSession.currentSession.sessionId);
    },
    onSuccess: (summary) => {
      toast.success(`Session completed! Studied ${summary.totalCards} cards with ${summary.finalAccuracy}% accuracy`);
      
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: SRS_QUERY_KEYS.sessions() });
      queryClient.invalidateQueries({ queryKey: SRS_QUERY_KEYS.dueCount() });
      queryClient.invalidateQueries({ queryKey: SRS_QUERY_KEYS.dueCards() });
      
      // Force refetch due cards count immediately
      queryClient.refetchQueries({ queryKey: SRS_QUERY_KEYS.dueCount() });
      
      return summary;
    },
    onError: (error: any) => {
      toast.error('Failed to complete session');
      setError({
        code: 'NETWORK_ERROR',
        message: 'Failed to complete session',
        details: error
      });
    }
  });

  // Query for due cards count
  const { data: dueCountData } = useQuery({
    queryKey: SRS_QUERY_KEYS.dueCount(),
    queryFn: () => StudyApi.getDueCardsCount(),
    staleTime: 5000, // 5 seconds - more responsive
    refetchOnWindowFocus: true, // Refetch when user comes back to tab
    refetchInterval: 10000, // Auto-refetch every 10 seconds for SRS updates
    refetchIntervalInBackground: false // Only when tab is active
  });

  // Update store when due count data changes
  useEffect(() => {
    if (dueCountData?.data) {
      useStudyStore.setState({ dueCardsCount: dueCountData.data });
    }
  }, [dueCountData]);

  return {
    // State
    currentSession,
    currentCard,
    sessionProgress: currentSession.sessionProgress,
    dueCardsCount: dueCardsCount || dueCountData?.data || null,
    nextCard: currentCard,
    isLoading: isLoading || startSessionMutation.isPending || getNextCardMutation.isPending || submitReviewMutation.isPending,
    error,

    // Actions
    startStudySession: async (mode: StudyMode, deckId?: number) => {
      await startSessionMutation.mutateAsync({ mode, deckId });
    },
    
    getNextCard: async (deckId?: number) => {
      await getNextCardMutation.mutateAsync(deckId);
    },
    
    submitCardReview: async (grade: Grade, responseTime?: number) => {
      await submitReviewMutation.mutateAsync({ grade, responseTime });
    },
    
    completeStudySession: async (): Promise<SessionSummary | null> => {
      try {
        return await completeSessionMutation.mutateAsync();
      } catch (error) {
        return null;
      }
    }
  };
}

/**
 * Hook for getting due cards count
 */
export function useDueCardsCount(deckId?: number) {
  const { getDueCardsCount } = useStudyStore();

  return useQuery({
    queryKey: SRS_QUERY_KEYS.dueCount(deckId),
    queryFn: () => getDueCardsCount(deckId),
    staleTime: 5000, // 5 seconds - more responsive for study state changes
    refetchOnWindowFocus: true, // Refetch when user comes back to tab
    refetchInterval: 10000, // Auto-refetch every 10 seconds to catch SRS timer updates
    refetchIntervalInBackground: false // Only when tab is active
  });
}

/**
 * Hook for getting current practice session
 */
export function useCurrentSession() {
  const { getCurrentSession } = useStudyStore();

  return useQuery({
    queryKey: SRS_QUERY_KEYS.currentSession(),
    queryFn: getCurrentSession,
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false
  });
}

/**
 * Hook for starting a practice session with specific configuration
 */
export function useStartSession() {
  const queryClient = useQueryClient();
  const { startSession } = useStudyStore();

  return useMutation({
    mutationFn: startSession,
    onSuccess: (session) => {
      toast.success(`Practice session started with ${session.studyMode} mode`);
      // Invalidate current session and due count
      queryClient.invalidateQueries({ queryKey: SRS_QUERY_KEYS.currentSession() });
      queryClient.invalidateQueries({ queryKey: SRS_QUERY_KEYS.dueCount() });
      
      // Force refetch due cards count
      queryClient.refetchQueries({ queryKey: SRS_QUERY_KEYS.dueCount() });
    },
    onError: (error: any) => {
      toast.error('Failed to start practice session');
      console.error('Session start error:', error);
    }
  });
}

/**
 * Hook for submitting card reviews
 */
export function useSubmitReview() {
  const queryClient = useQueryClient();
  const { submitReview } = useStudyStore();

  return useMutation({
    mutationFn: ({ cardId, grade, responseTime }: { cardId: number; grade: Grade; responseTime?: number }) =>
      submitReview(cardId, grade, responseTime),
    onSuccess: (result) => {
      // Show feedback
      if (result.feedback) {
        if (result.isCorrect) {
          toast.success(result.feedback);
        } else {
          toast.error(result.feedback);
        }
      }
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: SRS_QUERY_KEYS.dueCount() });
      queryClient.invalidateQueries({ queryKey: SRS_QUERY_KEYS.dueCards() });
      
      // Force refetch due cards count
      queryClient.refetchQueries({ queryKey: SRS_QUERY_KEYS.dueCount() });
    },
    onError: (error: any) => {
      toast.error('Failed to submit review');
      console.error('Review submission error:', error);
    }
  });
}



