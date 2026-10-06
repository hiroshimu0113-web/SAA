import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const read=async(p:string)=>JSON.parse(await readFile(new URL(p,root),'utf8'));
const graph=await read('public/knowledge/graph.json'),plan=await read('knowledge/deck-plan.json'),ledger=await read('knowledge/game-classifications.json');
assert.equal(plan.schema_version,1);assert.equal(plan.target_cards_per_deck,20);
const chapters=graph.nodes.filter((n:any)=>n.kind==='chapter');
assert.equal(plan.decks.length,12);assert.equal(new Set(plan.decks.map((d:any)=>d.chapter_id)).size,12);
for(const d of plan.decks)assert.ok(chapters.some((c:any)=>c.id==='chapter:'+d.chapter_id)&&d.theme&&d.decision&&d.tradeoff);
const owner=new Map<string,string>();
for(const e of graph.edges.filter((e:any)=>e.type==='contains'))owner.set(e.to,e.from.slice(8));
const concepts=graph.nodes.filter((n:any)=>n.kind==='concept');
for(const s of plan.shared_concepts){assert.ok(concepts.some((c:any)=>c.id==='concept:'+s.concept_id)&&s.reason);for(const id of s.chapter_ids)assert.ok(plan.decks.some((d:any)=>d.chapter_id===id));}
const cards=concepts.map((c:any)=>{
 const id=c.id.slice(8),refs=graph.edges.filter((e:any)=>e.from===c.id&&['covered_by','unit_reference','practised_by'].includes(e.type));
 const chapterIds=new Set<string>(refs.map((e:any)=>owner.get(e.to)).filter(Boolean));
 for(const link of plan.shared_concepts.filter((s:any)=>s.concept_id===id))for(const ch of link.chapter_ids)chapterIds.add(ch);
 assert.ok(chapterIds.size,'unassigned concept');
 const classifications=ledger.items.filter((i:any)=>i.unit_ids.includes(id)&&i.game_targets.includes('card')&&i.kind!=='case');
 const reviewed=classifications.some((i:any)=>i.classification_status==='reviewed'&&i.content_status==='reviewed');
 return {id:'candidate-'+id,concept_id:id,title:c.title,related_chapter_ids:[...chapterIds].sort(),material_refs:refs.map((e:any)=>({node_id:e.to,relation:e.type})),classification_ids:classifications.map((i:any)=>i.id),candidate_status:reviewed?'reviewed_material':'inventory_seed',content_status:c.unit?.review.status??'unreviewed',effect_status:'not_designed',implementation_ids:[],open_questions:reviewed?['実務の条件と限界を保つカード効果・役・ビルドを設計し検証する。']:['原稿の目標・条件・例外を内容確認して分類する。','概念IDの表記揺れや複合概念を確認してからカード化の可否を決める。']};
});
assert.equal(new Set(cards.map((c:any)=>c.id)).size,cards.length);
const decks=plan.decks.map((d:any)=>({...d,title:chapters.find((c:any)=>c.id==='chapter:'+d.chapter_id).title,target_cards:plan.target_cards_per_deck,card_candidate_ids:cards.filter((c:any)=>c.related_chapter_ids.includes(d.chapter_id)).map((c:any)=>c.id)}));
const result={schema_version:1,notes:['素材候補は完成カードではない。inventory_seedは既存の未監査タグを棚卸しした段階。','同じ概念は1候補を共有し、関連章を記録する。言い換えや薄い分割で20枚へ合わせない。','新カードはすべて効果未設計。現行20カードとは別の候補集合で、選択画面と新キャラクターは未実装。'],decks,cards,separate_proposals:plan.separate_proposals};
let md='# 12章のテーマ別デッキ候補（自動生成）\n\n正本はdeck-plan.jsonと既存教材・知識グラフ・分類台帳。候補素材を共有し、完成カード数と区別します。各章20枚以上は目標で、未監査タグの棚卸しだけで達成としません。\n\n| 章 | テーマ | 素材候補 | 確認・分類済み素材 | 効果実装済み | 20枚目標の不足（確認済み基準） |\n|---|---|---:|---:|---:|---:|\n';
for(const d of decks){const subset=cards.filter((c:any)=>d.card_candidate_ids.includes(c.id)),n=subset.filter((c:any)=>c.candidate_status==='reviewed_material').length;md+=`| ${d.chapter_id} | ${d.theme} | ${subset.length} | ${n} | 0 | ${Math.max(0,20-n)} |\n`;}
md+=`\n重複しない候補素材：${cards.length}。確認・分類済み：${cards.filter((c:any)=>c.candidate_status==='reviewed_material').length}。現行ゲームは別集合の20カード・3役です。候補は全て効果未設計で、その20枚を本表へ自動的に重ねません。章をまたぐ件数は合計してユニーク候補数としません。\n\n## テーマごとの判断と代償\n\n`;
for(const d of decks)md+=`- ${d.chapter_id}：${d.decision} ${d.tradeoff}\n`;
md+='\n## 共有と未完了\n\n';for(const s of plan.shared_concepts)md+=`- ${s.concept_id}：${s.chapter_ids.join(', ')}。${s.reason}\n`;
md+='\n- 名称だけでカード化や内容確認を確定しない。候補JSONに参照・状態・未解決事項を保持する。\n- まず前回の未完了である残り12単位の確認、役に対応する実システムの分類を進める。AWS現行資料が必要な内容は取得制約も記録する。\n';
for(const p of plan.separate_proposals)md+='- '+p+'\n';
md+='\n更新：pnpm decks:update。照合：pnpm decks:check。知識正本変更後は先にknowledge:export、分類変更後はdecks:updateとprogress:updateを実行する。\n';
for(const [path,text] of [['knowledge/deck-candidates.json',JSON.stringify(result,null,2)+'\n'],['knowledge/DECK_CANDIDATES.md',md]]){
 const file=new URL(path,root);if(process.argv.includes('--check'))assert.equal(await readFile(file,'utf8'),text,'stale deck candidates: '+path);else await writeFile(file,text);
}
console.log(`Decks: ${decks.length}; unique inventory candidates: ${cards.length}; reviewed material: ${cards.filter((c:any)=>c.candidate_status==='reviewed_material').length}; new implemented cards: 0`);
