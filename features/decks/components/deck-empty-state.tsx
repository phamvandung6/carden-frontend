'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Sparkles,
  Upload,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeckEmptyStateProps {
  type?: 'no-decks' | 'no-search-results' | 'no-public-decks';
  onCreateDeck?: () => void;
  onImportDeck?: () => void;
  onClearFilters?: () => void;
  onBrowsePublic?: () => void;
  className?: string;
}

export function DeckEmptyState({
  type = 'no-decks',
  onCreateDeck,
  onImportDeck,
  onClearFilters,
  onBrowsePublic,
  className,
}: DeckEmptyStateProps) {
  // No search results
  if (type === 'no-search-results') {
    return (
      <Card className={cn('border-dashed', className)}>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">No decks found</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            We couldn't find any decks matching your search criteria. Try adjusting your filters or search terms.
          </p>
          
          <div className="flex gap-2">
            {onClearFilters && (
              <Button variant="outline" onClick={onClearFilters}>
                Clear Filters
              </Button>
            )}
            {onCreateDeck && (
              <Button onClick={onCreateDeck}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Deck
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // No public decks
  if (type === 'no-public-decks') {
    return (
      <Card className={cn('border-dashed', className)}>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          
          <h3 className="text-lg font-semibold mb-2">No public decks yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            There are no public decks available at the moment. Be the first to share your knowledge with the community!
          </p>
          
          <div className="flex gap-2">
            {onCreateDeck && (
              <Button onClick={onCreateDeck}>
                <Plus className="mr-2 h-4 w-4" />
                Create & Share Deck
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // No decks at all (default)
  return (
    <Card className={cn('border-dashed', className)}>
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Create your first deck</h3>
        <p className="text-muted-foreground mb-8 max-w-md">
          Start building your vocabulary collection by creating flashcard decks. 
          Organize words, phrases, and concepts to enhance your learning journey.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md">
          {onCreateDeck && (
            <Button onClick={onCreateDeck} className="h-auto p-4 flex-col gap-2">
              <Plus className="h-5 w-5" />
              <span className="text-sm">Create Deck</span>
            </Button>
          )}
          
          {onImportDeck && (
            <Button variant="outline" onClick={onImportDeck} className="h-auto p-4 flex-col gap-2">
              <Upload className="h-5 w-5" />
              <span className="text-sm">Import Deck</span>
            </Button>
          )}
          
          {onBrowsePublic && (
            <Button variant="outline" onClick={onBrowsePublic} className="h-auto p-4 flex-col gap-2">
              <Search className="h-5 w-5" />
              <span className="text-sm">Browse Public</span>
            </Button>
          )}
        </div>

        {/* Quick tips */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Quick tip</span>
          </div>
          <p className="text-xs text-muted-foreground">
            You can also generate decks automatically using AI, or import existing flashcards from CSV files.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Specific variants for common use cases
export function NoDecksFound({ onCreateDeck, onClearFilters, className }: {
  onCreateDeck?: () => void;
  onClearFilters?: () => void;
  className?: string;
}) {
  return (
    <DeckEmptyState
      type="no-search-results"
      onCreateDeck={onCreateDeck}
      onClearFilters={onClearFilters}
      className={className}
    />
  );
}

export function NoPublicDecks({ onCreateDeck, className }: {
  onCreateDeck?: () => void;
  className?: string;
}) {
  return (
    <DeckEmptyState
      type="no-public-decks"
      onCreateDeck={onCreateDeck}
      className={className}
    />
  );
}

export function CreateFirstDeck({ 
  onCreateDeck, 
  onImportDeck, 
  onBrowsePublic, 
  className 
}: {
  onCreateDeck?: () => void;
  onImportDeck?: () => void;
  onBrowsePublic?: () => void;
  className?: string;
}) {
  return (
    <DeckEmptyState
      type="no-decks"
      onCreateDeck={onCreateDeck}
      onImportDeck={onImportDeck}
      onBrowsePublic={onBrowsePublic}
      className={className}
    />
  );
}
