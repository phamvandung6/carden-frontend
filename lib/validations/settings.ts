import { z } from 'zod'
import { THEMES, TTS_SETTINGS } from '@/lib/constants'

// User preferences schema
export const userPreferencesSchema = z.object({
  theme: z.enum([THEMES.LIGHT, THEMES.DARK, THEMES.SYSTEM] as [string, ...string[]]),
  language: z.string().min(1, 'Language is required'),
  timezone: z.string().optional(),
  dailyGoal: z
    .number()
    .min(1, 'Daily goal must be at least 1')
    .max(1000, 'Daily goal must be less than 1000'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    studyReminders: z.boolean().default(true),
    weeklyProgress: z.boolean().default(true)
  }).optional()
})

// TTS settings schema
export const ttsSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  voice: z.string().optional(),
  rate: z
    .number()
    .min(TTS_SETTINGS.RATE_RANGE.MIN, `Rate must be between ${TTS_SETTINGS.RATE_RANGE.MIN} and ${TTS_SETTINGS.RATE_RANGE.MAX}`)
    .max(TTS_SETTINGS.RATE_RANGE.MAX, `Rate must be between ${TTS_SETTINGS.RATE_RANGE.MIN} and ${TTS_SETTINGS.RATE_RANGE.MAX}`)
    .default(TTS_SETTINGS.DEFAULT_RATE),
  pitch: z
    .number()
    .min(TTS_SETTINGS.PITCH_RANGE.MIN, `Pitch must be between ${TTS_SETTINGS.PITCH_RANGE.MIN} and ${TTS_SETTINGS.PITCH_RANGE.MAX}`)
    .max(TTS_SETTINGS.PITCH_RANGE.MAX, `Pitch must be between ${TTS_SETTINGS.PITCH_RANGE.MIN} and ${TTS_SETTINGS.PITCH_RANGE.MAX}`)
    .default(TTS_SETTINGS.DEFAULT_PITCH),
  volume: z
    .number()
    .min(TTS_SETTINGS.VOLUME_RANGE.MIN, `Volume must be between ${TTS_SETTINGS.VOLUME_RANGE.MIN} and ${TTS_SETTINGS.VOLUME_RANGE.MAX}`)
    .max(TTS_SETTINGS.VOLUME_RANGE.MAX, `Volume must be between ${TTS_SETTINGS.VOLUME_RANGE.MIN} and ${TTS_SETTINGS.VOLUME_RANGE.MAX}`)
    .default(TTS_SETTINGS.DEFAULT_VOLUME),
  autoPlay: z.boolean().default(false),
  preferredLanguages: z.array(z.string()).optional()
})

// Practice settings schema
export const practiceSettingsSchema = z.object({
  defaultMode: z.enum(['flip', 'type', 'choice']).default('flip'),
  showHints: z.boolean().default(true),
  autoAdvance: z.boolean().default(false),
  shuffleCards: z.boolean().default(true),
  sessionSize: z
    .number()
    .min(5, 'Session size must be at least 5')
    .max(100, 'Session size must be less than 100')
    .default(20),
  reviewInterval: z.object({
    easy: z.number().min(1).default(4),
    good: z.number().min(1).default(2),
    hard: z.number().min(1).default(1),
    again: z.number().min(0).default(0)
  }),
  enableSpacedRepetition: z.boolean().default(true),
  maxNewCardsPerDay: z
    .number()
    .min(1, 'Max new cards must be at least 1')
    .max(100, 'Max new cards must be less than 100')
    .default(20),
  maxReviewsPerDay: z
    .number()
    .min(1, 'Max reviews must be at least 1')
    .max(500, 'Max reviews must be less than 500')
    .default(100)
})

// Privacy settings schema
export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(['public', 'friends', 'private']).default('private'),
  showProgressPublicly: z.boolean().default(false),
  allowDeckSharing: z.boolean().default(true),
  dataCollection: z.object({
    analytics: z.boolean().default(true),
    improvement: z.boolean().default(true),
    marketing: z.boolean().default(false)
  })
})

// Export settings schema
export const exportSettingsSchema = z.object({
  format: z.enum(['json', 'csv', 'anki']),
  includeProgress: z.boolean().default(false),
  includeMedia: z.boolean().default(true),
  includeMetadata: z.boolean().default(true),
  dateRange: z.object({
    start: z.date().optional(),
    end: z.date().optional()
  }).optional()
})

// Import settings schema
export const importSettingsSchema = z.object({
  format: z.enum(['json', 'csv', 'anki']),
  mergeStrategy: z.enum(['skip', 'overwrite', 'merge']).default('skip'),
  preserveProgress: z.boolean().default(true),
  mapFields: z.object({
    front: z.string().optional(),
    back: z.string().optional(),
    tags: z.string().optional(),
    notes: z.string().optional()
  }).optional()
})

// Combined settings schema
export const settingsSchema = z.object({
  preferences: userPreferencesSchema.optional(),
  tts: ttsSettingsSchema.optional(),
  practice: practiceSettingsSchema.optional(),
  privacy: privacySettingsSchema.optional()
})

// Type exports
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>
export type TtsSettingsInput = z.infer<typeof ttsSettingsSchema>
export type PracticeSettingsInput = z.infer<typeof practiceSettingsSchema>
export type PrivacySettingsInput = z.infer<typeof privacySettingsSchema>
export type ExportSettingsInput = z.infer<typeof exportSettingsSchema>
export type ImportSettingsInput = z.infer<typeof importSettingsSchema>
export type SettingsInput = z.infer<typeof settingsSchema>
