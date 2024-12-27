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

async function sendClientConfirmation(appointment: TimeSlot) {
  if (!gmail) {
    console.warn('Gmail client not initialized - skipping client confirmation');
    return;
  }

  const appointmentDate = new Date(appointment.startTime);
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Africa/Casablanca',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Africa/Casablanca',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  const formattedDate = formatter.format(appointmentDate);
  const formattedTime = timeFormatter.format(appointmentDate);

  // Create Google Calendar event link
  const eventTitle = encodeURIComponent(`Séance d'hypnothérapie - Joy's Hypnose`);
  const eventLocation = encodeURIComponent("17 Rue Bab El Mandab, Residence El Prado 2, 1er étage appart #2 Bourgogne, Casablanca");
  const eventDescription = encodeURIComponent(`Rendez-vous d'hypnothérapie avec Joy's Hypnose\n${appointment.isFirstTime ? 'Première séance' : 'Séance de suivi'}`);
  const startTime = appointmentDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, 'Z');
  const endTime = new Date(appointmentDate.getTime() + (appointment.isFirstTime ? 120 : 90) * 60000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, 'Z');
  const calendarLink = `https://www.google.com/calendar/event?action=TEMPLATE&text=${eventTitle}&dates=${startTime}/${endTime}&details=${eventDescription}&location=${eventLocation}&sf=true`;

  const clientEmailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .calendar-button {
          display: inline-block;
          background-color: #4285f4;
          color: white !important;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          margin: 20px 0;
        }
        .calendar-button:hover {
          background-color: #3367d6;
        }
      </style>
    </head>
    <body>
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #6b46c1; margin-bottom: 10px;">Joy's Hypnose</h1>
          <p style="font-size: 18px; color: #4a5568;">Confirmation de rendez-vous</p>
        </div>

        <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin-bottom: 15px;">Cher(e) ${appointment.clientName},</p>
          <p style="margin-bottom: 15px;">Je vous confirme votre rendez-vous d'hypnothérapie :</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Date :</strong> ${formattedDate}</p>
            <p style="margin: 5px 0;"><strong>Heure :</strong> ${formattedTime}</p>
            <p style="margin: 5px 0;"><strong>Lieu :</strong> 17 Rue Bab El Mandab, Residence El Prado 2,<br>1er étage appart #2 Bourgogne,<br>Casablanca</p>
          </div>

          <div style="text-align: center;">
            <a href="${calendarLink}" class="calendar-button" target="_blank">
              Ajouter à mon calendrier Google
            </a>
          </div>

          ${appointment.isFirstTime ? `
          <div style="background-color: #ebf4ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 5px 0; color: #4c51bf;"><strong>Information importante :</strong></p>
            <p style="margin: 5px 0;">Pour votre première séance, prévoyez d'arriver 5-10 minutes en avance pour vous installer confortablement.</p>
          </div>
          ` : ''}

          <p style="margin-top: 20px;">Pour toute question ou besoin de modification, n'hésitez pas à me contacter :</p>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 5px 0;">📞 Téléphone : +212 660-826028</li>
            <li style="margin: 5px 0;">✉️ Email : joyshypnose@gmail.com</li>
          </ul>
        </div>

        <div style="text-align: center; color: #718096; font-size: 14px; margin-top: 30px;">
          <p>À très bientôt,</p>
          <p style="font-weight: bold;">Joy's Hypnose</p>
          <p style="margin-top: 15px;">
            <a href="https://www.joyshypnose-therapies.com" style="color: #6b46c1; text-decoration: none;">www.joyshypnose-therapies.com</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  const clientMessage = [
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `To: ${appointment.clientEmail}`,
    'From: Joy\'s Hypnose <noreply@joyshypnose-therapies.com>',
    'Subject: Confirmation de votre rendez-vous - Joy\'s Hypnose',
    '',
    clientEmailContent
  ].join('\n');

  const encodedClientMessage = Buffer.from(clientMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedClientMessage,
      },
    });
    console.log('Client confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending client confirmation email:', error);
    // Don't throw error to not block admin notification
  }
}

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

  // Create a date object and use it directly
  const appointmentDate = new Date(appointment.startTime);
  console.log('Appointment time:', appointmentDate.toISOString());
  
  // Format the date and time with Morocco timezone
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Africa/Casablanca',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Africa/Casablanca',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  const formattedDate = formatter.format(appointmentDate);
  const formattedTime = timeFormatter.format(appointmentDate);

  console.log('Formatted date and time:', { formattedDate, formattedTime });

  // Create Google Calendar event link for admin
  const eventTitle = encodeURIComponent(`RDV - ${appointment.clientName}`);
  const eventLocation = encodeURIComponent("17 Rue Bab El Mandab, Residence El Prado 2, 1er étage appart #2 Bourgogne, Casablanca");
  const eventDescription = encodeURIComponent(`Rendez-vous avec ${appointment.clientName}\nTéléphone: ${appointment.clientPhone || 'Non renseigné'}\nEmail: ${appointment.clientEmail}\nNotes: ${appointment.notes || 'Aucune'}`);
  const startTime = appointmentDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, 'Z');
  const endTime = new Date(appointmentDate.getTime() + (appointment.isFirstTime ? 120 : 90) * 60000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, 'Z');
  
  const calendarLink = `https://www.google.com/calendar/event?action=TEMPLATE&text=${eventTitle}&dates=${startTime}/${endTime}&details=${eventDescription}&location=${eventLocation}&sf=true`;

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
        .calendar-button {
          display: inline-block;
          background-color: #4285f4;
          color: white !important;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          margin: 20px 0;
        }
        .calendar-button:hover {
          background-color: #3367d6;
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
            <span class="value">${appointment.isFirstTime ? '2 heures' : '1 heure 30'}</span>
          </div>

          <div style="text-align: center;">
            <a href="${calendarLink}" class="calendar-button" target="_blank">
              Ajouter à mon calendrier Google
            </a>
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
    console.log('Sending admin notification email...');
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log('Admin notification email sent successfully');

    // Send client confirmation email
    console.log('Sending client confirmation email...');
    await sendClientConfirmation(appointment);
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw error;
  }
}