import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const ledger=JSON.parse(await readFile(resolve(root,'knowledge/game-classifications.json'),'utf8'));
const units=new Set(JSON.parse(await readFile(resolve(root,'knowledge/units.json'),'utf8')).units.map(u=>u.id));
assert.equal(ledger.schema_version,1);
const ids=new Set(ledger.items.map(i=>i.id));assert.equal(ids.size,ledger.items.length,'duplicate classification ID');
const vocab={domains:['compute','networking','storage','database','security','observability','integration','operations','cost'],capabilities:['process','store','route','observe','protect','recover','scale','coordinate','optimize'],concerns:['availability','durability','performance','cost','security','operability'],game_targets:['glossary','card','combo','build','case','character'],character_families:['resilience','elasticity','data_acceleration','event_driven','access_control']};
const required={term:['definition','distinguish_from'],concept:['principle','applicable_when','counterexample','comparison'],system:['components','input','flow','output','dependencies','failure_behavior'],combo:['card_ids','real_world_relation','trigger','reward','repeat_limit','reset','system_refs','counterexample'],build:['goal','constraints','components','selection_reason','alternatives','tradeoffs','failure_behavior'],case:['premise','constraints','questions','variant']};
async function checkRefs(value){
 if(!value||typeof value!=='object')return;
 if(!Array.isArray(value)&&Object.hasOwn(value,'path')){
  assert.ok(typeof value.path==='string'&&typeof value.locator==='string'&&value.locator.trim());
  const p=resolve(root,value.path);assert.ok(p.startsWith(root.endsWith(sep)?root:root+sep),'reference escapes materials');assert.ok((await stat(p)).isFile(),'reference is not a file');
 }
 for(const child of Object.values(value))await checkRefs(child);
}
for(const i of ledger.items){
 assert.match(i.id,/^[a-z][a-z0-9-]*$/);assert.ok(required[i.kind],'unknown classification');
 for(const field of ['title','classification_reason','objective'])assert.ok(i[field]?.trim(),`missing ${field}`);
 assert.ok(i.unit_ids.every(id=>units.has(id)),'unknown unit');
 for(const [key,values] of Object.entries(vocab)){assert.ok(Array.isArray(i[key])&&i[key].every(v=>values.includes(v)),`invalid ${key}`);assert.equal(new Set(i[key]).size,i[key].length);}
 assert.ok(i.domains.length&&i.game_targets.length);
 for(const key of ['prerequisites','conditions','limitations','misconceptions','open_questions'])assert.ok(Array.isArray(i[key])&&i[key].every(v=>typeof v==='string'&&v.trim()));
 for(const key of required[i.kind])assert.ok(Object.hasOwn(i.content,key),`missing ${i.id}.${key}`);
 assert.ok(['draft','reviewed'].includes(i.classification_status));assert.ok(['draft','reviewed','needs_revision'].includes(i.content_status));assert.ok(['candidate','ready','imported','deferred'].includes(i.import_status));
 for(const r of i.relations){assert.ok(ids.has(r.target_id)&&r.target_id!==i.id&&r.reason?.trim());assert.ok(['prerequisite_for','part_of','used_in','assessed_by','alternative_to'].includes(r.type));}
 for(const [state,scope] of [['classification_status','classification'],['content_status','content']])if(i[state]==='reviewed')assert.ok(i.review_notes.some(n=>n.scope===scope&&n.reviewer&&n.checked_on&&n.summary),`missing ${scope} review`);
 if(i.content_status==='reviewed')assert.ok(i.sources.length&&i.sources.every(s=>/^https:\/\//.test(s.url)&&s.claim&&s.checked_on&&s.reviewer),'missing checked sources');
 if(['ready','imported'].includes(i.import_status))assert.ok(i.classification_status==='reviewed'&&i.content_status==='reviewed');
 if(i.import_status==='imported')assert.ok(i.game_design.implementation_refs.length&&i.review_notes.some(n=>n.scope==='game'&&n.summary),'missing game verification');
 await checkRefs(i);
}
console.log(`Classifications: ${ledger.items.length}; IDs, vocabulary, kinds, unit/file/relation references and review/import evidence valid (not an AWS content audit).`);
