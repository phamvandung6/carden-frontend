// Analytics Store
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  AnalyticsState,
  UserStatisticsOverview,
  SimplifiedOverview,
  PerformanceStatistics,
  StudyStreaks,
  AnalyticsSummary,
  StudyInsight,
  DeckStatistics
} from '../types';

interface AnalyticsStore extends AnalyticsState {
  // Overview Actions
  setOverview: (overview: UserStatisticsOverview) => void;
  setSimplifiedOverview: (overview: SimplifiedOverview) => void;
  
  // Performance Actions
  setPerformance: (performance: PerformanceStatistics) => void;
  
  // Streaks Actions
  setStreaks: (streaks: StudyStreaks) => void;
  
  // Summary Actions
  setSummary: (summary: AnalyticsSummary) => void;
  
  // Insights Actions
  setInsights: (insights: StudyInsight[]) => void;
  
  // Deck Stats Actions
  setDeckStats: (deckId: number, stats: DeckStatistics) => void;
  setMultipleDeckStats: (deckStats: Record<number, DeckStatistics>) => void;
  removeDeckStats: (deckId: number) => void;
  
  // Loading and Error Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Utility Actions
  clearAll: () => void;
  clearCache: () => void;
  refreshLastUpdated: () => void;
  
  // Cache management
  isCacheValid: (maxAgeMs?: number) => boolean;
  
