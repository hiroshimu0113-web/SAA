import {icon} from './icons.mjs';
import {cardValues,playerBlockGain} from './engine.mjs';
import {attackAmount,DEBUFFS} from './debuffs.mjs';
export function cardEffectBadges(card,state=null){
 const d=cardValues(card),b=state?.phase==='battle'?state.battle:null,items=[];
 const add=(key,value,label)=>items.push('<span class="effect-badge" role="img" aria-label="'+label+'" title="'+label+'">'+icon(key)+'<span aria-hidden="true">'+value+'</span></span>');
 if(d.damage){const amount=b?attackAmount(d.damage+b.playerStrength+(d.strength||0)+(d.perBlock?b.playerBlock+playerBlockGain(state,d.block||0):0),b.playerDebuffs,{misconfig:0}):d.damage;
  add('battle',amount+(d.hits?'×'+d.hits:'')+(!b&&d.perBlock?'＋◇':''),'ダメージ '+amount+(d.hits?' を'+d.hits+'回':'')+(!b&&d.perBlock?'＋現在のブロック':'')+'（敵の防御・弱体補正前）');}
 if(d.block)add('shield',b?playerBlockGain(state,d.block):d.block,'ブロック '+(b?playerBlockGain(state,d.block):d.block));
 if(d.draw)add('cards',d.draw,'ドロー '+d.draw+'枚');
 if(d.heal)add('heal',d.heal,'HP回復 '+d.heal);
 if(d.debuff)add(d.debuff.id,d.debuff.amount,DEBUFFS[d.debuff.id].name+' '+d.debuff.amount+(d.debuff.id==='delay'?'ターン休止':''));
 if(d.energy)add('energy','+'+d.energy,'エナジー ＋'+d.energy);
 if(d.strength)add('upgrade','+'+d.strength,'戦闘中の攻撃力 ＋'+d.strength);
 if(d.armor)add('shield','↻'+d.armor,'毎ターン開始時のブロック '+d.armor);
 if(d.self)add('heart','−'+d.self,'自分のHPを'+d.self+'失う');
 if(d.exhaust)add('remove','', '使用後、この戦闘中は除外');
 return '<span class="card-effect-icons">'+items.join('')+'</span>';
}
