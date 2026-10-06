import assert from 'node:assert/strict';
import {newRun,act,QUIZZES} from '../public/tower/engine.mjs';
import {QUIZ_CASE_PAIRS} from '../public/tower/quiz.mjs';
export async function checkCases(browser,base){
 const context=await browser.newContext({viewport:{width:320,height:740},isMobile:true,hasTouch:true});
 const p=await context.newPage();p.setDefaultTimeout(10000);
 try{
  await p.goto(base+'tower/quiz.html');
  for(const ids of QUIZ_CASE_PAIRS){
   let s=newRun(1);s.floor=1;s.history=[{floor:0,lane:0,type:'battle'}];s=act(s,{type:'node',lane:0});s.quiz.ids=[...ids];
   await p.evaluate(s=>localStorage.setItem('saa-tower-run-v1',JSON.stringify(s)),s);await p.reload();
   for(const id of ids){
    assert.ok((await p.locator('#game').innerText()).includes(QUIZZES[id].prompt));
    await p.locator(`[data-action="quiz-answer"][data-choice="${QUIZZES[id].answer}"]`).tap();
    await p.locator('.quiz-explanation').waitFor();
    for(const reason of QUIZZES[id].reasons)assert.ok((await p.locator('.quiz-explanation').innerText()).includes(reason));
    const saved=await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1'));
    await p.reload();await p.locator('.quiz-explanation').waitFor();assert.equal(await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1')),saved);
    assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await p.locator('[data-action="quiz-next"]').tap();
   }
   await p.locator('.quiz-result').waitFor();
   const saved=await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1'));await p.reload();await p.locator('.quiz-result').waitFor();
   assert.equal(await p.evaluate(()=>localStorage.getItem('saa-tower-run-v1')),saved);
  }
  console.log(`PASS: ${QUIZ_CASE_PAIRS.length} paired cases, all explanations, 320px, answer resume and once-only rewards.`);
 }finally{await context.close();}
}
export async function checkCasesOffline(p){
 const key='saa-tower-run-v1',previous=await p.evaluate(k=>localStorage.getItem(k),key);
 try{
  for(const ids of QUIZ_CASE_PAIRS){
   let s=newRun(1);s.floor=1;s.history=[{floor:0,lane:0,type:'battle'}];s=act(s,{type:'node',lane:0});s.quiz.ids=[...ids];
   await p.evaluate(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key,s});await p.reload();
   for(const id of ids){
    await p.locator(`[data-action="quiz-answer"][data-choice="${QUIZZES[id].answer}"]`).tap();await p.locator('.quiz-explanation').waitFor();
    const saved=await p.evaluate(k=>localStorage.getItem(k),key);await p.reload();await p.locator('.quiz-explanation').waitFor();
    assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),saved);await p.locator('[data-action="quiz-next"]').tap();
   }
   await p.locator('.quiz-result').waitFor();const saved=await p.evaluate(k=>localStorage.getItem(k),key);await p.reload();await p.locator('.quiz-result').waitFor();
   assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),saved);
  }
  console.log(`PASS offline: ${QUIZ_CASE_PAIRS.length} paired cases, both answers and result resume without replay.`);
 }finally{await p.evaluate(({key,previous})=>localStorage.setItem(key,previous),{key,previous});await p.reload();await p.locator('.hand').waitFor();}
}
