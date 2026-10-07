import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fixedRun} from '../scripts/fixed-run-fixture.mjs';
import {act,parseRun,intent,ENEMIES,ROUTES} from '../public/tower/engine.mjs';
import {resolveAction} from '../public/tower/turn-flow.mjs';
function start(){const s=act(fixedRun(1),{type:'node',lane:0});s.floor=8;s.history=ROUTES.map((row,floor)=>({floor,lane:0,type:row[0]}));s.battle.enemy='boss_resource';s.battle.hp=s.battle.maxHp=125;s.battle.enemyStep=4;return s;}
function round(s){assert.deepEqual(parseRun(JSON.stringify(s)),s);return s;}
function hand(s,uid){for(const pile of ['hand','draw','discard','exhaust'])s.battle[pile]=s.battle[pile].filter(x=>x!==uid);s.battle.hand.push(uid);}
test('junk generation is seeded, conserves piles, survives reload, skips with enemy delay',()=>{
 const s=start();assert.deepEqual(intent(s),{type:'junk',value:1,damage:10});const n=round(act(s,{type:'end'}));assert.deepEqual(n,act(s,{type:'end'}));assert.equal(n.deck.length,s.deck.length+1);assert.equal(n.hp,s.hp-10);
 const junk=n.deck.find(c=>c.id==='junk');assert.ok([...n.battle.hand,...n.battle.draw].includes(junk.uid));assert.equal(n.battle.enemyStep,5);
 s.battle.enemyDebuffs.delay=1;assert.equal(act(s,{type:'end'}).deck.length,s.deck.length);
 s.battle.enemyDebuffs.delay=2;s.battle.enemyStep=3;const twice=round(act(s,{type:'end'}));assert.equal(twice.deck.filter(c=>c.id==='junk').length,1);assert.equal(twice.battle.enemyStep,5);
});
test('unplayed junk recycles, paid junk exhausts; auto end and insufficient energy',()=>{
 let s=act(start(),{type:'end'}),uid=s.deck.find(c=>c.id==='junk').uid;hand(s,uid);s.battle.enemy='noise';s.battle.hp=s.battle.maxHp=32;s.battle.enemyStep=1;s.battle.energy=0;
 assert.equal(act(s,{type:'play',uid}),s);s.battle.energy=1;
 const n=round(resolveAction(s,{type:'play',uid}).state);assert.ok(n.battle.exhaust.includes(uid));assert.equal(n.battle.energy,3);assert.equal(n.battle.enemyStep,2);
 let redrawn=0;for(let i=0;i<4;i++){s.battle.playerBlock=100;s=round(act(s,{type:'end'}));if(s.battle.hand.includes(uid))redrawn++;assert.ok(!s.battle.exhaust.includes(uid));assert.ok([...s.battle.hand,...s.battle.draw,...s.battle.discard].includes(uid));}assert.ok(redrawn>=1,'unplayed junk must be drawn again');
});
test('junk clears on victory and death, cannot persist outside battle or enter rewards',()=>{
 let s=act(start(),{type:'end'});s.battle.hp=1;const strike=s.deck.find(c=>c.id==='strike');hand(s,strike.uid);s.battle.energy=3;const won=round(act(s,{type:'play',uid:strike.uid}));assert.equal(won.phase,'won');assert.ok(won.deck.every(c=>c.id!=='junk'));assert.ok(!won.reward.includes('junk'));
 s=act(start(),{type:'end'});s.hp=1;s.battle.playerDebuffs.burn=1;const lost=round(act(s,{type:'end'}));assert.equal(lost.phase,'lost');assert.ok(lost.deck.every(c=>c.id!=='junk'));
 s=act(start(),{type:'end'});s.deck.find(c=>c.id==='junk').plus=true;assert.throws(()=>parseRun(JSON.stringify(s)));
 for(let seed=0;seed<20;seed++){let r=act(fixedRun(seed),{type:'node',lane:0});r.battle.hp=1;const c=r.deck.find(c=>c.id==='strike');hand(r,c.uid);r=act(r,{type:'play',uid:c.uid});assert.ok(!r.reward.includes('junk'));}
});

test('every normal enemy generates two junk cards without attacking on its fourth action',()=>{
 for(const [id,e] of Object.entries(ENEMIES).filter(([,e])=>e.tier==='battle')){
  let s=act(fixedRun(1),{type:'node',lane:0});s.battle.enemy=id;s.battle.hp=s.battle.maxHp=e.hp;s.battle.enemyStep=3;s.battle.strength=5;
  assert.deepEqual(intent(s),{type:'junk',value:2});const n=round(act(s,{type:'end'}));assert.equal(n.hp,s.hp);assert.equal(n.deck.length,s.deck.length+2);assert.equal(n.deck.filter(c=>c.id==='junk').length,2);assert.equal(n.battle.enemyStep,4);assert.ok(!n.battle.events.some(e=>e.kind==='hit'));assert.deepEqual(intent(n).type,e.pattern[0][0]);
 }
});
