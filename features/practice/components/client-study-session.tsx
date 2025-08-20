'use client';

import React from 'react';
import { ArrowLeft, Eye, ThumbsUp, ThumbsDown, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CardPreview } from '@/features/flashcards';
import { useClientStudy } from '../hooks/use-client-study';
import type { ClientDifficulty } from '../types';

interface ClientStudySessionProps {
  className?: string;
}

export function ClientStudySession({ className }: ClientStudySessionProps) {
  const {
    currentSession,
    showAnswer,
    rateCard,
    resetSession,
    endStudySession,
    preferences,
    updatePreferences,
    sessionStats
  } = useClientStudy();

  if (!currentSession || !currentSession.currentCard) {
    return null;
  }

  const { currentCard, showAnswer: isAnswerVisible, currentCardIndex, totalCards, mode } = currentSession;
  
  // Progress based on completed cards vs total cards
  const completedCards = sessionStats?.easyCards || 0;
  const progress = totalCards > 0 ? (completedCards / totalCards) * 100 : 0;

  const handleRate = (difficulty: ClientDifficulty) => {
    rateCard(difficulty);
    // Rating automatically advances to next card (handled in store)
  };

  const handleShowAnswer = () => {
    showAnswer();
  };

  const handleEndSession = () => {
    const stats = endStudySession();
    // Stats toast is handled in the hook
  };

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
      {/* Header with progress and controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={resetSession}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Study
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {mode === 'study' ? 'First Study' : 'Review Mode'}
            </Badge>
            <Badge variant="secondary">
              {currentCardIndex + 1} / {totalCards}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Study Preferences</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-progress">Show progress bar</Label>
                  <Switch
                    id="show-progress"
                    checked={preferences.showProgress}
                    onCheckedChange={(checked) => 
                      updatePreferences({ showProgress: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="shuffle-cards">Shuffle cards</Label>
                  <Switch
                    id="shuffle-cards"
                    checked={preferences.shuffleCards}
                    onCheckedChange={(checked) => 
                      updatePreferences({ shuffleCards: checked })
                    }
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleEndSession}
          >
            End Session
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      {preferences.showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Stats */}
      {sessionStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{sessionStats.easyCards}</div>
              <div className="text-xs text-muted-foreground">Easy Cards</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{sessionStats.hardCards}</div>
              <div className="text-xs text-muted-foreground">Hard Cards</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{sessionStats.studiedCards}</div>
              <div className="text-xs text-muted-foreground">Studied</div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="text-center">
              <div className="text-2xl font-bold">{Math.round(sessionStats.studyTime * 10) / 10}m</div>
              <div className="text-xs text-muted-foreground">Study Time</div>
            </div>
          </Card>
        </div>
      )}

      {/* Main card display */}
      <Card className="min-h-96">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {currentSession.deckTitle}
            </h3>
            <div className="flex items-center gap-2">
              {currentCard.clientDifficulty && (
                <Badge variant={currentCard.clientDifficulty === 'easy' ? 'default' : 'secondary'}>
                  {currentCard.clientDifficulty === 'easy' ? '✅ Easy' : '🔄 Hard'}
                </Badge>
              )}
              {currentCard.timesStudied > 0 && (
                <Badge variant="outline">
                  Studied {currentCard.timesStudied}x
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CardPreview
            card={currentCard}
            mode={isAnswerVisible ? 'both' : 'front'}
            animate={true}
            showMetadata={false}
            className="mb-6"
          />

          {/* Action buttons */}
          <div className="flex flex-col gap-4">
            {!isAnswerVisible ? (
              // Show answer button
              <Button
                onClick={handleShowAnswer}
                size="lg"
                className="w-full"
              >
                <Eye className="h-4 w-4 mr-2" />
                Show Answer
              </Button>
            ) : (
              // Rating buttons
              <div className="space-y-3">
                <div className="text-center text-sm text-muted-foreground mb-4">
                  How well did you know this card?
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleRate('hard')}
                    variant="outline"
                    size="lg"
                    className="border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                  >
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    Hard - Study Again
                  </Button>
                  <Button
                    onClick={() => handleRate('easy')}
                    size="lg"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Easy - Got It!
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Session completion component
export function ClientStudyComplete() {
  const { sessionStats, resetSession } = useClientStudy();

  if (!sessionStats) return null;

  const completionRate = Math.round(sessionStats.completionRate);
  const studyTime = Math.round(sessionStats.studyTime * 10) / 10;

  return (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="space-y-4">
        <div className="text-6xl">🎉</div>
        <h2 className="text-3xl font-bold">Study Session Complete!</h2>
        <p className="text-lg text-muted-foreground">
          Great job! You've completed your study session.
        </p>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{sessionStats.easyCards}</div>
            <div className="text-sm text-muted-foreground">Cards Mastered</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{sessionStats.hardCards}</div>
            <div className="text-sm text-muted-foreground">Need Review</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{completionRate}%</div>
            <div className="text-sm text-muted-foreground">Completion</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{studyTime}m</div>
            <div className="text-sm text-muted-foreground">Study Time</div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={resetSession} size="lg">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Study Center
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => window.location.reload()}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Study Again
        </Button>
      </div>
    </div>
  );
}
