import path from 'path';

export const uploadConfig = {
  uploadDir: process.env.UPLOAD_DIR || path.join(process.cwd(), 'public/uploads'),
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://77.37.122.81:3000'
}; 