import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import type { NewsletterSubscription } from '@/types/newsletter';

export async function POST(request: Request) {
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

    // Check if email already exists
    const existingSubscription = await db
      .collection<NewsletterSubscription>('newsletter')
      .findOne({ email });

    if (existingSubscription) {
      if (existingSubscription.status === 'unsubscribed') {
        // Reactivate subscription
        await db
          .collection<NewsletterSubscription>('newsletter')
          .updateOne(
            { email },
            { $set: { status: 'active', createdAt: new Date() } }
          );
      }
      return NextResponse.json(
        { message: 'Subscription updated successfully' },
        { status: 200 }
      );
    }

    // Create new subscription
    const subscription: NewsletterSubscription = {
      email,
      createdAt: new Date(),
      status: 'active'
    };

    await db
      .collection<NewsletterSubscription>('newsletter')
      .insertOne(subscription);

    return NextResponse.json(
      { message: 'Subscribed successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 