'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ClientStudySession, ClientStudyComplete } from '@/features/practice/components/client-study-session';
import { useClientStudy } from '@/features/practice/hooks/use-client-study';
import { useDeckById } from '@/features/decks';
import { useCardsByDeck } from '@/features/flashcards';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Play, BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ClientStudyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckIdParam = searchParams.get('deckId');
  const deckId = deckIdParam ? parseInt(deckIdParam) : null;

  const { currentSession, startStudySession, isLoading } = useClientStudy();
  const { data: deck, isLoading: isDeckLoading } = useDeckById(deckId || 0);
  const { data: cardsData, isLoading: isCardsLoading } = useCardsByDeck(deckId || 0, { page: 0, size: 1000 });

  // Auto-start session if deckId is provided and no session is active
  useEffect(() => {
    if (deckId && deck && cardsData?.content && !currentSession?.isActive && !isLoading) {
      startStudySession(deckId, deck.title, cardsData.content);
    }
  }, [deckId, deck, cardsData, currentSession?.isActive, isLoading, startStudySession]);

  const handleStartSession = () => {
    if (deckId && deck && cardsData?.content) {
      startStudySession(deckId, deck.title, cardsData.content);
    }
  };

  const handleBackToStudy = () => {
    router.push('/study');
  };

  const handleBackToDeck = () => {
    if (deckId) {
      router.push(`/decks/${deckId}`);
    } else {
      router.push('/decks');
    }
  };

  // Loading state
  if (isDeckLoading || isCardsLoading || (deckId && !deck)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state - no deck ID
  if (!deckId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-4">
            <div className="text-6xl">📚</div>
            <h2 className="text-2xl font-bold">No Deck Selected</h2>
            <p className="text-muted-foreground">
              Please select a deck to start studying.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleBackToStudy}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Study Center
            </Button>
            <Button variant="outline" onClick={() => router.push('/decks')}>
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Decks
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Error state - deck not found
  if (!deck) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-4">
            <div className="text-6xl">❌</div>
            <h2 className="text-2xl font-bold">Deck Not Found</h2>
            <p className="text-muted-foreground">
              The deck you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleBackToStudy}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Study Center
            </Button>
            <Button variant="outline" onClick={() => router.push('/decks')}>
              <BookOpen className="h-4 w-4 mr-2" />
              Browse Decks
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Session complete state */}
      {currentSession?.isComplete ? (
        <ClientStudyComplete />
      ) : currentSession?.isActive ? (
        /* Active session state */
        <ClientStudySession />
      ) : (
        /* Pre-session state */
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-4">
            <div className="text-6xl">📚</div>
            <h1 className="text-3xl font-bold">Ready to Study?</h1>
            <p className="text-lg text-muted-foreground">
              You&apos;re about to start studying <strong>{deck.title}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              This is a client-side study session. Your progress won&apos;t affect the SRS algorithm.
            </p>
          </div>

          <Card className="p-6 text-left">
            <h3 className="font-semibold mb-3">How it works:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Study each card and rate it as <strong>Easy</strong> or <strong>Hard</strong></li>
              <li>• Cards rated as <strong>Hard</strong> will come back for review</li>
              <li>• Session completes when all cards are rated <strong>Easy</strong></li>
              <li>• Your ratings are local and don&apos;t affect the main study system</li>
            </ul>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleBackToDeck} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Deck
            </Button>
            <Button onClick={handleStartSession} size="lg" disabled={isLoading}>
              <Play className="h-4 w-4 mr-2" />
              {isLoading ? 'Starting...' : 'Start Studying'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
