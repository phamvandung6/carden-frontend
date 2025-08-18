'use client';

// Progress Data Hook for Charts
import { useMemo } from 'react';
import { useAnalytics } from './use-analytics';
import type { ChartDataPoint, ProgressChartData } from '../types';

export function useProgressData() {
  const { performance, streaks, summary, isLoading, error } = useAnalytics();

  // Transform accuracy trend data for charts
  const accuracyChartData = useMemo((): ChartDataPoint[] => {
    if (!performance?.accuracyTrend) return [];
    
    return performance.accuracyTrend.map((point) => ({
      date: new Date(point.date).toLocaleDateString(),
      value: Math.round(point.accuracy * 100) / 100, // Round to 2 decimal places
      label: `${Math.round(point.accuracy)}%`
    }));
  }, [performance?.accuracyTrend]);

  // Transform weekly trends for study time charts
  const studyTimeChartData = useMemo((): ChartDataPoint[] => {
    if (!performance?.weeklyTrends) return [];
    
    return performance.weeklyTrends.map((trend) => ({
      date: `Week ${trend.week}, ${trend.year}`,
      value: trend.studyTime,
      label: `${trend.studyTime} min`
    }));
  }, [performance?.weeklyTrends]);

  // Transform weekly trends for cards studied charts
  const cardsStudiedChartData = useMemo((): ChartDataPoint[] => {
    if (!performance?.weeklyTrends) return [];
    
    return performance.weeklyTrends.map((trend) => ({
      date: `Week ${trend.week}, ${trend.year}`,
      value: trend.cardsStudied,
      label: `${trend.cardsStudied} cards`
    }));
  }, [performance?.weeklyTrends]);

  // Transform weekly trends for sessions charts
  const sessionsChartData = useMemo((): ChartDataPoint[] => {
    if (!performance?.weeklyTrends) return [];
    
    return performance.weeklyTrends.map((trend) => ({
      date: `Week ${trend.week}, ${trend.year}`,
      value: trend.sessions,
      label: `${trend.sessions} sessions`
    }));
  }, [performance?.weeklyTrends]);

  // Combined progress chart data
  const progressChartData = useMemo((): ProgressChartData => ({
    accuracy: accuracyChartData,
    studyTime: studyTimeChartData,
    cardsStudied: cardsStudiedChartData,
  }), [accuracyChartData, studyTimeChartData, cardsStudiedChartData]);

  // Generate streak calendar data (for heatmap visualization)
  const streakCalendarData = useMemo(() => {
    if (!streaks?.studyDates) return [];
    
    // Create a map of study dates for easy lookup
    const studyDateSet = new Set(streaks.studyDates);
    
    // Generate last 365 days
    const calendarData = [];
    const today = new Date();
    
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      calendarData.push({
        date: dateString,
        value: studyDateSet.has(dateString) ? 1 : 0,
        label: studyDateSet.has(dateString) ? 'Studied' : 'No study'
      });
    }
    
    return calendarData;
  }, [streaks?.studyDates]);

  // Card state distribution for pie charts
  const cardStateData = useMemo(() => {
    const distribution = summary?.distribution || performance?.dailyAverages;
    if (!distribution) return [];
    
    return Object.entries(distribution).map(([state, count]) => ({
      name: state,
      value: count as number,
      label: `${state}: ${count}`
    }));
  }, [summary?.distribution, performance?.dailyAverages]);

  // Daily averages comparison data
  const dailyAveragesData = useMemo(() => {
    if (!performance?.dailyAverages) return [];
    
    const { averageCards, averageAccuracy, averageStudyTime, averageSessions } = performance.dailyAverages;
    
    return [
      { metric: 'Cards', value: averageCards, label: `${averageCards} cards/day` },
      { metric: 'Accuracy', value: averageAccuracy, label: `${Math.round(averageAccuracy)}%` },
      { metric: 'Study Time', value: averageStudyTime, label: `${averageStudyTime} min/day` },
      { metric: 'Sessions', value: averageSessions, label: `${averageSessions} sessions/day` },
    ];
  }, [performance?.dailyAverages]);

  // Performance trends (improvement rate and consistency)
  const performanceTrends = useMemo(() => {
    if (!performance) return null;
    
    return {
      improvementRate: {
        value: performance.improvementRate,
        label: `${performance.improvementRate > 0 ? '+' : ''}${Math.round(performance.improvementRate * 100)}%`,
        isPositive: performance.improvementRate > 0,
      },
      consistency: {
        value: performance.consistency,
        label: `${Math.round(performance.consistency * 100)}%`,
        isGood: performance.consistency > 0.7, // Arbitrary threshold for "good" consistency
      }
    };
  }, [performance]);

  // Study efficiency metrics
  const efficiencyMetrics = useMemo(() => {
    if (!performance) return null;
    
    const avgSessionDuration = performance.totalStudyTime / performance.totalSessions;
    const cardsPerMinute = performance.cardsStudied / performance.totalStudyTime;
    
    return {
      avgSessionDuration: {
        value: avgSessionDuration,
        label: `${Math.round(avgSessionDuration)} min/session`
      },
      cardsPerMinute: {
        value: cardsPerMinute,
        label: `${Math.round(cardsPerMinute * 100) / 100} cards/min`
      },
      totalEfficiency: {
        value: performance.averageAccuracy * cardsPerMinute,
        label: 'Efficiency Score'
      }
    };
  }, [performance]);

  // Time period options for charts
  const timePeriodOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 3 months' },
    { value: '1y', label: 'Last year' },
  ];

  return {
    // Chart data
    progressChartData,
    accuracyChartData,
    studyTimeChartData,
    cardsStudiedChartData,
    sessionsChartData,
    streakCalendarData,
    cardStateData,
    dailyAveragesData,
    
    // Analysis data
    performanceTrends,
    efficiencyMetrics,
    
    // Utility
    timePeriodOptions,
    hasData: !!performance || !!summary,
    
    // State
    isLoading,
    error,
    
    // Raw data access
    rawPerformance: performance,
    rawStreaks: streaks,
    rawSummary: summary,
  };
}
