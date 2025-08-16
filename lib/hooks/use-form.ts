'use client';

import { useForm as useReactHookForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// Simple form hook with Zod integration - focused on auth use cases
export function useForm<TData extends Record<string, unknown>>(
  schema: z.ZodSchema<TData>,
  options?: Omit<UseFormProps<TData>, 'resolver'>
): UseFormReturn<TData> {
  return useReactHookForm<TData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    ...options,
  });
}

// Form submission wrapper with error handling
export function useFormSubmission<TData, TResult = unknown>({
  onSubmit,
  onSuccess,
  onError,
  successMessage,
  loadingMessage,
}: {
  onSubmit: (data: TData) => Promise<TResult>;
  onSuccess?: (result: TResult) => void;
  onError?: (error: unknown) => void;
  successMessage?: string;
  loadingMessage?: string;
}) {
  const handleSubmit = async (data: TData) => {
    const toastId = loadingMessage ? toast.loading(loadingMessage) : undefined;
    
    try {
      const result = await onSubmit(data);
      
      if (toastId) toast.dismiss(toastId);
      
      if (successMessage) {
        toast.success(successMessage);
      }
      
      onSuccess?.(result);
      return result;
    } catch (error) {
      if (toastId) toast.dismiss(toastId);
      
      // Handle different error types
      if (error instanceof z.ZodError) {
        toast.error('Validation failed', {
          description: error.errors.map(e => e.message).join(', ')
        });
      } else if (error instanceof Error) {
        toast.error('Error', {
          description: error.message
        });
      } else {
        toast.error('Something went wrong', {
          description: 'Please try again later'
        });
      }
      
      onError?.(error);
      throw error;
    }
  };

  return { handleSubmit };
}
