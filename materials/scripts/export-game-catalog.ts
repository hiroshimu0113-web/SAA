// @ts-nocheck
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chapters,questions,terms} from '../src/content';
import {BASE_QUIZZES} from '../public/tower/quiz.mjs';
import {BASE_ENEMIES} from '../public/tower/enemy-definitions.mjs';
import {BASE_RELICS} from '../public/tower/relics.mjs';
import {BASE_COMBOS} from '../public/tower/combos.mjs';
import {BASE_CARDS} from '../public/tower/card-definitions.mjs';
import {validateCatalog,STARTERS} from '../public/tower/catalog.mjs';
const root=new URL('../',import.meta.url);
const supplement=JSON.parse(await readFile(new URL('knowledge/game-supplement.json',root),'utf8'));
const cards=Object.fromEntries(Object.entries(BASE_CARDS).filter(([id])=>!STARTERS.includes(id)));
const notes={};
const sourceFor=(term)=>questions.find(q=>q.conceptIds.includes(term.id))?.sources[0]?.url || chapters.find(c=>c.id===term.chapterId)?.lessons.find(l=>l.conceptIds.includes(term.id))?.sources[0]?.url;
const starterNames={};
const publishedTerms=[...terms.map(t=>({...t,source:sourceFor(t)})),...supplement.terms];
const termById=new Map(publishedTerms.map(t=>[t.id,t]));
if(Object.keys(supplement.cardTerms).sort().join()!==Object.keys(BASE_CARDS).sort().join())throw Error('全既存カードに教材用語の対応が必要です');
for(const [id,termId] of Object.entries(supplement.cardTerms)){
 const term=termById.get(termId);
 if(!term)throw Error('公開教材にないカード用語: '+termId);
 if(STARTERS.includes(id))starterNames[id]=term.name;
 else cards[id]={...cards[id],name:term.name};
 notes[id]={note:term.meaning,source:term.source,limit:'教材の用語を復習するカードです。攻撃・防御・回復・状態異常などの数値効果はゲーム固有であり、AWSの機能・性能・保証を表しません。'};
}
const selectedStudyTerms=supplement.studyTerms;
if(!Array.isArray(selectedStudyTerms)||new Set(selectedStudyTerms).size!==selectedStudyTerms.length||Object.keys(BASE_CARDS).length+selectedStudyTerms.length>30)throw Error('通常カードは30種類以内で、復習用語IDは重複不可です');
for(const termId of selectedStudyTerms){
 const term=termById.get(termId);if(!term)throw Error('公開教材にない復習用語: '+termId);
 const id='study-'+term.id;
 if(cards[id])throw Error('duplicate card '+id);
 // A single explicitly designed study-card mechanic, never inferred from AWS performance.
 cards[id]={name:term.name,cost:1,kind:'skill',block:5,draw:1,upBlock:3,text:'5ブロック。1枚引く。'};
 notes[id]={note:term.meaning,limit:'復習して備えることを、5ブロックと1枚ドローで表した学習カードです。AWSの性能・権限・耐障害性を数値化したものではありません。',source:term.source};
}
const quizzes={...BASE_QUIZZES,...supplement.quizzes};let skipped=0;
for(const q of questions){
 if(q.exam||q.answers.length!==1){skipped++;continue;}
 const source=q.sources.find(s=>/^https:\/\/(docs\.)?aws\.amazon\.com\//.test(s.url))?.url;
 quizzes['study-'+q.id]={prompt:q.prompt,options:q.options.map(o=>o.text),answer:q.options.findIndex(o=>o.id===q.answers[0]),reasons:q.options.map(o=>o.explanation+' '+q.explanation),source};
}
const vocabulary={};
const publishedText=JSON.stringify({chapters,questions,terms,supplementTerms:supplement.terms});
for(const [group,base] of Object.entries({enemies:BASE_ENEMIES,relics:BASE_RELICS,combos:BASE_COMBOS,junk:{junk:{}}})){
 const refs=supplement.vocabulary[group];
 if(Object.keys(refs).sort().join()!==Object.keys(base).sort().join())throw Error('名称対応漏れ: '+group);
 vocabulary[group]={};
 for(const [id,ref] of Object.entries(refs)){
  const term=termById.get(ref.term);
  if(!term)throw Error('公開教材にない名称用語: '+ref.term);
  const name=ref.name||term.name;
  if(!publishedText.includes(name))throw Error('教材にない名称: '+name);
  if(ref.name){
   const lesson=chapters.flatMap(c=>c.lessons).find(l=>l.id===ref.material_ref?.locator);
   if(ref.material_ref?.path!=='src/content/index.ts'||!lesson?.explanation.includes(name))throw Error('名称の教材出現箇所が不正: '+name);
  }
  vocabulary[group][id]={name,note:ref.lesson||ref.note||term.meaning,source:term.source,limit:group==='enemies'?'教材の用語を復習する課題名です。敵の攻撃・HP・デバフは架空の戦闘ルールで、AWSサービスが攻撃するという意味ではありません。':'名称は教材の復習用です。獲得効果・戦闘効果・3枚の成立条件はゲーム固有で、AWSの機能・性能・設定要件を表しません。'};
 }
}
const data={schema:1,vocabulary,starterNames,cards,notes,quizzes,counts:{publishedTerms:terms.length,additionalTerms:supplement.terms.length,publishedQuestions:questions.length,skippedQuestions:skipped},sourceRefs:['src/content/index.ts','src/content/starter.ts','knowledge/game-supplement.json']};
const pack={...data,version:createHash('sha256').update(JSON.stringify(data)).digest('hex').slice(0,16)};validateCatalog(pack);
const output=JSON.stringify(pack,null,2)+'\n';
const path=new URL('public/tower/learning-catalog.json',root);
if(process.argv.includes('--check')){if(await readFile(path,'utf8')!==output)throw Error('pnpm game:export が必要です');}else await writeFile(path,output);
console.log(`Game catalog ${pack.version}: ${Object.keys(cards).length+3} cards, ${Object.keys(quizzes).length} quizzes (${skipped} multiple-answer/exam questions deferred)`);
