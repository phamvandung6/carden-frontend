'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import { DeckForm } from './deck-form';
import { useCreateDeck, useUpdateDeck } from '../hooks/use-decks';
import { formDataToCreateRequest, formDataToUpdateRequest } from '../utils/deck-utils';
import type { Deck, DeckFormData } from '../types';

interface DeckFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deck?: Deck;
  onSuccess?: (deck: Deck) => void;
}

export function DeckFormDialog({ open, onOpenChange, deck, onSuccess }: DeckFormDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!deck;

  const createDeckMutation = useCreateDeck();
  const updateDeckMutation = useUpdateDeck();

  const handleSubmit = async (formData: DeckFormData) => {
    try {
      setError(null);

      if (isEditing && deck) {
        // Update existing deck
        const updateData = formDataToUpdateRequest(formData);
        const response = await updateDeckMutation.mutateAsync({
          id: deck.id,
          data: updateData,
        });

        if (response.success && response.data) {
          onSuccess?.(response.data);
          onOpenChange(false);
        }
      } else {
        // Create new deck
        const createData = formDataToCreateRequest(formData);
        const response = await createDeckMutation.mutateAsync(createData);

        if (response.success && response.data) {
          onSuccess?.(response.data);
          onOpenChange(false);
        }
      }
    } catch (error) {
      console.error('Deck submission error:', error);
      setError(
        error instanceof Error 
          ? error.message 
          : isEditing 
            ? 'Failed to update deck. Please try again.' 
            : 'Failed to create deck. Please try again.'
      );
    }
  };

  const handleCancel = () => {
    setError(null);
    onOpenChange(false);
  };

  const isLoading = createDeckMutation.isPending || updateDeckMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {isEditing ? 'Edit Deck' : 'Create New Deck'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update your deck information and settings.'
              : 'Create a new deck to organize your vocabulary cards.'
            }
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="px-6 pb-6">
            <DeckForm
              deck={deck}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={isLoading}
              error={error}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Hook for easier usage
export function useDeckFormDialog() {
  const [open, setOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | undefined>();

  const openCreateDialog = () => {
    setEditingDeck(undefined);
    setOpen(true);
  };

  const openEditDialog = (deck: Deck) => {
    setEditingDeck(deck);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setEditingDeck(undefined);
  };

  return {
    open,
    editingDeck,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    DeckFormDialog: (props: Omit<DeckFormDialogProps, 'open' | 'onOpenChange' | 'deck'>) => (
      <DeckFormDialog
        open={open}
        onOpenChange={setOpen}
        deck={editingDeck}
        {...props}
      />
    ),
  };
}
