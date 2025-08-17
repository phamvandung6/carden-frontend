import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CardsApiService } from '../services/cards-api';
import { useCardsStore } from '../stores/cards-store';
import type { 
  Card,
  CardCreateRequest, 
  CardUpdateRequest, 
  CardQueryParams, 
  BulkCardCreateRequest,
  DuplicateCheckRequest
} from '../types';

// Query keys
export const CARD_QUERY_KEYS = {
  all: ['cards'] as const,
  lists: () => [...CARD_QUERY_KEYS.all, 'list'] as const,
  byDeck: (deckId: number) => [...CARD_QUERY_KEYS.all, 'deck', deckId] as const,
  byDeckWithParams: (deckId: number, params: CardQueryParams) => 
    [...CARD_QUERY_KEYS.byDeck(deckId), params] as const,
  detail: (id: number) => [...CARD_QUERY_KEYS.all, 'detail', id] as const,
  count: (deckId: number) => [...CARD_QUERY_KEYS.all, 'count', deckId] as const,
  search: (query: string, params: CardQueryParams) => 
    [...CARD_QUERY_KEYS.all, 'search', query, params] as const,
};

// Hook for getting cards by deck
export function useCardsByDeck(deckId: number, params: CardQueryParams = {}) {
  const { batchUpdateListState, setCurrentDeckId } = useCardsStore();

  return useQuery({
    queryKey: CARD_QUERY_KEYS.byDeckWithParams(deckId, params),
    queryFn: async () => {
      try {
        // Start loading state
        batchUpdateListState({ loading: true, error: null });
        setCurrentDeckId(deckId);
        
        const response = await CardsApiService.getCardsByDeck(deckId, params);
        
        const { content, page } = response;
        
        // Batch update - Single re-render
        batchUpdateListState({
          cards: content,
          currentPage: page.number,
          totalPages: page.totalPages,
          totalItems: page.totalElements,
          loading: false,
          error: null
        });
        
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch cards';
        
        // Batch error state
        batchUpdateListState({ loading: false, error: errorMessage });
        throw error;
      }
    },
    enabled: !!deckId && deckId > 0,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}

// Hook for getting a single card by ID
export function useCardById(cardId: number) {
  const { setCurrentCard } = useCardsStore();

  return useQuery({
    queryKey: CARD_QUERY_KEYS.detail(cardId),
    queryFn: async () => {
      const card = await CardsApiService.getCardById(cardId);
      setCurrentCard(card);
      return card;
    },
    enabled: !!cardId && cardId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for creating cards
export function useCreateCard(deckId?: number) {
  const queryClient = useQueryClient();
  const { addCard, currentDeckId } = useCardsStore();
  const targetDeckId = deckId || currentDeckId;

  return useMutation({
    mutationFn: (data: CardCreateRequest) => {
      if (!targetDeckId) {
        throw new Error('Deck ID is required to create card');
      }
      return CardsApiService.createCard(targetDeckId, data);
    },
    onSuccess: (card) => {
      addCard(card);
      toast.success('Card created successfully!');
      
      // Invalidate related queries
      if (targetDeckId) {
        queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.byDeck(targetDeckId) });
        queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.count(targetDeckId) });
      }
      
      // Refetch to ensure fresh data
      if (targetDeckId) {
        queryClient.refetchQueries({ queryKey: CARD_QUERY_KEYS.byDeck(targetDeckId) });
      }
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to create card';
      toast.error(message);
    },
  });
}

// Hook for updating cards
export function useUpdateCard(options?: { silent?: boolean }) {
  const queryClient = useQueryClient();
  const { updateCard, currentDeckId } = useCardsStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CardUpdateRequest }) => 
      CardsApiService.updateCard(id, data),
    onSuccess: (card, variables) => {
      updateCard(card);
      
      // Only show toast if not silent
      if (!options?.silent) {
        toast.success('Card updated successfully!');
      }
      
      // Invalidate specific queries
      queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.detail(variables.id) });
      if (currentDeckId) {
        queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.byDeck(currentDeckId) });
      }
      
      // Force refetch for updated data
      if (currentDeckId) {
        queryClient.refetchQueries({ queryKey: CARD_QUERY_KEYS.byDeck(currentDeckId) });
      }
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to update card';
      toast.error(message);
    },
  });
}

// Hook for deleting cards
export function useDeleteCard() {
  const queryClient = useQueryClient();
  const { removeCard, currentDeckId } = useCardsStore();

  return useMutation({
    mutationFn: (id: number) => CardsApiService.deleteCard(id),
    onSuccess: (_, cardId) => {
      removeCard(cardId);
      toast.success('Card deleted successfully!');
      
      // Invalidate queries
      if (currentDeckId) {
        queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.byDeck(currentDeckId) });
        queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.count(currentDeckId) });
      }
      queryClient.removeQueries({ queryKey: CARD_QUERY_KEYS.detail(cardId) });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to delete card';
      toast.error(message);
    },
  });
}

