'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FeaturedImageUploadProps {
  currentImage?: string;
  onImageUpload: (file: File) => Promise<void>;
  onImageRemove: () => void;
}

export default function FeaturedImageUpload({
  currentImage,
  onImageUpload,
  onImageRemove
}: FeaturedImageUploadProps) {
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError('');
      setIsUploading(true);
      console.log('Starting upload for file:', {
        name: file.name,
        type: file.type,
        size: file.size
      });
      
      await onImageUpload(file);
      console.log('Upload completed successfully');
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Featured Image
      </label>
      {error && (
        <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}
      {currentImage ? (
        <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
          <Image
            src={currentImage}
            alt="Featured image"
            fill
            className="object-cover"
            unoptimized
          />
          <button
            onClick={onImageRemove}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${isUploading ? 'opacity-50' : ''}`}>
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <PhotoIcon className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600">
                {isUploading ? 'Uploading...' : 'Click to upload featured image'}
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      )}
    </div>
  );
} 