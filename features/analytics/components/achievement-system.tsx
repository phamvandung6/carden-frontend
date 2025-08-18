'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Medal, 
  Target, 
  Zap, 
  Calendar,
  BookOpen,
  Clock,
  TrendingUp,
  Star,
  Award,
  Crown,
  Flame
} from 'lucide-react';
import { useAnalytics } from '../hooks/use-analytics';
import { cn } from '@/lib/utils';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'streak' | 'accuracy' | 'volume' | 'consistency' | 'special';
  requirement: number;
  currentValue: number;
  isUnlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface AchievementSystemProps {
  className?: string;
  showAll?: boolean;
  category?: Achievement['category'];
}

export function AchievementSystem({ 
  className, 
  showAll = false,
  category
}: AchievementSystemProps) {
  const {
    currentStreak,
    longestStreak,
    totalCards,
    totalSessions,
    overallAccuracy,
    totalStudyTime,
    isLoading,
    error
  } = useAnalytics();

  // Define all achievements
  const allAchievements: Achievement[] = [
    // Streak Achievements
    {
      id: 'first-streak',
      title: 'Getting Started',
      description: 'Complete your first day of study',
      icon: Flame,
      category: 'streak',
      requirement: 1,
      currentValue: Math.max(currentStreak, longestStreak),
      isUnlocked: Math.max(currentStreak, longestStreak) >= 1,
      rarity: 'common',
      points: 10
    },
    {
      id: 'week-warrior',
      title: 'Week Warrior',
      description: 'Study for 7 days in a row',
      icon: Medal,
      category: 'streak',
      requirement: 7,
      currentValue: Math.max(currentStreak, longestStreak),
      isUnlocked: Math.max(currentStreak, longestStreak) >= 7,
      rarity: 'rare',
      points: 50
    },
    {
      id: 'month-master',
      title: 'Month Master',
      description: 'Study for 30 days in a row',
      icon: Trophy,
      category: 'streak',
      requirement: 30,
      currentValue: Math.max(currentStreak, longestStreak),
      isUnlocked: Math.max(currentStreak, longestStreak) >= 30,
      rarity: 'epic',
      points: 200
    },
    {
      id: 'century-champion',
      title: 'Century Champion',
      description: 'Study for 100 days in a row',
      icon: Crown,
      category: 'streak',
      requirement: 100,
      currentValue: Math.max(currentStreak, longestStreak),
      isUnlocked: Math.max(currentStreak, longestStreak) >= 100,
      rarity: 'legendary',
      points: 1000
    },

    // Accuracy Achievements
    {
      id: 'accuracy-novice',
      title: 'Accuracy Novice',
      description: 'Achieve 70% overall accuracy',
      icon: Target,
      category: 'accuracy',
      requirement: 70,
      currentValue: overallAccuracy,
      isUnlocked: overallAccuracy >= 70,
      rarity: 'common',
      points: 25
    },
    {
      id: 'accuracy-expert',
      title: 'Accuracy Expert',
      description: 'Achieve 85% overall accuracy',
      icon: Star,
      category: 'accuracy',
      requirement: 85,
      currentValue: overallAccuracy,
      isUnlocked: overallAccuracy >= 85,
      rarity: 'rare',
      points: 75
    },
    {
      id: 'accuracy-master',
      title: 'Accuracy Master',
      description: 'Achieve 95% overall accuracy',
      icon: Award,
      category: 'accuracy',
      requirement: 95,
      currentValue: overallAccuracy,
      isUnlocked: overallAccuracy >= 95,
      rarity: 'legendary',
      points: 500
    },

    // Volume Achievements
    {
      id: 'first-hundred',
      title: 'Card Collector',
      description: 'Study 100 cards',
      icon: BookOpen,
      category: 'volume',
      requirement: 100,
      currentValue: totalCards,
      isUnlocked: totalCards >= 100,
      rarity: 'common',
      points: 30
    },
    {
      id: 'session-starter',
      title: 'Session Starter',
      description: 'Complete 50 study sessions',
      icon: Zap,
      category: 'volume',
      requirement: 50,
      currentValue: totalSessions,
      isUnlocked: totalSessions >= 50,
      rarity: 'rare',
      points: 100
    },
    {
      id: 'time-investor',
      title: 'Time Investor',
      description: 'Study for 10 hours total',
      icon: Clock,
      category: 'volume',
      requirement: 600, // 10 hours in minutes
      currentValue: totalStudyTime,
      isUnlocked: totalStudyTime >= 600,
      rarity: 'epic',
      points: 150
    },

    // Consistency Achievements
    {
      id: 'weekend-warrior',
      title: 'Weekend Warrior',
      description: 'Study on weekends',
      icon: Calendar,
      category: 'consistency',
      requirement: 1,
      currentValue: 1, // Would need weekend study data
      isUnlocked: true, // Placeholder
      rarity: 'common',
      points: 20
    },
    {
      id: 'early-bird',
      title: 'Early Bird',
      description: 'Study before 9 AM',
      icon: TrendingUp,
      category: 'consistency',
      requirement: 1,
      currentValue: 1, // Would need time-based data
      isUnlocked: true, // Placeholder
      rarity: 'rare',
      points: 40
    }
  ];

  if (isLoading) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={cn("w-full", className)}>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            Failed to load achievements
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter achievements
  let filteredAchievements = allAchievements;
  if (category) {
    filteredAchievements = allAchievements.filter(a => a.category === category);
  }
  if (!showAll) {
    // Show unlocked achievements and next few to unlock
    const unlocked = filteredAchievements.filter(a => a.isUnlocked);
    const nextToUnlock = filteredAchievements
      .filter(a => !a.isUnlocked)
      .sort((a, b) => (a.requirement - a.currentValue) - (b.requirement - b.currentValue))
      .slice(0, 3);
    filteredAchievements = [...unlocked, ...nextToUnlock];
  }

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 border-gray-300';
      case 'rare': return 'text-blue-600 border-blue-300';
      case 'epic': return 'text-purple-600 border-purple-300';
      case 'legendary': return 'text-yellow-600 border-yellow-300';
      default: return 'text-gray-600 border-gray-300';
    }
  };

  const getRarityBadgeVariant = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'secondary' as const;
      case 'rare': return 'default' as const;
      case 'epic': return 'default' as const;
      case 'legendary': return 'default' as const;
      default: return 'secondary' as const;
    }
  };

  const getProgressPercentage = (achievement: Achievement) => {
    return Math.min(100, (achievement.currentValue / achievement.requirement) * 100);
  };

  const totalPoints = allAchievements
    .filter(a => a.isUnlocked)
    .reduce((sum, a) => sum + a.points, 0);

  const unlockedCount = allAchievements.filter(a => a.isUnlocked).length;

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Achievements
        </CardTitle>
        <CardDescription>
          Track your learning milestones and earn rewards
        </CardDescription>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Medal className="h-4 w-4 text-muted-foreground" />
            <span>{unlockedCount}/{allAchievements.length} unlocked</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span>{totalPoints} points</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredAchievements.map((achievement) => {
            const Icon = achievement.icon;
            const progress = getProgressPercentage(achievement);
            
            return (
              <div
                key={achievement.id}
                className={cn(
                  "flex items-center space-x-4 p-4 rounded-lg border",
                  achievement.isUnlocked 
                    ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" 
                    : "bg-muted/30"
                )}
              >
                <div className={cn(
                  "p-2 rounded-full border-2",
                  achievement.isUnlocked 
                    ? getRarityColor(achievement.rarity)
                    : "text-muted-foreground border-muted"
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getRarityBadgeVariant(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                      <Badge variant="outline">
                        {achievement.points} pts
                      </Badge>
                    </div>
                  </div>
                  
                  {!achievement.isUnlocked && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progress</span>
                        <span>{achievement.currentValue}/{achievement.requirement}</span>
                      </div>
                      <Progress value={progress} className="h-1" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {!showAll && (
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                Keep studying to unlock more achievements!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
