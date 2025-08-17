'use client';

import React from 'react';
import { Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type PreviewMode = 'front' | 'back' | 'both';

interface PreviewControlsProps {
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
  fullscreen?: boolean;
  onToggleFullscreen?: () => void;
  minimal?: boolean;
}

export function PreviewControls({
  mode,
  onModeChange,
  fullscreen = false,
  onToggleFullscreen,
  minimal = false
}: PreviewControlsProps) {
  if (minimal) return null;

  return (
    <div className="flex items-center justify-between gap-2 mb-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onModeChange('front')}
          disabled={mode === 'front'}
        >
          <Eye className="w-4 h-4 mr-1" />
          Front
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onModeChange('back')}
          disabled={mode === 'back'}
        >
          <EyeOff className="w-4 h-4 mr-1" />
          Back
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onModeChange('both')}
          disabled={mode === 'both'}
        >
          Both
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {onToggleFullscreen && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleFullscreen}
          >
            {fullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
