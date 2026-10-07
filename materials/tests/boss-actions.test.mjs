import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fixedRun} from '../scripts/fixed-run-fixture.mjs';
import {act,intentActions,ENEMIES,parseRun} from '../public/tower/engine.mjs';
function battle(id,step=0){const s=act(fixedRun(1),{type:'node',lane:0});s.battle.enemy=id;s.battle.hp=s.battle.maxHp=ENEMIES[id].hp;s.battle.enemyStep=step;return s;}
test('every boss debuff hits with a matching forecast; elites remain debuff-only',()=>{
 for(const [id,e] of Object.entries(ENEMIES))for(const [step,[type,amount,status,damage]] of e.pattern.entries()){
  if(type!=='debuff')continue;
  const s=battle(id,step);s.battle.strength=2;s.battle.enemyDebuffs.overload=2;s.battle.playerDebuffs.misconfig=2;s.battle.playerBlock=3;
  const [forecast]=intentActions(s),next=act(s,{type:'end'});
  if(e.tier==='boss'){
   assert.equal(damage,10);assert.equal(forecast.damage,11);assert.equal(s.hp-next.hp,8);assert.ok(next.battle.events.some(x=>x.kind==='hit'&&x.value===8));
  }else{assert.equal(damage,undefined);assert.equal(forecast.damage,undefined);assert.equal(next.hp,s.hp);}
  assert.equal(next.battle.playerDebuffs[status],(status==='misconfig'?2:0)+amount);assert.equal(next.battle.enemyStep,step+1);
  assert.deepEqual(parseRun(JSON.stringify(next)),next);
 }
});
test('boss attack-only actions gain three damage and combined hits respect guard and death',()=>{
 const expected={boss:[16,27],boss_resource:[19,21,25],boss_stagnation:[19,25,17]};
 for(const [id,values] of Object.entries(expected))assert.deepEqual(ENEMIES[id].pattern.filter(a=>a[0]==='attack').map(a=>a[1]),values);
 let s=battle('boss_resource',2);s.battle.playerBlock=10;let n=act(s,{type:'end'});assert.equal(n.hp,s.hp);assert.equal(n.battle.playerDebuffs.misconfig,2);
 s=battle('boss_resource',2);s.hp=1;s.battle.enemyDebuffs.delay=2;n=act(s,{type:'end'});assert.equal(n.phase,'lost');assert.equal(n.battle.enemyStep,3);assert.equal(n.battle.playerDebuffs.misconfig,0);assert.deepEqual(parseRun(JSON.stringify(n)),n);
});
test('combined boss actions count once during delayed double action and preview subsequent debuffs',()=>{
 const s=battle('boss_resource',2);s.battle.enemyDebuffs.delay=2;
 assert.deepEqual(intentActions(s),[{type:'debuff',value:2,status:'misconfig',damage:10},{type:'attack',value:26}]);
 const n=act(s,{type:'end'});assert.equal(n.hp,s.hp-36);assert.equal(n.battle.enemyStep,4);assert.equal(n.battle.enemyDebuffs.delay,0);
});
