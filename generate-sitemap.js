/**
 * generate-sitemap.js
 *
 * Scans the project folder for all .html files and regenerates sitemap.xml
 * automatically, so you never have to hand-edit it when adding new pages.
 *
 * Usage:
 *   node generate-sitemap.js
 *
 * This is also wired to run automatically on every `git commit` via a
 * pre-commit hook (see setup-hook.js / instructions below).
 */

const fs = require('fs');
const path = require('path');

// ---- CONFIG -----------------------------------------------------------

const SITE_URL = 'https://www.healthytantra.com';
const ROOT_DIR = __dirname;

// Folders to skip entirely (build tooling, assets, git internals, etc.)
const EXCLUDED_DIRS = new Set([
  'node_modules', '.git', 'css', 'js', 'assets', '.github'
]);

// Specific files to skip (not real pages, or intentionally not indexed)
const EXCLUDED_FILES = new Set([
  '404.html'
]);

// Priority / changefreq rules — first matching rule wins.
// Pattern is matched against the URL path (e.g. "/", "/blog/ayurveda.html").
const RULES = [
  { pattern: /^\/$/, changefreq: 'weekly', priority: '1.0' },
  { pattern: /^\/blog\.html$/, changefreq: 'weekly', priority: '0.8' },
  { pattern: /^\/about\.html$/, changefreq: 'monthly', priority: '0.8' },
  { pattern: /^\/(privacy-policy|terms)\.html$/, changefreq: 'yearly', priority: '0.3' },
  { pattern: /^\/blog\/.+\.html$/, changefreq: 'monthly', priority: '0.6' },
  // default fallback for anything else
  { pattern: /.*/, changefreq: 'monthly', priority: '0.6' }
];

// ---- SCRIPT -------------------------------------------------------------

function walk(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (EXCLUDED_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), fileList);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      if (EXCLUDED_FILES.has(entry.name)) continue;
      fileList.push(path.join(dir, entry.name));
    }
  }
  return fileList;
}

function toUrlPath(absPath) {
  let rel = path.relative(ROOT_DIR, absPath).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel;
}

function getRule(urlPath) {
  return RULES.find(r => r.pattern.test(urlPath));
}

function buildSitemap() {
  const files = walk(ROOT_DIR);
  const urlPaths = files.map(toUrlPath).sort((a, b) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b);
  });

  const urlEntries = urlPaths.map(urlPath => {
    const { changefreq, priority } = getRule(urlPath);
    const loc = SITE_URL + urlPath;
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries.join('\n')}\n</urlset>\n`;

  fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), xml, 'utf8');
  console.log(`sitemap.xml updated with ${urlPaths.length} URLs.`);
}

buildSitemap();
