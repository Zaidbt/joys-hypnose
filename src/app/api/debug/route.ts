import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    nextAuthUrl: process.env.NEXTAUTH_URL,
    adminEmailSet: !!process.env.ADMIN_EMAIL,
    adminPasswordSet: !!process.env.ADMIN_PASSWORD,
    adminEmailLength: process.env.ADMIN_EMAIL?.length,
    adminPasswordLength: process.env.ADMIN_PASSWORD?.length,
  });
} 