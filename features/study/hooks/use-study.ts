import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { StudyApi } from '../services/study-api';
import { useStudyStore } from '../stores/study-store';
import type { 
  DueCardsQueryParams,
  NewCardsQueryParams,
  LearningCardsQueryParams,
  PracticeCard
} from '../types/practice-session';
import type { UseStudyReturn } from '../types/study-state';

// Query keys for study-related data
export const STUDY_QUERY_KEYS = {
  all: ['study'] as const,
  statistics: () => [...STUDY_QUERY_KEYS.all, 'statistics'] as const,
  srsMetrics: () => [...STUDY_QUERY_KEYS.all, 'srs-metrics'] as const,
  learningProgress: () => [...STUDY_QUERY_KEYS.all, 'learning-progress'] as const,
  reviewSchedule: () => [...STUDY_QUERY_KEYS.all, 'review-schedule'] as const,
  cards: () => [...STUDY_QUERY_KEYS.all, 'cards'] as const,
  dueCards: (params?: DueCardsQueryParams) => [...STUDY_QUERY_KEYS.cards(), 'due', params] as const,
  newCards: (params?: NewCardsQueryParams) => [...STUDY_QUERY_KEYS.cards(), 'new', params] as const,
  learningCards: (params?: LearningCardsQueryParams) => [...STUDY_QUERY_KEYS.cards(), 'learning', params] as const,
  deckStats: (deckId: number) => [...STUDY_QUERY_KEYS.all, 'deck-stats', deckId] as const,
};

/**
 * Main study hook that provides all study functionality
 */
export function useStudy(): UseStudyReturn {
  const queryClient = useQueryClient();
  const store = useStudyStore();

  return {
    ...store,
    
    // Enhanced actions that include query invalidation
    startSession: async (request) => {
      const result = await store.startSession(request);
      queryClient.invalidateQueries({ queryKey: STUDY_QUERY_KEYS.statistics() });
      return result;
    },

    completeSession: async (sessionId) => {
      const result = await store.completeSession(sessionId);
      queryClient.invalidateQueries({ queryKey: STUDY_QUERY_KEYS.statistics() });
      queryClient.invalidateQueries({ queryKey: STUDY_QUERY_KEYS.learningProgress() });
      return result;
    },

    submitReview: async (cardId, grade, responseTime) => {
      const result = await store.submitReview(cardId, grade, responseTime);
      queryClient.invalidateQueries({ queryKey: STUDY_QUERY_KEYS.dueCards() });
      queryClient.invalidateQueries({ queryKey: STUDY_QUERY_KEYS.statistics() });
      return result;
    },

    getDueCards: async (params) => {
      await store.getDueCards(params);
      queryClient.setQueryData(STUDY_QUERY_KEYS.dueCards(params), store.dueCards);
    },

    getNewCards: async (params) => {
      await store.getNewCards(params);
      queryClient.setQueryData(STUDY_QUERY_KEYS.newCards(params), store.newCards);
    },

    getLearningCards: async (params) => {
      await store.getLearningCards(params);
      queryClient.setQueryData(STUDY_QUERY_KEYS.learningCards(params), store.learningCards);
    },
  };
}

/**
 * Hook for due cards with pagination
 */
export function useDueCards(params: DueCardsQueryParams = {}) {
  const { getDueCards, dueCards, dueCardsPagination, isLoading } = useStudyStore();

  const query = useQuery({
    queryKey: STUDY_QUERY_KEYS.dueCards(params),
    queryFn: async () => {
      await getDueCards(params);
      return { cards: dueCards, pagination: dueCardsPagination };
    },
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false
  });

  return {
    ...query,
    dueCards,
    pagination: dueCardsPagination,
    isLoading: isLoading || query.isLoading
  };
}

/**
 * Hook for new cards with pagination
 */
export function useNewCards(params: NewCardsQueryParams = {}) {
  const { getNewCards, newCards, isLoading } = useStudyStore();

  const query = useQuery({
    queryKey: STUDY_QUERY_KEYS.newCards(params),
    queryFn: async () => {
      await getNewCards(params);
      return newCards;
    },
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false
  });

  return {
    ...query,
    newCards,
    isLoading: isLoading || query.isLoading
  };
}

/**
 * Hook for learning cards (failed cards being relearned)
 */
export function useLearningCards(params: LearningCardsQueryParams = {}) {
  const { getLearningCards, learningCards, isLoading } = useStudyStore();

  const query = useQuery({
    queryKey: STUDY_QUERY_KEYS.learningCards(params),
    queryFn: async () => {
      await getLearningCards(params);
      return learningCards;
    },
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false
  });

  return {
    ...query,
    learningCards,
    isLoading: isLoading || query.isLoading
  };
}

/**
 * Hook for study statistics
 */
export function useStudyStatistics() {
  const { getStudyStatistics, statistics } = useStudyStore();

  return useQuery({
    queryKey: STUDY_QUERY_KEYS.statistics(),
    queryFn: getStudyStatistics,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    initialData: statistics
  });
}

/**
 * Hook for SRS metrics
 */
export function useSRSMetrics() {
  const { getSRSMetrics, srsMetrics } = useStudyStore();

  return useQuery({
    queryKey: STUDY_QUERY_KEYS.srsMetrics(),
    queryFn: getSRSMetrics,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    initialData: srsMetrics
  });
}

/**
 * Hook for learning progress across decks
 */
export function useLearningProgress() {
  const { getLearningProgress, learningProgress } = useStudyStore();

  return useQuery({
    queryKey: STUDY_QUERY_KEYS.learningProgress(),
    queryFn: getLearningProgress,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    initialData: learningProgress
  });
}

/**
 * Hook for review schedule overview
 */
export function useReviewSchedule() {
  const { getReviewSchedule, reviewSchedule } = useStudyStore();

  return useQuery({
    queryKey: STUDY_QUERY_KEYS.reviewSchedule(),
    queryFn: getReviewSchedule,
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    initialData: reviewSchedule
  });
}

/**
 * Hook for deck-specific statistics
 */
export function useDeckStatistics(deckId: number) {
  const { getDeckStatistics } = useStudyStore();

  return useQuery({
    queryKey: STUDY_QUERY_KEYS.deckStats(deckId),
    queryFn: () => getDeckStatistics(deckId),
    staleTime: 300000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!deckId
  });
}

/**
 * Mutation hook for updating study preferences
 */
export function useUpdateStudyPreferences() {
  const { updatePreferences } = useStudyStore();

  return useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      toast.success('Study preferences updated');
    },
    onError: (error: any) => {
      toast.error('Failed to update preferences');
      console.error('Preferences update error:', error);
    }
  });
}

/**
 * Hook for getting next available card to study
 */
export function useNextCard(deckId?: number) {
  const { getNextCard, currentCard } = useStudyStore();

  return useQuery({
    queryKey: [...STUDY_QUERY_KEYS.cards(), 'next', deckId],
    queryFn: () => getNextCard(deckId),
    staleTime: 10000, // 10 seconds
    refetchOnWindowFocus: false,
    initialData: currentCard,
    enabled: false // Only fetch when explicitly triggered
  });
}

/**
 * Helper hook for refreshing all study data
 */
export function useRefreshStudyData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await queryClient.invalidateQueries({ queryKey: STUDY_QUERY_KEYS.all });
    },
    onSuccess: () => {
      toast.success('Study data refreshed');
    },
    onError: () => {
      toast.error('Failed to refresh study data');
    }
  });
}

