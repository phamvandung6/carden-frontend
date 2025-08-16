import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { validateThumbnailFile, createPreviewUrl, revokePreviewUrl } from '../utils/deck-utils';

export interface FileUploadState {
  file: File | null;
  previewUrl: string | null;
  isDragging: boolean;
  isUploading: boolean;
  progress: number;
  error: string | null;
}

export interface UseFileUploadOptions {
  accept?: string[];
  maxSize?: number;
  onFileChange?: (file: File | null) => void;
  onError?: (error: string) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const {
    accept = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxSize = 5 * 1024 * 1024, // 5MB
    onFileChange,
    onError,
  } = options;

  const [state, setState] = useState<FileUploadState>({
    file: null,
    previewUrl: null,
    isDragging: false,
    isUploading: false,
    progress: 0,
    error: null,
  });

  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!accept.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Please upload ${accept.map(type => type.split('/')[1].toUpperCase()).join(', ')} files.`,
      };
    }

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size too large. Please upload files smaller than ${Math.round(maxSize / 1024 / 1024)}MB.`,
      };
    }

    return { valid: true };
  }, [accept, maxSize]);

  const setFile = useCallback((file: File | null) => {
    // Clean up previous preview URL
    if (state.previewUrl) {
      revokePreviewUrl(state.previewUrl);
    }

    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setState(prev => ({
          ...prev,
          file: null,
          previewUrl: null,
          error: validation.error || null,
        }));
        onError?.(validation.error || 'Invalid file');
        toast.error(validation.error || 'Invalid file');
        return;
      }

      const previewUrl = createPreviewUrl(file);
      setState(prev => ({
        ...prev,
        file,
        previewUrl,
        error: null,
      }));
      onFileChange?.(file);
    } else {
      setState(prev => ({
        ...prev,
        file: null,
        previewUrl: null,
        error: null,
      }));
      onFileChange?.(null);
    }
  }, [state.previewUrl, validateFile, onFileChange, onError]);

  const setDragging = useCallback((isDragging: boolean) => {
    setState(prev => ({ ...prev, isDragging }));
  }, []);

  const setUploading = useCallback((isUploading: boolean) => {
    setState(prev => ({ ...prev, isUploading }));
  }, []);

  const setProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, progress }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
    if (error) {
      onError?.(error);
    }
  }, [onError]);

  const reset = useCallback(() => {
    if (state.previewUrl) {
      revokePreviewUrl(state.previewUrl);
    }
    setState({
      file: null,
      previewUrl: null,
      isDragging: false,
      isUploading: false,
      progress: 0,
      error: null,
    });
    onFileChange?.(null);
  }, [state.previewUrl, onFileChange]);

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, [setDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragging(false);
    }
  }, [setDragging]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setFile(files[0]); // Take only the first file
    }
  }, [setDragging, setFile]);

  // Handle file input change
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  }, [setFile]);

  return {
    // State
    file: state.file,
    previewUrl: state.previewUrl,
    isDragging: state.isDragging,
    isUploading: state.isUploading,
    progress: state.progress,
    error: state.error,

    // Actions
    setFile,
    setUploading,
    setProgress,
    setError,
    reset,

    // Event handlers
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileChange,

    // Utils
    validateFile,
  };
}
