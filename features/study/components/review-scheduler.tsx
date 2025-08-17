'use client';

import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  PlayCircle, 
  CheckCircle, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDueCards } from '../hooks/use-study';
import { useStartSession, useDueCardsCount } from '../hooks/use-srs';
import type { PracticeCard, StudyMode } from '../types/practice-session';

/**
 * Calendar view component for review schedule
 */
function ReviewCalendar({ 
  selectedDate, 
  onDateSelect 
}: { 
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = new Date(
    currentMonth.getFullYear(), 
    currentMonth.getMonth() + 1, 
    0
  ).getDate();
  
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(), 
    currentMonth.getMonth(), 
    1
  ).getDay();

  const today = new Date();
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const renderCalendarDay = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const isPast = date < today;
    
    return (
      <button
        key={day}
        onClick={() => onDateSelect(date)}
        className={`
          h-10 w-10 rounded-lg text-sm transition-colors
          ${isSelected(date) 
            ? 'bg-primary text-primary-foreground' 
            : isToday(date)
            ? 'bg-accent text-accent-foreground'
            : isPast
            ? 'text-muted-foreground hover:bg-muted'
            : 'hover:bg-accent hover:text-accent-foreground'
          }
        `}
      >
        {day}
      </button>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {currentMonth.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="h-10 flex items-center justify-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={index} className="h-10" />
          ))}
          
          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => 
            renderCalendarDay(index + 1)
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Daily review summary component
 */
function DailyReviewSummary({ 
  selectedDate, 
  cards,
  onStartReview 
}: { 
  selectedDate: Date;
  cards: PracticeCard[];
  onStartReview: (deckId?: number) => void;
}) {
  const today = new Date();
  const isToday = selectedDate.toDateString() === today.toDateString();
  const isPast = selectedDate < today;
  const isFuture = selectedDate > today;

  const cardsByDeck = cards.reduce((acc, card) => {
    const deckId = card.deckId;
    if (!acc[deckId]) {
      acc[deckId] = {
        deckTitle: card.deckTitle,
        cards: []
      };
    }
    acc[deckId].cards.push(card);
    return acc;
  }, {} as Record<number, { deckTitle: string; cards: PracticeCard[] }>);

  const getStatusBadge = () => {
    if (isPast) {
      return <Badge variant="outline">Past</Badge>;
    } else if (isToday) {
      return <Badge variant="default">Today</Badge>;
    } else {
      return <Badge variant="secondary">Upcoming</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge()}
              <span className="text-sm text-muted-foreground">
                {cards.length} cards to review
              </span>
            </div>
          </div>
          
          {isToday && cards.length > 0 && (
            <Button onClick={() => onStartReview()} className="flex items-center gap-2">
              <PlayCircle className="w-4 h-4" />
              Start Review
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {cards.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
            <p className="text-muted-foreground">
              {isToday ? 'All caught up for today!' : 'No reviews scheduled'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(cardsByDeck).map(([deckId, deck]) => (
              <Card key={deckId} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{deck.deckTitle}</h4>
                    <p className="text-sm text-muted-foreground">
                      {deck.cards.length} cards
                    </p>
                  </div>
                  
                  {isToday && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onStartReview(parseInt(deckId))}
                    >
                      Review
                    </Button>
                  )}
                </div>
                
                {/* Show sample cards */}
                <div className="mt-3 space-y-2">
                  {deck.cards.slice(0, 3).map((card) => (
                    <div key={card.cardId} className="flex items-center gap-2 text-sm">
                      <Badge 
                        variant="outline" 
                        className={
                          card.cardState === 'NEW' ? 'border-blue-200 text-blue-800' :
                          card.cardState === 'LEARNING' ? 'border-yellow-200 text-yellow-800' :
                          'border-green-200 text-green-800'
                        }
                      >
                        {card.cardState}
                      </Badge>
                      <span className="truncate">{card.frontText}</span>
                    </div>
                  ))}
                  {deck.cards.length > 3 && (
                    <p className="text-xs text-muted-foreground">
                      +{deck.cards.length - 3} more cards
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Review scheduler settings component
 */
function SchedulerSettings({ 
  maxCardsPerDay,
  onMaxCardsChange 
}: {
  maxCardsPerDay: number;
  onMaxCardsChange: (value: number) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Scheduler Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Max cards per day</label>
          <Select 
            value={maxCardsPerDay.toString()} 
            onValueChange={(value) => onMaxCardsChange(parseInt(value))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 cards</SelectItem>
              <SelectItem value="20">20 cards</SelectItem>
              <SelectItem value="50">50 cards</SelectItem>
              <SelectItem value="100">100 cards</SelectItem>
              <SelectItem value="200">200 cards</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Loading skeleton for review scheduler
 */
function SchedulerSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Main review scheduler component
 */
export function ReviewScheduler() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [maxCardsPerDay, setMaxCardsPerDay] = useState(50);
  const [activeTab, setActiveTab] = useState('calendar');
  
  const { dueCards, isLoading: cardsLoading } = useDueCards({
    page: 0,
    size: maxCardsPerDay
  });
  const { data: dueCount, isLoading: countLoading } = useDueCardsCount();
  const startSessionMutation = useStartSession();

  const isLoading = cardsLoading || countLoading;

  // Filter cards for selected date
  const selectedDateCards = dueCards.filter((card: PracticeCard) => {
    const cardDueDate = new Date(card.dueDate);
    return cardDueDate.toDateString() === selectedDate.toDateString();
  });

  const handleStartReview = async (deckId?: number) => {
    try {
      await startSessionMutation.mutateAsync({
        studyMode: 'FLIP' as StudyMode,
        deckId: deckId || null,
        maxNewCards: 20,
        maxReviewCards: maxCardsPerDay,
        includeNewCards: true,
        includeReviewCards: true,
        includeLearningCards: true
      });
    } catch (error) {
      console.error('Failed to start review session:', error);
    }
  };

  if (isLoading) {
    return <SchedulerSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Review Scheduler</h1>
          <p className="text-muted-foreground">
            Plan and manage your review schedule
          </p>
        </div>
        
        {dueCount && dueCount.totalDue > 0 && (
          <Button onClick={() => handleStartReview()} className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4" />
            Review {dueCount.totalDue} Due Cards
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ReviewCalendar
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>
            
            <div className="space-y-6">
              <SchedulerSettings
                maxCardsPerDay={maxCardsPerDay}
                onMaxCardsChange={setMaxCardsPerDay}
              />
              
              <DailyReviewSummary
                selectedDate={selectedDate}
                cards={selectedDateCards}
                onStartReview={handleStartReview}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <div className="font-medium">Overdue</div>
                  <div className="text-sm text-muted-foreground">
                    0 cards
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-500" />
                <div>
                  <div className="font-medium">Today</div>
                  <div className="text-sm text-muted-foreground">
                    {dueCount?.totalDue || 0} cards
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-medium">This Week</div>
                  <div className="text-sm text-muted-foreground">
                    {dueCards.length} cards
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-medium">Completed</div>
                  <div className="text-sm text-muted-foreground">
                    0 today
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

