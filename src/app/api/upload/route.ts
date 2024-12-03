import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import { writeFile, mkdir, access } from 'fs/promises';
import path from 'path';
import { uploadConfig } from '@/lib/upload-config';

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!uploadConfig.allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > uploadConfig.maxFileSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename with sanitized original name
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '').replace(/\s+/g, '-');
    const filename = `${uniqueSuffix}-${sanitizedName}`;

    // Ensure upload directory exists
    try {
      await access(uploadConfig.uploadDir);
    } catch {
      await mkdir(uploadConfig.uploadDir, { recursive: true });
      console.log('Created uploads directory:', uploadConfig.uploadDir);
    }

    const filepath = path.join(uploadConfig.uploadDir, filename);

    try {
      await writeFile(filepath, buffer);
      console.log('Successfully wrote file:', filepath);
    } catch (error) {
      console.error('Error writing file:', error);
      return NextResponse.json(
        { error: 'Failed to save file' },
        { status: 500 }
      );
    }

    // Return the relative URL
    const fileUrl = uploadConfig.getImageUrl(filename);
    console.log('File uploaded successfully:', fileUrl);
    
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