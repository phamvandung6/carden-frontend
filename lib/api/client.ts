// API client configuration - centralized axios instance
import axios, { AxiosError, AxiosResponse } from 'axios';
import type { ApiResponse, ApiError } from '@/types';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for standardized error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log request duration in development
    if (process.env.NODE_ENV === 'development' && response.config.metadata?.startTime) {
      const duration = new Date().getTime() - response.config.metadata.startTime.getTime();
      console.log(`API Request: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }
    
    // Return the response data directly (assumes API returns ApiResponse format)
    return response.data;
  },
  (error: AxiosError) => {
    // Transform axios error to our ApiError format
    const apiError: ApiError = {
      success: false,
      message: 'An error occurred',
      statusCode: error.response?.status,
    };

    if (error.response?.data) {
      // If server returns structured error
      const serverError = error.response.data as Record<string, unknown>;
      apiError.message = (serverError.message as string) || error.message;
      apiError.errors = serverError.errors as Record<string, string[]>;
      apiError.code = serverError.code as string;
    } else if (error.request) {
      // Network error
      apiError.message = 'Network error. Please check your connection.';
      apiError.code = 'NETWORK_ERROR';
    } else {
      // Request setup error
      apiError.message = error.message;
      apiError.code = 'REQUEST_ERROR';
    }

    // Handle 401 errors - token refresh will be handled by auth system
    if (error.response?.status === 401) {
      // Trigger auth refresh/logout
      if (typeof window !== 'undefined') {
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Auth system will handle the redirect
      }
    }

    return Promise.reject(apiError);
  }
);

// Utility function to check if error is an API error
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'success' in error &&
    (error as ApiError).success === false
  );
}

// Utility function for handling API responses
export function handleApiResponse<T>(response: ApiResponse<T>): T {
  if (!response.success) {
    throw response as ApiError;
  }
  return response.data;
}
