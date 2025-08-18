// Analytics API Service
// Based on analytics API endpoints documentation: /v1/analytics/*

import { apiClient } from '@/lib/api/client';
import type {
  AnalyticsOverviewResponse,
  SimplifiedOverviewResponse,
  PerformanceResponse,
  StreaksResponse,
  DeckStatsResponse,
  SummaryResponse,
  InsightsResponse,
  PerformanceQueryParams
} from '../types';

export const analyticsApi = {
  /**
   * Get comprehensive user statistics overview
   * GET /v1/analytics/overview
   * Requires authentication
   */
  async getOverview(): Promise<AnalyticsOverviewResponse> {
    return apiClient.get('/v1/analytics/overview');
  },

  /**
   * Get simplified overview for dashboard
   * GET /v1/analytics/overview/simplified
   * Requires authentication
   * Returns optimized data for quick dashboard display
   */
  async getSimplifiedOverview(): Promise<SimplifiedOverviewResponse> {
    return apiClient.get('/v1/analytics/overview/simplified');
  },

  /**
   * Get performance statistics with time-based filtering
   * GET /v1/analytics/performance
   * Requires authentication
   * 
   * @param params - Query parameters for filtering performance data
   */
  async getPerformance(params?: PerformanceQueryParams): Promise<PerformanceResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params?.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    if (params?.period) {
      queryParams.append('period', params.period);
    }

    const queryString = queryParams.toString();
    const url = `/v1/analytics/performance${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get(url);
  },

  /**
   * Get study streak information
   * GET /v1/analytics/streaks
   * Requires authentication
   */
  async getStreaks(): Promise<StreaksResponse> {
    return apiClient.get('/v1/analytics/streaks');
  },

  /**
   * Get statistics for a specific deck
   * GET /v1/analytics/deck/{deckId}
   * Requires authentication
   * 
   * @param deckId - ID of the deck to get statistics for
   */
  async getDeckStats(deckId: number): Promise<DeckStatsResponse> {
    return apiClient.get(`/v1/analytics/deck/${deckId}`);
  },

  /**
   * Get comprehensive analytics summary
   * GET /v1/analytics/summary
   * Requires authentication
   * Combines data from overview, streaks and 30-day performance
   */
  async getSummary(): Promise<SummaryResponse> {
    return apiClient.get('/v1/analytics/summary');
  },

  /**
   * Get AI-powered study insights and recommendations
   * GET /v1/analytics/insights
   * Requires authentication
   * Returns personalized insights based on study patterns
   */
  async getInsights(): Promise<InsightsResponse> {
    return apiClient.get('/v1/analytics/insights');
  },

  /**
   * Utility method to get performance data for common periods
   */
  async getPerformanceByPeriod(period: '7d' | '30d' | '90d' | '1y'): Promise<PerformanceResponse> {
    return this.getPerformance({ period });
  },

  /**
   * Utility method to get performance data for custom date range
   */
  async getPerformanceByDateRange(startDate: string, endDate: string): Promise<PerformanceResponse> {
    return this.getPerformance({ startDate, endDate });
  },

  /**
   * Get recent performance (last 30 days)
   */
  async getRecentPerformance(): Promise<PerformanceResponse> {
    return this.getPerformanceByPeriod('30d');
  },

  /**
   * Get multiple deck statistics in batch
   * Note: This makes multiple API calls - consider implementing batch endpoint on backend
   */
  async getMultipleDeckStats(deckIds: number[]): Promise<Record<number, DeckStatsResponse>> {
    const results: Record<number, DeckStatsResponse> = {};
    
    // Execute all requests in parallel
    const promises = deckIds.map(async (deckId) => {
      try {
        const stats = await this.getDeckStats(deckId);
        results[deckId] = stats;
      } catch (error) {
        console.error(`Failed to fetch stats for deck ${deckId}:`, error);
        // Don't throw, just skip this deck
      }
    });

    await Promise.all(promises);
    return results;
  }
};
