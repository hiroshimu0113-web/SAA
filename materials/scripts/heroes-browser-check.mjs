import assert from 'node:assert/strict';
import {HEROES} from '../public/tower/engine.mjs';
export async function checkHeroes(browser,base){
 const context=await browser.newContext({viewport:{width:320,height:740},isMobile:true,hasTouch:true});
 try{
 const page=await context.newPage();await page.goto(base+'tower/models.html');
 let accept=true;page.on('dialog',d=>accept?d.accept():d.dismiss());
 for(const [seed,id] of Object.keys(HEROES).entries()){
  await page.evaluate(seed=>{crypto.getRandomValues=a=>{a[0]=seed;return a;};},seed);
  await page.getByRole('button',{name:seed===0?'冒険を始める':'最初から',exact:true}).tap();
  await page.locator('.hero-profile').filter({hasText:HEROES[id].name}).waitFor();
  let saved=JSON.parse(await page.evaluate(()=>localStorage.getItem('saa-tower-run-v1')));assert.equal(saved.hero,id);assert.deepEqual(saved.relics,[HEROES[id].relic]);
  const rows=page.locator('.route-row');assert.equal(await rows.count(),8);for(let floor=0;floor<8;floor++){const nodes=rows.nth(floor).locator('.node');assert.equal(await nodes.count(),saved.routes[floor].length);for(let lane=0;lane<saved.routes[floor].length;lane++)assert.ok((await nodes.nth(lane).getAttribute('class')).split(' ').includes(saved.routes[floor][lane]));}assert.equal(await rows.last().locator('.node.boss').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.reload();await page.locator('.hero-profile').waitFor();saved=JSON.parse(await page.evaluate(()=>localStorage.getItem('saa-tower-run-v1')));assert.equal(saved.hero,id);
  await page.locator('.route-row.current [data-action="node"]').first().tap();await page.locator('.hand').waitFor();await page.evaluate(()=>window.scrollTo(0,0));
  await page.locator('.hero-model.model-'+id).waitFor();assert.equal(await page.locator('.hero-tag').innerText(),HEROES[id].name);await page.screenshot({path:'artifacts/hero-'+id+'.png'});
  const hand=await page.locator('.hand').boundingBox();assert.ok(hand.y<400,id+' hand visible without scrolling');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 const prior=await page.evaluate(()=>localStorage.getItem('saa-tower-run-v1'));accept=false;await page.getByRole('button',{name:'最初から',exact:true}).tap();assert.equal(await page.evaluate(()=>localStorage.getItem('saa-tower-run-v1')),prior);
 console.log('PASS heroes: 3 random-start outcomes, relic display, 320px, reload persistence, restart cancellation.');
 }finally{await context.close();}
}
