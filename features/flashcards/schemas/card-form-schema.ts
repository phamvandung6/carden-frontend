import { z } from 'zod';

// Difficulty enum matching API
export const difficultySchema = z.enum(['EASY', 'NORMAL', 'HARD']);

// Base card validation schema based on API documentation
export const cardFormSchema = z.object({
  // Required fields
  front: z
    .string()
    .min(1, 'Front content is required')
    .max(500, 'Front content must be less than 500 characters'),
  back: z
    .string()
    .min(1, 'Back content is required')
    .max(500, 'Back content must be less than 500 characters'),

  // Optional fields
  ipaPronunciation: z
    .string()
    .max(200, 'IPA pronunciation must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  
  imageUrl: z
    .string()
    .regex(/^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i, 'Must be a valid image URL')
    .max(500, 'Image URL must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  
  audioUrl: z
    .string()
    .regex(/^https?:\/\/.*\.(mp3|wav|ogg|m4a)$/i, 'Must be a valid audio URL')
    .max(500, 'Audio URL must be less than 500 characters')
    .optional()
    .or(z.literal('')),

  // Array fields with limits from API
  examples: z
    .array(z.string().min(1).max(200, 'Each example must be less than 200 characters'))
    .max(10, 'Maximum 10 examples allowed')
    .default([]),

  synonyms: z
    .array(z.string().min(1).max(100, 'Each synonym must be less than 100 characters'))
    .max(10, 'Maximum 10 synonyms allowed')
    .default([]),

  antonyms: z
    .array(z.string().min(1).max(100, 'Each antonym must be less than 100 characters'))
    .max(10, 'Maximum 10 antonyms allowed')
    .default([]),

  tags: z
    .array(z.string().min(1).max(50, 'Each tag must be less than 50 characters'))
    .max(10, 'Maximum 10 tags allowed')
    .default([]),

  // Difficulty and order
  difficulty: difficultySchema.default('NORMAL'),
  displayOrder: z
    .number()
    .int()
    .min(0)
    .optional(),
});

// Schema for updating cards (all fields optional)
export const cardUpdateSchema = cardFormSchema.partial().extend({
  // At least one field must be provided for update
}).refine((data) => {
  const hasAnyField = Object.values(data).some(value => 
    value !== undefined && value !== '' && 
    (Array.isArray(value) ? value.length > 0 : true)
  );
  return hasAnyField;
}, {
  message: 'At least one field must be provided for update',
});

// Schema for bulk creating cards
export const bulkCardCreateSchema = z.object({
  cards: z
    .array(cardFormSchema.omit({ displayOrder: true }))
    .min(1, 'At least one card is required')
    .max(50, 'Maximum 50 cards can be created at once'),
});

// Schema for duplicate check
export const duplicateCheckSchema = z.object({
  front: z.string().min(1, 'Front content is required'),
  back: z.string().min(1, 'Back content is required'),
});

// Schema for card search/filter
export const cardQuerySchema = z.object({
  search: z.string().optional(),
  difficulty: difficultySchema.optional(),
  tag: z.string().optional(),
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(20),
  sort: z.string().default('displayOrder,asc'),
});

// Schema for image upload content type
export const imageUploadSchema = z.object({
  contentType: z
    .string()
    .refine((type) => type.startsWith('image/'), 'Must be an image file')
    .refine((type) => 
      ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(type),
      'Supported formats: JPEG, PNG, GIF, WebP'
    ),
});

// Utility schemas for form arrays
export const addArrayItemSchema = z.object({
  value: z.string().min(1, 'Value cannot be empty'),
  type: z.enum(['examples', 'synonyms', 'antonyms', 'tags']),
});

// Tag input validation
export const tagInputSchema = z
  .string()
  .min(1, 'Tag cannot be empty')
  .max(50, 'Tag must be less than 50 characters')
  .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Tag can only contain letters, numbers, spaces, hyphens, and underscores');

// Export types for TypeScript
export type CardFormData = z.infer<typeof cardFormSchema>;
export type CardUpdateData = z.infer<typeof cardUpdateSchema>;
export type BulkCardCreateData = z.infer<typeof bulkCardCreateSchema>;
export type DuplicateCheckData = z.infer<typeof duplicateCheckSchema>;
export type CardQueryData = z.infer<typeof cardQuerySchema>;
export type ImageUploadData = z.infer<typeof imageUploadSchema>;
export type AddArrayItemData = z.infer<typeof addArrayItemSchema>;
export type TagInputData = z.infer<typeof tagInputSchema>;
export type CardDifficulty = z.infer<typeof difficultySchema>;

// Default values for forms
export const cardFormDefaults: CardFormData = {
  front: '',
  back: '',
  ipaPronunciation: '',
  imageUrl: '',
  audioUrl: '',
  examples: [],
  synonyms: [],
  antonyms: [],
  tags: [],
  difficulty: 'NORMAL',
  displayOrder: undefined,
};
