import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
let generation = 'initial';
const server = http.createServer(async(req,res)=>{
  try {
    const path = new URL(req.url,'http://localhost').pathname;
    let body = await readFile(resolve('dist','.'+(path==='/'?'/index.html':path)));
    if(path==='/sw.js' && generation!=='initial') {
      let sw=body.toString().replace(/const VERSION="([^"]+)";/,`const VERSION="$1-${generation}";`);
      if(generation==='broken') sw=sw.replace('const ASSETS=[','const ASSETS=["./missing.js",');
      body=Buffer.from(sw);
    }
    res.writeHead(200,{'Cache-Control':'no-store','Content-Type':({'.js':'text/javascript','.css':'text/css','.html':'text/html','.webmanifest':'application/manifest+json','.svg':'image/svg+xml','.png':'image/png'})[extname(path)]||'text/html'});res.end(body);
  }catch{res.writeHead(404);res.end('Missing');}
});
await new Promise(resolve=>server.listen(4176,'127.0.0.1',resolve));
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const context=await browser.newContext();const page=await context.newPage();
async function version(){return page.evaluate(()=>new Promise(resolve=>{const c=new MessageChannel();c.port1.onmessage=e=>resolve(e.data);navigator.serviceWorker.controller.postMessage({type:'VERIFY'},[c.port2]);}));}
async function update(){return page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();const state=new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('update timeout')),15000);r.addEventListener('updatefound',()=>{const w=r.installing;w.addEventListener('statechange',()=>{if(['installed','redundant'].includes(w.state)){clearTimeout(timer);resolve(w.state);}});},{once:true});});await r.update();return state;});}
try{
  await page.goto('http://127.0.0.1:4176/');
  await page.getByRole('navigation').getByRole('button',{name:'設定',exact:true}).click();
  await page.getByRole('button',{name:'教材を保存・オフライン状態を確認',exact:true}).click();
  await page.getByRole('status').filter({hasText:'オフライン準備完了'}).waitFor();
  const first=await version();assert.equal(first.ok,true);
  generation='broken';assert.equal(await update(),'redundant');
  assert.deepEqual(await version(),first,'failed update must preserve old package');
  await context.setOffline(true);await page.reload();await page.getByRole('heading',{name:'今日の一歩が、',exact:false}).waitFor();
  await context.setOffline(false);generation='next';assert.equal(await update(),'installed');
  assert.deepEqual(await version(),first,'waiting update must not switch during study');
  await page.getByRole('navigation').getByRole('button',{name:'設定',exact:true}).click();
  await page.getByRole('button',{name:'更新を確認・適用',exact:true}).click();
  await page.getByRole('heading',{name:'今日の一歩が、',exact:false}).waitFor();
  const next=await version();assert.equal(next.ok,true);assert.ok(next.version.endsWith('-next'));
  // Missing cached content must not be labelled ready until fetched and checked again.
  await page.evaluate(async()=>{const keys=await caches.keys();const key=keys.find(k=>k.endsWith('-next'));const c=await caches.open(key);const asset=(await c.keys()).find(r=>r.url.endsWith('.css'));await c.delete(asset);});
  assert.equal((await version()).ok,false);
  await page.getByRole('navigation').getByRole('button',{name:'設定',exact:true}).click();
  await page.getByRole('button',{name:'教材を保存・オフライン状態を確認',exact:true}).click();
  await page.getByRole('status').filter({hasText:'オフライン準備完了'}).waitFor();
  assert.equal((await version()).ok,true);
  console.log('PASS: failed install preserves old offline package; successful update waits for explicit apply; missing cache is detected and repaired.');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
