import {DEBUFFS,delayPaused,attackAmount} from './debuffs.mjs';
import {COMBOS,triggeredCombos} from './combos.mjs';
import {cardValues,act,playerBlockGain,CARDS,RELICS} from './engine.mjs';
import {combatEffects} from './effects.mjs';
export function lifetime(c){const d=cardValues(c);return d.kind==='power'?'この戦闘中、効果が続く':d.block?'使用時に防御を得る。次の自分のターンにリセット':'使用時に効果を解決する';}
export function playableCount(s){return s?.phase==='battle'&&!delayPaused(s.battle.playerDebuffs.delay)?s.battle.hand.filter(uid=>{const c=s.deck.find(c=>c.uid===uid);return c&&cardValues(c).cost<=s.battle.energy;}).length:0;}
export function turnForecast(s){if(s?.phase!=='battle')return '';const next=act(s,{type:'end'});return '今ターンを終了すると：HP −'+(s.hp-next.hp)+(s.battle.playerDebuffs.delay===2&&s.battle.playerActions===2?' / 2回行動の後半へ':'');}

export function inspectPlay(s,c){
 if(s?.phase!=='battle'||delayPaused(s.battle.playerDebuffs.delay)||!s.battle.hand.includes(c.uid)||cardValues(c).cost>s.battle.energy)return null;
 const action={type:'play',uid:c.uid},next=act(s,action),effects=combatEffects(s,next,action),d=cardValues(c);
 const roles=triggeredCombos(s,next);
 const lines=effects.map(f=>(f.side==='enemy'?'敵：':'自分：')+f.label);
 for(const id of roles)lines.push('役「'+COMBOS[id].name+'」成立：'+COMBOS[id].label);
 if(d.draw&&next.phase==='battle')lines.push('手札に '+Math.max(0,next.battle.hand.length-s.battle.hand.length+1)+'枚補充');
 if(next.phase==='lost')lines.push('自分のHPが0になり、この冒険は終了');
 const brief=d.battleOnly?'1エナジーで除外':d.damage?'AT ＋'+attackAmount(d.damage+s.battle.playerStrength+(d.strength||0)+(d.perBlock?s.battle.playerBlock+playerBlockGain(s,d.block||0):0),s.battle.playerDebuffs,{misconfig:0})+(d.hits?' ×'+d.hits:''):d.block?'防御 ＋'+(next.battle.playerBlock-s.battle.playerBlock):d.heal?'回復 ＋'+(next.hp-s.hp):d.strength?'攻撃力 ＋'+d.strength:d.armor?'毎ターン防御':d.energy?'⚡ ＋'+d.energy:d.debuff?DEBUFFS[d.debuff.id].name+(d.debuff.id==='delay'?'': ' ＋'+d.debuff.amount):'手札を補充';
 return {lines,brief,nextPhase:next.phase};
}
export function synergyHints(s,c){
 const d=cardValues(c),deck=s.deck.map(cardValues),tips=[];
 const has=(key)=>deck.some(x=>x[key]);
 if(d.damage&&(has('strength')||s.relics.includes('ember')))tips.push(d.hits?'攻撃力の強化が各ヒットに加算される':CARDS.optimize.name+'や'+RELICS.ember.name+'の強化が攻撃に加算される');
 if(d.perBlock&&(has('block')||has('armor')||s.relics.includes('shell')))tips.push(CARDS.guard.name+'・持続防御でブロックを積んでから使うと威力が上がる');
 if((d.block||d.armor)&&has('perBlock'))tips.push(CARDS.reversal.name+'の威力にもブロックを使える');
 if(d.strength&&has('damage'))tips.push(deck.some(x=>x.hits)?CARDS.parallel.name+'なら強化が1枚で2回分効く':'攻撃カードを使う前に強化を置くと、その戦闘中ずっと有効');
 if(d.draw&&deck.some(x=>x.cost===0))tips.push('0コストのカードを手札に探しにいける');
 if(d.energy&&deck.some(x=>x.cost>=2))tips.push('2コストのカードと他の手札を同じターンに使いやすい');
 return tips.slice(0,2);
}
