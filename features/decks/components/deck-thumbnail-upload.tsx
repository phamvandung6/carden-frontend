'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { ImageUpload } from './image-upload';
import { useUploadThumbnail } from '../hooks/use-decks';
import { useImageUploadState } from '../stores/decks-store';

interface DeckThumbnailUploadProps {
  deckId?: number;
  currentImageUrl?: string | null;
  onImageChange?: (url: string | null) => void;
  disabled?: boolean;
  variant?: 'default' | 'compact' | 'avatar';
  className?: string;
}

export function DeckThumbnailUpload({
  deckId,
  currentImageUrl,
  onImageChange,
  disabled = false,
  variant = 'default',
  className,
}: DeckThumbnailUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uploadThumbnail = useUploadThumbnail();
  const imageUploadState = useImageUploadState();

  // Handle file selection
  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    
    if (file && deckId) {
      // Start upload immediately when file is selected and we have a deckId
      handleUpload(file);
    } else if (!file) {
      // Clear image when file is removed
      onImageChange?.(null);
    }
  };

  // Handle upload
  const handleUpload = async (file: File) => {
    if (!deckId) {
      toast.error('No deck ID provided for upload');
      return;
    }

    try {
      const uploadedUrl = await uploadThumbnail.mutateAsync({
        deckId,
        file,
      });

      // Notify parent component of the new image URL
      onImageChange?.(uploadedUrl);
      toast.success('Thumbnail uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      setSelectedFile(null);
      // Error is already handled by the mutation
    }
  };

  // Upload progress handler
  const handleUploadProgress = (progress: number) => {
    // Progress is handled by the upload mutation and store
    console.log('Upload progress:', progress);
  };

  // Reset state when deck changes
  useEffect(() => {
    setSelectedFile(null);
  }, [deckId]);

  // Determine current image URL (uploaded URL takes precedence)
  const displayImageUrl = imageUploadState.previewUrl || currentImageUrl;

  return (
    <ImageUpload
      value={displayImageUrl}
      onChange={handleFileChange}
      onUploadProgress={handleUploadProgress}
      disabled={disabled || uploadThumbnail.isPending}
      variant={variant}
      className={className}
      accept={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
      maxSize={5 * 1024 * 1024} // 5MB
    />
  );
}

// Hook for easier usage in forms
export function useDeckThumbnailUpload(deckId?: number) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const uploadThumbnail = useUploadThumbnail();
  const imageUploadState = useImageUploadState();

  const uploadImage = async (file: File): Promise<string> => {
    if (!deckId) {
      throw new Error('No deck ID provided for upload');
    }

    const uploadedUrl = await uploadThumbnail.mutateAsync({
      deckId,
      file,
    });

    setImageUrl(uploadedUrl);
    return uploadedUrl;
  };

  const clearImage = () => {
    setImageUrl(null);
  };

  return {
    imageUrl,
    setImageUrl,
    uploadImage,
    clearImage,
    isUploading: uploadThumbnail.isPending,
    uploadProgress: imageUploadState.progress,
    uploadError: imageUploadState.error,
  };
}
