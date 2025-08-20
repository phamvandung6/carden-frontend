'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { AiGenerateForm } from './ai-generate-form';

interface AiGenerateDialogProps {
  deckId: number;
  deckTitle?: string;
  children?: React.ReactNode;
  triggerClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function AiGenerateDialog({ 
  deckId, 
  deckTitle, 
  children,
  triggerClassName,
  size = 'md'
}: AiGenerateDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    // Keep dialog open so user can see the success message
    // It will auto-close after a few seconds or user can close manually
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const maxWidthClass = {
    sm: 'sm:max-w-md',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl'
  }[size];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button 
            variant="outline" 
            className={triggerClassName}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate with AI
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className={`${maxWidthClass} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            AI Card Generator
          </DialogTitle>
          <DialogDescription>
            Generate flashcards automatically using AI
            {deckTitle && (
              <>
                {' '}for "<strong>{deckTitle}</strong>"
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <AiGenerateForm
          deckId={deckId}
          deckTitle={deckTitle}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
          className="border-none shadow-none"
        />
      </DialogContent>
    </Dialog>
  );
}

// Hook for managing dialog state
export function useAiGenerateDialog() {
  const [open, setOpen] = useState(false);

  return {
    open,
    setOpen,
    openDialog: () => setOpen(true),
    closeDialog: () => setOpen(false),
  };
}

export default AiGenerateDialog;
