/**
 * Tiny static server for the built site (dist/), used by the audit scripts
 * and reviewers so they never fight over the shared `astro preview` on 4321.
 *
 *   node scripts/serve-dist.mjs [port]     (default 4399)
 *
 * Serves /pricing as dist/pricing.html (build.format 'file'), / as index.html,
 * and everything else as-is. Ctrl+C to stop. Also exports serveDist() for
 * scripts that want to start and stop it themselves.
 */
import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ico': 'image/x-icon',
};

export function serveDist(port = 4399, dist = new URL('../dist/', import.meta.url).pathname) {
  const server = createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://x');
    let path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
    const candidates = path.endsWith('/')
      ? [join(dist, path, 'index.html')]
      : [join(dist, path), join(dist, `${path}.html`), join(dist, path, 'index.html')];
    const file = candidates.find((f) => existsSync(f) && statSync(f).isFile());
    if (!file) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  const port = Number(process.argv[2] ?? 4399);
  await serveDist(port);
  console.log(`Serving dist/ at http://localhost:${port} (Ctrl+C to stop)`);
}
