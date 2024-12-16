import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/utils/authOptions';
import { google } from 'googleapis';
import type { NewsletterSubscription } from '@/types/newsletter';
import nodemailer from 'nodemailer';

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
    const { subject, content, testEmail } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    // Configure transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      },
    });

    if (testEmail) {
      // Send test email
      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: testEmail,
        subject: subject,
        html: content,
      });
      
      return NextResponse.json({ success: true });
    }

    // Get all active subscribers
    const subscribers = await db.collection('newsletter')
      .find({ status: 'subscribed' })
      .toArray();

    // Send to all subscribers
    for (const subscriber of subscribers) {
      const unsubscribeUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
      
      const emailContentWithUnsubscribe = content + `
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            Pour vous désabonner de cette newsletter, 
            <a href="${unsubscribeUrl}" style="color: #be185d; text-decoration: underline;">cliquez ici</a>
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: subscriber.email,
        subject: subject,
        html: emailContentWithUnsubscribe,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    return NextResponse.json({ error: 'Failed to send newsletter' }, { status: 500 });
  }
} 