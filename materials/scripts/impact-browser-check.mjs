import assert from 'node:assert/strict';
import {act} from '../public/tower/engine.mjs';
import {fixedRun} from './fixed-run-fixture.mjs';
export async function checkImpact(browser,base){
 const c=await browser.newContext({viewport:{width:320,height:740},isMobile:true,hasTouch:true}),p=await c.newPage(),key='saa-tower-run-v1';p.setDefaultTimeout(10000);
 const load=async({block=0,energy=3}={})=>{
  const s=act(fixedRun(1),{type:'node',lane:0});s.hp=50;s.battle.enemy='noise';s.battle.hp=s.battle.maxHp=32;s.battle.playerBlock=block;s.battle.energy=energy;s.deck.find(c=>c.uid===s.battle.hand[0]).id='strike';
  await p.evaluate(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key,s});await p.reload();await p.evaluate(()=>{window.impacts=[];document.addEventListener('animationstart',e=>{if(e.animationName==='screen-impact'||e.animationName==='screen-fixed-impact')window.impacts.push({name:e.animationName,target:e.target.id||e.target.className,hud:document.querySelector('.battle-hud').getBoundingClientRect().top,toast:document.querySelector('.combat-toast')?.getBoundingClientRect().top});});});
 };
 const idle=()=>p.locator('#game[aria-busy="false"]').waitFor();
 const read=()=>p.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 try{
 await p.goto(base+'tower/impact.html');await load({block:3});await p.locator('.end-turn').tap();await idle();let hits=await p.evaluate(()=>window.impacts);
 assert.equal(hits.filter(x=>x.name==='screen-impact').length,1);assert.ok(hits.some(x=>x.target.includes('battle-hud')));assert.ok(hits.some(x=>x.target.includes('combat-toast')));assert.equal((await read()).hp,46);assert.equal(await p.locator('.screen-shake,html.screen-shaking').count(),0);
 await load({block:20});await p.locator('.end-turn').tap();await idle();assert.deepEqual(await p.evaluate(()=>window.impacts),[]);assert.equal((await read()).hp,50);
 await load();await p.locator('.hand .card').first().tap();await p.waitForTimeout(400);assert.deepEqual(await p.evaluate(()=>window.impacts),[]);assert.equal((await read()).battle.hp,26);
 await p.emulateMedia({reducedMotion:'reduce'});await load({block:3});await p.locator('.end-turn').tap();await p.locator('.combat-toast').waitFor();assert.match(await p.locator('.combat-toast').innerText(),/−4/);await idle();assert.deepEqual(await p.evaluate(()=>window.impacts),[]);assert.equal((await read()).hp,46);
 await p.emulateMedia({reducedMotion:'no-preference'});await load({energy:1});await p.evaluate(()=>window.scrollTo(0,document.querySelector('.hand').getBoundingClientRect().top+scrollY+10));
 await p.locator('.hand .card').first().tap();const scroll=await p.evaluate(()=>scrollY);await idle();hits=await p.evaluate(()=>window.impacts);assert.equal(hits.filter(x=>x.name==='screen-impact').length,1);assert.ok(hits.every(x=>Math.abs(x.hud)<1&&x.toast>=0&&x.toast<innerHeightSafe));
 assert.equal(await p.evaluate(()=>scrollY),scroll);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));const saved=await read();await p.reload();assert.deepEqual(await read(),saved);assert.equal(await p.locator('.screen-shake,html.screen-shaking').count(),0);
 console.log('PASS screen impact: partial guard shakes game/HUD/results, full guard and outgoing hits do not, reduced motion, scrolled auto-end and no replay.');
 }finally{await c.close();}
}
const innerHeightSafe=740;
