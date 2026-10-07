import {fixedRun as newRun} from '../scripts/fixed-run-fixture.mjs';
import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {parseRun,act,CARDS,QUIZZES,cardValues,activateCatalog} from '../public/tower/engine.mjs';
import {validateCatalog,chooseCatalog,fetchCatalog,CATALOG_KEY,STARTERS} from '../public/tower/catalog.mjs';
import {questions} from '../src/content/index.ts';
import {BASE_CARDS} from '../public/tower/card-definitions.mjs';
const pack=JSON.parse(readFileSync(new URL('../public/tower/learning-catalog.json',import.meta.url)));
const clone=x=>JSON.parse(JSON.stringify(x));
test('catalog: published terms/questions are playable; starter effects and initial deck are unchanged',()=>{
 const legacy=newRun(42),current=newRun(42,pack);assert.deepEqual(current.deck,legacy.deck);
 for(const id of STARTERS){const {name,...actual}=CARDS[id],{name:old,...expected}=BASE_CARDS[id];assert.deepEqual(actual,expected);assert.notEqual(name,old);}
 assert.equal(Object.keys(CARDS).length,Object.keys(pack.cards).length+3);assert.equal(Object.keys(QUIZZES).length,Object.keys(pack.quizzes).length);
 const expected=questions.filter(q=>!q.exam&&q.answers.length===1).map(q=>'study-'+q.id).sort();
 assert.deepEqual(Object.keys(QUIZZES).filter(id=>/^study-q[0-9]+$/.test(id)).sort(),expected);
 for(const id of Object.keys(pack.cards).filter(id=>id.startsWith('study-'))){
  let s=newRun(42,pack);s.deck[0].id=id;s=act(s,{type:'node',lane:0});const card=s.deck[0];s.battle.hand=s.battle.hand.filter(x=>x!==card.uid);s.battle.draw=s.battle.draw.filter(x=>x!==card.uid);s.battle.hand.push(card.uid);const hp=s.hp;const next=act(s,{type:'play',uid:card.uid});assert.notEqual(next,s);assert.equal(next.hp,hp);assert.deepEqual(parseRun(JSON.stringify(next)),next);
 }
 activateCatalog(null);
});
test('catalog: old/ongoing quiz snapshot survives a changed answer and backup import',()=>{
 let s=newRun(3,pack);s.floor=1;s.history=[{floor:0,lane:0,type:'battle'}];s=act(s,{type:'node',lane:0});const id=s.quiz.ids[0],answer=QUIZZES[id].answer;
 s=act(s,{type:'quiz-answer',questionId:id,choice:answer});const raw=JSON.stringify(s),newer=clone(pack);newer.version='aaaaaaaaaaaaaaaa';
 if(newer.quizzes[id])newer.quizzes[id].answer=(answer+1)%newer.quizzes[id].options.length;
 newRun(4,newer);const restored=parseRun(raw);assert.deepEqual(restored,s);assert.equal(QUIZZES[id].answer,answer);
 const legacy=newRun(4);newRun(5,pack);assert.deepEqual(parseRun(JSON.stringify(legacy)),legacy);assert.equal(CARDS.strike.name,'切り分け');
 const bad=clone(s);bad.hp=-1;assert.throws(()=>parseRun(JSON.stringify(bad)));assert.equal(CARDS.strike.name,'切り分け');
 activateCatalog(null);
});
test('catalog: malformed packs cannot redefine starters, inject links or corrupt score/card shapes',()=>{
 for(const mutate of [p=>p.schema=2,p=>p.cards.strike={...BASE_CARDS.strike},p=>p.cards['study-region'].cost=-1,p=>p.notes.strike.source='javascript:alert(1)',p=>p.starterNames.guard='<script>',p=>p.quizzes['study-q001'].answer=99,p=>delete p.notes.probe]){const p=clone(pack);mutate(p);assert.throws(()=>validateCatalog(p));}
});
test('catalog: update is atomic, offline/bad JSON/quota errors preserve stored content; new bundle supersedes stale cache',async()=>{
 let value;const storage={getItem:()=>value,setItem:(k,v)=>{assert.equal(k,CATALOG_KEY);value=v;}};
 const fetcher=async()=>({ok:true,text:async()=>JSON.stringify(pack)});
 await fetchCatalog('https://example.test/catalog',{fetcher,storage,bundledVersion:pack.version});assert.deepEqual(chooseCatalog(pack,storage),pack);const saved=value;
 for(const f of [async()=>{throw Error('offline');},async()=>({ok:false,text:async()=>''}),async()=>({ok:true,text:async()=>'{bad'})]){await assert.rejects(fetchCatalog('x',{fetcher:f,storage,bundledVersion:pack.version}));assert.equal(value,saved);}
 await assert.rejects(fetchCatalog('x',{fetcher,storage:{...storage,setItem:()=>{throw Error('quota')}}}));assert.equal(value,saved);
 const fresh=clone(pack);fresh.version='bbbbbbbbbbbbbbbb';assert.deepEqual(chooseCatalog(fresh,storage),fresh);
});
test('catalog: rewards and shops include at most one study card; save retains newly acquired card',()=>{
 let s=newRun(8,pack);s.floor=2;s.history=[{floor:0,lane:0,type:'battle'},{floor:1,lane:0,type:'event'}];s=act(s,{type:'node',lane:1});assert.equal(s.stock.filter(id=>id.startsWith('study-')).length,1);
 const id=s.stock.find(id=>id.startsWith('study-'));s=act(s,{type:'buy',id});assert.ok(s.deck.some(c=>c.id===id));assert.deepEqual(parseRun(JSON.stringify(s)),s);activateCatalog(null);
});
