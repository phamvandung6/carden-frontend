'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Grid3X3,
  List,
  MoreVertical,
  Trash2,
  Share,
  Download,
  Copy,
  Eye,
  Plus,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import type { Deck, DeckFilters } from '../types';
import { DeckCard } from './deck-card';
import { DeckCardSkeleton, DeckCardGridSkeleton } from './deck-card-skeleton';
import { DeckEmptyState } from './deck-empty-state';
import { DeckFiltersComponent } from './deck-filters';
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

export function DeckList({
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

  const {
    filters,
    updateFilter,
    updateFilters,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
  } = useDeckFilters({ initialFilters });

  // Handle internal filter changes and notify parent
  const handleInternalFiltersChange = useCallback((newFilters: Partial<DeckFilters>) => {
    updateFilters(newFilters);
    onFiltersChange?.({ ...filters, ...newFilters });
  }, [filters, updateFilters, onFiltersChange]);

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

  // Get page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const start = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    const end = Math.min(totalPages, start + maxVisiblePages);

    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const isAllSelected = selectedDecks.size > 0 && selectedDecks.size === decks.length;
  const isIndeterminate = selectedDecks.size > 0 && selectedDecks.size < decks.length;

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
    if (hasActiveFilters) {
      return (
        <div className={cn('space-y-6', className)}>
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
            type="no-search-results"
            onCreateDeck={onCreateDeck}
            onClearFilters={resetFilters}
          />
        </div>
      );
    }

    const emptyType = variant === 'public-decks' ? 'no-public-decks' : 'no-decks';
    return (
      <div className={cn('space-y-6', className)}>
        <DeckEmptyState
          type={emptyType}
          onCreateDeck={onCreateDeck}
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Results count */}
          <div className="text-sm text-muted-foreground">
            {totalItems > 0 ? (
              <>
                Showing {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalItems)} of {totalItems} decks
              </>
            ) : (
              'No decks found'
            )}
          </div>

          {/* Bulk actions */}
          {showBulkActions && selectedDecks.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedDecks.size} selected
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4 mr-2" />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleBulkAction('duplicate')}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction('share')}>
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleBulkAction('delete')}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Page size selector */}
          <Select 
            value={pageSize.toString()} 
            onValueChange={(value) => onPageSizeChange?.(parseInt(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
              <SelectItem value="96">96</SelectItem>
            </SelectContent>
          </Select>

          {/* View mode toggle */}
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Refresh button */}
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}

          {/* Create deck button */}
          {onCreateDeck && variant === 'my-decks' && (
            <Button onClick={onCreateDeck} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Create Deck
            </Button>
          )}
        </div>
      </div>

      {/* Bulk selection header */}
      {showBulkActions && decks.length > 0 && (
        <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
            className={cn(isIndeterminate && 'data-[state=checked]:bg-primary')}
          />
          <span className="text-sm">
            Select all decks
          </span>
        </div>
      )}

      {/* Deck Grid/List */}
      <div className={cn(
        viewMode === 'grid'
          ? 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          : 'space-y-3'
      )}>
        {decks.map((deck, index) => (
          <div key={deck.id} className="relative">
            {showBulkActions && (
              <div className="absolute top-2 left-2 z-10">
                <Checkbox
                  checked={selectedDecks.has(deck.id)}
                  onCheckedChange={(checked) => handleSelectDeck(deck.id, !!checked)}
                  className="bg-background border-2"
                />
              </div>
            )}
            <DeckCard
              deck={deck}
              currentUserId={currentUserId}
              onEdit={onEditDeck}
              onDelete={onDeleteDeck}
              onDuplicate={onDuplicateDeck}
              onShare={onShareDeck}
              onDownload={onDownloadDeck}
              variant={viewMode === 'list' ? 'compact' : 'default'}
              showActions={!selectedDecks.has(deck.id)}
              className={cn(
                showBulkActions && selectedDecks.has(deck.id) && 'ring-2 ring-primary'
              )}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => onPageChange?.(Math.max(0, currentPage - 1))}
                  className={cn(
                    currentPage === 0 && 'pointer-events-none opacity-50'
                  )}
                />
              </PaginationItem>

              {getPageNumbers().map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => onPageChange?.(page)}
                    isActive={page === currentPage}
                  >
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext 
                  onClick={() => onPageChange?.(Math.min(totalPages - 1, currentPage + 1))}
                  className={cn(
                    currentPage >= totalPages - 1 && 'pointer-events-none opacity-50'
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
