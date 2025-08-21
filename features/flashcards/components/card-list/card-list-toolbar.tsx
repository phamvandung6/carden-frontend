'use client';

import React from 'react';
import { Plus, Search, Filter, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AiGenerateDialog } from '@/features/decks';

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
    <div className="flex items-center justify-end gap-4 mb-6">
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
