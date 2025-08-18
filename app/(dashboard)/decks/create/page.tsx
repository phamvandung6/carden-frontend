'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { DeckFormPage } from '@/features/decks';
export default function CreateDeckPage() {
  const router = useRouter();

  const handleSuccess = () => {
    toast.success('Deck created successfully!');
    router.push('/decks');
  };



  return (
    <DeckFormPage
      onSuccess={handleSuccess}
      backUrl="/decks"
    />
  );
}
