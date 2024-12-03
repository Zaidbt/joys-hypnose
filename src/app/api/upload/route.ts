import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import { writeFile, mkdir, access, stat } from 'fs/promises';
import path from 'path';
import { uploadConfig } from '@/lib/upload-config';

export async function POST(request: Request) {
  console.log('Starting file upload process...');
  try {
    // Check authentication
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
    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validate file type
    if (!uploadConfig.allowedTypes.includes(file.type)) {
      console.log('Invalid file type:', file.type);
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

    // Create unique filename with sanitized original name
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '').replace(/\s+/g, '-');
    const filename = `${uniqueSuffix}-${sanitizedName}`;
    console.log('Generated filename:', filename);

    // Log upload directory information
    console.log('Upload directory:', uploadConfig.uploadDir);
    try {
      const uploadDirStats = await stat(uploadConfig.uploadDir);
      console.log('Upload directory stats:', {
        exists: true,
        isDirectory: uploadDirStats.isDirectory(),
        permissions: uploadDirStats.mode,
        owner: uploadDirStats.uid,
        group: uploadDirStats.gid
      });
    } catch (error) {
      console.log('Upload directory does not exist, creating it...');
      await mkdir(uploadConfig.uploadDir, { recursive: true });
      console.log('Created uploads directory');
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
        permissions: fileStats.mode,
        owner: fileStats.uid,
        group: fileStats.gid
      });
    } catch (error) {
      console.error('Error writing file:', error);
      return NextResponse.json(
        { error: 'Failed to save file' },
        { status: 500 }
      );
    }

    // Return the relative URL
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