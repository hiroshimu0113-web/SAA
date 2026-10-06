import assert from 'node:assert/strict';
import {newRun,act} from '../public/tower/engine.mjs';
export async function checkStrategy(browser,base){
 const c=await browser.newContext({viewport:{width:320,height:740},isMobile:true,hasTouch:true}),p=await c.newPage();p.setDefaultTimeout(10000);
 try{
 await p.goto(base+'tower/strategy.html');const s=act(newRun(1),{type:'node',lane:0});s.battle.enemy='noise';s.battle.hp=s.battle.maxHp=32;s.battle.playerStrength=2;s.battle.weak=2;s.battle.armor=3;s.battle.block=3;s.deck.find(c=>c.uid===s.battle.hand[0]).id='parallel';s.deck.find(c=>c.uid===s.battle.hand[1]).id='optimize';
 const raw=JSON.stringify(s);await p.evaluate(raw=>localStorage.setItem('saa-tower-run-v1',raw),raw);await p.reload();await p.evaluate(()=>window.scrollTo(0,0));
 assert.equal(await p.locator('.strategy-panel,.battle-bar,.turn-forecast,.playable-count').count(),0);
 const hand=await p.locator('.hand').boundingBox();assert.ok(hand.y>0&&hand.y<400,'hand should be visible without scrolling');
 await p.screenshot({path:'artifacts/compact-battle.png'});
 const touch=browser.browserType().name()==='chromium'?await c.newCDPSession(p):null;
 for(const side of ['player','enemy']){
  const target=p.locator('[data-status="'+side+'"]'),box=await target.boundingBox(),x=box.x+box.width/2,y=box.y+box.height/2;
  await target.tap();assert.equal(await p.locator('.status-dialog[open]').count(),0,'short tap does not inspect');
  if(touch)await touch.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});else{await p.mouse.move(x,y);await p.mouse.down();}
  await p.waitForTimeout(550);await p.locator('.status-dialog[open]').waitFor();
  if(touch)await touch.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});else await p.mouse.up();
  await p.waitForTimeout(550);const text=await p.locator('.status-dialog').innerText();assert.match(text,side==='enemy'?/弱体\s+2/:/毎ターン防御\s+3/);
  assert.equal(await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1')),raw);await p.screenshot({path:'artifacts/status-'+side+'.png'});await p.getByRole('button',{name:'閉じる',exact:true}).tap();
 }
 await p.locator('[data-status="enemy"]').focus();await p.keyboard.press('Enter');await p.locator('.status-dialog[open]').waitFor();await p.keyboard.press('Escape');assert.equal(await p.locator('.status-dialog[open]').count(),0);
assert.equal(await p.locator('.hand .card-summary').first().innerText(),'敵HP −9');
 await p.locator('.relic-details summary').tap();await p.getByText('観測灯',{exact:true}).waitFor();assert.match(await p.locator('.relic-details').innerText(),/最初のターン/);
 await p.locator('.hand .card').first().focus();await p.keyboard.press('Shift+F10');assert.match(await p.locator('.card-plan').innerText(),/敵：−9/);assert.match(await p.locator('.card-plan').innerText(),/各ヒット/);assert.equal(await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1')),raw);
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:'artifacts/strategy-detail.png',fullPage:true});await p.getByRole('button',{name:'閉じる',exact:true}).tap();await p.locator('.hand .card').first().tap();assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('saa-tower-run-v1')).battle.hp),23);
 s.battle.energy=0;await p.evaluate(s=>localStorage.setItem('saa-tower-run-v1',JSON.stringify(s)),s);await p.reload();await p.locator('.hand .card').first().focus();await p.keyboard.press('Shift+F10');assert.match(await p.locator('.card-plan').innerText(),/エナジー不足/);
 const reward=act({...s,battle:{...s.battle,hp:1,energy:3}},{type:'play',uid:s.battle.hand[0]});reward.reward=['parallel','reserve','cache'];await p.evaluate(s=>localStorage.setItem('saa-tower-run-v1',JSON.stringify(s)),reward);await p.reload();await p.getByRole('heading',{name:'デッキの次の一手'}).waitFor();assert.ok(await p.locator('.synergy-note').count()>0);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:'artifacts/strategy-reward.png',fullPage:true});
 console.log('PASS strategy: live forecast, no save mutation, energy availability, touch-readable relics, synergy hints, reward layout and 320px.');
 }finally{await c.close();}
}
