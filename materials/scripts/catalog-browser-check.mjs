import {fixedRun as newRun} from './fixed-run-fixture.mjs';
import assert from 'node:assert/strict';import {readFile,mkdir} from 'node:fs/promises';
import {chromium,webkit} from '@playwright/test';import {preview} from 'vite';
import {act} from '../public/tower/engine.mjs';
let server=await preview({base:'/SAA/',preview:{host:'127.0.0.1',port:4192,strictPort:true}});
const isWebKit=process.env.BROWSER==='webkit';
const browser=await (isWebKit?webkit:chromium).launch(isWebKit?{}:{executablePath:process.env.CHROME_PATH||undefined});
const base='http://127.0.0.1:4192/SAA/',key='saa-tower-run-v1';
const pack=JSON.parse(await readFile('public/tower/learning-catalog.json','utf8'));
try{
 const c=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await c.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'tower/learning.html');await p.getByRole('button',{name:'冒険を始める',exact:true}).click();
 let saved=JSON.parse(await p.evaluate(k=>localStorage.getItem(k),key));assert.equal(saved.learningCatalog.version,pack.version);assert.equal(saved.deck.length,7);
 await p.locator('.learning-cards > summary').click();await p.getByRole('heading',{name:'責任共有モデル（スターター）',exact:true}).waitFor();await p.getByRole('heading',{name:'IAMロール',exact:true}).first().waitFor();
 await p.setViewportSize({width:320,height:740});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.locator('.learning-cards > summary').click();
 // All additional entities expose their published teaching text at mobile width.
 const initial=JSON.stringify(saved);
 await p.locator('.learning-vocabulary > summary').click();
 assert.equal(await p.locator('.learning-vocabulary strong').count(),40);
 await p.locator('.learning-vocabulary .vocabulary-note > summary').first().click();
 assert.ok(await p.locator('.learning-vocabulary').innerText().then(t=>t.includes(pack.vocabulary.enemies.noise.note)));
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.locator('.learning-vocabulary > summary').click();
 let battle=act(newRun(15,pack),{type:'node',lane:0});battle.battle.enemy='noise';battle.battle.hp=battle.battle.maxHp=32;battle.battle.enemyStep=3;
 await p.evaluate(({key,battle})=>localStorage.setItem(key,JSON.stringify(battle)),{key,battle});await p.reload();
 // Check every enemy label, including the longest Japanese and English names.
 for(const [id,entry] of Object.entries(pack.vocabulary.enemies)){
  const fixture=act(newRun(15,pack),{type:'node',lane:0});fixture.battle.enemy=id;
  const hp={noise:32,surge:38,leak:35,timeout:42,storm:45,deadlock:47,elite:65,elite_fire:65,elite_drain:65,boss:125,boss_resource:125,boss_stagnation:125}[id];fixture.battle.hp=fixture.battle.maxHp=hp;
  await p.evaluate(({key,fixture})=>localStorage.setItem(key,JSON.stringify(fixture)),{key,fixture});await p.reload();
  assert.equal(await p.locator('.enemy h2').innerText(),entry.name);
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id);
  if(id==='elite_drain'){await p.evaluate(()=>window.scrollTo(0,0));await mkdir('artifacts',{recursive:true});await p.screenshot({path:'artifacts/vocabulary-enemy-mobile.png'});}
 }
 await p.evaluate(({key,battle})=>localStorage.setItem(key,JSON.stringify(battle)),{key,battle});await p.reload();
 assert.equal(await p.locator('.enemy h2').innerText(),pack.vocabulary.enemies.noise.name);
 assert.equal(await p.locator('.intent').innerText(),'一時データ 2枚を山札へ');
 await p.locator('[data-status="enemy"]').focus();await p.keyboard.press('Enter');
 await p.locator('.status-dialog .vocabulary-note > summary').click();
 assert.ok((await p.locator('.status-dialog').innerText()).includes(pack.vocabulary.enemies.noise.note));
 await p.getByRole('button',{name:'閉じる',exact:true}).click();
 await p.locator('.end-turn').click();await p.locator('#game[aria-busy="false"]').waitFor();
 let after=JSON.parse(await p.evaluate(k=>localStorage.getItem(k),key));assert.equal(after.deck.filter(c=>c.id==='junk').length,2);
 await p.reload();assert.deepEqual(JSON.parse(await p.evaluate(k=>localStorage.getItem(k),key)),after);
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.evaluate(({key,initial})=>localStorage.setItem(key,initial),{key,initial});await p.reload();
 // Update during a half-answered quiz: preserve run JSON byte-for-byte and use staged data only next run.
 let run=newRun(14,pack);run.floor=1;run.history=[{floor:0,lane:0,type:'battle'}];run=act(run,{type:'node',lane:0});run=act(run,{type:'quiz-answer',questionId:run.quiz.ids[0],choice:0});
 const raw=JSON.stringify(run);await p.evaluate(({key,raw})=>localStorage.setItem(key,raw),{key,raw});await p.reload();await p.locator('.quiz-explanation').waitFor();
 const newer=JSON.parse(JSON.stringify(pack));newer.version='cccccccccccccccc';newer.cards['study-region'].name='リージョン（更新検証）';newer.quizzes['study-q001'].prompt='更新された設問です。';newer.vocabulary.enemies.noise.name='更新された課題名';
 await p.route('**/learning-catalog.json?update=*',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(newer)}));
 await p.getByRole('button',{name:'教材からカード・クイズを更新',exact:true}).click();await p.getByRole('status').filter({hasText:'次の冒険から反映'}).waitFor();assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),raw);
 await p.reload();assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),raw);await p.locator('.catalog-pending').waitFor();
 p.on('dialog',d=>d.accept());await p.getByRole('button',{name:'最初から',exact:true}).click();saved=JSON.parse(await p.evaluate(k=>localStorage.getItem(k),key));assert.equal(saved.learningCatalog.version,newer.version);assert.equal(saved.deck.length,7);assert.equal(saved.learningCatalog.vocabulary.enemies.noise.name,'更新された課題名');
 // Bad JSON and failed fetch leave both the run and pending catalogue intact.
 const prior=await p.evaluate(()=>({run:localStorage.getItem('saa-tower-run-v1'),pack:localStorage.getItem('saa-tower-catalog-v1')}));
 await p.unroute('**/learning-catalog.json?update=*');await p.route('**/learning-catalog.json?update=*',r=>r.fulfill({status:200,body:'bad json'}));await p.getByRole('button',{name:'教材からカード・クイズを更新',exact:true}).click();await p.getByRole('status').filter({hasText:'更新できませんでした'}).waitFor();
 assert.deepEqual(await p.evaluate(()=>({run:localStorage.getItem('saa-tower-run-v1'),pack:localStorage.getItem('saa-tower-catalog-v1')})),prior);
 await p.unroute('**/learning-catalog.json?update=*');
 // Register the real service worker. Updated pack and snapshot must survive offline reload.
 await p.getByRole('button',{name:'オフライン保存を確認',exact:true}).click();await p.getByRole('status').filter({hasText:'オフライン保存を確認しました'}).waitFor({timeout:60000});
 await p.reload();await p.waitForFunction(()=>navigator.serviceWorker.controller);if(isWebKit){await new Promise(r=>server.httpServer.close(r));server=null;}else await c.setOffline(true);await p.reload();await p.locator('.route-map').waitFor();assert.equal(JSON.parse(await p.evaluate(k=>localStorage.getItem(k),key)).learningCatalog.version,newer.version);
 await p.getByRole('button',{name:'教材からカード・クイズを更新',exact:true}).click();await p.getByRole('status').filter({hasText:'更新できませんでした'}).waitFor();
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),prior.run);
 // Return online: query bypasses precache and obtains the actual server catalogue, not the stale cached copy.
 if(isWebKit)server=await preview({base:'/SAA/',preview:{host:'127.0.0.1',port:4192,strictPort:true}});else await c.setOffline(false);await p.getByRole('button',{name:'教材からカード・クイズを更新',exact:true}).click();await p.getByRole('status').filter({hasText:'次の冒険から反映'}).waitFor();assert.equal(JSON.parse(await p.evaluate(()=>localStorage.getItem('saa-tower-catalog-v1'))).pack.version,pack.version);
 assert.deepEqual(errors,[]);await mkdir('artifacts',{recursive:true});await p.screenshot({path:'artifacts/catalog-update.png',fullPage:true});console.log('PASS catalog: published cards, starter names, 320px, staged update, quiz preservation, next-run adoption, failed update rollback, offline reload, real SW fresh fetch.');await c.close();
}finally{await browser.close();if(server)await new Promise(r=>server.httpServer.close(r));}
