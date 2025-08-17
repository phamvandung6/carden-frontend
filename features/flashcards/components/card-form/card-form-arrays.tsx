'use client';

import React from 'react';
import { Control, useWatch, useFormContext } from 'react-hook-form';
import { X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CardFormData } from '../../schemas/card-form-schema';

interface ArrayFieldProps {
  label: string;
  placeholder: string;
  maxLength: number;
  values: string[];
  onChange: (values: string[]) => void;
  fieldName: keyof CardFormData;
  control: Control<CardFormData>;
}

function ArrayField({ label, placeholder, maxLength, values, onChange, fieldName, control }: ArrayFieldProps) {
  const addItem = () => {
    onChange([...values, '']);
  };

  const removeItem = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    onChange(newValues);
  };

  const updateItem = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              maxLength={maxLength}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeItem(index)}
              className="shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addItem}
          className="w-full"
          disabled={values.length >= 10}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add {label.slice(0, -1)}
        </Button>
      </div>
    </div>
  );
}

interface CardFormArraysProps {
  control: Control<CardFormData>;
}

export function CardFormArrays({ control }: CardFormArraysProps) {
  const examples = useWatch({ control, name: 'examples' }) || [];
  const tags = useWatch({ control, name: 'tags' }) || [];
  const synonyms = useWatch({ control, name: 'synonyms' }) || [];
  const antonyms = useWatch({ control, name: 'antonyms' }) || [];

  const updateField = (fieldName: keyof CardFormData, values: string[]) => {
    // Direct update through control setValue
    (control as any).setValue(fieldName, values);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ArrayField
        label="Examples"
        placeholder="Add an example sentence..."
        maxLength={200}
        values={examples}
        onChange={(values) => updateField('examples', values)}
        fieldName="examples"
        control={control}
      />
      
      <ArrayField
        label="Tags"
        placeholder="Add a tag..."
        maxLength={50}
        values={tags}
        onChange={(values) => updateField('tags', values)}
        fieldName="tags"
        control={control}
      />

      <ArrayField
        label="Synonyms"
        placeholder="Add a synonym..."
        maxLength={100}
        values={synonyms}
        onChange={(values) => updateField('synonyms', values)}
        fieldName="synonyms"
        control={control}
      />

      <ArrayField
        label="Antonyms"
        placeholder="Add an antonym..."
        maxLength={100}
        values={antonyms}
        onChange={(values) => updateField('antonyms', values)}
        fieldName="antonyms"
        control={control}
      />
    </div>
  );
}