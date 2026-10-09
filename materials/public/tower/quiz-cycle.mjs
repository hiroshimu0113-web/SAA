// Only correct answers complete a question in the current cycle.
export function validQuizCycle(c){return !!c&&typeof c==='object'&&(c.mode===undefined||c.mode==='correct')&&Number.isSafeInteger(c.round)&&c.round>=1&&Array.isArray(c.seen)&&c.seen.length<=10000&&new Set(c.seen).size===c.seen.length&&c.seen.every(id=>typeof id==='string'&&/^[a-zA-Z0-9_.:-]{1,160}$/.test(id));}
export function normalizeCycle(c,ids){
 if(c!==undefined&&!validQuizCycle(c))throw Error('クイズ出題履歴が不正です。');
 const allowed=new Set(ids);return {mode:'correct',round:c?.mode==='correct'?c.round:1,seen:c?.mode==='correct'?c.seen.filter(id=>allowed.has(id)):[]};
}
export function readyCycle(c,ids){const next=normalizeCycle(c,ids);if(next.seen.length===ids.length){next.seen=[];next.round++;}return next;}
export function markQuestion(c,id,ids){const next=normalizeCycle(c,ids);if(ids.includes(id)&&!next.seen.includes(id))next.seen.push(id);return next;}
export function pickQuestion(c,ids,rng,exclude=[]){
 const seen=normalizeCycle(c,ids).seen,remaining=ids.filter(id=>!seen.includes(id));
 const candidates=remaining.length?remaining:ids,distinct=candidates.filter(id=>!exclude.includes(id));
 const pool=distinct.length?distinct:candidates;
 if(!pool.length)throw Error('出題できる問題がありません。');
 return pool[Math.floor(rng()*pool.length)];
}
export function cycleForRun(s,ids,questions){
 let c=normalizeCycle(s?.quizCycle,ids);
 // Display-based flags cannot establish correctness. Recover only saved answers.
 if(s?.quizCycle?.mode!=='correct'&&s?.quiz&&questions){
  for(let i=0;i<s.quiz.answers.length;i++){const id=s.quiz.ids[i];if(s.quiz.answers[i]===questions[id]?.answer)c=markQuestion(c,id,ids);}
 }
 return c;
}
