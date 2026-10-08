import assert from 'node:assert/strict';
import {newRun,act} from '../public/tower/engine.mjs';
export async function checkFan(browser,base){
 for(const mobile of [true,false]){
 const ctx=await browser.newContext({viewport:{width:mobile?390:1000,height:844},isMobile:mobile,hasTouch:mobile}),page=await ctx.newPage();
 try{
 await page.goto(base+'tower/fan.html');let state=newRun(2);state=act(state,{type:'node',lane:0});state.battle.hand=state.deck.map(c=>c.uid);state.battle.draw=[];
 await page.evaluate(s=>localStorage.setItem('saa-tower-run-v1',JSON.stringify(s)),state);await page.reload();await page.locator('.fan-hand').waitFor();const before=await page.evaluate(()=>localStorage.getItem('saa-tower-run-v1'));
 const hand=page.locator('.hand');await hand.scrollIntoViewIfNeeded();await page.waitForTimeout(250);
 async function active(){return page.locator('.hand .fan-active').getAttribute('data-uid');}
 const initial=await active();assert.equal(initial,String(state.battle.hand[3]));
 if(mobile){await hand.evaluate(e=>e.scrollLeft=0);await page.waitForTimeout(300);assert.equal(await active(),String(state.battle.hand[0]));await hand.evaluate(e=>e.scrollLeft=e.scrollWidth);await page.waitForTimeout(300);assert.equal(await active(),String(state.battle.hand.at(-1)));}
 else{const first=page.locator('.hand .card').first();await first.hover();await page.waitForTimeout(250);assert.equal(await active(),String(state.battle.hand[0]));}
 const activeCard=page.locator('.hand .fan-active');assert.equal(await activeCard.evaluate(e=>e.style.getPropertyValue('--fan-angle')),'0deg');assert.equal(await activeCard.evaluate(e=>e.style.getPropertyValue('--fan-scale')),'1');assert.ok(await page.locator('.hand .card:not(.fan-active)').evaluateAll(es=>es.every(e=>Number(e.style.getPropertyValue('--fan-scale'))<1)));
 assert.equal(await page.evaluate(()=>localStorage.getItem('saa-tower-run-v1')),before);
 await page.screenshot({path:'artifacts/fan-'+(mobile?'mobile':'desktop')+'.png'});
 await page.setViewportSize({width:320,height:740});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await activeCard.evaluate(e=>getComputedStyle(e).transitionDuration),'0s');
 }finally{await ctx.close();}
 }
 console.log('PASS fan: centered touch scrolling, mouse hover, angle/scale progression, unchanged save, resize and reduced motion.');
}
