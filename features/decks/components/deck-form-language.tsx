'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import type { DeckFormInput } from '../schemas/deck-form-schema';
import { LANGUAGE_OPTIONS, CEFR_LEVEL_OPTIONS } from '../schemas/deck-form-schema';

interface DeckLanguageFieldsProps {
  form: UseFormReturn<DeckFormInput>;
  loading?: boolean;
}

export function DeckLanguageFields({ form, loading = false }: DeckLanguageFieldsProps) {
  return (
    <>
      {/* Source Language */}
      <FormField
        control={form.control}
        name="sourceLanguage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Source Language</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select source language" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The language you're learning from
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Target Language */}
      <FormField
        control={form.control}
        name="targetLanguage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Language</FormLabel>
            <Select onValueChange={field.onChange} value={field.value} disabled={loading}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select target language" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {LANGUAGE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The language you're learning to
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* CEFR Level */}
      <FormField
        control={form.control}
        name="cefrLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CEFR Level</FormLabel>
            <Select 
              onValueChange={(value) => field.onChange(value === '__none__' ? null : value)} 
              value={field.value || '__none__'} 
              disabled={loading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="__none__">No specific level</SelectItem>
                {CEFR_LEVEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Optional CEFR difficulty level for language learners
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
