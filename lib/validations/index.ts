// Export all validation schemas and types
export * from './auth'
export * from './deck'
export * from './card'
export * from './settings'

// Common validation utilities
import { z } from 'zod'

// Common field validators
export const emailValidator = z.string().email('Invalid email format')

export const passwordValidator = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password must be less than 100 characters')

export const urlValidator = z
  .string()
  .url('Invalid URL format')
  .or(z.literal(''))

export const fileValidator = (
  allowedTypes: string[],
  maxSize: number = 5 * 1024 * 1024 // 5MB default
) => z
  .instanceof(File)
  .refine(
    (file) => file.size <= maxSize,
    `File size must be less than ${maxSize / 1024 / 1024}MB`
  )
  .refine(
    (file) => allowedTypes.includes(file.type),
    `File type must be one of: ${allowedTypes.join(', ')}`
  )

// Pagination validator
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
})

// Search validator
export const searchSchema = z.object({
  query: z.string().min(1).max(100),
  filters: z.record(z.any()).optional(),
  pagination: paginationSchema.optional()
})

// Date range validator
export const dateRangeSchema = z.object({
  start: z.date(),
  end: z.date()
}).refine(
  (data) => data.start < data.end,
  { message: 'Start date must be before end date' }
)

// ID validator
export const idValidator = z.string().min(1, 'ID is required')

// Slug validator
export const slugValidator = z
  .string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')

// Color validator (hex colors)
export const colorValidator = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format')

// Type exports for common validators
export type PaginationInput = z.infer<typeof paginationSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type DateRangeInput = z.infer<typeof dateRangeSchema>
