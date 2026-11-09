import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../config/env';
import { log } from '../lib/logger';

let transporter: Transporter | null | undefined;

function getTransporter(): Transporter | null {
  if (transporter !== undefined) {
    return transporter;
  }
  if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) {
    transporter = null;
    return transporter;
  }
  transporter = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: {
      user: env.smtp.user,
      pass: env.smtp.pass,
    },
  });
  return transporter;
}

export function isMailConfigured(): boolean {
  return Boolean(env.smtp.host && env.smtp.user && env.smtp.pass);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export interface ContactMessage {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export async function sendContactMessage(input: ContactMessage): Promise<void> {
  const mailer = getTransporter();
  if (!mailer) {
    throw new Error('SMTP is not configured');
  }

  const subject = input.subject?.trim() || 'New Webcraft contact message';
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#111827">
      <h2 style="margin:0 0 16px">New Webcraft message</h2>
      <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0" />
      <p style="white-space:pre-wrap">${escapeHtml(input.message)}</p>
    </div>
  `;

  await mailer.sendMail({
    from: env.smtp.from || env.smtp.user,
    to: env.adminEmail,
    replyTo: input.email,
    subject: `[Webcraft] ${subject}`,
    text: `Name: ${input.name}\nEmail: ${input.email}\nSubject: ${subject}\n\n${input.message}`,
    html,
  });

  log('info', 'contact_email_sent', { from: input.email });
}
