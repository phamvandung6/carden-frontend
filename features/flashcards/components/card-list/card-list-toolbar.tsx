'use client';

import React from 'react';
import { Plus, Search, Filter, Sparkles, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AiGenerateDialog } from '@/features/decks';
import { StudyButton } from '@/features/study';

interface CardListToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateCard: () => void;
  onToggleFilters?: () => void;
  showFilters?: boolean;
  deckId?: number;
  deckTitle?: string;
  onStudy?: () => void;
}

export function CardListToolbar({
  searchQuery,
  onSearchChange,
  onCreateCard,
  onToggleFilters,
  showFilters = false,
  deckId,
  deckTitle,
  onStudy
}: CardListToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search cards..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {onToggleFilters && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onToggleFilters}
            data-active={showFilters}
            className="data-[active=true]:bg-accent"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        )}
        
        {/* Study Button */}
        {onStudy && (
          <Button 
            onClick={onStudy}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            Study Deck
          </Button>
        )}
        
        {deckId && (
          <AiGenerateDialog deckId={deckId} deckTitle={deckTitle}>
            <Button variant="outline" className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200 hover:from-purple-500/20 hover:to-pink-500/20">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generate
            </Button>
          </AiGenerateDialog>
        )}
        
        <Button onClick={onCreateCard}>
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      </div>
    </div>
  );
}
