import { z } from 'zod'
import { VALIDATION_LIMITS, CEFR_LEVELS_ARRAY } from '@/lib/constants'

// Deck validation schemas
export const deckSchema = z.object({
  title: z
    .string()
    .min(VALIDATION_LIMITS.DECK_TITLE.MIN, 'Title is required')
    .max(VALIDATION_LIMITS.DECK_TITLE.MAX, `Title must be less than ${VALIDATION_LIMITS.DECK_TITLE.MAX} characters`),
  description: z
    .string()
    .max(VALIDATION_LIMITS.DECK_DESCRIPTION.MAX, `Description must be less than ${VALIDATION_LIMITS.DECK_DESCRIPTION.MAX} characters`)
    .optional(),
  category: z
    .string()
    .min(1, 'Category is required')
    .optional(),
  tags: z
    .array(z.string())
    .max(VALIDATION_LIMITS.MAX_TAGS_PER_CARD, `Maximum ${VALIDATION_LIMITS.MAX_TAGS_PER_CARD} tags allowed`)
    .optional(),
  isPublic: z.boolean().default(false),
  language: z.string().min(1, 'Language is required'),
  cefrLevel: z.enum(CEFR_LEVELS_ARRAY).optional(),
  coverImage: z.string().url().optional().or(z.literal(''))
})

export const deckUpdateSchema = deckSchema.partial()

export const deckImportSchema = z.object({
  format: z.enum(['csv', 'json', 'anki']),
  file: z.instanceof(File, { message: 'Please select a file' }),
  options: z.object({
    delimiter: z.string().default(','),
    hasHeader: z.boolean().default(true),
    frontColumn: z.number().min(0).optional(),
    backColumn: z.number().min(0).optional(),
    tagsColumn: z.number().min(0).optional()
  }).optional()
})

export const deckExportSchema = z.object({
  format: z.enum(['csv', 'json', 'anki']),
  includeProgress: z.boolean().default(false),
  includeImages: z.boolean().default(true)
})

export const deckShareSchema = z.object({
  permissions: z.enum(['view', 'edit']),
  emails: z.array(z.string().email()).optional(),
  isPublic: z.boolean().default(false),
  allowDownload: z.boolean().default(true)
})

export const deckBulkActionSchema = z.object({
  action: z.enum(['delete', 'duplicate', 'export', 'move']),
  deckIds: z.array(z.string()).min(1, 'Please select at least one deck'),
  targetCategory: z.string().optional() // for move action
})

// AI deck generation schema
export const aiDeckGenerationSchema = z.object({
  topic: z
    .string()
    .min(1, 'Topic is required')
    .max(200, 'Topic must be less than 200 characters'),
  cefrLevel: z.enum(CEFR_LEVELS_ARRAY, {
    required_error: 'Please select a CEFR level'
  }),
  cardCount: z
    .number()
    .min(5, 'Minimum 5 cards required')
    .max(100, 'Maximum 100 cards allowed'),
  language: z
    .string()
    .min(1, 'Target language is required'),
  sourceLanguage: z
    .string()
    .min(1, 'Source language is required'),
  contentType: z.enum(['vocabulary', 'phrases', 'grammar', 'mixed']),
  includeExamples: z.boolean().default(true),
  includePronunciation: z.boolean().default(true),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional()
})

// Type exports
export type DeckInput = z.infer<typeof deckSchema>
export type DeckUpdateInput = z.infer<typeof deckUpdateSchema>
export type DeckImportInput = z.infer<typeof deckImportSchema>
export type DeckExportInput = z.infer<typeof deckExportSchema>
export type DeckShareInput = z.infer<typeof deckShareSchema>
export type DeckBulkActionInput = z.infer<typeof deckBulkActionSchema>
export type AiDeckGenerationInput = z.infer<typeof aiDeckGenerationSchema>
