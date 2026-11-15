// Shared helpers for the form endpoints (Cloudflare Pages Functions).
// Secrets come from Cloudflare environment variables, never from the code:
//   RESEND_API_KEY, TURNSTILE_SECRET_KEY, MAIL_FROM, CONTACT_TO, SELLER_TO

export function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff'
    }
  });
}

// Only accept requests that come from our own pages.
export function sameOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  return origin === new URL(request.url).origin;
}

export function clean(value, max) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, max);
}

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export const isEmail = (s) => /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]{2,}$/.test(s) && s.length <= 254;

// Indian mobile numbers: optional +91 / 0, then 10 digits starting 6-9.
export function normalizeMobile(s) {
  const d = String(s).replace(/[\s\-()]/g, '').replace(/^(\+91|91|0)/, '');
  return /^[6-9]\d{9}$/.test(d) ? '+91' + d : null;
}

// GSTIN: 15 characters, e.g. 07ABCDE1234F1Z5
export const isGST = (s) => /^[0-3][0-9][A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(s);

export async function verifyTurnstile(token, ip, secret) {
  if (!secret) return false;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const j = await r.json();
    return j.success === true;
  } catch {
    return false;
  }
}

export async function sendMail(env, { to, replyTo, subject, text, html }) {
  if (!env.RESEND_API_KEY) return false;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: env.MAIL_FROM || 'Healthy Tantra Website <website@healthytantra.com>',
        to: [to],
        reply_to: replyTo,
        subject,
        text,
        html
      })
    });
    return r.ok;
  } catch {
    return false;
  }
}

export const methodNotAllowed = () => json({ ok: false, error: 'Method not allowed' }, 405);
