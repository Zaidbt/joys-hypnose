import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import type { Admin } from '@/types/admin';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  const client = await clientPromise;
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const db = client.db('joyshypnose');
    const adminsCollection = db.collection('admins');

    // Check if admin already exists
    const existingAdmin = await adminsCollection.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new admin without _id field (MongoDB will generate it)
    const newAdmin = {
      email,
      password: hashedPassword,
      name,
      role: 'admin' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await adminsCollection.insertOne(newAdmin);

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      data: {
        ...newAdmin,
        _id: result.insertedId.toString(),
        password: undefined // Don't send password back
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: 'Failed to create admin' },
      { status: 500 }
    );
  }
}

// Get all admins (protected route)
export async function GET() {
  const client = await clientPromise;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = client.db('joyshypnose');
    const adminsCollection = db.collection('admins');

    const admins = await adminsCollection
      .find({})
      .project({ password: 0 }) // Exclude password from results
      .toArray();

    return NextResponse.json(admins.map(admin => ({
      ...admin,
      _id: admin._id.toString()
    })));

  } catch (error) {
    console.error('Error fetching admins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admins' },
      { status: 500 }
    );
  }
} 