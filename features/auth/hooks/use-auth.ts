'use client';

// Authentication Hooks
import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore, authSelectors } from '../stores/auth-store';
import { authApi } from '../services/auth-api';
import { userApi } from '../../user/services/user-api';
import { queryKeys } from '@/lib/utils/query-keys';
import { handleMutationError, handleMutationSuccess } from '@/lib/utils/query-error-handler';
import type { LoginRequest, RegisterRequest } from '../types';

export function useAuth() {
  const router = useRouter();
  
  // Store state and actions
  const user = useAuthStore(authSelectors.user);
  const isAuthenticated = useAuthStore(authSelectors.isAuthenticated);
  const isLoggedIn = useAuthStore(authSelectors.isLoggedIn);
  const isLoading = useAuthStore(authSelectors.isLoading);
  const error = useAuthStore(authSelectors.error);
  
  const { setUser, clearAuth, setLoading, setError } = useAuthStore();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, accessToken, expiresIn } = response.data;
        setUser(user, { accessToken, expiresIn });
        
        handleMutationSuccess('Successfully logged in!', 'login');
        
        // Redirect to dashboard or intended page
        const intendedPath = sessionStorage.getItem('intendedPath') || '/dashboard';
        sessionStorage.removeItem('intendedPath');
        router.push(intendedPath);
      }
    },
    onError: (error) => {
      handleMutationError(error, 'login');
      setError(error instanceof Error ? error.message : 'Login failed');
    }
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        const { user, accessToken, expiresIn } = response.data;
        setUser(user, { accessToken, expiresIn });
        
        handleMutationSuccess('Account created successfully!', 'registration');
        
        // Show email verification notice if not verified
        if (!user.emailVerified) {
          toast.info('Please check your email', {
            description: 'We sent you a verification link to complete your registration.',
          });
        }
        
        router.push('/dashboard');
      }
    },
    onError: (error) => {
      handleMutationError(error, 'registration');
      setError(error instanceof Error ? error.message : 'Registration failed');
    }
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      handleMutationSuccess('Successfully logged out', 'logout');
      router.push('/login');
    },
    onError: (error) => {
      // Even if API call fails, clear local auth state
      clearAuth();
      console.error('Logout API error:', error);
      router.push('/login');
    }
  });

  // Profile query (only if authenticated)
  const profileQuery = useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: userApi.getProfile,
    enabled: isLoggedIn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry if unauthorized
      if (error?.statusCode === 401) {
        clearAuth();
        return false;
      }
      return failureCount < 2;
    },
  });

  // Handle profile query errors
  useEffect(() => {
    if (profileQuery.error) {
      const error = profileQuery.error as any;
      if (error?.statusCode === 401) {
        clearAuth();
        router.push('/login');
      }
    }
  }, [profileQuery.error, clearAuth, router]);

  // Helper functions
  const login = async (credentials: LoginRequest) => {
    return loginMutation.mutateAsync(credentials);
  };

  const register = async (userData: RegisterRequest) => {
    return registerMutation.mutateAsync(userData);
  };

  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  const clearError = () => {
    setError(null);
  };

  // Check authentication status on mount
  const checkAuth = () => {
    const token = useAuthStore.getState().getToken();
    if (!token) {
      clearAuth();
      return false;
    }
    return true;
  };

  return {
    // State
    user,
    isAuthenticated,
    isLoggedIn,
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    error,

    // Actions
    login,
    register,
    logout,
    clearError,
    checkAuth,

    // Mutation states
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isLogoutLoading: logoutMutation.isPending,

    // Profile data
    profile: profileQuery.data?.data,
    isProfileLoading: profileQuery.isLoading,
    profileError: profileQuery.error,

    // User properties (for convenience)
    userId: user?.id,
    username: user?.username,
    email: user?.email,
    displayName: user?.displayName,
    role: user?.role,
    isEmailVerified: user?.emailVerified,
    
    // Permission checks
    isAdmin: user?.role === 'ADMIN',
    isUser: user?.role === 'USER',
  };
}
