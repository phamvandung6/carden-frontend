'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff, Globe } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import type { DeckFormInput } from '../schemas/deck-form-schema';
import { VISIBILITY_OPTIONS } from '../schemas/deck-form-schema';

interface DeckVisibilityFieldProps {
  form: UseFormReturn<DeckFormInput>;
  loading?: boolean;
}

export function DeckVisibilityField({ form, loading = false }: DeckVisibilityFieldProps) {
  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return <Globe className="h-4 w-4" />;
      case 'UNLISTED':
        return <EyeOff className="h-4 w-4" />;
      case 'PRIVATE':
      default:
        return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <FormField
      control={form.control}
      name="visibility"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Visibility</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className="flex flex-col space-y-1"
              disabled={loading}
            >
              {VISIBILITY_OPTIONS.map((option) => (
                <FormItem 
                  key={option.value} 
                  className="flex items-center space-x-3 space-y-0 rounded-md border p-4"
                >
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <div className="flex items-center space-x-2">
                    {getVisibilityIcon(option.value)}
                    <div className="space-y-1 leading-none">
                      <FormLabel className="font-normal">
                        {option.label}
                      </FormLabel>
                      <FormDescription className="text-xs">
                        {option.description}
                      </FormDescription>
                    </div>
                  </div>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
