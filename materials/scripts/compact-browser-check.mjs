import assert from 'node:assert/strict';
import {newRun,act} from '../public/tower/engine.mjs';
export async function checkCompact(browser,base){
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),page=await context.newPage(),key='saa-tower-run-v1';
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const read=()=>page.evaluate(k=>localStorage.getItem(k),key);
 async function load(phase,gold=200){let s=newRun(2);s.routes[1]=[phase,'battle'];s.floor=1;s.history=[{floor:0,lane:0,type:'battle'}];s.gold=gold;s=act(s,{type:'node',lane:0});if(phase==='shop')s.shopRelic='discount';await page.evaluate(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key,s});await page.reload();}
 async function hold(locator){const box=await locator.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.waitForTimeout(550);await page.mouse.up();await page.locator('.options-card-detail .effect').waitFor();await page.waitForTimeout(510);}
 try{
  await page.goto(base+'tower/compact.html');
  for(const width of [320,390,1024]){
   await page.setViewportSize({width,height:844});await load('shop');
   const boxes=await page.locator('.shop-shelf>.shop-slot').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,width:r.width};}));
   assert.equal(boxes.length,5);assert.ok(boxes.every(b=>Math.abs(b.y-boxes[0].y)<1));assert.ok(boxes[0].width>=44);assert.ok(boxes[4].right<=width);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   const before=await read();await hold(page.locator('[data-action=buy]').first());assert.equal(await read(),before,'inspection must not buy');assert.ok((await page.locator('.options-card-detail .effect').innerText()).length>0);await page.keyboard.press('Escape');
   await page.locator('[data-action=shop-remove-panel]').tap();assert.equal(await read(),before,'opening removal must not delete');await hold(page.locator('[data-action=remove]').first());assert.equal(await read(),before,'long press must not delete');await page.keyboard.press('Escape');
   await page.locator('[data-action=remove]').first().tap();const after=JSON.parse(await read());assert.equal(after.deck.length,JSON.parse(before).deck.length-1);assert.equal(after.removed,true);assert.equal(await page.locator('.shop-shelf>.shop-slot').count(),5);
   if(width===390)await page.screenshot({path:'artifacts/compact-shop.png',fullPage:true});
  }
  await load('shop',0);const before=await read();await hold(page.locator('[data-action=buy]').first());assert.equal(await read(),before);await page.keyboard.press('Escape');await page.locator('[data-action=buy]').first().dispatchEvent('click');assert.equal(await read(),before,'unaffordable card cannot be bought');
  await load('rest');const upgrade=page.locator('[data-action=upgrade]').first();await upgrade.focus();await page.keyboard.press('Shift+F10');await page.getByRole('heading',{name:'強化すると',exact:true}).waitFor();await page.keyboard.press('Escape');assert.equal(JSON.parse(await read()).phase,'rest');
  assert.deepEqual(errors,[]);console.log('PASS compact: five shop slots at 320/390/1024, read-only long press including unaffordable cards, guarded deletion, upgrade details and keyboard inspection.');
 }finally{await context.close();}
}
