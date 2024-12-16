import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import { google } from 'googleapis';
import type { NewsletterSubscription } from '@/types/newsletter';

// Create Gmail client
function createGmailClient() {
  if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET || !process.env.GMAIL_REFRESH_TOKEN) {
    return null;
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    return google.gmail({ version: 'v1', auth: oauth2Client });
  } catch (error) {
    console.error('Error creating Gmail client:', error);
    return null;
  }
}

async function sendEmail(gmail: any, to: string, subject: string, htmlContent: string) {
  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
      ${htmlContent}
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
        <p>Pour vous désabonner de cette newsletter, <a href="${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(to)}">cliquez ici</a></p>
      </div>
    </body>
    </html>
  `;

  const message = [
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `To: ${to}`,
    'From: Joy\'s Hypnose <noreply@joyshypnose-therapies.com>',
    `Subject: ${subject}`,
    '',
    emailContent
  ].join('\n');

  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { subject, content, subscribers } = body;

    if (!subject || !content || !subscribers || !Array.isArray(subscribers)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }

    // Initialize Gmail client
    const gmail = createGmailClient();
    if (!gmail) {
      return NextResponse.json(
        { error: 'Gmail client initialization failed' },
        { status: 500 }
      );
    }

    // Send emails to all subscribers
    let successCount = 0;
    let failedCount = 0;

    for (const subscriber of subscribers) {
      if (subscriber.status === 'active' && subscriber.email) {
        const success = await sendEmail(gmail, subscriber.email, subject, content);
        if (success) {
          successCount++;
        } else {
          failedCount++;
        }
        // Add a small delay between sends to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return NextResponse.json({
      success: successCount,
      failed: failedCount,
      total: subscribers.length
    });

  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter' },
      { status: 500 }
    );
  }
} 