  // Computed getters
  getOverallProgress: () => number;
  getStreakProgress: () => number;
  getMostDifficultDeck: () => number | null;
  getBestPerformingDeck: () => number | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useAnalyticsStore = create<AnalyticsStore>()(
  immer((set, get) => ({
    // Initial state
    overview: null,
    simplifiedOverview: null,
    performance: null,
    streaks: null,
    summary: null,
    insights: null,
    deckStats: {},
    isLoading: false,
    error: null,
    lastUpdated: null,

    // Overview Actions
    setOverview: (overview) => {
      set((state) => {
        state.overview = overview;
        state.lastUpdated = Date.now();
        state.error = null;
      });
    },

    setSimplifiedOverview: (overview) => {
      set((state) => {
        state.simplifiedOverview = overview;
        state.lastUpdated = Date.now();
        state.error = null;
      });
    },

    // Performance Actions
    setPerformance: (performance) => {
      set((state) => {
        state.performance = performance;
        state.lastUpdated = Date.now();
        state.error = null;
      });
    },

    // Streaks Actions
    setStreaks: (streaks) => {
      set((state) => {
        state.streaks = streaks;
        state.lastUpdated = Date.now();
        state.error = null;
      });
    },

    // Summary Actions
    setSummary: (summary) => {
      set((state) => {
        state.summary = summary;
        state.lastUpdated = Date.now();
        state.error = null;
      });
    },

    // Insights Actions
    setInsights: (insights) => {
      set((state) => {
        state.insights = insights;
        state.lastUpdated = Date.now();
        state.error = null;
      });
    },

    // Deck Stats Actions
    setDeckStats: (deckId, stats) => {
      set((state) => {
        state.deckStats[deckId] = stats;
        state.lastUpdated = Date.now();
        state.error = null;
      });
    },

    setMultipleDeckStats: (deckStats) => {
      set((state) => {
        Object.assign(state.deckStats, deckStats);
        state.lastUpdated = Date.now();
        state.error = null;
      });
    },

    removeDeckStats: (deckId) => {
      set((state) => {
        delete state.deckStats[deckId];
      });
    },

    // Loading and Error Actions
    setLoading: (loading) => {
      set((state) => {
        state.isLoading = loading;
        if (loading) {
          state.error = null;
        }
      });
    },

    setError: (error) => {
      set((state) => {
        state.error = error;
        state.isLoading = false;
      });
    },

    // Utility Actions
    clearAll: () => {
      set((state) => {
        state.overview = null;
        state.simplifiedOverview = null;
        state.performance = null;
        state.streaks = null;
        state.summary = null;
        state.insights = null;
        state.deckStats = {};
        state.error = null;
        state.lastUpdated = null;
        state.isLoading = false;
      });
    },

    clearCache: () => {
      set((state) => {
        state.lastUpdated = null;
      });
    },

    refreshLastUpdated: () => {
      set((state) => {
        state.lastUpdated = Date.now();
      });
    },

    // Cache management
    isCacheValid: (maxAgeMs = CACHE_DURATION) => {
      const { lastUpdated } = get();
      if (!lastUpdated) return false;
      return Date.now() - lastUpdated < maxAgeMs;
    },

    // Computed getters
    getOverallProgress: () => {
      const { overview } = get();
      if (!overview) return 0;
      
      const { totalCards, totalCardsStudied } = overview;
      if (totalCards === 0) return 0;
      
      return Math.min(100, (totalCardsStudied / totalCards) * 100);
    },

    getStreakProgress: () => {
      const { streaks } = get();
      if (!streaks) return 0;
      
      const { currentStreak, nextMilestone } = streaks;
      if (nextMilestone === 0) return 100;
      
      return Math.min(100, (currentStreak / nextMilestone) * 100);
    },

    getMostDifficultDeck: () => {
      const { deckStats } = get();
      let lowestAccuracy = Infinity;
      let difficultDeckId = null;
      
      Object.entries(deckStats).forEach(([deckId, stats]) => {
        if (stats.averageAccuracy < lowestAccuracy && stats.studiedCards > 0) {
          lowestAccuracy = stats.averageAccuracy;
          difficultDeckId = parseInt(deckId);
        }
      });
      
      return difficultDeckId;
    },

    getBestPerformingDeck: () => {
      const { deckStats } = get();
      let highestAccuracy = -1;
      let bestDeckId = null;
      
      Object.entries(deckStats).forEach(([deckId, stats]) => {
        if (stats.averageAccuracy > highestAccuracy && stats.studiedCards > 0) {
          highestAccuracy = stats.averageAccuracy;
          bestDeckId = parseInt(deckId);
        }
      });
      
      return bestDeckId;
    },
  }))
);

// Selectors for easier access
export const analyticsSelectors = {
  // Basic data selectors
  overview: (state: AnalyticsStore) => state.overview,
  simplifiedOverview: (state: AnalyticsStore) => state.simplifiedOverview,
  performance: (state: AnalyticsStore) => state.performance,
  streaks: (state: AnalyticsStore) => state.streaks,
  summary: (state: AnalyticsStore) => state.summary,
  insights: (state: AnalyticsStore) => state.insights,
  deckStats: (state: AnalyticsStore) => state.deckStats,
  
  // Loading and error states
  isLoading: (state: AnalyticsStore) => state.isLoading,
  error: (state: AnalyticsStore) => state.error,
  lastUpdated: (state: AnalyticsStore) => state.lastUpdated,
  
  // Computed selectors
  overallProgress: (state: AnalyticsStore) => state.getOverallProgress(),
  streakProgress: (state: AnalyticsStore) => state.getStreakProgress(),
  mostDifficultDeck: (state: AnalyticsStore) => state.getMostDifficultDeck(),
  bestPerformingDeck: (state: AnalyticsStore) => state.getBestPerformingDeck(),
  
  // Cache selectors
  isCacheValid: (state: AnalyticsStore) => state.isCacheValid(),
  
  // Specific property selectors
  totalCards: (state: AnalyticsStore) => state.overview?.totalCards || 0,
  totalSessions: (state: AnalyticsStore) => state.overview?.totalSessions || 0,
  overallAccuracy: (state: AnalyticsStore) => state.overview?.overallAccuracy || 0,
  currentStreak: (state: AnalyticsStore) => state.streaks?.currentStreak || 0,
  longestStreak: (state: AnalyticsStore) => state.streaks?.longestStreak || 0,
  totalStudyTime: (state: AnalyticsStore) => state.overview?.totalStudyTimeMinutes || 0,
  
  // Insight selectors
  highPriorityInsights: (state: AnalyticsStore) => 
    state.insights?.filter(insight => insight.priority === 'HIGH') || [],
  actionableInsights: (state: AnalyticsStore) => 
    state.insights?.filter(insight => insight.actionable) || [],
  positiveInsights: (state: AnalyticsStore) => 
    state.insights?.filter(insight => insight.priority === 'POSITIVE') || [],
  
  // Deck-specific selectors
  getDeckStats: (deckId: number) => (state: AnalyticsStore) => state.deckStats[deckId],
  hasDataForDeck: (deckId: number) => (state: AnalyticsStore) => deckId in state.deckStats,
};
