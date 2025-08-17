import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  Card, 
  CardQueryParams, 
  CardsResponse, 
  CardFormState,
  CardDifficulty,
  Tag,
  CardEditorMode 
} from '../types';

// Image upload state
interface ImageUploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  previewUrl: string | null;
}

// Card list state
interface CardListState {
  cards: Card[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  filters: CardQueryParams;
}

// Cards store interface
interface CardsStore {
  // List state
  listState: CardListState;
  
  // Current card being edited
  currentCard: Card | null;
  
  // Form state for creating/editing
  formState: CardFormState;
  
  // Image upload state
  imageUpload: ImageUploadState;
  
  // Editor state
  editorMode: CardEditorMode;
  
  // UI state
  selectedCardIds: Set<number>;
  isCreating: boolean;
  isEditing: boolean;
  showPreview: boolean;
  
  // Tag management
  availableTags: Tag[];
  
  // Current deck context
  currentDeckId: number | null;
  
  // Actions
  setCards: (cards: Card[]) => void;
  addCard: (card: Card) => void;
  updateCard: (card: Card) => void;
  removeCard: (cardId: number) => void;
  
  setCurrentCard: (card: Card | null) => void;
  setCurrentDeckId: (deckId: number | null) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  setFilters: (filters: Partial<CardQueryParams>) => void;
  resetFilters: () => void;
  
  setPagination: (currentPage: number, totalPages: number, totalItems: number) => void;
  
  // Form state management
  setFormState: (formState: Partial<CardFormState>) => void;
  resetFormState: () => void;
  
  // Image upload
  setImageUploadState: (state: Partial<ImageUploadState>) => void;
  resetImageUpload: () => void;
  
  // Editor mode
  setEditorMode: (mode: CardEditorMode) => void;
  
  // Selection
  toggleCardSelection: (cardId: number) => void;
  selectAllCards: (cardIds: number[]) => void;
  clearSelection: () => void;
  
  // Modal states
  setCreating: (isCreating: boolean) => void;
  setEditing: (isEditing: boolean) => void;
  setShowPreview: (showPreview: boolean) => void;
  
  // Tag management
  setAvailableTags: (tags: Tag[]) => void;
  addTag: (tag: Tag) => void;
  
  // Batch operations
  batchUpdateListState: (updates: Partial<CardListState>) => void;
  
  // Reset store
  reset: () => void;
}

// Initial states
const initialListState: CardListState = {
  cards: [],
  loading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,
  filters: {
    page: 0,
    size: 20,
    sort: 'displayOrder,asc'
  }
};

const initialFormState: CardFormState = {
  front: '',
  back: '',
  ipaPronunciation: '',
  imageUrl: '',
  audioUrl: '',
  examples: [],
  synonyms: [],
  antonyms: [],
  tags: [],
  difficulty: 'NORMAL',
  displayOrder: undefined
};

const initialImageUploadState: ImageUploadState = {
  uploading: false,
  progress: 0,
  error: null,
  previewUrl: null
};

export const useCardsStore = create<CardsStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      listState: initialListState,
      currentCard: null,
      formState: initialFormState,
      imageUpload: initialImageUploadState,
      editorMode: 'create',
      selectedCardIds: new Set(),
      isCreating: false,
      isEditing: false,
      showPreview: false,
      availableTags: [],
      currentDeckId: null,

      // Card list actions
      setCards: (cards) =>
        set((state) => ({
          listState: { ...state.listState, cards }
        }), false, 'setCards'),

      addCard: (card) =>
        set((state) => ({
          listState: {
            ...state.listState,
            cards: [card, ...state.listState.cards],
            totalItems: state.listState.totalItems + 1
          }
        }), false, 'addCard'),

      updateCard: (updatedCard) =>
        set((state) => ({
          listState: {
            ...state.listState,
            cards: state.listState.cards.map(card =>
              card.id === updatedCard.id ? updatedCard : card
            )
          },
          currentCard: state.currentCard?.id === updatedCard.id ? updatedCard : state.currentCard
        }), false, 'updateCard'),

      removeCard: (cardId) =>
        set((state) => ({
          listState: {
            ...state.listState,
            cards: state.listState.cards.filter(card => card.id !== cardId),
            totalItems: Math.max(0, state.listState.totalItems - 1)
          },
          currentCard: state.currentCard?.id === cardId ? null : state.currentCard,
          selectedCardIds: new Set([...state.selectedCardIds].filter(id => id !== cardId))
        }), false, 'removeCard'),

