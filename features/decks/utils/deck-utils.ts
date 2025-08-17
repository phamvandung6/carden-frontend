import type { Deck, DeckFormData, DeckFilters, DeckSearchParams } from '../types';

/**
 * Transform deck API response to form data
 */
export function deckToFormData(deck: Deck): DeckFormData {
  return {
    title: deck.title,
    description: deck.description || '',
    topicId: deck.topicId,
    cefrLevel: deck.cefrLevel,
    sourceLanguage: deck.sourceLanguage || '',
    targetLanguage: deck.targetLanguage || '',
    tags: deck.tags || [],
    coverImageUrl: deck.coverImageUrl,
    visibility: deck.visibility,
  };
}

/**
 * Transform form data to create/update request
 */
export function formDataToCreateRequest(formData: DeckFormData) {
  return {
    title: formData.title.trim(),
    description: formData.description?.trim() || undefined,
    topicId: formData.topicId || undefined,
    cefrLevel: formData.cefrLevel || undefined,
    sourceLanguage: formData.sourceLanguage?.trim() || undefined,
    targetLanguage: formData.targetLanguage?.trim() || undefined,
    tags: formData.tags?.filter(tag => tag.trim().length > 0) || undefined,
    coverImageUrl: formData.coverImageUrl || undefined,
  };
}

/**
 * Transform form data to update request (includes visibility)
 */
export function formDataToUpdateRequest(formData: DeckFormData) {
  return {
    ...formDataToCreateRequest(formData),
    visibility: formData.visibility,
  };
}

/**
 * Validate file for thumbnail upload
 */
export function validateThumbnailFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload JPG, PNG, WebP, or GIF images.',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size too large. Please upload images smaller than 5MB.',
    };
  }

  return { valid: true };
}

/**
 * Generate preview URL for uploaded file
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Clean up preview URL
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}

/**
 * Format deck card count
 */
export function formatCardCount(count: number): string {
  if (count === 0) return 'No cards';
  if (count === 1) return '1 card';
  return `${count} cards`;
}

/**
 * Format deck visibility for display
 */
export function formatVisibility(visibility: Deck['visibility']): string {
  switch (visibility) {
    case 'PUBLIC':
      return 'Public';
    case 'PRIVATE':
      return 'Private';
    case 'UNLISTED':
      return 'Unlisted';
    default:
      return 'Unknown';
  }
}

/**
 * Get visibility badge color
 */
export function getVisibilityBadgeColor(visibility: Deck['visibility']): string {
  switch (visibility) {
    case 'PUBLIC':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'PRIVATE':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'UNLISTED':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

/**
 * Format CEFR level for display
 */
export function formatCefrLevel(level: string | null): string {
  if (!level) return 'Not specified';
  return level.toUpperCase();
}

/**
 * Get CEFR level color
 */
export function getCefrLevelColor(level: string | null): string {
  if (!level) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  
  switch (level.toUpperCase()) {
    case 'A1':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'A2':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'B1':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'B2':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'C1':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'C2':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
}

/**
 * Format relative time
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
}

/**
 * Generate deck URL slug
 */
export function generateDeckSlug(deck: Deck): string {
  return `${deck.id}-${deck.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}`;
}

/**
 * Parse deck filters for API query
 */
export function parseFiltersToApiParams(filters: DeckFilters): DeckSearchParams {
  const params: DeckSearchParams = {};

  if (filters.search?.trim()) {
    params.q = filters.search.trim();
  }

  if (filters.topicId) {
    params.topicId = filters.topicId;
  }

  if (filters.cefrLevel) {
    params.cefr = filters.cefrLevel;
  }

  // Sort parameter - use camelCase for API (backend expects camelCase)
  if (filters.sortBy && filters.sortOrder) {
    params.sort = `${filters.sortBy},${filters.sortOrder}`;
  }

  return params;
}

/**
 * Check if deck is editable by current user
 */
export function isDeckEditable(deck: Deck, currentUserId?: number): boolean {
  return deck.userId === currentUserId && !deck.systemDeck;
}

/**
 * Check if deck is deletable by current user
 */
export function isDeckDeletable(deck: Deck, currentUserId?: number): boolean {
  return deck.userId === currentUserId && !deck.systemDeck;
}

/**
 * Get default deck form values
 */
export function getDefaultDeckFormData(): DeckFormData {
  return {
    title: '',
    description: '',
    topicId: null,
    cefrLevel: null,
    sourceLanguage: 'en',
    targetLanguage: 'vi',
    tags: [],
    coverImageUrl: null,
    visibility: 'PRIVATE',
  };
}

/**
 * Validate deck title
 */
export function validateDeckTitle(title: string): { valid: boolean; error?: string } {
  const trimmed = title.trim();
  
  if (!trimmed) {
    return { valid: false, error: 'Title is required' };
  }
  
  if (trimmed.length > 200) {
    return { valid: false, error: 'Title must be less than 200 characters' };
  }
  
  return { valid: true };
}

/**
 * Validate deck description
 */
export function validateDeckDescription(description: string): { valid: boolean; error?: string } {
  if (description && description.length > 1000) {
    return { valid: false, error: 'Description must be less than 1000 characters' };
  }
  
  return { valid: true };
}

/**
 * Validate deck tags
 */
export function validateDeckTags(tags: string[]): { valid: boolean; error?: string } {
  if (tags.length > 10) {
    return { valid: false, error: 'Maximum 10 tags allowed' };
  }
  
  for (const tag of tags) {
    if (tag.trim().length === 0) {
      return { valid: false, error: 'Empty tags are not allowed' };
    }
    if (tag.length > 50) {
      return { valid: false, error: 'Each tag must be less than 50 characters' };
    }
  }
  
  return { valid: true };
}
