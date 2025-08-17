'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface CardFormActionsProps {
  mode: 'create' | 'edit';
  isLoading: boolean;
  onCancel?: () => void;
}

export function CardFormActions({
  mode,
  isLoading,
  onCancel
}: CardFormActionsProps) {
  return (
    <div className="flex justify-end gap-2 pt-4">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      )}
      
      <Button
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : (mode === 'create' ? 'Create Card' : 'Update Card')}
      </Button>
    </div>
  );
}
