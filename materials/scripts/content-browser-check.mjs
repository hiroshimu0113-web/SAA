import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {preview} from 'vite';
import {readFile,mkdir} from 'node:fs/promises';
import {checkCases,checkCasesOffline} from './case-browser-check.mjs';
import {newRun,act} from '../public/tower/engine.mjs';
const server=await preview({preview:{host:'127.0.0.1',port:4186,strictPort:true}});
const base='http://127.0.0.1:4186/',browser=await chromium.launch(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{});
await mkdir('artifacts',{recursive:true});
try{
 await checkCases(browser,base);
 const c=await browser.newContext({viewport:{width:320,height:740},hasTouch:true,isMobile:true}),p=await c.newPage();p.setDefaultTimeout(15000);
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'tower/index.html');
 const s=act(newRun(1),{type:'node',lane:0});await p.evaluate(s=>localStorage.setItem('saa-tower-run-v1',JSON.stringify(s)),s);await p.reload();await p.locator('.hand').waitFor();
 await p.getByRole('button',{name:'オフライン保存を確認',exact:true}).tap();await p.getByRole('status').filter({hasText:'オフライン保存を確認しました'}).waitFor({timeout:45000});
 await p.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));await c.setOffline(true);await p.reload();await p.locator('.hand').waitFor();
 await checkCasesOffline(p);await c.setOffline(false);
 await p.goto(base+'knowledge/index.html');
 const units=JSON.parse(await readFile('knowledge/units.json','utf8')).units;
 for(const u of units.filter(u=>u.review.status==='reviewed')){
  await p.getByLabel('細分化した単位を検索').fill(u.title);await p.locator('#unit-list').getByRole('button',{name:u.title,exact:true}).tap();
  assert.ok((await p.locator('#detail').innerText()).includes('内容確認済み'));
  assert.ok(await p.locator('#detail a[href*="aws-sdk-go-v2"]').count()>=1);
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 assert.deepEqual(errors,[]);await p.screenshot({path:'artifacts/content-review-mobile.png',fullPage:true});await c.close();
 console.log('PASS content: every reviewed unit status/evidence, 320px, all paired cases online/offline, saved answers/results unchanged.');
}finally{await browser.close();await new Promise(r=>server.httpServer.close(r));}
