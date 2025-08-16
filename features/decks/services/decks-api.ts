import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/api';
import type {
  Deck,
  DeckCard,
  CreateDeckRequest,
  UpdateDeckRequest,
  DeckSearchParams,
  PageableResponse,
  PresignedUploadResponse
} from '../types';

export class DecksApi {
  /**
   * Search public decks (no authentication required)
   * GET /v1/decks
   */
  static async searchPublicDecks(params: DeckSearchParams = {}): Promise<ApiResponse<PageableResponse<DeckCard>>> {
    const searchParams = new URLSearchParams();
    
    if (params.q) searchParams.append('q', params.q);
    if (params.topicId) searchParams.append('topicId', params.topicId.toString());
    if (params.cefr) searchParams.append('cefr', params.cefr);
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.sort) searchParams.append('sort', params.sort);

    const response = await apiClient.get(`/v1/decks?${searchParams.toString()}`);
    return response.data;
  }

  /**
   * Search user's own decks (authentication required)
   * GET /v1/decks/me
   */
  static async searchMyDecks(params: DeckSearchParams = {}): Promise<ApiResponse<PageableResponse<DeckCard>>> {
    const searchParams = new URLSearchParams();
    
    if (params.q) searchParams.append('q', params.q);
    if (params.topicId) searchParams.append('topicId', params.topicId.toString());
    if (params.cefr) searchParams.append('cefr', params.cefr);
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.size !== undefined) searchParams.append('size', params.size.toString());
    if (params.sort) searchParams.append('sort', params.sort);

    const response = await apiClient.get(`/v1/decks/me?${searchParams.toString()}`);
    return response.data;
  }

  /**
   * Create a new deck
   * POST /v1/decks
   */
  static async createDeck(data: CreateDeckRequest): Promise<ApiResponse<Deck>> {
    const response = await apiClient.post('/v1/decks', data);
    return response.data;
  }

  /**
   * Get deck by ID
   * GET /v1/decks/{id}
   */
  static async getDeckById(id: number): Promise<ApiResponse<Deck>> {
    const response = await apiClient.get(`/v1/decks/${id}`);
    return response.data;
  }

  /**
   * Update deck (owner only)
   * PATCH /v1/decks/{id}
   */
  static async updateDeck(id: number, data: UpdateDeckRequest): Promise<ApiResponse<Deck>> {
    const response = await apiClient.patch(`/v1/decks/${id}`, data);
    return response.data;
  }

  /**
   * Delete deck (soft delete, owner only)
   * DELETE /v1/decks/{id}
   */
  static async deleteDeck(id: number): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.delete(`/v1/decks/${id}`);
    return response.data;
  }

  /**
   * Get presigned URL for thumbnail upload
   * POST /v1/decks/{id}/thumbnail/presign
   */
  static async getPresignedUploadUrl(
    deckId: number, 
    contentType: string
  ): Promise<ApiResponse<PresignedUploadResponse>> {
    const params = new URLSearchParams({ contentType });
    const response = await apiClient.post(`/v1/decks/${deckId}/thumbnail/presign?${params.toString()}`);
    return response.data;
  }

  /**
   * Confirm thumbnail upload
   * POST /v1/decks/{id}/thumbnail/confirm
   */
  static async confirmThumbnailUpload(
    deckId: number, 
    publicUrl: string
  ): Promise<ApiResponse<string>> {
    const params = new URLSearchParams({ publicUrl });
    const response = await apiClient.post(`/v1/decks/${deckId}/thumbnail/confirm?${params.toString()}`);
    return response.data;
  }

  /**
   * Upload file to presigned URL (external call to S3/R2)
   */
  static async uploadFile(uploadUrl: string, file: File): Promise<Response> {
    return fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
  }

  /**
   * Complete image upload workflow
   */
  static async uploadDeckThumbnail(
    deckId: number, 
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    try {
      // Step 1: Get presigned URL
      const presignedResponse = await this.getPresignedUploadUrl(deckId, file.type);
      
      if (!presignedResponse.success) {
        throw new Error(presignedResponse.message || 'Failed to get upload URL');
      }

      const { uploadUrl, publicUrl } = presignedResponse.data;

      // Step 2: Upload file to presigned URL
      if (onProgress) onProgress(25);
      
      const uploadResponse = await this.uploadFile(uploadUrl, file);
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      if (onProgress) onProgress(75);

      // Step 3: Confirm upload
      const confirmResponse = await this.confirmThumbnailUpload(deckId, publicUrl);
      
      if (!confirmResponse.success) {
        throw new Error(confirmResponse.message || 'Failed to confirm upload');
      }

      if (onProgress) onProgress(100);

      return confirmResponse.data;
    } catch (error) {
      if (onProgress) onProgress(0);
      throw error;
    }
  }
}

// Export individual methods for easier mocking in tests
export const {
  searchPublicDecks,
  searchMyDecks,
  createDeck,
  getDeckById,
  updateDeck,
  deleteDeck,
  getPresignedUploadUrl,
  confirmThumbnailUpload,
  uploadFile,
  uploadDeckThumbnail
} = DecksApi;
