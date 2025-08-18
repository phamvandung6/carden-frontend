'use client';

// Analytics Hooks
import { useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAnalyticsStore, analyticsSelectors } from '../stores/analytics-store';
import { analyticsApi } from '../services/analytics-api';
import { queryKeys } from '@/lib/utils/query-keys';
import { handleMutationError } from '@/lib/utils/query-error-handler';
import type { PerformanceQueryParams } from '../types';

export function useAnalytics() {
  const queryClient = useQueryClient();
  
  // Store state and actions
  const overview = useAnalyticsStore(analyticsSelectors.overview);
  const simplifiedOverview = useAnalyticsStore(analyticsSelectors.simplifiedOverview);
  const performance = useAnalyticsStore(analyticsSelectors.performance);
  const streaks = useAnalyticsStore(analyticsSelectors.streaks);
  const summary = useAnalyticsStore(analyticsSelectors.summary);
  const insights = useAnalyticsStore(analyticsSelectors.insights);
  const deckStats = useAnalyticsStore(analyticsSelectors.deckStats);
  const isLoading = useAnalyticsStore(analyticsSelectors.isLoading);
  const error = useAnalyticsStore(analyticsSelectors.error);
  const lastUpdated = useAnalyticsStore(analyticsSelectors.lastUpdated);
  const isCacheValid = useAnalyticsStore(analyticsSelectors.isCacheValid);

  const {
    setOverview,
    setSimplifiedOverview,
    setPerformance,
    setStreaks,
    setSummary,
    setInsights,
    setDeckStats,
    setMultipleDeckStats,
    setLoading,
    setError,
    clearAll,
    clearCache,
  } = useAnalyticsStore();

  // Summary query (primary query for dashboard - most efficient)
  const summaryQuery = useQuery({
    queryKey: queryKeys.analytics.summary(),
    queryFn: analyticsApi.getSummary,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });

  // Other queries - only enabled when specifically needed
  const overviewQuery = useQuery({
    queryKey: queryKeys.analytics.overview(),
    queryFn: analyticsApi.getOverview,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    enabled: false, // Only fetch when explicitly requested
  });

  const simplifiedOverviewQuery = useQuery({
    queryKey: queryKeys.analytics.simplifiedOverview(),
    queryFn: analyticsApi.getSimplifiedOverview,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    enabled: false, // Only fetch when explicitly requested
  });

  const streaksQuery = useQuery({
    queryKey: queryKeys.analytics.streaks(),
    queryFn: analyticsApi.getStreaks,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    enabled: false, // Only fetch when explicitly requested
  });

  const insightsQuery = useQuery({
    queryKey: queryKeys.analytics.insights(),
    queryFn: analyticsApi.getInsights,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    enabled: false, // Only fetch when explicitly requested
  });

  // Performance query with parameters
  const usePerformanceQuery = (params?: PerformanceQueryParams) => {
    return useQuery({
      queryKey: queryKeys.analytics.performance(params as Record<string, unknown>),
      queryFn: () => analyticsApi.getPerformance(params),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    });
  };

  // Recent performance (30 days)
  const recentPerformanceQuery = useQuery({
    queryKey: queryKeys.analytics.performance({ period: '30d' }),
    queryFn: () => analyticsApi.getRecentPerformance(),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    enabled: false, // Only fetch when explicitly requested
  });

  // Deck stats query
  const useDeckStatsQuery = (deckId: number) => {
    return useQuery({
      queryKey: queryKeys.analytics.deckStats(deckId),
      queryFn: () => analyticsApi.getDeckStats(deckId),
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    });
  };

  // Multiple deck stats query
  const useMultipleDeckStatsQuery = (deckIds: number[]) => {
    return useQuery({
      queryKey: queryKeys.analytics.multipleDeckStats(deckIds),
      queryFn: () => analyticsApi.getMultipleDeckStats(deckIds),
      enabled: deckIds.length > 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    });
  };

  // Only handle summary query data - main dashboard data source
  useEffect(() => {
    if (summaryQuery.data?.success && summaryQuery.data.data) {
      setSummary(summaryQuery.data.data);
    }
    if (summaryQuery.error) {
      handleMutationError(summaryQuery.error, 'analytics summary');
      setError(summaryQuery.error instanceof Error ? summaryQuery.error.message : 'Failed to load analytics summary');
    }
  }, [summaryQuery.data, summaryQuery.error, setSummary, setError]);

  // Refresh data mutation
  const refreshMutation = useMutation({
    mutationFn: async () => {
      clearCache();
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all }),
      ]);
    },
  });

  // Helper functions with error handling
  const refreshAllData = useCallback(async () => {
    try {
      return await refreshMutation.mutateAsync();
    } catch (error) {
      handleMutationError(error, 'refresh analytics data');
      setError(error instanceof Error ? error.message : 'Failed to refresh data');
      throw error;
    }
  }, [refreshMutation, setError]);

  const clearAllData = useCallback(() => {
    clearAll();
    queryClient.removeQueries({ queryKey: queryKeys.analytics.all });
  }, [clearAll, queryClient]);

  // Load dashboard data - summary query only
  const loadDashboardData = useCallback(async () => {
    // Summary query is already auto-fetching, no need for manual loading
    if (!summaryQuery.data && !summaryQuery.isLoading) {
      await summaryQuery.refetch();
    }
  }, [summaryQuery.data, summaryQuery.isLoading, summaryQuery.refetch]);

  // Enable and load specific queries when needed
  const loadOverview = useCallback(async () => {
    const result = await overviewQuery.refetch();
    if (result.data?.success && result.data.data) {
      setOverview(result.data.data);
    }
  }, [overviewQuery.refetch, setOverview]);

  const loadStreaks = useCallback(async () => {
    const result = await streaksQuery.refetch();
    if (result.data?.success && result.data.data) {
      setStreaks(result.data.data);
    }
  }, [streaksQuery.refetch, setStreaks]);

  const loadInsights = useCallback(async () => {
    const result = await insightsQuery.refetch();
    if (result.data?.success && result.data.data) {
      setInsights(result.data.data);
    }
  }, [insightsQuery.refetch, setInsights]);

  const loadPerformance = useCallback(async () => {
    const result = await recentPerformanceQuery.refetch();
    if (result.data?.success && result.data.data) {
      setPerformance(result.data.data);
    }
  }, [recentPerformanceQuery.refetch, setPerformance]);

  // Load all detailed data
  const loadDetailedData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadOverview(),
        loadStreaks(),
        loadPerformance(),
        loadInsights(),
      ]);
    } catch (error) {
      handleMutationError(error, 'load detailed data');
      setError(error instanceof Error ? error.message : 'Failed to load detailed data');
    } finally {
      setLoading(false);
    }
  }, [loadOverview, loadStreaks, loadPerformance, loadInsights, setLoading, setError]);

  return {
    // Data
    overview,
    simplifiedOverview,
    performance,
    streaks,
    summary,
    insights,
    deckStats,
    
    // State
    isLoading: isLoading || summaryQuery.isLoading,
    error,
    lastUpdated,
    isCacheValid,
    
    // Query objects for custom usage
    overviewQuery,
    simplifiedOverviewQuery,
    summaryQuery,
    streaksQuery,
    insightsQuery,
    recentPerformanceQuery,
    
    // Query hooks for components
    usePerformanceQuery,
    useDeckStatsQuery,
    useMultipleDeckStatsQuery,
    
    // Actions
    refreshAllData,
    clearAllData,
    loadDashboardData,
    loadDetailedData,
    loadOverview,
    loadStreaks,
    loadInsights,
    loadPerformance,
    
    // Computed values from store
    overallProgress: useAnalyticsStore(analyticsSelectors.overallProgress),
    streakProgress: useAnalyticsStore(analyticsSelectors.streakProgress),
    mostDifficultDeck: useAnalyticsStore(analyticsSelectors.mostDifficultDeck),
    bestPerformingDeck: useAnalyticsStore(analyticsSelectors.bestPerformingDeck),
    
    // Quick access to key metrics
    totalCards: useAnalyticsStore(analyticsSelectors.totalCards),
    totalSessions: useAnalyticsStore(analyticsSelectors.totalSessions),
    overallAccuracy: useAnalyticsStore(analyticsSelectors.overallAccuracy),
    currentStreak: useAnalyticsStore(analyticsSelectors.currentStreak),
    longestStreak: useAnalyticsStore(analyticsSelectors.longestStreak),
    totalStudyTime: useAnalyticsStore(analyticsSelectors.totalStudyTime),
    
    // Insight helpers
    highPriorityInsights: useAnalyticsStore(analyticsSelectors.highPriorityInsights),
    actionableInsights: useAnalyticsStore(analyticsSelectors.actionableInsights),
    positiveInsights: useAnalyticsStore(analyticsSelectors.positiveInsights),
    
    // Utility
    isRefreshing: refreshMutation.isPending,
  };
}
