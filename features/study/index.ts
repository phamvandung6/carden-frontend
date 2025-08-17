// Export all study feature modules
export * from './types';
export * from './services';
export * from './utils';
export * from './constants/study-constants';

// Export hooks specifically to avoid conflicts
export {
  // From use-srs
  useSRS,
  useDueCardsCount,
  useCurrentSession,
  useStartSession,
  useSubmitReview,
  
  // From use-study
  useStudy,
  useDueCards,
  useNewCards,
  useLearningCards,
  useStudyStatistics,
  useSRSMetrics,
  useLearningProgress,
  useReviewSchedule,
  useDeckStatistics,
  useUpdateStudyPreferences,
  useNextCard,
  useRefreshStudyData
} from './hooks';

// Export stores without wildcard to avoid conflicts
export {
  useStudyStore,
  useStudySession,
  useCurrentCard,
  useDueCardsState,
  useStudyPreferences,
  useStudyError,
  useStudyLoading
} from './stores';

// Main study feature exports for easy access
export { StudyApi } from './services';

// Export all components
export * from './components';

// Common types for external use
export type {
  PracticeCard,
  StudyMode,
  Grade,
  PracticeSession,
  SessionSummary,
  ReviewResult,
  DueCardsCount,
  StudyStatistics,
  SRSMetrics,
  LearningProgress,
  ReviewSchedule,
  StudyPreferences
} from './types';
