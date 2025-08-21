'use client';

import React from 'react';
import { Volume2, VolumeX, Loader2, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useSpeech, type SpeechOptions } from '@/lib/hooks/use-speech';
import { cn } from '@/lib/utils';

interface SpeechButtonProps {
  /** Text to speak */
  text: string;
  /** Speech options */
  options?: SpeechOptions;
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  /** Button size */
  size?: 'default' | 'sm' | 'lg' | 'icon';
  /** Custom className */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Show text label */
  showLabel?: boolean;
  /** Custom label text */
  label?: string;
  /** Auto-play on mount */
  autoPlay?: boolean;
}

export function SpeechButton({
  text,
  options,
  variant = 'ghost',
  size = 'sm',
  className,
  disabled = false,
  showLabel = false,
  label = 'Play audio',
  autoPlay = false
}: SpeechButtonProps) {
  const { speak, stop, pause, resume, isSupported, isSpeaking, isPaused } = useSpeech();

  // Auto-play effect
  React.useEffect(() => {
    if (autoPlay && text && isSupported && !disabled) {
      const timer = setTimeout(() => {
        speak(text, options);
      }, 100); // Small delay to ensure component is mounted
      
      return () => clearTimeout(timer);
    }
  }, [autoPlay, text, isSupported, disabled, speak, options]);

  const handleClick = () => {
    if (!text.trim() || disabled) return;

    if (isSpeaking) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak(text, options);
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    stop();
  };

  // Don't render if not supported
  if (!isSupported) {
    return null;
  }

  // Determine icon and tooltip text
  let icon = <Volume2 className="h-4 w-4" />;
  let tooltipText = label;

  if (!text.trim()) {
    icon = <VolumeX className="h-4 w-4" />;
    tooltipText = 'No text to speak';
  } else if (isSpeaking && !isPaused) {
    icon = <Pause className="h-4 w-4" />;
    tooltipText = 'Pause audio';
  } else if (isSpeaking && isPaused) {
    icon = <Play className="h-4 w-4" />;
    tooltipText = 'Resume audio';
  }

  const buttonContent = (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || !text.trim()}
      className={cn(
        'relative',
        isSpeaking && 'text-blue-600 dark:text-blue-400',
        className
      )}
    >
      {icon}
      {showLabel && (
        <span className="ml-2">
          {isSpeaking && isPaused ? 'Resume' : 
           isSpeaking ? 'Pause' : 
           'Play'}
        </span>
      )}
      
      {/* Stop button overlay when speaking */}
      {isSpeaking && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 hover:bg-red-600 text-white p-0"
          onClick={handleStop}
          title="Stop audio"
        >
          <VolumeX className="h-3 w-3" />
        </Button>
      )}
    </Button>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {buttonContent}
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
        {options?.lang && (
          <p className="text-xs text-muted-foreground mt-1">
            Language: {options.lang}
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

// Preset configurations for common use cases
export const SpeechButtonPresets = {
  // For flashcard front side (usually the word/phrase to learn)
  frontSide: {
    variant: 'outline' as const,
    size: 'sm' as const,
    options: { rate: 0.8, pitch: 1.1 } // Slightly slower and higher pitch for clarity
  },
  
  // For flashcard back side (usually definitions/examples)
  backSide: {
    variant: 'ghost' as const,
    size: 'sm' as const,
    options: { rate: 1.0, pitch: 1.0 } // Normal speed for longer text
  },
  
  // For inline text in examples
  inline: {
    variant: 'ghost' as const,
    size: 'icon' as const,
    className: 'h-6 w-6 p-0'
  },
  
  // For pronunciation guides
  pronunciation: {
    variant: 'secondary' as const,
    size: 'sm' as const,
    showLabel: true,
    label: 'Pronunciation',
    options: { rate: 0.7, pitch: 1.2 } // Slower and higher for pronunciation
  }
} as const;
