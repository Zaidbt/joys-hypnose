import { NextResponse } from 'next/server';
import { sendTestEmail } from '@/lib/gmail';

export async function GET() {
  // Check environment variables
  const config = {
    clientId: process.env.GMAIL_CLIENT_ID ? 'Set' : 'Not set',
    clientSecret: process.env.GMAIL_CLIENT_SECRET ? 'Set' : 'Not set',
    redirectUri: process.env.GMAIL_REDIRECT_URI,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN ? 'Set' : 'Not set',
    adminEmail: process.env.ADMIN_EMAIL
  };

  console.log('Test endpoint - Gmail API Configuration:', config);

  // Check if any required config is missing
  const missingConfig = [];
  if (!process.env.GMAIL_CLIENT_ID) missingConfig.push('GMAIL_CLIENT_ID');
  if (!process.env.GMAIL_CLIENT_SECRET) missingConfig.push('GMAIL_CLIENT_SECRET');
  if (!process.env.GMAIL_REFRESH_TOKEN) missingConfig.push('GMAIL_REFRESH_TOKEN');
  if (!process.env.ADMIN_EMAIL) missingConfig.push('ADMIN_EMAIL');

  if (missingConfig.length > 0) {
    return NextResponse.json({
      error: 'Missing required configuration',
      missingConfig,
      config
    }, { status: 400 });
  }

  try {
    await sendTestEmail();
    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully',
      config
    });
  } catch (error) {
    console.error('Error in test email route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email', 
        details: error instanceof Error ? error.message : 'Unknown error',
        config,
        errorObject: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : error
      },
      { status: 500 }
    );
  }
} 