import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';

export async function DELETE() {
  const client = await clientPromise;
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = client.db('joyshypnose');
    const appointmentsCollection = db.collection('appointments');

    const result = await appointmentsCollection.deleteMany({
      isFictitious: true
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} fictitious appointments`
    });

  } catch (error) {
    console.error('Error deleting fictitious appointments:', error);
    return NextResponse.json(
      { error: 'Failed to delete fictitious appointments' },
      { status: 500 }
    );
  }
} 