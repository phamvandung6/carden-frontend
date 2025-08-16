// Auth Feature Module Exports

// Types
export type {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  LoginFormData,
  RegisterFormData,
  AuthState,
  TokenData,
  StoredTokenData,
  AuthContextValue,
  AuthGuardProps,
  ProtectedRouteProps,
  AuthError,
} from './types';

// API Services
export { authApi } from './services/auth-api';

// Store
export { useAuthStore, authSelectors } from './stores/auth-store';

// Hooks
export { useAuth } from './hooks/use-auth';

// Utilities
export {
  storeAccessToken,
  getAccessToken,
  storeRefreshToken,
  getRefreshToken,
  storeTokenData,
  getTokenData,
  clearAllTokens,
  isTokenExpired,
  isCurrentTokenExpired,
  getTimeUntilExpiry,
  calculateExpiryTimestamp,
  parseJWTPayload,
  getJWTExpiry,
  isJWTExpired,
  getUserFromJWT,
  createAuthHeader,
  isValidTokenFormat,
  scheduleTokenRefresh,
} from './utils/token-utils';