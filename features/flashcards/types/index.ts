// Card difficulty levels
export type CardDifficulty = 'EASY' | 'NORMAL' | 'HARD';

// Base card interface from API
export interface Card {
  id: number;
  deckId: number;
  front: string;
  back: string;
  ipaPronunciation?: string;
  imageUrl?: string;
  audioUrl?: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  tags?: string[];
  difficulty: CardDifficulty;
  displayOrder: number;
  uniqueKey: string;
  createdAt: string;
  updatedAt: string;
  studyStats?: StudyStats | null;
}

// Study statistics for SRS integration
export interface StudyStats {
  id: number;
  cardId: number;
  easeFactor: number;
  interval: number;
  repetitions: number;
  lastReviewDate?: string;
  nextReviewDate?: string;
  quality?: number;
  createdAt: string;
  updatedAt: string;
}

// Form data for creating cards
export interface CardCreateRequest {
  front: string;
  back: string;
  ipaPronunciation?: string;
  imageUrl?: string;
  audioUrl?: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  tags?: string[];
  difficulty?: CardDifficulty;
  displayOrder?: number;
}

// Form data for updating cards
export interface CardUpdateRequest {
  front?: string;
  back?: string;
  ipaPronunciation?: string;
  imageUrl?: string;
  audioUrl?: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  tags?: string[];
  difficulty?: CardDifficulty;
  displayOrder?: number;
}

// Query parameters for getting cards
export interface CardQueryParams {
  search?: string;
  difficulty?: CardDifficulty;
  tag?: string;
  page?: number;
  size?: number;
  sort?: string;
}

// Paginated response for cards
export interface CardsResponse {
  content: Card[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

// Bulk create request
export type BulkCardCreateRequest = CardCreateRequest[];

// Image upload related types
export interface ImageUploadRequest {
  contentType: string;
}

export interface ImageUploadResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
  expiresAt: string;
}

export interface ImageConfirmRequest {
  publicUrl: string;
}

// Duplicate check request
export interface DuplicateCheckRequest {
  front: string;
  back: string;
}

// Tag interface for tag management
export interface Tag {
  id: string;
  name: string;
  color?: string;
  usageCount?: number;
  category?: string;
}

// Card form state for component management
export interface CardFormState {
  front: string;
  back: string;
  ipaPronunciation: string;
  imageUrl: string;
  audioUrl: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  tags: string[];
  difficulty: CardDifficulty;
  displayOrder?: number;
}

// Card editor modes
export type CardEditorMode = 'create' | 'edit' | 'preview';

// Card preview modes
export type CardPreviewMode = 'front' | 'back' | 'both';
