import {act} from './engine.mjs';

// Commit a card and its automatic turn transitions together: no pending timer
// can replay an enemy action after reload or a manual End click. Previews use act.
export function resolveAction(state,action){
 const steps=[];
 const advance=a=>{const next=act(state,a);if(next===state)return false;steps.push({before:state,after:next,action:a});state=next;return true;};
 if(!advance(action))return {state,steps};
 if(action.type==='play'||action.type==='end'){
  // A delay can skip several turns. Bound malformed input; the manual End
  // button remains available as a fallback. Valid delays are at most 999.
  for(let i=0;i<1000&&state.phase==='battle'&&state.battle.energy===0;i++){
   if(!advance({type:'end'}))break;
  }
 }
 return {state,steps};
}
