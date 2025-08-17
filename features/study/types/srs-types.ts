// SRS (Spaced Repetition System) Types
import type { PracticeSession, PracticeCard, SessionProgress, StudyMode } from './practice-session';

export interface SRSConfig {
  // Learning steps in minutes for new cards
  learningSteps: number[];
  // Relearning steps in minutes for failed cards
  relearningSteps: number[];
  // Initial ease factor for new cards
  initialEase: number;
  // Minimum ease factor
  minEase: number;
  // Maximum ease factor
  maxEase: number;
  // Easy bonus multiplier
  easyBonus: number;
  // Hard factor multiplier
  hardFactor: number;
  // Lapse multiplier for failed cards
  lapseMultiplier: number;
  // Interval modifier
  intervalModifier: number;
  // Maximum interval in days
  maxInterval: number;
}

export interface SRSMetrics {
  totalCards: number;
  newCards: number;
  learningCards: number;
  reviewCards: number;
  masteredCards: number;
  averageEase: number;
  retentionRate: number;
  averageInterval: number;
}

export interface StudyStatistics {
  todayStudied: number;
  todayCorrect: number;
  todayAccuracy: number;
  weeklyStats: DailyStats[];
  monthlyStats: DailyStats[];
  totalStudyTime: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  averageStudyTime: number; // minutes per day
}

export interface DailyStats {
  date: string; // ISO date string
  cardsStudied: number;
  cardsCorrect: number;
  accuracy: number;
  studyTimeMinutes: number;
  newCardsLearned: number;
  reviewsCompleted: number;
}

export interface LearningProgress {
  deckId: number;
  deckTitle: string;
  totalCards: number;
  studiedCards: number;
  masteredCards: number;
  progressPercentage: number;
  averageAccuracy: number;
  estimatedTimeToComplete: number; // in hours
  lastStudied: string | null;
}

export interface ReviewSchedule {
  today: number;
  tomorrow: number;
  nextWeek: number;
  nextMonth: number;
  overdue: number;
}

// Local state types for frontend management
export interface StudySessionState {
  isActive: boolean;
  currentSession: PracticeSession | null;
  currentCard: PracticeCard | null;
  sessionProgress: SessionProgress | null;
  isPaused: boolean;
  pauseStartTime: number | null;
  totalPauseTime: number;
  isComplete: boolean;
  nextAvailableStudyTime?: string; // From session API response
  minutesUntilNextCard?: number; // From session API response
  canStudyNow?: boolean; // From session API response
}

export interface StudyPreferences {
  defaultStudyMode: StudyMode;
  maxNewCardsPerDay: number;
  maxReviewCardsPerSession: number;
  showAnswerAutomatically: boolean;
  autoPlayAudio: boolean;
  enableKeyboardShortcuts: boolean;
  reviewNotifications: boolean;
  studyReminders: boolean;
  preferredStudyTime: string; // HH:mm format
}

// Error types specific to SRS
export interface StudyError {
  code: 'SESSION_NOT_FOUND' | 'CARD_NOT_FOUND' | 'INVALID_GRADE' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR' | 'NO_CARDS_AVAILABLE';
  message: string;
  details?: any;
}

