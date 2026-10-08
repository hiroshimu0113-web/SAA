import assert from 'node:assert/strict';
import {act,newRun} from '../public/tower/engine.mjs';
import {BASE_COMBOS} from '../public/tower/combos.mjs';
export async function checkRoleSeams(browser,base){
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),p=await context.newPage();
 try{
 await p.goto(base+'tower/role-seams.html');const s=act(newRun(2),{type:'node',lane:0});const ids=['strike','guard','probe','balance','parallel','analysis','cache','optimize','restore'];s.nextId=ids.length;s.deck=ids.map((id,uid)=>({id,uid,plus:false}));s.battle.hand=s.deck.slice(0,5).map(c=>c.uid);s.battle.draw=s.deck.slice(5).map(c=>c.uid);s.battle.discard=[];s.battle.exhaust=[];
 await p.evaluate(s=>localStorage.setItem('saa-tower-run-v1',JSON.stringify(s)),s);await p.reload();const saved=await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1'));
 const probe=p.locator('.hand .card[data-id=probe]');assert.equal(await probe.locator('.role-seam').count(),2);
 await p.locator('[data-action=options]').tap();await p.getByRole('button',{name:'デッキ',exact:true}).tap();
 for(const [role,data] of Object.entries(BASE_COMBOS)){const paths=[];for(const id of data.cards){const c=p.locator('.options-cards .card[data-id='+id+']'),seam=c.locator('[data-combo='+role+']');assert.equal(await seam.count(),1);paths.push(await seam.locator('path').getAttribute('d'));const boxes=await c.evaluate(e=>{const box=x=>{const r=x.getBoundingClientRect();return{top:r.top,bottom:r.bottom};};return{title:box(e.querySelector('.card-title')),seams:box(e.querySelector('.role-seams')),effects:box(e.querySelector('.card-effect-icons'))};});assert.ok(boxes.title.bottom<=boxes.seams.top+1&&boxes.seams.bottom<=boxes.effects.top+1);}assert.equal(new Set(paths).size,1);}
 assert.equal(await p.locator('.options-cards .card[data-id=restore] .role-seam').count(),0);
 for(const width of [320,390,1000]){await p.setViewportSize({width,height:844});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.ok(await p.locator('.options-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth));}
 await p.setViewportSize({width:390,height:844});await p.screenshot({path:'artifacts/role-seams-deck.png'});
 const card=p.locator('.options-cards .card[data-id=probe]');await card.focus();await p.keyboard.press('Enter');assert.equal(await p.locator('.options-card-detail .role-seam').count(),2);await p.keyboard.press('Escape');await p.getByRole('button',{name:'戻る',exact:true}).tap();await p.getByRole('button',{name:'役一覧',exact:true}).tap();assert.equal(await p.locator('.role-seam-key .role-seam').count(),3);assert.equal(new Set(await p.locator('.role-seam-key path').evaluateAll(es=>es.map(e=>e.getAttribute('d')))).size,3);await p.keyboard.press('Escape');assert.equal(await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1')),saved);
 console.log('PASS role seams: exact memberships, shared/distinct paths, two-role card, no-role card, title/seam/effect order, detail and guide, 320/390/1000px, unchanged save.');
 }finally{await context.close();}
}
