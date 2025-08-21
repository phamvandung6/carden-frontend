'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCardOperations, useCardsByDeck } from '../../hooks/use-cards';
import type { Card as CardType } from '../../types';
import { CardForm } from '../card-form';
import { CardPreview } from '../card-preview';
import { CardListToolbar } from './card-list-toolbar';
import { CardGrid } from './card-grid';
import { CardListEmpty } from './card-list-empty';
import { CardListPagination } from './card-list-pagination';

interface CardListProps {
  deckId: number;
  deckTitle?: string;
  onStudy?: () => void;
}

export function CardList({ deckId, deckTitle, onStudy }: CardListProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [previewCard, setPreviewCard] = useState<CardType | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const { 
    data: cardsResponse, 
    isLoading, 
    error 
  } = useCardsByDeck(deckId, {
    page: currentPage,
    size: 12
  });

  const { deleteCard } = useCardOperations();

  const cards = cardsResponse?.content || [];
  const pagination = cardsResponse?.page;

  const handleDeleteCard = async (card: CardType) => {
    if (confirm(`Are you sure you want to delete this card?`)) {
      try {
        await deleteCard.mutateAsync(card.id);
        toast.success('Card deleted successfully');
      } catch (error) {
        console.error('Failed to delete card:', error);
        toast.error('Failed to delete card');
      }
    }
  };

  const handleCreateSuccess = (newCard: CardType) => {
    setShowCreateForm(false);
    toast.success('Card created successfully');
  };

  const handleEditSuccess = (updatedCard: CardType) => {
    setEditingCard(null);
    toast.success('Card updated successfully');
  };



  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <CardListToolbar
          searchQuery=""
          onSearchChange={() => {}}
          onCreateCard={() => setShowCreateForm(true)}
          deckId={deckId}
          deckTitle={deckTitle}
          onStudy={onStudy}
        />
        
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-muted rounded-lg h-48"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load cards: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CardListToolbar
        searchQuery=""
        onSearchChange={() => {}}
        onCreateCard={() => setShowCreateForm(true)}
        deckId={deckId}
        deckTitle={deckTitle}
        onStudy={onStudy}
      />

      {cards.length === 0 ? (
        <CardListEmpty
          deckTitle={deckTitle}
          onCreateCard={() => setShowCreateForm(true)}
          isSearching={false}
          searchQuery=""
          deckId={deckId}
          onStudy={onStudy}
        />
      ) : (
        <>
          <CardGrid
            cards={cards}
            onPreview={setPreviewCard}
            onEdit={setEditingCard}
            onDelete={handleDeleteCard}
          />

          {pagination && pagination.totalPages > 1 && (
            <CardListPagination
              pagination={{
                currentPage: pagination.number,
                totalPages: pagination.totalPages,
                totalElements: pagination.totalElements,
                size: pagination.size
              }}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      {/* Create Card Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Card</DialogTitle>
            <DialogDescription>
              Create a new flashcard for this deck. Fill in the front and back content, then add optional details like pronunciation, examples, and tags.
            </DialogDescription>
          </DialogHeader>
          
          <CardForm
            mode="create"
            deckId={deckId}
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Card Dialog */}
      <Dialog open={!!editingCard} onOpenChange={() => setEditingCard(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
            <DialogDescription>
              Modify the content and details of this flashcard. Changes will be saved automatically when you submit the form.
            </DialogDescription>
          </DialogHeader>
          
          {editingCard && (
            <CardForm
              mode="edit"
              card={editingCard}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingCard(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Preview Card Dialog */}
      <Dialog open={!!previewCard} onOpenChange={() => setPreviewCard(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Card Preview</DialogTitle>
            <DialogDescription>
              Preview this flashcard content. Click on the card to flip between front and back sides.
            </DialogDescription>
          </DialogHeader>
          
          {previewCard && (
            <CardPreview
              card={previewCard}
              showMetadata={true}
              className="mt-4"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
