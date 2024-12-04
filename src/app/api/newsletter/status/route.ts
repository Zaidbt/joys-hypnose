import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import type { NewsletterSubscription } from '@/types/newsletter';

export async function PUT(request: Request) {
  try {
    const { email, status } = await request.json();

    if (!email || !status) {
      return NextResponse.json(
        { error: 'Email and status are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const result = await db
      .collection<NewsletterSubscription>('newsletter')
      .updateOne(
        { email },
        { $set: { status } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Status updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating subscription status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 