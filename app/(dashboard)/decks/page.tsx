'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { DeckListContainer } from '@/features/decks';
import { PageHeader } from '@/components/ui/page-header';

export default function DecksPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('my-decks');

  // Mock current user ID - replace with actual auth
  const currentUserId = 1;

  const handleCreateDeck = () => {
    router.push('/decks/create');
  };

  const handleEditDeck = (deck: { id: number }) => {
    router.push(`/decks/${deck.id}/edit`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <PageHeader
        title="My Decks"
        description="Create, manage, and organize your flashcard decks"
        action={
          <Button onClick={handleCreateDeck} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Deck
          </Button>
        }
      />



      {/* Deck Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-96">
          <TabsTrigger value="my-decks" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            My Decks
          </TabsTrigger>
          <TabsTrigger value="public-decks" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Public Decks
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-decks" className="space-y-6">
          <DeckListContainer
            variant="my-decks"
            currentUserId={currentUserId}
            onCreateDeck={handleCreateDeck}
            onEditDeck={handleEditDeck}
            showFilters={true}
            showBulkActions={true}
            initialFilters={{
              visibility: 'ALL',
              sortBy: 'updatedAt',
              sortOrder: 'desc',
            }}
          />
        </TabsContent>

        <TabsContent value="public-decks" className="space-y-6">
          <DeckListContainer
            variant="public-decks"
            currentUserId={currentUserId}
            onCreateDeck={handleCreateDeck}
            onEditDeck={handleEditDeck}
            showFilters={true}
            showBulkActions={false}
            initialFilters={{
              visibility: 'PUBLIC',
              sortBy: 'createdAt',
              sortOrder: 'desc',
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
