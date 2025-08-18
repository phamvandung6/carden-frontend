// Analytics Feature Types
// Based on analytics API endpoints documentation

import type { ApiResponse } from '@/types';

// User Statistics Overview Types
export interface UserStatisticsOverview {
  userId: number;
  totalCards: number;
  totalSessions: number;
  completedSessions: number;
  totalStudyTimeMinutes: number;
  totalCardsStudied: number;
  overallAccuracy: number;
  currentStreak: number;
  cardStateDistribution: CardStateDistribution;
  recentSessionCount: number;
  recentStudyTimeMinutes: number;
  lastActivityDate: string;
  averageSessionDuration: number;
  studyEfficiency: number;
}

// Simplified Overview Types
export interface SimplifiedOverview {
  totalStudyTimeMinutes: number;
  totalCards: number;
  totalSessions: number;
  cardStates: CardStateDistribution;
  recentSessionCount: number;
  overallAccuracy: number;
  currentStreak: number;
  totalCardsStudied: number;
}

// Card State Distribution
export interface CardStateDistribution {
  LEARNING: number;
  REVIEW: number;
}

// Performance Statistics Types
export interface PerformanceStatistics {
  userId: number;
  startDate: string;
  endDate: string;
  totalSessions: number;
  averageAccuracy: number;
  totalStudyTime: number;
  cardsStudied: number;
  dailyAverages: DailyAverages;
  weeklyTrends: WeeklyTrend[];
  accuracyTrend: AccuracyTrendPoint[];
  improvementRate: number;
  consistency: number;
}

export interface DailyAverages {
  averageCards: number;
  averageAccuracy: number;
  averageStudyTime: number;
  averageSessions: number;
}

export interface WeeklyTrend {
  year: number;
  week: number;
  sessions: number;
  studyTime: number;
  cardsStudied: number;
  avgAccuracy: number;
}

export interface AccuracyTrendPoint {
  date: string;
  accuracy: number;
}

// Study Streaks Types
export interface StudyStreaks {
  userId: number;
  currentStreak: number;
  longestStreak: number;
  nextMilestone: number;
  daysToMilestone: number;
  studyDates: string[];
  streakStartDate: string | null;
  isActive: boolean;
}

// Deck Statistics Types
export interface DeckStatistics {
  masteredCards: number;
  totalCards: number;
  averageAccuracy: number;
  studiedCards: number;
  difficultCards: number;
  completionRate: number;
}

// Analytics Summary Types
export interface AnalyticsSummary {
  overview: OverviewSummary;
  recent: RecentSummary;
  distribution: CardStateDistribution;
  streaks: StreaksSummary;
}

export interface OverviewSummary {
  overallAccuracy: number;
  totalCards: number;
  totalSessions: number;
  totalStudyTimeMinutes: number;
}

export interface RecentSummary {
  sessionsLast30Days: number;
  studyTimeLast30Days: number;
  cardsStudiedLast30Days: number;
  accuracyLast30Days: number;
}

export interface StreaksSummary {
  daysToMilestone: number;
  current: number;
  longest: number;
  nextMilestone: number;
}

// Study Insights Types
export interface StudyInsight {
  type: InsightType;
  title: string;
  message: string;
  priority: InsightPriority;
  actionable: boolean;
  recommendation: string | null;
}

export type InsightType = 
  | 'PERFORMANCE' 
  | 'STREAK' 
  | 'ACTIVITY' 
  | 'PROGRESS' 
  | 'EFFICIENCY' 
  | 'ACHIEVEMENT';

export type InsightPriority = 
  | 'HIGH' 
  | 'MEDIUM' 
  | 'LOW' 
  | 'POSITIVE' 
  | 'NEUTRAL';

// Performance Query Parameters
export interface PerformanceQueryParams {
  startDate?: string; // ISO format: 2024-01-01T00:00:00
  endDate?: string;   // ISO format: 2024-12-31T23:59:59
  period?: '7d' | '30d' | '90d' | '1y'; // Default: 30d
}

// Chart Data Types for UI
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ProgressChartData {
  accuracy: ChartDataPoint[];
  studyTime: ChartDataPoint[];
  cardsStudied: ChartDataPoint[];
}

export interface StatsCardData {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: string;
}

// Analytics Store State
export interface AnalyticsState {
  overview: UserStatisticsOverview | null;
  simplifiedOverview: SimplifiedOverview | null;
  performance: PerformanceStatistics | null;
  streaks: StudyStreaks | null;
  summary: AnalyticsSummary | null;
  insights: StudyInsight[] | null;
  deckStats: Record<number, DeckStatistics>;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

// API Response Types
export type AnalyticsOverviewResponse = ApiResponse<UserStatisticsOverview>;
export type SimplifiedOverviewResponse = ApiResponse<SimplifiedOverview>;
export type PerformanceResponse = ApiResponse<PerformanceStatistics>;
export type StreaksResponse = ApiResponse<StudyStreaks>;
export type DeckStatsResponse = ApiResponse<DeckStatistics>;
export type SummaryResponse = ApiResponse<AnalyticsSummary>;
export type InsightsResponse = ApiResponse<StudyInsight[]>;
