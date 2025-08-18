'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Play, Calendar, Users, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { Deck } from '../types';
import { 
  formatCardCount, 
  formatVisibility, 
  getVisibilityBadgeColor, 
  formatCefrLevel, 
  getCefrLevelColor, 
  formatRelativeTime 
} from '../utils/deck-utils';
import { DeckCardThumbnail } from './deck-card-thumbnail';
import { DeckCardActions } from './deck-card-actions';

interface DeckCardDefaultProps {
  deck: Deck;
  currentUserId?: number;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deckId: number) => void;
  onDuplicate?: (deck: Deck) => void;
  onShare?: (deck: Deck) => void;
  onDownload?: (deck: Deck) => void;
  showActions?: boolean;
  showStats?: boolean;
  href?: string;
  className?: string;
}

export function DeckCardDefault({
  deck,
  currentUserId,
  onEdit,
  onDelete,
  onDuplicate,
  onShare,
  onDownload,
  showActions = true,
  showStats = true,
  href,
  className
}: DeckCardDefaultProps) {
  const cardHref = href || `/decks/${deck.id}`;

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement like functionality
  };

  return (
    <Card className={cn('hover:shadow-md transition-shadow cursor-pointer group h-80 flex flex-col', className)}>
      <Link href={cardHref} className="block h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative p-3">
          <DeckCardThumbnail
            coverImageUrl={deck.coverImageUrl}
            title={deck.title}
            size="medium"
            showHoverEffect
          />
          
          {/* Quick action overlay */}
          <div className="absolute inset-3 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="secondary" className="shadow-lg">
                    <Play className="h-4 w-4 mr-2" />
                    Study
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Start studying this deck</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Visibility badge */}
          <div className="absolute top-5 right-5 z-10 group-hover:opacity-0 transition-opacity">
            <Badge variant="secondary" className={cn('text-xs', getVisibilityBadgeColor(deck.visibility))}>
              {formatVisibility(deck.visibility)}
            </Badge>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="absolute top-5 right-5 z-20">
              <DeckCardActions
                deck={deck}
                currentUserId={currentUserId}
                onEdit={onEdit}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
                onShare={onShare}
                onDownload={onDownload}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          )}
        </div>

        <CardHeader className="pb-3 pt-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-3 min-w-0">
            <h3 className="font-medium text-base leading-tight truncate flex-1 min-w-0">
              {deck.title}
            </h3>
            {deck.cefrLevel && (
              <Badge className={cn('text-xs flex-shrink-0', getCefrLevelColor(deck.cefrLevel))}>
                {formatCefrLevel(deck.cefrLevel)}
              </Badge>
            )}
          </div>
          {/* Fixed height description area to ensure consistent card heights */}
          <div className="h-10 mt-2">
            {deck.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 break-words">
                {deck.description}
              </p>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-0 mt-auto">
          {/* Tags */}
          {deck.tags && deck.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3 min-w-0">
              {deck.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs truncate max-w-20">
                  {tag}
                </Badge>
              ))}
              {deck.tags.length > 3 && (
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  +{deck.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Stats */}
          {showStats && (
            <div className="flex items-center justify-between text-sm min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <span className="text-muted-foreground whitespace-nowrap">
                  {formatCardCount(deck.cardCount)}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3 w-3 flex-shrink-0" />
                  <span className="whitespace-nowrap">{deck.downloadCount || 0}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1 text-muted-foreground hover:text-red-500 transition-colors"
                >
                  <Heart className="h-3 w-3 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{deck.likeCount || 0}</span>
                </button>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3 flex-shrink-0" />
                  <span className="text-xs whitespace-nowrap">{formatRelativeTime(deck.updatedAt)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
