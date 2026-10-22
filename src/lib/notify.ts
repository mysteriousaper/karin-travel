import type { Enquiry } from '@prisma/client';
import { parseJson } from './utils';

const KIND_LABEL: Record<string, string> = {
  tour: 'Tour',
  air: 'Air tickets',
  hotel: 'Hotel',
  visa: 'Visa',
  social: 'Social package',
  general: 'General',
};

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function enquiryText(e: Enquiry, html = false) {
  const esc = html ? escapeHtml : (s: string) => s;
  const b = (s: string) => (html ? `<b>${s}</b>` : s);
  const details = parseJson<Record<string, string>>(e.details, {});
  const phone = e.phone.replace(/[^\d+]/g, '');
  const lines = [
    `${b('New enquiry')} · ${KIND_LABEL[e.kind] ?? e.kind}${e.tourTitle ? ` — ${esc(e.tourTitle)}` : ''}`,
    '',
    `${b('Name:')} ${esc(e.name)}`,
    `${b('Phone:')} ${esc(e.phone)}`,
    `${b('Reply via:')} ${e.messenger}`,
  ];
  if (e.dates) lines.push(`${b('Dates:')} ${esc(e.dates)}`);
  if (e.travelers) lines.push(`${b('Travelers:')} ${esc(e.travelers)}`);
  for (const [k, v] of Object.entries(details)) if (v) lines.push(`${b(`${k}:`)} ${esc(String(v))}`);
  if (e.message) lines.push('', esc(e.message));
  lines.push('', `Language: ${e.locale.toUpperCase()}${e.source ? ` · ${esc(e.source)}` : ''}`);
  if (html) lines.push(`WhatsApp: https://wa.me/${phone.replace('+', '')}`);
  return lines.join('\n');
}

async function sendTelegram(e: Enquiry) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: enquiryText(e, true),
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) console.error('[telegram]', res.status, await res.text());
  return res.ok;
}

async function sendEmail(e: Enquiry) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL_TO, NOTIFY_EMAIL_FROM } = process.env;
  if (!SMTP_HOST || !NOTIFY_EMAIL_TO) return false;
  const nodemailer = await import('nodemailer');
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT) === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  await transport.sendMail({
    from: NOTIFY_EMAIL_FROM || SMTP_USER,
    to: NOTIFY_EMAIL_TO,
    subject: `New enquiry: ${e.name} — ${e.tourTitle ?? KIND_LABEL[e.kind] ?? e.kind}`,
    text: enquiryText(e),
  });
  return true;
}

/** Sends the enquiry to every configured channel. Never throws. */
export async function notifyEnquiry(e: Enquiry) {
  const results = await Promise.allSettled([sendTelegram(e), sendEmail(e)]);
  results.forEach((r) => r.status === 'rejected' && console.error('[notify]', r.reason));
  return results.some((r) => r.status === 'fulfilled' && r.value === true);
}
