// @ts-nocheck
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {chapters,questions,terms} from '../src/content';
import {BASE_QUIZZES} from '../public/tower/quiz.mjs';
import {BASE_CARDS} from '../public/tower/card-definitions.mjs';
import {BASE_FLAVOR} from '../public/tower/flavor.mjs';
import {validateCatalog,STARTERS} from '../public/tower/catalog.mjs';
const root=new URL('../',import.meta.url);
const supplement=JSON.parse(await readFile(new URL('knowledge/game-supplement.json',root),'utf8'));
const cards=Object.fromEntries(Object.entries(BASE_CARDS).filter(([id])=>!STARTERS.includes(id)));
const notes=JSON.parse(JSON.stringify(BASE_FLAVOR));
Object.assign(notes,supplement.notes);
const starterNames=supplement.starterNames;
const sourceFor=(term)=>questions.find(q=>q.conceptIds.includes(term.id))?.sources[0]?.url || chapters.find(c=>c.id===term.chapterId)?.lessons.find(l=>l.conceptIds.includes(term.id))?.sources[0]?.url;
for(const term of [...terms.map(t=>({...t,source:sourceFor(t)})),...supplement.terms]){
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
const data={schema:1,starterNames,cards,notes,quizzes,counts:{publishedTerms:terms.length,additionalTerms:supplement.terms.length,publishedQuestions:questions.length,skippedQuestions:skipped},sourceRefs:['src/content/index.ts','src/content/starter.ts','knowledge/game-supplement.json']};
const pack={...data,version:createHash('sha256').update(JSON.stringify(data)).digest('hex').slice(0,16)};validateCatalog(pack);
const output=JSON.stringify(pack,null,2)+'\n';
const path=new URL('public/tower/learning-catalog.json',root);
if(process.argv.includes('--check')){if(await readFile(path,'utf8')!==output)throw Error('pnpm game:export が必要です');}else await writeFile(path,output);
console.log(`Game catalog ${pack.version}: ${Object.keys(cards).length+3} cards, ${Object.keys(quizzes).length} quizzes (${skipped} multiple-answer/exam questions deferred)`);
