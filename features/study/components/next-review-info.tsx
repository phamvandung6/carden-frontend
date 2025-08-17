'use client';

import { Clock, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDetailedTime, formatNextReviewTime, getRelativeTime } from '../utils/time-utils';
import type { StudySessionState } from '../types';

interface NextReviewInfoProps {
  currentSession?: StudySessionState;
  nextAvailableTime?: string;
  minutesUntil?: number;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showIcon?: boolean;
}

interface NextReviewData {
  hasNextReview: boolean;
  timeText: string;
  detailedText: string;
  relativeText: string;
  isOverdue: boolean;
  isImminent: boolean; // Within next hour
}

/**
 * Extract and format next review information
 */
function getNextReviewData(
  currentSession?: StudySessionState,
  nextAvailableTime?: string,
  minutesUntil?: number
): NextReviewData {
  // Try to get data from session first, then from props
  const availableTime = currentSession?.nextAvailableStudyTime || nextAvailableTime;
  const minutes = currentSession?.minutesUntilNextCard ?? minutesUntil ?? 0;
  
  if (!availableTime || minutes <= 0) {
    return {
      hasNextReview: false,
      timeText: 'Ready now',
      detailedText: 'Cards are available for study',
      relativeText: 'now',
      isOverdue: false,
      isImminent: false
    };
  }
  
  const timeText = formatNextReviewTime(minutes);
  const detailedText = formatDetailedTime(minutes);
  const relativeText = getRelativeTime(availableTime);
  const isOverdue = minutes < 0;
  const isImminent = minutes > 0 && minutes <= 60;
  
  return {
    hasNextReview: true,
    timeText,
    detailedText,
    relativeText,
    isOverdue,
    isImminent
  };
}

/**
 * Compact next review info
 */
function CompactNextReviewInfo({ 
  currentSession, 
  nextAvailableTime, 
  minutesUntil, 
  className,
  showIcon = true 
}: NextReviewInfoProps) {
  const reviewData = getNextReviewData(currentSession, nextAvailableTime, minutesUntil);
  
  if (!reviewData.hasNextReview) {
    return (
      <span className={`flex items-center gap-1 text-green-600 ${className}`}>
        {showIcon && <CheckCircle className="h-4 w-4" />}
        <span className="text-sm">{reviewData.timeText}</span>
      </span>
    );
  }
  
  const IconComponent = reviewData.isOverdue ? AlertCircle : Clock;
  const colorClass = reviewData.isOverdue 
    ? 'text-red-600' 
    : reviewData.isImminent 
      ? 'text-orange-600' 
      : 'text-blue-600';
  
  return (
    <span className={`flex items-center gap-1 ${colorClass} ${className}`}>
      {showIcon && <IconComponent className="h-4 w-4" />}
      <span className="text-sm">{reviewData.timeText}</span>
    </span>
  );
}

/**
 * Default next review info with more detail
 */
function DefaultNextReviewInfo({ 
  currentSession, 
  nextAvailableTime, 
  minutesUntil, 
  className,
  showIcon = true 
}: NextReviewInfoProps) {
  const reviewData = getNextReviewData(currentSession, nextAvailableTime, minutesUntil);
  
  if (!reviewData.hasNextReview) {
    return (
      <div className={`flex items-center gap-2 text-green-700 ${className}`}>
        {showIcon && <CheckCircle className="h-4 w-4" />}
        <div>
          <div className="font-medium">{reviewData.timeText}</div>
          <div className="text-xs text-green-600">{reviewData.detailedText}</div>
        </div>
      </div>
    );
  }
  
  const IconComponent = reviewData.isOverdue ? AlertCircle : Clock;
  const colorClass = reviewData.isOverdue 
    ? 'text-red-700' 
    : reviewData.isImminent 
      ? 'text-orange-700' 
      : 'text-blue-700';
  
  return (
    <div className={`flex items-center gap-2 ${colorClass} ${className}`}>
      {showIcon && <IconComponent className="h-4 w-4" />}
      <div>
        <div className="font-medium">Next cards available in: {reviewData.timeText}</div>
        <div className="text-xs opacity-80">{reviewData.detailedText}</div>
      </div>
    </div>
  );
}

/**
 * Detailed next review info with card and background
 */
function DetailedNextReviewInfo({ 
  currentSession, 
  nextAvailableTime, 
  minutesUntil, 
  className 
}: NextReviewInfoProps) {
  const reviewData = getNextReviewData(currentSession, nextAvailableTime, minutesUntil);
  
  if (!reviewData.hasNextReview) {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-center gap-2 text-green-700">
          <CheckCircle className="h-4 w-4" />
          <span className="font-medium">Cards Ready!</span>
        </div>
        <p className="text-green-600 mt-1 text-sm">
          {reviewData.detailedText}
        </p>
      </div>
    );
  }
  
  const bgColor = reviewData.isOverdue 
    ? 'bg-red-50 border-red-200' 
    : reviewData.isImminent 
      ? 'bg-orange-50 border-orange-200' 
      : 'bg-blue-50 border-blue-200';
      
  const textColor = reviewData.isOverdue 
    ? 'text-red-700' 
    : reviewData.isImminent 
      ? 'text-orange-700' 
      : 'text-blue-700';
      
  const subtextColor = reviewData.isOverdue 
    ? 'text-red-600' 
    : reviewData.isImminent 
      ? 'text-orange-600' 
      : 'text-blue-600';
  
  const IconComponent = reviewData.isOverdue ? AlertCircle : Clock;
  
  return (
    <div className={`${bgColor} border rounded-lg p-3 ${className}`}>
      <div className={`flex items-center gap-2 ${textColor}`}>
        <IconComponent className="h-4 w-4" />
        <span className="font-medium">
          {reviewData.isOverdue ? 'Cards Overdue!' : 'Next cards available in:'}
        </span>
      </div>
      <p className={`${subtextColor} mt-1`}>
        {reviewData.detailedText}
      </p>
      {nextAvailableTime && (
        <div className="flex items-center gap-1 mt-2 text-xs opacity-75">
          <Calendar className="h-3 w-3" />
          <span>Ready {reviewData.relativeText}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Flexible next review info component
 */
export function NextReviewInfo({ 
  currentSession, 
  nextAvailableTime, 
  minutesUntil, 
  className = '',
  variant = 'default',
  showIcon = true
}: NextReviewInfoProps) {
  switch (variant) {
    case 'compact':
      return (
        <CompactNextReviewInfo 
          currentSession={currentSession}
          nextAvailableTime={nextAvailableTime}
          minutesUntil={minutesUntil}
          className={className}
          showIcon={showIcon}
        />
      );
    case 'detailed':
      return (
        <DetailedNextReviewInfo 
          currentSession={currentSession}
          nextAvailableTime={nextAvailableTime}
          minutesUntil={minutesUntil}
          className={className}
        />
      );
    default:
      return (
        <DefaultNextReviewInfo 
          currentSession={currentSession}
          nextAvailableTime={nextAvailableTime}
          minutesUntil={minutesUntil}
          className={className}
          showIcon={showIcon}
        />
      );
  }
}
