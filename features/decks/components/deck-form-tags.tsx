'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { X, Plus } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import type { DeckFormInput } from '../schemas/deck-form-schema';

interface DeckTagsFieldProps {
  form: UseFormReturn<DeckFormInput>;
  loading?: boolean;
}

export function DeckTagsField({ form, loading = false }: DeckTagsFieldProps) {
  const [tagInput, setTagInput] = useState('');
  const { watch, setValue } = form;
  const watchedTags = watch('tags') || [];

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;

    const currentTags = watchedTags || [];
    if (currentTags.includes(trimmedTag)) {
      setTagInput('');
      return;
    }

    setValue('tags', [...currentTags, trimmedTag], { shouldValidate: true });
    setTagInput('');
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = watchedTags || [];
    setValue('tags', currentTags.filter(tag => tag !== tagToRemove), { shouldValidate: true });
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tags</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  disabled={loading}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={addTag}
                  disabled={loading || !tagInput.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Display current tags */}
              {watchedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedTags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive"
                        disabled={loading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
          <FormDescription>
            Add tags to help categorize your deck (press Enter to add)
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
