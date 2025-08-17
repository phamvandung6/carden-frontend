'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

import type { DeckFilters } from '../types';
import { DeckFiltersSearch } from './deck-filters-search';
import { DeckFiltersQuick } from './deck-filters-quick';
import { DeckFiltersAdvanced } from './deck-filters-advanced';
import { DeckFiltersActive } from './deck-filters-active';

interface DeckFiltersProps {
  filters: DeckFilters;
  onFiltersChange: (filters: Partial<DeckFilters>) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  className?: string;
  showAdvanced?: boolean;
}

export function DeckFiltersComponent({
  filters,
  onFiltersChange,
  onResetFilters,
  hasActiveFilters,
  activeFilterCount,
  className,
  showAdvanced = true,
}: DeckFiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ search: value });
  };

  const handleCefrLevelChange = (value: string) => {
    onFiltersChange({ 
      cefrLevel: value === 'all' ? undefined : value as any 
    });
  };

  const handleVisibilityChange = (value: string) => {
    onFiltersChange({ 
      visibility: value === 'ALL' ? undefined : value as any 
    });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    onFiltersChange({ 
      sortBy: sortBy as any, 
      sortOrder: sortOrder as any 
    });
  };

  const removeTagFilter = (tag: string) => {
    const currentTags = filters.tags || [];
    onFiltersChange({ tags: currentTags.filter(t => t !== tag) });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <DeckFiltersSearch
          value={filters.search || ''}
          onChange={handleSearchChange}
        />

        {/* Quick Filters */}
        <div className="flex gap-2">
          <DeckFiltersQuick
            cefrLevel={filters.cefrLevel}
            sortBy={filters.sortBy || 'createdAt'}
            sortOrder={filters.sortOrder || 'desc'}
            hasActiveFilters={hasActiveFilters}
            activeFilterCount={activeFilterCount}
            onCefrLevelChange={handleCefrLevelChange}
            onSortChange={handleSortChange}
            onResetFilters={onResetFilters}
          />

          {/* Advanced Filters */}
          {showAdvanced && (
            <DeckFiltersAdvanced
              filters={filters}
              hasActiveFilters={hasActiveFilters}
              activeFilterCount={activeFilterCount}
              isOpen={isAdvancedOpen}
              onOpenChange={setIsAdvancedOpen}
              onFiltersChange={onFiltersChange}
              onResetFilters={onResetFilters}
            />
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      <DeckFiltersActive
        filters={filters}
        onSearchChange={handleSearchChange}
        onCefrLevelChange={handleCefrLevelChange}
        onVisibilityChange={handleVisibilityChange}
        onRemoveTag={removeTagFilter}
      />
    </div>
  );
}

// Keep the original export for backward compatibility
export { DeckFiltersComponent as DeckFilters };