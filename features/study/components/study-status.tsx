'use client';

import { Target, Clock, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatNextReviewTime, formatDetailedTime } from '../utils/time-utils';
import type { DueCardsCount } from '../types';

interface StudyStatusProps {
  dueCount?: DueCardsCount;
  showDetailed?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

interface StudyStatusInfo {
  icon: typeof Target | typeof Clock | typeof CheckCircle;
  text: string;
  subtext?: string;
  variant: 'default' | 'secondary' | 'outline' | 'destructive';
  iconColor: string;
}

/**
 * Get study status information based on due cards count
 */
function getStudyStatusInfo(dueCount?: DueCardsCount, showDetailed = false): StudyStatusInfo {
  if (!dueCount) {
    return {
      icon: Clock,
      text: 'Loading study status...',
      variant: 'outline',
      iconColor: 'text-muted-foreground'
    };
  }
  
  // Calculate total available cards (due + new + learning)
  const totalAvailable = dueCount.totalDue + dueCount.newCards + dueCount.learningCards;
  
  if (totalAvailable > 0 || dueCount.hasCardsAvailable) {
    const breakdown = [];
    if (dueCount.reviewCards > 0) breakdown.push(`${dueCount.reviewCards} review`);
    if (dueCount.newCards > 0) breakdown.push(`${dueCount.newCards} new`);
    if (dueCount.learningCards > 0) breakdown.push(`${dueCount.learningCards} learning`);
    
    // Determine primary message
    let text = '';
    if (dueCount.totalDue > 0) {
      text = `${dueCount.totalDue} due to study`;
    } else if (totalAvailable > 0) {
      text = `${totalAvailable} ready to study`;
    } else {
      text = 'Cards available to study';
    }
    
    return {
      icon: Target,
      text,
      subtext: showDetailed && breakdown.length > 0 ? breakdown.join(', ') : undefined,
      variant: 'default',
      iconColor: 'text-blue-600'
    };
  }
  
  if (!dueCount.hasCardsAvailable) {
    return {
      icon: CheckCircle,
      text: 'All studied',
      subtext: showDetailed ? 'Great job! All cards completed' : undefined,
      variant: 'secondary',
      iconColor: 'text-green-600'
    };
  }
  
  const nextTime = showDetailed 
    ? formatDetailedTime(dueCount.minutesUntilNext)
    : formatNextReviewTime(dueCount.minutesUntilNext);
    
  return {
    icon: Clock,
    text: `Next review in ${nextTime}`,
    subtext: showDetailed ? 'Cards will be available based on SRS schedule' : undefined,
    variant: 'outline',
    iconColor: 'text-orange-600'
  };
}

/**
 * Default study status display
 */
function DefaultStudyStatus({ dueCount, showDetailed, className }: StudyStatusProps) {
  const statusInfo = getStudyStatusInfo(dueCount, showDetailed);
  const IconComponent = statusInfo.icon;
  
  return (
    <span className={`flex items-center gap-1 ${className}`}>
      <IconComponent className={`h-4 w-4 ${statusInfo.iconColor}`} />
      <span>{statusInfo.text}</span>
      {statusInfo.subtext && (
        <span className="text-xs text-muted-foreground">
          ({statusInfo.subtext})
        </span>
      )}
    </span>
  );
}

/**
 * Compact study status with badge
 */
function CompactStudyStatus({ dueCount, className }: StudyStatusProps) {
  const statusInfo = getStudyStatusInfo(dueCount);
  const IconComponent = statusInfo.icon;
  
  return (
    <Badge variant={statusInfo.variant} className={`flex items-center gap-1 ${className}`}>
      <IconComponent className="h-3 w-3" />
      {statusInfo.text}
    </Badge>
  );
}

/**
 * Detailed study status with breakdown
 */
function DetailedStudyStatus({ dueCount, className }: StudyStatusProps) {
  if (!dueCount) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="text-sm text-muted-foreground">Loading study information...</div>
      </div>
    );
  }
  
  const statusInfo = getStudyStatusInfo(dueCount, true);
  const IconComponent = statusInfo.icon;
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <IconComponent className={`h-4 w-4 ${statusInfo.iconColor}`} />
        <span className="font-medium">{statusInfo.text}</span>
      </div>
      
      {dueCount.totalDue > 0 && (
        <div className="grid grid-cols-3 gap-2 text-xs">
          {dueCount.reviewCards > 0 && (
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-blue-500" />
              <span>{dueCount.reviewCards} Review</span>
            </div>
          )}
          {dueCount.newCards > 0 && (
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3 text-green-500" />
              <span>{dueCount.newCards} New</span>
            </div>
          )}
          {dueCount.learningCards > 0 && (
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-orange-500" />
              <span>{dueCount.learningCards} Learning</span>
            </div>
          )}
        </div>
      )}
      
      {statusInfo.subtext && (
        <div className="text-xs text-muted-foreground">
          {statusInfo.subtext}
        </div>
      )}
    </div>
  );
}

/**
 * Flexible study status component with multiple display variants
 */
export function StudyStatus({ 
  dueCount, 
  showDetailed = false, 
  className = '',
  variant = 'default'
}: StudyStatusProps) {
  switch (variant) {
    case 'compact':
      return <CompactStudyStatus dueCount={dueCount} className={className} />;
    case 'detailed':
      return <DetailedStudyStatus dueCount={dueCount} className={className} />;
    default:
      return <DefaultStudyStatus dueCount={dueCount} showDetailed={showDetailed} className={className} />;
  }
}
