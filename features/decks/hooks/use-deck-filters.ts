import { useState, useMemo, useCallback } from 'react';
import { useDebounce } from '@/lib/hooks/use-debounce';
import type { DeckFilters, DeckSearchParams } from '../types';
import { parseFiltersToApiParams } from '../utils/deck-utils';

export interface UseDeckFiltersOptions {
  initialFilters?: Partial<DeckFilters>;
  debounceMs?: number;
}

export function useDeckFilters(options: UseDeckFiltersOptions = {}) {
  const { initialFilters = {}, debounceMs = 300 } = options;

  // Filter state
  const [filters, setFilters] = useState<DeckFilters>({
    search: '',
    topicId: undefined,
    cefrLevel: undefined,
    visibility: undefined,
    tags: [],
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialFilters,
  });

  // Debounced search to avoid too many API calls
  const debouncedSearch = useDebounce(filters.search || '', debounceMs);

  // Memoized API params
  const apiParams = useMemo((): DeckSearchParams => {
    const params = parseFiltersToApiParams({
      ...filters,
      search: debouncedSearch, // Use debounced search
    });
    return params;
  }, [filters, debouncedSearch]);

  // Update individual filter
  const updateFilter = useCallback(<K extends keyof DeckFilters>(
    key: K,
    value: DeckFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // Update multiple filters at once
  const updateFilters = useCallback((newFilters: Partial<DeckFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Reset all filters to defaults
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      topicId: undefined,
      cefrLevel: undefined,
      visibility: undefined,
      tags: [],
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...initialFilters,
    });
  }, [initialFilters]);

  // Clear search only
  const clearSearch = useCallback(() => {
    updateFilter('search', '');
  }, [updateFilter]);

  // Toggle sort order
  const toggleSortOrder = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  // Set sort by with optional order
  const setSortBy = useCallback((
    sortBy: DeckFilters['sortBy'],
    sortOrder?: DeckFilters['sortOrder']
  ) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      ...(sortOrder && { sortOrder }),
    }));
  }, []);

  // Add tag to filter
  const addTagFilter = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tag].filter((t, i, arr) => arr.indexOf(t) === i), // Remove duplicates
    }));
  }, []);

  // Remove tag from filter
  const removeTagFilter = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(t => t !== tag),
    }));
  }, []);

  // Check if filters are active (not default)
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.search ||
      filters.topicId ||
      filters.cefrLevel ||
      (filters.visibility && filters.visibility !== 'ALL') ||
      (filters.tags && filters.tags.length > 0)
    );
  }, [filters]);

  // Check if search is active
  const hasActiveSearch = useMemo(() => {
    return !!debouncedSearch;
  }, [debouncedSearch]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.topicId) count++;
    if (filters.cefrLevel) count++;
    if (filters.visibility && filters.visibility !== 'ALL') count++;
    if (filters.tags && filters.tags.length > 0) count += filters.tags.length;
    return count;
  }, [filters]);

  return {
    // State
    filters,
    apiParams,
    debouncedSearch,
    hasActiveFilters,
    hasActiveSearch,
    activeFilterCount,

    // Actions
    updateFilter,
    updateFilters,
    resetFilters,
    clearSearch,
    toggleSortOrder,
    setSortBy,
    addTagFilter,
    removeTagFilter,
  };
}
