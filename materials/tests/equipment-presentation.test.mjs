import test from 'node:test';
import assert from 'node:assert/strict';
import {newJourney,transition} from '../public/tower/build-adventure-engine.mjs';
const battle=()=>transition(newJourney('guardian',1),{kind:'enter',scenario:'attack'});
test('設備結果は敵の行動前の状態を通知し、通知なしと戦闘結果が一致する',()=>{
 const s=battle(),events=[];const next=transition(s,{kind:'end'},{},e=>events.push(e));
 assert.deepEqual(next,transition(s,{kind:'end'}));assert.equal(events.length,1);
 const e=events[0];assert.equal(e.actions[0].damage,3);assert.equal(e.combat.enemy.hp,s.combat.enemy.hp-3);assert.equal(e.combat.hp,s.combat.hp);assert.ok(next.combat.hp<e.combat.hp);assert.equal(e.defeated,false);
});
test('設備での撃破・停止・データ破損を実際の結果で通知する',()=>{
 for(const mode of ['kill','stopped','corrupt']){const s=battle(),events=[];
 if(mode==='kill')s.combat.enemy.hp=2;
 if(mode==='stopped')s.combat.equipment[0].state='stopped';
 if(mode==='corrupt')s.combat.data.healthy=false;
 const next=transition(s,{kind:'end'},{},e=>events.push(e));const e=events[0];
 assert.equal(e.actions[0].damage,mode==='kill'?2:0);assert.equal(Boolean(e.actions[0].reason),mode!=='kill');assert.equal(e.defeated,mode==='kill');
 if(mode==='kill'){assert.equal(next.screen,'reward');assert.equal(next.combat.hp,s.combat.hp);}
 }
});
test('カード後の自動終了でも設備通知は1回、保存読み込みで再実行しない',()=>{
 const s=battle();s.combat.hand=[{...s.combat.hand[0],id:'ec2-burst'}];s.combat.energy=1;const events=[];
 const next=transition(s,{kind:'play',uid:s.combat.hand[0].uid},{},e=>events.push(e));assert.equal(events.length,1);assert.equal(next.combat.turn,2);assert.equal(Object.hasOwn(next.combat,'turnPresentation'),false);
});
