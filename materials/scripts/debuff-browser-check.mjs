import {fixedRun as newRun} from './fixed-run-fixture.mjs';
import {DEBUFFS} from '../public/tower/debuffs.mjs';
import assert from 'node:assert/strict';
import {act,ENEMIES,ENEMY_POOLS,enemyDebuffTypes} from '../public/tower/engine.mjs';
const key='saa-tower-run-v1';
function battle(enemy){const s=act(newRun(1),{type:'node',lane:0});s.battle.enemy=enemy;s.battle.hp=s.battle.maxHp=ENEMIES[enemy].hp;return s;}
export async function checkDebuffs(browser,base){
 const c=await browser.newContext({viewport:{width:320,height:740},isMobile:true,hasTouch:true}),p=await c.newPage();p.setDefaultTimeout(10000);
 try{
  await p.goto(base+'tower/debuff.html');
  const read=()=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  const setup=async s=>{await p.evaluate(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key,s});await p.reload();};
  await setup(battle('boss'));assert.match(await p.locator('.intent').innerText(),/遅延/);
  await p.locator('.end-turn').tap();assert.match(await p.locator('.delay-notice').innerText(),/前半/);assert.equal((await read()).battle.playerActions,2);assert.equal((await read()).battle.playerDebuffs.delay,2);assert.equal((await read()).battle.enemyStep,2);
  const before=await read();await p.reload();await p.locator('.end-turn').tap();const after=await read();assert.equal(after.battle.enemyStep,before.battle.enemyStep);assert.equal(after.hp,before.hp);assert.equal(after.battle.playerActions,1);assert.match(await p.locator('.delay-notice').innerText(),/後半/);
  await p.evaluate(()=>window.scrollTo(0,0));await p.screenshot({path:'artifacts/player-double-action.png'});await p.locator('.end-turn').tap();assert.equal((await read()).battle.playerDebuffs.delay,0);assert.equal(await p.locator('.player-column [data-debuff="burn"]').getAttribute('aria-label'),'炎上 3');
  await p.locator('[data-status="player"]').focus();await p.keyboard.press('Enter');const text=await p.locator('.status-dialog').innerText();for(const word of ['炎上','過負荷','遅延','枯渇','設定不備'])assert.ok(text.includes(word));assert.ok(!text.includes('弱体'));await p.getByRole('button',{name:'閉じる',exact:true}).tap();
  let s=battle('noise');s.battle.enemyDebuffs.delay=1;await setup(s);await p.locator('.end-turn').tap();assert.match(await p.locator('.intent').innerText(),/2回行動.*攻撃 7.*防御 7/);await p.evaluate(()=>window.scrollTo(0,0));await p.locator('.combat-toast').waitFor({state:'detached'});await p.screenshot({path:'artifacts/enemy-double-action.png'});
  // Reload the pending action; offline coverage uses the shared server-stop harness.
  await p.reload();await p.locator('.end-turn').tap();assert.equal((await read()).hp,65);assert.equal((await read()).battle.enemyStep,2);
  s=battle('elite');await setup(s);await p.locator('.end-turn').tap();assert.equal(await p.locator('.player-column [data-debuff="misconfig"]').getAttribute('aria-label'),'設定不備 2');assert.match(await p.locator('.intent').innerText(),/攻撃 18/);
  for(const id of [...ENEMY_POOLS.elite,...ENEMY_POOLS.boss]){
   await setup(battle(id));await p.locator('[data-status="enemy"]').focus();await p.keyboard.press('Enter');
   const abilities=await p.locator('.enemy-abilities').innerText();for(const [key,d] of Object.entries(DEBUFFS))assert.equal(abilities.includes(d.name),enemyDebuffTypes(id).includes(key));
   await p.getByRole('button',{name:'閉じる',exact:true}).tap();await p.reload();assert.equal((await read()).battle.enemy,id);
  }
  assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  s=battle('noise');s.version=3;s.battle.weak=2;delete s.battle.enemyDebuffs;delete s.battle.playerDebuffs;delete s.battle.enemyStep;delete s.battle.playerActions;delete s.battle.events;await setup(s);assert.equal(await p.locator('.enemy-column [data-debuff="overload"]').getAttribute('aria-label'),'過負荷 2');assert.ok(!(await p.locator('#game').innerText()).includes('弱体'));await p.locator('.end-turn').tap();assert.equal((await read()).version,4);
  console.log('PASS debuffs: boss/elite warnings, player skip + two windows, five status explanations, enemy ordered double action, reload, legacy migration and 320px.');
 }finally{await c.close();}
}

export async function checkDebuffOffline(p){
 const old=await p.evaluate(k=>localStorage.getItem(k),key),s=battle('noise');s.battle.enemyDebuffs.delay=2;
 await p.evaluate(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key,s});await p.reload();
 assert.match(await p.locator('.intent').innerText(),/2回行動.*攻撃 7.*防御 7/);
 await p.locator('.end-turn').tap();const after=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 assert.equal(after.hp,65);assert.equal(after.battle.enemyStep,2);assert.equal(after.battle.enemyDebuffs.delay,0);
 await p.reload();assert.equal(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).battle.enemyStep,key),2);
 await p.evaluate(({key,old})=>localStorage.setItem(key,old),{key,old});await p.reload();
 console.log('PASS offline debuff pending double action, exact resolution and no replay.');
}
