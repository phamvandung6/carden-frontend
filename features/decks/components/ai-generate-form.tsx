'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Sparkles, Loader2, AlertCircle, CheckCircle, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

import { useAiGenerateCards } from '../hooks/use-decks';
import { useAiGenerationState } from '../stores/decks-store';
import type { AiGenerateCardsRequest } from '../types';

// Form validation schema
const aiGenerateSchema = z.object({
  topic: z
    .string()
    .min(3, 'Topic must be at least 3 characters')
    .max(200, 'Topic must not exceed 200 characters')
    .trim(),
  count: z
    .number()
    .int()
    .min(1, 'Must generate at least 1 card')
    .max(15, 'Cannot generate more than 15 cards at once')
    .default(10),
});

type AiGenerateFormData = z.infer<typeof aiGenerateSchema>;

interface AiGenerateFormProps {
  deckId: number;
  deckTitle?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function AiGenerateForm({ 
  deckId, 
  deckTitle, 
  onSuccess, 
  onCancel,
  className 
}: AiGenerateFormProps) {
  const aiGenerate = useAiGenerateCards();
  const aiState = useAiGenerationState();
  
  const form = useForm<AiGenerateFormData>({
    resolver: zodResolver(aiGenerateSchema),
    defaultValues: {
      topic: '',
      count: 10,
    },
  });

  const onSubmit = async (data: AiGenerateFormData) => {
    try {
      await aiGenerate.mutateAsync({
        deckId,
        data: {
          topic: data.topic,
          count: data.count,
        },
      });
      
      // Call success callback if provided
      onSuccess?.();
      
      // Reset form after successful generation
      form.reset();
    } catch (error) {
      // Error is handled by the hook
      console.error('AI generation failed:', error);
    }
  };

  const isGenerating = aiState.isGenerating;
  const hasError = !!aiState.error;
  const lastResult = aiState.lastResult;

  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Card Generator</CardTitle>
              <CardDescription>
                Generate flashcards automatically using AI
                {deckTitle && (
                  <span className="block text-xs text-muted-foreground mt-1">
                    for "{deckTitle}"
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Generation Progress */}
          {isGenerating && (
            <Alert>
              <Loader2 className="w-4 h-4 animate-spin" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Generating cards with AI...</span>
                    <span>{aiState.progress}%</span>
                  </div>
                  <Progress value={aiState.progress} className="w-full" />
                  <p className="text-xs text-muted-foreground">
                    This may take up to 30 seconds. You can continue using the app while we generate your cards.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Error State */}
          {hasError && (
            <Alert variant={aiState.error?.includes('Network error') ? "default" : "destructive"}>
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>
                <strong>
                  {aiState.error?.includes('Network error') ? 'Connection Issue:' : 'Generation Failed:'}
                </strong> {aiState.error}
              </AlertDescription>
            </Alert>
          )}

          {/* Success State */}
          {lastResult && !isGenerating && !hasError && (
            <Alert>
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium text-green-800">
                    Successfully generated {lastResult.totalSaved} cards!
                  </div>
                  <div className="flex flex-wrap gap-1 text-xs">
                    <Badge variant="secondary">
                      Topic: {lastResult.summary.topic}
                    </Badge>
                    <Badge variant="secondary">
                      Time: {Math.round(lastResult.processingTimeMs / 1000)}s
                    </Badge>
                    {lastResult.summary.duplicatesSkipped > 0 && (
                      <Badge variant="outline">
                        {lastResult.summary.duplicatesSkipped} duplicates skipped
                      </Badge>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Generation Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., food and cooking, business English, travel phrases"
                        disabled={isGenerating}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Describe what kind of flashcards you want to generate (max 200 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Cards</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value, 10))}
                      disabled={isGenerating}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of cards" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} card{num !== 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose how many cards to generate (1-15)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Info Alert */}
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  <strong>Note:</strong> AI generation runs in the background. 
                  You can continue using the app while cards are being created.
                  We'll notify you when it's complete.
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  type="submit" 
                  disabled={isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Cards
                    </>
                  )}
                </Button>
                
                {onCancel && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onCancel}
                    disabled={isGenerating}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AiGenerateForm;
