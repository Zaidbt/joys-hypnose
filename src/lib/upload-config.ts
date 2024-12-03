import path from 'path';

const isProd = process.env.NODE_ENV === 'production';

export const uploadConfig = {
  uploadDir: isProd 
    ? path.join(process.cwd(), '.next/server/public/uploads')
    : path.join(process.cwd(), 'public/uploads'),
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  getImageUrl: (filename: string) => `/uploads/${filename}`
}; 