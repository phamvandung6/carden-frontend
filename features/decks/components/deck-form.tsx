'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';

import type { Deck, DeckFormData } from '../types';
import { deckFormSchema, type DeckFormInput } from '../schemas/deck-form-schema';
import { deckToFormData, getDefaultDeckFormData } from '../utils/deck-utils';
import { DeckBasicInfoFields } from './deck-form-basic-info';
import { DeckLanguageFields } from './deck-form-language';
import { DeckVisibilityField } from './deck-form-visibility';
import { DeckTagsField } from './deck-form-tags';
import { DeckImageField } from './deck-form-image';
import { DeckFormActions } from './deck-form-actions';

interface DeckFormProps {
  deck?: Deck;
  onSubmit: (data: DeckFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

export function DeckForm({ deck, onSubmit, onCancel, loading = false, error }: DeckFormProps) {
  const isEditing = !!deck;

  const form = useForm<DeckFormInput>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: deck ? deckToFormData(deck) : getDefaultDeckFormData(),
    mode: 'onChange',
  });

  const { setValue, handleSubmit, formState: { isDirty, isValid } } = form;

  // Reset form when deck changes
  useEffect(() => {
    if (deck) {
      const formData = deckToFormData(deck);
      Object.entries(formData).forEach(([key, value]) => {
        setValue(key as keyof DeckFormInput, value, { shouldValidate: true });
      });
    } else {
      form.reset(getDefaultDeckFormData());
    }
  }, [deck, setValue, form]);

  const handleFormSubmit = async (data: DeckFormInput) => {
    try {
      // Transform form data to API format
      const transformedData: DeckFormData = {
        title: data.title,
        description: data.description || '',
        topicId: data.topicId || null,
        cefrLevel: (data.cefrLevel as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2') || null,
        sourceLanguage: data.sourceLanguage || '',
        targetLanguage: data.targetLanguage || '',
        tags: data.tags || [],
        coverImageUrl: data.coverImageUrl || null,
        visibility: data.visibility,
      };

      await onSubmit(transformedData);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to save deck. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          {isEditing ? 'Edit Deck' : 'Create New Deck'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Error Display */}
            {error && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            {/* Basic Info Fields */}
            <DeckBasicInfoFields form={form} loading={loading} />

            {/* Language Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DeckLanguageFields form={form} loading={loading} />
            </div>

            {/* Tags Field */}
            <DeckTagsField form={form} loading={loading} />

            {/* Visibility Field */}
            <DeckVisibilityField form={form} loading={loading} />

            {/* Cover Image Field */}
            <DeckImageField form={form} loading={loading} />

            {/* Form Actions */}
            <DeckFormActions
              isEditing={isEditing}
              loading={loading}
              isDirty={isDirty}
              isValid={isValid}
              onCancel={onCancel}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
