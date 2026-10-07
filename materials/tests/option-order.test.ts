import {test} from 'node:test';
import assert from 'node:assert/strict';
import {orderedOptions} from '../src/option-order';
import {questions1} from '../src/content/part1';
import {questions2} from '../src/content/part2';
import {isCorrect} from '../src/learning';
test('表示順変更はID・採点・原本を保ち、同じ試験再開では同じ順になる',()=>{
 for(const q of [...questions1,...questions2]){
  const before=JSON.stringify(q);
  const a=orderedOptions(q,'1728000000');
  assert.deepEqual(a,orderedOptions(q,'1728000000'));
  assert.equal(JSON.stringify(q),before);
  assert.deepEqual(new Set(a.map(o=>o.id)),new Set(q.options.map(o=>o.id)));
  assert.ok(isCorrect(q,a.filter(o=>q.answers.includes(o.id)).map(o=>o.id)));
  assert.ok(!isCorrect(q,[a.find(o=>!q.answers.includes(o.id))!.id]));
 }
});
test('セッションを変えると複数の表示順になり正答の周期に従わない',()=>{
 const q=questions1[0];
 assert.ok(new Set(Array.from({length:20},(_,i)=>orderedOptions(q,String(i)).map(o=>o.id).join(''))).size>5);
 const qs=[...questions1,...questions2].filter(q=>/^q\d+$/.test(q.id)&&q.answers.length===1);
 const matches=qs.filter(q=>orderedOptions(q,'session').findIndex(o=>o.id===q.answers[0])===(4-Number(q.id.slice(1))%4)%4).length;
 assert.ok(matches<qs.length/2);
});
