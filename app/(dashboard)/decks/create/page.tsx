'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { DeckFormPage } from '@/features/decks';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
export default function CreateDeckPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSuccess = () => {
    toast.success('Deck created successfully!');
    router.push('/dashboard/decks');
  };



  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Create New Deck"
        description="Create a new flashcard deck to start learning"
        action={
          <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        }
      />

      {/* Form */}
      <div className="max-w-2xl">
        <DeckFormPage
          onSuccess={handleSuccess}
          backUrl="/dashboard/decks"
        />
      </div>
    </div>
  );
}
