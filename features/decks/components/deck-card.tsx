'use client';

import type { Deck } from '../types';
import { DeckCardCompact } from './deck-card-compact';
import { DeckCardDefault } from './deck-card-default';

interface DeckCardProps {
  deck: Deck;
  currentUserId?: number;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deckId: number) => void;
  onDuplicate?: (deck: Deck) => void;
  onShare?: (deck: Deck) => void;
  onDownload?: (deck: Deck) => void;
  showActions?: boolean;
  showStats?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
  href?: string;
}

export function DeckCard({
  deck,
  currentUserId,
  onEdit,
  onDelete,
  onDuplicate,
  onShare,
  onDownload,
  showActions = true,
  showStats = true,
  variant = 'default',
  className,
  href,
}: DeckCardProps) {
  // Route to appropriate variant component
  if (variant === 'compact') {
    return (
      <DeckCardCompact
        deck={deck}
        currentUserId={currentUserId}
        onEdit={onEdit}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        onShare={onShare}
        onDownload={onDownload}
        showActions={showActions}
        href={href}
        className={className}
      />
    );
  }

  // Default and detailed variants use the same component for now
  // TODO: Create DeckCardDetailed component if needed
  return (
    <DeckCardDefault
      deck={deck}
      currentUserId={currentUserId}
      onEdit={onEdit}
      onDelete={onDelete}
      onDuplicate={onDuplicate}
      onShare={onShare}
      onDownload={onDownload}
      showActions={showActions}
      showStats={showStats}
      href={href}
      className={className}
    />
  );
}

