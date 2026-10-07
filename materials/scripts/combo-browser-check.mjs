import {fixedRun as newRun} from './fixed-run-fixture.mjs';
import assert from 'node:assert/strict';
import {act} from '../public/tower/engine.mjs';
import {COMBOS} from '../public/tower/combos.mjs';
export async function checkCombos(browser,base){
 const c=await browser.newContext({viewport:{width:320,height:740},isMobile:true,hasTouch:true}),p=await c.newPage();p.setDefaultTimeout(10000);
 try{
  await p.goto(base+'tower/combo.html');
  for(const [id,r] of Object.entries(COMBOS)){
   const s=act(newRun(1),{type:'node',lane:0});s.battle.enemy='noise';s.battle.hp=s.battle.maxHp=32;s.deck=s.deck.map((card,i)=>({...card,id:r.cards[i]||'guard'}));s.battle.hand=s.deck.slice(0,6).map(c=>c.uid);s.battle.draw=s.deck.slice(6).map(c=>c.uid);s.battle.discard=[];s.battle.exhaust=[];
   await p.evaluate(s=>localStorage.setItem('saa-tower-run-v1',JSON.stringify(s)),s);await p.reload();
   for(const card of r.cards.slice(0,2))await p.locator('.hand .card[data-id="'+card+'"]').first().tap();
   const raw=await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1'));await p.reload();assert.equal(await p.locator('.combo-toast').count(),0);
   const last=p.locator('.hand .card[data-id="'+r.cards[2]+'"]').first();assert.match(await last.getAttribute('class'),/combo-ready/);
   await last.focus();await p.keyboard.press('Shift+F10');assert.ok((await p.locator('.combo-info').allInnerTexts()).some(t=>t.includes(r.name)));assert.equal(await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1')),raw);await p.getByRole('button',{name:'閉じる',exact:true}).tap();
   await last.tap();await p.locator('.combo-toast').waitFor();assert.match(await p.locator('.combo-toast').innerText(),new RegExp(r.name));assert.equal(await p.locator('.combo-icons span').count(),3);assert.equal(await p.locator('.combo-toast').evaluate(e=>getComputedStyle(e).pointerEvents),'none');
   const role=await p.locator('.combo-toast').boundingBox(),normal=await p.locator('.combat-toast').boundingBox();assert.ok(role.y>=normal.y+normal.height,'separate notifications');assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   if(id==='incident')await p.screenshot({path:'artifacts/combo-popup.png'});
   await p.locator('.combo-toast').waitFor({state:'detached',timeout:1800});const saved=await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1'));assert.ok(JSON.parse(saved).battle.comboDone.includes(id));await p.reload();assert.equal(await p.locator('.combo-toast').count(),0);assert.equal(await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1')),saved);
   await p.locator('.end-turn').tap();const next=JSON.parse(await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1')));assert.deepEqual(next.battle.comboDone,[]);assert.deepEqual(next.battle.comboPlayed,[]);
  }
  console.log('PASS combos: three roles, ready highlight, details, saved progress, one-second separate nonblocking popup, no replay and next-turn reset at 320px.');
 }finally{await c.close();}
}

export async function checkComboOffline(p){
 const old=await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1')),s=act(newRun(1),{type:'node',lane:0});s.deck=s.deck.map((c,i)=>({...c,id:COMBOS.incident.cards[i]||'guard'}));s.battle.hand=s.deck.slice(0,6).map(c=>c.uid);s.battle.draw=s.deck.slice(6).map(c=>c.uid);s.battle.discard=[];s.battle.exhaust=[];
 await p.evaluate(s=>localStorage.setItem('saa-tower-run-v1',JSON.stringify(s)),s);await p.reload();for(const id of ['probe','strike'])await p.locator('.hand .card[data-id="'+id+'"]').first().tap();await p.reload();await p.locator('.hand .card[data-id="guard"]').first().tap();await p.locator('.combo-toast').waitFor();assert.ok(await p.evaluate(()=>JSON.parse(localStorage.getItem('saa-tower-run-v1')).battle.comboDone.includes('incident')));await p.evaluate(old=>localStorage.setItem('saa-tower-run-v1',old),old);await p.reload();await p.locator('.hand').waitFor();console.log('PASS offline role progress, reload and completion.');
}
