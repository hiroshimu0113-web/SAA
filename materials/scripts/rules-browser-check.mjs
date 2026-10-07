import assert from 'node:assert/strict';
import {fixedRun as newRun} from './fixed-run-fixture.mjs';
import {act,QUIZZES,REWARD_RELICS} from '../public/tower/engine.mjs';
export async function checkRules(browser,base){
 const c=await browser.newContext({viewport:{width:320,height:740},isMobile:true,hasTouch:true}),p=await c.newPage(),key='saa-tower-run-v1';
 const load=async s=>{await p.evaluate(({key,s})=>localStorage.setItem(key,JSON.stringify(s)),{key,s});await p.reload();};
 const read=()=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 function quiz(hp=72,maxHp=72){const s=newRun(2);s.hp=hp;s.maxHp=maxHp;s.floor=1;s.history=[{floor:0,lane:0,type:'battle'}];return act(s,{type:'node',lane:0});}
 try{
 await p.goto(base+'tower/rules.html');let s=act(newRun(2),{type:'node',lane:0});await load(s);assert.equal(await p.locator('.status-badge').count(),0);
 s.battle.playerDebuffs.burn=1;s.battle.playerDebuffs.overload=2;s.battle.enemyDebuffs.misconfig=1;s.battle.enemyDebuffs.delay=3;await load(s);
 assert.equal(await p.locator('.player-column .status-badge').count(),2);assert.equal(await p.locator('.enemy-column .status-badge').count(),2);assert.equal(await p.locator('.player-column [data-debuff="burn"]').getAttribute('aria-label'),'炎上 1');assert.match(await p.locator('.enemy-column [data-debuff="delay"]').getAttribute('aria-label'),/あと2ターン/);
 for(const side of ['player','enemy']){const model=await p.locator('[data-status="'+side+'"]').boundingBox(),icons=await p.locator('.'+side+'-column .status-badges').boundingBox();assert.ok(icons.y>=model.y+model.height);}
 assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await p.screenshot({path:'artifacts/debuff-icons.png'});await p.reload();assert.equal(await p.locator('.status-badge').count(),4);
 s=quiz(112,112);await load(s);let id=s.quiz.ids[0];await p.locator('[data-action="quiz-answer"][data-choice="'+((QUIZZES[id].answer+1)%3)+'"]').tap();assert.equal((await read()).hp,100);await p.reload();assert.equal((await read()).hp,100);await p.getByRole('heading',{name:'不正解：HP −12（適用済み）',exact:true}).waitFor();
 s=quiz(4);await load(s);id=s.quiz.ids[0];await p.locator('[data-action="quiz-answer"][data-choice="'+((QUIZZES[id].answer+1)%3)+'"]').tap();await p.getByRole('heading',{name:'最後の問題の復習',exact:true}).waitFor();assert.equal((await read()).hp,0);assert.equal(await p.locator('[data-action="quiz-next"]').count(),0);await p.reload();await p.getByRole('heading',{name:'最後の問題の復習',exact:true}).waitFor();
 s=quiz();s.relics.push(...REWARD_RELICS);await load(s);for(let i=0;i<2;i++){await p.locator('[data-action="quiz-answer"][data-choice="'+QUIZZES[s.quiz.ids[i]].answer+'"]').tap();await p.locator('[data-action="quiz-next"]').tap();}assert.equal((await read()).gold,60);await p.getByText('全レリック所持済みのため、追加報酬はありません。',{exact:true}).waitFor();
 const r=newRun(2);r.floor=3;r.history=[{floor:0,lane:0,type:'battle'},{floor:1,lane:0,type:'event'},{floor:2,lane:0,type:'elite'}];s=act(r,{type:'node',lane:0});s.deck[0].id='optimize';await load(s);await p.locator('[data-action="upgrade"]').first().tap();await p.getByText('コスト 1 → 0',{exact:true}).waitFor();assert.ok((await p.locator('.upgrade-result').innerText()).includes('強化＋2'));await p.screenshot({path:'artifacts/power-upgrade.png'});
 console.log('PASS rule update: below-character icons, zero hidden, extended delay label, immediate percent quiz damage, fatal review, perfect no coins, power cost-only upgrade.');
 }finally{await c.close();}
}
