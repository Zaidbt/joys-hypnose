import path from 'path';

export const uploadConfig = {
  uploadDir: process.env.UPLOAD_DIR || path.join(process.cwd(), 'public/uploads'),
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  getImageUrl: (filename: string) => `/uploads/${filename}`
}; 