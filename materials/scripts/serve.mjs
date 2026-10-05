import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const port = 4180;
const types = { '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json' };
const server = http.createServer(async (req,res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    const path = resolve(root, '.'+pathname, pathname.endsWith('/') ? 'index.html' : '');
    if (path !== root && !path.startsWith(root+sep)) { res.writeHead(403);res.end();return; }
    if (!(await stat(path)).isFile()) { res.writeHead(404);res.end();return; }
    res.writeHead(200, {'Content-Type':types[extname(path)]??'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
    res.end(await readFile(path));
  } catch { res.writeHead(404);res.end('Not found'); }
});
server.on('error', e => { console.error('起動できません。既に開いている場合は http://127.0.0.1:4180/ を確認してください。', e.message);process.exitCode=1; });
server.listen(port,'127.0.0.1',()=>console.log(`SAAへの道 を起動しました。\nブラウザーで http://127.0.0.1:${port}/ を開いてください。\n終了するにはこの画面で Ctrl+C を押してください。\nこのURLはこのWindows PC専用です。iPhoneにはHTTPS公開が必要です。`));
