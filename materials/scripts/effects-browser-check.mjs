import assert from 'node:assert/strict';
import {newRun,act} from '../public/tower/engine.mjs';
export async function checkCombatEffects(browser,base){
 const c=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),p=await c.newPage();p.setDefaultTimeout(10000);
 try{
 await p.goto(base+'tower/play.html');
 await p.getByText('演出 v2',{exact:true}).waitFor();
 const original=await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1'));await p.getByRole('button',{name:'演出を試す',exact:true}).tap();await p.locator('.combat-toast').waitFor();assert.equal(await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1')),original);
 await p.locator('.combat-toast').waitFor({state:'detached',timeout:5000});
 async function setup(id='strike',block=0,energy=3){const s=act(newRun(1),{type:'node',lane:0});s.battle.enemy='noise';s.battle.hp=s.battle.maxHp=32;s.battle.playerBlock=block;s.battle.energy=energy;s.hp=50;s.deck.find(c=>c.uid===s.battle.hand[0]).id=id;await p.evaluate(s=>localStorage.setItem('saa-tower-run-v1',JSON.stringify(s)),s);await p.reload();}
 await setup();await p.evaluate(()=>window.scrollTo(0,document.querySelector('.hand').getBoundingClientRect().top+scrollY+10));
 assert.ok(await p.locator('.arena').evaluate(e=>e.getBoundingClientRect().bottom<0),'reproduce arena above viewport');
 await p.locator('.hand .card').first().tap();const toast=await p.locator('.combat-toast').boundingBox();assert.ok(toast.y>=0&&toast.y+toast.height<844,'result remains visible');assert.equal(await p.locator('.fx-hit').innerText(),'−6');assert.equal(await p.locator('.enemy').evaluate(e=>getComputedStyle(e).animationName),'fx-impact');assert.equal(await p.locator('.combat-fx').evaluate(e=>getComputedStyle(e).pointerEvents),'none');
 await p.screenshot({path:'artifacts/combat-hit.png'});
 // Play again immediately: feedback must not lock input or defer persistence.
 await p.locator('.hand .card').first().tap();assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('saa-tower-run-v1')).battle.energy),1);
 await setup('guard');await p.locator('.hand .card').first().tap();assert.equal(await p.locator('.fx-shield').innerText(),'◇ ＋5');
 await setup('strike',20);await p.locator('.end-turn').tap();assert.equal(await p.locator('.fx-guard').innerText(),'完全ガード 7');assert.equal(await p.locator('.fx-hit').count(),0);await p.screenshot({path:'artifacts/combat-guard.png'});
 await setup('strike',3);await p.locator('.end-turn').tap();assert.equal(await p.locator('.fx-guard').innerText(),'防御 3');assert.equal(await p.locator('.fx-hit').innerText(),'−4');
 await setup('restore');await p.locator('.hand .card').first().tap();assert.equal(await p.locator('.fx-heal').innerText(),'回復 ＋7');
 await setup('strike',0,0);await p.locator('.hand .card').first().tap();assert.equal(await p.locator('.combat-fx').count(),0);
 await p.emulateMedia({reducedMotion:'reduce'});await setup();await p.locator('.hand .card').first().tap();assert.equal(await p.locator('.enemy').evaluate(e=>getComputedStyle(e).animationName),'none');assert.equal(await p.locator('.fx-hit').innerText(),'−6');await p.locator('.combat-toast').waitFor({state:'detached',timeout:5000});await p.locator('.combat-fx').waitFor({state:'detached',timeout:5000});assert.equal(await p.locator('.combat-fx').count(),0);
 // Reproduce a previous offline package keeping index.html but lacking the new entry.
 await p.evaluate(async()=>{await navigator.serviceWorker.register('../sw.js');await navigator.serviceWorker.ready;});await p.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 const saved=await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1'));
 await p.evaluate(async()=>{for(const name of await caches.keys()){if(!name.startsWith('saa-v1-'))continue;const cache=await caches.open(name);await cache.put(new URL('./index.html',location.href).href,new Response('<meta charset="utf-8"><h1>古いゲーム</h1>',{headers:{'Content-Type':'text/html; charset=utf-8'}}));await cache.delete(new URL('./play.html',location.href).href);}});
 await p.goto(base+'tower/index.html');await p.getByRole('heading',{name:'古いゲーム'}).waitFor();await p.goto(base+'tower/play.html');await p.getByText('演出 v2',{exact:true}).waitFor();assert.equal(await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1')),saved);
 console.log('PASS cached old index: fresh entry loads visible effects version and preserves saved run.');
 console.log('PASS combat effects: hit, shield, full/partial guard, healing, rapid taps, no effect for invalid play, reduced motion and cleanup.');
 }finally{await c.close();}
}
