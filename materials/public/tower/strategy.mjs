import {cardValues,act,intent} from './engine.mjs';
import {combatEffects} from './effects.mjs';
export function lifetime(c){const d=cardValues(c);return d.kind==='power'?'この戦闘中、効果が続く':d.block?'使用時に防御を得る。次の自分のターンにリセット':'使用時に効果を解決する';}
export function playableCount(s){return s?.phase==='battle'?s.battle.hand.filter(uid=>{const c=s.deck.find(c=>c.uid===uid);return c&&cardValues(c).cost<=s.battle.energy;}).length:0;}
export function turnForecast(s){if(s?.phase!=='battle')return '';const i=intent(s);if(i.type==='attack'){const loss=Math.max(0,i.value-s.battle.playerBlock);return '今ターンを終了すると：攻撃 '+i.value+' − 防御 '+s.battle.playerBlock+' → HP −'+Math.min(s.hp,loss);}return i.type==='guard'?'次の敵行動：防御 '+i.value:'次の敵行動：攻撃力 ＋'+i.value;}
export function inspectPlay(s,c){
 if(s?.phase!=='battle'||!s.battle.hand.includes(c.uid)||cardValues(c).cost>s.battle.energy)return null;
 const action={type:'play',uid:c.uid},next=act(s,action),effects=combatEffects(s,next,action),d=cardValues(c);
 const lines=effects.map(f=>(f.side==='enemy'?'敵：':'自分：')+f.label);
 if(d.draw&&next.phase==='battle')lines.push('手札に '+Math.max(0,next.battle.hand.length-s.battle.hand.length+1)+'枚補充');
 if(next.phase==='lost')lines.push('自分のHPが0になり、この冒険は終了');
 const hit=effects.find(f=>f.side==='enemy'&&f.kind==='hit');
 const brief=d.damage?'敵HP −'+(hit?.value||0):d.block?'防御 ＋'+d.block:d.heal?'回復 ＋'+(next.hp-s.hp):d.strength?'攻撃力 ＋'+d.strength:d.armor?'毎ターン防御':d.energy?'⚡ ＋'+d.energy:'手札を補充';
 return {lines,brief,nextPhase:next.phase};
}
export function synergyHints(s,c){
 const d=cardValues(c),deck=s.deck.map(cardValues),tips=[];
 const has=(key)=>deck.some(x=>x[key]);
 if(d.damage&&(has('strength')||s.relics.includes('ember')))tips.push(d.hits?'攻撃力の強化が各ヒットに加算される':'最適化や演算の火種の強化が攻撃に加算される');
 if(d.perBlock&&(has('block')||has('armor')||s.relics.includes('shell')))tips.push('防壁・持続防御でブロックを積んでから使うと威力が上がる');
 if((d.block||d.armor)&&has('perBlock'))tips.push('逆転の一手の威力にもブロックを使える');
 if(d.strength&&has('damage'))tips.push(deck.some(x=>x.hits)?'並列処理なら強化が1枚で2回分効く':'攻撃カードを使う前に強化を置くと、その戦闘中ずっと有効');
 if(d.draw&&deck.some(x=>x.cost===0))tips.push('0コストのカードを手札に探しにいける');
 if(d.energy&&deck.some(x=>x.cost>=2))tips.push('2コストのカードと他の手札を同じターンに使いやすい');
 return tips.slice(0,2);
}
