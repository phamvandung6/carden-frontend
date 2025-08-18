'use client';

import { Play, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ReviewScheduler,
  NextReviewInfo,
  StudyStatus
} from '@/features/study';
import { useDueCardsCount } from '@/features/study';

export default function StudyPage() {
  const { data: dueCount } = useDueCardsCount();

  const handleStartQuickSession = async () => {
    try {
      // Just redirect to practice page - it will handle session creation
      window.location.href = '/practice';
    } catch (error) {
      console.error('Failed to redirect to practice:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Center</h1>
          <p className="text-muted-foreground">
            Manage your learning schedule and review cards
          </p>
        </div>

        {dueCount && dueCount.totalDue > 0 && (
          <Button 
            onClick={handleStartQuickSession}
            size="lg"
            className="flex items-center gap-2"
          >
            <Play className="w-5 h-5" />
            Quick Study ({dueCount.totalDue} cards)
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      {dueCount && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <div className="text-2xl font-bold">{dueCount.totalDue}</div>
                  <div className="text-sm text-muted-foreground">Cards Due</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <div className="text-2xl font-bold">{dueCount.newCards}</div>
                  <div className="text-sm text-muted-foreground">New Cards</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <div className="text-2xl font-bold">{dueCount.learningCards}</div>
                  <div className="text-sm text-muted-foreground">Learning</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <div className="text-2xl font-bold">{dueCount.reviewCards}</div>
                  <div className="text-sm text-muted-foreground">Review</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Next Review Information */}
      {dueCount && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Study Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <StudyStatus dueCount={dueCount} showDetailed={true} />
              </div>
              {dueCount.totalDue === 0 && (
                <NextReviewInfo 
                  nextAvailableTime={dueCount.nextCardAvailableAt}
                  minutesUntil={dueCount.minutesUntilNext}
                  variant="default"
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Schedule */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Review Schedule</h2>
        </div>
        <ReviewScheduler />
      </div>
    </div>
  );
}
