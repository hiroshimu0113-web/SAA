import {fixedRun as newRun} from '../scripts/fixed-run-fixture.mjs';
import {test} from 'node:test';import assert from 'node:assert/strict';
import {act,parseRun} from '../public/tower/engine.mjs';
import {COMBOS,comboReady,triggeredCombos} from '../public/tower/combos.mjs';
import {inspectPlay} from '../public/tower/strategy.mjs';
function setup(ids){const s=act(newRun(1),{type:'node',lane:0});s.battle.enemy='noise';s.battle.hp=s.battle.maxHp=32;s.battle.energy=20;s.deck=s.deck.map((c,i)=>({...c,id:ids[i]||'guard'}));s.battle.hand=s.deck.slice(0,6).map(c=>c.uid);s.battle.draw=s.deck.slice(6).map(c=>c.uid);s.battle.discard=[];s.battle.exhaust=[];return s;}
function play(s,id){return act(s,{type:'play',uid:s.battle.hand.find(uid=>s.deck.find(c=>c.uid===uid).id===id)});}
function round(s){assert.deepEqual(parseRun(JSON.stringify(s)),s);return s;}
function permutations(a){return a.length?a.flatMap((x,i)=>permutations(a.filter((_,j)=>j!==i)).map(rest=>[x,...rest])):[[]];}
test('roles: all orders, exact three kinds, upgraded cards, saved once-only payout',()=>{
 for(const [id,r] of Object.entries(COMBOS))for(const order of permutations(r.cards)){
  let s=setup([...r.cards,...r.cards]);s.deck[0].plus=true;
  for(let i=0;i<3;i++){const before=s;s=round(play(s,order[i]));assert.equal(s.battle.comboDone.includes(id),i===2);assert.deepEqual(triggeredCombos(before,s),i===2?[id]:[]);}
  const saved=round(s);for(const card of r.cards){const before=s;s=play(s,card);assert.deepEqual(triggeredCombos(before,s),[]);}assert.ok(saved.battle.comboDone.includes(id));
 }
 let s=setup(['guard','guard','guard']);s=play(play(play(s,'guard'),'guard'),'guard');assert.deepEqual(s.battle.comboDone,[]);assert.deepEqual(s.battle.comboPlayed,['guard']);
});
test('roles: effects, attack block absorption, lethal win, simultaneous roles and turn reset',()=>{
 let s=setup(COMBOS.incident.cards);for(const id of COMBOS.incident.cards)s=play(s,id);assert.equal(s.battle.playerBlock,10);const next=round(act(s,{type:'end'}));assert.deepEqual(next.battle.comboPlayed,[]);assert.deepEqual(next.battle.comboDone,[]);
 s=setup(COMBOS.balancing.cards);s.battle.comboPlayed=['parallel','probe'];s.battle.block=9;s=round(play(s,'balance'));assert.equal(s.battle.hp,31);assert.equal(s.battle.block,0);
 s=setup(COMBOS.balancing.cards);s.battle.comboPlayed=['parallel','probe'];s.battle.hp=9;s=round(play(s,'balance'));assert.equal(s.phase,'reward');assert.equal(s.battle.hp,0);assert.equal(s.gold,82);
 s=setup(COMBOS.caching.cards);s.battle.energy=1;for(const id of ['optimize','analysis','cache'])s=play(s,id);assert.equal(s.battle.energy,3);assert.deepEqual(s.battle.comboDone,['caching']);
 s=setup(['probe','strike','guard','balance','parallel']);s.battle.comboPlayed=['strike','guard','balance','parallel'];const before=s;s=round(play(s,'probe'));assert.deepEqual(triggeredCombos(before,s),['incident','balancing']);assert.equal(s.battle.playerBlock,5);assert.equal(s.battle.hp,25);
});
test('roles: invalid plays do not count, preview is pure, legacy migration and corrupt saves',()=>{
 let s=setup(COMBOS.incident.cards);s.battle.comboPlayed=['probe','strike'];s.battle.energy=0;assert.equal(play(s,'guard'),s);s.battle.energy=1;assert.deepEqual(comboReady(s.battle,'guard'),['incident']);const raw=JSON.stringify(s),card=s.deck.find(c=>c.id==='guard');assert.match(inspectPlay(s,card).lines.join(' '),/インシデント対応/);assert.equal(JSON.stringify(s),raw);
 const old=setup(COMBOS.incident.cards);old.version=2;delete old.battle.comboPlayed;delete old.battle.comboDone;const migrated=parseRun(JSON.stringify(old));assert.equal(migrated.version,4);assert.deepEqual(migrated.battle.comboPlayed,[]);
 for(const mutate of [b=>delete b.comboPlayed,b=>b.comboPlayed=['bad'],b=>b.comboPlayed=['probe','probe'],b=>b.comboDone=['incident'],b=>b.comboDone=['bad']]){const x=setup(COMBOS.incident.cards);mutate(x.battle);assert.throws(()=>parseRun(JSON.stringify(x)));}
});
