import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      'https://joyshypnose-therapies.com/api/auth/callback/google'
    );

    const { tokens } = await oauth2Client.getToken(code);

    return NextResponse.json({
      message: 'Successfully exchanged code for tokens',
      refresh_token: tokens.refresh_token,
      // Only show part of the token for security
      refresh_token_preview: tokens.refresh_token ? `${tokens.refresh_token.substring(0, 10)}...` : null,
      access_token_received: !!tokens.access_token,
      expires_in: tokens.expiry_date
    });

  } catch (error) {
    console.error('Error exchanging code:', error);
    return NextResponse.json({
      error: 'Failed to exchange code',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 