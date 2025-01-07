import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { uploadConfig } from '@/lib/upload-config';

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  console.log('Serve upload API called with params:', params);
  
  try {
    const filePath = path.join(uploadConfig.uploadDir, ...params.path);
    console.log('Attempting to read file:', filePath);
    
    const fileBuffer = await readFile(filePath);
    console.log('Successfully read file, size:', fileBuffer.length);
    
    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    const contentType = uploadConfig.mimeTypes[ext] || 'application/octet-stream';
    console.log('Serving file with content type:', contentType);
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving upload:', error);
    console.error('Requested file path:', path.join(uploadConfig.uploadDir, ...params.path));
    return new NextResponse('File not found', { status: 404 });
  }
} 