import { NextResponse } from 'next/server';
import { sendEmail, testEmailConfig } from '@/lib/gmail';

export async function GET() {
  try {
    // First test the configuration
    const configTest = await testEmailConfig();
    if (!configTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Configuration test failed',
        details: configTest.error
      });
    }

    // Try to send a test email
    await sendEmail(
      process.env.ADMIN_EMAIL!,
      'Test Email - Gmail Service Account',
      `
        <h1>Test Email</h1>
        <p>This is a test email sent using the Gmail service account at ${new Date().toLocaleString()}</p>
        <p>If you received this email, your Gmail configuration is working correctly!</p>
      `
    );

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      emailAddress: configTest.emailAddress
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 