'use client';

import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import type { DeckFilters } from '../types';

interface DeckFiltersActiveProps {
  filters: DeckFilters;
  onSearchChange: (value: string) => void;
  onCefrLevelChange: (value: string) => void;
  onVisibilityChange: (value: string) => void;
  onRemoveTag: (tag: string) => void;
}

export function DeckFiltersActive({
  filters,
  onSearchChange,
  onCefrLevelChange,
  onVisibilityChange,
  onRemoveTag,
}: DeckFiltersActiveProps) {
  const hasActiveFilters = !!(
    filters.search ||
    filters.cefrLevel ||
    (filters.visibility && filters.visibility !== 'ALL') ||
    (filters.tags && filters.tags.length > 0)
  );

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      
      {filters.search && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Search: "{filters.search}"
          <button
            onClick={() => onSearchChange('')}
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.cefrLevel && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Level: {filters.cefrLevel}
          <button
            onClick={() => onCefrLevelChange('all')}
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.visibility && filters.visibility !== 'ALL' && (
        <Badge variant="secondary" className="flex items-center gap-1">
          Visibility: {filters.visibility}
          <button
            onClick={() => onVisibilityChange('ALL')}
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      )}

      {filters.tags && filters.tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
          Tag: {tag}
          <button
            onClick={() => onRemoveTag(tag)}
            className="ml-1 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </div>
  );
}
