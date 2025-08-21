'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, BarChart3, TrendingUp, Calendar, Award } from 'lucide-react';
import { 
  ProgressChart, 
  StatsCard, 
  LearningSummary, 
  StreakTracker, 
  AchievementSystem 
} from './index';
import { useAnalytics } from '../hooks/use-analytics';
import { cn } from '@/lib/utils';

interface AnalyticsDashboardProps {
  className?: string;
  defaultTab?: string;
}

export function AnalyticsDashboard({ 
  className, 
  defaultTab = 'overview' 
}: AnalyticsDashboardProps) {
  const {
    summary,
    performance,
    streaks,
    isLoading,
    error,
    refreshAllData,
    isRefreshing,
    loadDashboardData,
    loadDetailedData,
    loadOverview,
    loadStreaks,
    loadInsights,
    loadPerformance,
    totalCards,
    totalSessions,
    overallAccuracy,
    currentStreak,
    totalStudyTime
  } = useAnalytics();

  // Load all necessary data for overview tab on mount
  React.useEffect(() => {
    if (defaultTab === 'overview') {
      // Load all data needed for Overview tab to show complete statistics
      loadDetailedData();
    }
  }, [defaultTab, loadDetailedData]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const statsCards = [
    {
      title: "Total Cards",
      value: totalCards,
      subtitle: "cards created",
      icon: "📚"
    },
    {
      title: "Study Sessions",
      value: totalSessions,
      subtitle: "sessions completed",
      icon: "🎯"
    },
    {
      title: "Overall Accuracy",
      value: `${Math.round(overallAccuracy)}%`,
      subtitle: "average score",
      icon: "✅"
    },
    {
      title: "Current Streak",
      value: currentStreak,
      subtitle: "days in a row",
      icon: "🔥"
    },
    {
      title: "Total Study Time",
      value: formatTime(totalStudyTime),
      subtitle: "time invested",
      icon: "⏱️"
    }
  ];

  if (error && !summary) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Analytics Dashboard
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshAllData}
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4", { "animate-spin": isRefreshing })} />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12 text-center">
            <div className="space-y-4">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="text-lg font-medium">Unable to load analytics</h3>
                <p className="text-muted-foreground">
                  There was an error loading your analytics data
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={refreshAllData}
                  disabled={isRefreshing}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your learning progress and insights
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={refreshAllData}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", { "animate-spin": isRefreshing })} />
          Refresh Data
        </Button>
      </div>



      {/* Main Analytics Tabs */}
      <Tabs defaultValue={defaultTab} className="w-full" onValueChange={(value) => {
        // Load specific data when switching tabs
        if (value === 'progress') {
          loadDetailedData();
        } else if (value === 'streaks' && !streaks) {
          loadStreaks();
        } else if (value === 'overview') {
          // Load all data needed for Overview tab to show complete statistics
          loadDetailedData();
        }
      }}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="streaks" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Streaks
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LearningSummary showHeader={false} />
            <StreakTracker compact />
          </div>
          <ProgressChart />
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <ProgressChart showTitle />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Metrics</CardTitle>
                <CardDescription>
                  Your key performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {statsCards.slice(0, 4).map((stat, index) => (
                      <div key={index} className="text-center p-4 rounded-lg border">
                        <div className="text-2xl mb-1">{stat.icon}</div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.subtitle}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Insights</CardTitle>
                <CardDescription>
                  AI-powered study recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">Focus Area</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Your accuracy is improving! Keep practicing difficult cards.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <h4 className="font-medium text-green-900 dark:text-green-100">Consistency</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Great streak! Daily practice is building strong habits.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100">Progress</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      You've studied {totalCards} cards. Time to add more content!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="streaks" className="space-y-6">
          <StreakTracker showCalendar />
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <AchievementSystem showAll />
        </TabsContent>
      </Tabs>

      {/* Loading State Overlay */}
      {isLoading && !summary && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="p-6">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <div>
                <h3 className="font-medium">Loading Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Fetching your study data...
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// Compact version for embedding in other dashboards
interface CompactAnalyticsDashboardProps {
  className?: string;
}

export function CompactAnalyticsDashboard({ className }: CompactAnalyticsDashboardProps) {
  const { summary, isLoading, totalCards, totalSessions, overallAccuracy, currentStreak } = useAnalytics();

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>Learning Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-8 bg-muted rounded animate-pulse" />
                <div className="h-4 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Learning Stats
        </CardTitle>
        <CardDescription>Your recent study progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{totalCards}</div>
            <div className="text-xs text-muted-foreground">Total Cards</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{totalSessions}</div>
            <div className="text-xs text-muted-foreground">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round(overallAccuracy)}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{currentStreak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
