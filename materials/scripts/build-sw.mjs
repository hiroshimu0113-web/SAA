import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
async function list(path) { const entries = await readdir(path, { withFileTypes: true }); const result = []; for (const e of entries) { if (e.name === 'sw.js') continue; const p = `${path}/${e.name}`; if (e.isDirectory()) result.push(...await list(p)); else result.push(p); } return result; }
const files = (await list('dist')).sort();
const hash = createHash('sha256');
hash.update(await readFile(new URL(import.meta.url)));
for (const f of files) { hash.update(f); hash.update(await readFile(f)); }
const version = hash.digest('hex').slice(0, 12);
const assets = files.map(f => './' + f.slice(5));
const sw = `const VERSION=${JSON.stringify(version)};
const PREFIX='saa-v1-'+self.registration.scope+'-';
const CACHE=PREFIX+VERSION;
const ASSETS=${JSON.stringify(assets)}.map(p=>new URL(p,self.registration.scope).href);
const ROOT=new URL('./index.html',self.registration.scope).href;
async function verify(){const c=await caches.open(CACHE);const entries=await Promise.all(ASSETS.map(x=>c.match(x)));return entries.every(Boolean);}
self.addEventListener('install',event=>event.waitUntil((async()=>{try{const cache=await caches.open(CACHE);await cache.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'})));if(!await verify())throw new Error('incomplete');}catch(e){await caches.delete(CACHE);throw e;}})()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE'){self.skipWaiting();return;}event.waitUntil((async()=>{try{if(event.data?.type==='REPAIR'){const c=await caches.open(CACHE);const missing=[];for(const url of ASSETS){if(!await c.match(url))missing.push(new Request(url,{cache:'reload'}));}await c.addAll(missing);}event.ports[0]?.postMessage({ok:await verify(),version:VERSION});}catch(e){event.ports[0]?.postMessage({ok:false,version:VERSION});}})());});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||!req.url.startsWith(self.registration.scope))return;event.respondWith((async()=>{const c=await caches.open(CACHE);const hit=await c.match(req,{ignoreVary:true});if(hit)return hit;if(req.mode==='navigate'){const shell=await c.match(ROOT);if(shell)return shell;}return fetch(req);})());});
`;
await writeFile('dist/sw.js', sw);
console.log(`Offline package: ${assets.length} files, version ${version}`);
