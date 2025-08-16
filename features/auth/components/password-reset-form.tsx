'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm, useFormSubmission } from '@/lib/hooks/use-form';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth';
import { authApi } from '@/features/auth';

export function PasswordResetForm() {
  const form = useForm(forgotPasswordSchema, {
    defaultValues: {
      email: '',
    },
  });

  const { handleSubmit } = useFormSubmission<ForgotPasswordFormData>({
    onSubmit: async (data) => {
      const response = await authApi.forgotPassword(data.email);
      return response;
    },
    onSuccess: () => {
      form.reset();
    },
    successMessage: 'Password reset link sent to your email!',
    loadingMessage: 'Sending reset link...',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your email address"
                  type="email"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>
    </Form>
  );
}
