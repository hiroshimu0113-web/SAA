import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {emptyStudy,parseStudy,startStudy,answerStudy,submitStudy,abandonStudy,recordAnswer,progressFor,persistStudy,STUDY_KEY} from '../public/tower/study-state.mjs';
import {validateStudyCatalog,fetchStudyCatalog} from '../public/tower/study-catalog.mjs';
import {fixedRun} from '../scripts/fixed-run-fixture.mjs';import {act,parseRun,QUIZZES} from '../public/tower/engine.mjs';
const pack=validateStudyCatalog(JSON.parse(readFileSync(new URL('../public/tower/study-catalog.json',import.meta.url))));
const clone=x=>JSON.parse(JSON.stringify(x));
const options={id:'test1',version:pack.version,now:1000,rng:()=>.2};
test('learning room exposes all regular questions, design skills, multiple choices, and an isolated 65-question assessment',()=>{
 assert.equal(pack.practice.length,268);assert.equal(pack.practice.filter(q=>q.level==='design').length,26);assert.equal(pack.practice.filter(q=>q.answers.length>1).length,18);
 assert.deepEqual([...new Set(pack.practice.flatMap(q=>q.skills))].sort(),['1.1','1.2','1.3','2.1','2.2','3.1','3.2','3.3','3.4','3.5','4.1','4.2','4.3','4.4']);
 assert.equal(pack.assessment.length,65);assert.equal(pack.assessment.filter(q=>q.answers.length>1).length,7);assert.deepEqual([1,2,3,4].map(d=>pack.assessment.filter(q=>q.domain===d).length),[20,17,15,13]);
 assert.ok(pack.assessment.every(q=>!pack.practice.some(p=>p.id===q.id)));
});
test('multiple answers require exact membership; drafts, order, explanations and revisions survive a backup',()=>{
 const q=pack.practice.find(q=>q.answers.length>1);let p=startStudy(emptyStudy(),[q],options);const order=clone(p.session.orders);
 p.session.answers[0]=[q.answers[0]];p=parseStudy(JSON.stringify(p));assert.deepEqual(p.session.orders,order);assert.throws(()=>answerStudy(p,[q.answers[0]]));
 const wrong=q.options.map((_,i)=>i).filter(i=>!q.answers.includes(i)).slice(0,q.answers.length);p=answerStudy(p,wrong,2000);assert.equal(p.records[0].correct,false);assert.equal(p.records[0].attemptNumber,1);assert.deepEqual(answerStudy(p,q.answers),p);
 p=abandonStudy(p);p=startStudy(p,[q],{...options,id:'test2'});p=answerStudy(p,[...q.answers].reverse(),3000);assert.equal(p.records[1].correct,true);assert.equal(p.records[1].attemptNumber,2);assert.deepEqual(parseStudy(JSON.stringify(p)),p);
 const newer={...q,revision:'next'};assert.equal(progressFor(p,[newer])[0].count,0);assert.equal(progressFor(p,[newer])[0].ever,2);assert.equal(progressFor(p,[q])[0].last.correct,true);
});
test('assessment reveals no per-question record before submission; timeout, resume and repeat retain exposure history',()=>{
 let p=startStudy(emptyStudy(),pack.assessment,{...options,mode:'assessment',unseen:true});assert.equal(p.attempts[0].exposure,'unseen');p=answerStudy(p,p.session.questions[0].answers,2000);assert.equal(p.records.length,0);assert.equal(p.session.submitted,false);
 p=parseStudy(JSON.stringify(p));const deadline=p.session.deadline;p=answerStudy({...p,session:{...p.session,index:1}},p.session.questions[1].answers,deadline);assert.equal(p.session.submitted,true);assert.equal(p.records.length,65);assert.equal(p.records.filter(r=>r.correct).length,1);assert.deepEqual(submitStudy(p),p);
 p=abandonStudy(p);p=startStudy(p,pack.assessment,{...options,id:'repeat',mode:'assessment',unseen:true});assert.equal(p.attempts[1].exposure,'seen');assert.equal(p.attempts[0].finishedAt,deadline);
});
test('corrupt learning backup and storage failure never overwrite the prior stored record',async()=>{
 const p=startStudy(emptyStudy(),[pack.practice[0]],options),raw=JSON.stringify(p);let saved=raw;const storage={getItem:()=>saved,setItem:()=>{throw Error('quota');}};
 assert.throws(()=>persistStudy(storage,answerStudy(p,p.session.questions[0].answers)));assert.equal(saved,raw);
 for(const mutate of [p=>p.session.orders[0][0]=p.session.orders[0][1],p=>p.session.answers[0]=[999],p=>p.session.questions[0].source='javascript:alert(1)',p=>p.session.index=-1]){const bad=clone(p);mutate(bad);assert.throws(()=>parseStudy(JSON.stringify(bad)));}
 await assert.rejects(fetchStudyCatalog('https://example.test',pack,storage,async()=>({ok:true,text:async()=>JSON.stringify(pack)})));assert.equal(saved,raw);
 const bad=clone(pack);bad.assessment[0].answers=[999];assert.throws(()=>validateStudyCatalog(bad));
});
test('room answers deduplicate by event while first/repeat history is independent of the adventure',()=>{
 const q=pack.practice[0],event={key:'room:1',question:q,selected:q.answers,mode:'room',at:100};let p=recordAnswer(emptyStudy(),event);assert.equal(recordAnswer(p,event),p);p=recordAnswer(p,{...event,key:'room:2'});assert.equal(p.records.length,2);assert.equal(p.records[1].attemptNumber,2);assert.deepEqual(parseStudy(JSON.stringify(p)),p);
});
test('room option order is a persisted permutation; old index-based saves and new answers keep the same scoring',()=>{
 const firstPositions=new Set();for(let seed=1;seed<=24;seed++){let s=fixedRun(seed);s.floor=1;s.history=[{floor:0,lane:0,type:'battle'}];s=act(s,{type:'node',lane:0});const q=s.quiz,id=q.ids[0],answer=QUIZZES[id].answer;
 firstPositions.add(q.orders[0].indexOf(answer));assert.deepEqual(parseRun(JSON.stringify(s)).quiz.orders,q.orders);const old=clone(s);delete old.quiz.orders;assert.deepEqual(parseRun(JSON.stringify(old)),old);
 const chosen=q.orders[0][q.orders[0].indexOf(answer)];const next=act(s,{type:'quiz-answer',questionId:id,choice:chosen});assert.equal(next.hp,s.hp);assert.equal(next.quiz.answers[0],answer);const bad=clone(s);bad.quiz.orders[0]=[0,0,1];assert.throws(()=>parseRun(JSON.stringify(bad)));}
 assert.ok(firstPositions.size>1);
});

test('room answer timestamps survive backup and a legacy caller can append another answer',()=>{
 let s=fixedRun(2);s.floor=1;s.history=[{floor:0,lane:0,type:'battle'}];s=act(s,{type:'node',lane:0});const id=s.quiz.ids[0];s=act(s,{type:'quiz-answer',questionId:id,choice:QUIZZES[id].answer,answeredAt:1234});s=parseRun(JSON.stringify(s));assert.deepEqual(s.quiz.answerTimes,[1234]);s=act(s,{type:'quiz-next',questionId:id});const second=s.quiz.ids[1];s=act(s,{type:'quiz-answer',questionId:second,choice:QUIZZES[second].answer});assert.deepEqual(parseRun(JSON.stringify(s)).quiz.answerTimes,[1234,0]);
});

test('closing a submitted assessment is immutable even if the next save fails',()=>{
 const p=submitStudy(startStudy(emptyStudy(),pack.assessment,{...options,mode:'assessment'}),2000),before=JSON.stringify(p),next=abandonStudy(p);
 assert.equal(next.session,null);assert.equal(JSON.stringify(p),before);assert.throws(()=>persistStudy({setItem(){throw Error('quota');}},next));assert.equal(JSON.stringify(p),before);
});
