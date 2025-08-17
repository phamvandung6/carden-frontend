'use client';

import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeckCardThumbnailProps {
  coverImageUrl?: string | null;
  title: string;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showHoverEffect?: boolean;
}

export function DeckCardThumbnail({
  coverImageUrl,
  title,
  className,
  size = 'medium',
  showHoverEffect = false
}: DeckCardThumbnailProps) {
  const sizeClasses = {
    small: 'w-12 h-12',
    medium: 'aspect-video w-full',
    large: 'aspect-video w-full'
  };

  const iconSizes = {
    small: 'h-6 w-6',
    medium: 'h-8 w-8', 
    large: 'h-12 w-12'
  };

  return (
    <div className={cn(
      'overflow-hidden bg-muted flex items-center justify-center',
      sizeClasses[size],
      size === 'small' ? 'rounded-lg' : 'rounded-t-lg',
      className
    )}>
      {coverImageUrl ? (
        <img
          src={coverImageUrl}
          alt={title}
          className={cn(
            'w-full h-full object-cover',
            showHoverEffect && 'group-hover:scale-105 transition-transform duration-200'
          )}
        />
      ) : (
        <BookOpen className={cn('text-muted-foreground', iconSizes[size])} />
      )}
    </div>
  );
}
