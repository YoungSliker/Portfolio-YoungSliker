import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname, sep } from 'node:path';

export const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
export const repositoryRoot = process.env.PAGES_PREVIEW ? resolve(projectRoot, 'release/site') : resolve(projectRoot, '..');
export const sitePrefix = '/Portfolio-YoungSliker/';
const allowedLegacy = new Set(['index.html', 'css', 'js', 'AIGC', '数字体验设计', '视觉传达设计', '主界面', 'Fonts', '简历_中文版.svg']);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.gif': 'image/gif', '.mkv': 'video/x-matroska', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.otf': 'font/otf', '.ttf': 'font/ttf' };

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
    const headers = { 'Content-Type': mime[extname(target)] || 'application/octet-stream', 'Accept-Ranges': 'bytes', 'Cache-Control': 'no-cache' };
    let start=0,end=info.size-1,status=200;
    if(req.headers.range){
      const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if(!match||(!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return;}
      start=match[1]?Number(match[1]):Math.max(0,info.size-Number(match[2]));
      end=match[1]&&match[2]?Math.min(Number(match[2]),info.size-1):info.size-1;
      if(start>end||start>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`}).end();return;}
      status=206;headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
    }
    res.writeHead(status,{...headers,'Content-Length':Math.max(0,end-start+1)});
    if(req.method==='HEAD'||!info.size){res.end();return;}
    const stream=createReadStream(target,{start,end});
    res.on('close',()=>stream.destroy());stream.on('error',()=>res.destroy()).pipe(res);
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
