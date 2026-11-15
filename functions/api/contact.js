import { json, sameOrigin, clean, esc, isEmail, verifyTurnstile, sendMail, methodNotAllowed } from '../_lib/forms.js';

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ ok: false, error: 'Request not allowed.' }, 403);
  if (!(request.headers.get('content-type') || '').includes('application/json')) return json({ ok: false, error: 'Bad request.' }, 400);

  let d;
  try { d = await request.json(); } catch { return json({ ok: false, error: 'Bad request.' }, 400); }

  // Honeypot: real people never fill this hidden field. Pretend success so bots learn nothing.
  if (d.website) return json({ ok: true });

  const name = clean(d.name, 100);
  const email = clean(d.email, 254);
  const subject = clean(d.subject, 150) || 'Website enquiry';
  const message = clean(d.message, 3000);

  if (name.length < 2) return json({ ok: false, error: 'Please enter your name.' }, 400);
  if (!isEmail(email)) return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  if (message.length < 10) return json({ ok: false, error: 'Please write a little more in your message.' }, 400);

  const human = await verifyTurnstile(d['cf-turnstile-response'], request.headers.get('CF-Connecting-IP'), env.TURNSTILE_SECRET_KEY);
  if (!human) return json({ ok: false, error: 'Spam check failed. Please refresh and try again.' }, 400);

  const sent = await sendMail(env, {
    to: env.CONTACT_TO || 'care@healthytantra.com',
    replyTo: email,
    subject: `[Website contact] ${subject}`.replace(/[\r\n]+/g, ' '),
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}\n`,
    html: `<p><b>Name:</b> ${esc(name)}<br><b>Email:</b> ${esc(email)}<br><b>Subject:</b> ${esc(subject)}</p><p style="white-space:pre-wrap">${esc(message)}</p>`
  });

  if (!sent) return json({ ok: false, error: 'We could not send your message right now. Please email care@healthytantra.com directly.' }, 502);
  return json({ ok: true });
}

export const onRequest = methodNotAllowed;
