'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import type { Deck } from '../types';
import { formatCardCount } from '../utils/deck-utils';
import { DeckCardThumbnail } from './deck-card-thumbnail';
import { DeckCardActions } from './deck-card-actions';

interface DeckCardCompactProps {
  deck: Deck;
  currentUserId?: number;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deckId: number) => void;
  onDuplicate?: (deck: Deck) => void;
  onShare?: (deck: Deck) => void;
  onDownload?: (deck: Deck) => void;
  showActions?: boolean;
  href?: string;
  className?: string;
}

export function DeckCardCompact({
  deck,
  currentUserId,
  onEdit,
  onDelete,
  onDuplicate,
  onShare,
  onDownload,
  showActions = true,
  href,
  className
}: DeckCardCompactProps) {
  const cardHref = href || `/decks/${deck.id}`;

  return (
    <Card className={cn('hover:shadow-md transition-shadow cursor-pointer', className)}>
      <Link href={cardHref} className="block">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Thumbnail */}
            <DeckCardThumbnail
              coverImageUrl={deck.coverImageUrl}
              title={deck.title}
              size="small"
              className="flex-shrink-0"
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{deck.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {formatCardCount(deck.cardCount)}
                </span>
                {deck.cefrLevel && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    {deck.cefrLevel}
                  </Badge>
                )}
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <DeckCardActions
                deck={deck}
                currentUserId={currentUserId}
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onShare={onShare}
                onDownload={onDownload}
                className="flex-shrink-0"
              />
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
