// Chart Utility Functions for Analytics
import type { ChartDataPoint, ProgressChartData } from '../types';

/**
 * Format time in minutes to human readable format
 */
export function formatStudyTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
}

/**
 * Format accuracy percentage with proper rounding
 */
export function formatAccuracy(accuracy: number): string {
  return `${Math.round(accuracy * 100) / 100}%`;
}

/**
 * Format large numbers with K/M notation
 */
export function formatLargeNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
}

/**
 * Get color based on accuracy percentage
 */
export function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 90) return '#10b981'; // green-500
  if (accuracy >= 80) return '#06b6d4'; // cyan-500
  if (accuracy >= 70) return '#f59e0b'; // amber-500
  if (accuracy >= 60) return '#f97316'; // orange-500
  return '#ef4444'; // red-500
}

/**
 * Get performance trend icon based on improvement rate
 */
export function getTrendDirection(value: number): 'up' | 'down' | 'neutral' {
  if (value > 5) return 'up';
  if (value < -5) return 'down';
  return 'neutral';
}

/**
 * Calculate completion percentage
 */
export function calculateCompletionRate(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, (completed / total) * 100);
}

/**
 * Generate date range for chart labels
 */
export function generateDateRange(startDate: string, endDate: string): string[] {
  const dates = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let current = new Date(start);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * Transform API data to chart format
 */
export function transformToChartData(
  data: Array<{ date: string; value: number }>, 
  labelSuffix?: string
): ChartDataPoint[] {
  return data.map(point => ({
    date: new Date(point.date).toLocaleDateString(),
    value: point.value,
    label: `${point.value}${labelSuffix || ''}`
  }));
}

/**
 * Calculate moving average for smoothing chart data
 */
export function calculateMovingAverage(data: number[], windowSize: number = 7): number[] {
  const result = [];
  
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = data.slice(start, i + 1);
    const average = window.reduce((sum, val) => sum + val, 0) / window.length;
    result.push(Math.round(average * 100) / 100);
  }
  
  return result;
}

/**
 * Find data peaks and valleys for insights
 */
export function findDataTrends(data: number[]): {
  peaks: number[];
  valleys: number[];
  trend: 'increasing' | 'decreasing' | 'stable';
} {
  const peaks: number[] = [];
  const valleys: number[] = [];
  
  for (let i = 1; i < data.length - 1; i++) {
    if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
      peaks.push(i);
    } else if (data[i] < data[i - 1] && data[i] < data[i + 1]) {
      valleys.push(i);
    }
  }
  
  // Determine overall trend
  const firstQuarter = data.slice(0, Math.floor(data.length / 4));
  const lastQuarter = data.slice(-Math.floor(data.length / 4));
  
  const firstAvg = firstQuarter.reduce((sum, val) => sum + val, 0) / firstQuarter.length;
  const lastAvg = lastQuarter.reduce((sum, val) => sum + val, 0) / lastQuarter.length;
  
  let trend: 'increasing' | 'decreasing' | 'stable';
  if (lastAvg > firstAvg * 1.1) {
    trend = 'increasing';
  } else if (lastAvg < firstAvg * 0.9) {
    trend = 'decreasing';
  } else {
    trend = 'stable';
  }
  
  return { peaks, valleys, trend };
}

/**
 * Calculate study consistency score
 */
export function calculateConsistencyScore(studyDates: string[]): number {
  if (studyDates.length === 0) return 0;
  
  // Sort dates
  const sortedDates = studyDates.sort();
  let gaps = 0;
  let totalDays = 0;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const daysDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    totalDays += daysDiff;
    if (daysDiff > 1) {
      gaps += daysDiff - 1;
    }
  }
  
  if (totalDays === 0) return 100;
  return Math.max(0, (1 - gaps / totalDays) * 100);
}

/**
 * Generate milestone markers for streak progress
 */
export function getStreakMilestones(): Array<{ value: number; label: string; color: string }> {
  return [
    { value: 7, label: '1 Week', color: '#10b981' },
    { value: 14, label: '2 Weeks', color: '#06b6d4' },
    { value: 30, label: '1 Month', color: '#8b5cf6' },
    { value: 60, label: '2 Months', color: '#f59e0b' },
    { value: 100, label: '100 Days', color: '#ef4444' },
    { value: 365, label: '1 Year', color: '#6366f1' },
  ];
}

/**
 * Calculate efficiency score based on accuracy and speed
 */
export function calculateEfficiencyScore(
  accuracy: number, 
  cardsPerMinute: number,
  baselineSpeed: number = 1
): number {
  // Normalize accuracy to 0-1 range
  const normalizedAccuracy = accuracy / 100;
  
  // Normalize speed relative to baseline
  const normalizedSpeed = Math.min(cardsPerMinute / baselineSpeed, 2); // Cap at 2x baseline
  
  // Efficiency score favors accuracy over speed
  return Math.round((normalizedAccuracy * 0.7 + normalizedSpeed * 0.3) * 100);
}

/**
 * Generate color palette for charts
 */
export function getChartColors(): {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  muted: string;
} {
  return {
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    muted: 'hsl(var(--muted-foreground))',
  };
}
