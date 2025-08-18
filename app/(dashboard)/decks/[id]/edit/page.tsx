'use client';

import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { DeckFormPage } from '@/features/decks';
import { useDeckById } from '@/features/decks';
import { Button } from '@/components/ui/button';

export default function EditDeckPage() {
  const params = useParams();
  const router = useRouter();
  const deckId = parseInt(params.id as string);

  const { data: deck, isLoading, error } = useDeckById(deckId);

  const handleSuccess = () => {
    toast.success('Deck updated successfully!');
    router.push(`/decks/${deckId}`);
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
                      <Button onClick={() => router.push('/decks')} variant="outline">
            Back to Decks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DeckFormPage
      deck={deck}
      onSuccess={handleSuccess}
      backUrl={`/decks/${deckId}`}
    />
  );
}
