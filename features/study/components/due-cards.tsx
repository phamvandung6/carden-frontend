'use client';

import { useState, useEffect } from 'react';
import { Play, Clock, BookOpen, RotateCcw, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDueCards } from '../hooks/use-study';
import { useDueCardsCount, useStartSession } from '../hooks/use-srs';
import type { DueCardsListProps } from '../types/study-state';
import type { PracticeCard, StudyMode } from '../types/practice-session';

/**
 * Component to display individual due card item
 */
function DueCardItem({ 
  card, 
  onSelect,
  onStartSession
}: { 
  card: PracticeCard;
  onSelect?: (card: PracticeCard) => void;
  onStartSession?: (deckId?: number) => void;
}) {
  const isOverdue = new Date(card.dueDate) < new Date();
  const dueDate = new Date(card.dueDate);
  const now = new Date();
  const timeDiff = dueDate.getTime() - now.getTime();
  const isToday = Math.abs(timeDiff) < 24 * 60 * 60 * 1000;

  const getStateColor = (state: string) => {
    switch (state) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'LEARNING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REVIEW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDueTime = () => {
    if (isOverdue) {
      return 'Overdue';
    } else if (isToday) {
      return 'Due today';
    } else {
      return `Due ${dueDate.toLocaleDateString()}`;
    }
  };

  return (
    <Card className={`p-4 hover:shadow-md transition-shadow cursor-pointer ${
      isOverdue ? 'border-red-200 bg-red-50' : ''
    }`} onClick={() => onSelect?.(card)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge 
              variant="outline" 
              className={getStateColor(card.cardState)}
            >
              {card.cardState}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {card.deckTitle}
            </Badge>
          </div>
          
          <h3 className="font-medium text-lg truncate mb-1">
            {card.frontText}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
            {card.backDefinition}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                {formatDueTime()}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <RotateCcw className="w-3 h-3" />
              <span>{card.totalReviews} reviews</span>
            </div>
            
            {card.accuracyRate > 0 && (
              <div className="flex items-center gap-1">
                <span>{Math.round(card.accuracyRate)}% accuracy</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col gap-2 ml-4">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onStartSession?.(card.deckId);
            }}
          >
            <Play className="w-3 h-3 mr-1" />
            Study
          </Button>
        </div>
      </div>
    </Card>
  );
}



/**
 * Main due cards list component
 */
export function DueCards({
  cards,
  onCardSelect,
  onStartSession,
  isLoading = false
}: DueCardsListProps) {
  const startSessionMutation = useStartSession();

  const handleStartSession = async (deckId?: number) => {
    try {
      await startSessionMutation.mutateAsync({
        studyMode: 'FLIP' as StudyMode,
        deckId: deckId || null,
        maxNewCards: 20,
        maxReviewCards: 200,
        includeNewCards: true,
        includeReviewCards: true,
        includeLearningCards: true
      });
      onStartSession?.(deckId);
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
                <div className="flex gap-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) {
    return (
      <Card className="p-8 text-center">
        <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No cards to study</h3>
        <p className="text-muted-foreground mb-4">
          Great job! You're all caught up with your reviews.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Cards to Study ({cards.length})
        </h2>
        <Button
          onClick={() => handleStartSession()}
          disabled={startSessionMutation.isPending}
          className="flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Start Study Session
        </Button>
      </div>

      <div className="space-y-3">
        {cards.map((card) => (
          <DueCardItem
            key={card.cardId}
            card={card}
            onSelect={onCardSelect}
            onStartSession={handleStartSession}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Hook-based due cards component that manages its own data
 */
export function DueCardsContainer({ 
  deckId,
  onCardSelect,
  onStartSession 
}: {
  deckId?: number;
  onCardSelect?: (card: PracticeCard) => void;
  onStartSession?: (deckId?: number) => void;
}) {
  const { dueCards, isLoading, refetch } = useDueCards({ deckId, page: 0, size: 50 });

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <DueCards
      cards={dueCards}
      onCardSelect={onCardSelect}
      onStartSession={onStartSession}
      isLoading={isLoading}
    />
  );
}

