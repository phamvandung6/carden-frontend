'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

import type { Deck } from '../types';
import { DeckCard } from './deck-card';

type ViewMode = 'grid' | 'list';

interface DeckListGridProps {
  decks: Deck[];
  viewMode: ViewMode;
  currentUserId?: number;
  selectedDecks: Set<number>;
  showBulkActions?: boolean;
  onSelectDeck: (deckId: number, checked: boolean) => void;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deckId: number) => void;
  onDuplicate?: (deck: Deck) => void;
  onShare?: (deck: Deck) => void;
  onDownload?: (deck: Deck) => void;
}

export function DeckListGrid({
  decks,
  viewMode,
  currentUserId,
  selectedDecks,
  showBulkActions = true,
  onSelectDeck,
  onEdit,
  onDelete,
  onDuplicate,
  onShare,
  onDownload
}: DeckListGridProps) {
  return (
    <div className={cn(
      viewMode === 'grid'
        ? 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        : 'space-y-3'
    )}>
      {decks.map((deck) => (
        <div key={deck.id} className="relative">
          {showBulkActions && (
            <div className="absolute top-2 left-3 z-10">
              <Checkbox
                checked={selectedDecks.has(deck.id)}
                onCheckedChange={(checked) => onSelectDeck(deck.id, !!checked)}
                className="bg-background/90 border-2 backdrop-blur-sm shadow-lg"
              />
            </div>
          )}
          <DeckCard
            deck={deck}
            currentUserId={currentUserId}
            onEdit={onEdit}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onShare={onShare}
            onDownload={onDownload}
            variant={viewMode === 'list' ? 'compact' : 'default'}
            showActions={!selectedDecks.has(deck.id)}
            className={cn(
              showBulkActions && selectedDecks.has(deck.id) && 'ring-2 ring-primary'
            )}
          />
        </div>
      ))}
    </div>
  );
}
