'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, 
  X, 
  FileImage, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

import { validateThumbnailFile, createPreviewUrl, revokePreviewUrl } from '../utils/deck-utils';

interface UploadFile {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
  uploadedUrl?: string;
}

interface BulkImageUploadProps {
  onFilesChange?: (files: UploadFile[]) => void;
  onUpload?: (files: UploadFile[]) => Promise<void>;
  disabled?: boolean;
  className?: string;
  maxFiles?: number;
  accept?: string[];
  maxSize?: number;
}

export function BulkImageUpload({
  onFilesChange,
  onUpload,
  disabled = false,
  className,
  maxFiles = 10,
  accept = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxSize = 5 * 1024 * 1024, // 5MB
}: BulkImageUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: UploadFile[] = [];

    for (const file of fileArray) {
      // Check if we've reached max files
      if (files.length + validFiles.length >= maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`);
        break;
      }

      // Validate file
      const validation = validateThumbnailFile(file);
      if (!validation.valid) {
        toast.error(validation.error);
        continue;
      }

      // Check for duplicates
      const isDuplicate = files.some(f => f.file.name === file.name && f.file.size === file.size);
      if (isDuplicate) {
        toast.error(`File "${file.name}" already added`);
        continue;
      }

      const uploadFile: UploadFile = {
        id: `${Date.now()}-${Math.random()}`,
        file,
        previewUrl: createPreviewUrl(file),
        progress: 0,
        status: 'pending',
      };

      validFiles.push(uploadFile);
    }

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesChange?.(updatedFiles);
    }
  }, [files, maxFiles, onFilesChange]);

  const removeFile = useCallback((fileId: string) => {
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove) {
      revokePreviewUrl(fileToRemove.previewUrl);
    }
    
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  }, [files, onFilesChange]);

  const clearAll = useCallback(() => {
    files.forEach(file => revokePreviewUrl(file.previewUrl));
    setFiles([]);
    onFilesChange?.([]);
  }, [files, onFilesChange]);

  const updateFileStatus = useCallback((fileId: string, updates: Partial<UploadFile>) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, ...updates } : file
    ));
  }, []);

  const handleUpload = async () => {
    if (!onUpload || files.length === 0) return;

    setIsUploading(true);
    try {
      await onUpload(files);
    } catch (error) {
      console.error('Bulk upload error:', error);
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, [addFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
    }
  }, [addFiles]);

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <FileImage className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const hasFiles = files.length > 0;
  const canUpload = hasFiles && !isUploading && files.some(f => f.status === 'pending');

  return (
    <Card className={cn('p-6', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        multiple
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
          'border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors',
          'hover:border-primary/50 hover:bg-muted/50',
          isDragging && 'border-primary bg-primary/10',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Upload className="h-6 w-6 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">
              {isDragging
                ? 'Drop your images here'
                : hasFiles
                ? 'Add more images'
                : 'Drag and drop images, or click to browse'
              }
            </p>
            <p className="text-xs text-muted-foreground">
              Supports {accept.map(type => type.split('/')[1].toUpperCase()).join(', ')} up to {Math.round(maxSize / 1024 / 1024)}MB each
            </p>
            <p className="text-xs text-muted-foreground">
              Maximum {maxFiles} files ({files.length}/{maxFiles} selected)
            </p>
          </div>

          <Button variant="outline" disabled={disabled || files.length >= maxFiles}>
            <Plus className="mr-2 h-4 w-4" />
            Choose Images
          </Button>
        </div>
      </div>

      {/* File List */}
      {hasFiles && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Selected Files ({files.length})</h3>
            <div className="flex gap-2">
              {canUpload && onUpload && (
                <Button 
                  size="sm" 
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload All
                    </>
                  )}
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                onClick={clearAll}
                disabled={isUploading}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All
              </Button>
            </div>
          </div>

          <ScrollArea className="h-64">
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  {/* Preview */}
                  <div className="w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={file.previewUrl}
                      alt={file.file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(file.status)}
                      <p className="text-sm font-medium truncate">
                        {file.file.name}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">
                        {formatFileSize(file.file.size)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {file.file.type.split('/')[1].toUpperCase()}
                      </Badge>
                      {file.status === 'completed' && (
                        <Badge variant="default" className="text-xs">
                          Uploaded
                        </Badge>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {file.status === 'uploading' && file.progress > 0 && (
                      <Progress value={file.progress} className="mt-2 h-1" />
                    )}

                    {/* Error Message */}
                    {file.status === 'error' && file.error && (
                      <p className="text-xs text-destructive mt-1">{file.error}</p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(file.id)}
                    disabled={isUploading && file.status === 'uploading'}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </Card>
  );
}
