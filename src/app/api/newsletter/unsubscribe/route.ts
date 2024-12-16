import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.redirect(new URL('/?error=invalid-unsubscribe', request.url));
    }

    const client = await clientPromise;
    const db = client.db();

    // Update subscriber status to unsubscribed
    const result = await db.collection('newsletter').updateOne(
      { email },
      { 
        $set: { 
          status: 'unsubscribed',
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.redirect(new URL('/?error=not-found', request.url));
    }

    // Redirect to homepage with success message
    return NextResponse.redirect(new URL('/?unsubscribed=true', request.url));
  } catch (error) {
    console.error('Error unsubscribing:', error);
    return NextResponse.redirect(new URL('/?error=server-error', request.url));
  }
} 