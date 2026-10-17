import { createServer } from 'node:http';
import { resolve } from 'node:path';
import { legacyMiddleware, sendFile, projectRoot, sitePrefix } from './static-files.mjs';

const base = `${sitePrefix}New/`;
createServer((req, res) => {
  legacyMiddleware(req, res, () => {
    let path;
    try { path = decodeURIComponent((req.url ?? '/').split('?')[0]); }
    catch { res.writeHead(400).end(); return; }
    if (path === '/' || path === base.slice(0, -1)) { res.writeHead(302, { Location: base }).end(); return; }
    if (!path.startsWith(base)) { res.writeHead(404).end(); return; }
    void sendFile(req, res, resolve(projectRoot, 'dist'), path.slice(base.length) || 'index.html');
  });
}).listen(4173, '127.0.0.1', () => console.log(`Built preview: http://127.0.0.1:4173${base}`));
