import path from 'path';

// MIME type mapping
const mimeTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
};

export const uploadConfig = {
  uploadDir: path.join(process.cwd(), 'public/uploads'),
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: Object.values(mimeTypes),
  allowedExtensions: Object.keys(mimeTypes),
  mimeTypes,
  getImageUrl: (filename: string) => {
    return `/uploads/${filename}`;
  }
}; 