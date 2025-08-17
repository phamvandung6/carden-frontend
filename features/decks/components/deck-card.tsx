'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Share,
  Download,
  Eye,
  EyeOff,
  Globe,
  Calendar,
  BookOpen,
  Users,
  Heart,
  Play,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

import type { Deck } from '../types';
import { 
  formatCardCount, 
  formatVisibility, 
  getVisibilityBadgeColor, 
  formatCefrLevel, 
  getCefrLevelColor, 
  formatRelativeTime,
  isDeckEditable,
  isDeckDeletable 
} from '../utils/deck-utils';

interface DeckCardProps {
  deck: Deck;
  currentUserId?: number;
  onEdit?: (deck: Deck) => void;
  onDelete?: (deckId: number) => void;
  onDuplicate?: (deck: Deck) => void;
  onShare?: (deck: Deck) => void;
  onDownload?: (deck: Deck) => void;
  showActions?: boolean;
  showStats?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
  href?: string;
}

export function DeckCard({
  deck,
  currentUserId,
  onEdit,
  onDelete,
  onDuplicate,
  onShare,
  onDownload,
  showActions = true,
  showStats = true,
  variant = 'default',
  className,
  href,
}: DeckCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  
  const isOwner = isDeckEditable(deck, currentUserId);
  const canDelete = isDeckDeletable(deck, currentUserId);
  const cardHref = href || `/decks/${deck.id}`;

  const getVisibilityIcon = (visibility: Deck['visibility']) => {
    switch (visibility) {
      case 'PUBLIC':
        return <Globe className="h-3 w-3" />;
      case 'UNLISTED':
        return <EyeOff className="h-3 w-3" />;
      case 'PRIVATE':
      default:
        return <Eye className="h-3 w-3" />;
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(deck);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(deck.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDuplicate?.(deck);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(deck);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDownload?.(deck);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    // TODO: Implement like functionality
  };

  // Compact variant for smaller spaces
  if (variant === 'compact') {
    return (
      <Card className={cn('hover:shadow-md transition-shadow cursor-pointer', className)}>
        <Link href={cardHref} className="block">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {/* Thumbnail */}
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {deck.coverImageUrl ? (
                  <img
                    src={deck.coverImageUrl}
                    alt={deck.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{deck.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatCardCount(deck.cardCount)}
                  </span>
                  {deck.cefrLevel && (
                    <Badge variant="secondary" className={cn('text-xs', getCefrLevelColor(deck.cefrLevel))}>
                      {formatCefrLevel(deck.cefrLevel)}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Actions */}
              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEdit} disabled={!isOwner}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDuplicate}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShare}>
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} disabled={!canDelete} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  // Detailed variant with more information
  if (variant === 'detailed') {
    return (
      <Card className={cn('hover:shadow-lg transition-all duration-200 cursor-pointer', className)}>
        <Link href={cardHref} className="block">
          {/* Thumbnail */}
          <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
            {deck.coverImageUrl ? (
              <img
                src={deck.coverImageUrl}
                alt={deck.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg leading-tight truncate">{deck.title}</h3>
                {deck.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {deck.description}
                  </p>
                )}
              </div>

              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEdit} disabled={!isOwner}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDuplicate}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShare}>
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    {deck.visibility === 'PUBLIC' && (
                      <DropdownMenuItem onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDelete} disabled={!canDelete} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Tags */}
            {deck.tags && deck.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {deck.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {deck.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{deck.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </CardHeader>

          <CardContent className="pt-0">
            {/* Metadata */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{formatCardCount(deck.cardCount)}</span>
                  </div>
                  {deck.cefrLevel && (
                    <Badge className={getCefrLevelColor(deck.cefrLevel)}>
                      {formatCefrLevel(deck.cefrLevel)}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  {getVisibilityIcon(deck.visibility)}
                  <Badge variant="outline" className={getVisibilityBadgeColor(deck.visibility)}>
                    {formatVisibility(deck.visibility)}
                  </Badge>
                </div>
              </div>

              {/* Languages */}
              {(deck.sourceLanguage || deck.targetLanguage) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{deck.sourceLanguage || 'Source'}</span>
                  <span>→</span>
                  <span>{deck.targetLanguage || 'Target'}</span>
                </div>
              )}
            </div>
          </CardContent>

          {showStats && (
            <CardFooter className="pt-0">
              <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  {deck.downloadCount > 0 && (
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{deck.downloadCount}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Heart className={cn('h-4 w-4', isLiked && 'fill-red-500 text-red-500')} />
                    <span>{deck.likeCount + (isLiked ? 1 : 0)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatRelativeTime(deck.updatedAt)}</span>
                </div>
              </div>
            </CardFooter>
          )}
        </Link>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn('hover:shadow-md transition-shadow cursor-pointer group', className)}>
      <Link href={cardHref} className="block">
        {/* Thumbnail */}
        <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted relative">
          {deck.coverImageUrl ? (
            <img
              src={deck.coverImageUrl}
              alt={deck.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          
          {/* Quick action overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" variant="secondary" className="shadow-lg">
                    <Play className="h-4 w-4 mr-2" />
                    Study
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Start studying this deck</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Visibility badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className={cn('text-xs', getVisibilityBadgeColor(deck.visibility))}>
              {getVisibilityIcon(deck.visibility)}
              <span className="ml-1">{formatVisibility(deck.visibility)}</span>
            </Badge>
          </div>

          {/* Actions menu */}
          {showActions && (
            <div className="absolute top-2 right-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit} disabled={!isOwner}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDuplicate}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare}>
                    <Share className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  {deck.visibility === 'PUBLIC' && (
                    <DropdownMenuItem onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDelete} disabled={!canDelete} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight truncate">{deck.title}</h3>
            {deck.cefrLevel && (
              <Badge className={getCefrLevelColor(deck.cefrLevel)}>
                {formatCefrLevel(deck.cefrLevel)}
              </Badge>
            )}
          </div>
          
          {deck.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {deck.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          {/* Tags */}
          {deck.tags && deck.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {deck.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {deck.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{deck.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{formatCardCount(deck.cardCount)}</span>
            </div>
            
            {showStats && (
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleLike}
                  className="flex items-center gap-1 hover:text-red-500 transition-colors"
                >
                  <Heart className={cn('h-4 w-4', isLiked && 'fill-red-500 text-red-500')} />
                  <span>{deck.likeCount + (isLiked ? 1 : 0)}</span>
                </button>
                
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatRelativeTime(deck.updatedAt)}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
