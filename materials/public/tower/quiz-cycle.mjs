// A cycle records displayed questions, independently of answers and rewards.
export function validQuizCycle(c){return !!c&&typeof c==='object'&&Number.isSafeInteger(c.round)&&c.round>=1&&Array.isArray(c.seen)&&c.seen.length<=10000&&new Set(c.seen).size===c.seen.length&&c.seen.every(id=>typeof id==='string'&&/^[a-zA-Z0-9_.:-]{1,160}$/.test(id));}
export function normalizeCycle(c,ids){
 if(c!==undefined&&!validQuizCycle(c))throw Error('クイズ出題履歴が不正です。');
 const allowed=new Set(ids);return {round:c?.round||1,seen:(c?.seen||[]).filter(id=>allowed.has(id))};
}
export function markQuestion(c,id,ids){
 const next=normalizeCycle(c,ids);
 if(next.seen.length===ids.length){next.seen=[];next.round++;}
 if(ids.includes(id)&&!next.seen.includes(id))next.seen.push(id);
 return next;
}
export function pickQuestion(c,ids,rng,exclude=[]){
 const seen=normalizeCycle(c,ids).seen;
 const remaining=ids.filter(id=>!seen.includes(id));
 const pool=(remaining.length?remaining:ids).filter(id=>!exclude.includes(id));
 if(!pool.length)throw Error('出題できる問題がありません。');
 return pool[Math.floor(rng()*pool.length)];
}
export function cycleForRun(s,ids){
 let c=normalizeCycle(s?.quizCycle,ids);
 // Older saves have no full history. Only the visible/saved room can be recovered.
 if(s?.quizCycle===undefined&&s?.quiz){
  const q=s.quiz,count=q.result?.interrupted?q.answers.length:Math.min(2,q.step+1);
  for(const id of q.ids.slice(0,count))c=markQuestion(c,id,ids);
 }
 return c;
}
