import path from 'path';

const isProd = process.env.NODE_ENV === 'production';

export const uploadConfig = {
  uploadDir: path.join(process.cwd(), 'public/uploads'),
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
  getImageUrl: (filename: string) => {
    const baseUrl = isProd ? 'http://77.37.122.81:3000' : '';
    return `${baseUrl}/uploads/${filename}`;
  }
}; 