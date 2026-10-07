import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { chapters as publishedChapters, questions as publishedQuestions, terms } from '../src/content';
import { chapters1, questions1 } from '../src/content/part1';
import { chapters2, questions2 } from '../src/content/part2';
import { missions } from '../src/game';
import { validateUnits, validateGraph, type Unit, type Relation } from './knowledge-lib';

const root=new URL('../',import.meta.url);
const read=(path:string)=>readFile(new URL(path,root),'utf8');
const save=async(path:string,text:string)=>{if(process.argv.includes('--check')){if((await read(path)).replace(/\r\n/g,'\n')!==text)throw new Error('Stale generated file: '+path);}else await writeFile(new URL(path,root),text);};
const document=JSON.parse(await read('knowledge/units.json'));
assert.equal(document.schema_version,1,'Unsupported units schema version');
const units:Unit[]=document.units;
const relations:Relation[]=JSON.parse(await read('knowledge/relations.json'));
const chapters=[...chapters1,...chapters2].map(c=>publishedChapters.find(p=>p.id===c.id)??c);
const questions=[...questions1,...questions2];
const lessons=chapters.flatMap(c=>c.lessons);
validateUnits(units,relations,new Set(lessons.map(l=>l.id)));
for(const unit of units)await read(unit.review.source_document);
const publishedLessons=new Set(publishedChapters.flatMap(c=>c.lessons.map(l=>l.id)));
const publishedQuestionIds=new Set(publishedQuestions.map(q=>q.id));
const nodes:any[]=[];const edges:{from:string;to:string;type:string}[]=[];
const edge=(from:string,to:string,type:string)=>edges.push({from,to,type});
const allConcepts=[...new Set([...lessons.flatMap(l=>l.conceptIds),...questions.flatMap(q=>q.conceptIds),...units.map(u=>u.id)])].sort();
for(const id of allConcepts){const unit=units.find(u=>u.id===id);nodes.push({id:'concept:'+id,kind:'concept',title:unit?.title??terms.find(t=>t.id===id)?.name??id,detail_status:unit?'draft_unit':'inventory_only',unit:unit??null});}
for(const chapter of chapters){
  const path='src/content/'+(Number(chapter.id.slice(2))<=6?'part1.ts':'part2.ts');
  nodes.push({id:'chapter:'+chapter.id,kind:'chapter',title:chapter.title,source_file:path});
  for(const lesson of chapter.lessons){
    nodes.push({id:'lesson:'+lesson.id,kind:'lesson',title:lesson.title,release:publishedLessons.has(lesson.id)?'published':'draft',source_file:publishedLessons.has(lesson.id)?'src/content/index.ts':path,original_source_file:Number(lesson.id.split('-l')[1])>=4?`src/content/readiness/${chapter.id}.ts`:path,sources:lesson.sources});
    edge('chapter:'+chapter.id,'lesson:'+lesson.id,'contains');
    for(const id of new Set(lesson.conceptIds))edge('concept:'+id,'lesson:'+lesson.id,'covered_by');
  }
}
for(const q of questions){nodes.push({id:'question:'+q.id,kind:'question',title:q.prompt,release:publishedQuestionIds.has(q.id)?'published':'draft',chapter_id:q.chapterId,sources:q.sources});edge('chapter:'+q.chapterId,'question:'+q.id,'contains');for(const id of new Set(q.conceptIds))edge('concept:'+id,'question:'+q.id,'practised_by');}
for(const unit of units){for(const prereq of unit.prerequisites)edge('concept:'+prereq,'concept:'+unit.id,'learn_before');for(const id of unit.lesson_ids)edge('concept:'+unit.id,'lesson:'+id,'unit_reference');}
for(const r of relations)edge('concept:'+r.from,'concept:'+r.to,r.type);
nodes.push({id:'audio:sample-01',kind:'audio',title:'写真工房で覚える、EC2・S3・IAMロール',release:'published',url:'../audio/index.html',source_file:'audio/sample-01.json'});
for(const id of ['ec2','s3','instance-store','durability','iam-role','temporary-credentials','least-privilege'])edge('concept:'+id,'audio:sample-01','reinforced_by');
const missionConcepts=[['ec2','s3','instance-store','iam-role','least-privilege'],['ec2','s3','az','availability','alb','iam-role'],['s3','iam-role','authentication','authorization','mfa','least-privilege']];
missions.forEach((m,i)=>{const id='mission:'+String(i+1).padStart(2,'0');nodes.push({id,kind:'mission',title:m.title,release:'prototype',source_file:'src/game.ts'});for(const concept of missionConcepts[i])edge('concept:'+concept,id,'applied_in');});
const graph={schema_version:1,notes:['学習順序は教材設計上の提案で、AWSサービスの必須依存関係ではない。','既存source.checkedは転記であり、本グラフで再照合した証拠ではない。','教材の公開状態、単位の監査状態、個人の理解度を別に扱う。','グラフの線や確認問題の存在だけで習得済みとは判定しない。'],counts:{chapters:chapters.length,lessons:lessons.length,questions:questions.length,published_lessons:publishedLessons.size,published_questions:publishedQuestionIds.size,concepts:allConcepts.length,detailed_units:units.length,rubric_checks:units.reduce((n,u)=>n+u.checks.length,0)},nodes,edges};
validateGraph(graph);
await mkdir(new URL('public/knowledge/',root),{recursive:true});
await save('public/knowledge/graph.json',JSON.stringify(graph,null,2)+'\n');
const gaps:Record<string,string[]>= {ch01:['CR-001'],ch02:['CR-001','CR-004'],ch03:['CR-003'],ch04:[],ch05:['CR-002'],ch06:['CR-002'],ch07:['CR-003','CR-009'],ch08:['CR-008','CR-009'],ch09:['CR-009'],ch10:['CR-005','CR-006','CR-009'],ch11:['CR-006','CR-007','CR-009'],ch12:['CR-002','CR-003','CR-007','CR-009']};
let markdown='# 教材の棚卸し（自動生成）\n\n`pnpm exec tsx scripts/export-knowledge.ts` で更新。教材数は内容監査や理解度を意味しません。既存原稿の概念タグも未監査を含みます。\n\n| 章 | レッスン（公開 / 全体） | 問題（公開 / 全体） | 関連する詳細単位 | 既存監査の関連指摘（改訂履歴参照） |\n|---|---:|---:|---|---|\n';
for(const c of chapters){const qs=questions.filter(q=>q.chapterId===c.id);const ids=c.lessons.map(l=>l.id);markdown+=`| ${c.id} ${c.title} | ${ids.filter(id=>publishedLessons.has(id)).length} / ${ids.length} | ${qs.filter(q=>publishedQuestionIds.has(q.id)).length} / ${qs.length} | ${units.filter(u=>u.lesson_ids.some(id=>ids.includes(id))).map(u=>u.id).join(', ')||'未細分化'} | ${(gaps[c.id]??[]).join(', ')||'個別指摘なし（監査済みとは限らない）'} |\n`;}
markdown+='\n指摘本文は [CONTENT_REVIEW.md](../docs/CONTENT_REVIEW.md)。章別の補強と自己照合は [SAA_REVISION_LOG.md](../docs/SAA_REVISION_LOG.md) に記録。独立した全体監査は未実施。詳細単位のない概念は `inventory_only` として保持しています。\n';
markdown+='\n## レッスンタグとの対応を要確認の概念ID\n\n以下は問題・細分化単位にあるが、既存レッスンのconceptIdsにはないIDです。本文中に説明がないという断定ではありません。自動統合せず対応を確認してください。\n\n';
for(const id of allConcepts.filter(id=>!lessons.some(l=>l.conceptIds.includes(id))))markdown+=`- ${id}: ${questions.filter(q=>q.conceptIds.includes(id)).map(q=>q.id).join(', ')||'今回追加した判断単位'}\n`;
await save('knowledge/INVENTORY.md',markdown);
console.log(JSON.stringify({...graph.counts,nodes:nodes.length,edges:edges.length}));
