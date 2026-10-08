// Learning records are separate from combat state and retain the question snapshot used.
export const STUDY_KEY='saa-tower-study-v1';
const copy=x=>JSON.parse(JSON.stringify(x));
const validId=x=>typeof x==='string'&&/^[a-zA-Z0-9_.:-]{1,160}$/.test(x);
const obj=x=>x&&typeof x==='object'&&!Array.isArray(x);
const fail=()=>{throw Error('学習記録の形式が不正です。元の記録は上書きしていません。');};
export function validQuestion(q){
 return obj(q)&&validId(q.id)&&typeof q.revision==='string'&&q.revision.length<=100&&typeof q.prompt==='string'&&q.prompt.length<=6000&&Array.isArray(q.options)&&q.options.length>=3&&q.options.length<=8&&q.options.every(t=>typeof t==='string'&&t.length<=4000)&&Array.isArray(q.reasons)&&q.reasons.length===q.options.length&&q.reasons.every(t=>typeof t==='string'&&t.length<=6000)&&selection(q.answers,q.options.length)&&q.answers.length>0&&q.answers.length<q.options.length&&[1,2,3,4].includes(q.domain)&&Array.isArray(q.skills)&&q.skills.every(t=>typeof t==='string'&&t.length<=100)&&['basic','design','assessment'].includes(q.level)&&typeof q.source==='string'&&/^https:\/\/(?:docs\.aws\.amazon\.com|aws\.amazon\.com)\/[^\s"<>]*$/.test(q.source);
}
function selection(a,n){return Array.isArray(a)&&new Set(a).size===a.length&&a.every(x=>Number.isInteger(x)&&x>=0&&x<n);}
export const correct=(q,a)=>a.length===q.answers.length&&q.answers.every(x=>a.includes(x));
export function emptyStudy(){return {schema:1,records:[],attempts:[],session:null};}
export function parseStudy(raw){
 const p=JSON.parse(raw);if(!obj(p)||p.schema!==1||!Array.isArray(p.records)||!Array.isArray(p.attempts))fail();
 const ids=new Set(),counts=new Map();for(const r of p.records){if(!obj(r)||!validId(r.key)||ids.has(r.key)||!validQuestion(r.question)||!selection(r.selected,r.question.options.length)||r.correct!==correct(r.question,r.selected)||!Number.isFinite(r.at)||!['room','practice','assessment'].includes(r.mode))fail();ids.add(r.key);const k=r.question.id+':'+r.question.revision,n=(counts.get(k)||0)+1;if(r.attemptNumber!==n)fail();counts.set(k,n);}
 for(const a of p.attempts)if(!obj(a)||!validId(a.id)||typeof a.version!=='string'||!Number.isFinite(a.startedAt)||!['unseen','seen'].includes(a.exposure)||a.finishedAt!==null&&!Number.isFinite(a.finishedAt))fail();
 if(p.session!==null){const s=p.session;if(!obj(s)||!validId(s.id)||!['practice','assessment'].includes(s.mode)||typeof s.version!=='string'||!Array.isArray(s.questions)||!s.questions.length||s.questions.length>1000||!s.questions.every(validQuestion)||!Array.isArray(s.orders)||s.orders.length!==s.questions.length||!s.orders.every((a,i)=>selection(a,s.questions[i].options.length)&&a.length===s.questions[i].options.length)||!Array.isArray(s.answers)||s.answers.length!==s.questions.length||!s.answers.every((a,i)=>a===null||selection(a,s.questions[i].options.length))||!Array.isArray(s.confirmed)||s.confirmed.length!==s.questions.length||!s.confirmed.every(x=>typeof x==='boolean')||!Number.isInteger(s.index)||s.index<0||s.index>=s.questions.length||typeof s.submitted!=='boolean'||!Number.isFinite(s.startedAt)||!Number.isFinite(s.deadline))fail();if(s.mode==='assessment'&&!p.attempts.some(a=>a.id===s.id))fail();}
 return p;
}
export function loadStudy(storage){const raw=storage.getItem(STUDY_KEY);return raw?parseStudy(raw):emptyStudy();}
export function persistStudy(storage,p){parseStudy(JSON.stringify(p));storage.setItem(STUDY_KEY,JSON.stringify(p));return p;}
export function shuffled(n,rng=Math.random){const a=Array.from({length:n},(_,i)=>i);for(let i=n-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function startStudy(p,questions,{mode='practice',version,now=Date.now(),id,unseen=false,rng=Math.random}){
 if(p.session&&!p.session.submitted)throw Error('進行中の学習を終了してから開始してください。');
 const next=copy(p);next.session={id,mode,version,startedAt:now,deadline:mode==='assessment'?now+130*60000:0,questions:copy(questions),orders:questions.map(q=>shuffled(q.options.length,rng)),answers:questions.map(()=>null),confirmed:questions.map(()=>false),index:0,submitted:false};
 if(mode==='assessment')next.attempts.push({id,version,startedAt:now,finishedAt:null,exposure:unseen&&next.attempts.length===0?'unseen':'seen'});
 parseStudy(JSON.stringify(next));return next;
}
export function recordAnswer(p,{key,question,selected,mode,at=Date.now()}){
 if(p.records.some(r=>r.key===key))return p;
 const next=copy(p);next.records.push({key,question:copy(question),selected:[...selected],correct:correct(question,selected),mode,at,attemptNumber:next.records.filter(r=>r.question.id===question.id&&r.question.revision===question.revision).length+1});parseStudy(JSON.stringify(next));return next;
}
export function answerStudy(p,selected,now=Date.now()){
 const s=p.session;if(!s||s.submitted||s.confirmed[s.index])return p;if(s.mode==='assessment'&&now>=s.deadline)return submitStudy(p,now);
 const q=s.questions[s.index];if(!selection(selected,q.options.length)||selected.length!==q.answers.length)throw Error(q.answers.length+'つ選択してください。');
 let next=copy(p);next.session.answers[s.index]=[...selected];next.session.confirmed[s.index]=true;
 if(s.mode==='practice')next=recordAnswer(next,{key:s.id+':'+s.index,question:q,selected,mode:'practice',at:now});return next;
}
export function submitStudy(p,now=Date.now()){
 const s=p.session;if(!s||s.submitted)return p;let next=copy(p);next.session.submitted=true;
 if(s.mode==='assessment'){for(let i=0;i<s.questions.length;i++)next=recordAnswer(next,{key:s.id+':'+i,question:s.questions[i],selected:s.answers[i]||[],mode:'assessment',at:now});next.attempts.find(a=>a.id===s.id).finishedAt=now;}return next;
}
export function abandonStudy(p,now=Date.now()){if(!p.session)return p;let next=copy(p.session.mode==='assessment'?submitStudy(p,now):p);next.session=null;return next;}
export function progressFor(p,questions){return questions.map(q=>{const all=p.records.filter(r=>r.question.id===q.id),current=all.filter(r=>r.question.revision===q.revision),last=current[current.length-1];return {q,count:current.length,ever:all.length,last,first:current[0]};});}
