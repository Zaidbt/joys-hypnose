import nodemailer from 'nodemailer';
import type { TimeSlot } from '@/types/appointment';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD // Use an app-specific password
  }
});

export async function sendAppointmentNotification(appointment: TimeSlot) {
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

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: 'Nouvelle demande de rendez-vous',
    html: `
      <h2>Nouvelle demande de rendez-vous</h2>
      <p><strong>Client:</strong> ${appointment.clientName}</p>
      <p><strong>Email:</strong> ${appointment.clientEmail}</p>
      <p><strong>Téléphone:</strong> ${appointment.clientPhone}</p>
      <p><strong>Date:</strong> ${formattedDate}</p>
      <p><strong>Heure:</strong> ${formattedTime}</p>
      <p><strong>Première séance:</strong> ${appointment.isFirstTime ? 'Oui' : 'Non'}</p>
      ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
      <p>Connectez-vous au <a href="${process.env.NEXT_PUBLIC_BASE_URL}/joyspanel">panneau d'administration</a> pour gérer ce rendez-vous.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notification email sent successfully');
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw error;
  }
} 