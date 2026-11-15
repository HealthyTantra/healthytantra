# Healthy Tantra website

Static website built from shared templates. No runtime dependencies: nothing to install, nothing third-party to attack.
Hosted on Cloudflare Pages. Forms use Cloudflare Pages Functions.

## Daily use
```
node build.js           # build src/ + public/ into dist/
node build.js --check   # build, then run the quality and security checks (must show 0 errors)
npm run dev             # build and preview at http://localhost:8788
```

## Where things live
| Change this | Edit this file | Affects |
|---|---|---|
| Menu / logo / Download App button | `src/partials/header.html` | every page |
| Footer links | `src/partials/footer.html` | every page |
| Mobile bottom app bar | `src/partials/mobile-bar.html` | every page |
| Page shell, meta tags, scripts | `src/layout.html` | every page |
| A page's content, title, description | `src/pages/<name>.html` | that page only |
| App-download banner (text, Diwali greeting) | `public/js/app-banner.js` | every page (desktop) |
| Sizes (header, bottom bar) | top of `public/css/style.css` (`--header-h`, `--bottom-bar-h`) | layout |
| Security headers / CSP | `public/_headers` | every response |
| Redirects | `public/_redirects` | old URLs |

A new page = a new file in `src/pages/` starting with:
```
---
title: Page title | Healthy Tantra
description: 50-160 characters describing the page.
---
<section>...</section>
```
`about.html` becomes `/about`, `consult/ayurveda.html` becomes `/consult/ayurveda`. Sitemap, canonical URL and robots.txt are generated automatically.
Use `robots: noindex, follow` and `sitemap: false` in the front matter for pages that should stay out of Google.

Rules (the check enforces them): no inline `<script>` or `onclick=`, no `http://` links, every link and image must exist with exact upper/lower case, one `<h1>` per page, unique titles, no placeholder text.

Seasonal decorations (such as the Diwali lights) are kept in `docs/seasonal/` with their CSS and markup, ready to reuse.

## Cloudflare Pages settings
- Build command: `node build.js`   Output directory: `dist`   Environment variable `NODE_VERSION` = `22`
- Build variable: `TURNSTILE_SITE_KEY` (public key from Cloudflare Turnstile)
- Secrets (Settings, Variables and Secrets, encrypted): `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`
- Optional: `MAIL_FROM` (default `Healthy Tantra Website <website@healthytantra.com>`), `CONTACT_TO` (default `care@healthytantra.com`), `SELLER_TO` (default `sellers@healthytantra.com`)

## One-time setup checklist
1. **Turnstile:** Cloudflare dashboard, Turnstile, add site `www.healthytantra.com`; copy the site key and secret key into the variables above.
2. **Email sending (Resend):** create an account, add the domain `healthytantra.com`, add the SPF and DKIM DNS records it shows in Cloudflare DNS, create an API key.
3. **Mailboxes:** make sure `care@` and `sellers@healthytantra.com` really receive mail (Cloudflare Email Routing or your mail host). Send a test.
4. **Main address:** Cloudflare, Rules, Redirect Rules: `healthytantra.com/*` to `https://www.healthytantra.com/${1}` (301).
5. **HTTPS:** SSL/TLS mode Full (strict), Always Use HTTPS on, Minimum TLS 1.2, DNSSEC on.
6. **Abuse protection:** Security, WAF, Rate limiting rule: `/api/*` max 10 requests per minute per IP.
7. **Accounts:** two-factor on Cloudflare, GitHub and the domain registrar.
8. **Repo clean-up:** delete `server.js`, `generate-sitemap.js`, `generate_pages*.py`, `package-lock.json` and the old `.html` files; remove the `.git/hooks/pre-commit` hook (it ran the old sitemap script).
9. After deploy: test the contact and seller forms, then check `securityheaders.com`, `ssllabs.com/ssltest`, and submit `sitemap.xml` in Google Search Console.

## Security design
- Strict Content Security Policy: only your own scripts run, plus Cloudflare Turnstile. Injected scripts are blocked.
- Forms: same-origin check, Turnstile, hidden honeypot field, server-side validation (Indian mobile, GSTIN format), HTML-escaped emails, no secrets in the browser.
- The site only says "sent" when the email service confirms it was sent.
- Headers: HSTS, nosniff, frame protection, referrer and permissions policies.
- No third-party packages in the build, so no supply-chain risk.
