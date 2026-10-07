import {fixedRun as newRun} from '../scripts/fixed-run-fixture.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {act,parseRun,ENEMIES,ENEMY_POOLS,ROUTES,enemyDebuffTypes} from '../public/tower/engine.mjs';
function enter(seed,tier){const s=newRun(seed);s.floor=tier==='elite'?2:7;s.history=ROUTES.slice(0,s.floor).map((r,floor)=>({floor,lane:0,type:r[0]}));return act(s,{type:'node',lane:0});}
test('roster: three distinct fixed profiles per tier, deterministic selection and saved identity',()=>{
 for(const tier of ['elite','boss']){
  assert.equal(ENEMY_POOLS[tier].length,3);
  const profiles=ENEMY_POOLS[tier].map(id=>enemyDebuffTypes(id).sort().join(','));assert.equal(new Set(profiles).size,3);
  const seen=new Set();
  for(let seed=1;seed<=100;seed++){
   // Spread the seeds across the 32-bit PRNG input range.
   const s=enter(Math.imul(seed,2654435761)>>>0,tier);seen.add(s.battle.enemy);
   assert.equal(ENEMIES[s.battle.enemy].tier,tier);assert.deepEqual(s,enter(Math.imul(seed,2654435761)>>>0,tier));
   assert.deepEqual(parseRun(JSON.stringify(s)),s);
  }
  assert.deepEqual(seen,new Set(ENEMY_POOLS[tier]));
 }
});
test('roster: every elite grants relics and every boss wins; full action cycle uses only its own statuses',()=>{
 for(const tier of ['elite','boss'])for(const id of ENEMY_POOLS[tier]){
  let s=enter(1,tier);s.battle.enemy=id;s.battle.hp=s.battle.maxHp=ENEMIES[id].hp;
  const observed=new Set();
  for(let turn=0;turn<ENEMIES[id].pattern.length;turn++){
   s.hp=72;s=act(s,{type:'end'});assert.equal(s.phase,'battle');
   for(const [key,n] of Object.entries(s.battle.playerDebuffs))if(n)observed.add(key);
   // Finish both action windows without adding another enemy turn.
   if(s.battle.playerActions===2)s=act(s,{type:'end'});
   assert.deepEqual(parseRun(JSON.stringify(s)),s);
  }
  assert.deepEqual(observed,new Set(enemyDebuffTypes(id)));
  s=enter(2,tier);s.battle.enemy=id;s.battle.hp=1;s.battle.maxHp=ENEMIES[id].hp;
  const uid=s.battle.hand[0];s.deck.find(c=>c.uid===uid).id='strike';const gold=s.gold;
  s=act(s,{type:'play',uid});assert.equal(s.phase,tier==='elite'?'reward':'won');assert.equal(s.gold,gold+(tier==='elite'?40:22));
  if(tier==='elite')assert.equal(s.relics.length,2);assert.deepEqual(parseRun(JSON.stringify(s)),s);
 }
});
