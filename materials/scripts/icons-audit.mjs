import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {chromium,webkit} from '@playwright/test';
import {preview} from 'vite';
import {KEY,fixture,load,openMenu} from './icon-fixtures.mjs';
import {CARDS} from '../public/tower/engine.mjs';
import {CARD_TYPES} from '../public/tower/card-icons.mjs';
const server=await preview({preview:{host:'127.0.0.1',port:4189,strictPort:true}}),kind=process.env.BROWSER||'chromium',browser=await(kind==='webkit'?webkit:chromium).launch(kind==='chromium'&&process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),report=[];
try{
 await mkdir('artifacts/icon-audit',{recursive:true});
 for(const width of [320,390,1000]){
  const c=await browser.newContext({viewport:{width,height:844}}),p=await c.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:4189/tower/icons.html');
  async function audit(name){assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),name+' overflow at '+width);const hud=await p.locator('.battle-hud').count()?await p.locator('.battle-hud').boundingBox():null,meta=await p.locator('.battle-meta').count()?await p.locator('.battle-meta').boundingBox():null;if(hud&&meta&&name==='battle')assert.ok(hud.y+hud.height<=meta.y+1,'HUD must not overlap state row');assert.ok(await p.locator('svg.ui-icon:not([aria-hidden=true]),svg.ui-icon:not([focusable=false])').count()===0);await p.screenshot({path:'artifacts/icon-audit/'+name+'-'+width+'.png',fullPage:true});report.push({name,width,status:'pass'});}
  for(const [name,type] of [['map','map'],['battle','battle'],['shop','shop'],['rest','rest']]){await load(p,fixture(type));await audit(name);}
  for(const [name,view] of [['deck','デッキ'],['relics','所持レリック'],['cards','コレクション'],['roles','役一覧']]){await load(p,fixture());const before=await p.evaluate(k=>localStorage.getItem(k),KEY);await openMenu(p,view);await audit(name);await p.keyboard.press('Escape');assert.equal(await p.evaluate(k=>localStorage.getItem(k),KEY),before,'read-only '+view);}
  for(const side of ['enemy','player']){await load(p,fixture());const before=await p.evaluate(k=>localStorage.getItem(k),KEY);await p.locator('[data-status='+side+']').focus();await p.keyboard.press('Enter');await audit(side+'-status');await p.locator('[data-action=close-status]').click();assert.equal(await p.evaluate(k=>localStorage.getItem(k),KEY),before);}
  await load(p,fixture());await p.locator('.hand .card').first().focus();await p.keyboard.press('Shift+F10');await audit('detail');
  // All 30 current cards, plus the existing battle-only junk, at every width.
  const ids=Object.keys(CARDS);for(const id of ids){const s=fixture();s.deck.find(c=>c.uid===s.battle.hand[0]).id=id;await load(p,s);const before=await p.evaluate(k=>localStorage.getItem(k),KEY);const card=p.locator('.hand .card').first();const d=CARDS[id];assert.equal(await card.locator('.card-title [data-icon='+CARD_TYPES[d.kind].icon+']').count(),1);await card.focus();await p.keyboard.press('Shift+F10');const detail=p.locator('.card-preview');await detail.waitFor();await p.waitForFunction(()=>{const detail=document.querySelector('.card-preview').getBoundingClientRect(),hud=document.querySelector('.battle-hud').getBoundingClientRect();return detail.top>=hud.bottom-1;},{},{timeout:5000});const {hud,box}=await p.evaluate(()=>{const hud=document.querySelector('.battle-hud').getBoundingClientRect(),box=document.querySelector('.card-preview').getBoundingClientRect();return {hud:{bottom:hud.bottom},box:{top:box.top}};});assert.ok(box.top>=hud.bottom-1,'detail clears fixed HUD: '+id+' '+JSON.stringify({hud,box}));assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id+' detail overflow');await p.locator('[data-action=cancel-card]').click();assert.equal(await p.evaluate(k=>localStorage.getItem(k),KEY),before,'detail is read-only: '+id);}
  report.push({name:'all-card-details',width,count:ids.length,status:'pass'});assert.deepEqual(errors,[]);await c.close();
 }
 await writeFile('artifacts/icon-audit/report.json',JSON.stringify({screens:33,cardDetails:report.filter(x=>x.count).reduce((n,x)=>n+x.count,0),results:report},null,2));console.log('PASS icon audit: 33 screens, every current card at 320/390/1000px, no horizontal overflow/HUD overlap, unchanged saves.');
}finally{await browser.close();await server.close();}
