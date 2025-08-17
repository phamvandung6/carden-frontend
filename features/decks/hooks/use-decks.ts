import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { DecksApi } from '../services/decks-api';
import { useDecksStore } from '../stores/decks-store';
import type { 
  CreateDeckRequest, 
  UpdateDeckRequest, 
  DeckSearchParams, 
  Deck 
} from '../types';

// Query keys
export const DECK_QUERY_KEYS = {
  all: ['decks'] as const,
  lists: () => [...DECK_QUERY_KEYS.all, 'list'] as const,
  list: (params: DeckSearchParams) => [...DECK_QUERY_KEYS.lists(), params] as const,
  myDecks: () => [...DECK_QUERY_KEYS.all, 'my'] as const,
  myDecksList: (params: DeckSearchParams) => [...DECK_QUERY_KEYS.myDecks(), params] as const,
  detail: (id: number) => [...DECK_QUERY_KEYS.all, 'detail', id] as const,
};

// Hook for searching public decks
export function usePublicDecks(params: DeckSearchParams = {}) {
  const { batchUpdateListState } = useDecksStore();

  return useQuery({
    queryKey: DECK_QUERY_KEYS.list(params),
    queryFn: async () => {
      try {
        // Start loading state
        batchUpdateListState({ loading: true, error: null });
        
        const response = await DecksApi.searchPublicDecks(params);
        
        if (response.success && response.data) {
          const { content, totalElements, totalPages, number } = response.data;
          
          // Transform DeckCardData[] to Deck[] (extract deck info)
          const decks: Deck[] = content
            .filter(card => card.deckId) // Filter out cards without deckId
            .map(card => ({
            id: card.deckId,
            title: card.deckTitle,
            description: '', // Not available in search response
            userId: 0, // Not available in search response
            topicId: null,
            visibility: 'PUBLIC' as const,
            cefrLevel: null,
            sourceLanguage: '',
            targetLanguage: '',
            coverImageUrl: card.frontImageUrl || null,
            tags: [],
            systemDeck: false,
            downloadCount: 0,
            likeCount: 0,
            cardCount: 1, // At least this card
            createdAt: '',
            updatedAt: ''
          }));

          // Remove duplicates based on deckId
          const uniqueDecks = decks.filter((deck, index, self) => 
            index === self.findIndex(d => d.id === deck.id)
          );

          // BATCH UPDATE - Single re-render instead of 3 separate ones!
          batchUpdateListState({
            decks: uniqueDecks,
            currentPage: number,
            totalPages,
            totalItems: totalElements,
            loading: false,
            error: null
          });
          
          return response.data;
        }
        
        throw new Error(response.message || 'Failed to fetch decks');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch decks';
        
        // Batch error state
        batchUpdateListState({ loading: false, error: errorMessage });
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (public data can be cached longer)
    refetchOnWindowFocus: false, // Public data doesn't change as often
    refetchOnMount: 'always', // Always refetch on component mount
  });
}

// Hook for getting a single deck by ID
export function useDeckById(deckId: number) {
  return useQuery({
    queryKey: DECK_QUERY_KEYS.detail(deckId),
    queryFn: async () => {
      const response = await DecksApi.getDeckById(deckId);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to fetch deck');
    },
    enabled: !!deckId && deckId > 0,
  });
}

// Hook for searching user's decks
export function useMyDecks(params: DeckSearchParams = {}) {
  const { batchUpdateListState } = useDecksStore();

  return useQuery({
    queryKey: DECK_QUERY_KEYS.myDecksList(params),
    queryFn: async () => {
      try {
        // Start loading state
        batchUpdateListState({ loading: true, error: null });
        
        const response = await DecksApi.searchMyDecks(params);
        
        if (response.success && response.data) {
          const { content, totalElements, totalPages, number } = response.data;
          
          // API now returns Deck[] directly, no transformation needed
          const decks: Deck[] = content;

          // BATCH UPDATE - Single re-render instead of 3 separate ones!
          batchUpdateListState({
            decks,
            currentPage: number,
            totalPages,
            totalItems: totalElements,
            loading: false,
            error: null
          });
          
          return response.data;
        }
        
        throw new Error(response.message || 'Failed to fetch your decks');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch your decks';
        
        // Batch error state  
        batchUpdateListState({ loading: false, error: errorMessage });
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 seconds (fresher for user's own data)
    refetchOnWindowFocus: true, // Refetch when user comes back to tab
    refetchOnMount: 'always', // Always refetch on component mount
  });
}

// Hook for getting deck details
export function useDeck(id: number) {
  const { setCurrentDeck } = useDecksStore();

  return useQuery({
    queryKey: DECK_QUERY_KEYS.detail(id),
    queryFn: async () => {
      const response = await DecksApi.getDeckById(id);
      
      if (response.success && response.data) {
        setCurrentDeck(response.data);
        return response.data;
      }
      
      throw new Error(response.message || 'Failed to fetch deck details');
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook for creating decks
export function useCreateDeck() {
  const queryClient = useQueryClient();
  const { addDeck } = useDecksStore();

  return useMutation({
    mutationFn: (data: CreateDeckRequest) => DecksApi.createDeck(data),
    onSuccess: (response) => {
      if (response.success && response.data) {
        addDeck(response.data);
        toast.success('Deck created successfully!');
        
        // Invalidate and refetch queries immediately
        queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.myDecks() });
        queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.lists() });
        
        // Force refetch to ensure fresh data
        queryClient.refetchQueries({ queryKey: DECK_QUERY_KEYS.myDecks() });
      } else {
        throw new Error(response.message || 'Failed to create deck');
      }
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to create deck';
      toast.error(message);
    },
  });
}

// Hook for updating decks
export function useUpdateDeck(options?: { silent?: boolean }) {
  const queryClient = useQueryClient();
  const { updateDeck } = useDecksStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateDeckRequest }) => 
      DecksApi.updateDeck(id, data),
    onSuccess: (response, variables) => {
      if (response.success && response.data) {
        updateDeck(response.data);
        
        // Only show toast if not silent
        if (!options?.silent) {
          toast.success('Deck updated successfully!');
        }
        
        // Invalidate specific queries
        queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.myDecks() });
        queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.lists() });
        
        // Force refetch for updated data
        queryClient.refetchQueries({ queryKey: DECK_QUERY_KEYS.myDecks() });
      } else {
        throw new Error(response.message || 'Failed to update deck');
      }
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to update deck';
      toast.error(message);
    },
  });
}

