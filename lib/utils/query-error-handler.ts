import { toast } from 'sonner';
import type { ApiError } from '@/types';

// Error handler for React Query
export function handleQueryError(error: unknown, context?: string) {
  console.error(`Query error${context ? ` in ${context}` : ''}:`, error);

  // Type guard for API errors
  if (isApiError(error)) {
    const message = error.message || 'An error occurred';
    
    // Don't show toast for certain status codes
    if (error.statusCode === 401) {
      // Handle unauthorized - redirect to login will be handled by auth system
      return;
    }
    
    if (error.statusCode === 403) {
      toast.error('Access denied', {
        description: 'You do not have permission to perform this action.',
      });
      return;
    }
    
    if (error.statusCode === 404) {
      toast.error('Not found', {
        description: 'The requested resource was not found.',
      });
      return;
    }
    
    if (error.statusCode && error.statusCode >= 500) {
      toast.error('Server error', {
        description: 'Something went wrong on our end. Please try again later.',
      });
      return;
    }
    
    // Show validation errors
    if (error.errors && Object.keys(error.errors).length > 0) {
      const firstError = Object.values(error.errors)[0];
      const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      toast.error('Validation Error', {
        description: errorMessage,
      });
      return;
    }
    
    // Show general API error
    toast.error('Error', {
      description: message,
    });
    return;
  }

  // Handle network errors
  if (isNetworkError(error)) {
    toast.error('Network Error', {
      description: 'Please check your internet connection and try again.',
    });
    return;
  }

  // Handle generic errors
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  toast.error('Error', {
    description: message,
  });
}

// Type guard for API errors
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'success' in error &&
    (error as { success: boolean }).success === false
  );
}

// Type guard for network errors
function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes('Network Error') ||
      error.message.includes('fetch') ||
      error.name === 'NetworkError'
    );
  }
  return false;
}

// Mutation error handler
export function handleMutationError(error: unknown, action?: string) {
  console.error(`Mutation error${action ? ` during ${action}` : ''}:`, error);

  if (isApiError(error)) {
    // Handle specific mutation errors
    if (error.statusCode === 409) {
      toast.error('Conflict', {
        description: 'This action conflicts with existing data. Please refresh and try again.',
      });
      return;
    }
    
    if (error.statusCode === 422) {
      toast.error('Invalid Data', {
        description: 'The submitted data is invalid. Please check your input and try again.',
      });
      return;
    }
  }

  // Use general error handler for other cases
  handleQueryError(error, action);
}

// Success handler for mutations
export function handleMutationSuccess(message?: string, action?: string) {
  const successMessage = message || `${action || 'Action'} completed successfully`;
  toast.success('Success', {
    description: successMessage,
  });
}

// Retry function for queries
export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  // Don't retry on client errors (4xx)
  if (isApiError(error) && error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
    return false;
  }
  
  // Retry up to 3 times for other errors
  return failureCount < 3;
}

// Custom retry delay
export function getRetryDelay(attemptIndex: number): number {
  // Exponential backoff with jitter
  const baseDelay = Math.min(1000 * 2 ** attemptIndex, 30000);
  const jitter = Math.random() * 0.1 * baseDelay;
  return baseDelay + jitter;
}
