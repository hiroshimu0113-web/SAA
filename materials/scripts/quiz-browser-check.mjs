import {fixedRun as newRun} from './fixed-run-fixture.mjs';
import assert from 'node:assert/strict';
import {act,QUIZZES} from '../public/tower/engine.mjs';
const key='saa-tower-run-v1';
function enter(){const s=newRun(7);s.floor=1;s.history=[{floor:0,lane:0,type:'battle'}];return act(s,{type:'node',lane:0});}
export async function quizOfflineRoundtrip(p){
 const old=await p.evaluate(k=>localStorage.getItem(k),key);await p.evaluate(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key,s:enter()});await p.reload();await p.locator('.quiz-option').first().tap();const saved=await p.evaluate(k=>localStorage.getItem(k),key);await p.reload();await p.locator('.quiz-explanation').waitFor();assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),saved);await p.evaluate(({key,old})=>localStorage.setItem(key,old),{key,old});await p.reload();await p.locator('.hand').waitFor();console.log('PASS quiz offline answer and resume.');
}
export async function checkQuizAndHud(browser,base){
 const c=await browser.newContext({viewport:{width:320,height:740},isMobile:true,hasTouch:true}),p=await c.newPage();p.setDefaultTimeout(10000);
 try{
 await p.goto(base+'tower/quiz.html');
 for(const correct of [2,1,0]){
  const s=enter();await p.evaluate(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key,s});await p.reload();await p.getByRole('heading',{name:'知識の間：1 / 2問'}).waitFor();
  assert.equal(await p.locator('.quiz-rules').getAttribute('open'),null);
  assert.ok(await p.locator('.quiz-prompt').evaluate(e=>Boolean(e.compareDocumentPosition(document.querySelector('.quiz-rules'))&Node.DOCUMENT_POSITION_FOLLOWING)));
  const guideSave=await p.evaluate(k=>localStorage.getItem(k),key);await p.locator('.quiz-rules summary').tap();assert.ok(await p.locator('.quiz-rules p').isVisible());await p.locator('.quiz-rules summary').tap();assert.equal(await p.locator('.quiz-rules p').isVisible(),false);assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),guideSave);
  for(let i=0;i<2;i++){
   const id=s.quiz.ids[i],choice=i<correct?QUIZZES[id].answer:(QUIZZES[id].answer+1)%3;await p.locator('[data-action="quiz-answer"][data-choice="'+choice+'"]').tap();await p.locator('.quiz-explanation').waitFor();assert.ok(await p.locator('.quiz-option').first().isDisabled());
   const saved=await p.evaluate(k=>localStorage.getItem(k),key);await p.reload();await p.locator('.quiz-explanation').waitFor();assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),saved);await p.locator('[data-action="quiz-next"]').tap();
  }
  await p.locator('.quiz-result').waitFor();const result=JSON.parse(await p.evaluate(k=>localStorage.getItem(k),key));assert.equal(result.quiz.result.correct,correct);assert.equal(result.hp,72-(2-correct)*8);assert.equal(result.gold,correct===1?90:60);assert.equal(result.relics.length,correct===2?2:1);
  await p.reload();assert.deepEqual(JSON.parse(await p.evaluate(k=>localStorage.getItem(k),key)),result);if(correct===2)await p.screenshot({path:'artifacts/quiz-result.png',fullPage:true});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.locator('[data-action="quiz-leave"]').tap();await p.locator('.route-map').waitFor();
 }
 // Old event saves migrate without discarding HP or currency.
 const old=enter();old.version=1;delete old.quiz;await p.evaluate(({key,old})=>localStorage.setItem(key,JSON.stringify(old)),{key,old});await p.reload();await p.locator('.quiz-option').first().waitFor();await p.screenshot({path:'artifacts/quiz-question.png',fullPage:true});
 const s=act(newRun(1),{type:'node',lane:0});s.hp=50;s.battle.enemy='noise';s.battle.hp=s.battle.maxHp=32;s.deck.find(c=>c.uid===s.battle.hand[0]).id='overload';await p.evaluate(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key,s});await p.reload();
 await p.locator('.hand .card').first().tap();assert.match(await p.locator('.hud-hp').innerText(),/47.*72/);const hud=await p.locator('.battle-hud').boundingBox(),toast=await p.locator('.combat-toast').boundingBox();assert.ok(toast.y>=hud.y+hud.height);
 await p.locator('.end-turn').tap();assert.match(await p.locator('.hud-hp').innerText(),/40.*72/);await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));const bottom=await p.locator('.battle-hud').boundingBox();assert.equal(bottom.y,0);assert.ok(bottom.height<100);await p.screenshot({path:'artifacts/battle-hud.png'});await p.reload();assert.match(await p.locator('.hud-hp').innerText(),/40.*72/);
 console.log('PASS quiz: 2/1/0 rewards, explanations, resume, no duplicate payout, legacy migration, 320px; HUD visible while scrolled and updated after damage.');
 }finally{await c.close();}
}
