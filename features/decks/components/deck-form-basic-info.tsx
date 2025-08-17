'use client';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import type { DeckFormInput } from '../schemas/deck-form-schema';

interface DeckBasicInfoFieldsProps {
  form: UseFormReturn<DeckFormInput>;
  loading?: boolean;
}

export function DeckBasicInfoFields({ form, loading = false }: DeckBasicInfoFieldsProps) {
  return (
    <>
      {/* Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter deck title" 
                disabled={loading}
                {...field} 
              />
            </FormControl>
            <FormDescription>
              A clear, descriptive title for your deck
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe what this deck is about..."
                rows={3}
                disabled={loading}
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Optional description to help others understand your deck
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
