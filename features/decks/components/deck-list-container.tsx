'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

import { DeckList } from './deck-list';
import { usePublicDecks, useMyDecks, useDeleteDeck, useDeckOperations } from '../hooks/use-decks';
import { useDecksStore } from '../stores/decks-store';
import type { DeckFilters, Deck } from '../types';
import { parseFiltersToApiParams } from '../utils/deck-utils';

interface DeckListContainerProps {
  variant?: 'my-decks' | 'public-decks';
  currentUserId?: number;
  onCreateDeck?: () => void;
  onEditDeck?: (deck: Deck) => void;
  className?: string;
  showFilters?: boolean;
  showBulkActions?: boolean;
  initialFilters?: Partial<DeckFilters>;
}

export function DeckListContainer({
  variant = 'my-decks',
  currentUserId,
  onCreateDeck,
  onEditDeck,
  className,
  showFilters = true,
  showBulkActions = true,
  initialFilters = {},
}: DeckListContainerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [apiParams, setApiParams] = useState(() => 
    parseFiltersToApiParams(initialFilters as DeckFilters)
  );

  const { deleteDeck } = useDeckOperations();
  const { 
    listState: { decks, loading, error, totalPages, totalItems } 
  } = useDecksStore();

  // Use appropriate hook based on variant
  const publicDecksQuery = usePublicDecks({
    ...apiParams,
    page: currentPage,
    size: pageSize,
  });

  const myDecksQuery = useMyDecks({
    ...apiParams,
    page: currentPage,
    size: pageSize,
  });

  const currentQuery = variant === 'public-decks' ? publicDecksQuery : myDecksQuery;

  // Handle filters change
  const handleFiltersChange = useCallback((filters: DeckFilters) => {
    const newApiParams = parseFiltersToApiParams(filters);
    setApiParams(newApiParams);
    setCurrentPage(0); // Reset to first page when filters change
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Handle page size change
  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(0); // Reset to first page when page size changes
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    currentQuery.refetch();
  }, [currentQuery]);

  // Handle delete deck
  const handleDeleteDeck = async (deckId: number) => {
    try {
      await deleteDeck.mutateAsync(deckId);
      toast.success('Deck deleted successfully');
    } catch (error) {
      console.error('Failed to delete deck:', error);
      toast.error('Failed to delete deck');
    }
  };

  // Handle duplicate deck
  const handleDuplicateDeck = (deck: Deck) => {
    // TODO: Implement deck duplication
    toast.info('Deck duplication feature coming soon');
  };

  // Handle share deck
  const handleShareDeck = (deck: Deck) => {
    // Copy deck URL to clipboard
    const url = `${window.location.origin}/decks/${deck.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Deck link copied to clipboard');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  // Handle download deck
  const handleDownloadDeck = (deck: Deck) => {
    // TODO: Implement deck download
    toast.info('Deck download feature coming soon');
  };

  // Handle bulk actions
  const handleBulkAction = async (action: string, deckIds: number[]) => {
    switch (action) {
      case 'delete':
        try {
          await Promise.all(deckIds.map(id => deleteDeck.mutateAsync(id)));
          toast.success(`${deckIds.length} deck(s) deleted successfully`);
        } catch (error) {
          console.error('Failed to delete decks:', error);
          toast.error('Failed to delete some decks');
        }
        break;
      
      case 'duplicate':
        toast.info('Bulk duplicate feature coming soon');
        break;
      
      case 'share':
        toast.info('Bulk share feature coming soon');
        break;
      
      case 'export':
        toast.info('Bulk export feature coming soon');
        break;
      
      default:
        toast.error('Unknown action');
    }
  };

  return (
    <DeckList
      decks={decks}
      loading={loading || currentQuery.isLoading}
      error={error || (currentQuery.error ? 'Failed to load decks' : null)}
      currentPage={currentPage}
      totalPages={totalPages}
      totalItems={totalItems}
      pageSize={pageSize}
      variant={variant}
      currentUserId={currentUserId}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      onFiltersChange={handleFiltersChange}
      onRefresh={handleRefresh}
      onCreateDeck={onCreateDeck}
      onEditDeck={onEditDeck}
      onDeleteDeck={handleDeleteDeck}
      onDuplicateDeck={handleDuplicateDeck}
      onShareDeck={handleShareDeck}
      onDownloadDeck={handleDownloadDeck}
      onBulkAction={handleBulkAction}
      className={className}
      showFilters={showFilters}
      showBulkActions={showBulkActions}
      initialFilters={initialFilters}
    />
  );
}
