import { useQueryClient } from '@tanstack/react-query';
import { queryKeys, queryInvalidation } from '@/lib/utils/query-keys';

// Custom hook for common query client operations
export function useQueryClientHelpers() {
  const queryClient = useQueryClient();

  return {
    // Invalidate queries by feature
    invalidateAuth: () => {
      return queryClient.invalidateQueries({ 
        queryKey: queryInvalidation.auth() 
      });
    },

    invalidateDecks: (deckId?: string) => {
      return queryClient.invalidateQueries({ 
        queryKey: queryInvalidation.deck(deckId) 
      });
    },

    invalidateCards: (cardId?: string) => {
      return queryClient.invalidateQueries({ 
        queryKey: queryInvalidation.card(cardId) 
      });
    },

    invalidatePractice: (deckId?: string) => {
      return queryClient.invalidateQueries({ 
        queryKey: queryInvalidation.practice(deckId) 
      });
    },

    invalidateStudy: () => {
      return queryClient.invalidateQueries({ 
        queryKey: queryInvalidation.study() 
      });
    },

    invalidateAnalytics: () => {
      return queryClient.invalidateQueries({ 
        queryKey: queryInvalidation.analytics() 
      });
    },

    // Remove queries by feature
    removeAuth: () => {
      return queryClient.removeQueries({ 
        queryKey: queryKeys.auth.all 
      });
    },

    removeDecks: (deckId?: string) => {
      const queryKey = deckId ? queryKeys.decks.detail(deckId) : queryKeys.decks.all;
      return queryClient.removeQueries({ queryKey });
    },

    removeCards: (cardId?: string) => {
      const queryKey = cardId ? queryKeys.cards.detail(cardId) : queryKeys.cards.all;
      return queryClient.removeQueries({ queryKey });
    },

    // Prefetch common queries
    prefetchDeckList: (filters: Record<string, unknown> = {}) => {
      return queryClient.prefetchQuery({
        queryKey: queryKeys.decks.list(filters),
        staleTime: 30 * 1000, // 30 seconds
      });
    },

    prefetchDueCards: (deckId?: string) => {
      return queryClient.prefetchQuery({
        queryKey: queryKeys.practice.dueCards(deckId),
        staleTime: 60 * 1000, // 1 minute
      });
    },

    // Set query data helpers
    setDeckData: (deckId: string, data: unknown) => {
      return queryClient.setQueryData(queryKeys.decks.detail(deckId), data);
    },

    setCardData: (cardId: string, data: unknown) => {
      return queryClient.setQueryData(queryKeys.cards.detail(cardId), data);
    },

    // Get query data helpers
    getDeckData: (deckId: string) => {
      return queryClient.getQueryData(queryKeys.decks.detail(deckId));
    },

    getCardData: (cardId: string) => {
      return queryClient.getQueryData(queryKeys.cards.detail(cardId));
    },

    // Cancel queries
    cancelDeckQueries: () => {
      return queryClient.cancelQueries({ queryKey: queryKeys.decks.all });
    },

    cancelCardQueries: () => {
      return queryClient.cancelQueries({ queryKey: queryKeys.cards.all });
    },

    // Clear all cache
    clearAll: () => {
      return queryClient.clear();
    },

    // Get query client instance for advanced operations
    client: queryClient,
  };
}
