'use client';

import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

interface DeckFormActionsProps {
  isEditing: boolean;
  loading: boolean;
  isDirty: boolean;
  isValid: boolean;
  onCancel: () => void;
}

export function DeckFormActions({ 
  isEditing, 
  loading, 
  isDirty, 
  isValid, 
  onCancel 
}: DeckFormActionsProps) {
  return (
    <div className="flex items-center justify-end gap-4 pt-6 border-t">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={loading}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={loading || !isValid || (!isEditing && !isDirty)}
        className="min-w-[120px]"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isEditing ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {isEditing ? 'Update Deck' : 'Create Deck'}
          </>
        )}
      </Button>
    </div>
  );
}
