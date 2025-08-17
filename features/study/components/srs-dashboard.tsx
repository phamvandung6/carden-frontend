'use client';

import { useState } from 'react';
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  Clock, 
  BookOpen, 
  Star,
  BarChart3,
  Activity,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  useStudyStatistics, 
  useSRSMetrics, 
  useLearningProgress, 
  useReviewSchedule
} from '../hooks/use-study';
import { useDueCardsCount } from '../hooks/use-srs';
import type { SRSDashboardProps } from '../types/study-state';

/**
 * Stats card component for displaying key metrics
 */
function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  className = '' 
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {title}
              </span>
            </div>
            <div className="text-2xl font-bold">{value}</div>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <TrendingUp className={`w-3 h-3 ${
                trend.isPositive ? '' : 'rotate-180'
              }`} />
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Learning progress component for individual decks
 */
function LearningProgressCard({ progress }: { progress: any }) {
  const completionPercentage = Math.round(
    (progress.studiedCards / progress.totalCards) * 100
  );

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="font-medium text-sm">{progress.deckTitle}</h4>
            <p className="text-xs text-muted-foreground">
              {progress.studiedCards} / {progress.totalCards} cards
            </p>
          </div>
          <Badge variant={completionPercentage === 100 ? 'default' : 'secondary'}>
            {completionPercentage}%
          </Badge>
        </div>
        
        <Progress value={completionPercentage} className="h-2" />
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{progress.averageAccuracy}% accuracy</span>
          {progress.lastStudied && (
            <span>Last: {new Date(progress.lastStudied).toLocaleDateString()}</span>
          )}
        </div>
      </div>
    </Card>
  );
}

/**
 * Review schedule overview component
 */
function ReviewScheduleCard({ schedule }: { schedule: any }) {
  const scheduleItems = [
    { label: 'Today', value: schedule.today, color: 'bg-red-500' },
    { label: 'Tomorrow', value: schedule.tomorrow, color: 'bg-orange-500' },
    { label: 'This week', value: schedule.nextWeek, color: 'bg-blue-500' },
    { label: 'This month', value: schedule.nextMonth, color: 'bg-green-500' },
  ];

  if (schedule.overdue > 0) {
    scheduleItems.unshift({ 
      label: 'Overdue', 
      value: schedule.overdue, 
      color: 'bg-red-700' 
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Review Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {scheduleItems.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="text-sm">{item.label}</span>
            </div>
            <Badge variant="secondary">{item.value}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * Study streak component
 */
function StudyStreakCard({ statistics }: { statistics: any }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-full">
            <Flame className="w-6 h-6 text-orange-600" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">{statistics.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Day streak</div>
            <div className="text-xs text-muted-foreground">
              Best: {statistics.longestStreak} days
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Loading skeleton for dashboard
 */
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Main SRS Dashboard component
 */
export function SRSDashboard({
  statistics,
  srsMetrics,
  reviewSchedule,
  learningProgress
}: SRSDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Study Dashboard</h1>
          <p className="text-muted-foreground">
            Track your learning progress and review schedule
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Cards Studied Today"
              value={statistics.todayStudied}
              subtitle={`${statistics.todayCorrect} correct`}
              icon={BookOpen}
              trend={{
                value: 12,
                isPositive: true
              }}
            />
            
            <StatsCard
              title="Accuracy Today"
              value={`${statistics.todayAccuracy}%`}
              subtitle="Today's performance"
              icon={Target}
            />
            
            <StatsCard
              title="Study Time"
              value={`${Math.round(statistics.averageStudyTime)}m`}
              subtitle="Average daily"
              icon={Clock}
            />
            
            <StatsCard
              title="Total Cards"
              value={srsMetrics.totalCards}
              subtitle={`${srsMetrics.masteredCards} mastered`}
              icon={Star}
            />
          </div>

          {/* Streak and schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StudyStreakCard statistics={statistics} />
            <div className="lg:col-span-2">
              <ReviewScheduleCard schedule={reviewSchedule} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SRS Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  SRS Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New Cards</span>
                    <Badge variant="outline">{srsMetrics.newCards}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Learning</span>
                    <Badge variant="outline">{srsMetrics.learningCards}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Review</span>
                    <Badge variant="outline">{srsMetrics.reviewCards}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Mastered</span>
                    <Badge variant="default">{srsMetrics.masteredCards}</Badge>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Retention Rate</span>
                    <span className="text-lg font-bold">
                      {Math.round(srsMetrics.retentionRate)}%
                    </span>
                  </div>
                  <Progress value={srsMetrics.retentionRate} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Deck Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {learningProgress.slice(0, 5).map((progress) => (
                  <LearningProgressCard key={progress.deckId} progress={progress} />
                ))}
                {learningProgress.length > 5 && (
                  <Button variant="outline" size="sm" className="w-full">
                    View all {learningProgress.length} decks
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <ReviewScheduleCard schedule={reviewSchedule} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Hook-based dashboard component that manages its own data
 */
export function SRSDashboardContainer() {
  const { data: statistics, isLoading: statsLoading } = useStudyStatistics();
  const { data: srsMetrics, isLoading: metricsLoading } = useSRSMetrics();
  const { data: learningProgress, isLoading: progressLoading } = useLearningProgress();
  const { data: reviewSchedule, isLoading: scheduleLoading } = useReviewSchedule();

  const isLoading = statsLoading || metricsLoading || progressLoading || scheduleLoading;

  if (isLoading || !statistics || !srsMetrics || !learningProgress || !reviewSchedule) {
    return <DashboardSkeleton />;
  }

  return (
    <SRSDashboard
      statistics={statistics}
      srsMetrics={srsMetrics}
      learningProgress={learningProgress}
      reviewSchedule={reviewSchedule}
    />
  );
}

