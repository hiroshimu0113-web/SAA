
import {chromium} from '@playwright/test';
import {preview} from 'vite';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const server=await preview({preview:{host:'127.0.0.1',port:4178,strictPort:true}});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
const base='http://127.0.0.1:4178/',key='saa-tower-run-v1';
await mkdir('artifacts',{recursive:true});
try{
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.getByRole('link',{name:'次回のテキスト',exact:true}).click();await page.getByRole('heading',{level:1}).waitFor();assert.ok((await page.title()).includes('リージョン'));
 await page.screenshot({path:'artifacts/next-text-mobile.png',fullPage:true});
 await page.getByRole('link',{name:'問題集',exact:true}).click();assert.equal(await page.locator('details').count(),7);await page.locator('summary').first().click();assert.equal(await page.locator('details').first().getAttribute('open'),'');
 await page.setViewportSize({width:320,height:740});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await page.screenshot({path:'artifacts/next-questions-mobile.png',fullPage:true});
 await page.goto(base+'tower/index.html');await page.getByRole('button',{name:'冒険を始める',exact:true}).click();
 await page.screenshot({path:'artifacts/tower-map-mobile.png',fullPage:true});
 await page.locator('.current [data-action=node]').first().click();
 await page.locator('.hand .card:not(:disabled)').first().click();await page.getByRole('button',{name:'このカードを使う',exact:true}).click();
 const saved=await page.evaluate(k=>localStorage.getItem(k),key);await page.reload();await page.locator('.hand').waitFor();assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),saved);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'artifacts/tower-battle-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'ターン終了',exact:true}).click();assert.ok((await page.locator('.battle-meta').innerText()).includes('TURN 2'));
 await page.getByRole('button',{name:'オフライン保存を確認',exact:true}).click();await page.getByRole('status').filter({hasText:'オフライン保存を確認しました'}).waitFor({timeout:30000});
 await context.setOffline(true);await page.reload();await page.locator('.hand').waitFor();
 await page.goto(base+'study/2026-10-07/questions.html');assert.equal(await page.locator('details').count(),7);await page.locator('summary').last().click();
 await page.goto(base+'study/2026-10-07/text.html');await page.getByRole('heading',{level:1}).waitFor();
 await context.setOffline(false);await page.goto(base+'tower/index.html');await page.locator('.hand').waitFor();

 // Drive a complete run via the same touch buttons, never editing HP or battle outcomes.
 for(let seed=1;seed<=4;seed++){
  await page.evaluate(async ({key,seed})=>{const {newRun}=await import('./engine.mjs');localStorage.setItem(key,JSON.stringify(newRun(seed)));},{key,seed});await page.reload();await page.locator('.route-map').waitFor();
  for(let moves=0;moves<600;moves++){
   const action=await page.evaluate(async key=>{
    const s=JSON.parse(localStorage.getItem(key)),{cardValues,intent}=await import('./engine.mjs');
    if(['won','lost'].includes(s.phase))return {done:s.phase};
    if(s.phase==='map')return {selector:'[data-action="node"][data-lane="'+[0,0,1,0,1,1,0,0][s.floor]+'"]:not(:disabled)'};
    if(s.phase==='battle'){
     const b=s.battle,i=intent(s),hit=i.type==='attack'?i.value:0;
     const pick=b.hand.map(uid=>{const c=s.deck.find(c=>c.uid===uid),v=cardValues(c);let score=(v.damage||0)*(v.hits||1)+Math.min(v.block||0,Math.max(0,hit-b.playerBlock))*1.2+(v.draw||0)*3+(v.energy||0)*9+(v.strength||0)*7+(v.armor||0)*7+(v.weak||0)*2+Math.min(v.heal||0,72-s.hp)-(v.self||0)*1.5;if((v.damage||0)+b.playerStrength>=b.hp+b.block)score+=100;return {uid,score,cost:v.cost};}).filter(c=>c.cost<=b.energy).sort((a,b)=>b.score-a.score)[0];
     return {selector:pick?'[data-action="select"][data-uid="'+pick.uid+'"]':'[data-action="end"]'};
    }
    if(s.phase==='reward'){const rank=['optimize','redundant','balance','burst','restore','reserve','quarantine','parallel','reversal','cache','isolate','detour','overload','foresight','analysis','probe','patch','retry'];const id=[...s.reward].sort((a,b)=>rank.indexOf(a)-rank.indexOf(b))[0];return {selector:'[data-action="reward"][data-id="'+id+'"]'};}
    if(s.phase==='rest'){const c=s.deck.find(c=>!c.plus&&['burst','optimize','redundant','balance'].includes(c.id))||s.deck.find(c=>!c.plus&&c.id==='strike');return {selector:s.hp<44||!c?'[data-action="heal"]':'[data-action="upgrade"][data-uid="'+c.uid+'"]'};}
    if(s.phase==='event')return {selector:s.hp>45?'[data-action="risk"]':'[data-action="safe"]'};
    if(s.phase==='shop')return {selector:s.gold>=35&&s.stock.length?'[data-action="buy"][data-id="'+s.stock[0]+'"]':'[data-action="leave"]'};
   },key);
   if(action.done){if(action.done==='won'){await page.screenshot({path:'artifacts/tower-victory-mobile.png',fullPage:true});}break;}
   await page.locator(action.selector).click();if(action.selector.includes('select'))await page.getByRole('button',{name:'このカードを使う',exact:true}).click();
  }
  const result=await page.evaluate(k=>JSON.parse(localStorage.getItem(k)).phase,key);
  if(result==='won'){console.log('PASS: full UI victory, seed',seed);break;}if(seed===4)throw Error('No full UI win');
 }

 // Persistently corrupted data must show a recovery prompt, not silently overwrite.
 await page.evaluate(k=>localStorage.setItem(k,'{"bad":true}'),key);await page.reload();await page.getByRole('alert').waitFor();assert.equal(await page.evaluate(k=>localStorage.getItem(k),key),'{"bad":true}');
 await context.close();
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),reader=await nojs.newPage();await reader.goto(base+'study/2026-10-07/questions.html');await reader.locator('summary').first().click();assert.ok(await reader.locator('details').first().evaluate(e=>e.open));await nojs.close();
 assert.deepEqual(errors,[]);console.log('PASS: lesson links, seven answers, no-JS, 320px, gameplay, saved resume, offline game and both lessons, corrupt save preservation.');
}finally{await browser.close();await server.httpServer.close();}
