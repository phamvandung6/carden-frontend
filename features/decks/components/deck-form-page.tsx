'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { DeckForm } from './deck-form';
import { useCreateDeck, useUpdateDeck } from '../hooks/use-decks';
import { formDataToCreateRequest, formDataToUpdateRequest } from '../utils/deck-utils';
import type { Deck, DeckFormData } from '../types';

interface DeckFormPageProps {
  deck?: Deck;
  onSuccess?: (deck: Deck) => void;
  backUrl?: string;
}

export function DeckFormPage({ deck, onSuccess, backUrl = '/dashboard/decks' }: DeckFormPageProps) {
  const router = useRouter();
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
          if (onSuccess) {
            onSuccess(response.data);
          } else {
            router.push(backUrl);
          }
        }
      } else {
        // Create new deck
        const createData = formDataToCreateRequest(formData);
        const response = await createDeckMutation.mutateAsync(createData);

        if (response.success && response.data) {
          if (onSuccess) {
            onSuccess(response.data);
          } else {
            router.push(`/dashboard/decks/${response.data.id}`);
          }
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
    router.push(backUrl);
  };

  const isLoading = createDeckMutation.isPending || updateDeckMutation.isPending;

  return (
    <div className="container max-w-4xl py-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(backUrl)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Decks
        </Button>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? 'Edit Deck' : 'Create New Deck'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEditing 
              ? 'Update your deck information and settings.'
              : 'Create a new deck to organize your vocabulary cards.'
            }
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex justify-center">
        <DeckForm
          deck={deck}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
}
