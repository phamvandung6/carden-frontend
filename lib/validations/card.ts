import { z } from 'zod'
import { VALIDATION_LIMITS } from '@/lib/constants'

// Card validation schemas
export const cardSchema = z.object({
  front: z
    .string()
    .min(VALIDATION_LIMITS.CARD_FRONT.MIN, 'Front content is required')
    .max(VALIDATION_LIMITS.CARD_FRONT.MAX, `Front content must be less than ${VALIDATION_LIMITS.CARD_FRONT.MAX} characters`),
  back: z
    .string()
    .min(VALIDATION_LIMITS.CARD_BACK.MIN, 'Back content is required')
    .max(VALIDATION_LIMITS.CARD_BACK.MAX, `Back content must be less than ${VALIDATION_LIMITS.CARD_BACK.MAX} characters`),
  hint: z
    .string()
    .max(200, 'Hint must be less than 200 characters')
    .optional(),
  example: z
    .string()
    .max(VALIDATION_LIMITS.CARD_EXAMPLE.MAX, `Example must be less than ${VALIDATION_LIMITS.CARD_EXAMPLE.MAX} characters`)
    .optional(),
  synonyms: z
    .array(z.string().min(1))
    .max(10, 'Maximum 10 synonyms allowed')
    .optional(),
  antonyms: z
    .array(z.string().min(1))
    .max(10, 'Maximum 10 antonyms allowed')
    .optional(),
  tags: z
    .array(z.string().min(1).max(VALIDATION_LIMITS.TAG_NAME.MAX))
    .max(VALIDATION_LIMITS.MAX_TAGS_PER_CARD, `Maximum ${VALIDATION_LIMITS.MAX_TAGS_PER_CARD} tags allowed`)
    .optional(),
  difficulty: z
    .number()
    .min(1)
    .max(5)
    .optional(),
  frontImage: z.string().url().optional().or(z.literal('')),
  backImage: z.string().url().optional().or(z.literal('')),
  frontAudio: z.string().url().optional().or(z.literal('')),
  backAudio: z.string().url().optional().or(z.literal('')),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
})

export const cardUpdateSchema = cardSchema.partial()

export const cardBulkCreateSchema = z.object({
  cards: z
    .array(cardSchema)
    .min(1, 'At least one card is required')
    .max(50, 'Maximum 50 cards can be created at once')
})

export const cardBulkUpdateSchema = z.object({
  cardIds: z.array(z.string()).min(1, 'Please select at least one card'),
  updates: z.object({
    tags: z.array(z.string()).optional(),
    difficulty: z.number().min(1).max(5).optional(),
    addTags: z.array(z.string()).optional(),
    removeTags: z.array(z.string()).optional()
  })
})

export const cardBulkActionSchema = z.object({
  action: z.enum(['delete', 'duplicate', 'move', 'export']),
  cardIds: z.array(z.string()).min(1, 'Please select at least one card'),
  targetDeckId: z.string().optional() // for move action
})

// Card search and filter schema
export const cardSearchSchema = z.object({
  query: z.string().optional(),
  tags: z.array(z.string()).optional(),
  difficulty: z.number().min(1).max(5).optional(),
  hasImages: z.boolean().optional(),
  hasAudio: z.boolean().optional(),
  sortBy: z.enum(['created', 'updated', 'difficulty', 'front', 'back']).default('created'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
})

// File upload schema for card media
export const cardMediaUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a file' }),
  type: z.enum(['image', 'audio']),
  side: z.enum(['front', 'back'])
})

// Card practice schemas
export const cardPracticeSchema = z.object({
  cardId: z.string().min(1, 'Card ID is required'),
  difficulty: z.number().min(0).max(3, 'Invalid difficulty rating'),
  timeSpent: z.number().min(0, 'Time spent must be positive'),
  mode: z.enum(['flip', 'type', 'choice']),
  correct: z.boolean().optional()
})

export const cardReviewSchema = z.object({
  cards: z.array(cardPracticeSchema).min(1, 'At least one card review is required'),
  sessionDuration: z.number().min(0),
  sessionType: z.enum(['study', 'review', 'test'])
})

// Type exports
export type CardInput = z.infer<typeof cardSchema>
export type CardUpdateInput = z.infer<typeof cardUpdateSchema>
export type CardBulkCreateInput = z.infer<typeof cardBulkCreateSchema>
export type CardBulkUpdateInput = z.infer<typeof cardBulkUpdateSchema>
export type CardBulkActionInput = z.infer<typeof cardBulkActionSchema>
export type CardSearchInput = z.infer<typeof cardSearchSchema>
export type CardMediaUploadInput = z.infer<typeof cardMediaUploadSchema>
export type CardPracticeInput = z.infer<typeof cardPracticeSchema>
export type CardReviewInput = z.infer<typeof cardReviewSchema>
