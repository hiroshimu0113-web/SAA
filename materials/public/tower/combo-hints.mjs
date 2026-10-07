import {act,cardValues} from './engine.mjs';
import {COMBOS} from './combos.mjs';
import {delayPaused} from './debuffs.mjs';
// Only cards visible now may participate. Drawn cards become candidates on the next render.
export function comboHints(state){
 const result=new Map(),b=state?.battle;
 if(state?.phase!=='battle'||b.energy<=0||delayPaused(b.playerDebuffs.delay))return result;
 const visible=new Set(b.hand);
 for(const [role,r] of Object.entries(COMBOS)){
  const used=r.cards.filter(id=>b.comboPlayed?.includes(id)).length;
  if(!used||b.comboDone?.includes(role))continue;
  const missing=r.cards.filter(id=>!b.comboPlayed?.includes(id));
  if(!missing.every(id=>state.deck.some(c=>c.id===id&&visible.has(c.uid))))continue;
  for(const candidate of state.deck.filter(c=>visible.has(c.uid)&&missing.includes(c.id))){
   let budget=512;
   function search(s,available){
    if(s.hp>0&&s.battle?.comboDone?.includes(role))return true;
    if(s.phase!=='battle'||s.battle.energy<=0||--budget<0)return false;
    const seen=new Set();
    for(const c of s.deck){
     if(!available.has(c.uid)||!s.battle.hand.includes(c.uid))continue;
     const d=cardValues(c),signature=c.id+':'+Boolean(c.plus);
     if(seen.has(signature)||d.cost>s.battle.energy)continue;
     seen.add(signature);
     // Irrelevant attacks/block/draw cannot improve a known-hand completion path.
     if(!missing.includes(c.id)&&!d.energy&&!d.heal&&!Object.values(COMBOS).some(x=>x.energy&&x.cards.includes(c.id)))continue;
     const rest=new Set(available);rest.delete(c.uid);
     if(search(act(s,{type:'play',uid:c.uid}),rest))return true;
    }
    return false;
   }
   if(cardValues(candidate).cost>b.energy)continue;
   const rest=new Set(visible);rest.delete(candidate.uid);
   if(search(act(state,{type:'play',uid:candidate.uid}),rest)){
    const old=result.get(candidate.uid);
    result.set(candidate.uid,{level:Math.max(used,old?.level||0),roles:[...(old?.roles||[]),role]});
   }
  }
 }
 return result;
}
