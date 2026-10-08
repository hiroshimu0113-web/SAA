import {checkHandIcons} from './hand-icons-browser-check.mjs';
import {checkFan} from './fan-browser-check.mjs';
import {checkCompact} from './compact-browser-check.mjs';
import {checkOptions} from './options-browser-check.mjs';
import {checkImpact} from './impact-browser-check.mjs';
import {checkTurnBanners} from './turn-browser-check.mjs';
import {checkJunk} from './junk-browser-check.mjs';
import {checkRules} from './rules-browser-check.mjs';
import {checkExpansion} from './expansion-browser-check.mjs';
import {checkHeroes} from './heroes-browser-check.mjs';
import {checkDebuffs,checkDebuffOffline} from './debuff-browser-check.mjs';
import {checkFlavor} from './flavor-browser-check.mjs';
import {checkCombos,checkComboOffline} from './combo-browser-check.mjs';
import {checkQuizAndHud,quizOfflineRoundtrip} from './quiz-browser-check.mjs';
import {checkStrategy} from './strategy-browser-check.mjs';
import {checkCombatEffects} from './effects-browser-check.mjs';

import {chromium,webkit} from '@playwright/test';
import {preview} from 'vite';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const kind=process.env.BROWSER||'chromium';
let server=process.env.APP_URL?null:await preview({preview:{host:'127.0.0.1',port:4183,strictPort:true}});
const browser=await (kind==='webkit'?webkit:chromium).launch(kind==='chromium'&&process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:kind==='chromium'&&process.platform==='win32'?{executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'}:{});
const base=process.env.APP_URL||'http://127.0.0.1:4183/',key='saa-tower-run-v1';
await mkdir('artifacts',{recursive:true});
try{
 const c=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const p=await c.newPage(),errors=[];p.setDefaultTimeout(15000);p.on('pageerror',e=>errors.push(e.message));
 // Do not rely on Safari 15.4+ APIs or external modules to start the shipped game.
 await c.addInitScript(()=>{window.structuredClone=undefined;Object.hasOwn=undefined;});
 await c.route('**/tower/*.mjs',route=>route.abort());
 await p.goto(base+'tower/index.html');await p.getByRole('button',{name:'冒険を始める',exact:true}).tap();
 await p.locator('.current [data-action=node]').first().tap();
 // Use a non-draw card so the touch assertion is independent of the random opening hand.
 await p.evaluate(k=>{const s=JSON.parse(localStorage.getItem(k));s.deck.find(c=>c.uid===s.battle.hand[0]).id='strike';localStorage.setItem(k,JSON.stringify(s));},key);await p.reload();await p.locator('.hand').waitFor();const before=await p.evaluate(k=>localStorage.getItem(k),key);

 const readSave=()=>p.evaluate(k=>localStorage.getItem(k),key);
 const touchSession=kind==='chromium'?await c.newCDPSession(p):null;
 async function holdCard(){const card=p.locator('.hand .card').first();await card.scrollIntoViewIfNeeded();const box=await card.boundingBox();if(touchSession)await touchSession.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2}]});else{await p.mouse.move(box.x+box.width/2,box.y+box.height/2);await p.mouse.down();}await p.waitForTimeout(550);await p.locator('.card-preview').waitFor();if(touchSession)await touchSession.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});else await p.mouse.up();await p.waitForTimeout(550);}
 await holdCard();assert.equal(await readSave(),before,'long press and release must not play');
 const compact=await p.locator('.hand .card').first().boundingBox(),expanded=await p.locator('.card-preview .card').boundingBox();assert.ok(await p.locator('.hand .card').first().evaluate(e=>e.offsetWidth<=100)&&expanded.width>=196);
 await p.locator('.card-preview .card .effect').tap();assert.equal(await readSave(),before,'detail is read-only');
 await p.getByRole('button',{name:'閉じる',exact:true}).tap();assert.equal(await p.locator('.card-preview').count(),0);
 assert.equal(await p.locator('[data-action=hand-next],[data-action=hand-prev]').count(),0);await p.locator('.hand').evaluate(e=>e.scrollLeft=100);await p.waitForFunction(()=>document.querySelector('.hand').scrollLeft>50);
 const last=p.locator('.hand .card').last();await last.scrollIntoViewIfNeeded();
 await last.dispatchEvent('pointerdown',{clientX:250,clientY:500,pointerId:1,pointerType:'touch',button:0});
 await last.dispatchEvent('pointermove',{clientX:90,clientY:501,pointerId:1,pointerType:'touch'});
 await p.waitForTimeout(550);assert.equal(await p.locator('.card-preview').count(),0,'swipe cancels hold');
 await last.dispatchEvent('pointerup',{clientX:90,clientY:501,pointerId:1,pointerType:'touch'});await last.dispatchEvent('click');assert.equal(await readSave(),before,'swipe must not play');
 await p.waitForTimeout(550);
 await last.dispatchEvent('pointerdown',{clientX:100,clientY:500,pointerId:1,pointerType:'touch',button:0});await last.dispatchEvent('pointercancel',{pointerId:1});await p.waitForTimeout(550);assert.equal(await p.locator('.card-preview').count(),0);
 await p.locator('.hand .card').first().tap();
 const saved=await readSave(),old=JSON.parse(before),played=JSON.parse(saved);assert.equal(played.battle.hand.length,old.battle.hand.length-1);assert.equal(played.battle.energy,old.battle.energy-1);assert.equal(await p.locator('.card-preview').count(),0);
 await p.reload();await p.locator('.hand').waitFor();assert.equal(await readSave(),saved);
 await p.evaluate(({key,saved})=>{const s=JSON.parse(saved);s.battle.energy=0;localStorage.setItem(key,JSON.stringify(s));},{key,saved});await p.reload();const empty=await readSave();await p.locator('.hand .card').first().tap();assert.equal(await readSave(),empty);await holdCard();assert.equal(await readSave(),empty);await p.getByRole('button',{name:'閉じる',exact:true}).tap();
 await p.evaluate(({key,saved})=>localStorage.setItem(key,saved),{key,saved});await p.reload();
 await p.setViewportSize({width:320,height:740});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 const small=await p.locator('.end-turn').boundingBox();assert.ok(small.width>=44&&small.height>=44);
 await holdCard();await p.screenshot({path:'artifacts/touch-'+kind+'-mobile.png',fullPage:true});await p.getByRole('button',{name:'閉じる',exact:true}).tap();
 await c.unroute('**/tower/*.mjs');console.log('Touch interactions passed; checking offline.');
 await p.getByRole('button',{name:'オフライン保存を確認',exact:true}).tap();await p.getByRole('status').filter({hasText:'オフライン保存を確認しました'}).waitFor({timeout:45000});
 await p.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 if(kind==='webkit'&&server){await new Promise(r=>server.httpServer.close(r));server=null;}else await c.setOffline(true);
 await p.reload();await p.locator('.hand').waitFor();
 await p.goto(base+'tower/index.html?from=home');await p.locator('.hand').waitFor(); // query must not return study shell.
 await quizOfflineRoundtrip(p);
 await checkComboOffline(p);
 await checkDebuffOffline(p);
 await c.setOffline(false);await c.close();assert.deepEqual(errors,[]);
 if(kind==='webkit'&&!process.env.APP_URL)server=await preview({preview:{host:'127.0.0.1',port:4183,strictPort:true}});
 await checkOptions(browser,base);
 await checkImpact(browser,base);
 await checkTurnBanners(browser,base);
 await checkJunk(browser,base);
 await checkHeroes(browser,base);
 await checkExpansion(browser,base);await checkCompact(browser,base);await checkFan(browser,base);await checkHandIcons(browser,base);
 await checkRules(browser,base);
 await checkCombatEffects(browser,base);
 await checkStrategy(browser,base);
 await checkQuizAndHud(browser,base);
 await checkCombos(browser,base);
 await checkFlavor(browser,base);
 await checkDebuffs(browser,base);
 // Deliberately stop the inline application: loader must offer recovery, not hang.
 const fail=await browser.newContext(),q=await fail.newPage();await q.route('**/tower/index.html',async route=>{const r=await route.fetch();const html=await r.text();const blocks=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];assert.ok(blocks.length>=2);await route.fulfill({response:r,body:html.replace(blocks.at(-1)[0],'<script>throw new Error("simulated startup failure")</script>')});});
 await q.goto(base+'tower/index.html');await q.locator('#startup-error:not([hidden])').waitFor();await q.getByRole('button',{name:'再読み込み',exact:true}).waitFor();await fail.close();
 console.log('PASS '+kind+': Safari-compatible bundled startup, module requests blocked, single-tap play, long-press read-only details, cancellation, swipe guard, hand navigation, 320px targets, persistence, offline query navigation, visible boot recovery.');
}finally{await browser.close();if(server)await server.httpServer.close();}
