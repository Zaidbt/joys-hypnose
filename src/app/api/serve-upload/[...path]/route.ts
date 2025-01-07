import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { uploadConfig } from '@/lib/upload-config';

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = path.join(uploadConfig.uploadDir, ...params.path);
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentType = uploadConfig.mimeTypes[ext] || 'application/octet-stream';
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving upload:', error);
    return new NextResponse('File not found', { status: 404 });
  }
} 