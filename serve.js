// Tiny local preview server for dist/ (no dependencies). Clean URLs like Cloudflare Pages.
const http = require('http'), fs = require('fs'), path = require('path');
const DIST = path.join(__dirname, 'dist'), PORT = process.env.PORT || 8788;
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json', '.webp': 'image/webp', '.woff2': 'font/woff2' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.includes('..')) { res.writeHead(400); return res.end(); }
  const cands = [p, p + '.html', path.join(p, 'index.html')].map((c) => path.join(DIST, c));
  const f = cands.find((c) => fs.existsSync(c) && fs.statSync(c).isFile());
  if (!f) { res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('Not found'); }
  res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(PORT, () => console.log(`Preview: http://localhost:${PORT}  (Ctrl+C to stop)`));
