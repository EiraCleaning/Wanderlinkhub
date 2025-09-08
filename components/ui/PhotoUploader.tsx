'use client';

import { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from './Button';
import { uploadMultipleImages, UploadResult } from '@/lib/upload';

interface PhotoUploaderProps {
  photos: string[];
  onChange: (urls: string[]) => void;
  minPhotos?: number;
  maxPhotos?: number;
  required?: boolean;
}

export function PhotoUploader({ 
  photos, 
  onChange, 
  minPhotos = 0, 
  maxPhotos = 5, 
  required = false 
}: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    
    // Validate files
    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select only image files (JPG, PNG)');
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 2MB.`);
        return;
      }

      // Check if we're at max capacity
      if (photos.length + validFiles.length >= maxPhotos) {
        alert(`Maximum ${maxPhotos} photos allowed.`);
        return;
      }

      validFiles.push(file);
    });

    if (validFiles.length === 0) return;

    // Upload files
    setIsUploading(true);
    try {
      const uploadResults = await uploadMultipleImages(validFiles);
      
      // Filter successful uploads
      const successfulUploads = uploadResults
        .filter(result => result.url && !result.error)
        .map(result => result.url);

      if (successfulUploads.length > 0) {
        onChange([...photos, ...successfulUploads]);
      }

      // Show errors if any
      const failedUploads = uploadResults.filter(result => result.error);
      if (failedUploads.length > 0) {
        alert(`Failed to upload ${failedUploads.length} photo(s). Please try again.`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onChange(newPhotos);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const remainingSlots = maxPhotos - photos.length;
  const showUploadArea = photos.length < maxPhotos;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[var(--wl-ink)]">
          Photos {required && <span className="text-red-500">*</span>}
        </label>
        <span className="text-xs text-[var(--wl-slate)]">
          {photos.length}/{maxPhotos}
        </span>
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-[var(--wl-border)]"
              />
              <button
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                type="button"
                aria-label={`Remove photo ${index + 1}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {showUploadArea && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging
              ? 'border-[var(--wl-sky)] bg-[var(--wl-sky)]/10'
              : 'border-[var(--wl-border)] hover:border-[var(--wl-sky)]'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-[var(--wl-sky)] mx-auto mb-2 animate-spin" />
              <p className="text-sm text-[var(--wl-slate)] mb-2">
                Uploading photos...
              </p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-[var(--wl-slate)] mx-auto mb-2" />
              <p className="text-sm text-[var(--wl-slate)] mb-2">
                Drag and drop images here, or{' '}
                <button
                  type="button"
                  onClick={openFileDialog}
                  className="text-[var(--wl-forest)] hover:text-[var(--wl-sky)] underline"
                >
                  browse
                </button>
              </p>
              <p className="text-xs text-[var(--wl-slate)]">
                JPG, PNG up to 2MB each. {minPhotos > 0 && `Minimum ${minPhotos} required.`}
              </p>
            </>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Helper text */}
      <p className="text-xs text-[var(--wl-slate)]">
        Clear photos of your space or recent events help families trust your listing.
      </p>

      {/* Validation error */}
      {required && photos.length < minPhotos && (
        <p className="text-sm text-red-600 mt-1">
          At least {minPhotos} photo{minPhotos > 1 ? 's' : ''} required.
        </p>
      )}
    </div>
  );
}
