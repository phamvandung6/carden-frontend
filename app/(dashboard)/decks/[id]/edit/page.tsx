'use client';

import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { DeckFormPage } from '@/features/decks';
import { useDeckById } from '@/features/decks';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditDeckPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = parseInt(params.id as string);

  const { data: deck, isLoading, error } = useDeckById(deckId);

  const handleBack = () => {
    router.push(`/dashboard/decks/${deckId}`);
  };

  const handleSuccess = () => {
    toast.success('Deck updated successfully!');
    router.push(`/dashboard/decks/${deckId}`);
  };



  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !deck) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <p className="text-destructive mb-4">Failed to load deck</p>
          <Button onClick={() => router.push('/dashboard/decks')} variant="outline">
            Back to Decks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <PageHeader
        title={`Edit "${deck.title}"`}
        description="Update your deck settings and information"
        action={
          <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Deck
          </Button>
        }
      />

      {/* Form */}
      <div className="max-w-2xl">
        <DeckFormPage
          deck={deck}
          onSuccess={handleSuccess}
          backUrl={`/dashboard/decks/${deckId}`}
        />
      </div>
    </div>
  );
}
