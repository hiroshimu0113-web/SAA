import assert from 'node:assert/strict';
import {act} from '../public/tower/engine.mjs';
import {fixedRun} from './fixed-run-fixture.mjs';
export async function checkTurnBanners(browser,base){
 const c=await browser.newContext({viewport:{width:320,height:740},isMobile:true,hasTouch:true}),p=await c.newPage(),key='saa-tower-run-v1';p.setDefaultTimeout(12000);
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const read=()=>p.evaluate(key=>localStorage.getItem(key),key);
 const make=()=>{const s=act(fixedRun(1),{type:'node',lane:0});s.battle.enemy='noise';s.battle.hp=s.battle.maxHp=32;return s;};
 const load=async s=>{await p.evaluate(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key,s});await p.reload();await p.evaluate(()=>{
  window.turnStages=[];let last=null;const observer=new MutationObserver(()=>{const stage=document.querySelector('.turn-banner')?.textContent||(document.querySelector('.combat-toast')?'result':null);if(stage!==last){window.turnStages.push({stage,time:performance.now()});last=stage;}});observer.observe(document.body,{childList:true,subtree:true});
 });};
 const idle=()=>p.locator('#game[aria-busy="false"]').waitFor();
 try{
 await p.goto(base+'tower/turns.html');await load(make());await p.locator('.end-turn').tap();await p.locator('.enemy-turn').waitFor();
 assert.equal(await p.locator('.end-turn').isDisabled(),true);const committed=await read();assert.equal(JSON.parse(committed).battle.turn,2);
 await p.evaluate(()=>document.querySelector('.end-turn').dispatchEvent(new MouseEvent('click',{bubbles:true})));await p.keyboard.press('Enter');assert.equal(await read(),committed);
 await p.screenshot({path:'artifacts/enemy-turn.png'});await p.locator('.your-turn').waitFor();assert.equal(await p.locator('.end-turn').isDisabled(),true);await p.screenshot({path:'artifacts/your-turn.png'});await idle();assert.equal(await p.locator('.end-turn').isDisabled(),false);
 const stages=await p.evaluate(()=>window.turnStages);assert.deepEqual(stages.filter(x=>x.stage).map(x=>x.stage),['Enemy Turn','result','Your Turn']);
 for(const label of ['Enemy Turn','Your Turn']){const i=stages.findIndex(x=>x.stage===label);assert.ok(stages[i+1].time-stages[i].time>=450,label+' should last 0.5 seconds');}
 assert.equal(await read(),committed);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 await p.emulateMedia({reducedMotion:'reduce'});let s=make();s.deck=s.deck.map(c=>({...c,id:'guard'}));s.battle.energy=1;await load(s);await p.locator('.hand .card').first().tap();await idle();assert.deepEqual(await p.evaluate(()=>window.turnStages.filter(x=>x.stage).map(x=>x.stage)),['result','Enemy Turn','result','Your Turn']);assert.equal(JSON.parse(await read()).battle.turn,2);
 // Reload during the enemy banner: saved final state resumes without replay.
 await load(make());await p.locator('.end-turn').tap();await p.locator('.enemy-turn').waitFor();const saved=await read();await p.reload();await idle();assert.equal(await read(),saved);assert.equal(await p.locator('.turn-banner,.turn-blocker').count(),0);
 s=make();s.battle.playerDebuffs.delay=2;s.battle.playerActions=2;await load(s);await p.locator('.end-turn').tap();await idle();assert.deepEqual(await p.evaluate(()=>window.turnStages.filter(x=>x.stage).map(x=>x.stage)),['Your Turn']);assert.equal(JSON.parse(await read()).battle.enemyStep,0);
 s=make();s.battle.hp=1;s.battle.energy=1;s.deck.find(c=>c.uid===s.battle.hand[0]).id='strike';await load(s);await p.locator('.hand .card').first().tap();await p.getByRole('heading',{name:'デッキの次の一手'}).waitFor();assert.equal(await p.locator('.turn-banner').count(),0);assert.equal(JSON.parse(await read()).phase,'reward');
 s=make();s.hp=1;await load(s);await p.locator('.end-turn').tap();await idle();assert.deepEqual(await p.evaluate(()=>window.turnStages.filter(x=>x.stage).map(x=>x.stage)),['Enemy Turn','result']);assert.equal(JSON.parse(await read()).phase,'lost');
 assert.deepEqual(errors,[]);console.log('PASS turn banners: ordered 500ms banners/results, input lock, atomic save, auto end, double window, defeat/victory, reload, reduced motion and 320px.');
 }finally{await c.close();}
}
