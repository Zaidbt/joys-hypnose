import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  if (!email || !token) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || '';
    return NextResponse.redirect(`${baseUrl}/unsubscribe?status=error`);
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('newsletter_subscribers');

    const subscriber = await collection.findOne({ email });

    if (!subscriber) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || '';
      return NextResponse.redirect(`${baseUrl}/unsubscribe?status=not-found&email=${encodeURIComponent(email)}`);
    }

    // Update subscriber status to unsubscribed
    await collection.updateOne(
      { email },
      { $set: { status: 'unsubscribed', unsubscribedAt: new Date() } }
    );

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || '';
    return NextResponse.redirect(`${baseUrl}/unsubscribe?status=success&email=${encodeURIComponent(email)}`);

  } catch (error) {
    console.error('Error unsubscribing:', error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin') || '';
    return NextResponse.redirect(`${baseUrl}/unsubscribe?status=error`);
  }
} 