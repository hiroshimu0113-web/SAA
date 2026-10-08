import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {fixedRun} from './fixed-run-fixture.mjs';
export async function checkQuizCycle(p){
 const key='saa-tower-run-v1',pack=JSON.parse(await readFile('public/tower/learning-catalog.json','utf8')),ids=Object.keys(pack.quizzes);
 const get=()=>p.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 async function map(cycle){const s=fixedRun(81,pack,cycle);s.floor=1;s.history=[{floor:0,lane:0,type:'battle'}];await p.evaluate(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key,s});await p.reload();}
 await map({round:1,seen:ids.slice(0,-1)});await p.locator('[data-action=node][data-lane="0"]:not([disabled])').click();
 let s=await get();assert.equal(s.quiz.ids[0],ids.at(-1));assert.equal(s.quizCycle.seen.length,250);assert.match(await p.locator('.quiz-cycle-progress').innerText(),/1巡目・250 \/ 250/);
 const order=s.quiz.orders;await p.reload();assert.deepEqual((await get()).quiz.orders,order);assert.deepEqual((await get()).quizCycle,s.quizCycle);
 await p.locator('[data-action=quiz-answer][data-choice="'+pack.quizzes[s.quiz.ids[0]].answer+'"]').click();await p.locator('[data-action=quiz-next]').click();
 s=await get();assert.equal(s.quizCycle.round,2);assert.deepEqual(s.quizCycle.seen,[s.quiz.ids[1]]);assert.match(await p.locator('.quiz-cycle-progress').innerText(),/2巡目・1 \/ 250/);
 const backup=s;await p.getByRole('button',{name:'オプション',exact:true}).click();await p.getByRole('button',{name:'はじめから',exact:true}).click();
 assert.deepEqual((await get()).quizCycle,backup.quizCycle);await p.reload();assert.deepEqual((await get()).quizCycle,backup.quizCycle);
 await p.locator('#import').setInputFiles({name:'cycle-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});assert.deepEqual((await get()).quizCycle,backup.quizCycle);assert.equal((await get()).quiz.step,1);
 // Continue a fresh adventure with the retained cycle: shown IDs are excluded.
 await map(backup.quizCycle);await p.locator('[data-action=node][data-lane="0"]:not([disabled])').click();s=await get();assert.ok(s.quiz.ids.every(id=>!backup.quizCycle.seen.includes(id)));
 console.log('PASS quiz cycle UI: last unseen, reset, actual display, reload/order, restart persistence, backup restore, next adventure exclusion.');
}
