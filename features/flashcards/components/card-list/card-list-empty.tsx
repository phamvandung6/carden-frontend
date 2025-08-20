'use client';

import React from 'react';
import { Plus, BookOpen, Sparkles, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AiGenerateDialog } from '@/features/decks';

interface CardListEmptyProps {
  deckTitle?: string;
  onCreateCard: () => void;
  isSearching?: boolean;
  searchQuery?: string;
  deckId?: number;
  onStudy?: () => void;
}

export function CardListEmpty({ 
  deckTitle, 
  onCreateCard, 
  isSearching = false, 
  searchQuery = '',
  deckId,
  onStudy
}: CardListEmptyProps) {
  if (isSearching) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No cards found</h3>
          <p className="text-muted-foreground mb-4">
            No cards match your search for "{searchQuery}". Try a different search term.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Clear Search
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {deckTitle ? `${deckTitle} is empty` : 'No cards yet'}
        </h3>
        <p className="text-muted-foreground mb-6">
          Get started by creating your first flashcard. Add vocabulary, concepts, or anything you want to study.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onCreateCard}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Card
          </Button>
          
          {deckId && (
            <AiGenerateDialog deckId={deckId} deckTitle={deckTitle}>
              <Button variant="outline" className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-200 hover:from-purple-500/20 hover:to-pink-500/20">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate with AI
              </Button>
            </AiGenerateDialog>
          )}
          
          {onStudy && (
            <Button 
              onClick={onStudy}
              variant="outline"
              className="bg-green-50 border-green-200 hover:bg-green-100 text-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Study Existing Cards
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