      // Current card and deck
      setCurrentCard: (card) =>
        set({ currentCard: card }, false, 'setCurrentCard'),
      
      setCurrentDeckId: (deckId) =>
        set({ currentDeckId: deckId }, false, 'setCurrentDeckId'),

      // Loading and error
      setLoading: (loading) =>
        set((state) => ({
          listState: { ...state.listState, loading }
        }), false, 'setLoading'),

      setError: (error) =>
        set((state) => ({
          listState: { ...state.listState, error }
        }), false, 'setError'),

      // Filters
      setFilters: (newFilters) =>
        set((state) => ({
          listState: {
            ...state.listState,
            filters: { ...state.listState.filters, ...newFilters }
          }
        }), false, 'setFilters'),

      resetFilters: () =>
        set((state) => ({
          listState: {
            ...state.listState,
            filters: initialListState.filters
          }
        }), false, 'resetFilters'),

      // Pagination
      setPagination: (currentPage, totalPages, totalItems) =>
        set((state) => ({
          listState: {
            ...state.listState,
            currentPage,
            totalPages,
            totalItems
          }
        }), false, 'setPagination'),

      // Form state management
      setFormState: (newFormState) =>
        set((state) => ({
          formState: { ...state.formState, ...newFormState }
        }), false, 'setFormState'),

      resetFormState: () =>
        set({ formState: initialFormState }, false, 'resetFormState'),

      // Image upload
      setImageUploadState: (newState) =>
        set((state) => ({
          imageUpload: { ...state.imageUpload, ...newState }
        }), false, 'setImageUploadState'),

      resetImageUpload: () =>
        set({ imageUpload: initialImageUploadState }, false, 'resetImageUpload'),

      // Editor mode
      setEditorMode: (mode) =>
        set({ editorMode: mode }, false, 'setEditorMode'),

      // Selection
      toggleCardSelection: (cardId) =>
        set((state) => {
          const newSelection = new Set(state.selectedCardIds);
          if (newSelection.has(cardId)) {
            newSelection.delete(cardId);
          } else {
            newSelection.add(cardId);
          }
          return { selectedCardIds: newSelection };
        }, false, 'toggleCardSelection'),

      selectAllCards: (cardIds) =>
        set({ selectedCardIds: new Set(cardIds) }, false, 'selectAllCards'),

      clearSelection: () =>
        set({ selectedCardIds: new Set() }, false, 'clearSelection'),

      // Modal states
      setCreating: (isCreating) =>
        set({ isCreating }, false, 'setCreating'),

      setEditing: (isEditing) =>
        set({ isEditing }, false, 'setEditing'),

      setShowPreview: (showPreview) =>
        set({ showPreview }, false, 'setShowPreview'),

      // Tag management
      setAvailableTags: (tags) =>
        set({ availableTags: tags }, false, 'setAvailableTags'),

      addTag: (tag) =>
        set((state) => ({
          availableTags: [...state.availableTags, tag]
        }), false, 'addTag'),

      // Batch operations
      batchUpdateListState: (updates) =>
        set((state) => ({
          listState: { ...state.listState, ...updates }
        }), false, 'batchUpdateListState'),

      // Reset
      reset: () =>
        set({
          listState: initialListState,
          currentCard: null,
          formState: initialFormState,
          imageUpload: initialImageUploadState,
          editorMode: 'create',
          selectedCardIds: new Set(),
          isCreating: false,
          isEditing: false,
          showPreview: false,
          availableTags: [],
          currentDeckId: null
        }, false, 'reset')
    }),
    {
      name: 'cards-store',
      partialize: (state: CardsStore) => ({
        listState: {
          filters: state.listState.filters
        },
        editorMode: state.editorMode
      })
    }
  )
);

// Selectors for easier access
export const useCards = () => useCardsStore(state => state.listState.cards);
export const useCardsLoading = () => useCardsStore(state => state.listState.loading);
export const useCardsError = () => useCardsStore(state => state.listState.error);
export const useCurrentCard = () => useCardsStore(state => state.currentCard);
export const useCardsFilters = () => useCardsStore(state => state.listState.filters);
export const useCardFormState = () => useCardsStore(state => state.formState);
export const useSelectedCards = () => useCardsStore(state => state.selectedCardIds);
export const useCardImageUploadState = () => useCardsStore(state => state.imageUpload);
export const useCardEditorMode = () => useCardsStore(state => state.editorMode);
export const useAvailableTags = () => useCardsStore(state => state.availableTags);
export const useCurrentDeckId = () => useCardsStore(state => state.currentDeckId);
