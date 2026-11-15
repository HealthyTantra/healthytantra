import { json, sameOrigin, clean, esc, isEmail, normalizeMobile, isGST, verifyTurnstile, sendMail, methodNotAllowed } from '../_lib/forms.js';

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) return json({ ok: false, error: 'Request not allowed.' }, 403);
  if (!(request.headers.get('content-type') || '').includes('application/json')) return json({ ok: false, error: 'Bad request.' }, 400);

  let d;
  try { d = await request.json(); } catch { return json({ ok: false, error: 'Bad request.' }, 400); }

  if (d.website) return json({ ok: true }); // honeypot

  const name = clean(d.name, 100);
  const brand = clean(d.brand, 150);
  const gst = clean(d.gst, 20).toUpperCase().replace(/\s+/g, '');
  const email = clean(d.email, 254);
  const mobile = normalizeMobile(clean(d.mobile, 20));
  const TIMES = ['Any time', 'Morning (9 am - 12 pm)', 'Afternoon (12 pm - 4 pm)', 'Evening (4 pm - 7 pm)'];
  const calltime = TIMES.includes(d.calltime) ? d.calltime : 'Any time';

  if (name.length < 2) return json({ ok: false, error: 'Please enter your name.' }, 400);
  if (!mobile) return json({ ok: false, error: 'Please enter a valid 10-digit Indian mobile number.' }, 400);
  if (brand.length < 2) return json({ ok: false, error: 'Please enter your brand or company name.' }, 400);
  if (gst && !isGST(gst)) return json({ ok: false, error: 'That GST number does not look right. Please check it or leave it blank.' }, 400);
  if (email && !isEmail(email)) return json({ ok: false, error: 'Please enter a valid email address or leave it blank.' }, 400);
  if (d.consent !== 'yes' && d.consent !== 'on' && d.consent !== true) return json({ ok: false, error: 'Please tick the consent box so we can contact you.' }, 400);

  const human = await verifyTurnstile(d['cf-turnstile-response'], request.headers.get('CF-Connecting-IP'), env.TURNSTILE_SECRET_KEY);
  if (!human) return json({ ok: false, error: 'Spam check failed. Please refresh and try again.' }, 400);

  const sent = await sendMail(env, {
    to: env.SELLER_TO || 'sellers@healthytantra.com',
    replyTo: email || undefined,
    subject: `[Seller enquiry] ${brand}`.replace(/[\r\n]+/g, ' '),
    text: `New brand / seller enquiry\n\nName: ${name}\nMobile: ${mobile}\nBrand / Company: ${brand}\nGST: ${gst || 'Not provided'}\nEmail: ${email || '-'}\nBest time to call (IST): ${calltime}\n`,
    html: `<h3>New brand / seller enquiry</h3><p><b>Name:</b> ${esc(name)}<br><b>Mobile:</b> ${esc(mobile)}<br><b>Brand / Company:</b> ${esc(brand)}<br><b>GST:</b> ${esc(gst || 'Not provided')}<br><b>Email:</b> ${esc(email || '-')}<br><b>Best time to call (IST):</b> ${esc(calltime)}</p>`
  });

  if (!sent) return json({ ok: false, error: 'We could not send your details right now. Please email sellers@healthytantra.com directly.' }, 502);
  return json({ ok: true });
}

export const onRequest = methodNotAllowed;
