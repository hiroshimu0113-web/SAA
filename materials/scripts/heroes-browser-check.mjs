import assert from 'node:assert/strict';
import {HEROES,act,newRun} from '../public/tower/engine.mjs';
export async function checkHeroes(browser,base){
 const context=await browser.newContext({viewport:{width:320,height:740},isMobile:true,hasTouch:true});
 try{
 const page=await context.newPage();await page.goto(base+'tower/models.html');
 const dialogs=[];page.on('dialog',d=>{dialogs.push(d.message());d.dismiss();});
 for(const [seed,id] of Object.keys(HEROES).entries()){
  await page.evaluate(seed=>{crypto.getRandomValues=a=>{a[0]=seed;return a;};},seed);
  if(seed!==0)await page.locator('[data-action=options]').tap();await page.getByRole('button',{name:seed===0?'冒険を始める':'はじめから',exact:true}).tap();
  await page.locator('[data-action=options]').tap();await page.getByRole('button',{name:'キャラ・レリック',exact:true}).tap();await page.locator('.hero-profile').filter({hasText:HEROES[id].name}).waitFor();await page.getByRole('button',{name:'オプションを閉じる',exact:true}).tap();
  let saved=JSON.parse(await page.evaluate(()=>localStorage.getItem('saa-tower-run-v1')));assert.equal(saved.hero,id);assert.equal(saved.deck.length,7);assert.equal(saved.deck.filter(c=>c.id==='strike').length,3);assert.equal(saved.deck.filter(c=>c.id==='guard').length,3);assert.deepEqual(saved.relics,[HEROES[id].relic]);
  const rows=page.locator('.route-row');assert.equal(await rows.count(),8);for(let floor=0;floor<8;floor++){const nodes=rows.nth(7-floor).locator('.node');assert.equal(await nodes.count(),saved.routes[floor].length);for(let lane=0;lane<saved.routes[floor].length;lane++)assert.ok((await nodes.nth(lane).getAttribute('class')).split(' ').includes(saved.routes[floor][lane]));}assert.equal(await rows.first().locator('.node.boss').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.reload();await page.locator('.route-map').waitFor();saved=JSON.parse(await page.evaluate(()=>localStorage.getItem('saa-tower-run-v1')));assert.equal(saved.hero,id);
  await page.locator('.route-row.current [data-action="node"]').first().tap();await page.locator('.hand').waitFor();await page.evaluate(()=>window.scrollTo(0,0));
  await page.locator('.hero-model.model-'+id).waitFor();assert.equal(await page.locator('.hero-tag').innerText(),HEROES[id].name);await page.screenshot({path:'artifacts/hero-'+id+'.png'});
  const hand=await page.locator('.hand').boundingBox();assert.ok(hand.y<400,id+' hand visible without scrolling');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await page.locator('[data-action=options]').tap();await page.getByRole('button',{name:'はじめから',exact:true}).tap();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('saa-tower-run-v1')).phase),'map');
 let boss=newRun(1);boss.floor=7;boss.history=boss.routes.slice(0,7).map((r,floor)=>({floor,lane:0,type:r[0]}));boss=act(boss,{type:'node',lane:0});boss.battle.hp=1;
 const strike=boss.deck.find(c=>c.id==='strike');boss.battle.hand=[strike.uid];boss.battle.draw=boss.deck.filter(c=>c.uid!==strike.uid).map(c=>c.uid);boss.battle.discard=[];boss.battle.exhaust=[];
 boss=act(boss,{type:'play',uid:strike.uid});assert.equal(boss.phase,'won');
 await page.evaluate(s=>localStorage.setItem('saa-tower-run-v1',JSON.stringify(s)),boss);await page.reload();await page.getByRole('button',{name:'新しい冒険を始める',exact:true}).tap();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('saa-tower-run-v1')).phase),'map');assert.deepEqual(dialogs,[]);

 console.log('PASS heroes: 3 random-start outcomes, relic display, 320px, reload persistence, immediate restart from options and boss victory without confirmation.');
 }finally{await context.close();}
}
