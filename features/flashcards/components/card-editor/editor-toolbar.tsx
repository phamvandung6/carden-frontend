'use client';

import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Volume2,
  Eye,
  EyeOff,
  Undo,
  Redo,
  Type
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const ToolbarButton = ({ icon, tooltip, active, onClick, disabled }: ToolbarButtonProps) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant={active ? "default" : "outline"}
        size="sm"
        onClick={onClick}
        disabled={disabled}
        className="h-8 w-8 p-0"
      >
        {icon}
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

interface EditorToolbarProps {
  onCommand: (command: string, value?: string) => void;
  onTogglePreview?: () => void;
  showPreview?: boolean;
  readOnly?: boolean;
  onInsertLink?: () => void;
}

export function EditorToolbar({
  onCommand,
  onTogglePreview,
  showPreview,
  readOnly = false,
  onInsertLink
}: EditorToolbarProps) {
  return (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
      {/* Formatting */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={<Bold className="w-4 h-4" />}
          tooltip="Bold (Ctrl+B)"
          onClick={() => onCommand('bold')}
          disabled={readOnly}
        />
        <ToolbarButton
          icon={<Italic className="w-4 h-4" />}
          tooltip="Italic (Ctrl+I)"
          onClick={() => onCommand('italic')}
          disabled={readOnly}
        />
        <ToolbarButton
          icon={<Underline className="w-4 h-4" />}
          tooltip="Underline (Ctrl+U)"
          onClick={() => onCommand('underline')}
          disabled={readOnly}
        />
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={<List className="w-4 h-4" />}
          tooltip="Bullet List"
          onClick={() => onCommand('insertUnorderedList')}
          disabled={readOnly}
        />
        <ToolbarButton
          icon={<ListOrdered className="w-4 h-4" />}
          tooltip="Numbered List"
          onClick={() => onCommand('insertOrderedList')}
          disabled={readOnly}
        />
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Links and Media */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={<Link className="w-4 h-4" />}
          tooltip="Insert Link"
          onClick={onInsertLink || (() => {})}
          disabled={readOnly}
        />
        
        {/* Image upload disabled temporarily */}
        {/* Image upload button would go here */}
      </div>

      <div className="w-px h-6 bg-border" />

      {/* History */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={<Undo className="w-4 h-4" />}
          tooltip="Undo (Ctrl+Z)"
          onClick={() => onCommand('undo')}
          disabled={readOnly}
        />
        <ToolbarButton
          icon={<Redo className="w-4 h-4" />}
          tooltip="Redo (Ctrl+Y)"
          onClick={() => onCommand('redo')}
          disabled={readOnly}
        />
      </div>

      {/* Preview Toggle */}
      <div className="ml-auto flex items-center gap-2">
        {onTogglePreview && (
          <ToolbarButton
            icon={showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            tooltip={showPreview ? 'Hide Preview' : 'Show Preview'}
            onClick={onTogglePreview}
            active={showPreview}
          />
        )}
      </div>
    </div>
  );
}
