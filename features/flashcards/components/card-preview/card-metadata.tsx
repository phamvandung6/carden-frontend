'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import type { CardDifficulty } from '../../types';

interface CardMetadataProps {
  difficulty?: CardDifficulty;
  displayOrder?: number;
  cardCount?: number;
  className?: string;
}

export function CardMetadata({
  difficulty = 'NORMAL',
  displayOrder,
  cardCount,
  className
}: CardMetadataProps) {
  const getDifficultyColor = (diff: CardDifficulty) => {
    switch (diff) {
      case 'EASY':
        return 'default';
      case 'NORMAL':
        return 'secondary';
      case 'HARD':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className={`flex items-center justify-between text-xs text-muted-foreground ${className}`}>
      <div className="flex items-center gap-2">
        {displayOrder && (
          <span>Card #{displayOrder}</span>
        )}
        {cardCount && (
          <span>of {cardCount}</span>
        )}
      </div>
      
      <Badge variant={getDifficultyColor(difficulty)} className="text-xs">
        {difficulty}
      </Badge>
    </div>
  );
}
