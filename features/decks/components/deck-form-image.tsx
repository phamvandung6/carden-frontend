'use client';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import type { DeckFormInput } from '../schemas/deck-form-schema';
import { ImageUpload } from './image-upload';

interface DeckImageFieldProps {
  form: UseFormReturn<DeckFormInput>;
  loading?: boolean;
}

export function DeckImageField({ form, loading = false }: DeckImageFieldProps) {
  const handleImageChange = (file: File | null) => {
    if (file) {
      // Create blob URL for preview and store File object in form
      const blobUrl = URL.createObjectURL(file);
      form.setValue('coverImageUrl', blobUrl);
    } else {
      form.setValue('coverImageUrl', null);
    }
  };

  return (
    <FormField
      control={form.control}
      name="coverImageUrl"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Cover Image</FormLabel>
          <FormControl>
            <ImageUpload
              value={typeof field.value === 'string' ? field.value : null}
              onChange={handleImageChange}
              disabled={loading}
              className="w-full"
            />
          </FormControl>
          <FormDescription>
            Upload a cover image for your deck (optional)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
