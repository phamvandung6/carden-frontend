/**
 * Session management utilities for practice/study features
 */

import type { 
  StudyMode, 
  Grade, 
  CardState, 
  SessionProgress, 
  PracticeCard,
  StudySessionState 
} from '../types';

/**
 * Grade information for display purposes
 */
export interface GradeInfo {
  label: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
}

/**
 * Get grade information for display
 */
export function getGradeInfo(grade: Grade): GradeInfo {
  switch (grade) {
    case 0:
      return {
        label: 'Again',
        description: 'Forgot completely',
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200',
        icon: '❌'
      };
    case 1:
      return {
        label: 'Hard',
        description: 'Difficult to remember',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50 border-orange-200',
        icon: '😤'
      };
    case 2:
      return {
        label: 'Good',
        description: 'Normal recall',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 border-blue-200',
        icon: '👍'
      };
    case 3:
      return {
        label: 'Easy',
        description: 'Too easy',
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200',
        icon: '✨'
      };
    default:
      return {
        label: 'Unknown',
        description: 'Invalid grade',
        color: 'text-gray-600',
        bgColor: 'bg-gray-50 border-gray-200',
        icon: '❓'
      };
  }
}

/**
 * Get card state display information
 */
export function getCardStateColor(cardState: CardState): {
  color: string;
  bgColor: string;
  label: string;
} {
  switch (cardState) {
    case 'NEW':
      return {
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        label: 'New'
      };
    case 'LEARNING':
      return {
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        label: 'Learning'
      };
    case 'REVIEW':
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        label: 'Review'
      };
    case 'RELEARNING':
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        label: 'Relearning'
      };
    default:
      return {
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        label: 'Unknown'
      };
  }
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Format session progress for display
 */
export function formatSessionProgress(progress?: SessionProgress): {
  accuracyText: string;
  progressText: string;
  accuracyColor: string;
} {
  if (!progress) {
    return {
      accuracyText: '0%',
      progressText: '0/0 cards',
      accuracyColor: 'text-gray-600'
    };
  }
  
  const accuracy = calculateAccuracy(progress.cardsCorrect, progress.cardsStudied);
  
  let accuracyColor = 'text-gray-600';
  if (accuracy >= 80) accuracyColor = 'text-green-600';
  else if (accuracy >= 60) accuracyColor = 'text-blue-600';
  else if (accuracy >= 40) accuracyColor = 'text-orange-600';
  else accuracyColor = 'text-red-600';
  
  return {
    accuracyText: `${accuracy}%`,
    progressText: `${progress.cardsStudied}/${progress.cardsStudied + progress.remainingCards} cards`,
    accuracyColor
  };
}

/**
 * Get study mode display information
 */
export function getStudyModeInfo(mode: StudyMode): {
  label: string;
  description: string;
  icon: string;
  color: string;
} {
  switch (mode) {
    case 'FLIP':
      return {
        label: 'Flip Cards',
        description: 'Self-graded flashcards',
        icon: '🔄',
        color: 'text-blue-600'
      };
    case 'TYPE_ANSWER':
      return {
        label: 'Type Answer',
        description: 'Type the correct answer',
        icon: '⌨️',
        color: 'text-green-600'
      };
    case 'MULTIPLE_CHOICE':
      return {
        label: 'Multiple Choice',
        description: 'Choose from options',
        icon: '📝',
        color: 'text-purple-600'
      };
    default:
      return {
        label: 'Unknown',
        description: 'Unknown study mode',
        icon: '❓',
        color: 'text-gray-600'
      };
  }
}

/**
 * Calculate session duration in minutes
 */
export function calculateSessionDuration(startTime: string, endTime?: string): number {
  const start = new Date(startTime).getTime();
  const end = endTime ? new Date(endTime).getTime() : Date.now();
  return Math.round((end - start) / (1000 * 60));
}

/**
 * Calculate response time category
 */
export function getResponseTimeCategory(responseTimeMs: number): {
  category: 'fast' | 'normal' | 'slow';
  label: string;
  color: string;
} {
  if (responseTimeMs < 2000) {
    return { category: 'fast', label: 'Fast', color: 'text-green-600' };
  } else if (responseTimeMs < 10000) {
    return { category: 'normal', label: 'Normal', color: 'text-blue-600' };
  } else {
    return { category: 'slow', label: 'Slow', color: 'text-orange-600' };
  }
}

/**
 * Check if session is ready to start
 */
export function canStartSession(sessionState?: StudySessionState): {
  canStart: boolean;
  reason?: string;
} {
  if (!sessionState) {
    return { canStart: true };
  }
  
  if (sessionState.isActive && !sessionState.isComplete) {
    return { 
      canStart: false, 
      reason: 'Another session is already active' 
    };
  }
  
  if (sessionState.canStudyNow === false) {
    return { 
      canStart: false, 
      reason: 'No cards available for study at this time' 
    };
  }
  
  return { canStart: true };
}

/**
 * Check if card is overdue for review
 */
export function isCardOverdue(card: PracticeCard): boolean {
  if (!card.isDue) return false;
  return new Date(card.dueDate) < new Date();
}

/**
 * Get card priority for study ordering
 */
export function getCardPriority(card: PracticeCard): number {
  // Higher number = higher priority
  let priority = 0;
  
  // Overdue cards get highest priority
  if (isCardOverdue(card)) priority += 100;
  
  // Learning cards get high priority
  if (card.isLearning) priority += 50;
  
  // Due cards get medium priority
  if (card.isDue) priority += 30;
  
  // New cards get lower priority
  if (card.isNew) priority += 10;
  
  // Factor in accuracy rate (lower accuracy = higher priority)
  priority += (100 - card.accuracyRate) / 10;
  
  return priority;
}

/**
 * Validate study mode selection
 */
export function validateStudyMode(mode: string): mode is StudyMode {
  return ['FLIP', 'TYPE_ANSWER', 'MULTIPLE_CHOICE'].includes(mode);
}

/**
 * Validate grade value
 */
export function validateGrade(grade: number): grade is Grade {
  return Number.isInteger(grade) && grade >= 0 && grade <= 3;
}
