import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  PracticeSession,
  StartPracticeSessionRequest,
  SubmitReviewRequest,
  PracticeCard,
  ReviewResult,
  SessionSummary,
  DueCardsCount,
  PaginatedCards,
  DueCardsQueryParams,
  NewCardsQueryParams,
  LearningCardsQueryParams,
  DeckStatistics,
  SubmitTypeAnswerRequest,
  SubmitMultipleChoiceRequest
} from '../types/practice-session';
import type {
  StudyStatistics,
  LearningProgress,
  ReviewSchedule,
  SRSMetrics
} from '../types/srs-types';

export class StudyApi {
  // ===== PRACTICE SESSION MANAGEMENT =====
  
  /**
   * Start a new practice session
   * POST /v1/practice/sessions
   */
  static async startPracticeSession(request: StartPracticeSessionRequest): Promise<ApiResponse<PracticeSession>> {
    return apiClient.post('/v1/practice/sessions', request);
  }

  /**
   * Get current active practice session
   * GET /v1/practice/sessions/current
   */
  static async getCurrentSession(): Promise<ApiResponse<PracticeSession> | null> {
    try {
      return await apiClient.get('/v1/practice/sessions/current');
    } catch (error) {
      // If no session is active, return null instead of throwing
      return null;
    }
  }

  /**
   * Complete practice session and get summary
   * POST /v1/practice/sessions/{sessionId}/complete
   */
  static async completeSession(sessionId: number): Promise<ApiResponse<SessionSummary>> {
    return apiClient.post(`/v1/practice/sessions/${sessionId}/complete`);
  }

  // ===== CARD MANAGEMENT =====

  /**
   * Get next card for practice using intelligent algorithm
   * GET /v1/practice/next-card
   */
  static async getNextCard(deckId?: number): Promise<ApiResponse<PracticeCard> | null> {
    const params = new URLSearchParams();
    if (deckId) params.append('deckId', deckId.toString());

    try {
      return await apiClient.get(`/v1/practice/next-card?${params.toString()}`);
    } catch (error) {
      // No more cards available
      return null;
    }
  }

  /**
   * Submit card review with grade
   * POST /v1/practice/cards/{cardId}/review
   */
  static async submitReview(cardId: number, request: SubmitReviewRequest): Promise<ApiResponse<ReviewResult>> {
    return apiClient.post(`/v1/practice/cards/${cardId}/review`, request);
  }

  /**
   * Get due cards with pagination
   * GET /v1/practice/due-cards
   */
  static async getDueCards(params: DueCardsQueryParams = {}): Promise<ApiResponse<PaginatedCards>> {
    const searchParams = new URLSearchParams();
    
    if (params.deckId) searchParams.append('deckId', params.deckId.toString());
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());