// Hook for bulk creating cards
export function useBulkCreateCards(deckId?: number) {
  const queryClient = useQueryClient();
  const { batchUpdateListState, currentDeckId } = useCardsStore();
  const targetDeckId = deckId || currentDeckId;

  return useMutation({
    mutationFn: (data: BulkCardCreateRequest) => {
      if (!targetDeckId) {
        throw new Error('Deck ID is required to create cards');
      }
      return CardsApiService.bulkCreateCards(targetDeckId, data);
    },
    onSuccess: (cards) => {
      // Add all new cards to store
      batchUpdateListState({
        cards: [...cards, ...useCardsStore.getState().listState.cards],
        totalItems: useCardsStore.getState().listState.totalItems + cards.length
      });
      
      toast.success(`${cards.length} cards created successfully!`);
      
      // Invalidate related queries
      if (targetDeckId) {
        queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.byDeck(targetDeckId) });
        queryClient.invalidateQueries({ queryKey: CARD_QUERY_KEYS.count(targetDeckId) });
      }
      
      // Refetch to ensure fresh data
      if (targetDeckId) {
        queryClient.refetchQueries({ queryKey: CARD_QUERY_KEYS.byDeck(targetDeckId) });
      }
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to create cards';
      toast.error(message);
    },
  });
}

// Hook for getting card count
export function useCardCount(deckId: number) {
  return useQuery({
    queryKey: CARD_QUERY_KEYS.count(deckId),
    queryFn: () => CardsApiService.getCardCount(deckId),
    enabled: !!deckId && deckId > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for checking duplicates
export function useCheckDuplicate(cardId?: number) {
  return useMutation({
    mutationFn: (data: DuplicateCheckRequest) => {
      if (!cardId) {
        throw new Error('Card ID is required to check duplicates');
      }
      return CardsApiService.checkDuplicate(cardId, data);
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to check for duplicates';
      toast.error(message);
    },
  });
}

// Hook for uploading card images
export function useUploadCardImage(cardId?: number) {
  const { setImageUploadState, resetImageUpload } = useCardsStore();

  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      if (!cardId) {
        throw new Error('Card ID is required to upload image');
      }
      
      setImageUploadState({ uploading: true, error: null, progress: 0 });
      
      return CardsApiService.uploadImage(cardId, file, (progress) => {
        setImageUploadState({ progress });
      });
    },
    onSuccess: (publicUrl) => {
      setImageUploadState({ 
        uploading: false, 
        progress: 100,
        previewUrl: publicUrl 
      });
      toast.success('Image uploaded successfully!');
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to upload image';
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

// Hook for searching cards (global search when implemented)
export function useSearchCards(query: string, params: CardQueryParams = {}) {
  const { batchUpdateListState } = useCardsStore();

  return useQuery({
    queryKey: CARD_QUERY_KEYS.search(query, params),
    queryFn: async () => {
      try {
        batchUpdateListState({ loading: true, error: null });
        
        const response = await CardsApiService.searchCards(query, params);
        
        const { content, page } = response;
        
        batchUpdateListState({
          cards: content,
          currentPage: page.number,
          totalPages: page.totalPages,
          totalItems: page.totalElements,
          loading: false,
          error: null
        });
        
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to search cards';
        batchUpdateListState({ loading: false, error: errorMessage });
        throw error;
      }
    },
    enabled: !!query && query.trim().length > 0,
    staleTime: 30 * 1000,
  });
}

// Convenience hook for common card operations
export function useCardOperations(deckId?: number, cardId?: number) {
  const createCard = useCreateCard(deckId);
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();
  const bulkCreateCards = useBulkCreateCards(deckId);
  const uploadImage = useUploadCardImage(cardId);
  const checkDuplicate = useCheckDuplicate(cardId);

  return {
    createCard,
    updateCard,
    deleteCard,
    bulkCreateCards,
    uploadImage,
    checkDuplicate,
    isLoading: 
      createCard.isPending || 
      updateCard.isPending || 
      deleteCard.isPending ||
      bulkCreateCards.isPending ||
      uploadImage.isPending ||
      checkDuplicate.isPending,
  };
}

// Hook for managing card form state
export function useCardForm() {
  const { 
    formState, 
    setFormState, 
    resetFormState,
    editorMode,
    setEditorMode,
    showPreview,
    setShowPreview 
  } = useCardsStore();

  const updateFormField = (field: keyof typeof formState, value: any) => {
    setFormState({ [field]: value });
  };

  const addToArrayField = (field: 'examples' | 'synonyms' | 'antonyms' | 'tags', value: string) => {
    if (value.trim() && !formState[field].includes(value.trim())) {
      setFormState({
        [field]: [...formState[field], value.trim()]
      });
    }
  };

  const removeFromArrayField = (field: 'examples' | 'synonyms' | 'antonyms' | 'tags', index: number) => {
    setFormState({
      [field]: formState[field].filter((_, i) => i !== index)
    });
  };

  const populateFormFromCard = (card: Card) => {
    setFormState({
      front: card.front,
      back: card.back,
      ipaPronunciation: card.ipaPronunciation || '',
      imageUrl: card.imageUrl || '',
      audioUrl: card.audioUrl || '',
      examples: card.examples || [],
      synonyms: card.synonyms || [],
      antonyms: card.antonyms || [],
      tags: card.tags || [],
      difficulty: card.difficulty,
      displayOrder: card.displayOrder
    });
  };

  return {
    formState,
    setFormState,
    resetFormState,
    updateFormField,
    addToArrayField,
    removeFromArrayField,
    populateFormFromCard,
    editorMode,
    setEditorMode,
    showPreview,
    setShowPreview,
  };
}
