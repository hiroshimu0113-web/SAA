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
const TOUCH=new URL('./tower/touch-version.json',self.registration.scope).href;
const RECOVERY=new URL('./__touch_recovery__',self.registration.scope).href;
async function verify(){const c=await caches.open(CACHE);const entries=await Promise.all(ASSETS.map(x=>c.match(x)));return entries.every(Boolean);}
self.addEventListener('install',event=>event.waitUntil((async()=>{try{const cache=await caches.open(CACHE);await cache.addAll(ASSETS.map(url=>new Request(url,{cache:'reload'})));if(!await verify())throw new Error('incomplete');const older=(await caches.keys()).filter(k=>k.startsWith(PREFIX)&&k!==CACHE);if(older.length){const upgraded=await Promise.all(older.map(async k=>Boolean(await (await caches.open(k)).match(TOUCH))));if(!upgraded.some(Boolean)){await cache.put(RECOVERY,new Response('1'));await self.skipWaiting();}}}catch(e){await caches.delete(CACHE);throw e;}})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{await self.clients.claim();const c=await caches.open(CACHE);if(await c.match(RECOVERY)){await c.delete(RECOVERY);const tower=new URL('./tower/',self.registration.scope).href;const windows=await self.clients.matchAll({type:'window'});for(const w of windows.filter(w=>w.url.startsWith(tower)))w.navigate(w.url).catch(()=>null);}})()));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE'){self.skipWaiting();return;}event.waitUntil((async()=>{try{if(event.data?.type==='REPAIR'){const c=await caches.open(CACHE);const missing=[];for(const url of ASSETS){if(!await c.match(url))missing.push(new Request(url,{cache:'reload'}));}await c.addAll(missing);}event.ports[0]?.postMessage({ok:await verify(),version:VERSION});}catch(e){event.ports[0]?.postMessage({ok:false,version:VERSION});}})());});
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET'||!req.url.startsWith(self.registration.scope))return;const requestURL=new URL(req.url);if(requestURL.pathname===new URL('./tower/learning-catalog.json',self.registration.scope).pathname&&requestURL.searchParams.has('update'))return;event.respondWith((async()=>{const c=await caches.open(CACHE);const hit=await c.match(req,{ignoreVary:true});if(hit){
  const range=req.headers.get('range');
  if(range&&new URL(req.url).pathname.endsWith('.mp3')){
    const match=/^bytes=(\\d*)-(\\d*)$/.exec(range);
    if(match&&(match[1]||match[2])){
      const data=await hit.arrayBuffer();const size=data.byteLength;
      const start=match[1]?Number(match[1]):Math.max(0,size-Number(match[2]));
      const end=match[1]?(match[2]?Math.min(Number(match[2]),size-1):size-1):size-1;
      if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start>=size||end<start)return new Response(null,{status:416,headers:{'Content-Range':'bytes */'+size}});
      const headers=new Headers(hit.headers);headers.set('Content-Range','bytes '+start+'-'+end+'/'+size);headers.set('Content-Length',String(end-start+1));headers.set('Accept-Ranges','bytes');
      return new Response(data.slice(start,end+1),{status:206,headers});
    }
  }
  return hit;
}if(req.mode==='navigate'){const url=new URL(req.url);url.search='';url.hash='';if(url.pathname.endsWith('/'))url.pathname+='index.html';const page=await c.match(url.href,{ignoreVary:true});if(page)return page;try{return await fetch(req);}catch{return new Response('<!doctype html><html lang="ja"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><p>このページは未保存です。オンラインで開き直してください。</p></html>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8'}});}}if(new URL(req.url).pathname.includes('/assets/')){for(const name of await caches.keys()){if(name.startsWith(PREFIX)){const prior=await (await caches.open(name)).match(req,{ignoreVary:true});if(prior)return prior;}}}return fetch(req);})());});
`;
await writeFile('dist/sw.js', sw);
console.log(`Offline package: ${assets.length} files, version ${version}`);
