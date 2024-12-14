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
  console.log('Starting sendAppointmentNotification with appointment:', {
    clientName: appointment.clientName,
    startTime: appointment.startTime,
    status: appointment.status
  });

  if (!gmail) {
    console.warn('Gmail client not initialized - check environment variables:', {
      clientId: process.env.GMAIL_CLIENT_ID ? 'Set' : 'Not set',
      clientSecret: process.env.GMAIL_CLIENT_SECRET ? 'Set' : 'Not set',
      redirectUri: process.env.GMAIL_REDIRECT_URI,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN ? 'Set' : 'Not set',
      adminEmail: process.env.ADMIN_EMAIL
    });
    return;
  }

  if (!process.env.ADMIN_EMAIL) {
    console.warn('ADMIN_EMAIL not configured - skipping email notification');
    return;
  }

  // Create a date object and adjust for UTC+1
  const appointmentDate = new Date(appointment.startTime);
  console.log('Original appointment time:', appointmentDate.toISOString());
  
  // Format the date and time with explicit timezone options
  const formattedDate = new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Paris'
  }).format(appointmentDate);
  
  const formattedTime = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris'
  }).format(appointmentDate);

  console.log('Formatted date and time:', { formattedDate, formattedTime });

  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .details { background-color: #ffffff; padding: 20px; border: 1px solid #e9ecef; border-radius: 8px; }
        .detail-row { margin-bottom: 10px; }
        .label { font-weight: bold; color: #495057; }
        .value { color: #212529; }
        .first-time-badge { 
          display: inline-block;
          background-color: #cce5ff;
          color: #004085;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.9em;
          margin-left: 8px;
        }
        .notes { 
          margin-top: 20px;
          padding: 15px;
          background-color: #f8f9fa;
          border-left: 4px solid #6c757d;
          border-radius: 4px;
        }
        .admin-link {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background-color: #0056b3;
          color: #ffffff;
          text-decoration: none;
          border-radius: 4px;
        }
        .admin-link:hover {
          background-color: #004494;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2 style="margin: 0; color: #0056b3;">Nouvelle demande de rendez-vous</h2>
          <p style="margin: 10px 0 0 0; color: #6c757d;">Un nouveau client souhaite prendre rendez-vous</p>
        </div>
        
        <div class="details">
          <div class="detail-row">
            <span class="label">Client:</span>
            <span class="value">${appointment.clientName}</span>
            ${appointment.isFirstTime ? '<span class="first-time-badge">Première séance</span>' : ''}
          </div>
          
          <div class="detail-row">
            <span class="label">Email:</span>
            <span class="value">${appointment.clientEmail}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Téléphone:</span>
            <span class="value">${appointment.clientPhone || 'Non renseigné'}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Date:</span>
            <span class="value">${formattedDate}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Heure:</span>
            <span class="value">${formattedTime}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Durée:</span>
            <span class="value">${appointment.isFirstTime ? '2 heures' : '1 heure'}</span>
          </div>
          
          ${appointment.notes ? `
          <div class="notes">
            <div class="label">Notes du client:</div>
            <div class="value" style="margin-top: 5px;">${appointment.notes}</div>
          </div>
          ` : ''}
        </div>

        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/joyspanel" class="admin-link">
          Accéder au panneau d'administration
        </a>
      </div>
    </body>
    </html>
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
    console.log('Sending email via Gmail API...');
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log('Notification email sent successfully, response:', response.data);
  } catch (error) {
    console.error('Error sending notification email:', error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
  }
} 