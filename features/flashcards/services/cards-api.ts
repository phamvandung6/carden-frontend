import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types';
import type {
  Card,
  CardCreateRequest,
  CardUpdateRequest,
  CardQueryParams,
  CardsResponse,
  BulkCardCreateRequest,
  ImageUploadRequest,
  ImageUploadResponse,
  ImageConfirmRequest,
  DuplicateCheckRequest,
} from '../types';

/**
 * Cards API Service
 * Handles all card-related API operations
 */
export class CardsApiService {
  private static readonly BASE_PATH = '/v1';

  /**
   * Create a new card in a deck
   * POST /v1/decks/{deckId}/cards
   */
  static async createCard(deckId: number, data: CardCreateRequest): Promise<Card> {
    const response: ApiResponse<Card> = await apiClient.post(
      `${this.BASE_PATH}/decks/${deckId}/cards`,
      data
    );
    return response.data;
  }

  /**
   * Get cards by deck with filtering and pagination
   * GET /v1/decks/{deckId}/cards
   */
  static async getCardsByDeck(
    deckId: number,
    params?: CardQueryParams
  ): Promise<CardsResponse> {
    const response: ApiResponse<CardsResponse> = await apiClient.get(
      `${this.BASE_PATH}/decks/${deckId}/cards`,
      { params }
    );
    return response.data;
  }

  /**
   * Get card by ID
   * GET /v1/cards/{cardId}
   */
  static async getCardById(cardId: number): Promise<Card> {
    const response: ApiResponse<Card> = await apiClient.get(
      `${this.BASE_PATH}/cards/${cardId}`
    );
    return response.data;
  }

  /**
   * Update card
   * PATCH /v1/cards/{cardId}
   */
  static async updateCard(cardId: number, data: CardUpdateRequest): Promise<Card> {
    const response: ApiResponse<Card> = await apiClient.patch(
      `${this.BASE_PATH}/cards/${cardId}`,
      data
    );
    return response.data;
  }

  /**
   * Delete card (soft delete)
   * DELETE /v1/cards/{cardId}
   */
  static async deleteCard(cardId: number): Promise<void> {
    const response: ApiResponse<void> = await apiClient.delete(
      `${this.BASE_PATH}/cards/${cardId}`
    );
    return response.data;
  }

  /**
   * Bulk create cards
   * POST /v1/decks/{deckId}/cards/bulk
   */
  static async bulkCreateCards(
    deckId: number,
    data: BulkCardCreateRequest
  ): Promise<Card[]> {
    const response: ApiResponse<Card[]> = await apiClient.post(
      `${this.BASE_PATH}/decks/${deckId}/cards/bulk`,
      data
    );
    return response.data;
  }

  /**
   * Get card count for a deck
   * GET /v1/decks/{deckId}/cards/count
   */
  static async getCardCount(deckId: number): Promise<number> {
    const response: ApiResponse<number> = await apiClient.get(
      `${this.BASE_PATH}/decks/${deckId}/cards/count`
    );
    return response.data;
  }

  /**
   * Check for duplicate cards
   * POST /v1/cards/{cardId}/duplicate-check
   */
  static async checkDuplicate(
    cardId: number,
    data: DuplicateCheckRequest
  ): Promise<boolean> {
    const response: ApiResponse<boolean> = await apiClient.post(
      `${this.BASE_PATH}/cards/${cardId}/duplicate-check`,
      data
    );
    return response.data;
  }

  /**
   * Get presigned URL for image upload
   * POST /v1/cards/{cardId}/image/presign
   */
  static async getImageUploadUrl(
    cardId: number,
    contentType: string
  ): Promise<ImageUploadResponse> {
    const response: ApiResponse<ImageUploadResponse> = await apiClient.post(
      `${this.BASE_PATH}/cards/${cardId}/image/presign`,
      {},
      {
        params: { contentType }
      }
    );
    return response.data;
  }

  /**
   * Confirm image upload
   * POST /v1/cards/{cardId}/image/confirm
   */
  static async confirmImageUpload(
    cardId: number,
    publicUrl: string
  ): Promise<string> {
    const response: ApiResponse<string> = await apiClient.post(
      `${this.BASE_PATH}/cards/${cardId}/image/confirm`,
      {},
      {
        params: { publicUrl }
      }
    );
    return response.data;
  }

  /**
   * Upload image directly to presigned URL
   * This is a utility method to handle the complete image upload process
   */
  static async uploadImage(
    cardId: number,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    // Step 1: Get presigned URL
    const uploadData = await this.getImageUploadUrl(cardId, file.type);

    // Step 2: Upload file to presigned URL
    const formData = new FormData();
    formData.append('file', file);

    try {
      await fetch(uploadData.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      // Step 3: Confirm upload
      const confirmedUrl = await this.confirmImageUpload(cardId, uploadData.publicUrl);
      return confirmedUrl;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error}`);
    }
  }

  /**
   * Search cards across multiple decks (if needed in the future)
   * This would require a backend endpoint to search across all user's cards
   */
  static async searchCards(query: string, params?: CardQueryParams): Promise<CardsResponse> {
    // Note: This endpoint doesn't exist in the current API documentation
    // but could be useful for global card search functionality
    const response: ApiResponse<CardsResponse> = await apiClient.get(
      `${this.BASE_PATH}/cards/search`,
      {
        params: {
          ...params,
          search: query,
        }
      }
    );
    return response.data;
  }
}

// Export individual methods for easier consumption
export const {
  createCard,
  getCardsByDeck,
  getCardById,
  updateCard,
  deleteCard,
  bulkCreateCards,
  getCardCount,
  checkDuplicate,
  getImageUploadUrl,
  confirmImageUpload,
  uploadImage,
  searchCards,
} = CardsApiService;

// Default export
export default CardsApiService;
