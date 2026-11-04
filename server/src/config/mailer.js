import nodemailer from 'nodemailer';

function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }

  return null;
}

const transport = createTransport();

export async function sendMail(options) {
  // If SMTP is not configured or disabled, skip gracefully
  if (!transport || process.env.ENABLE_EMAIL === 'false') {
    return { skipped: true, reason: 'Email disabled — notifications handled via in-app & push' };
  }

  try {
    const info = await transport.sendMail({
      from: process.env.MAIL_FROM || 'noreply@fitsync.app',
      ...options,
    });
    return info;
  } catch (err) {
    console.warn('[MAIL] Send error:', err.message);
    return { error: err.message };
  }
}
