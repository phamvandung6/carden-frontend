/**
 * Time formatting utilities for study features
 */

/**
 * Format minutes until next review into human-readable string
 * @param minutesUntil - Minutes until next review (can be negative)
 * @returns Formatted string like "5m", "2h 30m", "3d 4h", "Ready now"
 */
export function formatNextReviewTime(minutesUntil: number): string {
  if (minutesUntil <= 0) return 'Ready now';
  
  if (minutesUntil < 60) {
    return `${minutesUntil}m`;
  }
  
  const hours = Math.floor(minutesUntil / 60);
  const mins = minutesUntil % 60;
  
  if (hours < 24) {
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
}

/**
 * Format minutes into detailed time description for UI
 * @param minutes - Number of minutes
 * @returns Detailed string like "5 minutes", "2 hours 30 minutes", "3 days 4 hours"
 */
export function formatDetailedTime(minutes: number): string {
  if (minutes <= 0) return 'now';
  
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours < 24) {
    const hourText = `${hours} hour${hours === 1 ? '' : 's'}`;
    const minText = mins > 0 ? ` ${mins} minute${mins === 1 ? '' : 's'}` : '';
    return hourText + minText;
  }
  
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  
  const dayText = `${days} day${days === 1 ? '' : 's'}`;
  const hourText = remainingHours > 0 ? ` ${remainingHours} hour${remainingHours === 1 ? '' : 's'}` : '';
  
  return dayText + hourText;
}

/**
 * Format duration in seconds to readable format
 * @param seconds - Duration in seconds
 * @returns Formatted string like "2:30", "1:05:45"
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get relative time description for study status
 * @param isoDateString - ISO date string
 * @returns Relative time like "2 hours ago", "in 3 days"
 */
export function getRelativeTime(isoDateString: string): string {
  const date = new Date(isoDateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  
  if (diffMinutes < 0) {
    // Past time
    const absDiff = Math.abs(diffMinutes);
    if (absDiff < 60) return `${absDiff}m ago`;
    
    const hours = Math.floor(absDiff / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } else {
    // Future time
    return `in ${formatNextReviewTime(diffMinutes)}`;
  }
}

/**
 * Check if a given time is overdue
 * @param dueTime - ISO date string when something is due
 * @returns true if overdue, false otherwise
 */
export function isOverdue(dueTime: string): boolean {
  return new Date(dueTime) < new Date();
}

/**
 * Calculate progress percentage for time-based intervals
 * @param startTime - ISO date string when interval started
 * @param endTime - ISO date string when interval ends
 * @returns Percentage (0-100) of time elapsed
 */
export function getTimeProgress(startTime: string, endTime: string): number {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  const now = new Date().getTime();
  
  if (now <= start) return 0;
  if (now >= end) return 100;
  
  const totalDuration = end - start;
  const elapsed = now - start;
  
  return Math.round((elapsed / totalDuration) * 100);
}
