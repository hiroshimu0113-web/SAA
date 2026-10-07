import {fixedRun as newRun} from '../scripts/fixed-run-fixture.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {act} from '../public/tower/engine.mjs';
import {combatEffects} from '../public/tower/effects.mjs';
function start(id='strike'){const s=act(newRun(1),{type:'node',lane:0});s.battle.enemy='noise';s.battle.hp=s.battle.maxHp=32;s.deck.find(c=>c.uid===s.battle.hand[0]).id=id;return s;}
function play(s){const a={type:'play',uid:s.battle.hand[0]},n=act(s,a);return combatEffects(s,n,a);}
test('effects reflect actual damage, absorbed hits, upgrades and lethal transitions',()=>{
 let s=start();s.battle.block=4;assert.deepEqual(play(s).map(f=>[f.kind,f.value]),[['hit',2],['guard',4]]);
 s=start('parallel');s.battle.block=5;assert.deepEqual(play(s).map(f=>[f.kind,f.value]),[['hit',3],['guard',5]]);
 s=start();s.battle.hp=1;assert.deepEqual(play(s).map(f=>[f.kind,f.value]),[['hit',1],['finish',0]]);
 s=start('guard');s.deck.find(c=>c.uid===s.battle.hand[0]).plus=true;assert.equal(play(s)[0].value,8);
});
test('full and partial guard use pre-turn block, healing is capped and invalid actions are silent',()=>{
 let s=start();s.battle.playerBlock=20;const a={type:'end'};assert.deepEqual(combatEffects(s,act(s,a),a).map(f=>[f.kind,f.value]),[['guard',7]]);
 s.battle.playerBlock=3;assert.deepEqual(combatEffects(s,act(s,a),a).map(f=>[f.kind,f.value]),[['guard',3],['hit',4]]);
 s=start('restore');s.hp=70;assert.equal(play(s)[0].value,2);
 s=start();s.battle.energy=0;assert.deepEqual(play(s),[]);assert.deepEqual(combatEffects(s,s,a),[]);
});
