import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET(request: Request) {
  try {
    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );

    // Log configuration
    const config = {
      clientId: process.env.GMAIL_CLIENT_ID ? 'Set' : 'Not set',
      clientSecret: process.env.GMAIL_CLIENT_SECRET ? 'Set' : 'Not set',
      redirectUri: process.env.GMAIL_REDIRECT_URI,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN ? 'Set' : 'Not set',
      adminEmail: process.env.ADMIN_EMAIL
    };

    console.log('Gmail Configuration:', config);

    // Check if required config is present
    if (!process.env.GMAIL_CLIENT_ID || 
        !process.env.GMAIL_CLIENT_SECRET || 
        !process.env.GMAIL_REFRESH_TOKEN) {
      return NextResponse.json({
        error: 'Missing Gmail configuration',
        config
      }, { status: 400 });
    }

    // Set credentials
    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    // Try to get a new access token
    const { token } = await oauth2Client.getAccessToken();

    // Create Gmail client
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    // Try to get user profile to verify connection
    const profile = await gmail.users.getProfile({
      userId: 'me'
    });

    return NextResponse.json({
      success: true,
      message: 'Gmail configuration is working',
      emailAddress: profile.data.emailAddress,
      accessToken: token ? 'Valid' : 'Not obtained',
      config
    });

  } catch (error) {
    console.error('Error testing Gmail configuration:', error);
    return NextResponse.json({
      error: 'Failed to test Gmail configuration',
      details: error instanceof Error ? error.message : 'Unknown error',
      errorObject: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error
    }, { status: 500 });
  }
} 