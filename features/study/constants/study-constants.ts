/**
 * Constants for study/practice features
 */

import type { StudyMode, Grade, CardState } from '../types';

/**
 * Study modes configuration
 */
export const STUDY_MODES: Record<StudyMode, {
  id: StudyMode;
  label: string;
  description: string;
  icon: string;
  shortcut?: string;
}> = {
  FLIP: {
    id: 'FLIP',
    label: 'Flip Cards',
    description: 'Traditional flashcards with self-grading',
    icon: '🔄',
    shortcut: 'F'
  },
  TYPE_ANSWER: {
    id: 'TYPE_ANSWER',
    label: 'Type Answer',
    description: 'Type the correct answer',
    icon: '⌨️',
    shortcut: 'T'
  },
  MULTIPLE_CHOICE: {
    id: 'MULTIPLE_CHOICE',
    label: 'Multiple Choice',
    description: 'Choose from multiple options',
    icon: '📝',
    shortcut: 'M'
  }
} as const;

/**
 * Grade system configuration
 */
export const GRADES: Record<Grade, {
  value: Grade;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
  shortcut?: string;
}> = {
  0: {
    value: 0,
    label: 'Again',
    description: 'Forgot completely - need to relearn',
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
    icon: '❌',
    shortcut: '1'
  },
  1: {
    value: 1,
    label: 'Hard',
    description: 'Difficult to remember - needs more practice',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 border-orange-200',
    icon: '😤',
    shortcut: '2'
  },
  2: {
    value: 2,
    label: 'Good',
    description: 'Normal recall - standard interval',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    icon: '👍',
    shortcut: '3'
  },
  3: {
    value: 3,
    label: 'Easy',
    description: 'Too easy - longer interval',
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
    icon: '✨',
    shortcut: '4'
  }
} as const;

/**
 * Card states configuration
 */
export const CARD_STATES: Record<CardState, {
  id: CardState;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  priority: number;
}> = {
  NEW: {
    id: 'NEW',
    label: 'New',
    description: 'Never studied before',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    priority: 10
  },
  LEARNING: {
    id: 'LEARNING',
    label: 'Learning',
    description: 'Currently being learned',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    priority: 50
  },
  REVIEW: {
    id: 'REVIEW',
    label: 'Review',
    description: 'Learned and ready for review',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    priority: 30
  },
  RELEARNING: {
    id: 'RELEARNING',
    label: 'Relearning',
    description: 'Failed and needs relearning',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    priority: 80
  }
} as const;

/**
 * Default session limits
 */
export const SESSION_LIMITS = {
  DEFAULT_MAX_NEW_CARDS: 20,
  DEFAULT_MAX_REVIEW_CARDS: 200,
  DEFAULT_MAX_LEARNING_CARDS: 50,
  MIN_SESSION_CARDS: 1,
  MAX_SESSION_CARDS: 500,
  DEFAULT_SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in ms
} as const;

/**
 * Response time thresholds (in milliseconds)
 */
export const RESPONSE_TIME_THRESHOLDS = {
  FAST: 2000,      // < 2 seconds
  NORMAL: 10000,   // 2-10 seconds
  SLOW: 30000,     // 10-30 seconds
  TOO_SLOW: 60000, // > 1 minute
} as const;

/**
 * Accuracy thresholds for color coding
 */
export const ACCURACY_THRESHOLDS = {
  EXCELLENT: 90,  // >= 90%
  GOOD: 80,       // >= 80%
  AVERAGE: 60,    // >= 60%
  POOR: 40,       // >= 40%
  // < 40% = very poor
} as const;

/**
 * SRS algorithm default settings
 */
export const SRS_DEFAULTS = {
  INITIAL_EASE: 250,           // Initial ease factor (2.5)
  MIN_EASE: 130,              // Minimum ease factor (1.3)
  MAX_EASE: 400,              // Maximum ease factor (4.0)
  EASY_BONUS: 130,            // Easy bonus multiplier (1.3)
  HARD_FACTOR: 120,           // Hard factor multiplier (1.2)
  LAPSE_MULTIPLIER: 0,        // Lapse multiplier (0 = reset)
  INTERVAL_MODIFIER: 100,     // Interval modifier (100%)
  MAX_INTERVAL: 36500,        // Maximum interval (100 years)
  LEARNING_STEPS: [1, 10],    // Learning steps in minutes
  RELEARNING_STEPS: [10],     // Relearning steps in minutes
  GRADUATE_INTERVAL: 1,       // Graduate to review after 1 day
  EASY_INTERVAL: 4,           // Easy interval for new cards (4 days)
} as const;

/**
 * Keyboard shortcuts for study interface
 */
export const KEYBOARD_SHORTCUTS = {
  SHOW_ANSWER: ' ',           // Spacebar
  GRADE_AGAIN: '1',
  GRADE_HARD: '2',
  GRADE_GOOD: '3',
  GRADE_EASY: '4',
  PAUSE_SESSION: 'p',
  END_SESSION: 'Escape',
  PREVIOUS_CARD: 'ArrowLeft',
  NEXT_CARD: 'ArrowRight',
  FLIP_MODE: 'f',
  TYPE_MODE: 't',
  CHOICE_MODE: 'm',
} as const;

/**
 * Study statistics display periods
 */
export const STATS_PERIODS = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  ALL_TIME: 'all_time',
} as const;

/**
 * API endpoints (relative to base URL)
 */
export const API_ENDPOINTS = {
  SESSIONS: '/v1/practice/sessions',
  CURRENT_SESSION: '/v1/practice/sessions/current',
  COMPLETE_SESSION: (sessionId: number) => `/v1/practice/sessions/${sessionId}/complete`,
  DUE_CARDS: '/v1/practice/due-cards',
  NEW_CARDS: '/v1/practice/cards/new',
  LEARNING_CARDS: '/v1/practice/cards/learning',
  NEXT_CARD: '/v1/practice/next-card',
  SUBMIT_REVIEW: (cardId: number) => `/v1/practice/cards/${cardId}/review`,
  DUE_COUNT: '/v1/practice/cards/due-count',
  DECK_STATS: (deckId: number) => `/v1/practice/deck/${deckId}/statistics`,
  TYPE_ANSWER_CARD: (cardId: number) => `/v1/practice/cards/${cardId}/type-answer`,
  MULTIPLE_CHOICE_CARD: (cardId: number) => `/v1/practice/cards/${cardId}/multiple-choice`,
  TYPE_ANSWER_REVIEW: '/v1/practice/cards/type-answer/review',
  MULTIPLE_CHOICE_REVIEW: '/v1/practice/cards/multiple-choice/review',
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  STUDY_PREFERENCES: 'study_preferences',
  STUDY_SESSION: 'study_session_state',
  STUDY_STATISTICS: 'study_statistics',
  LAST_DECK_STUDIED: 'last_deck_studied',
  KEYBOARD_SHORTCUTS_ENABLED: 'keyboard_shortcuts_enabled',
} as const;

/**
 * Default study preferences
 */
export const DEFAULT_PREFERENCES = {
  defaultStudyMode: 'FLIP' as StudyMode,
  maxNewCardsPerDay: 20,
  maxReviewCardsPerSession: 200,
  showAnswerAutomatically: false,
  autoPlayAudio: false,
  enableKeyboardShortcuts: true,
  reviewNotifications: true,
  studyReminders: false,
  preferredStudyTime: '09:00',
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATIONS = {
  CARD_FLIP: 300,
  FADE_IN: 150,
  FADE_OUT: 100,
  SLIDE_IN: 200,
  BOUNCE: 400,
} as const;
