import assert from 'node:assert/strict';
import {chromium,devices} from 'playwright';
import {preview} from 'vite';
const server=await preview({base:'/SAA/',preview:{host:'127.0.0.1',port:4190,strictPort:true}});
let browser;
try {
 browser=await chromium.launch({executablePath:process.env.CHROME_PATH||undefined});
 const c=await browser.newContext({...devices['iPhone 13'],defaultBrowserType:undefined});const p=await c.newPage();
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:4190/SAA/');
 await p.getByRole('navigation').getByRole('button',{name:'設定',exact:true}).click();
 await p.getByRole('button',{name:'教材を保存・オフライン状態を確認',exact:true}).click();
 await p.getByRole('status').filter({hasText:'オフライン準備完了'}).waitFor({timeout:60000});
 await c.setOffline(true);await p.goto('http://127.0.0.1:4190/SAA/audio/');
 await p.getByRole('link',{name:/新しい声を聴き比べる/}).click();
 assert.equal(await p.locator('audio').count(),4);
 for(let i=0;i<4;i++) {
  const a=p.locator('audio').nth(i);await a.evaluate(a=>{a.preload='auto';a.load()});
  await p.waitForFunction(i=>Number.isFinite(document.querySelectorAll('audio')[i].duration),i);
  assert.equal(await a.evaluate(a=>a.paused),true);
  await a.evaluate(a=>{a.muted=true;return a.play()});
  await p.waitForFunction(i=>document.querySelectorAll('audio')[i].currentTime>0.1,i);
  if(i) assert.equal(await p.locator('audio').nth(i-1).evaluate(a=>a.paused),true);
  const duration=await a.evaluate(a=>a.duration);assert.ok(duration>25&&duration<40);
 }
 await p.locator('audio').last().evaluate(a=>a.pause());
 await p.setViewportSize({width:320,height:568});
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.getByText('共通の台本を読む',{exact:true}).click();
 assert.ok(await p.getByText(/失いたくない完成写真/).isVisible());
 const range=await p.evaluate(async()=>{const r=await fetch('compare-aoyama-soft.mp3',{headers:{Range:'bytes=0-99'}});return [r.status,(await r.arrayBuffer()).byteLength]});assert.deepEqual(range,[206,100]);
 assert.deepEqual(errors,[]);console.log('PASS: four samples, durations, no autoplay, playback, exclusive playback, 320px, transcript, offline navigation and MP3 Range. Audible quality and physical iPhone not tested.');
} finally {await browser?.close();await new Promise(r=>server.httpServer.close(r));}
