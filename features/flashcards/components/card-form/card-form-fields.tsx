'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Volume2, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { CardFormData, CardDifficulty } from '../../schemas/card-form-schema';

interface CardFormFieldsProps {
  register: UseFormRegister<CardFormData>;
  errors: FieldErrors<CardFormData>;
  watchedValues: {
    front: string;
    back: string;
  };
  onDifficultyChange: (value: CardDifficulty) => void;
}

export function CardFormFields({
  register,
  errors,
  watchedValues,
  onDifficultyChange
}: CardFormFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Main Content Fields */}
      <div className="grid grid-cols-1 gap-4">
        {/* Front */}
        <div className="space-y-2">
          <Label htmlFor="front">
            Front <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="front"
            {...register('front')}
            placeholder="Enter the front side content..."
            className="min-h-20"
            maxLength={500}
          />
          {errors.front && (
            <p className="text-sm text-destructive">{errors.front.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {watchedValues.front.length}/500 characters
          </p>
        </div>

        {/* Back */}
        <div className="space-y-2">
          <Label htmlFor="back">
            Back <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="back"
            {...register('back')}
            placeholder="Enter the back side content..."
            className="min-h-20"
            maxLength={500}
          />
          {errors.back && (
            <p className="text-sm text-destructive">{errors.back.message}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {watchedValues.back.length}/500 characters
          </p>
        </div>
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* IPA Pronunciation */}
        <div className="space-y-2">
          <Label htmlFor="ipaPronunciation" className="flex items-center gap-1">
            IPA Pronunciation
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="inline-flex items-center">
                  <Info className="w-3 h-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>International Phonetic Alphabet pronunciation</p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <Input
            id="ipaPronunciation"
            {...register('ipaPronunciation')}
            placeholder="/həˈloʊ/"
            maxLength={200}
          />
          {errors.ipaPronunciation && (
            <p className="text-sm text-destructive">{errors.ipaPronunciation.message}</p>
          )}
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select onValueChange={onDifficultyChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EASY">Easy</SelectItem>
              <SelectItem value="NORMAL">Normal</SelectItem>
              <SelectItem value="HARD">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Audio URL */}
      <div className="space-y-2">
        <Label htmlFor="audioUrl" className="flex items-center gap-1">
          <Volume2 className="w-4 h-4" />
          Audio URL
        </Label>
        <Input
          id="audioUrl"
          {...register('audioUrl')}
          placeholder="https://example.com/audio.mp3"
          maxLength={500}
        />
        {errors.audioUrl && (
          <p className="text-sm text-destructive">{errors.audioUrl.message}</p>
        )}
      </div>
    </div>
  );
}
