import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fixedRun} from '../scripts/fixed-run-fixture.mjs';
import {act} from '../public/tower/engine.mjs';
import {resolveAction} from '../public/tower/turn-flow.mjs';
import {turnFrames,presentTurns} from '../public/tower/turn-presentation.mjs';
function battle(){const s=act(fixedRun(1),{type:'node',lane:0});s.battle.enemy='noise';s.battle.hp=s.battle.maxHp=32;return s;}
test('turn banners surround enemy results with exact durations, without changing committed state',async()=>{
 const flow=resolveAction(battle(),{type:'end'}),saved=JSON.stringify(flow.state),events=[];
 await presentTurns(flow.steps,{draw:s=>events.push(['draw',s.battle.turn]),effects:()=>events.push(['result']),banner:t=>{events.push([t]);return ()=>events.push(['remove']);},wait:async ms=>events.push(['wait',ms])});
 assert.deepEqual(events,[['draw',1],['Enemy Turn'],['wait',500],['remove'],['draw',2],['result'],['wait',1000],['draw',2],['Your Turn'],['wait',500],['remove']]);assert.equal(JSON.stringify(flow.state),saved);
});
test('automatic end preserves card result, while double windows and battle endings have correct banners',()=>{
 let s=battle();s.deck=s.deck.map(c=>({...c,id:'guard'}));s.battle.energy=1;
 let frames=turnFrames(resolveAction(s,{type:'play',uid:s.battle.hand[0]}).steps);assert.deepEqual(frames.map(f=>f.text||f.kind),['card','Enemy Turn','result','Your Turn']);
 s.battle.playerDebuffs.delay=2;s.battle.playerActions=2;frames=turnFrames(resolveAction(s,{type:'end'}).steps);assert.deepEqual(frames.map(f=>f.text||f.kind),['Your Turn']);
 s=battle();s.hp=1;frames=turnFrames(resolveAction(s,{type:'end'}).steps);assert.deepEqual(frames.map(f=>f.text||f.kind),['Enemy Turn','result']);
 s.battle.playerDebuffs.burn=1;frames=turnFrames(resolveAction(s,{type:'end'}).steps);assert.deepEqual(frames.map(f=>f.text||f.kind),['result']);
 s=battle();s.battle.enemy='boss';s.battle.hp=s.battle.maxHp=125;frames=turnFrames(resolveAction(s,{type:'end'}).steps);assert.deepEqual(frames.map(f=>f.text||f.kind),['Enemy Turn','result','Enemy Turn','result','Your Turn']);
 s=battle();s.battle.enemyDebuffs.delay=1;frames=turnFrames(resolveAction(s,{type:'end'}).steps);assert.deepEqual(frames.map(f=>f.text||f.kind),['Enemy Turn','result','Your Turn']);
});
test('banner cleanup also runs if presentation is interrupted',async()=>{
 let removed=false;await assert.rejects(presentTurns(resolveAction(battle(),{type:'end'}).steps,{draw(){},effects(){},banner:()=>()=>{removed=true;},wait:async()=>{throw Error('interrupted');}}));assert.equal(removed,true);
});
