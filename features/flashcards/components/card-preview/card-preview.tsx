'use client';

import React, { useState, useEffect } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Card as CardType, CardFormState } from '../../types';
import { PreviewControls, type PreviewMode } from './preview-controls';
import { CardSide } from './card-side';
import { CardMetadata } from './card-metadata';

interface CardPreviewProps {
  /** Existing card data */
  card?: CardType;
  /** Form state for preview during editing */
  formState?: CardFormState;
  /** Preview mode */
  mode?: PreviewMode;
  /** Enable flip animation */
  animate?: boolean;
  /** Fullscreen mode */
  fullscreen?: boolean;
  /** Callback to toggle fullscreen */
  onToggleFullscreen?: () => void;
  /** Show metadata */
  showMetadata?: boolean;
  /** Minimal mode (no controls) */
  minimal?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export function CardPreview({
  card,
  formState,
  mode = 'front',
  animate = true,
  fullscreen = false,
  onToggleFullscreen,
  showMetadata = false,
  minimal = false,
  className
}: CardPreviewProps) {
  
  const [currentMode, setCurrentMode] = useState<PreviewMode>(mode);
  const [isFlipping, setIsFlipping] = useState(false);

  // Update internal mode when prop changes
  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  // Determine data source (card or formState)
  const displayData = card || {
    front: formState?.front || '',
    back: formState?.back || '',
    ipaPronunciation: formState?.ipaPronunciation,
    audioUrl: formState?.audioUrl,
    tags: formState?.tags,
    examples: formState?.examples,
    synonyms: formState?.synonyms,
    antonyms: formState?.antonyms,
    difficulty: formState?.difficulty || 'NORMAL',
    displayOrder: formState?.displayOrder || 1,
  };

  const handleModeChange = (newMode: PreviewMode) => {
    if (animate && newMode !== currentMode) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentMode(newMode);
        setIsFlipping(false);
      }, 150);
    } else {
      setCurrentMode(newMode);
    }
  };

  const handleCardClick = () => {
    if (currentMode === 'front') {
      handleModeChange('back');
    } else if (currentMode === 'back') {
      handleModeChange('front');
    }
    // Don't flip in 'both' mode
  };

  return (
    <TooltipProvider>
      <div className={cn(
        'w-full max-w-md mx-auto',
        fullscreen && 'max-w-none h-full',
        className
      )}>
        {/* Controls */}
        <PreviewControls
          mode={currentMode}
          onModeChange={handleModeChange}
          fullscreen={fullscreen}
          onToggleFullscreen={onToggleFullscreen}
          minimal={minimal}
        />

        {/* Card Display */}
        <div className={cn(
          "transition-opacity duration-150",
          isFlipping && "opacity-50"
        )}>
          {currentMode === 'both' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CardSide
                title="Front"
                content={displayData.front}
                audioUrl={displayData.audioUrl}
                ipaPronunciation={displayData.ipaPronunciation}
                tags={displayData.tags}
              />
              <CardSide
                title="Back"
                content={displayData.back}
                examples={displayData.examples}
                synonyms={displayData.synonyms}
                antonyms={displayData.antonyms}
              />
            </div>
          ) : (
            <div 
              onClick={handleCardClick}
              className="cursor-pointer"
              title={currentMode === 'front' ? 'Click to see back' : 'Click to see front'}
            >
              <CardSide
                title={currentMode === 'front' ? 'Front' : 'Back'}
                content={currentMode === 'front' ? displayData.front : displayData.back}
                audioUrl={currentMode === 'front' ? displayData.audioUrl : undefined}
                ipaPronunciation={currentMode === 'front' ? displayData.ipaPronunciation : undefined}
                tags={currentMode === 'front' ? displayData.tags : undefined}
                examples={currentMode === 'back' ? displayData.examples : undefined}
                synonyms={currentMode === 'back' ? displayData.synonyms : undefined}
                antonyms={currentMode === 'back' ? displayData.antonyms : undefined}
                isFlipped={isFlipping}
              />
            </div>
          )}
        </div>

        {/* Metadata */}
        {showMetadata && (
          <CardMetadata
            difficulty={displayData.difficulty}
            displayOrder={displayData.displayOrder}
            className="mt-4"
          />
        )}
      </div>
    </TooltipProvider>
  );
}
