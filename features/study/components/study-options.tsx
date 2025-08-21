'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Brain, 
  Clock, 
  Target, 
  TrendingUp,
  Play,
  Zap
} from 'lucide-react';
import { formatNextReviewTime, formatDetailedTime } from '../utils/time-utils';
import type { DueCardsCount } from '../types';

interface StudyOptionsProps {
  dueCount?: DueCardsCount;
  deckTitle?: string;
  onSrsStudy?: () => void;
  onClientStudy?: () => void;
  className?: string;
}

export function StudyOptions({ 
  dueCount, 
  deckTitle, 
  onSrsStudy, 
  onClientStudy,
  className 
}: StudyOptionsProps) {
  if (!dueCount) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Loading study information...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalAvailable = dueCount.totalDue + dueCount.newCards + dueCount.learningCards;
  const hasDueCards = totalAvailable > 0 || dueCount.hasCardsAvailable;

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Study Options
        </CardTitle>
        <CardDescription>
          Choose your preferred learning method
          {deckTitle && ` for "${deckTitle}"`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* SRS Status Information */}
        <div className="p-4 rounded-lg border bg-muted/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="font-medium">SRS Status</span>
            </div>
            {hasDueCards ? (
              <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                Ready
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                Waiting
              </Badge>
            )}
          </div>

          {hasDueCards ? (
            <div className="space-y-2">
              <div className="text-sm font-medium text-green-700">
                {totalAvailable} cards ready for SRS review
              </div>
              <div className="flex gap-2 text-xs text-muted-foreground">
                {dueCount.reviewCards > 0 && (
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {dueCount.reviewCards} review
                  </span>
                )}
                {dueCount.newCards > 0 && (
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    {dueCount.newCards} new
                  </span>
                )}
                {dueCount.learningCards > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {dueCount.learningCards} learning
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Next SRS review in {formatDetailedTime(dueCount.minutesUntilNext)}
              </div>
              <div className="text-xs text-muted-foreground">
                Cards will be available based on spaced repetition schedule
              </div>
            </div>
          )}
        </div>

        {/* Study Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SRS Study Option */}
          <div className="p-4 rounded-lg border space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium">SRS Algorithm</h4>
                <p className="text-xs text-muted-foreground">Spaced repetition system</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Study cards based on your learning progress and retention rate. 
              More effective for long-term memory.
            </p>
            <Button 
              onClick={onSrsStudy}
              disabled={!hasDueCards}
              className="w-full"
              variant={hasDueCards ? "default" : "outline"}
            >
              <Brain className="w-4 h-4 mr-2" />
              {hasDueCards ? `Study ${totalAvailable} Cards` : 'No Cards Due'}
            </Button>
          </div>

          {/* Client Study Option */}
          <div className="p-4 rounded-lg border space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-teal-500">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium">Free Practice</h4>
                <p className="text-xs text-muted-foreground">Study at your own pace</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Practice all cards freely without SRS constraints. 
              Good for quick review or intensive study sessions.
            </p>
            <Button 
              onClick={onClientStudy}
              variant="outline"
              className="w-full"
            >
              <Play className="w-4 h-4 mr-2" />
              Free Practice
            </Button>
          </div>
        </div>

        {/* Additional Info */}
        {!hasDueCards && dueCount.minutesUntilNext > 0 && (
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
            <Clock className="h-5 w-5 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Next SRS review available in {formatDetailedTime(dueCount.minutesUntilNext)}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              You can still use Free Practice mode to study anytime
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
