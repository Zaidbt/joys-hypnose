import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import clientPromise from '@/lib/mongodb';
import { google } from 'googleapis';

async function sendEmail(gmail: any, to: string, subject: string, htmlContent: string) {
  try {
    const message = [
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `To: ${to}`,
      'From: Joy\'s Hypnose <noreply@joyshypnose-therapies.com>',
      `Subject: ${subject}`,
      '',
      htmlContent
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

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
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { subject, content, subscribers } = await request.json();

    if (!subject || !content || !Array.isArray(subscribers)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Create Gmail OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    let successCount = 0;
    let failedCount = 0;

    // Send to each subscriber
    for (const subscriber of subscribers) {
      try {
        if (!subscriber.email) continue;

        const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
        
        const emailContentWithUnsubscribe = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff;">
            ${content}
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">
                Pour vous désabonner de cette newsletter, 
                <a href="${unsubscribeUrl}" style="color: #be185d; text-decoration: underline;">cliquez ici</a>
              </p>
            </div>
          </div>
        `;

        const success = await sendEmail(gmail, subscriber.email, subject, emailContentWithUnsubscribe);
        
        if (success) {
          successCount++;
        } else {
          failedCount++;
        }
        
        // Add a small delay between sends to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error sending to subscriber:', subscriber.email, error);
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        success: successCount,
        failed: failedCount,
        total: subscribers.length
      }
    });

  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json(
      { error: 'Failed to send newsletter', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 