import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import type { TimeSlot } from '@/types/appointment';

// Cache for the OAuth2 client
let oauth2ClientCache: any = null;
let lastTokenRefresh: number = 0;
const TOKEN_REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes

async function getOAuth2Client() {
  const now = Date.now();
  
  // If we have a cached client and the token was refreshed recently, return it
  if (oauth2ClientCache && (now - lastTokenRefresh) < TOKEN_REFRESH_INTERVAL) {
    return oauth2ClientCache;
  }

  // Create a new OAuth2 client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI
  );

  try {
    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN
    });

    // Force a token refresh
    await oauth2Client.getAccessToken();
    
    // Update cache
    oauth2ClientCache = oauth2Client;
    lastTokenRefresh = now;
    
    return oauth2Client;
  } catch (error) {
    console.error('Error refreshing Gmail token:', error);
    throw new Error('Failed to refresh Gmail token');
  }
}

async function sendClientConfirmation(appointment: TimeSlot) {
  const gmail = google.gmail({ version: 'v1', auth: await getOAuth2Client() });
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
            ${appointment.isOnline ? `
            <div style="background-color: #ebf8ff; padding: 15px; border-radius: 6px; margin: 10px 0;">
              <p style="margin: 5px 0;"><strong>Session en ligne via Zoom</strong></p>
              <p style="margin: 5px 0;"><strong>Lien Zoom :</strong> <a href="https://us06web.zoom.us/j/3796260037?pwd=REJzUHl5YWVTOENLWUU2bCs0RVVMQT09" style="color: #4299e1; text-decoration: none;">Cliquez ici pour rejoindre</a></p>
              <p style="margin: 5px 0;"><strong>ID de réunion :</strong> 379 626 0037</p>
              <p style="margin: 5px 0;"><strong>Code secret :</strong> D99WQ6</p>
              <p style="margin: 10px 0; font-style: italic; color: #4a5568;">Veuillez tester votre connexion et votre équipement quelques minutes avant la séance.</p>
            </div>
            ` : `
            <p style="margin: 5px 0;"><strong>Lieu :</strong> 17 Rue Bab El Mandab, Residence El Prado 2,<br>1er étage appart #2 Bourgogne,<br>Casablanca</p>
            `}
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

async function sendConfirmationEmail(appointment: TimeSlot) {
  const gmail = google.gmail({ version: 'v1', auth: await getOAuth2Client() });
  if (!gmail) {
    console.warn('Gmail client not initialized - skipping confirmation email');
    return;
  }

  console.log('Starting sendConfirmationEmail with appointment:', {
    clientName: appointment.clientName,
    clientEmail: appointment.clientEmail,
    startTime: appointment.startTime,
    status: appointment.status
  });

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

  const confirmationEmailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .content { background-color: #f7fafc; padding: 20px; border-radius: 8px; }
        .details { background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .warning { 
          background-color: #fff5f5; 
          border-left: 4px solid #f56565;
          padding: 15px;
          margin: 20px 0;
          border-radius: 6px;
        }
        .social-links {
          margin: 20px 0;
          text-align: center;
        }
        .social-links a {
          color: #6b46c1;
          text-decoration: none;
          margin: 0 10px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-style: italic;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #6b46c1; margin-bottom: 10px;">Joy's Hypnose</h1>
          <p style="font-size: 18px; color: #4a5568;">Confirmation de votre rendez-vous</p>
        </div>

        <div class="content">
          <p>Bonjour ${appointment.clientName},</p>
          
          <p>Nous vous confirmons votre rendez-vous pour une séance d'hypnose transformative. Voici les détails :</p>
          
          <div class="details">
            <p><strong>Date :</strong> ${formattedDate}</p>
            <p><strong>Heure :</strong> ${formattedTime}</p>
            ${appointment.isOnline ? `
            <div style="background-color: #ebf8ff; padding: 15px; border-radius: 6px; margin: 10px 0;">
              <p><strong>Session en ligne via Zoom</strong></p>
              <p><strong>Lien Zoom :</strong> <a href="https://us06web.zoom.us/j/3796260037?pwd=REJzUHl5YWVTOENLWUU2bCs0RVVMQT09">Cliquez ici pour rejoindre</a></p>
              <p><strong>ID de réunion :</strong> 379 626 0037</p>
              <p><strong>Code secret :</strong> D99WQ6</p>
            </div>
            ` : `
            <p><strong>Adresse :</strong> 17 Rue Bab El Mandab, Residence El Prado 2,<br>1er étage appart #2 Bourgogne,<br>Casablanca</p>
            `}
          </div>

          <div class="warning">
            <p style="margin: 0;"><strong>Important :</strong></p>
            <p style="margin-top: 10px;">Nous apprécions le temps de chacun et vous remercions de prendre cette confirmation au sérieux. Si vous devez annuler, nous vous prions de le faire au moins 24 heures avant la séance. Dans le cas contraire, un montant de 200 DH sera requis pour un futur rendez-vous.</p>
          </div>

          ${appointment.isFirstTime ? `
          <div style="background-color: #ebf4ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="color: #4c51bf;"><strong>Information importante :</strong></p>
            <p>Pour votre première séance, prévoyez d'arriver 5-10 minutes en avance pour vous installer confortablement.</p>
            <p>La séance dure environ 2 heures.</p>
          </div>
          ` : `
          <div style="background-color: #ebf4ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p>La séance dure environ 1 heure 30.</p>
          </div>
          `}

          <p>N'hésitez pas à visiter notre site pour découvrir plus d'informations, et suivez-nous sur Instagram pour rester à l'affût des retraites et ateliers à venir prochainement.</p>

          <div class="social-links">
            <a href="https://www.joyshypnose-therapies.com">Notre site web</a> |
            <a href="https://www.instagram.com/joys_hypnose">Instagram</a>
          </div>

          <p>Nous vous remercions pour votre compréhension et avons hâte de vous retrouver bientôt !</p>
        </div>

        <div class="footer">
          <p>"Ouvrez la porte à la transformation, un souffle à la fois !"</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const confirmationMessage = [
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `To: ${appointment.clientEmail}`,
    'From: Joy\'s Hypnose <noreply@joyshypnose-therapies.com>',
    'Subject: Confirmation de votre rendez-vous - Joy\'s Hypnose',
    '',
    confirmationEmailContent
  ].join('\n');

  const encodedConfirmationMessage = Buffer.from(confirmationMessage)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedConfirmationMessage,
      },
    });
    console.log('Confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
}

export async function sendAppointmentNotification(appointment: TimeSlot) {
  console.log('Starting sendAppointmentNotification with appointment:', {
    clientName: appointment.clientName,
    startTime: appointment.startTime,
    status: appointment.status
  });

  const gmail = google.gmail({ version: 'v1', auth: await getOAuth2Client() });
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

          ${appointment.isOnline ? `
          <div class="detail-row" style="background-color: #ebf8ff; padding: 15px; border-radius: 6px; margin: 10px 0;">
            <div style="margin-bottom: 10px;">
              <span class="label">Session en ligne via Zoom</span>
            </div>
            <div style="margin: 5px 0;">
              <span class="label">Lien :</span>
              <span class="value"><a href="https://us06web.zoom.us/j/3796260037?pwd=REJzUHl5YWVTOENLWUU2bCs0RVVMQT09" style="color: #4299e1; text-decoration: none;">https://us06web.zoom.us/j/3796260037</a></span>
            </div>
            <div style="margin: 5px 0;">
              <span class="label">ID de réunion :</span>
              <span class="value">379 626 0037</span>
            </div>
            <div style="margin: 5px 0;">
              <span class="label">Code secret :</span>
              <span class="value">D99WQ6</span>
            </div>
          </div>
          ` : ''}

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

export async function testEmailConfig() {
  try {
    const oauth2Client = await getOAuth2Client();
    if (!oauth2Client) {
      return {
        success: false,
        error: 'Failed to initialize OAuth2 client',
        emailAddress: null
      };
    }

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });

    return {
      success: true,
      error: null,
      emailAddress: profile.data.emailAddress
    };
  } catch (error) {
    console.error('Error testing Gmail configuration:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      emailAddress: null
    };
  }
}

// Log current Gmail configuration
console.log('Gmail Configuration:', {
  clientId: process.env.GMAIL_CLIENT_ID || 'Not set',
  clientSecret: process.env.GMAIL_CLIENT_SECRET ? 'Set' : 'Not set',
  redirectUri: process.env.GMAIL_REDIRECT_URI,
  refreshToken: process.env.GMAIL_REFRESH_TOKEN ? 'Set' : 'Not set',
  adminEmail: process.env.ADMIN_EMAIL
});

export async function sendEmail(to: string, subject: string, htmlContent: string) {
  const gmail = google.gmail({ version: 'v1', auth: await getOAuth2Client() });
  if (!gmail) {
    console.warn('Gmail client not initialized - skipping email');
    return;
  }

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

  try {
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export { sendConfirmationEmail };