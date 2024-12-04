import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import type { NewsletterSubscription } from '@/types/newsletter';

// Get all subscriptions
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const subscriptions = await db
      .collection<NewsletterSubscription>('newsletter')
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Delete a subscription
export async function DELETE(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const result = await db
      .collection<NewsletterSubscription>('newsletter')
      .deleteOne({ email });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Subscription deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 