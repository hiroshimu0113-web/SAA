import {fixedRun as newRun} from '../scripts/fixed-run-fixture.mjs';
import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {parseRun,act,CARDS,QUIZZES,cardValues,activateCatalog} from '../public/tower/engine.mjs';
import {validateCatalog,chooseCatalog,fetchCatalog,CATALOG_KEY,STARTERS} from '../public/tower/catalog.mjs';
import {questions,terms} from '../src/content/index.ts';
import {ENEMIES,HEROES,RELICS} from '../public/tower/engine.mjs';
import {BASE_ENEMIES} from '../public/tower/enemy-definitions.mjs';
import {BASE_RELICS} from '../public/tower/relics.mjs';
import {BASE_COMBOS,COMBOS} from '../public/tower/combos.mjs';
import {DEBUFFS} from '../public/tower/debuffs.mjs';
import {BASE_CARDS} from '../public/tower/card-definitions.mjs';
const pack=JSON.parse(readFileSync(new URL('../public/tower/learning-catalog.json',import.meta.url)));
const clone=x=>JSON.parse(JSON.stringify(x));
test('catalog: published terms/questions are playable; starter effects and initial deck are unchanged',()=>{
 const legacy=newRun(42),current=newRun(42,pack);assert.deepEqual(current.deck,legacy.deck);
 for(const id of STARTERS){const {name,...actual}=CARDS[id],{name:old,...expected}=BASE_CARDS[id];assert.deepEqual(actual,expected);assert.equal(name,pack.starterNames[id]);}
 assert.equal(Object.keys(CARDS).filter(id=>!CARDS[id].battleOnly).length,Object.keys(pack.cards).length+3);assert.equal(Object.keys(QUIZZES).length,Object.keys(pack.quizzes).length);
 const expected=questions.filter(q=>!q.exam&&q.answers.length===1).map(q=>'study-'+q.id).sort();
 assert.deepEqual(Object.keys(QUIZZES).filter(id=>/^study-(q[0-9]+|rr[0-9]+-[0-9]+)$/.test(id)).sort(),expected);
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
 const legacy=newRun(4);newRun(5,pack);assert.deepEqual(parseRun(JSON.stringify(legacy)),legacy);assert.equal(CARDS.strike.name,pack.starterNames.strike);
 const bad=clone(s);bad.hp=-1;assert.throws(()=>parseRun(JSON.stringify(bad)));assert.equal(CARDS.strike.name,pack.starterNames.strike);
 activateCatalog(null);
});
test('catalog: malformed packs cannot redefine starters, inject links or corrupt score/card shapes',()=>{
 for(const mutate of [p=>p.schema=2,p=>p.cards.junk={...BASE_CARDS.strike},p=>p.cards.strike={...BASE_CARDS.strike},p=>p.cards['study-region'].cost=-1,p=>p.notes.strike.source='javascript:alert(1)',p=>p.starterNames.guard='<script>',p=>p.quizzes['study-q001'].answer=99,p=>delete p.notes.probe]){const p=clone(pack);mutate(p);assert.throws(()=>validateCatalog(p));}
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

test('catalog: every playable card uses a published term and preserves its definition and original mechanics',()=>{
 const supplement=JSON.parse(readFileSync(new URL('../knowledge/game-supplement.json',import.meta.url)));
 const published=new Map([...terms,...supplement.terms].map(t=>[t.id,t]));
 const names=new Set([...published.values()].map(t=>t.name));
 for(const name of [...Object.values(pack.starterNames),...Object.values(pack.cards).map(c=>c.name)])assert.ok(names.has(name),name);
 assert.deepEqual(Object.keys(supplement.cardTerms).sort(),Object.keys(BASE_CARDS).sort());
 for(const [id,termId] of Object.entries(supplement.cardTerms)){
  const term=published.get(termId);assert.ok(term);assert.equal(pack.notes[id].note,term.meaning);
  assert.equal(pack.starterNames[id]||pack.cards[id].name,term.name);
  if(pack.cards[id]){const {name,...actual}=pack.cards[id],{name:old,...expected}=BASE_CARDS[id];assert.deepEqual(actual,expected);}
 }
});

// Names and teaching text are the only imported fields; combat profiles stay local.
test('catalog: vocabulary covers every entity while heroes, debuffs and mechanics remain fixed',()=>{
 const heroes=clone(HEROES),debuffs=clone(DEBUFFS);
 const old=newRun(43);const oldSave=JSON.stringify(old);
 activateCatalog(pack);
 for(const [group,target,base] of [['enemies',ENEMIES,BASE_ENEMIES],['relics',RELICS,BASE_RELICS],['combos',COMBOS,BASE_COMBOS]]){
  assert.deepEqual(Object.keys(pack.vocabulary[group]).sort(),Object.keys(base).sort());
  for(const [id,entry] of Object.entries(pack.vocabulary[group])){
   assert.equal(target[id].name,entry.name);
   const omitted=group==='combos'?['name','lesson','source']:['name'];
   const mechanics=value=>Object.fromEntries(Object.entries(value).filter(([key])=>!omitted.includes(key)));
   assert.deepEqual(mechanics(target[id]),mechanics(base[id]));
  }
 }
 assert.equal(CARDS.junk.name,'一時データ');assert.deepEqual(HEROES,heroes);assert.deepEqual(DEBUFFS,debuffs);
 const current=newRun(43,pack);assert.deepEqual(parseRun(JSON.stringify(current)),current);
 assert.deepEqual(parseRun(oldSave),old);assert.deepEqual(ENEMIES,BASE_ENEMIES);assert.deepEqual(RELICS,BASE_RELICS);assert.deepEqual(COMBOS,BASE_COMBOS);
 const previous=clone(pack);delete previous.vocabulary;previous.version='dddddddddddddddd';
 const olderRun=newRun(43,previous);assert.deepEqual(parseRun(JSON.stringify(olderRun)),olderRun);assert.equal(CARDS.junk.name,'障害ログ');
 activateCatalog(null);
});
test('catalog: vocabulary rejects missing IDs, altered mechanics and fixed hero/debuff overrides atomically',()=>{
 for(const mutate of [p=>delete p.vocabulary.enemies.noise,p=>p.vocabulary.relics.extra=p.vocabulary.relics.shell,p=>p.vocabulary.enemies.noise.hp=1,p=>p.vocabulary.combos.incident.cards=['strike'],p=>p.vocabulary.heroes={},p=>p.vocabulary.debuffs={},p=>p.vocabulary.junk.junk.name='<script>',p=>p.vocabulary.relics.shell.source='javascript:alert(1)',p=>p.vocabulary=null]){
  activateCatalog(pack);const before={cards:clone(CARDS),enemies:clone(ENEMIES),relics:clone(RELICS),combos:clone(COMBOS)};
  const bad=clone(pack);mutate(bad);assert.throws(()=>activateCatalog(bad));
  assert.deepEqual({cards:CARDS,enemies:ENEMIES,relics:RELICS,combos:COMBOS},before);
 }
 activateCatalog(null);
});

test('catalog: 30-card pool remains capped while retired cards in old adventures still resume',()=>{
 assert.equal(Object.keys(pack.cards).length+STARTERS.length,30);
 const older=clone(pack);older.version='eeeeeeeeeeeeeeee';
 older.cards['study-root']={...older.cards['study-region'],name:'ルートユーザー'};
 older.notes['study-root']={...older.notes['study-region']};
 const old=newRun(51,older);old.deck[0].id='study-root';const saved=JSON.stringify(old);
 newRun(52,pack);assert.equal(CARDS['study-root'],undefined);
 assert.deepEqual(parseRun(saved),old);assert.equal(CARDS['study-root'].name,'ルートユーザー');
 newRun(53,pack);assert.equal(CARDS['study-root'],undefined);
 activateCatalog(null);
});

test('catalog: old starter labels are corrected without changing saved adventure or effects',()=>{
 const old=clone(pack);old.version='ffffffffffffffff';old.starterNames={strike:'切り分け',guard:'防壁',probe:'観測'};
 const s=newRun(77,old),raw=JSON.stringify(s);
 assert.deepEqual(parseRun(raw),s);
 for(const id of STARTERS){assert.equal(CARDS[id].name,pack.starterNames[id]);const {name,...actual}=CARDS[id],{name:ignored,...expected}=BASE_CARDS[id];assert.deepEqual(actual,expected);}
 assert.equal(JSON.stringify(s),raw);activateCatalog(null);
 for(const id of STARTERS)assert.equal(CARDS[id].name,pack.starterNames[id]);
});

test('catalog: renamed starters preserve both related roles and their teaching boundaries',()=>{
 activateCatalog(pack);assert.deepEqual(pack.starterNames,{strike:'Amazon EC2',guard:'セキュリティグループ',probe:'CloudWatch'});
 assert.deepEqual(COMBOS.incident.cards,['probe','strike','guard']);assert.equal(COMBOS.incident.block,5);
 assert.deepEqual(COMBOS.balancing.cards,['balance','parallel','probe']);assert.equal(COMBOS.balancing.damage,3);
 assert.match(COMBOS.incident.lesson,/セキュリティグループ/);assert.match(COMBOS.incident.lesson,/CloudWatch/);
 assert.match(COMBOS.balancing.lesson,/CloudWatchの監視はALBのターゲットヘルスチェックとは別/);
 const old=clone(pack);old.version='1111111111111111';old.vocabulary.combos.balancing.note='旧ヘルスチェックの説明';
 activateCatalog(old);assert.match(COMBOS.balancing.lesson,/CloudWatch/);activateCatalog(null);
});
