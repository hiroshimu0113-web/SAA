import {fixedRun as newRun} from '../scripts/fixed-run-fixture.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {newRun as createRun,act,parseRun,HEROES,REWARD_RELICS,CARDS} from '../public/tower/engine.mjs';
const battle=seed=>act(newRun(seed),{type:'node',lane:0});
const round=s=>parseRun(JSON.stringify(s));
function win(s){s.battle.hp=1;const c=s.deck.find(c=>s.battle.hand.includes(c.uid)&&CARDS[c.id].damage);assert.ok(c);return act(s,{type:'play',uid:c.uid});}
test('heroes: all three assigned by seed, persist through saves; three attacks, three guards and one probe in new runs',()=>{
 const seen=new Set();for(let seed=0;seed<90;seed++){const s=createRun(seed);seen.add(s.hero);assert.deepEqual(round(s),s);assert.deepEqual(s,createRun(seed));assert.deepEqual(s.relics,[HEROES[s.hero].relic]);assert.equal(s.deck.length,7);assert.equal(s.deck.filter(c=>c.id==='strike').length,3);assert.equal(s.deck.filter(c=>c.id==='guard').length,3);assert.equal(s.deck.filter(c=>c.id==='probe').length,1);}
 assert.equal(seen.size,3);
 for(const mutate of [s=>s.hero='constructor',s=>s.hero=null,s=>s.relics=[],s=>s.relics.push('runbook')]){const s=newRun(0);mutate(s);assert.throws(()=>round(s));}
});
test('heroes: SE draws seven and architect starts with four energy, only on first turn of each battle',()=>{
 for(const [seed,hand,energy] of [[0,7,3],[1,5,3],[2,5,4]]){let s=battle(seed);assert.equal(s.battle.hand.length,hand);assert.equal(s.battle.energy,energy);s=act(round(s),{type:'end'});assert.equal(s.battle.hand.length,5);assert.equal(s.battle.energy,3);}
 let s=win(battle(0));s=act(s,{type:'reward',id:null});s=act(s,{type:'node',lane:1});assert.equal(s.battle.hand.length,7);
});
test('heroes: SRE heals six once per victory, caps HP, stacks spring; defeat cannot revive',()=>{
 for(const [hp,spring,expected] of [[50,false,56],[70,false,72],[50,true,60]]){let s=battle(1);s.hp=hp;if(spring)s.relics.push('spring');s=win(s);assert.equal(s.hp,expected);assert.equal(round(s).hp,expected);assert.equal(act(s,{type:'end'}).hp,expected);}
 let s=battle(1);s.hp=1;s.battle.playerBlock=0;s.battle.enemyStep=0;s.battle.enemy='noise';s=act(s,{type:'end'});assert.equal(s.phase,'lost');assert.equal(s.hp,0);
 for(let seed=0;seed<30;seed++){let s=newRun(seed);s.floor=2;s.history=[{floor:0,lane:0,type:'battle'},{floor:1,lane:0,type:'event'}];s=win(act(s,{type:'node',lane:0}));assert.ok(REWARD_RELICS.includes(s.relics[1]));round(s);}
});
test('heroes: legacy lantern run keeps original hand and has no assigned new hero',()=>{
 const old=newRun(2);delete old.hero;old.relics=['lantern'];let s=round(old);assert.equal(s.hero,undefined);s=act(s,{type:'node',lane:0});assert.equal(s.battle.hand.length,6);assert.equal(s.battle.energy,3);assert.deepEqual(round(s),s);
});
