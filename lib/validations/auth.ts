import { z } from 'zod';

// Password validation with strength requirements
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character');

// Email validation
const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .toLowerCase();

// Username validation
const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(30, 'Username must be less than 30 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
  .toLowerCase();

// Login form schema
export const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, 'Username or email is required')
    .transform(val => val.toLowerCase()),
  password: z
    .string()
    .min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

// Registration form schema
export const registerSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, 'You must agree to the terms and conditions'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

// Reset password schema
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
}).refine(data => data.currentPassword !== data.newPassword, {
  message: 'New password must be different from current password',
  path: ['newPassword'],
});

// Email verification schema
export const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

// Resend verification email schema
export const resendVerificationSchema = z.object({
  email: emailSchema,
});

// Two-factor authentication schemas
export const twoFactorSetupSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export const twoFactorVerifySchema = z.object({
  code: z
    .string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d+$/, 'Verification code must contain only numbers'),
});

export const twoFactorDisableSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  code: z
    .string()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d+$/, 'Verification code must contain only numbers'),
});

// Recovery codes schema
export const recoveryCodeSchema = z.object({
  code: z
    .string()
    .min(8, 'Recovery code must be at least 8 characters')
    .max(12, 'Recovery code must be less than 12 characters'),
});

// Session management schemas
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// OAuth schemas
export const oauthCallbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().optional(),
  error: z.string().optional(),
  error_description: z.string().optional(),
});

// Profile update schema (auth-related fields only)
export const authProfileUpdateSchema = z.object({
  email: emailSchema.optional(),
  currentPassword: z.string().optional(),
  newPassword: passwordSchema.optional(),
  confirmPassword: z.string().optional(),
}).refine(data => {
  // If changing email, require current password
  if (data.email && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: 'Current password is required to change email',
  path: ['currentPassword'],
}).refine(data => {
  // If changing password, require both new password and confirmation
  if (data.newPassword && !data.confirmPassword) {
    return false;
  }
  if (data.confirmPassword && !data.newPassword) {
    return false;
  }
  if (data.newPassword && data.confirmPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: 'Password confirmation is required when changing password',
  path: ['confirmPassword'],
}).refine(data => {
  // If changing password, require current password
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: 'Current password is required to change password',
  path: ['currentPassword'],
});

// Account deletion schema
export const deleteAccountSchema = z.object({
  password: z.string().min(1, 'Password is required'),
  confirmation: z
    .string()
    .refine(val => val === 'DELETE', 'You must type "DELETE" to confirm'),
  reason: z.string().optional(),
});

// Export types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type EmailVerificationFormData = z.infer<typeof emailVerificationSchema>;
export type ResendVerificationFormData = z.infer<typeof resendVerificationSchema>;
export type TwoFactorSetupFormData = z.infer<typeof twoFactorSetupSchema>;
export type TwoFactorVerifyFormData = z.infer<typeof twoFactorVerifySchema>;
export type TwoFactorDisableFormData = z.infer<typeof twoFactorDisableSchema>;
export type RecoveryCodeFormData = z.infer<typeof recoveryCodeSchema>;
export type RefreshTokenFormData = z.infer<typeof refreshTokenSchema>;
export type OAuthCallbackFormData = z.infer<typeof oauthCallbackSchema>;
export type AuthProfileUpdateFormData = z.infer<typeof authProfileUpdateSchema>;
export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>;