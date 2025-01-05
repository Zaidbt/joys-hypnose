import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    // Log the configuration for debugging
    console.log('OAuth Configuration:', {
      clientId: process.env.GMAIL_CLIENT_ID ? 'Set' : 'Not set',
      clientSecret: process.env.GMAIL_CLIENT_SECRET ? 'Set' : 'Not set',
      code: code.substring(0, 10) + '...' // Only log the start of the code
    });

    const oauth2Client = new google.auth.OAuth2(
      '352578901805-e8gos2tg0n8hk7dc5f90q0b2bmcnlct0.apps.googleusercontent.com', // Use the exact client ID from the auth URL
      process.env.GMAIL_CLIENT_SECRET,
      'https://joyshypnose-therapies.com/api/auth/callback/google'
    );

    // Set additional parameters to match the original request
    const { tokens } = await oauth2Client.getToken({
      code,
      scope: 'https://www.googleapis.com/auth/gmail.send'
    });

    return NextResponse.json({
      message: 'Successfully exchanged code for tokens',
      refresh_token: tokens.refresh_token,
      refresh_token_preview: tokens.refresh_token ? `${tokens.refresh_token.substring(0, 10)}...` : null,
      access_token_received: !!tokens.access_token,
      expires_in: tokens.expiry_date
    });

  } catch (error) {
    console.error('Error exchanging code:', error);
    return NextResponse.json({
      error: 'Failed to exchange code',
      details: error instanceof Error ? error.message : 'Unknown error',
      errorObject: error
    }, { status: 500 });
  }
} 