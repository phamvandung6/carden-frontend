'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  CheckCircle, 
  ArrowLeft,
  Clock,
  TrendingUp,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSRS, getGradeInfo, getCardStateColor, NextReviewInfo } from '@/features/study';
import type { Grade } from '@/features/study';

export default function PracticePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckId = searchParams.get('deckId') ? parseInt(searchParams.get('deckId')!) : undefined;
  
  const { 
    currentSession, 
    currentCard, 
    sessionProgress, 
    getNextCard, 
    submitCardReview, 
    completeStudySession,
    startStudySession,
    isLoading 
  } = useSRS();

  const [showAnswer, setShowAnswer] = useState(false);
  const [cardStartTime, setCardStartTime] = useState<number>(Date.now());
  const [showSummary, setShowSummary] = useState(false);
  const [sessionSummary, setSessionSummary] = useState<{
    totalCards: number;
    finalAccuracy: number;
    newCards: number;
    reviewCards: number;
    durationMinutes: number;
  } | null>(null);

  // Auto-load next card if session is active but no current card
  useEffect(() => {
    if (currentSession.isActive && !currentCard && !isLoading && !currentSession.isComplete) {
      getNextCard();
    }
  }, [currentSession.isActive, currentCard, isLoading, currentSession.isComplete, getNextCard]);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleGrade = async (grade: Grade) => {
    if (!currentCard) return;

    const responseTime = Date.now() - cardStartTime;
    
    try {
      await submitCardReview(grade, responseTime);
      setShowAnswer(false);
      setCardStartTime(Date.now());
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleCompleteSession = async () => {
    try {
      const summary = await completeStudySession();
      if (summary) {
        setSessionSummary(summary);
        setShowSummary(true);
      } else {
        router.push('/study');
      }
    } catch (error) {
      console.error('Failed to complete session:', error);
      router.push('/study');
    }
  };

  const handleBackToStudy = () => {
    router.push('/study');
  };

  // Start session flow
  const handleStartSession = async (mode: 'FLIP' | 'TYPE_ANSWER' | 'MULTIPLE_CHOICE' = 'FLIP') => {
    try {
      await startStudySession(mode, deckId);
      // Session will be active after this, component will re-render
    } catch (error) {
      console.error('Failed to start session:', error);
    }
  };

  if (!currentSession.isActive) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-lg mx-auto text-center p-8">
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Start Practice Session</h2>
              <p className="text-muted-foreground">
                {deckId ? `Study deck #${deckId} cards` : 'Choose your study mode to begin practicing cards.'}
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => handleStartSession('FLIP')} 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Starting...' : 'Start FLIP Mode'}
              </Button>
            </div>

            <Button variant="ghost" onClick={handleBackToStudy}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Study
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto text-center p-8">
          <CardContent className="space-y-4">
            {isLoading ? (
              <>
                <div className="w-12 h-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <h2 className="text-xl font-semibold">Loading next card...</h2>
              </>
            ) : currentSession.isComplete ? (
              <>
                <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
                <h2 className="text-xl font-semibold">Session Complete!</h2>
                <p className="text-muted-foreground">
                  You&apos;ve finished all available cards for this session.
                </p>
                <Button onClick={handleCompleteSession}>
                  View Results
                </Button>
              </>
            ) : (
              <>
                <div className="w-12 h-12 mx-auto text-blue-500">📚</div>
                <h2 className="text-xl font-semibold">Deck Completed!</h2>
                <p className="text-muted-foreground">
                  {deckId 
                    ? `All cards in deck #${deckId} have been studied. They will appear again based on your SRS schedule.`
                    : 'No cards are due for review at this time. Cards will appear again based on your SRS schedule.'
                  }
                </p>
                <NextReviewInfo 
                  currentSession={currentSession}
                  variant="detailed"
                  className="mt-4"
                />
                <div className="space-y-2">
                  <Button onClick={handleBackToStudy}>
                    Back to Study Center
                  </Button>
                  <Button variant="outline" onClick={handleCompleteSession}>
                    End Session
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const cardStateColor = getCardStateColor(currentCard.cardState);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={handleBackToStudy}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Study
        </Button>

        <div className="flex items-center gap-4">
          {sessionProgress && (
            <div className="text-sm text-muted-foreground">
              {sessionProgress.cardsStudied} studied • {sessionProgress.currentAccuracy}% accuracy
            </div>
          )}
          <Button variant="outline" onClick={handleCompleteSession}>
            End Session
          </Button>
        </div>
      </div>

      {/* Progress */}
      {sessionProgress && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Session Progress</span>
              <span className="text-sm text-muted-foreground">
                {sessionProgress.cardsStudied} / {sessionProgress.cardsStudied + sessionProgress.remainingCards}
              </span>
            </div>
            <Progress 
              value={(sessionProgress.cardsStudied / (sessionProgress.cardsStudied + sessionProgress.remainingCards)) * 100} 
              className="h-2"
            />
          </CardContent>
        </Card>
      )}

      {/* Main Card */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`${cardStateColor.bgColor} ${cardStateColor.color}`}>
                {currentCard.cardState}
              </Badge>
              <Badge variant="secondary">
                {currentCard.deckTitle}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{currentCard.totalReviews} reviews</span>
              {currentCard.accuracyRate > 0 && (
                <>
                  <TrendingUp className="w-4 h-4" />
                  <span>{Math.round(currentCard.accuracyRate)}%</span>
                </>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Front side */}
          <div className="text-center space-y-4">
            <div className="text-3xl font-semibold min-h-[100px] flex items-center justify-center">
              {currentCard.frontText}
            </div>
            
            {currentCard.frontImageUrl && (
              <div className="flex justify-center">
                <Image 
                  src={currentCard.frontImageUrl} 
                  alt="Card image"
                  width={384}
                  height={256}
                  className="max-w-sm max-h-64 object-contain rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Answer section */}
          {showAnswer && (
            <div className="border-t pt-6 space-y-4">
              <div className="text-center space-y-2">
                <div className="text-xl font-medium text-green-600">
                  {currentCard.backDefinition}
                </div>
                {currentCard.backMeaningVi && currentCard.backMeaningVi !== currentCard.backDefinition && (
                  <div className="text-lg text-muted-foreground">
                    {currentCard.backMeaningVi}
                  </div>
                )}
                {currentCard.ipa && (
                  <div className="text-sm text-muted-foreground font-mono">
                    {currentCard.ipa}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-center">
            {!showAnswer ? (
              <Button onClick={handleShowAnswer} size="lg">
                Show Answer
              </Button>
            ) : (
              <div className="grid grid-cols-4 gap-2 w-full max-w-md">
                {[0, 1, 2, 3].map((grade) => {
                  const gradeInfo = getGradeInfo(grade as Grade);
                  return (
                    <Button
                      key={grade}
                      onClick={() => handleGrade(grade as Grade)}
                      variant={grade === 0 ? 'destructive' : grade === 3 ? 'default' : 'outline'}
                      className="flex flex-col p-3 h-auto"
                    >
                      <span className="text-xs font-medium">{gradeInfo.label}</span>
                      <span className="text-xs opacity-75">{grade}</span>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Help text */}
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground space-y-1">
            <div><strong>Keyboard shortcuts:</strong></div>
            <div>• Space: Show answer</div>
            <div>• 1-4: Grade card (Again, Hard, Good, Easy)</div>
            <div>• Esc: End session</div>
          </div>
        </CardContent>
      </Card>

      {/* Session Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Session Complete!</DialogTitle>
          </DialogHeader>
          {sessionSummary && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{sessionSummary.totalCards}</div>
                  <div className="text-sm text-muted-foreground">Cards Studied</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{sessionSummary.finalAccuracy}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold">{sessionSummary.newCards}</div>
                  <div className="text-muted-foreground">New</div>
                </div>
                <div>
                  <div className="font-semibold">{sessionSummary.reviewCards}</div>
                  <div className="text-muted-foreground">Review</div>
                </div>
                <div>
                  <div className="font-semibold">{sessionSummary.durationMinutes}</div>
                  <div className="text-muted-foreground">Minutes</div>
                </div>
              </div>

              <Button onClick={() => router.push('/study')} className="w-full">
                Back to Study
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
