import assert from 'node:assert/strict';
import { chromium, devices } from 'playwright';
import { preview } from 'vite';
const server=await preview({base:'/SAA/',preview:{host:'127.0.0.1',port:4189,strictPort:true}});
let browser;
try {
  browser=await chromium.launch({executablePath:process.env.CHROME_PATH||undefined});
  const context=await browser.newContext({...devices['iPhone 13'],defaultBrowserType:undefined});
  const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:4189/SAA/');
  await page.getByRole('navigation').getByRole('button',{name:'設定',exact:true}).click();
  await page.getByRole('button',{name:'教材を保存・オフライン状態を確認',exact:true}).click();
  await page.getByRole('status').filter({hasText:'オフライン準備完了'}).waitFor({timeout:60000});
  await context.setOffline(true);
  await page.goto('http://127.0.0.1:4189/SAA/audio/');
  await page.getByRole('heading',{name:/写真工房で覚える、\s*3つの役割。/}).waitFor();
  await page.waitForFunction(()=>Number.isFinite(document.querySelector('audio').duration));
  const duration=await page.locator('audio').evaluate(a=>a.duration);assert.ok(duration>295&&duration<305);
  assert.equal(await page.locator('audio').evaluate(a=>a.paused),true,'no autoplay');
  assert.equal(await page.locator('#chapters button').count(),10);
  await page.locator('audio').evaluate(a=>{a.muted=true});
  await page.locator('#chapters button').first().click();
  await page.waitForFunction(()=>document.querySelector('audio').currentTime>0.2);
  await page.getByLabel('再生速度').selectOption('0.85');
  assert.equal(await page.locator('audio').evaluate(a=>a.playbackRate),0.85);
  await page.getByRole('button',{name:/確認問題2/}).click();
  await page.waitForFunction(()=>document.querySelector('audio').currentTime>200);
  await page.locator('audio').evaluate(a=>a.pause());
  for (const [range,status,length] of [['bytes=0-99',206,100],['bytes=-128',206,128],['bytes=999999999-',416,0]]) {
    const actual=await page.evaluate(async range=>{const r=await fetch('photo-studio-ritsu-5min.mp3',{headers:{Range:range}});return {status:r.status,length:(await r.arrayBuffer()).byteLength,contentRange:r.headers.get('content-range')}},range);
    assert.equal(actual.status,status);assert.equal(actual.length,length);assert.ok(actual.contentRange);
  }
  await page.getByText('音声と同じ台本を読む',{exact:true}).click();
  assert.equal(await page.locator('.transcript section').count(),10);
  await page.setViewportSize({width:320,height:568});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  assert.deepEqual(errors,[]);
  console.log(`PASS: audio duration ${duration.toFixed(2)}s, no autoplay, playback, speed, chapter seek, transcript, 320px, offline directory navigation, cached MP3 ranges (206/416). Chromium emulation; not an audible listening review or physical iPhone test.`);
} finally { await browser?.close();await new Promise(resolve=>server.httpServer.close(resolve)); }
