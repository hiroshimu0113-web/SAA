import assert from 'node:assert/strict';
export function runtimeQuestion(c,q){
 assert.match(q.id,/^[a-z][a-z0-9-]*$/);
 for(const field of ['objective','prompt','rationale'])assert.ok(q[field]?.trim(),`missing ${field}`);
 assert.equal(q.options.length,3,'current game requires three choices');
 const byId=new Map(q.options.map(o=>[o.id,o]));assert.equal(byId.size,3,'duplicate option ID');
 for(const o of q.options)assert.ok(o.id&&o.text?.trim()&&o.explanation?.trim());
 assert.ok(byId.has(q.correct_option_id),'unknown correct option ID');
 assert.ok(Array.isArray(q.runtime_option_order)&&q.runtime_option_order.length===3&&new Set(q.runtime_option_order).size===3&&q.runtime_option_order.every(id=>byId.has(id)),'invalid runtime option order');
 assert.ok(q.source_urls?.length&&q.source_urls.every(url=>c.sources.some(s=>s.url===url&&s.checked_on&&s.claim&&s.reviewer)),'unreviewed source');
 const options=q.runtime_option_order.map(id=>byId.get(id));
 return {prompt:c.premise+' '+q.prompt,options:options.map(o=>o.text),answer:q.runtime_option_order.indexOf(q.correct_option_id),reasons:options.map(o=>o.explanation),source:q.source_urls[0]};
}
