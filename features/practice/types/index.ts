import type { Card } from '@/features/flashcards';

// Client-side difficulty rating (different from SRS grades)
export type ClientDifficulty = 'easy' | 'hard';

// Client study card with local state
export interface ClientStudyCard extends Card {
  // Local study state (not affecting backend)
  clientDifficulty?: ClientDifficulty;
  timesStudied: number;
  lastStudied?: Date;
  needsReview: boolean;
}

// Client study session state
export interface ClientStudySession {
  deckId: number;
  deckTitle: string;
  cards: ClientStudyCard[];
  currentCardIndex: number;
  currentCard: ClientStudyCard | null;
  studiedCards: number[];
  completedCards: number[]; // Cards marked as 'easy'
  isActive: boolean;
  isComplete: boolean;
  showAnswer: boolean;
  startTime: Date;
  endTime?: Date;
  totalCards: number;
  mode: 'study' | 'review'; // study = first time, review = repeat hard cards
}

// Session statistics
export interface ClientStudyStats {
  totalCards: number;
  studiedCards: number;
  easyCards: number;
  hardCards: number;
  completionRate: number;
  studyTime: number; // in minutes
  averageTimePerCard: number; // in seconds
}

// Study preferences
export interface ClientStudyPreferences {
  showProgress: boolean;
  shuffleCards: boolean;
}

// Store interface
export interface ClientStudyStore {
  // State
  currentSession: ClientStudySession | null;
  preferences: ClientStudyPreferences;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  startStudySession: (deckId: number, deckTitle: string, cards: Card[]) => void;
  endStudySession: () => ClientStudyStats | null;
  showAnswer: () => void;
  rateCard: (difficulty: ClientDifficulty) => void;
  nextCard: () => void;
  previousCard: () => void;
  resetSession: () => void;
  updatePreferences: (preferences: Partial<ClientStudyPreferences>) => void;
  
  // Getters
  getSessionStats: () => ClientStudyStats | null;
  hasCardsToReview: () => boolean;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
}
