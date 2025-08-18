import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Deck, DeckFilters, DeckListState, ImageUploadState } from '../types';

interface DecksStore {
  // Separate list states for each variant
  myDecksState: DeckListState;
  publicDecksState: DeckListState;
  
  // Current deck being edited
  currentDeck: Deck | null;
  
  // Image upload state
  imageUpload: ImageUploadState;
  
  // UI state
  viewMode: 'grid' | 'list';
  selectedDeckIds: Set<number>;
  isCreating: boolean;
  isEditing: boolean;
  
  // Actions for specific variants
  setMyDecks: (decks: Deck[]) => void;
  setPublicDecks: (decks: Deck[]) => void;
  addDeck: (deck: Deck) => void;
  updateDeck: (deck: Deck) => void;
  removeDeck: (deckId: number) => void;
  
  setCurrentDeck: (deck: Deck | null) => void;
  
  // Variant-specific state updates
  setMyDecksLoading: (loading: boolean) => void;
  setMyDecksError: (error: string | null) => void;
  setPublicDecksLoading: (loading: boolean) => void;
  setPublicDecksError: (error: string | null) => void;
  
  setMyDecksFilters: (filters: Partial<DeckFilters>) => void;
  setPublicDecksFilters: (filters: Partial<DeckFilters>) => void;
  resetMyDecksFilters: () => void;
  resetPublicDecksFilters: () => void;
  
  setMyDecksPagination: (currentPage: number, totalPages: number, totalItems: number) => void;
  setPublicDecksPagination: (currentPage: number, totalPages: number, totalItems: number) => void;
  
  // BATCH UPDATE to prevent multiple re-renders
  batchUpdateMyDecksState: (updates: Partial<DeckListState>) => void;
  batchUpdatePublicDecksState: (updates: Partial<DeckListState>) => void;
  
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
      // Initial state - separate for each variant
      myDecksState: initialListState,
      publicDecksState: initialListState,
      currentDeck: null,
      imageUpload: initialImageUploadState,
      viewMode: 'grid',
      selectedDeckIds: new Set(),
      isCreating: false,
      isEditing: false,

      // Variant-specific deck list actions
      setMyDecks: (decks) =>
        set((state) => ({
          myDecksState: { ...state.myDecksState, decks }
        }), false, 'setMyDecks'),

      setPublicDecks: (decks) =>
        set((state) => ({
          publicDecksState: { ...state.publicDecksState, decks }
        }), false, 'setPublicDecks'),

      addDeck: (deck) =>
        set((state) => ({
          myDecksState: {
            ...state.myDecksState,
            decks: [deck, ...state.myDecksState.decks],
            totalItems: state.myDecksState.totalItems + 1
          }
        }), false, 'addDeck'),

      updateDeck: (updatedDeck) =>
        set((state) => ({
          myDecksState: {
            ...state.myDecksState,
            decks: state.myDecksState.decks.map(deck =>
              deck.id === updatedDeck.id ? updatedDeck : deck
            )
          },
          publicDecksState: {
            ...state.publicDecksState,
            decks: state.publicDecksState.decks.map(deck =>
              deck.id === updatedDeck.id ? updatedDeck : deck
            )
          },
          currentDeck: state.currentDeck?.id === updatedDeck.id ? updatedDeck : state.currentDeck
        }), false, 'updateDeck'),

      removeDeck: (deckId) =>
        set((state) => ({
          myDecksState: {
            ...state.myDecksState,
            decks: state.myDecksState.decks.filter(deck => deck.id !== deckId),
            totalItems: Math.max(0, state.myDecksState.totalItems - 1)
          },
          publicDecksState: {
            ...state.publicDecksState,
            decks: state.publicDecksState.decks.filter(deck => deck.id !== deckId),
            totalItems: Math.max(0, state.publicDecksState.totalItems - 1)
          },
          currentDeck: state.currentDeck?.id === deckId ? null : state.currentDeck,
          selectedDeckIds: new Set([...state.selectedDeckIds].filter(id => id !== deckId))
        }), false, 'removeDeck'),

      // Current deck
      setCurrentDeck: (deck) =>
        set({ currentDeck: deck }, false, 'setCurrentDeck'),

      // Variant-specific loading and error
      setMyDecksLoading: (loading) =>
        set((state) => ({
          myDecksState: { ...state.myDecksState, loading }
        }), false, 'setMyDecksLoading'),

      setMyDecksError: (error) =>
        set((state) => ({
          myDecksState: { ...state.myDecksState, error }
        }), false, 'setMyDecksError'),

      setPublicDecksLoading: (loading) =>
        set((state) => ({
          publicDecksState: { ...state.publicDecksState, loading }
        }), false, 'setPublicDecksLoading'),

      setPublicDecksError: (error) =>
        set((state) => ({
          publicDecksState: { ...state.publicDecksState, error }
        }), false, 'setPublicDecksError'),

      // Variant-specific filters
      setMyDecksFilters: (newFilters) =>
        set((state) => ({
          myDecksState: {
            ...state.myDecksState,
            filters: { ...state.myDecksState.filters, ...newFilters }
          }
        }), false, 'setMyDecksFilters'),

      setPublicDecksFilters: (newFilters) =>
        set((state) => ({
          publicDecksState: {
            ...state.publicDecksState,
            filters: { ...state.publicDecksState.filters, ...newFilters }
          }
        }), false, 'setPublicDecksFilters'),

      resetMyDecksFilters: () =>
        set((state) => ({
          myDecksState: {
            ...state.myDecksState,
            filters: initialListState.filters
          }
        }), false, 'resetMyDecksFilters'),

      resetPublicDecksFilters: () =>
        set((state) => ({
          publicDecksState: {
            ...state.publicDecksState,
            filters: initialListState.filters
          }
        }), false, 'resetPublicDecksFilters'),

      // Variant-specific pagination
      setMyDecksPagination: (currentPage, totalPages, totalItems) =>
        set((state) => ({
          myDecksState: {
            ...state.myDecksState,
            currentPage,
            totalPages,
            totalItems
          }
        }), false, 'setMyDecksPagination'),

      setPublicDecksPagination: (currentPage, totalPages, totalItems) =>
        set((state) => ({
          publicDecksState: {
            ...state.publicDecksState,
            currentPage,
            totalPages,
            totalItems
          }
        }), false, 'setPublicDecksPagination'),

      // BATCH UPDATE to prevent multiple re-renders
      batchUpdateMyDecksState: (updates) =>
        set((state) => ({
          myDecksState: { ...state.myDecksState, ...updates }
        }), false, 'batchUpdateMyDecksState'),

      batchUpdatePublicDecksState: (updates) =>
        set((state) => ({
          publicDecksState: { ...state.publicDecksState, ...updates }
        }), false, 'batchUpdatePublicDecksState'),

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
          myDecksState: initialListState,
          publicDecksState: initialListState,
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
        myDecksState: {
          filters: state.myDecksState.filters
        },
        publicDecksState: {
          filters: state.publicDecksState.filters
        }
      })
    }
  )
);

// Variant-specific selectors for easier access  
export const useMyDecksState = () => useDecksStore(state => state.myDecksState);
export const usePublicDecksState = () => useDecksStore(state => state.publicDecksState);

export const useCurrentDeck = () => useDecksStore(state => state.currentDeck);
export const useDecksViewMode = () => useDecksStore(state => state.viewMode);
export const useSelectedDecks = () => useDecksStore(state => state.selectedDeckIds);
export const useImageUploadState = () => useDecksStore(state => state.imageUpload);
