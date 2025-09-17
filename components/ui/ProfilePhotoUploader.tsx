'use client';

import { useState, useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';

interface ProfilePhotoUploaderProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string | null) => void;
  disabled?: boolean;
}

export default function ProfilePhotoUploader({ 
  currentImageUrl, 
  onImageChange, 
  disabled = false 
}: ProfilePhotoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create a preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Upload to Supabase Storage
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'profile-picture');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onImageChange(data.url);
        // Clean up preview URL
        URL.revokeObjectURL(preview);
        setPreviewUrl(data.url);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      // Reset preview
      if (previewUrl !== currentImageUrl) {
        URL.revokeObjectURL(previewUrl || '');
        setPreviewUrl(currentImageUrl || null);
      }
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveImage = () => {
    if (previewUrl && previewUrl !== currentImageUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageChange(null);
  };

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Profile Picture Display */}
      <div className="relative">
        <div 
          className={`w-32 h-32 rounded-full border-4 border-gray-200 overflow-hidden cursor-pointer transition-all duration-200 ${
            disabled || isUploading 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:border-[var(--wl-forest)] hover:shadow-lg'
          }`}
          onClick={handleClick}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Remove button */}
        {previewUrl && !disabled && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Upload indicator */}
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
            <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || isUploading}
        className="inline-flex items-center px-4 py-2 bg-[var(--wl-forest)] text-white rounded-lg hover:bg-[var(--wl-forest)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--wl-forest)] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Upload className="w-4 h-4 mr-2" />
        {isUploading ? 'Uploading...' : previewUrl ? 'Change Photo' : 'Upload Photo'}
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Help text */}
      <p className="text-sm text-gray-500 text-center">
        Click to upload a profile picture<br />
        Max size: 5MB • JPG, PNG, GIF
      </p>
    </div>
  );
}
