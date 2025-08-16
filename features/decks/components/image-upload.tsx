'use client';

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  FileImage, 
  Loader2,
  AlertCircle,
  CheckCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { useFileUpload } from '../hooks/use-file-upload';

interface ImageUploadProps {
  value?: string | null;
  onChange?: (file: File | null) => void;
  onUploadStart?: (file: File) => void;
  onUploadProgress?: (progress: number) => void;
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  accept?: string[];
  maxSize?: number;
  showPreview?: boolean;
  variant?: 'default' | 'compact' | 'avatar';
}

export function ImageUpload({
  value,
  onChange,
  onUploadStart,
  onUploadProgress,
  onUploadComplete,
  onUploadError,
  disabled = false,
  className,
  accept = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxSize = 5 * 1024 * 1024, // 5MB
  showPreview = true,
  variant = 'default',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    file,
    previewUrl,
    isDragging,
    isUploading,
    progress,
    error,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleFileChange,
    setFile,
    reset,
  } = useFileUpload({
    accept,
    maxSize,
    onFileChange: onChange,
    onError: onUploadError,
  });

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    reset();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const currentImageUrl = previewUrl || value;
  const hasImage = !!currentImageUrl;

  // Compact variant for smaller spaces
  if (variant === 'compact') {
    return (
      <div className={cn('relative', className)}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept.join(',')}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            'relative w-20 h-20 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
            'hover:border-primary/50 hover:bg-muted/50',
            isDragging && 'border-primary bg-primary/10',
            disabled && 'opacity-50 cursor-not-allowed',
            hasImage ? 'border-solid border-border' : 'border-muted-foreground/25'
          )}
        >
          {hasImage ? (
            <>
              <img
                src={currentImageUrl}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              {!disabled && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={handleRemove}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          )}
        </div>

        {isUploading && progress > 0 && (
          <Progress value={progress} className="mt-2" />
        )}
      </div>
    );
  }

  // Avatar variant for profile pictures
  if (variant === 'avatar') {
    return (
      <div className={cn('relative', className)}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept.join(',')}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />

        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            'relative w-24 h-24 border-2 border-dashed rounded-full cursor-pointer transition-colors overflow-hidden',
            'hover:border-primary/50 hover:bg-muted/50',
            isDragging && 'border-primary bg-primary/10',
            disabled && 'opacity-50 cursor-not-allowed',
            hasImage ? 'border-solid border-border' : 'border-muted-foreground/25'
          )}
        >
          {hasImage ? (
            <>
              <img
                src={currentImageUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0"
                  onClick={handleRemove}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : (
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
          )}
        </div>

        {isUploading && progress > 0 && (
          <Progress value={progress} className="mt-2" />
        )}
      </div>
    );
  }

  // Default variant - full featured
  return (
    <Card className={cn('p-6', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept.join(',')}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors',
          'hover:border-primary/50 hover:bg-muted/50',
          isDragging && 'border-primary bg-primary/10',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-destructive/50 bg-destructive/5'
        )}
      >
        {hasImage ? (
          // Image Preview
          <div className="space-y-4">
            <div className="relative mx-auto w-48 h-32 overflow-hidden rounded-lg border">
              <img
                src={currentImageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {!disabled && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {file && (
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">{file.name}</p>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="secondary">
                    {formatFileSize(file.size)}
                  </Badge>
                  <Badge variant="secondary">
                    {file.type.split('/')[1].toUpperCase()}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Upload Prompt
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : error ? (
                <AlertCircle className="h-6 w-6 text-destructive" />
              ) : (
                <Upload className="h-6 w-6 text-muted-foreground" />
              )}
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                {isDragging
                  ? 'Drop your image here'
                  : 'Drag and drop an image, or click to browse'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                Supports {accept.map(type => type.split('/')[1].toUpperCase()).join(', ')} up to {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>

            <Button variant="outline" disabled={disabled} className="mt-4">
              <FileImage className="mr-2 h-4 w-4" />
              Choose Image
            </Button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isUploading && progress > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Uploading...</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {!isUploading && hasImage && !error && (
        <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span>Image ready for upload</span>
        </div>
      )}
    </Card>
  );
}
