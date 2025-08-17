'use client';

import Link from 'next/link';
import { Play, Book, Calendar, BarChart3, TrendingUp, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDueCardsCount, NextReviewInfo } from '@/features/study';

export default function DashboardPage() {
  const { data: dueCount } = useDueCardsCount();

  const handleQuickStudy = async () => {
    try {
      // Redirect to practice page - it will handle session creation
      window.location.href = '/practice';
    } catch (error) {
      console.error('Failed to redirect to practice:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Ready to continue learning?
          </p>
        </div>

        {dueCount && dueCount.totalDue > 0 && (
          <Button onClick={handleQuickStudy} size="lg" className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Study Now ({dueCount.totalDue})
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      {dueCount && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cards Due</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dueCount.totalDue}</div>
              <p className="text-xs text-muted-foreground">
                Ready to study
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Cards</CardTitle>
              <Book className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dueCount.newCards}</div>
              <p className="text-xs text-muted-foreground">
                Never studied
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dueCount.learningCards}</div>
              <p className="text-xs text-muted-foreground">
                In progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Review</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dueCount.reviewCards}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {dueCount.totalDue > 0 ? (
                <>
                  <div className="text-2xl font-bold text-green-600">Ready</div>
                  <p className="text-xs text-muted-foreground">
                    Cards available now
                  </p>
                </>
              ) : (
                <NextReviewInfo 
                  nextAvailableTime={dueCount.nextCardAvailableAt}
                  minutesUntil={dueCount.minutesUntilNext}
                  variant="compact"
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Study Cards
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Start reviewing your due cards with spaced repetition.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/study">
                  <Play className="w-4 h-4 mr-2" />
                  Go to Study Center
                </Link>
              </Button>
              {dueCount && dueCount.totalDue > 0 && (
                <Button variant="outline" onClick={handleQuickStudy} className="w-full">
                  Quick Study Session
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              Manage Decks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create, edit, and organize your flashcard decks.
            </p>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/decks">
                  View All Decks
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/decks/create">
                  Create New Deck
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              View your review schedule and study progress.
            </p>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/study?tab=schedule">
                  View Schedule
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/study?tab=dashboard">
                  View Analytics
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study Motivation */}
      {dueCount && dueCount.totalDue === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <div className="space-y-4">
              <div className="text-6xl">🎉</div>
              <div>
                <h3 className="text-xl font-semibold">All caught up!</h3>
                <p className="text-muted-foreground">
                  You&apos;ve completed all your reviews for now. Great job!
                </p>
              </div>
              <Button asChild>
                <Link href="/decks">
                  Add More Cards
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
