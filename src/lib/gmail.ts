import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Initialize the Gmail API client
const createGmailClient = () => {
  try {
    const oauth2Client = new OAuth2Client(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      'https://joyshypnose-therapies.com/api/gmail/auth'
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    return google.gmail({ version: 'v1', auth: oauth2Client });
  } catch (error) {
    console.error('Error creating Gmail client:', error);
    throw error;
  }
};

// Function to send email
export async function sendEmail(to: string, subject: string, htmlContent: string) {
  try {
    const gmail = createGmailClient();
    
    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `From: Joy's Hypnose <${process.env.ADMIN_EMAIL}>`,
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      htmlContent
    ];
    const message = messageParts.join('\n');
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Test function to verify email configuration
export async function testEmailConfig() {
  try {
    const gmail = createGmailClient();
    const response = await gmail.users.getProfile({ userId: 'me' });
    return {
      success: true,
      emailAddress: response.data.emailAddress,
      messagesTotal: response.data.messagesTotal
    };
  } catch (error) {
    console.error('Error testing email configuration:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}