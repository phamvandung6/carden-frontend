'use client';

import { useState, useCallback, useEffect, useRef, memo } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import type { Deck, DeckFilters } from '../types';
import { DeckCardGridSkeleton } from './deck-card-skeleton';
import { DeckEmptyState } from './deck-empty-state';
import { DeckFiltersComponent } from './deck-filters';
import { DeckListToolbar } from './deck-list-toolbar';
import { DeckListGrid } from './deck-list-grid';
import { DeckListPagination } from './deck-list-pagination';
import { DeckListBulkSelector } from './deck-list-bulk-selector';
import { useDeckFilters } from '../hooks/use-deck-filters';

type ViewMode = 'grid' | 'list';
type DeckListVariant = 'my-decks' | 'public-decks' | 'shared-decks';

interface DeckListProps {
  decks: Deck[];
  loading?: boolean;
  error?: string | null;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  variant?: DeckListVariant;
  currentUserId?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onFiltersChange?: (filters: DeckFilters) => void;
  onRefresh?: () => void;
  onCreateDeck?: () => void;
  onEditDeck?: (deck: Deck) => void;
  onDeleteDeck?: (deckId: number) => void;
  onDuplicateDeck?: (deck: Deck) => void;
  onShareDeck?: (deck: Deck) => void;
  onDownloadDeck?: (deck: Deck) => void;
  onBulkAction?: (action: string, deckIds: number[]) => void;
  className?: string;
  showFilters?: boolean;
  showBulkActions?: boolean;
  initialFilters?: Partial<DeckFilters>;
}

export const DeckList = memo(function DeckList({
  decks,
  loading = false,
  error,
  currentPage = 0,
  totalPages = 0,
  totalItems = 0,
  pageSize = 20,
  variant = 'my-decks',
  currentUserId,
  onPageChange,
  onPageSizeChange,
  onFiltersChange,
  onRefresh,
  onCreateDeck,
  onEditDeck,
  onDeleteDeck,
  onDuplicateDeck,
  onShareDeck,
  onDownloadDeck,
  onBulkAction,
  className,
  showFilters = true,
  showBulkActions = true,
  initialFilters = {},
}: DeckListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedDecks, setSelectedDecks] = useState<Set<number>>(new Set());
  
  // Initialize filters without search initially
  const filtersWithoutSearch = { ...initialFilters };
  delete filtersWithoutSearch.search;
  
  const {
    filters,
    debouncedSearch,
    updateFilter,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useDeckFilters({ 
    initialFilters: filtersWithoutSearch,
    debounceMs: 300 
  });

  // Track only debouncedSearch for parent notification
  const prevDebouncedSearchRef = useRef(debouncedSearch);
  
  useEffect(() => {
    if (debouncedSearch !== prevDebouncedSearchRef.current) {
      prevDebouncedSearchRef.current = debouncedSearch;
      onFiltersChange?.({
        ...filters,
        search: debouncedSearch,
      });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  // Handle internal filter changes (non-search only to avoid loops)
  const handleInternalFiltersChange = useCallback((newFilters: Partial<DeckFilters>) => {
    updateFilters(newFilters);
    
    // Only notify parent immediately for non-search filters
    if (!newFilters.hasOwnProperty('search')) {
      onFiltersChange?.({
        ...filters,
        ...newFilters,
        search: debouncedSearch,
      });
    }
  }, [updateFilters, filters, debouncedSearch, onFiltersChange]);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDecks(new Set(decks.map(deck => deck.id)));
    } else {
      setSelectedDecks(new Set());
    }
  };

  const handleSelectDeck = (deckId: number, checked: boolean) => {
    const newSelection = new Set(selectedDecks);
    if (checked) {
      newSelection.add(deckId);
    } else {
      newSelection.delete(deckId);
    }
    setSelectedDecks(newSelection);
  };

  const handleBulkAction = (action: string) => {
    if (selectedDecks.size === 0) {
      toast.error('Please select at least one deck');
      return;
    }

    onBulkAction?.(action, Array.from(selectedDecks));
    setSelectedDecks(new Set());
  };



  // Handle loading state
  if (loading) {
    return (
      <div className={cn('space-y-6', className)}>
        {showFilters && (
          <div className="h-16 bg-muted/20 rounded-lg animate-pulse" />
        )}
        <DeckCardGridSkeleton 
          count={pageSize}
          variant={viewMode === 'grid' ? 'default' : 'compact'}
        />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          {onRefresh && (
            <Button onClick={onRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

    // Handle empty state
  if (!loading && decks.length === 0) {
    const emptyStateType = hasActiveFilters 
      ? 'no-search-results' 
      : (variant === 'public-decks' ? 'no-public-decks' : 'no-decks');

    return (
      <div className={cn('space-y-6', className)}>
        {/* ALWAYS render filters when showFilters is true */}
        {showFilters && (
          <DeckFiltersComponent
            filters={filters}
            onFiltersChange={handleInternalFiltersChange}
            onResetFilters={resetFilters}
            hasActiveFilters={hasActiveFilters}
            activeFilterCount={activeFilterCount}
          />
        )}
        
        <DeckEmptyState
          type={emptyStateType}
          onCreateDeck={onCreateDeck}
          onClearFilters={hasActiveFilters ? resetFilters : undefined}
        />
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Filters */}
      {showFilters && (
        <DeckFiltersComponent
          filters={filters}
          onFiltersChange={handleInternalFiltersChange}
          onResetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
        />
      )}

      {/* Toolbar */}
      <DeckListToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedCount={selectedDecks.size}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        onRefresh={onRefresh}
        onCreateDeck={onCreateDeck}
        onBulkAction={handleBulkAction}
        variant={variant}
        showBulkActions={showBulkActions}
        hasActiveFilters={hasActiveFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Bulk selection header */}
      <DeckListBulkSelector
        totalCount={decks.length}
        selectedCount={selectedDecks.size}
        onSelectAll={handleSelectAll}
        show={showBulkActions}
      />

      {/* Deck Grid/List */}
      <DeckListGrid
        decks={decks}
        viewMode={viewMode}
        currentUserId={currentUserId}
        selectedDecks={selectedDecks}
        showBulkActions={showBulkActions}
        onSelectDeck={handleSelectDeck}
        onEdit={onEditDeck}
        onDelete={onDeleteDeck}
        onDuplicate={onDuplicateDeck}
        onShare={onShareDeck}
        onDownload={onDownloadDeck}
      />

      {/* Pagination */}
      <DeckListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
});
