// JWT Token Utilities
import type { StoredTokenData } from '../types';

// Storage keys
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const TOKEN_DATA_KEY = 'tokenData';

/**
 * Store access token in localStorage
 */
export function storeAccessToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
}

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
}

/**
 * Store refresh token in localStorage
 */
export function storeRefreshToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  }
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
}

/**
 * Store complete token data with expiry
 */
export function storeTokenData(data: StoredTokenData): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_DATA_KEY, JSON.stringify(data));
    localStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  }
}

/**
 * Get complete token data
 */
export function getTokenData(): StoredTokenData | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(TOKEN_DATA_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
  }
  return null;
}

/**
 * Clear all tokens from storage
 */
export function clearAllTokens(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_DATA_KEY);
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expiresAt: number): boolean {
  return Date.now() >= expiresAt;
}

/**
 * Check if current stored token is expired
 */
export function isCurrentTokenExpired(): boolean {
  const tokenData = getTokenData();
  if (!tokenData) return true;
  return isTokenExpired(tokenData.expiresAt);
}

/**
 * Get time until token expires (in milliseconds)
 */
export function getTimeUntilExpiry(expiresAt: number): number {
  return Math.max(0, expiresAt - Date.now());
}

/**
 * Calculate expiry timestamp from expiresIn seconds
 */
export function calculateExpiryTimestamp(expiresIn: number): number {
  return Date.now() + (expiresIn * 1000);
}

/**
 * Parse JWT token payload (without verification - for client-side info only)
 * WARNING: Never trust this data for security decisions!
 */
export function parseJWTPayload(token: string): Record<string, any> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Get token expiry from JWT payload
 */
export function getJWTExpiry(token: string): number | null {
  const payload = parseJWTPayload(token);
  if (!payload || !payload.exp) return null;
  
  // JWT exp is in seconds, convert to milliseconds
  return payload.exp * 1000;
}

/**
 * Check if JWT token is expired based on its payload
 */
export function isJWTExpired(token: string): boolean {
  const expiry = getJWTExpiry(token);
  if (!expiry) return true;
  return Date.now() >= expiry;
}

/**
 * Get user info from JWT payload (client-side only)
 */
export function getUserFromJWT(token: string): { id?: number; username?: string; email?: string } | null {
  const payload = parseJWTPayload(token);
  if (!payload) return null;
  
  return {
    id: payload.sub ? parseInt(payload.sub) : payload.id,
    username: payload.username,
    email: payload.email,
  };
}

/**
 * Create Authorization header value
 */
export function createAuthHeader(token: string): string {
  return `Bearer ${token}`;
}

/**
 * Validate token format (basic check)
 */
export function isValidTokenFormat(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  
  // Basic JWT format check (3 parts separated by dots)
  const parts = token.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
}

/**
 * Auto-refresh token before expiry
 */
export function scheduleTokenRefresh(
  expiresAt: number, 
  refreshCallback: () => Promise<void>,
  bufferTime = 5 * 60 * 1000 // 5 minutes before expiry
): NodeJS.Timeout | null {
  const timeUntilRefresh = getTimeUntilExpiry(expiresAt) - bufferTime;
  
  if (timeUntilRefresh <= 0) {
    // Token expires soon, refresh immediately
    refreshCallback();
    return null;
  }
  
  return setTimeout(() => {
    refreshCallback();
  }, timeUntilRefresh);
}
