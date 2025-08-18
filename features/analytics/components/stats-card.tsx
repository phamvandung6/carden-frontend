'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StatsCardData } from '../types';

interface StatsCardProps {
  data: StatsCardData;
  icon?: LucideIcon;
  className?: string;
  variant?: 'default' | 'compact';
}

export function StatsCard({ 
  data, 
  icon: Icon,
  className,
  variant = 'default' 
}: StatsCardProps) {
  const { title, value, subtitle, trend } = data;

  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'neutral':
        return <Minus className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    if (!trend) return '';
    
    switch (trend.direction) {
      case 'up':
        return 'text-green-500';
      case 'down':
        return 'text-red-500';
      case 'neutral':
        return 'text-muted-foreground';
      default:
        return '';
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      // Format large numbers with K/M notation
      if (val >= 1000000) {
        return `${(val / 1000000).toFixed(1)}M`;
      } else if (val >= 1000) {
        return `${(val / 1000).toFixed(1)}K`;
      }
      return val.toLocaleString();
    }
    return val;
  };

  if (variant === 'compact') {
    return (
      <Card className={cn("", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
            {trend && (
              <div className="flex items-center space-x-1">
                {getTrendIcon()}
                <span className={cn("text-xs", getTrendColor())}>
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </span>
              </div>
            )}
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold">{formatValue(value)}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        <div className="flex items-center justify-between mt-1">
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className={cn("text-xs", getTrendColor())}>
                {trend.value > 0 ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Pre-configured stats cards for common metrics
interface QuickStatsProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export function TotalCardsStats({ className, variant }: QuickStatsProps) {
  // This would typically use the analytics hook
  // For now, showing the structure
  const data: StatsCardData = {
    title: "Total Cards",
    value: 0, // Will be populated by hook
    subtitle: "cards created",
    // trend: { value: 12, direction: 'up' }
  };

  return <StatsCard data={data} className={className} variant={variant} />;
}

export function AccuracyStats({ className, variant }: QuickStatsProps) {
  const data: StatsCardData = {
    title: "Overall Accuracy",
    value: "0%", // Will be populated by hook
    subtitle: "average score",
    // trend: { value: 5, direction: 'up' }
  };

  return <StatsCard data={data} className={className} variant={variant} />;
}

export function StudyTimeStats({ className, variant }: QuickStatsProps) {
  const data: StatsCardData = {
    title: "Study Time",
    value: "0h", // Will be populated by hook
    subtitle: "total time spent",
    // trend: { value: 8, direction: 'up' }
  };

  return <StatsCard data={data} className={className} variant={variant} />;
}

export function StreakStats({ className, variant }: QuickStatsProps) {
  const data: StatsCardData = {
    title: "Current Streak",
    value: 0, // Will be populated by hook
    subtitle: "days in a row",
    // trend: { value: 1, direction: 'up' }
  };

  return <StatsCard data={data} className={className} variant={variant} />;
}
