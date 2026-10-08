import assert from 'node:assert/strict';
import {fixedRun} from './fixed-run-fixture.mjs';
import {act} from '../public/tower/engine.mjs';
export async function checkJunk(browser,base){
 const context=await browser.newContext({viewport:{width:320,height:740},isMobile:true,hasTouch:true}),p=await context.newPage(),key='saa-tower-run-v1';
 try{
 await p.goto(base+'tower/junk.html');let s=act(fixedRun(1),{type:'node',lane:0});s.battle.enemy='boss_resource';s.battle.hp=s.battle.maxHp=125;s.battle.enemyStep=4;
 const load=async s=>{await p.evaluate(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key,s});await p.reload();};const read=()=>p.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 await load(s);assert.match(await p.locator('.intent').innerText(),/攻撃 10.*障害ログ 1枚/);await p.locator('.end-turn').tap();s=await read();const junk=s.deck.find(c=>c.id==='junk');assert.ok(junk);await p.reload();assert.deepEqual(await read(),s);
 for(const pile of ['hand','draw','discard','exhaust'])s.battle[pile]=s.battle[pile].filter(uid=>uid!==junk.uid);s.battle.hand.push(junk.uid);s.battle.energy=2;await load(s);
 const card=p.locator('.hand [data-id="junk"]');assert.equal(await card.locator('.kind').getAttribute('aria-label'),'お邪魔');assert.equal(await card.locator('.kind .icon-junk').count(),1);assert.equal(await card.locator('.cost').innerText(),'1');assert.equal(await card.locator('.effect-badge').getAttribute('aria-label'),'使用後、この戦闘中は除外');await card.focus();await p.keyboard.press('Shift+F10');assert.match(await p.locator('.card-preview').innerText(),/戦闘終了時に消滅/);await p.getByRole('button',{name:'閉じる',exact:true}).tap();await card.scrollIntoViewIfNeeded();await p.evaluate(()=>window.scrollTo(0,0));await p.screenshot({path:'artifacts/junk-card.png'});await card.tap();s=await read();assert.equal(s.battle.energy,1);assert.ok(s.battle.exhaust.includes(junk.uid));await p.reload();assert.deepEqual(await read(),s);assert.equal(await p.locator('.hand [data-id="junk"]').count(),0);assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 s=act(fixedRun(1),{type:'node',lane:0});s.battle.enemy='noise';s.battle.hp=s.battle.maxHp=32;s.battle.enemyStep=3;await load(s);assert.equal(await p.locator('.intent').innerText(),'障害ログ 2枚を山札へ');await p.locator('.end-turn').tap();const normal=await read();assert.equal(normal.hp,s.hp);assert.equal(normal.deck.filter(c=>c.id==='junk').length,2);await p.reload();assert.deepEqual(await read(),normal);
 console.log('PASS junk: enemy forecast, generation, saved piles, readable card, one-energy exhaust and reload at 320px.');
 }finally{await context.close();}
}
