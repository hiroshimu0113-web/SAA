
import {chromium,webkit} from '@playwright/test';
import {preview} from 'vite';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const kind=process.env.BROWSER||'chromium';
let server=process.env.APP_URL?null:await preview({preview:{host:'127.0.0.1',port:4183,strictPort:true}});
const browser=await (kind==='webkit'?webkit:chromium).launch(kind==='chromium'&&process.platform==='win32'?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{});
const base=process.env.APP_URL||'http://127.0.0.1:4183/',key='saa-tower-run-v1';
await mkdir('artifacts',{recursive:true});
try{
 const c=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const p=await c.newPage(),errors=[];p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.message));
 // Do not rely on Safari 15.4+ APIs or external modules to start the shipped game.
 await c.addInitScript(()=>{window.structuredClone=undefined;Object.hasOwn=undefined;});
 await c.route('**/tower/*.mjs',route=>route.abort());
 await p.goto(base+'tower/index.html');await p.getByRole('button',{name:'冒険を始める',exact:true}).tap();
 await p.locator('.current [data-action=node]').first().tap();const before=await p.evaluate(k=>localStorage.getItem(k),key);
 await p.locator('.hand .card').first().tap();await p.locator('.card-preview').waitFor();assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),before,'select must not spend energy');
 await p.getByRole('button',{name:'戻す',exact:true}).tap();assert.equal(await p.locator('.card-preview').count(),0);
 await p.getByRole('button',{name:'次の手札へ',exact:true}).tap();await p.waitForFunction(()=>document.querySelector('.hand').scrollLeft>50);
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),before);
 // A moved pointer cannot become an accidental card tap.
 await p.locator('.hand .card').last().scrollIntoViewIfNeeded();
 await p.locator('.hand .card').last().dispatchEvent('pointerdown',{clientX:250,clientY:500,pointerId:1,pointerType:'touch'});
 await p.locator('.hand .card').last().dispatchEvent('pointermove',{clientX:90,clientY:501,pointerId:1,pointerType:'touch'});
 await p.locator('.hand .card').last().dispatchEvent('pointerup',{clientX:90,clientY:501,pointerId:1,pointerType:'touch'});
 await p.locator('.hand .card').last().dispatchEvent('click');assert.equal(await p.locator('.card-preview').count(),0);
 await p.waitForTimeout(400);
 await p.locator('.hand .card').first().tap();await p.getByRole('button',{name:'このカードを使う',exact:true}).tap();
 assert.notEqual(await p.evaluate(k=>localStorage.getItem(k),key),before);assert.equal(await p.locator('.card-preview').count(),0);
 const saved=await p.evaluate(k=>localStorage.getItem(k),key);await p.reload();await p.locator('.hand').waitFor();assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),saved);
 await p.setViewportSize({width:320,height:740});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 const small=await p.locator('.end-turn').boundingBox();assert.ok(small.width>=44&&small.height>=44);
 await p.locator('.hand .card').first().tap();await p.screenshot({path:'artifacts/touch-'+kind+'-mobile.png',fullPage:true});
 await p.getByRole('button',{name:'戻す',exact:true}).tap();
 await c.unroute('**/tower/*.mjs');console.log('Touch interactions passed; checking offline.');
 await p.getByRole('button',{name:'オフライン保存を確認',exact:true}).tap();await p.getByRole('status').filter({hasText:'オフライン保存を確認しました'}).waitFor({timeout:45000});
 await p.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 if(kind==='webkit'&&server){await new Promise(r=>server.httpServer.close(r));server=null;}else await c.setOffline(true);
 await p.reload();await p.locator('.hand').waitFor();
 await p.goto(base+'tower/index.html?from=home');await p.locator('.hand').waitFor(); // query must not return study shell.
 await c.setOffline(false);await c.close();assert.deepEqual(errors,[]);
 if(kind==='webkit'&&!process.env.APP_URL)server=await preview({preview:{host:'127.0.0.1',port:4183,strictPort:true}});
 // Deliberately stop the inline application: loader must offer recovery, not hang.
 const fail=await browser.newContext(),q=await fail.newPage();await q.route('**/tower/index.html',async route=>{const r=await route.fetch();const html=await r.text();const blocks=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.ok(blocks.length>=2);await route.fulfill({response:r,body:html.replace(blocks.at(-1)[0],'<script>throw new Error("simulated startup failure")</script>')});});
 await q.goto(base+'tower/index.html');await q.locator('#startup-error:not([hidden])').waitFor();await q.getByRole('button',{name:'再読み込み',exact:true}).waitFor();await fail.close();
 console.log('PASS '+kind+': Safari-compatible bundled startup, module requests blocked, select/cancel/use, swipe guard, hand navigation, 320px targets, persistence, offline query navigation, visible boot recovery.');
}finally{await browser.close();if(server)await server.httpServer.close();}
