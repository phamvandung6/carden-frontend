'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

import type { DeckFilters } from '../types';
import { CEFR_LEVEL_OPTIONS, VISIBILITY_OPTIONS } from '../schemas/deck-form-schema';

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
  const [tagInput, setTagInput] = useState('');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ search: value });
  };

  const handleTopicChange = (value: string) => {
    onFiltersChange({ 
      topicId: value === 'all' ? undefined : parseInt(value) 
    });
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

  const addTagFilter = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;

    const currentTags = filters.tags || [];
    if (currentTags.includes(trimmedTag)) return;

    onFiltersChange({ tags: [...currentTags, trimmedTag] });
    setTagInput('');
  };

  const removeTagFilter = (tag: string) => {
    const currentTags = filters.tags || [];
    onFiltersChange({ tags: currentTags.filter(t => t !== tag) });
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTagFilter();
    }
  };

  const currentSort = `${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search decks..."
            value={filters.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9 pr-4"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSearchChange('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2">
          {/* CEFR Level Quick Filter */}
          <Select value={filters.cefrLevel || 'all'} onValueChange={handleCefrLevelChange}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {CEFR_LEVEL_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest</SelectItem>
              <SelectItem value="createdAt-asc">Oldest</SelectItem>
              <SelectItem value="title-asc">Name A-Z</SelectItem>
              <SelectItem value="title-desc">Name Z-A</SelectItem>
              <SelectItem value="cardCount-desc">Most Cards</SelectItem>
              <SelectItem value="cardCount-asc">Fewest Cards</SelectItem>
              <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
            </SelectContent>
          </Select>

          {/* Advanced Filters Toggle */}
          {showAdvanced && (
            <Popover open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
                    >
                      {activeFilterCount}
                    </Badge>
                  )}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Advanced Filters</h4>
                    {hasActiveFilters && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onResetFilters}
                        className="h-auto p-1 text-xs"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Reset
                      </Button>
                    )}
                  </div>

                  {/* Visibility Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm">Visibility</Label>
                    <Select 
                      value={filters.visibility || 'ALL'} 
                      onValueChange={handleVisibilityChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All</SelectItem>
                        {VISIBILITY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Topic Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm">Topic</Label>
                    <Select 
                      value={filters.topicId?.toString() || 'all'} 
                      onValueChange={handleTopicChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Topics</SelectItem>
                        {/* TODO: Add topic options from API */}
                        <SelectItem value="1">General English</SelectItem>
                        <SelectItem value="2">Business English</SelectItem>
                        <SelectItem value="3">Academic English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Tags Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInputKeyDown}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addTagFilter}
                        disabled={!tagInput.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {filters.tags && filters.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {filters.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary" 
                            className="flex items-center gap-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTagFilter(tag)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onResetFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{filters.search}"
              <button
                onClick={() => handleSearchChange('')}
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
                onClick={() => handleCefrLevelChange('all')}
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
                onClick={() => handleVisibilityChange('ALL')}
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
                onClick={() => removeTagFilter(tag)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
