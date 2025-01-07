import path from 'path';

// MIME type mapping
const mimeTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp'
};

// In production, use absolute path
const isProduction = process.env.NODE_ENV === 'production';
const uploadDir = isProduction 
  ? '/var/www/joyshypnose/public/uploads'
  : path.join(process.cwd(), 'public/uploads');

export const uploadConfig = {
  uploadDir,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: Object.values(mimeTypes),
  allowedExtensions: Object.keys(mimeTypes),
  mimeTypes,
  getImageUrl: (filename: string) => {
    return `/uploads/${filename}`;
  }
}; 