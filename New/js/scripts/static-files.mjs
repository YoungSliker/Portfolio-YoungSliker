import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';

export const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
export const repositoryRoot = resolve(projectRoot, '..');
export const sitePrefix = '/Portfolio-YoungSliker/';
const allowedLegacy = new Set(['index.html', 'css', 'js', 'AIGC', '数字体验设计', '视觉传达设计', '主界面', 'Fonts', '简历_中文版.svg']);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.otf': 'font/otf', '.ttf': 'font/ttf' };

export async function sendFile(req, res, root, relative) {
  if (!['GET', 'HEAD'].includes(req.method ?? '')) { res.writeHead(405).end(); return; }
  const segments = relative.split('/');
  if (segments.some(s => s === '..' || s.startsWith('.')) || relative.includes('\\') || relative.includes('\0')) {
    res.writeHead(403).end(); return;
  }
  const target = resolve(root, relative || 'index.html');
  if (!target.startsWith(resolve(root) + sep)) { res.writeHead(403).end(); return; }
  try {
    const info = await stat(target);
    if (!info.isFile()) { res.writeHead(404).end(); return; }
    res.writeHead(200, { 'Content-Type': mime[extname(target)] || 'application/octet-stream', 'Content-Length': info.size, 'Cache-Control': 'no-cache' });
    if (req.method === 'HEAD') { res.end(); return; }
    createReadStream(target).on('error', () => res.destroy()).pipe(res);
  } catch { res.writeHead(404).end('Not found'); }
}

export function legacyMiddleware(req, res, next) {
  let path;
  try { path = decodeURIComponent((req.url ?? '/').split('?')[0]); }
  catch { res.writeHead(400).end(); return; }
  if (!path.startsWith(sitePrefix) || path === `${sitePrefix}New` || path.startsWith(`${sitePrefix}New/`)) { next(); return; }
  const relative = path.slice(sitePrefix.length) || 'index.html';
  if (!allowedLegacy.has(relative.split('/')[0])) { res.writeHead(404).end(); return; }
  void sendFile(req, res, repositoryRoot, relative);
}
