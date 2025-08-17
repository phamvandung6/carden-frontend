'use client';

import React from 'react';
import { Plus, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface CardListEmptyProps {
  deckTitle?: string;
  onCreateCard: () => void;
  isSearching?: boolean;
  searchQuery?: string;
}

export function CardListEmpty({ 
  deckTitle, 
  onCreateCard, 
  isSearching = false, 
  searchQuery = '' 
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
        <p className="text-muted-foreground mb-4">
          Get started by creating your first flashcard. Add vocabulary, concepts, or anything you want to study.
        </p>
        <Button onClick={onCreateCard}>
          <Plus className="h-4 w-4 mr-2" />
          Create First Card
        </Button>
      </CardContent>
    </Card>
  );
}
