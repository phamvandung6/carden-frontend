'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Globe, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { DeckListContainer } from '@/features/decks';
import { PageHeader } from '@/components/ui/page-header';

export default function DecksPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('my-decks');

  // Mock current user ID - replace with actual auth
  const currentUserId = 1;

  const handleCreateDeck = () => {
    router.push('/dashboard/decks/create');
  };

  const handleEditDeck = (deck: { id: number }) => {
    router.push(`/dashboard/decks/${deck.id}/edit`);
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

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Decks</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cards</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">284</div>
            <p className="text-xs text-muted-foreground">
              +25 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground">
              Keep it up!
            </p>
          </CardContent>
        </Card>
      </div>

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
