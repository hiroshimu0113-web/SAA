import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {runtimeQuestion} from './game-content-lib.mjs';
const root=new URL('../',import.meta.url);
const source=JSON.parse(await readFile(new URL('knowledge/game-cases.json',root),'utf8'));
const classifications=JSON.parse(await readFile(new URL('knowledge/game-classifications.json',root),'utf8')).items;
assert.equal(source.schema_version,1);
const quizzes={},pairs=[],ids=new Set();
for(const c of source.cases){
 assert.ok(!ids.has(c.id),'duplicate case ID');ids.add(c.id);
 assert.ok(c.premise?.trim()&&c.constraints.length&&c.variant?.condition&&c.variant?.answer&&c.variant?.reason);
 assert.equal(c.questions.length,2,'a case needs two questions');
 assert.ok(['unpublished','published'].includes(c.release?.status),'case publication status required');
 if(c.release.status==='published')assert.ok(c.release.deployment_ref&&c.release.checked_on,'publication verification required');
 assert.ok(['draft','reviewed'].includes(c.content_status));
 if(c.content_status!=='reviewed')continue;
 assert.ok(classifications.some(i=>i.kind==='case'&&i.classification_status==='reviewed'&&i.content_status==='reviewed'&&['ready','imported'].includes(i.import_status)&&i.material_refs.some(r=>r.path==='knowledge/game-cases.json'&&r.locator===c.id)),'case lacks reviewed and ready classification');
 assert.ok(c.sources.length&&c.review_notes.some(n=>n.scope==='content'&&n.checked_on&&n.reviewer));
 const pair=[];
 for(const q of c.questions){
  assert.match(q.id,/^[a-z][a-z0-9-]*$/);assert.ok(!Object.hasOwn(quizzes,q.id),'duplicate quiz ID');
  quizzes[q.id]=runtimeQuestion(c,q);pair.push(q.id);
 }
 pairs.push(pair);
}
const output='// Generated from knowledge/game-cases.json; do not edit.\nexport const CASE_QUIZZES='+JSON.stringify(quizzes,null,2)+';\nexport const QUIZ_CASE_PAIRS='+JSON.stringify(pairs,null,2)+';\n';
const path=new URL('public/tower/case-quizzes.mjs',root);
if(process.argv.includes('--check'))assert.equal(await readFile(path,'utf8'),output,'stale game case export');
else await writeFile(path,output);
console.log(`Game cases: ${pairs.length} reviewed cases / ${Object.keys(quizzes).length} questions`);
