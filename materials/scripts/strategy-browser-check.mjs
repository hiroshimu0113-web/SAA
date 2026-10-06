import assert from 'node:assert/strict';
import {newRun,act} from '../public/tower/engine.mjs';
export async function checkStrategy(browser,base){
 const c=await browser.newContext({viewport:{width:320,height:740},isMobile:true,hasTouch:true}),p=await c.newPage();p.setDefaultTimeout(10000);
 try{
 await p.goto(base+'tower/strategy.html');const s=act(newRun(1),{type:'node',lane:0});s.battle.enemy='noise';s.battle.hp=s.battle.maxHp=32;s.battle.playerStrength=2;s.battle.block=3;s.deck.find(c=>c.uid===s.battle.hand[0]).id='parallel';s.deck.find(c=>c.uid===s.battle.hand[1]).id='optimize';
 const raw=JSON.stringify(s);await p.evaluate(raw=>localStorage.setItem('saa-tower-run-v1',raw),raw);await p.reload();
 assert.match(await p.locator('.playable-count').innerText(),/6枚/);assert.equal(await p.locator('.hand .card-summary').first().innerText(),'敵HP −9');
 await p.locator('.relic-details summary').tap();await p.getByText('観測灯',{exact:true}).waitFor();assert.match(await p.locator('.relic-details').innerText(),/最初のターン/);
 await p.locator('.hand .card').first().focus();await p.keyboard.press('Shift+F10');assert.match(await p.locator('.card-plan').innerText(),/敵：−9/);assert.match(await p.locator('.card-plan').innerText(),/各ヒット/);assert.equal(await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1')),raw);
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:'artifacts/strategy-detail.png',fullPage:true});await p.getByRole('button',{name:'閉じる',exact:true}).tap();await p.locator('.hand .card').first().tap();assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('saa-tower-run-v1')).battle.hp),23);
 s.battle.energy=0;await p.evaluate(s=>localStorage.setItem('saa-tower-run-v1',JSON.stringify(s)),s);await p.reload();assert.match(await p.locator('.playable-count').innerText(),/ありません/);await p.locator('.hand .card').first().focus();await p.keyboard.press('Shift+F10');assert.match(await p.locator('.card-plan').innerText(),/エナジー不足/);
 const reward=act({...s,battle:{...s.battle,hp:1,energy:3}},{type:'play',uid:s.battle.hand[0]});reward.reward=['parallel','reserve','cache'];await p.evaluate(s=>localStorage.setItem('saa-tower-run-v1',JSON.stringify(s)),reward);await p.reload();await p.getByRole('heading',{name:'デッキの次の一手'}).waitFor();assert.ok(await p.locator('.synergy-note').count()>0);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:'artifacts/strategy-reward.png',fullPage:true});
 console.log('PASS strategy: live forecast, no save mutation, energy availability, touch-readable relics, synergy hints, reward layout and 320px.');
 }finally{await c.close();}
}
