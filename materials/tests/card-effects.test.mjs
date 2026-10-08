import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cardEffectBadges} from '../public/tower/card-effects.mjs';
import {newRun,act} from '../public/tower/engine.mjs';
test('compact effect icons retain upgraded damage, debuff, costs of self damage and exhaust',()=>{
 const burst=cardEffectBadges({id:'burst',plus:true});assert.match(burst,/ダメージ 27/);assert.match(burst,/炎上 4/);
 const overload=cardEffectBadges({id:'overload'});assert.match(overload,/自分のHPを3失う/);assert.match(overload,/枯渇 2/);
 assert.match(cardEffectBadges({id:'junk'}),/使用後、この戦闘中は除外/);
 assert.match(cardEffectBadges({id:'redundant',plus:true}),/毎ターン開始時のブロック 3/);
});
test('hand icon damage matches engine strength and current-block scaling without changing state',()=>{
 for(const id of ['parallel','reversal']){
  const s=act(newRun(2),{type:'node',lane:0});s.deck[0].id=id;s.battle.hand=[s.deck[0].uid];s.battle.draw=s.deck.slice(1).map(c=>c.uid);s.battle.energy=3;s.battle.playerStrength=2;s.battle.playerBlock=4;s.battle.block=0;
  const before=JSON.stringify(s),badges=cardEffectBadges(s.deck[0],s);assert.equal(JSON.stringify(s),before);
  const result=act(s,{type:'play',uid:s.deck[0].uid});const damage=Number(badges.match(/ダメージ (\d+)/)[1])*(id==='parallel'?2:1);assert.equal(s.battle.hp-result.battle.hp,damage);
 }
});
