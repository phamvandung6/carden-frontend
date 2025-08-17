'use client';

import React from 'react';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CardSideProps {
  title: string;
  content: string;
  audioUrl?: string;
  tags?: string[];
  ipaPronunciation?: string;
  examples?: string[];
  synonyms?: string[];
  antonyms?: string[];
  className?: string;
  isFlipped?: boolean;
}

export function CardSide({
  title,
  content,
  audioUrl,
  tags,
  ipaPronunciation,
  examples,
  synonyms,
  antonyms,
  className,
  isFlipped = false
}: CardSideProps) {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-900 border rounded-lg shadow-sm min-h-64 flex flex-col",
      "transition-all duration-300 hover:shadow-md",
      isFlipped && "scale-y-[-1]",
      className
    )}>
      {/* Header */}
      <div className="px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
          {audioUrl && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation(); // Prevent card flip
                const audio = new Audio(audioUrl);
                audio.play().catch(console.error);
              }}
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 space-y-3 flex flex-col justify-center">
        {/* Main Content */}
        <div className="min-h-16 text-center">
          {content ? (
            <div 
              className="text-sm prose prose-sm max-w-none [&>*]:my-0 [&>*]:text-center"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-muted-foreground text-sm italic">No content</p>
          )}
        </div>

        {/* Image disabled temporarily */}
        {/* Image section would go here */}
      </div>

      {/* Footer with metadata */}
      <div className="px-4 pb-4 space-y-3">
        {/* IPA */}
        {ipaPronunciation && (
          <div className="text-center">
            <span className="text-xs text-muted-foreground font-mono bg-muted/50 px-2 py-1 rounded">
              {ipaPronunciation}
            </span>
          </div>
        )}

        {/* Examples */}
        {examples && examples.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1">Examples:</h4>
            <ul className="text-xs space-y-1">
              {examples.slice(0, 2).map((example, index) => (
                <li key={index} className="text-muted-foreground">• {example}</li>
              ))}
              {examples.length > 2 && (
                <li className="text-muted-foreground">• +{examples.length - 2} more...</li>
              )}
            </ul>
          </div>
        )}

        {/* Synonyms & Antonyms */}
        {((synonyms && synonyms.length > 0) || (antonyms && antonyms.length > 0)) && (
          <div className="grid grid-cols-2 gap-3 text-xs">
            {synonyms && synonyms.length > 0 && (
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">Synonyms:</h4>
                <div className="flex flex-wrap gap-1">
                  {synonyms.slice(0, 3).map((synonym, index) => (
                    <Badge key={index} variant="outline" className="text-xs py-0">
                      {synonym}
                    </Badge>
                  ))}
                  {synonyms.length > 3 && (
                    <Badge variant="outline" className="text-xs py-0">
                      +{synonyms.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {antonyms && antonyms.length > 0 && (
              <div>
                <h4 className="font-medium text-muted-foreground mb-1">Antonyms:</h4>
                <div className="flex flex-wrap gap-1">
                  {antonyms.slice(0, 3).map((antonym, index) => (
                    <Badge key={index} variant="outline" className="text-xs py-0">
                      {antonym}
                    </Badge>
                  ))}
                  {antonyms.length > 3 && (
                    <Badge variant="outline" className="text-xs py-0">
                      +{antonyms.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2 border-t">
            {tags.slice(0, 5).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 5 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 5} more
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
