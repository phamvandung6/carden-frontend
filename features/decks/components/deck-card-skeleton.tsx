'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface DeckCardSkeletonProps {
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export function DeckCardSkeleton({ variant = 'default', className }: DeckCardSkeletonProps) {
  // Compact variant
  if (variant === 'compact') {
    return (
      <Card className={cn('', className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Thumbnail skeleton */}
            <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
            
            {/* Content skeleton */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>

            {/* Actions skeleton */}
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detailed variant
  if (variant === 'detailed') {
    return (
      <Card className={cn('', className)}>
        {/* Thumbnail skeleton */}
        <Skeleton className="aspect-video w-full rounded-t-lg" />

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-8 w-8 rounded flex-shrink-0" />
          </div>

          {/* Tags skeleton */}
          <div className="flex flex-wrap gap-1 mt-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-10" />
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Metadata skeleton */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-5 w-8" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-24" />
          </div>
        </CardContent>

        {/* Footer skeleton */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-8" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn('', className)}>
      {/* Thumbnail skeleton */}
      <Skeleton className="aspect-video w-full rounded-t-lg" />

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-8" />
        </div>
        <Skeleton className="h-4 w-full mt-1" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-1 mb-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Stats skeleton */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Grid of skeleton cards for loading states
export function DeckCardGridSkeleton({ 
  count = 6, 
  variant = 'default',
  className 
}: { 
  count?: number; 
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}) {
  return (
    <div className={cn(
      'grid gap-4',
      variant === 'compact' 
        ? 'grid-cols-1' 
        : variant === 'detailed'
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      className
    )}>
      {Array.from({ length: count }, (_, i) => (
        <DeckCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
}
