import {fixedRun as newRun} from './fixed-run-fixture.mjs';

import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {} from '../public/tower/engine.mjs';
let upgraded=false;
const oldWorker="const PREFIX='saa-v1-'+self.registration.scope+'-';const CACHE=PREFIX+'legacy';const ROOT=new URL('./index.html',self.registration.scope).href;self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.add(ROOT))));self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));self.addEventListener('fetch',e=>{if(e.request.mode==='navigate')e.respondWith(caches.open(CACHE).then(async c=>(await c.match(e.request))||(await c.match(ROOT))));});";
const server=http.createServer(async(req,res)=>{
 try{let path=new URL(req.url,'http://localhost').pathname,body;
 if(path==='/sw.js'&&!upgraded)body=oldWorker;else if((path==='/'||path==='/index.html')&&!upgraded)body='<meta charset="utf-8"><h1>旧教材ホーム</h1>';else body=await readFile(resolve('dist','.'+(path.endsWith('/')?path+'index.html':path)));
 res.writeHead(200,{'Cache-Control':'no-store','Content-Type':({'.js':'text/javascript','.mjs':'text/javascript','.html':'text/html','.json':'application/json','.css':'text/css'})[extname(path)]||'application/octet-stream'});res.end(body);
 }catch{res.writeHead(404);res.end();}
});
await new Promise(r=>server.listen(4184,'127.0.0.1',r));
const browser=await chromium.launch(process.platform==='win32'?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{});
try{
 const c=await browser.newContext(),p=await c.newPage();p.setDefaultTimeout(15000);
 await p.goto('http://127.0.0.1:4184/index.html');
 const saved=JSON.stringify(newRun(71));await p.evaluate(async saved=>{localStorage.setItem('saa-tower-run-v1',saved);await navigator.serviceWorker.register('./sw.js');await navigator.serviceWorker.ready;},saved);
 await p.reload();await p.goto('http://127.0.0.1:4184/tower/index.html');console.log('LEGACY STATE',await p.evaluate(()=>({text:document.body.innerText,url:location.href,worker:navigator.serviceWorker.controller?.scriptURL})));await p.getByRole('heading',{name:'旧教材ホーム'}).waitFor();console.log('REPRODUCED: legacy worker returned study shell at tower URL.');
 upgraded=true;await p.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();});
 await p.locator('.route-map').waitFor({timeout:45000});assert.equal(await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1')),saved);
 await c.setOffline(true);await p.reload();await p.locator('.route-map').waitFor();
 const response=await p.goto('http://127.0.0.1:4184/missing-page.html');assert.equal(response.status(),503);
 console.log('PASS: migration refreshes only game, preserves run and offline readiness; unknown page is not mislabeled as study home.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
