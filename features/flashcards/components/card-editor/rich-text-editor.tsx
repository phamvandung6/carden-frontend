'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  minHeight?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Type here...",
  className,
  readOnly = false,
  minHeight = "120px"
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      onChange(newContent);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'b':
          event.preventDefault();
          document.execCommand('bold');
          break;
        case 'i':
          event.preventDefault();
          document.execCommand('italic');
          break;
        case 'u':
          event.preventDefault();
          document.execCommand('underline');
          break;
        case 'z':
          event.preventDefault();
          if (event.shiftKey) {
            document.execCommand('redo');
          } else {
            document.execCommand('undo');
          }
          break;
        case 'y':
          event.preventDefault();
          document.execCommand('redo');
          break;
      }
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div
      ref={editorRef}
      contentEditable={!readOnly}
      suppressContentEditableWarning={true}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      className={cn(
        "prose prose-sm max-w-none focus:outline-none p-3 border rounded-md",
        "focus:ring-2 focus:ring-ring focus:border-transparent",
        "[&>*]:my-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        readOnly && "bg-muted cursor-default",
        className
      )}
      style={{ minHeight }}
      data-placeholder={placeholder}
    />
  );
}
