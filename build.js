#!/usr/bin/env node
/**
 * Healthy Tantra static site builder (zero dependencies).
 *
 *   node build.js           build src/ + public/ into dist/
 *   node build.js --check   build, then run the quality and security checks (exit 1 on errors)
 *
 * Every page is a file in src/pages/ with a small front-matter block.
 * Header, footer, mobile bar and the page shell live once in src/ and are
 * shared by all pages. Nothing is fetched at runtime: the output is plain HTML.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const PUBLIC = path.join(ROOT, 'public');
const DIST = path.join(ROOT, 'dist');

const SITE_URL = 'https://www.healthytantra.com';
const SITE_NAME = 'Healthy Tantra';
const DEFAULT_OG_IMAGE = SITE_URL + '/assets/og-banner.jpg';
const TURNSTILE_SITE_KEY = process.env.TURNSTILE_SITE_KEY || '1x00000000000000000000AA'; // Cloudflare test key
const CHECK = process.argv.includes('--check');

const warnings = [];
const errors = [];

// ---------- helpers ----------
const read = (p) => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
}

function parsePage(file) {
  const raw = read(file);
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('Missing front matter: ' + file);
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  let body = m[2];
  let head = '';
  body = body.replace(/<!--HEAD-->([\s\S]*?)<!--\/HEAD-->/, (_, h) => { head = h.trim(); return ''; });
  return { meta, head, body: body.trim() };
}

function urlPathFor(file) {
  let rel = path.relative(path.join(SRC, 'pages'), file).split(path.sep).join('/').replace(/\.html$/, '');
  if (rel === 'index') return '/';
  if (rel.endsWith('/index')) return '/' + rel.slice(0, -6);
  return '/' + rel;
}

function outFileFor(urlPath) {
  if (urlPath === '/') return path.join(DIST, 'index.html');
  return path.join(DIST, urlPath.slice(1) + '.html');
}

function fill(template, vars) {
  return template.replace(/\{\{\s*([a-zA-Z_]+)\s*\}\}/g, (_, k) => (k in vars ? vars[k] : ''));
}

// ---------- load shared pieces ----------
const layout = read(path.join(SRC, 'layout.html'));
const partials = {};
for (const f of fs.readdirSync(path.join(SRC, 'partials'))) {
  partials[f.replace(/\.html$/, '')] = read(path.join(SRC, 'partials', f));
}
const globalVars = { site_url: SITE_URL, site_name: SITE_NAME, year: String(new Date().getFullYear()), turnstile_site_key: TURNSTILE_SITE_KEY };

function includePartials(html) {
  return html.replace(/\{\{>\s*([a-z0-9-]+)\s*\}\}/g, (_, name) => {
    if (!(name in partials)) throw new Error('Unknown partial: ' + name);
    return fill(partials[name], globalVars);
  });
}

// ---------- build ----------
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
fs.cpSync(PUBLIC, DIST, { recursive: true });

const pages = [];
for (const file of walk(path.join(SRC, 'pages')).filter((f) => f.endsWith('.html')).sort()) {
  const { meta, head, body } = parsePage(file);
  const urlPath = urlPathFor(file);
  const canonical = SITE_URL + (urlPath === '/' ? '/' : urlPath);
  const scripts = (meta.scripts || '').split(',').map((s) => s.trim()).filter(Boolean)
    .map((s) => `<script src="${s}"${/^https:/.test(s) ? ' async defer' : ' defer'}></script>`).join('\n');


  // ----- automatic structured data (added only when the page does not already provide it) -----
  const auto = [];
  const h1m = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const h1text = (h1m ? h1m[1] : (meta.title || '')).replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  if (urlPath !== '/' && !/BreadcrumbList/.test(head)) {
    const crumbs = [['Home', SITE_URL + '/']];
    const parent = urlPath.startsWith('/consult/') ? ['Online Doctor Consultation', '/online-doctor-consultation']
      : urlPath.startsWith('/blog/') ? ['Blog', '/blog']
      : urlPath.startsWith('/doctor/') ? ['Doctors', '/doctor'] : null;
    if (parent) crumbs.push([parent[0], SITE_URL + parent[1]]);
    crumbs.push([h1text, canonical]);
    auto.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c[0], item: c[1] })) });
  }
  if (!/application\/ld\+json/.test(head)) {
    const type = { '/about': 'AboutPage', '/contact': 'ContactPage', '/blog': 'CollectionPage', '/doctor': 'CollectionPage' }[urlPath] || 'WebPage';
    auto.push({ '@context': 'https://schema.org', '@type': type, name: h1text, url: canonical, description: meta.description || '',
      inLanguage: 'en-IN',
      isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL + '/' },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL + '/' } });
  }
  const autoHtml = auto.map((o) => '<script type="application/ld+json">\n' + JSON.stringify(o, null, 2) + '\n</script>').join('\n');

  const vars = Object.assign({}, globalVars, {
    title: esc(meta.title || SITE_NAME),
    description: esc(meta.description || ''),
    canonical,
    robots: meta.robots || 'index, follow',
    og_type: meta.og_type || 'website',
    og_title: esc(meta.og_title || meta.title || SITE_NAME),
    og_description: esc(meta.og_description || meta.description || ''),
    og_image: meta.og_image || DEFAULT_OG_IMAGE,
    head_extra: [head, autoHtml].filter(Boolean).join('\n'),
    page_scripts: scripts,
    body_class: meta.body_class || '',
    content: fill(body, globalVars)
  });
  let html = fill(includePartials(layout), vars);
  html = html.replace(/\n{3,}/g, '\n\n');

  const out = outFileFor(urlPath);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  pages.push({ file, urlPath, canonical, meta, html, out });
}

// ---------- sitemap + robots ----------
function sitemapRules(p) {
  if (p === '/') return ['weekly', '1.0'];
  if (p === '/online-doctor-consultation') return ['monthly', '0.9'];
  if (/^\/consult\//.test(p)) return ['monthly', '0.8'];
  if (p === '/blog' || p === '/doctor') return ['weekly', '0.8'];
  if (p === '/about' || p === '/seller') return ['monthly', '0.7'];
  if (/^\/(privacy-policy|terms)$/.test(p)) return ['yearly', '0.3'];
  return ['monthly', '0.6'];
}
const urls = pages.filter((p) => (p.meta.sitemap || 'true') !== 'false' && !/noindex/.test(p.meta.robots || ''))
  .map((p) => {
    const [cf, pr] = sitemapRules(p.urlPath);
    const lm = p.meta.lastmod ? `\n    <lastmod>${p.meta.lastmod}</lastmod>` : '';
    return `  <url>\n    <loc>${p.canonical}</loc>${lm}\n    <changefreq>${cf}</changefreq>\n    <priority>${pr}</priority>\n  </url>`;
  });
fs.writeFileSync(path.join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(DIST, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`Built ${pages.length} pages, ${urls.length} in sitemap -> dist/`);
if (!process.env.TURNSTILE_SITE_KEY) console.log('Note: TURNSTILE_SITE_KEY not set, using the Cloudflare TEST key. Set it in Cloudflare Pages before launch.');

// ---------- checks ----------
if (CHECK) {
  const distFiles = new Set(walk(DIST).map((f) => path.relative(DIST, f).split(path.sep).join('/')));
  // exact-case existence (works the same on Windows, Mac and Linux)
  const existsExact = (rel) => distFiles.has(rel);
  const titles = new Map();
  const reportErr = (p, m) => errors.push(`${p.urlPath}: ${m}`);
  const reportWarn = (p, m) => warnings.push(`${p.urlPath}: ${m}`);

  for (const p of pages) {
    const h = p.html;
    const t = (h.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
    if (!t) reportErr(p, 'missing <title>');
    else {
      if (titles.has(t)) reportErr(p, `duplicate title with ${titles.get(t)}`); else titles.set(t, p.urlPath);
      if (t.length > 75) reportWarn(p, `title is ${t.length} chars (aim for under 65)`);
    }
    const d = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
    if (d.length < 50) reportErr(p, 'meta description missing or too short');
    if (d.length > 175) reportWarn(p, `meta description is ${d.length} chars (aim for under 160)`);
    if (!new RegExp(`<link rel="canonical" href="${p.canonical.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`).test(h)) reportErr(p, 'canonical tag wrong');
    if ((h.match(/<h1[\s>]/g) || []).length !== 1) reportErr(p, `needs exactly one <h1> (found ${(h.match(/<h1[\s>]/g) || []).length})`);
    const mainHtml = (h.match(/<main[\s\S]*?<\/main>/) || [''])[0];
    const text = mainHtml.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    if (text.length < 100) reportErr(p, 'page is empty');
    else if (text.length < 900 && !/noindex/.test(p.meta.robots || '')) reportWarn(p, `thin content (${text.length} characters of text): needs real content to rank`);
    if (/\[\s*FILL|TODO|lorem ipsum/i.test(h)) reportErr(p, 'placeholder text found');

    // security: no inline scripts, no inline handlers, no javascript: URLs
    for (const m of h.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>/g)) {
      if (!/application\/ld\+json/.test(m[1])) reportErr(p, 'inline <script> found (blocked by the Content Security Policy)');
    }
    if (/\son[a-z]+\s*=\s*["']/i.test(h.replace(/<script[\s\S]*?<\/script>/g, ''))) reportErr(p, 'inline event handler (onclick=...) found');
    if (/href=["']\s*javascript:/i.test(h)) reportErr(p, 'javascript: URL found');
    if (/(href|src)=["']http:\/\//i.test(h)) reportErr(p, 'insecure http:// link found');
    for (const m of h.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
      if (!/rel="[^"]*noopener/.test(m[0])) reportErr(p, 'target=_blank link without rel="noopener"');
    }
    for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(m[1]); } catch (e) { reportErr(p, 'invalid JSON-LD: ' + e.message); }
    }

    // links and assets
    for (const m of h.matchAll(/(?:href|src)="([^"]+)"|url\('([^']+)'\)/g)) {
      const u = (m[1] || m[2] || '').trim();
      if (!u || /^(https?:|mailto:|tel:|data:|#)/.test(u)) continue;
      if (/^https?:\/\/(?!www\.healthytantra\.com)/.test(u)) continue;
      const clean = u.split('#')[0].split('?')[0];
      if (!clean.startsWith('/')) { reportErr(p, `relative URL not allowed: ${u}`); continue; }
      if (clean === '/') continue;
      const rel = clean.slice(1);
      const ok = existsExact(rel) || existsExact(rel + '.html') || existsExact(rel.replace(/\/$/, '') + '/index.html');
      if (!ok) reportErr(p, `broken link or missing file (case-sensitive): ${u}`);
    }
    if (/https:\/\/healthytantra\.com/.test(h)) reportErr(p, 'non-www URL found (use https://www.healthytantra.com)');
  }
  if (!existsExact('assets/og-banner.jpg')) errors.push('assets/og-banner.jpg missing');
  if (!existsExact('_headers')) errors.push('_headers missing');
}

for (const w of warnings) console.log('  warning: ' + w);
for (const e of errors) console.log('  ERROR: ' + e);
if (CHECK) {
  console.log(errors.length ? `\nCheck FAILED: ${errors.length} error(s), ${warnings.length} warning(s)` : `\nCheck passed: 0 errors, ${warnings.length} warning(s)`);
  process.exit(errors.length ? 1 : 0);
}