    return apiClient.get(`/v1/practice/due-cards?${searchParams.toString()}`);
  }

  /**
   * Get new cards with pagination
   * GET /v1/practice/cards/new
   */
  static async getNewCards(params: NewCardsQueryParams = {}): Promise<ApiResponse<PaginatedCards>> {
    const searchParams = new URLSearchParams();
    
    if (params.deckId) searchParams.append('deckId', params.deckId.toString());
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());

    return apiClient.get(`/v1/practice/cards/new?${searchParams.toString()}`);
  }

  /**
   * Get learning cards (failed cards being relearned)
   * GET /v1/practice/cards/learning
   */
  static async getLearningCards(params: LearningCardsQueryParams = {}): Promise<ApiResponse<PracticeCard[]>> {
    const searchParams = new URLSearchParams();
    
    if (params.deckId) searchParams.append('deckId', params.deckId.toString());

    return apiClient.get(`/v1/practice/cards/learning?${searchParams.toString()}`);
  }

  /**
   * Get count of due cards by type
   * GET /v1/practice/cards/due-count
   */
  static async getDueCardsCount(deckId?: number): Promise<ApiResponse<DueCardsCount>> {
    const params = new URLSearchParams();
    if (deckId) params.append('deckId', deckId.toString());

    return apiClient.get(`/v1/practice/cards/due-count?${params.toString()}`);
  }

  /**
   * Get deck practice statistics
   * GET /v1/practice/deck/{deckId}/statistics
   */
  static async getDeckStatistics(deckId: number): Promise<ApiResponse<DeckStatistics>> {
    return apiClient.get(`/v1/practice/deck/${deckId}/statistics`);
  }

  // ===== ADVANCED PRACTICE MODES =====

  /**
   * Get card formatted for type-answer mode
   * GET /v1/practice/cards/{cardId}/type-answer
   */
  static async getTypeAnswerCard(cardId: number): Promise<ApiResponse<PracticeCard>> {
    return apiClient.get(`/v1/practice/cards/${cardId}/type-answer`);
  }

  /**
   * Get card formatted for multiple choice mode
   * GET /v1/practice/cards/{cardId}/multiple-choice
   */
  static async getMultipleChoiceCard(cardId: number): Promise<ApiResponse<PracticeCard>> {
    return apiClient.get(`/v1/practice/cards/${cardId}/multiple-choice`);
  }

  /**
   * Submit type-answer review with automatic validation
   * POST /v1/practice/cards/type-answer/review
   */
  static async submitTypeAnswerReview(request: SubmitTypeAnswerRequest): Promise<ApiResponse<ReviewResult>> {
    return apiClient.post('/v1/practice/cards/type-answer/review', request);
  }

  /**
   * Submit multiple choice review with automatic validation
   * POST /v1/practice/cards/multiple-choice/review
   */
  static async submitMultipleChoiceReview(request: SubmitMultipleChoiceRequest): Promise<ApiResponse<ReviewResult>> {
    return apiClient.post('/v1/practice/cards/multiple-choice/review', request);
  }

  // ===== STATISTICS AND ANALYTICS =====
  // Note: These endpoints are not documented in practice.md but are commonly needed for SRS systems

  /**
   * Get overall study statistics
   * GET /v1/practice/statistics
   */
  static async getStudyStatistics(): Promise<ApiResponse<StudyStatistics>> {
    return apiClient.get('/v1/practice/statistics');
  }

  /**
   * Get SRS algorithm metrics
   * GET /v1/practice/srs-metrics
   */
  static async getSRSMetrics(): Promise<ApiResponse<SRSMetrics>> {
    return apiClient.get('/v1/practice/srs-metrics');
  }

  /**
   * Get learning progress across all decks
   * GET /v1/practice/learning-progress
   */
  static async getLearningProgress(): Promise<ApiResponse<LearningProgress[]>> {
    return apiClient.get('/v1/practice/learning-progress');
  }

  /**
   * Get review schedule overview
   * GET /v1/practice/review-schedule
   */
  static async getReviewSchedule(): Promise<ApiResponse<ReviewSchedule>> {
    return apiClient.get('/v1/practice/review-schedule');
  }
}

// Convenient named exports for common operations
export const startPracticeSession = StudyApi.startPracticeSession;
export const getCurrentSession = StudyApi.getCurrentSession;
export const completeSession = StudyApi.completeSession;
export const getNextCard = StudyApi.getNextCard;
export const submitReview = StudyApi.submitReview;
export const getDueCards = StudyApi.getDueCards;
export const getNewCards = StudyApi.getNewCards;
export const getLearningCards = StudyApi.getLearningCards;
export const getDueCardsCount = StudyApi.getDueCardsCount;
export const getDeckStatistics = StudyApi.getDeckStatistics;
export const getStudyStatistics = StudyApi.getStudyStatistics;
export const getSRSMetrics = StudyApi.getSRSMetrics;
export const getLearningProgress = StudyApi.getLearningProgress;
export const getReviewSchedule = StudyApi.getReviewSchedule;

