'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { CardFormState } from '../../types';
import { EditorToolbar } from './editor-toolbar';
import { RichTextEditor } from './rich-text-editor';
import { LinkDialog } from './link-dialog';

interface CardEditorProps {
  /** Current form state */
  formState: CardFormState;
  /** Callback when form state changes */
  onChange: (field: keyof CardFormState, value: any) => void;
  /** Whether to show live preview */
  showPreview?: boolean;
  /** Callback to toggle preview */
  onTogglePreview?: () => void;
  /** Whether editor is in read-only mode */
  readOnly?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Card ID for image upload (when editing existing card) */
  cardId?: number;
}

export function CardEditor({
  formState,
  onChange,
  showPreview = false,
  onTogglePreview,
  readOnly = false,
  className,
  cardId
}: CardEditorProps) {
  
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [currentEditor, setCurrentEditor] = useState<'front' | 'back'>('front');

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const handleInsertLink = (url: string, text?: string) => {
    const linkText = text || url;
    const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
    execCommand('insertHTML', linkHtml);
  };

  return (
    <TooltipProvider>
      <Card className={cn('w-full', className)}>
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Card Editor</span>
              {!readOnly && (
                <Badge variant="outline" className="text-xs">
                  Editing
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Front Side */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Front Side</label>
              <Badge variant="secondary" className="text-xs">Required</Badge>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <EditorToolbar
                onCommand={execCommand}
                onTogglePreview={onTogglePreview}
                showPreview={showPreview}
                readOnly={readOnly}
                onInsertLink={() => {
                  setCurrentEditor('front');
                  setLinkDialogOpen(true);
                }}
              />
              
              <RichTextEditor
                content={formState.front}
                onChange={(content) => onChange('front', content)}
                placeholder="Enter the front side content..."
                readOnly={readOnly}
                className="border-0 rounded-none"
              />
            </div>
          </div>

          {/* Back Side */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Back Side</label>
              <Badge variant="secondary" className="text-xs">Required</Badge>
            </div>
            
            <div className="border rounded-md overflow-hidden">
              <EditorToolbar
                onCommand={execCommand}
                readOnly={readOnly}
                onInsertLink={() => {
                  setCurrentEditor('back');
                  setLinkDialogOpen(true);
                }}
              />
              
              <RichTextEditor
                content={formState.back}
                onChange={(content) => onChange('back', content)}
                placeholder="Enter the back side content..."
                readOnly={readOnly}
                className="border-0 rounded-none"
              />
            </div>
          </div>

          {/* Link Dialog */}
          <LinkDialog
            open={linkDialogOpen}
            onOpenChange={setLinkDialogOpen}
            onInsertLink={handleInsertLink}
          />
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
