import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fixedRun} from '../scripts/fixed-run-fixture.mjs';
import {act} from '../public/tower/engine.mjs';
import {comboHints} from '../public/tower/combo-hints.mjs';
function setup(ids,energy=3,played=['probe']){
 const s=act(fixedRun(1),{type:'node',lane:0});
 s.deck=ids.map((id,uid)=>({id,uid,plus:false}));s.nextId=ids.length;
 Object.assign(s.battle,{hand:s.deck.map(c=>c.uid),draw:[],discard:[],exhaust:[],energy,hp:200,maxHp:200,comboPlayed:played,comboDone:[]});return s;
}
test('hints: staged, complete visible hand required, pure and unique card types',()=>{
 const s=setup(['strike','guard']);const raw=JSON.stringify(s);
 assert.deepEqual([...comboHints(s).values()].map(x=>x.level),[1,1]);assert.equal(JSON.stringify(s),raw);
 const next=act(s,{type:'play',uid:0});assert.equal(comboHints(next).get(1).level,2);
 assert.equal(comboHints(act(next,{type:'play',uid:1})).size,0);
 assert.equal(comboHints(setup(['strike','strike'])).size,0);
 assert.equal(comboHints(setup(['strike','guard'],3,[])).size,0);
});
test('hints: zero energy auto-end, energy recovery ordering, final zero is valid',()=>{
 assert.equal(comboHints(setup(['strike','guard'],1)).size,0);
 const s=setup(['strike','guard','cache'],1);assert.equal(comboHints(s).size,0);
 const recovered=act(s,{type:'play',uid:2});assert.equal(comboHints(recovered).size,2);
 assert.equal(comboHints(setup(['guard'],1,['probe','strike'])).get(0).level,2);
 assert.equal(comboHints(setup(['guard'],0,['probe','strike'])).size,0);
});
test('hints: hidden draws are not promised, actual draws recalculate',()=>{
 const s=setup(['analysis','strike','guard']);s.battle.hand=[0,1];s.battle.draw=[2];
 assert.equal(comboHints(s).size,0);
 const drawn=act(s,{type:'play',uid:0});assert.equal(comboHints(drawn).size,2);
});
test('hints: upgraded costs, recovery combo, paused action and early victory',()=>{
 const s=setup(['optimize','cache'],1,['analysis']);s.deck[0].plus=true;
 assert.equal(comboHints(s).size,2);
 s.battle.playerDebuffs.delay=3;assert.equal(comboHints(s).size,0);
 const lethal=setup(['strike','guard']);lethal.battle.hp=1;
 assert.equal(comboHints(lethal).has(0),false);assert.equal(comboHints(lethal).has(1),true);
});