// Hook for deleting decks
export function useDeleteDeck() {
  const queryClient = useQueryClient();
  const { removeDeck } = useDecksStore();

  return useMutation({
    mutationFn: (id: number) => DecksApi.deleteDeck(id),
    onSuccess: (response, deckId) => {
      if (response.success) {
        removeDeck(deckId);
        toast.success('Deck deleted successfully!');
        
        // Invalidate queries
        queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.myDecks() });
        queryClient.invalidateQueries({ queryKey: DECK_QUERY_KEYS.lists() });
        queryClient.removeQueries({ queryKey: DECK_QUERY_KEYS.detail(deckId) });
      } else {
        throw new Error(response.message || 'Failed to delete deck');
      }
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to delete deck';
      toast.error(message);
    },
  });
}

// Hook for uploading deck thumbnails
export function useUploadThumbnail() {
  const { setImageUploadState, resetImageUpload } = useDecksStore();

  return useMutation({
    mutationFn: async ({ deckId, file }: { deckId: number; file: File }) => {
      setImageUploadState({ uploading: true, error: null, progress: 0 });
      
      return DecksApi.uploadDeckThumbnail(deckId, file, (progress) => {
        setImageUploadState({ progress });
      });
    },
    onSuccess: (publicUrl) => {
      setImageUploadState({ 
        uploading: false, 
        progress: 100,
        previewUrl: publicUrl 
      });
      toast.success('Thumbnail uploaded successfully!');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to upload thumbnail';
      setImageUploadState({ 
        uploading: false, 
        error: message, 
        progress: 0 
      });
      toast.error(message);
    },
    onSettled: () => {
      // Reset upload state after a delay
      setTimeout(() => {
        resetImageUpload();
      }, 3000);
    },
  });
}

// Convenience hook for common deck operations
export function useDeckOperations() {
  const createDeck = useCreateDeck();
  const updateDeck = useUpdateDeck();
  const deleteDeck = useDeleteDeck();
  const uploadThumbnail = useUploadThumbnail();

  return {
    createDeck,
    updateDeck,
    deleteDeck,
    uploadThumbnail,
    isLoading: 
      createDeck.isPending || 
      updateDeck.isPending || 
      deleteDeck.isPending ||
      uploadThumbnail.isPending,
  };
}
