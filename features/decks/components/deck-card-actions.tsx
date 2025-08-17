'use client';

import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Share,
  Download,
  Eye,
  EyeOff,
  Settings
} from 'lucide-react';

import type { Deck } from '../types';
import { isDeckEditable, isDeckDeletable } from '../utils/deck-utils';

interface DeckCardActionsProps {
  deck: Deck;
  currentUserId?: number;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deckId: number) => void;
  onDuplicate?: (deck: Deck) => void;
  onShare?: (deck: Deck) => void;
  onDownload?: (deck: Deck) => void;
  className?: string;
}

export function DeckCardActions({
  deck,
  currentUserId,
  onEdit,
  onDelete,
  onDuplicate,
  onShare,
  onDownload,
  className
}: DeckCardActionsProps) {
  const canEdit = isDeckEditable(deck, currentUserId);
  const canDelete = isDeckDeletable(deck, currentUserId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 ${className}`}>
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onShare?.(deck)}>
          <Share className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDuplicate?.(deck)}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownload?.(deck)}>
          <Download className="mr-2 h-4 w-4" />
          Download
        </DropdownMenuItem>
        
        {canEdit && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit?.(deck)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </>
        )}
        
        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete?.(deck.id)} 
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {deck.visibility === 'PUBLIC' ? (
            <>
              <EyeOff className="mr-2 h-4 w-4" />
              Make Private
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Make Public
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
