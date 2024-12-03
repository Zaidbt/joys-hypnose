import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import { writeFile, mkdir, stat } from 'fs/promises';
import path from 'path';
import { uploadConfig } from '@/lib/upload-config';

function getFileExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return ext;
}

export async function POST(request: Request) {
  console.log('Starting file upload process...');
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('Authentication failed');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('Authentication successful');

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.log('No file received in request');
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const fileExt = getFileExtension(file.name);
    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size,
      extension: fileExt
    });

    // Validate file type and extension
    if (!uploadConfig.allowedTypes.includes(file.type) || !uploadConfig.allowedExtensions.includes(fileExt)) {
      console.log('Invalid file type or extension:', { type: file.type, extension: fileExt });
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > uploadConfig.maxFileSize) {
      console.log('File too large:', file.size);
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('File buffer created, size:', buffer.length);

    // Create unique filename with sanitized original name and preserved extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const sanitizedName = path.parse(file.name).name.replace(/[^a-zA-Z0-9]/g, '-');
    const filename = `${uniqueSuffix}-${sanitizedName}${fileExt}`;
    console.log('Generated filename:', filename);

    // Ensure upload directory exists
    try {
      await stat(uploadConfig.uploadDir);
    } catch (error) {
      console.log('Creating upload directory...');
      await mkdir(uploadConfig.uploadDir, { recursive: true });
    }

    const filepath = path.join(uploadConfig.uploadDir, filename);
    console.log('Full file path:', filepath);

    try {
      await writeFile(filepath, buffer);
      console.log('Successfully wrote file');
      
      // Verify file was written
      const fileStats = await stat(filepath);
      console.log('Written file stats:', {
        size: fileStats.size,
        permissions: fileStats.mode
      });
    } catch (error) {
      console.error('Error writing file:', error);
      return NextResponse.json(
        { error: 'Failed to save file' },
        { status: 500 }
      );
    }

    // Return the full URL for production
    const fileUrl = uploadConfig.getImageUrl(filename);
    console.log('Generated file URL:', fileUrl);
    
    return NextResponse.json({ 
      success: true,
      url: fileUrl
    });

  } catch (error) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
} 