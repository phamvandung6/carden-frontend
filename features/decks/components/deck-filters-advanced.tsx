'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { SlidersHorizontal, RotateCcw, ChevronDown, Plus, X } from 'lucide-react';
import { VISIBILITY_OPTIONS } from '../schemas/deck-form-schema';
import type { DeckFilters } from '../types';

interface DeckFiltersAdvancedProps {
  filters: DeckFilters;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onFiltersChange: (filters: Partial<DeckFilters>) => void;
  onResetFilters: () => void;
}

export function DeckFiltersAdvanced({
  filters,
  hasActiveFilters,
  activeFilterCount,
  isOpen,
  onOpenChange,
  onFiltersChange,
  onResetFilters,
}: DeckFiltersAdvancedProps) {
  const [tagInput, setTagInput] = useState('');

  const handleVisibilityChange = (value: string) => {
    onFiltersChange({ 
      visibility: value === 'ALL' ? undefined : value as any 
    });
  };

  const handleTopicChange = (value: string) => {
    onFiltersChange({ 
      topicId: value === 'all' ? undefined : parseInt(value) 
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

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
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
          <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
  );
}
