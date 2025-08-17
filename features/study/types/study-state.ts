// Study State Management Types

import type { 
  PracticeSession, 
  PracticeCard, 
  SessionProgress, 
  DueCardsCount,
  StudyMode,
  Grade,
  StartPracticeSessionRequest,
  SessionSummary,
  ReviewResult,
  DueCardsQueryParams,
  NewCardsQueryParams,
  LearningCardsQueryParams,
  DeckStatistics
} from './practice-session';
import type { 
  SRSMetrics, 
  StudySessionState, 
  StudyStatistics,
  LearningProgress,
  ReviewSchedule,
  StudyPreferences,
  StudyError
} from './srs-types';

// Main study store state
export interface StudyStore {
  // Session management
  currentSession: StudySessionState;
  
  // Card management
  dueCards: PracticeCard[];
  newCards: PracticeCard[];
  learningCards: PracticeCard[];
  currentCard: PracticeCard | null;
  
  // Statistics and progress
  statistics: StudyStatistics | null;
  srsMetrics: SRSMetrics | null;
  learningProgress: LearningProgress[];
  reviewSchedule: ReviewSchedule | null;
  dueCardsCount: DueCardsCount | null;
  
  // User preferences
  preferences: StudyPreferences;
  
  // UI state
  isLoading: boolean;
  error: StudyError | null;
  
  // Pagination state
  dueCardsPagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    first: boolean;
    last: boolean;
    numberOfElements: number;
    empty: boolean;
  } | null;
}

// Action types for study store
export interface StudyActions {
  // Session actions
  startSession: (request: StartPracticeSessionRequest) => Promise<PracticeSession>;
  getCurrentSession: () => Promise<PracticeSession | null>;
  completeSession: (sessionId: number) => Promise<SessionSummary>;
  pauseSession: () => void;
  resumeSession: () => void;
  
  // Card actions
  getNextCard: (deckId?: number) => Promise<PracticeCard | null>;
  submitReview: (cardId: number, grade: Grade, responseTime?: number) => Promise<ReviewResult>;
  getDueCards: (params?: DueCardsQueryParams) => Promise<void>;
  getNewCards: (params?: NewCardsQueryParams) => Promise<void>;
  getLearningCards: (params?: LearningCardsQueryParams) => Promise<void>;
  getDueCardsCount: (deckId?: number) => Promise<DueCardsCount>;
  
  // Statistics actions
  getStudyStatistics: () => Promise<StudyStatistics>;
  getSRSMetrics: () => Promise<SRSMetrics>;
  getLearningProgress: () => Promise<LearningProgress[]>;
  getReviewSchedule: () => Promise<ReviewSchedule>;
  getDeckStatistics: (deckId: number) => Promise<DeckStatistics>;
  
  // Preferences actions
  updatePreferences: (preferences: Partial<StudyPreferences>) => Promise<void>;
  
  // Utility actions
  setCurrentCard: (card: PracticeCard | null) => void;
  setError: (error: StudyError | null) => void;
  setLoading: (loading: boolean) => void;
  clearState: () => void;
}

// Hook return types
export interface UseStudyReturn extends StudyStore, StudyActions {}

export interface UseSRSReturn {
  // Current study session
  currentSession: StudySessionState;
  currentCard: PracticeCard | null;
  sessionProgress: SessionProgress | null;
  
  // Card management
  dueCardsCount: DueCardsCount | null;
  nextCard: PracticeCard | null;
  
  // Actions
  startStudySession: (mode: StudyMode, deckId?: number) => Promise<void>;
  getNextCard: () => Promise<void>;
  submitCardReview: (grade: Grade, responseTime?: number) => Promise<void>;
  completeStudySession: () => Promise<SessionSummary | null>;
  
  // State
  isLoading: boolean;
  error: StudyError | null;
}

// Component prop types
export interface StudySessionProps {
  deckId?: number;
  studyMode?: StudyMode;
  onSessionComplete?: (summary: SessionSummary) => void;
  onSessionPause?: () => void;
  onSessionResume?: () => void;
}

export interface PracticeCardProps {
  card: PracticeCard;
  onReview: (grade: Grade, responseTime?: number) => void;
  showAnswer?: boolean;
  onShowAnswer?: () => void;
  isFlipped?: boolean;
  onFlip?: () => void;
}

export interface ReviewButtonsProps {
  onGrade: (grade: Grade) => void;
  disabled?: boolean;
  showAnswerFirst?: boolean;
}

export interface SessionProgressProps {
  progress: SessionProgress;
  session: PracticeSession;
}

export interface DueCardsListProps {
  cards: PracticeCard[];
  onCardSelect?: (card: PracticeCard) => void;
  onStartSession?: (deckId?: number) => void;
  isLoading?: boolean;
}

export interface SRSDashboardProps {
  statistics: StudyStatistics;
  srsMetrics: SRSMetrics;
  reviewSchedule: ReviewSchedule;
  learningProgress: LearningProgress[];
}
