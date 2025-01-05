import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

// Initialize the Gmail API client with service account
const createGmailClient = () => {
  try {
    const auth = new JWT({
      email: process.env.GMAIL_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GMAIL_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/gmail.send'],
      subject: process.env.GMAIL_SENDER_EMAIL // The email address you want to send from
    });

    return google.gmail({ version: 'v1', auth });
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
      `From: ${process.env.GMAIL_SENDER_EMAIL}`,
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