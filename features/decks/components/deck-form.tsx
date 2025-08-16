'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X, Plus, Loader2, Save, Eye, EyeOff, Globe } from 'lucide-react';
import { toast } from 'sonner';

import type { Deck, DeckFormData } from '../types';
import { deckFormSchema, type DeckFormInput, LANGUAGE_OPTIONS, VISIBILITY_OPTIONS, CEFR_LEVEL_OPTIONS } from '../schemas/deck-form-schema';
import { deckToFormData, formDataToCreateRequest, formDataToUpdateRequest, getDefaultDeckFormData } from '../utils/deck-utils';
import { ImageUpload } from './image-upload';

interface DeckFormProps {
  deck?: Deck;
  onSubmit: (data: DeckFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  error?: string | null;
}

export function DeckForm({ deck, onSubmit, onCancel, loading = false, error }: DeckFormProps) {
  const [tagInput, setTagInput] = useState('');
  const isEditing = !!deck;

  const form = useForm<DeckFormInput>({
    resolver: zodResolver(deckFormSchema),
    defaultValues: deck ? deckToFormData(deck) : getDefaultDeckFormData(),
    mode: 'onChange',
  });

  const { watch, setValue, handleSubmit, formState: { errors, isDirty, isValid } } = form;
  const watchedTags = watch('tags') || [];
  const watchedVisibility = watch('visibility');

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
  }, [deck, setValue, form.reset]);

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

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (!trimmedTag) return;

    const currentTags = watchedTags || [];
    if (currentTags.includes(trimmedTag)) {
      toast.error('Tag already exists');
      return;
    }

    if (currentTags.length >= 10) {
      toast.error('Maximum 10 tags allowed');
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

            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter deck title..."
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    A clear, descriptive title for your deck (max 200 characters)
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
                      placeholder="Describe what this deck covers..."
                      rows={3}
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description to help others understand the content (max 1000 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Language Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* CEFR Level */}
            <FormField
              control={form.control}
              name="cefrLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEFR Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''} disabled={loading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">No specific level</SelectItem>
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

            {/* Tags */}
            <div className="space-y-3">
              <Label>Tags</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                  disabled={loading || !tagInput.trim() || watchedTags.length >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {watchedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        disabled={loading}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
              
              <p className="text-sm text-muted-foreground">
                Add tags to help organize and search your deck (max 10 tags)
              </p>
            </div>

            {/* Visibility Settings */}
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
                      disabled={loading}
                      className="space-y-2"
                    >
                      {VISIBILITY_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="flex items-center gap-2 cursor-pointer">
                            {getVisibilityIcon(option.value)}
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-sm text-muted-foreground">{option.description}</div>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cover Image Upload */}
            <FormField
              control={form.control}
              name="coverImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(file) => {
                        if (file) {
                          // For now, just set a preview URL
                          // In actual implementation, this would trigger upload
                          const previewUrl = URL.createObjectURL(file);
                          field.onChange(previewUrl);
                        } else {
                          field.onChange(null);
                        }
                      }}
                      disabled={loading}
                      variant="compact"
                      className="w-full"
                    />
                  </FormControl>
                  <FormDescription>
                    Optional cover image for your deck (max 5MB)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
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
                disabled={loading || !isValid || (!isDirty && !isEditing)}
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
