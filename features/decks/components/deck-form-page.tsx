'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { DeckForm } from './deck-form';
import { useCreateDeck, useUpdateDeck } from '../hooks/use-decks';
import { formDataToCreateRequest, formDataToUpdateRequest } from '../utils/deck-utils';
import { DecksApi } from '../services/decks-api';
import type { Deck, DeckFormData } from '../types';

interface DeckFormPageProps {
  deck?: Deck;
  onSuccess?: (deck: Deck) => void;
  backUrl?: string;
}

export function DeckFormPage({ deck, onSuccess, backUrl = '/decks' }: DeckFormPageProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const isEditing = !!deck;

  const createDeckMutation = useCreateDeck();
  const updateDeckMutation = useUpdateDeck({ silent: true }); // Silent for image upload updates

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
          const newDeck = response.data;
          
          // If user selected a cover image (blob URL), upload it
          if (formData.coverImageUrl && formData.coverImageUrl.startsWith('blob:')) {
            try {
              // Convert blob URL back to File object
              const imageResponse = await fetch(formData.coverImageUrl);
              const imageBlob = await imageResponse.blob();
              const imageFile = new File([imageBlob], 'cover-image.jpg', { type: imageBlob.type });
              
              // Upload the image
              const publicUrl = await DecksApi.uploadDeckThumbnail(newDeck.id, imageFile);
              
              // Update deck with the real image URL
              await updateDeckMutation.mutateAsync({
                id: newDeck.id,
                data: { coverImageUrl: publicUrl }
              });
              
              // Update the deck object with new image URL
              newDeck.coverImageUrl = publicUrl;
            } catch (uploadError) {
              console.error('Failed to upload cover image:', uploadError);
              // Continue anyway - deck was created successfully
            }
          }
          
          if (onSuccess) {
            onSuccess(newDeck);
          } else {
            router.push(`/decks/${newDeck.id}`);
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
