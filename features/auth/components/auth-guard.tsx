'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../hooks/use-auth';
import type { AuthGuardProps, ProtectedRouteProps } from '../types';

/**
 * AuthGuard - Protects routes that require authentication
 * Redirects to login if user is not authenticated
 */
export function AuthGuard({ 
  children, 
  fallback = null, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Wait for hydration to complete
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Store intended path for redirect after login - only after hydration
    if (isHydrated && !isLoading && !isLoggedIn && pathname !== redirectTo) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('intendedPath', pathname);
      }
      router.push(redirectTo);
    }
  }, [isHydrated, isLoggedIn, isLoading, router, pathname, redirectTo]);

  // Show loading state while hydrating or checking authentication
  if (!isHydrated || isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isLoggedIn) {
    return fallback;
  }

  return <>{children}</>;
}

/**
 * ProtectedRoute - More advanced route protection with role-based access
 */
export function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback = null 
}: ProtectedRouteProps) {
  const { isLoggedIn, isLoading, user, role } = useAuth();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Wait for hydration to complete
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !isLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isHydrated, isLoggedIn, isLoading, router]);

  // Show loading state while hydrating or auth loading
  if (!isHydrated || isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check authentication
  if (!isLoggedIn || !user) {
    return fallback;
  }

  // Check role-based access
  if (requiredRole && role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-muted-foreground">
            Required role: <span className="font-medium">{requiredRole}</span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * GuestGuard - Redirects authenticated users away from auth pages
 * Useful for login/register pages
 */
export function GuestGuard({ 
  children, 
  redirectTo = '/dashboard' 
}: { 
  children: React.ReactNode; 
  redirectTo?: string; 
}) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Wait for hydration to complete
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !isLoading && isLoggedIn) {
      router.push(redirectTo);
    }
  }, [isHydrated, isLoggedIn, isLoading, router, redirectTo]);

  // Show loading state while hydrating or auth loading
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render if authenticated (will redirect)
  if (isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}

/**
 * ConditionalAuthGuard - Shows different content based on auth status
 */
export function ConditionalAuthGuard({
  authenticated,
  unauthenticated,
  loading = null,
}: {
  authenticated: React.ReactNode;
  unauthenticated: React.ReactNode;
  loading?: React.ReactNode;
}) {
  const { isLoggedIn, isLoading } = useAuth();
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Wait for hydration to complete
  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Show loading during hydration or auth loading
  if (!isHydrated || isLoading) {
    return loading || (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{isLoggedIn ? authenticated : unauthenticated}</>;
}

/**
 * AdminGuard - Shortcut for admin-only routes
 */
export function AdminGuard({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="ADMIN" fallback={fallback}>
      {children}
    </ProtectedRoute>
  );
}
