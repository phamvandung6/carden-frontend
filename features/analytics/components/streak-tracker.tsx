'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Flame, 
  Trophy, 
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAnalytics } from '../hooks/use-analytics';
import { useProgressData } from '../hooks/use-progress-data';
import { cn } from '@/lib/utils';

interface StreakTrackerProps {
  className?: string;
  showCalendar?: boolean;
  compact?: boolean;
}

export function StreakTracker({ 
  className, 
  showCalendar = true,
  compact = false 
}: StreakTrackerProps) {
  const {
    streaks,
    currentStreak,
    longestStreak,
    streakProgress,
    isLoading,
    error
  } = useAnalytics();

  const { streakCalendarData } = useProgressData();

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>Study Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-20 bg-muted rounded animate-pulse" />
            {showCalendar && (
              <div className="h-32 bg-muted rounded animate-pulse" />
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !streaks) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>Study Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            {error ? 'Failed to load streak data' : 'No streak data available'}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getMilestoneProgress = () => {
    if (streaks.nextMilestone === 0) return 100;
    return (currentStreak / streaks.nextMilestone) * 100;
  };

  const getStreakLevel = (streak: number) => {
    if (streak >= 365) return { level: 'Legend', color: 'text-purple-600', icon: Award };
    if (streak >= 100) return { level: 'Master', color: 'text-yellow-600', icon: Trophy };
    if (streak >= 30) return { level: 'Champion', color: 'text-blue-600', icon: Target };
    if (streak >= 7) return { level: 'Warrior', color: 'text-green-600', icon: TrendingUp };
    return { level: 'Beginner', color: 'text-gray-600', icon: Flame };
  };

  const currentLevel = getStreakLevel(currentStreak);
  const bestLevel = getStreakLevel(longestStreak);

  // Generate calendar grid for last 12 weeks
  const generateCalendarGrid = () => {
    if (!streakCalendarData) return [];
    
    // Take last 84 days (12 weeks)
    const last84Days = streakCalendarData.slice(-84);
    const weeks = [];
    
    for (let i = 0; i < last84Days.length; i += 7) {
      weeks.push(last84Days.slice(i, i + 7));
    }
    
    return weeks;
  };

  if (compact) {
    return (
      <Card className={cn("", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold">{currentStreak}</span>
              </div>
              <div>
                <p className="text-sm font-medium">Day Streak</p>
                <p className="text-xs text-muted-foreground">
                  {streaks.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
            <Badge variant={streaks.isActive ? 'default' : 'secondary'}>
              {currentLevel.level}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Study Streak
        </CardTitle>
        <CardDescription>
          Maintain your learning momentum every day
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Streak Display */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Flame className="h-8 w-8 text-orange-500" />
            <span className="text-4xl font-bold">{currentStreak}</span>
            <span className="text-lg text-muted-foreground">
              {currentStreak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Badge 
              variant={streaks.isActive ? 'default' : 'secondary'}
              className="flex items-center gap-1"
            >
              <currentLevel.icon className="h-3 w-3" />
              {currentLevel.level}
            </Badge>
            <Badge variant="outline">
              {streaks.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        {/* Progress to Next Milestone */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Next Milestone</span>
            <span className="text-sm text-muted-foreground">
              {streaks.nextMilestone} days
            </span>
          </div>
          <Progress value={getMilestoneProgress()} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            {streaks.daysToMilestone > 0 ? (
              `${streaks.daysToMilestone} more days to reach ${streaks.nextMilestone} day milestone`
            ) : (
              `Milestone achieved! Next goal: ${streaks.nextMilestone} days`
            )}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg border">
            <Trophy className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
            <p className="text-lg font-semibold">{longestStreak}</p>
            <p className="text-xs text-muted-foreground">Best Streak</p>
            <Badge variant="outline" className="mt-1">
              {bestLevel.level}
            </Badge>
          </div>
          
          <div className="text-center p-3 rounded-lg border">
            <Calendar className="h-6 w-6 mx-auto mb-1 text-blue-500" />
            <p className="text-lg font-semibold">{streaks.studyDates.length}</p>
            <p className="text-xs text-muted-foreground">Study Days</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>

        {/* Activity Calendar */}
        {showCalendar && streakCalendarData && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Activity Calendar</h4>
            <div className="space-y-1">
              {generateCalendarGrid().map((week, weekIndex) => (
                <div key={weekIndex} className="flex gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={cn(
                        "w-3 h-3 rounded-sm border",
                        day.value > 0 
                          ? "bg-green-500 border-green-600" 
                          : "bg-muted border-muted-foreground/20"
                      )}
                      title={`${day.date}: ${day.label}`}
                    />
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>12 weeks ago</span>
              <div className="flex items-center gap-2">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-sm bg-muted border" />
                  <div className="w-2 h-2 rounded-sm bg-green-200 border" />
                  <div className="w-2 h-2 rounded-sm bg-green-400 border" />
                  <div className="w-2 h-2 rounded-sm bg-green-600 border" />
                </div>
                <span>More</span>
              </div>
              <span>Today</span>
            </div>
          </div>
        )}

        {/* Motivation Message */}
        <div className="text-center p-3 rounded-lg bg-muted/50">
          <p className="text-sm">
            {currentStreak === 0 ? (
              "Start your streak today! Consistency is key to language learning success."
            ) : currentStreak < 7 ? (
              "Great start! Keep going to build a strong learning habit."
            ) : currentStreak < 30 ? (
              "Excellent progress! You're building an amazing learning routine."
            ) : (
              "Outstanding dedication! You're a true language learning champion."
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
