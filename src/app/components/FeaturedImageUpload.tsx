'use client';

import React from 'react';
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
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Featured Image
      </label>
      {currentImage ? (
        <div className="relative">
          <Image
            src={currentImage}
            alt="Featured"
            width={400}
            height={300}
            className="rounded-lg"
          />
          <button
            type="button"
            onClick={onImageRemove}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <PhotoIcon className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600">Click to upload featured image</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageUpload(file);
              }}
            />
          </label>
        </div>
      )}
    </div>
  );
} 