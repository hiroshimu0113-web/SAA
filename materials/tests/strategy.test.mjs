import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CARDS,newRun,act,cardValues} from '../public/tower/engine.mjs';
import {inspectPlay,playableCount,turnForecast,synergyHints,lifetime} from '../public/tower/strategy.mjs';
function start(){return act(newRun(1),{type:'node',lane:0});}
test('live card forecasts reuse combat resolution without changing saves or RNG',()=>{
 for(const id of Object.keys(CARDS))for(const plus of [false,true]){
  const s=start(),uid=s.battle.hand[0],c=s.deck.find(c=>c.uid===uid);c.id=id;c.plus=plus;s.hp=50;s.battle.block=5;s.battle.playerBlock=8;s.battle.playerStrength=2;
  const raw=JSON.stringify(s),p=inspectPlay(s,c),n=act(s,{type:'play',uid});assert.equal(JSON.stringify(s),raw);assert.equal(p.nextPhase,n.phase);
  if(cardValues(c).damage)assert.equal(p.brief,'敵HP −'+(s.battle.hp-n.battle.hp));
 }
 const s=start();s.battle.energy=0;assert.equal(playableCount(s),0);assert.equal(inspectPlay(s,s.deck.find(c=>c.uid===s.battle.hand[0])),null);
 s.deck.find(c=>c.uid===s.battle.hand[0]).id='retry';assert.equal(playableCount(s),1);
});
test('forecasts, synergy and three effect lifetimes match actual rules',()=>{
 const s=start();s.battle.enemy='noise';s.battle.playerBlock=3;assert.match(turnForecast(s),/HP −4/);
 s.battle.weak=1;assert.match(turnForecast(s),/HP −2/);
 s.deck[0].id='optimize';assert.ok(synergyHints(s,{id:'parallel',plus:false})[0].includes('各ヒット'));
 s.deck[1].id='reversal';assert.ok(synergyHints(s,{id:'guard',plus:false})[0].includes('逆転'));
 assert.match(lifetime({id:'redundant'}),/この戦闘中/);
 s.relics.push('ember');s.battle.armor=3;s.battle.playerStrength=5;s.battle.hp=1;const uid=s.battle.hand[0];s.deck.find(c=>c.uid===uid).id='strike';
 const won=act(s,{type:'play',uid}),map=act(won,{type:'reward',id:null}),next=act(map,{type:'node',lane:1});
 assert.equal(next.battle.playerStrength,1);assert.equal(next.battle.armor,0);assert.ok(next.relics.includes('ember'));assert.equal(next.battle.energy,3);
});
