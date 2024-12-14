import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db('joyshypnose');

    // Get blog stats
    const articles = await db.collection('blog_posts').countDocuments();

    // Get appointment stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [confirmed, pending, today_appointments] = await Promise.all([
      db.collection('appointments').countDocuments({ status: 'confirmed' }),
      db.collection('appointments').countDocuments({ status: 'pending' }),
      db.collection('appointments').countDocuments({
        date: {
          $gte: today,
          $lt: tomorrow
        },
        status: 'confirmed'
      })
    ]);

    // Get newsletter stats
    const [total_subscribers, active_subscribers] = await Promise.all([
      db.collection('newsletter').countDocuments(),
      db.collection('newsletter').countDocuments({ status: 'active' })
    ]);

    return NextResponse.json({
      articles,
      appointments: {
        confirmed,
        pending,
        today: today_appointments
      },
      newsletter: {
        total: total_subscribers,
        active: active_subscribers
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 