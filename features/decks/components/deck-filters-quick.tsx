'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, RotateCcw, ChevronDown } from 'lucide-react';
import { CEFR_LEVEL_OPTIONS } from '../schemas/deck-form-schema';

interface DeckFiltersQuickProps {
  cefrLevel?: string;
  sortBy: string;
  sortOrder: string;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  onCefrLevelChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onResetFilters: () => void;
}

export function DeckFiltersQuick({
  cefrLevel,
  sortBy,
  sortOrder,
  hasActiveFilters,
  activeFilterCount,
  onCefrLevelChange,
  onSortChange,
  onResetFilters,
}: DeckFiltersQuickProps) {
  const currentSort = `${sortBy || 'createdAt'}-${sortOrder || 'desc'}`;

  const sortOptions = [
    { value: 'createdAt-desc', label: 'Newest' },
    { value: 'createdAt-asc', label: 'Oldest' },
    { value: 'updatedAt-desc', label: 'Recently Updated' },
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
    { value: 'cardCount-desc', label: 'Most Cards' },
    { value: 'cardCount-asc', label: 'Least Cards' },
  ];

  return (
    <div className="flex gap-2">
      {/* CEFR Level Quick Filter */}
      <Select value={cefrLevel || 'all'} onValueChange={onCefrLevelChange}>
        <SelectTrigger className="w-32 text-sm">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-sm">All Levels</SelectItem>
          {CEFR_LEVEL_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-sm">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort Filter */}
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-42 text-sm">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-sm">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="default"
          onClick={onResetFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      )}
    </div>
  );
}
