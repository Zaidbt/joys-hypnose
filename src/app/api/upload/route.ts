import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import { writeFile, mkdir, stat, chmod } from 'fs/promises';
import { createWriteStream } from 'fs';
import path from 'path';
import { uploadConfig } from '@/lib/upload-config';
import { Readable } from 'stream';

function getFileExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return ext;
}

async function streamToFile(stream: Readable, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const writeStream = createWriteStream(filepath);
    stream.pipe(writeStream);
    
    writeStream.on('finish', () => {
      resolve();
    });
    
    writeStream.on('error', (error) => {
      reject(error);
    });
  });
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

    // Ensure upload directory exists
    try {
      await stat(uploadConfig.uploadDir);
    } catch (error) {
      console.log('Creating upload directory...');
      await mkdir(uploadConfig.uploadDir, { recursive: true });
      // Set directory permissions to 755
      await chmod(uploadConfig.uploadDir, 0o755);
    }

    // Create unique filename with sanitized original name and preserved extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const sanitizedName = path.parse(file.name).name.replace(/[^a-zA-Z0-9]/g, '-');
    const filename = `${uniqueSuffix}-${sanitizedName}${fileExt}`;
    console.log('Generated filename:', filename);

    const filepath = path.join(uploadConfig.uploadDir, filename);
    console.log('Full file path:', filepath);

    try {
      // Convert File to stream and write to disk
      const fileStream = Readable.from(Buffer.from(await file.arrayBuffer()));
      await streamToFile(fileStream, filepath);
      console.log('Successfully wrote file');
      
      // Set file permissions to 644
      await chmod(filepath, 0o644);
      
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