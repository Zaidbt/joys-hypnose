import { google } from 'googleapis';
import type { NewsItem } from '@/types/news';

// Cache for the OAuth2 client
let oauth2ClientCache: any = null;
let lastTokenRefresh: number = 0;
const TOKEN_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

async function getOAuth2Client() {
  const now = Date.now();
  
  if (oauth2ClientCache && (now - lastTokenRefresh) < TOKEN_REFRESH_INTERVAL) {
    return oauth2ClientCache;
  }

  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );

  try {
    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    await oauth2Client.getAccessToken();
    
    oauth2ClientCache = oauth2Client;
    lastTokenRefresh = now;
    
    return oauth2Client;
  } catch (error) {
    console.error('Error refreshing Gmail token:', error);
    throw new Error('Failed to refresh Gmail token');
  }
}

interface EventRegistration {
  _id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventPrice?: number;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  notes?: string;
  isOnline: boolean;
  createdAt: Date;
}

export async function sendParticipantConfirmation(registration: EventRegistration, event: NewsItem) {
  const gmail = google.gmail({ version: 'v1', auth: await getOAuth2Client() });
  if (!gmail) {
    console.warn('Gmail client not initialized - skipping participant confirmation');
    return;
  }

  const eventDate = new Date(event.eventDate);
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
  
  const formattedDate = formatter.format(eventDate);
  const formattedTime = timeFormatter.format(eventDate);

  // Create Google Calendar event link
  const eventTitle = encodeURIComponent(`${event.title} - Joy's Hypnose`);
  const eventLocation = encodeURIComponent(event.eventLocation || "");
  const eventDescription = encodeURIComponent(`${event.excerpt || ''}\n\n${event.isOnline ? 'Événement en ligne' : `Lieu: ${event.eventLocation}`}`);
  const startTime = eventDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, 'Z');
  const endTime = event.eventEndDate ? 
    new Date(event.eventEndDate).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, 'Z') :
    new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, 'Z');
  const calendarLink = `https://www.google.com/calendar/event?action=TEMPLATE&text=${eventTitle}&dates=${startTime}/${endTime}&details=${eventDescription}&location=${eventLocation}&sf=true`;

  const participantEmailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .content { background-color: #f7fafc; padding: 20px; border-radius: 8px; }
        .event-details { background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0; }
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
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #6b46c1; margin-bottom: 10px;">Joy's Hypnose</h1>
          <p style="font-size: 18px; color: #4a5568;">Confirmation d'inscription à l'événement</p>
        </div>

        <div class="content">
          <p>Cher(e) ${registration.participantName},</p>
          
          <p>Nous vous confirmons votre inscription à l'événement "${event.title}".</p>
          
          <div class="event-details">
            <p><strong>Date :</strong> ${formattedDate}</p>
            <p><strong>Heure :</strong> ${formattedTime}</p>
            ${event.isOnline ? `
            <div style="background-color: #ebf8ff; padding: 15px; border-radius: 6px; margin: 10px 0;">
              <p><strong>Événement en ligne via Zoom</strong></p>
              <p><strong>Le lien de connexion vous sera envoyé 24h avant l'événement.</strong></p>
            </div>
            ` : `
            <p><strong>Lieu :</strong> ${event.eventLocation}</p>
            `}
            ${event.eventPrice ? `<p><strong>Tarif :</strong> ${event.eventPrice} DH</p>` : ''}
          </div>

          <div style="text-align: center;">
            <a href="${calendarLink}" class="calendar-button" target="_blank">
              Ajouter à mon calendrier Google
            </a>
          </div>

          <p style="margin-top: 20px;">Pour toute question, n'hésitez pas à me contacter :</p>
          <ul style="list-style: none; padding: 0;">
            <li style="margin: 5px 0;">📞 Téléphone : +212 660-826028</li>
            <li style="margin: 5px 0;">✉️ Email : joyshypnose@gmail.com</li>
          </ul>
        </div>

        <div class="footer">
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

  const participantMessage = [
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `To: ${registration.participantEmail}`,
    'From: Joy\'s Hypnose <noreply@joyshypnose-therapies.com>',
    'Subject: Confirmation de votre inscription - Joy\'s Hypnose',
    '',
    participantEmailContent
  ].join('\n');

  const encodedParticipantMessage = Buffer.from(participantMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedParticipantMessage,
      },
    });
    console.log('Participant confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending participant confirmation email:', error);
  }
}

export async function sendAdminNotification(registration: EventRegistration, event: NewsItem) {
  const gmail = google.gmail({ version: 'v1', auth: await getOAuth2Client() });
  if (!gmail) {
    console.warn('Gmail client not initialized - skipping admin notification');
    return;
  }

  const eventDate = new Date(event.eventDate);
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
  
  const formattedDate = formatter.format(eventDate);
  const formattedTime = timeFormatter.format(eventDate);

  const adminEmailContent = `
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
          <h2 style="margin: 0; color: #0056b3;">Nouvelle inscription à un événement</h2>
          <p style="margin: 10px 0 0 0; color: #6c757d;">${event.title}</p>
        </div>
        
        <div class="details">
          <div class="detail-row">
            <span class="label">Participant :</span>
            <span class="value">${registration.participantName}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Email :</span>
            <span class="value">${registration.participantEmail}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Téléphone :</span>
            <span class="value">${registration.participantPhone}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Date :</span>
            <span class="value">${formattedDate}</span>
          </div>
          
          <div class="detail-row">
            <span class="label">Heure :</span>
            <span class="value">${formattedTime}</span>
          </div>

          ${event.isOnline ? `
          <div class="detail-row" style="background-color: #ebf8ff; padding: 15px; border-radius: 6px; margin: 10px 0;">
            <span class="label">Événement en ligne</span>
          </div>
          ` : `
          <div class="detail-row">
            <span class="label">Lieu :</span>
            <span class="value">${event.eventLocation}</span>
          </div>
          `}
          
          ${registration.notes ? `
          <div class="notes">
            <div class="label">Notes du participant :</div>
            <div class="value" style="margin-top: 5px;">${registration.notes}</div>
          </div>
          ` : ''}
        </div>

        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/joyspanel/event-registrations" class="admin-link">
          Accéder aux inscriptions
        </a>
      </div>
    </body>
    </html>
  `;

  const adminMessage = [
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `To: ${process.env.ADMIN_EMAIL}`,
    'From: Joy\'s Hypnose <noreply@joyshypnose-therapies.com>',
    `Subject: Nouvelle inscription - ${event.title}`,
    '',
    adminEmailContent
  ].join('\n');

  const encodedAdminMessage = Buffer.from(adminMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedAdminMessage,
      },
    });
    console.log('Admin notification email sent successfully');
  } catch (error) {
    console.error('Error sending admin notification email:', error);
  }
}

export async function sendEventEmails(registration: EventRegistration, event: NewsItem) {
  try {
    // Send confirmation to participant
    await sendParticipantConfirmation(registration, event);
    
    // Send notification to admin
    await sendAdminNotification(registration, event);
  } catch (error) {
    console.error('Error sending event emails:', error);
    throw error;
  }
} 