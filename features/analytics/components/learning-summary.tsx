'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Book, 
  Clock, 
  Target, 
  TrendingUp,
  Calendar,
  Award,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { useAnalytics } from '../hooks/use-analytics';
import { cn } from '@/lib/utils';

interface LearningSummaryProps {
  className?: string;
  showHeader?: boolean;
}

export function LearningSummary({ 
  className, 
  showHeader = true 
}: LearningSummaryProps) {
  const {
    summary,
    overallProgress,
    streakProgress,
    totalCards,
    totalSessions,
    overallAccuracy,
    currentStreak,
    longestStreak,
    totalStudyTime,
    isLoading,
    error
  } = useAnalytics();

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          {showHeader && (
            <CardTitle>Learning Summary</CardTitle>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-2 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !summary) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          {showHeader && (
            <CardTitle>Learning Summary</CardTitle>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            {error ? 'Failed to load summary' : 'No data available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStreakBadgeVariant = (streak: number) => {
    if (streak >= 30) return 'default';
    if (streak >= 7) return 'secondary';
    return 'outline';
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        {showHeader && (
          <>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Learning Summary
            </CardTitle>
            <CardDescription>
              Your overall learning progress and achievements
            </CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <Book className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Cards</p>
              <p className="text-lg font-semibold">{totalCards}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Sessions</p>
              <p className="text-lg font-semibold">{totalSessions}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Study Time</p>
              <p className="text-lg font-semibold">{formatTime(totalStudyTime)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className={cn("text-lg font-semibold", getAccuracyColor(overallAccuracy))}>
                {Math.round(overallAccuracy)}%
              </p>
            </div>
          </div>
        </div>

        {/* Progress Sections */}
        <div className="space-y-4">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(overallProgress)}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Cards studied progress
            </p>
          </div>

          {/* Streak Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Streak Progress
              </span>
              <Badge variant={getStreakBadgeVariant(currentStreak)}>
                {currentStreak} days
              </Badge>
            </div>
            <Progress value={streakProgress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Next milestone: {summary.streaks.nextMilestone} days
              {summary.streaks.daysToMilestone > 0 && (
                ` (${summary.streaks.daysToMilestone} days to go)`
              )}
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Recent Activity (30 days)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="text-sm text-muted-foreground">Sessions</p>
                <p className="text-lg font-semibold">{summary.recent.sessionsLast30Days}</p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="text-sm text-muted-foreground">Study Time</p>
                <p className="text-lg font-semibold">
                  {formatTime(summary.recent.studyTimeLast30Days)}
                </p>
              </div>
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="text-sm text-muted-foreground">Cards Studied</p>
                <p className="text-lg font-semibold">{summary.recent.cardsStudiedLast30Days}</p>
              </div>
              <Book className="h-4 w-4 text-purple-500" />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className={cn("text-lg font-semibold", getAccuracyColor(summary.recent.accuracyLast30Days))}>
                  {Math.round(summary.recent.accuracyLast30Days)}%
                </p>
              </div>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Card Distribution */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Card Status Distribution</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(summary.distribution).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-2 rounded border">
                <span className="text-sm capitalize">{status.toLowerCase()}</span>
                <Badge variant="outline">{count}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Highlight */}
        {longestStreak > 0 && (
          <div className="flex items-center space-x-2 p-3 rounded-lg bg-muted/50">
            <Award className="h-4 w-4 text-yellow-500" />
            <div>
              <p className="text-sm font-medium">Best Streak</p>
              <p className="text-xs text-muted-foreground">
                {longestStreak} days - Your personal best!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
