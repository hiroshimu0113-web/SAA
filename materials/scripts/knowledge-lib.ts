import assert from 'node:assert/strict';
export type Unit = {id:string;title:string;group:string;objective:string;estimated_minutes:number;scope:string;prerequisites:string[];misconceptions:string[];checks:{id:string;level:'explain'|'apply';prompt:string;expected_points:string[]}[];lesson_ids:string[];review:{status:string;basis:string;source_document:string;evidence?:{url:string;checked_on:string;claim:string;reviewer:string}[]};learner_state:string;next_enrichment:string[]};
export type Relation = {from:string;to:string;type:string;reason:string};
export function validateUnits(units: Unit[], relations: Relation[], lessons: Set<string>) {
  assert.ok(units.length>0,'empty units');
  const ids=new Set(units.map(u=>u.id));assert.equal(ids.size,units.length,'duplicate concept ID');
  const checks=new Set<string>();
  for (const u of units) {
    assert.match(u.id,/^[a-z][a-z0-9-]*$/);
    for(const text of [u.title,u.group,u.objective,u.scope,u.review.basis,u.review.source_document]) assert.ok(typeof text==='string'&&text.trim());
    assert.ok(Number.isFinite(u.estimated_minutes)&&u.estimated_minutes>0);
    assert.ok(['draft','reviewed'].includes(u.review.status));
    if(u.review.status==='reviewed'){assert.ok(u.review.evidence?.length,'review evidence required');for(const e of u.review.evidence!){assert.match(e.url,/^https:\/\//);assert.match(e.checked_on,/^\d{4}-\d{2}-\d{2}$/);assert.ok(e.claim.trim()&&e.reviewer.trim());}}
    assert.equal(u.learner_state,'unassessed','shared curriculum cannot claim learner mastery');
    assert.ok(u.misconceptions.length>0&&u.misconceptions.every(x=>typeof x==='string'&&x.length>0));
    assert.ok(u.next_enrichment.length>0&&u.next_enrichment.every(x=>typeof x==='string'&&x.length>0));
    assert.ok(u.lesson_ids.length>0&&u.lesson_ids.every(x=>lessons.has(x)),`unknown lesson: ${u.id}`);
    assert.equal(new Set(u.prerequisites).size,u.prerequisites.length,'duplicate prerequisite');
    for(const id of u.prerequisites) assert.ok(ids.has(id)&&id!==u.id,`invalid prerequisite: ${id}`);
    assert.ok(['explain','apply'].every(level=>u.checks.some(c=>c.level===level)),`missing explanation/application: ${u.id}`);
    for(const c of u.checks){assert.ok(!checks.has(c.id),'duplicate check ID');checks.add(c.id);assert.ok(c.prompt.trim());assert.ok(c.expected_points.length>=2&&c.expected_points.every(x=>x.trim()));}
  }
  const visited=new Set<string>(),active=new Set<string>();
  function visit(id:string){assert.ok(!active.has(id),'prerequisite cycle');if(visited.has(id))return;active.add(id);for(const p of units.find(u=>u.id===id)!.prerequisites)visit(p);active.delete(id);visited.add(id);}
  for(const id of ids)visit(id);
  const edges=new Set<string>();
  for(const r of relations){assert.ok(ids.has(r.from)&&ids.has(r.to)&&r.from!==r.to,'dangling relation');assert.ok(['contrast_with','used_with'].includes(r.type));assert.ok(r.reason.trim());const key=[r.type,...[r.from,r.to].sort()].join(':');assert.ok(!edges.has(key),'duplicate relation');edges.add(key);}
}
export function validateGraph(graph:{nodes:{id:string}[];edges:{from:string;to:string;type:string}[]}){
  const ids=new Set(graph.nodes.map(n=>n.id));assert.equal(ids.size,graph.nodes.length,'duplicate graph ID');
  const seen=new Set<string>();for(const edge of graph.edges){assert.ok(ids.has(edge.from)&&ids.has(edge.to),'dangling graph edge');const key=JSON.stringify(edge);assert.ok(!seen.has(key),'duplicate graph edge');seen.add(key);}
}
