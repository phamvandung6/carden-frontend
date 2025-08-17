'use client';

import React from 'react';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Card as CardType } from '../../types';

interface CardGridItemProps {
  card: CardType;
  onPreview: (card: CardType) => void;
  onEdit: (card: CardType) => void;
  onDelete: (card: CardType) => void;
}

export function CardGridItem({ card, onPreview, onEdit, onDelete }: CardGridItemProps) {
  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'default';
      case 'NORMAL':
        return 'secondary';
      case 'HARD':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-all cursor-pointer group" 
      onClick={() => onPreview(card)}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-primary">#{card.displayOrder}</span>
              <Badge 
                variant={getDifficultyVariant(card.difficulty)}
                className="text-xs"
              >
                {card.difficulty}
              </Badge>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { 
                  e.stopPropagation(); 
                  onEdit(card); 
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onDelete(card); 
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Card Content Preview */}
          <div className="min-h-24 text-center">
            <div className="text-xs text-muted-foreground mb-1">Front</div>
            <div 
              className="text-sm font-medium line-clamp-3 prose prose-sm max-w-none [&>*]:my-0"
              dangerouslySetInnerHTML={{ 
                __html: card.front.length > 60 ? 
                  card.front.substring(0, 60) + '...' : 
                  card.front 
              }}
            />
          </div>

          {/* Tags */}
          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-center">
              {card.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag.length > 10 ? tag.substring(0, 10) + '...' : tag}
                </Badge>
              ))}
              {card.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{card.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* IPA */}
          {card.ipaPronunciation && (
            <div className="text-center">
              <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
                {card.ipaPronunciation.length > 15 ? 
                  card.ipaPronunciation.substring(0, 15) + '...' : 
                  card.ipaPronunciation
                }
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
