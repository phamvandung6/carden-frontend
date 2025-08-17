'use client';

import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
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
  Plus,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';
type DeckListVariant = 'my-decks' | 'public-decks' | 'shared-decks';

interface DeckListToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedCount: number;
  totalItems: number;
  pageSize: number;
  onPageSizeChange?: (size: number) => void;
  onRefresh?: () => void;
  onCreateDeck?: () => void;
  onBulkAction?: (action: string) => void;
  variant?: DeckListVariant;
  showBulkActions?: boolean;
  hasActiveFilters?: boolean;
  activeFilterCount?: number;
}

export function DeckListToolbar({
  viewMode,
  onViewModeChange,
  selectedCount,
  totalItems,
  pageSize,
  onPageSizeChange,
  onRefresh,
  onCreateDeck,
  onBulkAction,
  variant = 'my-decks',
  showBulkActions = true,
  hasActiveFilters = false,
  activeFilterCount = 0
}: DeckListToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* Results info */}
        <div className="text-sm text-muted-foreground">
          {totalItems > 0 ? (
            <>
              Showing {totalItems} {totalItems === 1 ? 'deck' : 'decks'}
              {hasActiveFilters && activeFilterCount > 0 && (
                <span className="ml-1">
                  ({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} applied)
                </span>
              )}
            </>
          ) : (
            'No decks found'
          )}
        </div>

        {/* Bulk actions */}
        {showBulkActions && selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {selectedCount} selected
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4 mr-2" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => onBulkAction?.('duplicate')}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onBulkAction?.('share')}>
                  <Share className="mr-2 h-4 w-4" />
                  Share Selected
                </DropdownMenuItem>
                {variant === 'my-decks' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => onBulkAction?.('delete')}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Selected
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Page size selector */}
        {onPageSizeChange && (
          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* View mode toggle */}
        <div className="flex items-center border rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="rounded-r-none border-r"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
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

        {/* Create button */}
        {onCreateDeck && variant === 'my-decks' && (
          <Button size="sm" onClick={onCreateDeck}>
            <Plus className="h-4 w-4 mr-2" />
            Create Deck
          </Button>
        )}
      </div>
    </div>
  );
}
