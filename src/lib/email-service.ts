
'use server';

import nodemailer from 'nodemailer';

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(options: MailOptions): Promise<boolean> {
  // Check if SMTP is configured. If not, log to console and return success (for development).
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("--- SIMULATED EMAIL (SMTP not configured) ---");
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log("--- Body ---");
    console.log(options.html);
    console.log("-----------------------------------------");
    return true; // Simulate success
  }

  try {
    await transporter.sendMail({
      from: `"EduDesk" <${process.env.SMTP_FROM_EMAIL}>`, // sender address
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log(`Email sent successfully to ${options.to}`);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}
