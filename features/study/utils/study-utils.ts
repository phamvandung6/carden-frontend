// Study utility functions
import type { PracticeCard, Grade, CardState } from '../types/practice-session';
import type { StudyStatistics, DailyStats } from '../types/srs-types';

/**
 * Format time duration for display
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.round(minutes % 60);
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

/**
 * Calculate time until due date
 */
export function getTimeUntilDue(dueDate: string): {
  isOverdue: boolean;
  isToday: boolean;
  timeText: string;
} {
  const now = new Date();
  const due = new Date(dueDate);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffMs < 0) {
    return {
      isOverdue: true,
      isToday: false,
      timeText: 'Overdue'
    };
  }

  if (diffHours < 24 && due.toDateString() === now.toDateString()) {
    return {
      isOverdue: false,
      isToday: true,
      timeText: 'Due today'
    };
  }

  if (diffDays < 1) {
    return {
      isOverdue: false,
      isToday: false,
      timeText: `Due in ${Math.ceil(diffHours)}h`
    };
  }

  if (diffDays < 7) {
    return {
      isOverdue: false,
      isToday: false,
      timeText: `Due in ${Math.ceil(diffDays)} days`
    };
  }

  return {
    isOverdue: false,
    isToday: false,
    timeText: due.toLocaleDateString()
  };
}

/**
 * Get card state color for UI
 */
export function getCardStateColor(state: CardState): {
  bg: string;
  text: string;
  border: string;
} {
  switch (state) {
    case 'NEW':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        border: 'border-blue-200'
      };
    case 'LEARNING':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        border: 'border-yellow-200'
      };
    case 'REVIEW':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        border: 'border-green-200'
      };
    case 'RELEARNING':
      return {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        border: 'border-orange-200'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        border: 'border-gray-200'
      };
  }
}

/**
 * Get grade label and color
 */
export function getGradeInfo(grade: Grade): {
  label: string;
  color: string;
  description: string;
} {
  switch (grade) {
    case 0:
      return {
        label: 'Again',
        color: 'text-red-600',
        description: 'Completely forgot'
      };
    case 1:
      return {
        label: 'Hard',
        color: 'text-orange-600',
        description: 'Difficult to remember'
      };
    case 2:
      return {
        label: 'Good',
        color: 'text-green-600',
        description: 'Remembered correctly'
      };
    case 3:
      return {
        label: 'Easy',
        color: 'text-blue-600',
        description: 'Too easy'
      };
    default:
      return {
        label: 'Unknown',
        color: 'text-gray-600',
        description: 'Invalid grade'
      };
  }
}

/**
 * Calculate accuracy percentage with safe division
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Calculate study streak from daily stats
 */
export function calculateStreak(dailyStats: DailyStats[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (!dailyStats.length) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Sort by date (newest first)
  const sortedStats = [...dailyStats].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate current streak (from today backwards)
  const today = new Date().toISOString().split('T')[0];
  let checkingCurrent = true;

  for (const stat of sortedStats) {
    if (stat.cardsStudied > 0) {
      tempStreak++;
      if (checkingCurrent) {
        currentStreak++;
      }
    } else {
      if (checkingCurrent && stat.date !== today) {
        checkingCurrent = false;
      }
      if (!checkingCurrent) {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
      }
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  return { currentStreak, longestStreak };
}

/**
 * Group cards by deck
 */
export function groupCardsByDeck(cards: PracticeCard[]): Record<number, {
  deckTitle: string;
  cards: PracticeCard[];
}> {
  return cards.reduce((acc, card) => {
    const deckId = card.deckId;
    if (!acc[deckId]) {
      acc[deckId] = {
        deckTitle: card.deckTitle,
        cards: []
      };
    }
    acc[deckId].cards.push(card);
    return acc;
  }, {} as Record<number, { deckTitle: string; cards: PracticeCard[] }>);
}

/**
 * Filter cards by due date
 */
export function filterCardsByDate(cards: PracticeCard[], targetDate: Date): PracticeCard[] {
  const targetDateString = targetDate.toDateString();
  return cards.filter(card => {
    const cardDueDate = new Date(card.dueDate);
    return cardDueDate.toDateString() === targetDateString;
  });
}

/**
 * Sort cards by priority (overdue, due today, future)
 */
export function sortCardsByPriority(cards: PracticeCard[]): PracticeCard[] {
  const now = new Date();
  
  return [...cards].sort((a, b) => {
    const aDue = new Date(a.dueDate);
    const bDue = new Date(b.dueDate);
    
    // Overdue cards first
    const aOverdue = aDue < now;
    const bOverdue = bDue < now;
    
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    
    // Then by due date (earliest first)
    return aDue.getTime() - bDue.getTime();
  });
}

/**
 * Calculate weekly study progress
 */
export function calculateWeeklyProgress(dailyStats: DailyStats[]): {
  totalStudied: number;
  totalCorrect: number;
  averageAccuracy: number;
  studyDays: number;
} {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const weekStats = dailyStats.filter(stat => 
    new Date(stat.date) >= oneWeekAgo
  );
  
  const totalStudied = weekStats.reduce((sum, stat) => sum + stat.cardsStudied, 0);
  const totalCorrect = weekStats.reduce((sum, stat) => sum + stat.cardsCorrect, 0);
  const studyDays = weekStats.filter(stat => stat.cardsStudied > 0).length;
  
  return {
    totalStudied,
    totalCorrect,
    averageAccuracy: calculateAccuracy(totalCorrect, totalStudied),
    studyDays
  };
}

/**
 * Get next review date prediction based on grade
 */
export function predictNextReviewDate(
  currentInterval: number,
  grade: Grade,
  easeFactor: number = 2.5
): Date {
  let newInterval = currentInterval;
  
  switch (grade) {
    case 0: // Again
      newInterval = 1;
      break;
    case 1: // Hard
      newInterval = Math.max(1, Math.round(currentInterval * 1.2));
      break;
    case 2: // Good
      newInterval = Math.round(currentInterval * easeFactor);
      break;
    case 3: // Easy
      newInterval = Math.round(currentInterval * easeFactor * 1.3);
      break;
  }
  
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);
  return nextDate;
}

/**
 * Format number with abbreviations (K, M, etc.)
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Validate grade input
 */
export function isValidGrade(grade: any): grade is Grade {
  return typeof grade === 'number' && grade >= 0 && grade <= 3;
}

