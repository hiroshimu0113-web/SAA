import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fixedRun} from '../scripts/fixed-run-fixture.mjs';
import {act,parseRun} from '../public/tower/engine.mjs';
import {resolveAction} from '../public/tower/turn-flow.mjs';
function fixture(id='guard'){
 const s=act(fixedRun(1),{type:'node',lane:0});
 s.battle.enemy='noise';s.battle.hp=s.battle.maxHp=32;s.battle.energy=1;
 s.deck.find(c=>c.uid===s.battle.hand[0]).id=id;
 return s;
}
const play=s=>({type:'play',uid:s.battle.hand[0]});
test('auto end commits one enemy turn, preserves source and survives reload without replay',()=>{
 const s=fixture(),original=structuredClone(s),r=resolveAction(s,play(s));
 assert.deepEqual(s,original);assert.equal(r.steps.length,2);
 assert.deepEqual(r.state,act(act(s,play(s)),{type:'end'}));
 assert.equal(r.state.battle.turn,s.battle.turn+1);assert.equal(r.state.battle.enemyStep,1);assert.equal(r.state.battle.energy,3);
 assert.deepEqual(parseRun(JSON.stringify(r.state)),r.state);
 assert.equal(resolveAction(s,{type:'play',uid:-1}).state,s);
});
test('remaining free cards do not block automatic end; refunds and combos use final energy',()=>{
 let s=fixture();s.deck.find(c=>c.uid===s.battle.hand[1]).id='cache';
 assert.equal(resolveAction(s,play(s)).steps.length,2);
 s=fixture('cache');s.battle.energy=0;let r=resolveAction(s,play(s));assert.equal(r.steps.length,1);assert.equal(r.state.battle.energy,2);
 s=fixture('optimize');s.battle.comboPlayed=['analysis','cache'];r=resolveAction(s,play(s));assert.equal(r.steps.length,1);assert.equal(r.state.battle.energy,1);
});
test('victory and self-damage defeat never trigger enemy action',()=>{
 let s=fixture('strike');s.battle.hp=1;let r=resolveAction(s,play(s));assert.equal(r.state.phase,'reward');assert.equal(r.steps.length,1);
 s=fixture('overload');s.hp=3;r=resolveAction(s,play(s));assert.equal(r.state.phase,'lost');assert.equal(r.steps.length,1);
});
test('delay double action advances first window without enemy, and auto-skips paused turns',()=>{
 let s=fixture();s.battle.playerDebuffs.delay=2;s.battle.playerActions=2;
 let r=resolveAction(s,play(s));assert.equal(r.state.battle.playerActions,1);assert.equal(r.state.battle.enemyStep,0);assert.equal(r.state.battle.energy,3);
 s=r.state;s.battle.energy=1;s.deck=s.deck.map(c=>({...c,id:'guard'}));r=resolveAction(s,play(s));assert.equal(r.state.battle.enemyStep,1);assert.equal(r.state.battle.playerDebuffs.delay,0);
 s=fixture();s.battle.enemy='boss';r=resolveAction(s,{type:'end'});assert.equal(r.steps.length,2);assert.equal(r.state.battle.enemyStep,2);assert.equal(r.state.battle.playerActions,2);assert.equal(r.state.battle.energy,3);
});
