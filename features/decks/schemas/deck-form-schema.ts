import { z } from 'zod';
import { CEFR_LEVELS_ARRAY } from '@/lib/constants';

// Based on actual API documentation from deck.md
export const createDeckSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .transform(val => val?.trim() || undefined),
  topicId: z
    .number()
    .positive('Invalid topic')
    .optional(),
  cefrLevel: z
    .enum(CEFR_LEVELS_ARRAY)
    .optional(),
  sourceLanguage: z
    .string()
    .max(10, 'Source language must be less than 10 characters')
    .optional()
    .transform(val => val?.trim() || undefined),
  targetLanguage: z
    .string()
    .max(10, 'Target language must be less than 10 characters')
    .optional()
    .transform(val => val?.trim() || undefined),
  tags: z
    .array(z.string().trim().min(1, 'Tag cannot be empty'))
    .max(10, 'Maximum 10 tags allowed')
    .optional()
    .transform(val => val?.filter(tag => tag.length > 0) || undefined),
  coverImageUrl: z
    .string()
    .url('Invalid image URL')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val),
});

export const updateDeckSchema = createDeckSchema.extend({
  visibility: z
    .enum(['PRIVATE', 'PUBLIC', 'UNLISTED'])
    .optional(),
}).partial();

// Form data schema for UI (includes fields that might be null initially)
export const deckFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  topicId: z
    .number()
    .positive('Invalid topic')
    .nullable()
    .optional(),
  cefrLevel: z
    .enum(CEFR_LEVELS_ARRAY)
    .nullable()
    .optional(),
  sourceLanguage: z
    .string()
    .max(10, 'Source language must be less than 10 characters')
    .optional(),
  targetLanguage: z
    .string()
    .max(10, 'Target language must be less than 10 characters')
    .optional(),
  tags: z
    .array(z.string())
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  coverImageUrl: z
    .union([
      z.string().url('Invalid image URL'),
      z.literal(''),
      z.instanceof(File),
    ])
    .nullable()
    .optional(),
  visibility: z
    .enum(['PRIVATE', 'PUBLIC', 'UNLISTED'])
    .default('PRIVATE'),
});

// Topic selection schema (for future use)
export const topicSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

// File upload schema
export const imageUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, 'File size must be less than 5MB')
    .refine(
      file => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type),
      'File must be a valid image (JPEG, PNG, WebP, or GIF)'
    ),
});

// Type exports
export type CreateDeckInput = z.infer<typeof createDeckSchema>;
export type UpdateDeckInput = z.infer<typeof updateDeckSchema>;
export type DeckFormInput = z.infer<typeof deckFormSchema>;
export type TopicInput = z.infer<typeof topicSchema>;
export type ImageUploadInput = z.infer<typeof imageUploadSchema>;

// Form field helpers
export const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Vietnamese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
] as const;

export const VISIBILITY_OPTIONS = [
  { value: 'PRIVATE', label: 'Private', description: 'Only you can see this deck' },
  { value: 'PUBLIC', label: 'Public', description: 'Anyone can find and view this deck' },
  { value: 'UNLISTED', label: 'Unlisted', description: 'Only people with the link can view this deck' },
] as const;

export const CEFR_LEVEL_OPTIONS = [
  { value: 'A1', label: 'A1 - Beginner', description: 'Basic vocabulary and phrases' },
  { value: 'A2', label: 'A2 - Elementary', description: 'Common expressions and topics' },
  { value: 'B1', label: 'B1 - Intermediate', description: 'Main points of familiar topics' },
  { value: 'B2', label: 'B2 - Upper Intermediate', description: 'Complex texts and abstract topics' },
  { value: 'C1', label: 'C1 - Advanced', description: 'Wide range of demanding texts' },
  { value: 'C2', label: 'C2 - Proficiency', description: 'Virtually everything with ease' },
] as const;
