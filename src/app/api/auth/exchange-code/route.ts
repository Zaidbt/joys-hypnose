import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      'http://localhost:3000/api/auth/callback'
    );

    console.log('Attempting to exchange code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Token exchange successful');

    if (!tokens.refresh_token) {
      return NextResponse.json(
        { error: 'No refresh token received. Make sure to include prompt=consent in the authorization URL.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      refresh_token: tokens.refresh_token,
      message: 'Successfully obtained refresh token'
    });
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    return NextResponse.json(
      { error: 'Failed to exchange authorization code for tokens' },
      { status: 500 }
    );
  }
} 