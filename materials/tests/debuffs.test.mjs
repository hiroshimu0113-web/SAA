import {fixedRun as newRun} from '../scripts/fixed-run-fixture.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {act,parseRun,ENEMIES,CARDS,ROUTES,intent,intentActions} from '../public/tower/engine.mjs';
import {DEBUFFS,applyDebuff,attackAmount,blockAmount} from '../public/tower/debuffs.mjs';
import {combatEffects} from '../public/tower/effects.mjs';
import {inspectPlay} from '../public/tower/strategy.mjs';
function start(enemy='noise',card='strike'){
 const s=act(newRun(1),{type:'node',lane:0});s.battle.enemy=enemy;s.battle.hp=s.battle.maxHp=ENEMIES[enemy].hp;
 s.deck.find(c=>c.uid===s.battle.hand[0]).id=card;if(enemy==='boss'){s.floor=8;s.history=ROUTES.map((r,floor)=>({floor,lane:0,type:r[0]}));}return s;
}
const end=s=>act(s,{type:'end'});
const play=s=>act(s,{type:'play',uid:s.battle.hand[0]});
const round=s=>{assert.deepEqual(parseRun(JSON.stringify(s)),s);return s;};
test('debuffs: five types, player access, enemy tier restrictions and no weak cards',()=>{
 assert.equal(Object.keys(DEBUFFS).length,5);
 assert.deepEqual(new Set(Object.values(CARDS).flatMap(c=>c.debuff?[c.debuff.id]:[])),new Set(Object.keys(DEBUFFS)));
 for(const [id,e] of Object.entries(ENEMIES)){
  const kinds=new Set(e.pattern.filter(a=>a[0]==='debuff').map(a=>a[2]));
  if(e.tier==='boss')assert.ok(kinds.size>=2&&kinds.size<=3);else assert.equal(kinds.size,e.tier==='elite'?1:0);
  for(const k of kinds)assert.ok(DEBUFFS[k]);
 }
 assert.ok(Object.values(CARDS).every(c=>!('weak'in c)));
});
test('debuffs: attack and new block modifiers apply on both sides, before absorption',()=>{
 let s=start();s.battle.playerDebuffs.overload=2;s.battle.enemyDebuffs.misconfig=2;s.battle.block=2;
 assert.equal(inspectPlay(s,s.deck.find(c=>c.uid===s.battle.hand[0])).brief,'AT ＋4');
 assert.equal(play(s).battle.hp,29); // floor(6 * .75 * 1.25) - 2 = 3
 s=start();s.battle.enemyDebuffs.overload=2;s.battle.playerDebuffs.misconfig=2;s.battle.playerBlock=2;
 assert.equal(intent(s).value,6);assert.equal(end(s).hp,68);
 s=start('noise','guard');s.battle.playerDebuffs.depletion=2;s.battle.playerBlock=9;
 assert.equal(play(s).battle.playerBlock,11); // existing block stays; floor(5/2)
 s=start();s.battle.enemyStep=1;s.battle.enemyDebuffs.depletion=2;assert.equal(intent(s).value,3);assert.equal(end(s).battle.block,3);
 assert.equal(attackAmount(1,{overload:1},{misconfig:0}),0);assert.equal(blockAmount(1,{depletion:1}),0);
});
test('debuffs: burn bypasses block, decays once per turn, can win/lose and stops subsequent actions',()=>{
 let s=start();s.battle.playerBlock=100;s.battle.playerDebuffs.burn=3;s.battle.enemyDebuffs.burn=3;
 let n=round(end(s));assert.equal(n.hp,69);assert.equal(n.battle.hp,29);assert.equal(n.battle.playerDebuffs.burn,2);assert.equal(n.battle.enemyDebuffs.burn,2);
 assert.ok(combatEffects(s,n,{type:'end'}).some(e=>e.label==='炎上 −3'));
 s=start();s.hp=2;s.battle.playerDebuffs.burn=3;n=round(end(s));assert.equal(n.phase,'lost');assert.equal(n.battle.enemyStep,0);
 s=start();s.battle.hp=2;s.battle.enemyDebuffs.burn=3;n=round(end(s));assert.equal(n.phase,'reward');assert.equal(n.battle.hp,0);
 s=start();s.hp=1;s.battle.enemyDebuffs.delay=2;s.battle.enemyDebuffs.burn=3;n=round(end(s));assert.equal(n.phase,'lost');assert.equal(n.battle.enemyStep,1);assert.equal(n.battle.block,0);
});
test('debuffs: enemy delay skips, saves its cursor, executes two ordered actions and forbids reapplication',()=>{
 let s=start();applyDebuff(s.battle.enemyDebuffs,'delay',1);assert.equal(intent(s).type,'wait');assert.equal(applyDebuff(s.battle.enemyDebuffs,'delay',1),false);
 s=round(end(s));assert.equal(s.hp,72);assert.equal(s.battle.enemyStep,0);assert.equal(s.battle.enemyDebuffs.delay,2);
 assert.deepEqual(intent(s),{type:'double',actions:[{type:'attack',value:7},{type:'guard',value:7}]});
 assert.equal(applyDebuff(s.battle.enemyDebuffs,'delay',1),false);
 s=round(end(s));assert.equal(s.hp,65);assert.equal(s.battle.block,7);assert.equal(s.battle.enemyStep,2);assert.equal(s.battle.enemyDebuffs.delay,0);
 assert.equal(intent(s).value,10);assert.equal(applyDebuff(s.battle.enemyDebuffs,'delay',1),true);
 s=start('surge');s.battle.enemyDebuffs.delay=2;assert.deepEqual(intentActions(s),[{type:'buff',value:2},{type:'attack',value:10}]);assert.equal(end(s).hp,62);
 s=start('elite');s.battle.enemyDebuffs.delay=2;assert.equal(intentActions(s)[1].value,18);s=round(end(s));assert.equal(s.hp,54);assert.equal(s.battle.playerDebuffs.misconfig,2);
});
test('debuffs: boss delay gives player a skipped turn then two windows with preserved block and once-only roles',()=>{
 let s=round(end(start('boss')));assert.equal(s.battle.playerDebuffs.delay,1);assert.equal(s.battle.hand.length,0);assert.equal(s.battle.energy,0);
 // Even a forged zero-cost hand cannot bypass the engine-level delay lock.
 const forged=structuredClone(s),uid=forged.battle.draw.pop();forged.battle.hand.push(uid);forged.deck.find(c=>c.uid===uid).id='retry';assert.equal(act(forged,{type:'play',uid}),forged);
 s=round(end(s));assert.equal(s.battle.playerDebuffs.delay,2);assert.equal(s.battle.playerActions,2);assert.equal(s.battle.hand.length,5);assert.equal(s.battle.energy,3);
 s.battle.playerBlock=12;s.battle.playerDebuffs.burn=2;s.battle.comboPlayed=['strike'];const step=s.battle.enemyStep,turn=s.battle.turn,hp=s.hp;
 s=round(end(s));assert.equal(s.battle.playerActions,1);assert.equal(s.battle.enemyStep,step);assert.equal(s.battle.turn,turn);assert.equal(s.hp,hp);assert.equal(s.battle.playerBlock,12);assert.equal(s.battle.playerDebuffs.burn,2);assert.deepEqual(s.battle.comboPlayed,['strike']);assert.equal(s.battle.hand.length,5);
 s=round(end(s));assert.equal(s.battle.enemyStep,step+1);assert.equal(s.battle.playerDebuffs.delay,0);assert.equal(s.hp,hp-2);assert.equal(s.battle.playerDebuffs.burn,4); // decays to 1, boss adds 3
});
test('debuffs: duration stacking, new enemy debuffs survive first application, blocked delay uses no extra stacks',()=>{
 let s=start('elite');s=end(s);assert.equal(s.battle.playerDebuffs.misconfig,2);s=end(s);assert.equal(s.hp,54);assert.equal(s.battle.playerDebuffs.misconfig,1);s=end(s);assert.equal(s.hp,31);assert.equal(s.battle.playerDebuffs.misconfig,0);
 s=start('noise','isolate');s.battle.enemyDebuffs.overload=2;assert.equal(play(s).battle.enemyDebuffs.overload,4);
 s=start('noise','detour');s.battle.enemyDebuffs.delay=2;const n=play(s);assert.equal(n.battle.enemyDebuffs.delay,2);assert.ok(n.battle.exhaust.includes(s.battle.hand[0]));
});
test('debuffs: old saves migrate weak to overload, preserve deck and reject corrupt new state',()=>{
 for(const version of [1,2,3]){
  const old=start();old.version=version;old.battle.weak=2;delete old.battle.enemyDebuffs;delete old.battle.playerDebuffs;delete old.battle.enemyStep;delete old.battle.playerActions;delete old.battle.events;
  const n=parseRun(JSON.stringify(old));assert.equal(n.version,4);assert.equal(n.battle.enemyDebuffs.overload,2);assert.equal('weak'in n.battle,false);assert.deepEqual(n.deck,old.deck);round(n);
 }
 for(const mutate of [s=>s.battle.playerDebuffs.burn=-1,s=>s.battle.enemyDebuffs.delay=1000,s=>delete s.battle.enemyDebuffs.overload,s=>s.battle.enemyStep=-1,s=>s.battle.playerActions=2,s=>s.battle.weak=1,s=>s.battle.playerDebuffs.delay=1]){
  const s=start();mutate(s);assert.throws(()=>parseRun(JSON.stringify(s)));
 }
});
test('debuffs: double attacks consume block once, and delay followed by lethal attack remains loadable',()=>{
 let s=start('deadlock');s.battle.enemyStep=2;s.battle.enemyDebuffs.delay=2;s.battle.playerBlock=15;
 s=round(end(s));assert.equal(s.hp,63);assert.equal(s.battle.enemyStep,4);
 s=start('boss');s.battle.enemyDebuffs.delay=2;s.hp=11;s=round(end(s));assert.equal(s.phase,'lost');assert.equal(s.battle.enemyStep,2);
 // Enemy can apply delay and then die from burn before the next player turn starts.
 s=start('boss');s.battle.hp=1;s.battle.enemyDebuffs.burn=1;s=round(end(s));assert.equal(s.phase,'won');
});
