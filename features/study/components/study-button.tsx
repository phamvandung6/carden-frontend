'use client';

import { Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatNextReviewTime } from '../utils/time-utils';
import type { DueCardsCount } from '../types';

interface StudyButtonProps {
  dueCount?: DueCardsCount;
  onClick: () => void;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  loadingText?: string;
  isLoading?: boolean;
}

interface StudyButtonInfo {
  text: string;
  disabled: boolean;
  variant: 'default' | 'outline' | 'secondary' | 'ghost';
  icon: typeof Play | typeof Clock;
}

/**
 * Get study button text, state, and icon based on due cards count
 */
function getStudyButtonInfo(dueCount?: DueCardsCount): StudyButtonInfo {
  if (!dueCount) {
    return { 
      text: 'Study', 
      disabled: false, 
      variant: 'default',
      icon: Play
    };
  }
  
  // Calculate total available cards (due + new + learning)
  const totalAvailable = dueCount.totalDue + dueCount.newCards + dueCount.learningCards;
  
  // If there are any cards available for study
  if (totalAvailable > 0 || dueCount.hasCardsAvailable) {
    return { 
      text: dueCount.totalDue > 0 
        ? `Study (${dueCount.totalDue})` 
        : totalAvailable > 0 
          ? `Study (${totalAvailable})` 
          : 'Study', 
      disabled: false, 
      variant: 'default',
      icon: Play
    };
  }
  
  // No cards available - check if it's temporary or permanent
  if (!dueCount.hasCardsAvailable) {
    return { 
      text: 'All studied', 
      disabled: true, 
      variant: 'outline',
      icon: Clock
    };
  }
  
  // Cards will be available later
  const nextTime = formatNextReviewTime(dueCount.minutesUntilNext);
  return { 
    text: `Study in ${nextTime}`, 
    disabled: true, 
    variant: 'outline',
    icon: Clock
  };
}

/**
 * Smart study button that shows different states based on due cards
 */
export function StudyButton({ 
  dueCount, 
  onClick, 
  className = '',
  size = 'default',
  showIcon = true,
  loadingText = 'Loading...',
  isLoading = false
}: StudyButtonProps) {
  const studyInfo = getStudyButtonInfo(dueCount);
  const IconComponent = studyInfo.icon;
  
  if (isLoading) {
    return (
      <Button 
        disabled
        className={`flex items-center gap-2 ${className}`}
        size={size}
        variant="outline"
      >
        {showIcon && <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full" />}
        {loadingText}
      </Button>
    );
  }
  
  return (
    <Button 
      onClick={onClick} 
      className={`flex items-center gap-2 ${className}`}
      disabled={studyInfo.disabled}
      variant={studyInfo.variant}
      size={size}
    >
      {showIcon && <IconComponent className="h-4 w-4" />}
      {studyInfo.text}
    </Button>
  );
}
