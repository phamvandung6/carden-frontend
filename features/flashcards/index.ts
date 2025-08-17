// Main flashcards feature module exports

// Components
export * from './components';

// Hooks
export * from './hooks';

// Services
export { CardsApiService, createCard, getCardsByDeck, getCardById, updateCard, deleteCard, bulkCreateCards, getCardCount, checkDuplicate, getImageUploadUrl, confirmImageUpload, uploadImage, searchCards } from './services/cards-api';

// Stores
export { useCardsStore, useCards, useCardsLoading, useCardsError, useCurrentCard, useCardsFilters, useCardFormState, useSelectedCards, useCardImageUploadState, useCardEditorMode, useAvailableTags, useCurrentDeckId } from './stores/cards-store';

// Types (primary source)
export * from './types';

// Schemas (avoid duplicates, only export what's unique)
export { 
  cardFormSchema, 
  cardUpdateSchema,
  bulkCardCreateSchema,
  duplicateCheckSchema,
  cardQuerySchema,
  imageUploadSchema,
  addArrayItemSchema,
  tagInputSchema,
  cardFormDefaults,
  type CardFormData,
  type CardUpdateData,
  type BulkCardCreateData,
  type DuplicateCheckData,
  type CardQueryData,
  type ImageUploadData,
  type AddArrayItemData,
  type TagInputData,
} from './schemas/card-form-schema';