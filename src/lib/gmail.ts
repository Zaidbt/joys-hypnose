import { google } from 'googleapis';
import type { TimeSlot } from '@/types/appointment';

// Function to create Gmail client
function createGmailClient() {
  // Debug logging for environment variables
  console.log('Gmail API Configuration:', {
    clientId: process.env.GMAIL_CLIENT_ID ? 'Set' : 'Not set',
    clientSecret: process.env.GMAIL_CLIENT_SECRET ? 'Set' : 'Not set',
    redirectUri: process.env.GMAIL_REDIRECT_URI,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN ? 'Set' : 'Not set',
    adminEmail: process.env.ADMIN_EMAIL
  });

  if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET || !process.env.GMAIL_REFRESH_TOKEN) {
    return null;
  }

  try {
    // Configure OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GMAIL_CLIENT_ID,
      process.env.GMAIL_CLIENT_SECRET,
      process.env.GMAIL_REDIRECT_URI
    );

    // Set credentials
    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    // Create Gmail API client
    return google.gmail({ version: 'v1', auth: oauth2Client });
  } catch (error) {
    console.error('Error creating Gmail client:', error);
    return null;
  }
}

// Create Gmail API client
const gmail = createGmailClient();

// Test function to verify configuration
export async function sendTestEmail() {
  if (!gmail) {
    throw new Error('Gmail client not initialized - check environment variables');
  }

  if (!process.env.ADMIN_EMAIL) {
    throw new Error('ADMIN_EMAIL is not configured');
  }

  const message = [
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `To: ${process.env.ADMIN_EMAIL}`,
    'From: Joy\'s Hypnose <noreply@joyshypnose-therapies.com>',
    'Subject: Test Email - Gmail API Configuration',
    '',
    '<h1>Test Email</h1><p>If you receive this email, the Gmail API configuration is working correctly!</p>'
  ].join('\n');

  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log('Test email sent successfully, response:', response.data);
    return true;
  } catch (error) {
    console.error('Error sending test email:', error);
    throw error;
  }
}

export async function sendAppointmentNotification(appointment: TimeSlot) {
  if (!gmail) {
    console.warn('Gmail client not initialized - skipping email notification');
    return;
  }

  if (!process.env.ADMIN_EMAIL) {
    console.warn('ADMIN_EMAIL not configured - skipping email notification');
    return;
  }

  const appointmentDate = new Date(appointment.startTime);
  const formattedDate = appointmentDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const formattedTime = appointmentDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const emailContent = `
    <h2>Nouvelle demande de rendez-vous</h2>
    <p><strong>Client:</strong> ${appointment.clientName}</p>
    <p><strong>Email:</strong> ${appointment.clientEmail}</p>
    <p><strong>Téléphone:</strong> ${appointment.clientPhone}</p>
    <p><strong>Date:</strong> ${formattedDate}</p>
    <p><strong>Heure:</strong> ${formattedTime}</p>
    <p><strong>Première séance:</strong> ${appointment.isFirstTime ? 'Oui' : 'Non'}</p>
    ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
    <p>Connectez-vous au <a href="${process.env.NEXT_PUBLIC_BASE_URL}/joyspanel">panneau d'administration</a> pour gérer ce rendez-vous.</p>
  `;

  // Create email message in base64 format
  const message = [
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `To: ${process.env.ADMIN_EMAIL}`,
    'From: Joy\'s Hypnose <noreply@joyshypnose-therapies.com>',
    'Subject: Nouvelle demande de rendez-vous',
    '',
    emailContent
  ].join('\n');

  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log('Notification email sent successfully, response:', response.data);
  } catch (error) {
    console.error('Error sending notification email:', error);
    // Don't throw error, just log it
  }
} 