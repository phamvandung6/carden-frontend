// Practice Session Types based on API documentation

export type StudyMode = 'FLIP' | 'TYPE_ANSWER' | 'MULTIPLE_CHOICE';

export type CardState = 'NEW' | 'LEARNING' | 'REVIEW' | 'RELEARNING';

export type Grade = 0 | 1 | 2 | 3; // 0=Again, 1=Hard, 2=Good, 3=Easy

// Request types
export interface StartPracticeSessionRequest {
  studyMode: StudyMode;
  deckId?: number | null;
  maxNewCards?: number;
  maxReviewCards?: number;
  includeNewCards?: boolean;
  includeReviewCards?: boolean;
  includeLearningCards?: boolean;
}

export interface SubmitReviewRequest {
  grade: Grade;
  responseTimeMs?: number;
  showAnswer?: boolean;
  userAnswer?: string; // For TYPE_ANSWER mode
}

export interface SubmitTypeAnswerRequest {
  cardId: number;
  userAnswer: string;
  responseTimeMs?: number;
  showAnswer?: boolean;
}

export interface SubmitMultipleChoiceRequest {
  cardId: number;
  selectedOption: number; // 0-3
  responseTimeMs?: number;
  showAnswer?: boolean;
}

// Response types
export interface PracticeSession {
  sessionId: number;
  studyMode: StudyMode;
  deckId: number | null;
  startTime: string;
  cardsStudied: number | null;
  cardsCorrect: number | null;
  currentAccuracy: number | null;
  durationMinutes: number | null;
  dueCardsCount: number;
  maxNewCards: number;
  maxReviewCards: number;
  includeNewCards: boolean;
  includeReviewCards: boolean;
  includeLearningCards: boolean;
  nextAvailableStudyTime: string; // ISO datetime when next card will be available
  minutesUntilNextCard: number; // Minutes until next card is available
  canStudyNow: boolean; // Whether user can study right now
}

export interface StudyState {
  id: number;
  cardId: number;
  cardState: CardState;
  dueDate: string;
  intervalDays: number;
  accuracyRate: number;
  totalReviews: number;
  isDue: boolean;
  isNew: boolean;
  isLearning: boolean;
}

export interface PracticeCard {
  cardId: number;
  frontText: string;
  frontImageUrl: string | null;
  backDefinition: string;
  backMeaningVi: string;
  ipa: string | null;
  studyStateId: number | null;
  cardState: CardState;
  dueDate: string;
  intervalDays: number;
  totalReviews: number;
  accuracyRate: number;
  isDue: boolean;
  isNew: boolean;
  isLearning: boolean;
  deckId: number;
  deckTitle: string;
  showAnswer: boolean;
  remainingNewCards: number;
  remainingReviewCards: number;
  remainingLearningCards: number;
}

export interface ReviewResult {
  cardId: number;
  grade: Grade;
  isCorrect: boolean;
  feedback: string;
  similarity: number | null;
  correctAnswer: string | null;
  userAnswer: string | null;
  nextReviewDate: string | null;
  currentState: string | null;
  message: string;
  success: boolean;
  updatedStudyState: StudyState;
  nextCard: PracticeCard | null;
  sessionProgress: SessionProgress;
}

export interface SessionProgress {
  cardsStudied: number;
  cardsCorrect: number;
  currentAccuracy: number;
  remainingCards: number;
  sessionDurationMinutes: number | null;
}

export interface SessionStats {
  averageResponseTime: number | null;
  scoreDistribution: [number, number, number, number]; // [Again, Hard, Good, Easy]
  totalTimeSpent: number;
  pauseCount: number;
  difficultyRating: number | null;
}

export interface SessionSummary {
  sessionId: number;
  totalCards: number;
  correctCards: number;
  finalAccuracy: number;
  durationMinutes: number;
  newCards: number;
  reviewCards: number;
  relearningCards: number;
  sessionStats: SessionStats;
  completedAt: string;
}

export interface DueCardsCount {
  totalDue: number;
  newCards: number;
  reviewCards: number;
  learningCards: number;
  nextCardAvailableAt: string; // ISO datetime when next card will be available
  minutesUntilNext: number; // Minutes until next card is available
  hasCardsAvailable: boolean; // Whether there are any cards available to study
}

export interface DeckStatistics {
  deckId: number;
  totalCards: number;
  studiedCards: number;
  masteredCards: number;
  averageAccuracy: number;
  completionRate: number;
}

// Paginated response for due cards and new cards - matches Spring Boot pagination
export interface PaginatedCards {
  totalElements: number;
  totalPages: number;
  pageable: {
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
    offset: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  size: number;
  content: PracticeCard[];
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Query parameters
export interface DueCardsQueryParams {
  deckId?: number;
  page?: number;
  size?: number;
}

export interface NewCardsQueryParams {
  deckId?: number;
  page?: number;
  size?: number;
}

export interface LearningCardsQueryParams {
  deckId?: number;
}
