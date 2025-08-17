'use client';

import React from 'react';
import { CardGridItem } from './card-grid-item';
import type { Card as CardType } from '../../types';

interface CardGridProps {
  cards: CardType[];
  onPreview: (card: CardType) => void;
  onEdit: (card: CardType) => void;
  onDelete: (card: CardType) => void;
}

export function CardGrid({ cards, onPreview, onEdit, onDelete }: CardGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <CardGridItem
          key={card.id}
          card={card}
          onPreview={onPreview}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
