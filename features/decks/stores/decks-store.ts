import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Deck, DeckFilters, DeckListState, ImageUploadState } from '../types';

interface DecksStore {
  // List state
  listState: DeckListState;
  
  // Current deck being edited
  currentDeck: Deck | null;
  
  // Image upload state
  imageUpload: ImageUploadState;
  
  // UI state
  viewMode: 'grid' | 'list';
  selectedDeckIds: Set<number>;
  isCreating: boolean;
  isEditing: boolean;
  
  // Actions
  setDecks: (decks: Deck[]) => void;
  addDeck: (deck: Deck) => void;
  updateDeck: (deck: Deck) => void;
  removeDeck: (deckId: number) => void;
  
  setCurrentDeck: (deck: Deck | null) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  setFilters: (filters: Partial<DeckFilters>) => void;
  resetFilters: () => void;
  
  setPagination: (currentPage: number, totalPages: number, totalItems: number) => void;
  
  setViewMode: (mode: 'grid' | 'list') => void;
  
  // Bulk selection
  toggleDeckSelection: (deckId: number) => void;
  selectAllDecks: (deckIds: number[]) => void;
  clearSelection: () => void;
  
  // Image upload
  setImageUploadState: (state: Partial<ImageUploadState>) => void;
  resetImageUpload: () => void;
  
  // Modal states
  setCreating: (isCreating: boolean) => void;
  setEditing: (isEditing: boolean) => void;
  
  // Reset store
  reset: () => void;
}

const initialListState: DeckListState = {
  decks: [],
  loading: false,
  error: null,
  currentPage: 0,
  totalPages: 0,
  totalItems: 0,
  filters: {
    sortBy: 'createdAt',
    sortOrder: 'desc'
  }
};

const initialImageUploadState: ImageUploadState = {
  uploading: false,
  progress: 0,
  error: null,
  previewUrl: null
};

export const useDecksStore = create<DecksStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      listState: initialListState,
      currentDeck: null,
      imageUpload: initialImageUploadState,
      viewMode: 'grid',
      selectedDeckIds: new Set(),
      isCreating: false,
      isEditing: false,

      // Deck list actions
      setDecks: (decks) =>
        set((state) => ({
          listState: { ...state.listState, decks }
        }), false, 'setDecks'),

      addDeck: (deck) =>
        set((state) => ({
          listState: {
            ...state.listState,
            decks: [deck, ...state.listState.decks],
            totalItems: state.listState.totalItems + 1
          }
        }), false, 'addDeck'),

      updateDeck: (updatedDeck) =>
        set((state) => ({
          listState: {
            ...state.listState,
            decks: state.listState.decks.map(deck =>
              deck.id === updatedDeck.id ? updatedDeck : deck
            )
          },
          currentDeck: state.currentDeck?.id === updatedDeck.id ? updatedDeck : state.currentDeck
        }), false, 'updateDeck'),

      removeDeck: (deckId) =>
        set((state) => ({
          listState: {
            ...state.listState,
            decks: state.listState.decks.filter(deck => deck.id !== deckId),
            totalItems: Math.max(0, state.listState.totalItems - 1)
          },
          currentDeck: state.currentDeck?.id === deckId ? null : state.currentDeck,
          selectedDeckIds: new Set([...state.selectedDeckIds].filter(id => id !== deckId))
        }), false, 'removeDeck'),

      // Current deck
      setCurrentDeck: (deck) =>
        set({ currentDeck: deck }, false, 'setCurrentDeck'),

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

      // View mode
      setViewMode: (mode) =>
        set({ viewMode: mode }, false, 'setViewMode'),

      // Bulk selection
      toggleDeckSelection: (deckId) =>
        set((state) => {
          const newSelection = new Set(state.selectedDeckIds);
          if (newSelection.has(deckId)) {
            newSelection.delete(deckId);
          } else {
            newSelection.add(deckId);
          }
          return { selectedDeckIds: newSelection };
        }, false, 'toggleDeckSelection'),

      selectAllDecks: (deckIds) =>
        set({ selectedDeckIds: new Set(deckIds) }, false, 'selectAllDecks'),

      clearSelection: () =>
        set({ selectedDeckIds: new Set() }, false, 'clearSelection'),

      // Image upload
      setImageUploadState: (newState) =>
        set((state) => ({
          imageUpload: { ...state.imageUpload, ...newState }
        }), false, 'setImageUploadState'),

      resetImageUpload: () =>
        set({ imageUpload: initialImageUploadState }, false, 'resetImageUpload'),

      // Modal states
      setCreating: (isCreating) =>
        set({ isCreating }, false, 'setCreating'),

      setEditing: (isEditing) =>
        set({ isEditing }, false, 'setEditing'),

      // Reset
      reset: () =>
        set({
          listState: initialListState,
          currentDeck: null,
          imageUpload: initialImageUploadState,
          viewMode: 'grid',
          selectedDeckIds: new Set(),
          isCreating: false,
          isEditing: false
        }, false, 'reset')
    }),
    {
      name: 'decks-store',
      partialize: (state: DecksStore) => ({
        viewMode: state.viewMode,
        listState: {
          filters: state.listState.filters
        }
      })
    }
  )
);

// Selectors for easier access
export const useDecks = () => useDecksStore(state => state.listState.decks);
export const useDecksLoading = () => useDecksStore(state => state.listState.loading);
export const useDecksError = () => useDecksStore(state => state.listState.error);
export const useCurrentDeck = () => useDecksStore(state => state.currentDeck);
export const useDecksFilters = () => useDecksStore(state => state.listState.filters);
export const useDecksViewMode = () => useDecksStore(state => state.viewMode);
export const useSelectedDecks = () => useDecksStore(state => state.selectedDeckIds);
export const useImageUploadState = () => useDecksStore(state => state.imageUpload);
