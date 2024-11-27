import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Function to get today's date at midnight
const getTodayDate = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

export async function POST(request: Request) {
  const client = await clientPromise;
  try {
    const db = client.db('joyshypnose');
    const visitsCollection = db.collection('visits');
    const today = getTodayDate();

    // Update or create today's visit count
    await visitsCollection.updateOne(
      { date: today },
      { 
        $inc: { count: 1 },
        $setOnInsert: { date: today }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error recording visit:', error);
    return NextResponse.json(
      { error: 'Failed to record visit' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const client = await clientPromise;
  try {
    const db = client.db('joyshypnose');
    const visitsCollection = db.collection('visits');
    const blogCollection = db.collection('blog_posts');

    // Get total visits
    const totalVisits = await visitsCollection.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$count' }
        }
      }
    ]).toArray();

    // Get today's visits
    const todayVisits = await visitsCollection.findOne({ date: getTodayDate() });

    // Get total blog posts
    const totalPosts = await blogCollection.countDocuments();

    return NextResponse.json({
      totalVisits: totalVisits[0]?.total || 0,
      todayVisits: todayVisits?.count || 0,
      totalPosts
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
} 