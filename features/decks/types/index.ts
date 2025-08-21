// Deck types based on API documentation
export interface DeckCardData {
  cardId: number;
  frontText: string;
  frontImageUrl: string;
  backDefinition: string;
  backMeaningVi: string;
  ipa: string;
  studyStateId: number;
  cardState: 'NEW' | 'LEARNING' | 'REVIEW' | 'RELEARNING';
  dueDate: string;
  intervalDays: number;
  totalReviews: number;
  accuracyRate: number;
  isDue: boolean;
  isNew: boolean;
  isLearning: boolean;
  deckId: number;
  deckTitle: string;
  showAnswer: boolean;
  remainingNewCards: number;
  remainingReviewCards: number;
  remainingLearningCards: number;
}

export interface Deck {
  id: number;
  title: string;
  description: string;
  userId: number;
  topicId: number | null;
  visibility: 'PRIVATE' | 'PUBLIC' | 'UNLISTED';
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null;
  sourceLanguage: string;
  targetLanguage: string;
  coverImageUrl: string | null;
  tags: string[];
  systemDeck: boolean;
  downloadCount: number;
  likeCount: number;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
}

// API request types
export interface CreateDeckRequest {
  title: string;
  description?: string;
  topicId?: number;
  cefrLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  sourceLanguage?: string;
  targetLanguage?: string;
  tags?: string[];
  coverImageUrl?: string;
}

export interface UpdateDeckRequest {
  title?: string;
  description?: string;
  topicId?: number;
  visibility?: 'PRIVATE' | 'PUBLIC' | 'UNLISTED';
  cefrLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  sourceLanguage?: string;
  targetLanguage?: string;
  coverImageUrl?: string;
  tags?: string[];
}

// Search and filter types
export interface DeckSearchParams {
  q?: string;
  topicId?: number;
  cefr?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  page?: number;
  size?: number;
  sort?: string;
}

// Pagination response from API  
export interface PageableResponse<T> {
  totalElements: number;
  totalPages: number;
  pageable: {
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    unpaged: boolean;
    offset: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  size: number;
  content: T[];
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// File upload types
export interface PresignedUploadResponse {
  uploadUrl: string;
  key: string;
  publicUrl: string;
  expiresAt: string;
}

// UI state types
export interface DeckFormData {
  title: string;
  description: string;
  topicId: number | null;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null;
  sourceLanguage: string;
  targetLanguage: string;
  tags: string[];
  coverImageUrl: string | File | null;
  visibility: 'PRIVATE' | 'PUBLIC' | 'UNLISTED';
}

export interface DeckListState {
  decks: Deck[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  filters: DeckFilters;
}

export interface ImageUploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  previewUrl: string | null;
}

// Component props types
export interface DeckCardProps {
  deck: Deck;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deckId: number) => void;
  onDuplicate?: (deck: Deck) => void;
  showActions?: boolean;
  compact?: boolean;
}

export interface DeckFormProps {
  deck?: Deck;
  onSubmit: (data: DeckFormData) => void;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

export interface DeckListProps {
  decks: Deck[];
  loading?: boolean;
  onLoadMore?: () => void;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deckId: number) => void;
  viewMode?: 'grid' | 'list';
  showActions?: boolean;
}

// Filter and search types
export interface DeckFilters {
  search?: string;
  topicId?: number;
  cefrLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  visibility?: 'PRIVATE' | 'PUBLIC' | 'UNLISTED' | 'ALL';
  tags?: string[];
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'cardCount';
  sortOrder?: 'asc' | 'desc';
}

// Bulk operations
export interface BulkDeckAction {
  type: 'delete' | 'duplicate' | 'changeVisibility' | 'addTags' | 'removeTags';
  deckIds: number[];
  payload?: any;
}

export interface DeckStats {
  totalDecks: number;
  publicDecks: number;
  privateDecks: number;
  totalCards: number;
  recentActivity: {
    created: number;
    studied: number;
    updated: number;
  };
}

// AI Generate Cards types
export interface AiGenerateCardsRequest {
  topic: string;
  count?: number; // 1-15, default 10
}

export interface AiGenerateCardsResponse {
  success: boolean;
  message: string;
  totalRequested: number;
  totalGenerated: number;
  totalSaved: number;
  deckId: number;
  errors: string[] | null;
  warnings: string[] | null;
  processedAt: string;
  processingTimeMs: number;
  summary: {
    topic: string;
    sourceLanguage: string;
    targetLanguage: string;
    cefrLevel: string | null;
    duplicatesSkipped: number;
    validationErrors: number;
  };
}

// AI Generation state for UI
export interface AiGenerationState {
  isGenerating: boolean;
  progress: number;
  error: string | null;
  lastResult: AiGenerateCardsResponse | null;
}