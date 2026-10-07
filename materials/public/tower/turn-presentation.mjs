// Presentation only. Combat has already been resolved and saved atomically.
export const TURN_BANNER_MS=500,TURN_RESULT_MS=1000;
export function turnFrames(steps){
 const frames=[];
 for(const step of steps){
  const {before,after,action}=step;
  if(action.type!=='end'){frames.push({kind:'card',step,state:after,ms:TURN_RESULT_MS});continue;}
  const enemyActed=after.battle.enemyStep!==before.battle.enemyStep||after.battle.events.some(e=>e.side==='enemy'&&e.label.startsWith('遅延：'));
  if(enemyActed)frames.push({kind:'banner',text:'Enemy Turn',state:before,ms:TURN_BANNER_MS});
  if(enemyActed||after.battle.events.length)frames.push({kind:'result',step,state:after,ms:TURN_RESULT_MS});
  if(after.phase==='battle'&&after.battle.energy>0)frames.push({kind:'banner',text:'Your Turn',state:after,ms:TURN_BANNER_MS});
 }
 return frames;
}
export async function presentTurns(steps,{draw,effects,banner,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms))}){
 for(const frame of turnFrames(steps)){
  draw(frame.state);
  if(frame.kind==='banner'){
   const remove=banner(frame.text);
   try{await wait(frame.ms);}finally{remove();}
  }else{effects(frame.step);await wait(frame.ms);}
 }
}
