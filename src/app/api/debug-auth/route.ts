import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    return NextResponse.json({
      authenticated: !!session,
      session,
      env: {
        hasAdminEmail: !!process.env.ADMIN_EMAIL,
        hasAdminPassword: !!process.env.ADMIN_PASSWORD,
        nextAuthUrl: process.env.NEXTAUTH_URL,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Failed to get session', 
      details: error?.message || 'Unknown error' 
    }, { status: 500 });
  }
} 