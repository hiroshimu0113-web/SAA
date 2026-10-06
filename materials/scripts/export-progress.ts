import {readFile,writeFile} from 'node:fs/promises';
import {chapters as published,questions as released} from '../src/content';
import {chapters1,questions1} from '../src/content/part1';
import {chapters2,questions2} from '../src/content/part2';
const root=new URL('../',import.meta.url);
const read=(p:string)=>readFile(new URL(p,root),'utf8');
const chapters=[...chapters1,...chapters2],questions=[...questions1,...questions2];
const units=JSON.parse(await read('knowledge/units.json')).units as {id:string;lesson_ids:string[];review:{status:string}}[];
const items=JSON.parse(await read('knowledge/game-classifications.json')).items as {kind:string;import_status:string}[];
const lessonIds=new Set(published.flatMap(c=>c.lessons.map(l=>l.id))),questionIds=new Set(released.map(q=>q.id));
const practice=questions.filter(q=>!q.exam),publishedPractice=practice.filter(q=>questionIds.has(q.id));
const reviewed=units.filter(u=>u.review.status==='reviewed').length;
let md=`# 教材制作の進捗表

既存の教材データから生成した制作状況です。原稿の存在、内容確認、公開、ゲームへの利用を別々に管理します。学習者本人の理解度や試験範囲の完成率ではありません。

[教材の保管先と更新手順](CONTENT_LIBRARY.md) · [詳しい棚卸し](../knowledge/INVENTORY.md) · [今後の拡充順](../knowledge/EXPANSION_PLAN.md)

## 全体の状況

| 対象 | 保管済み | 公開または確認状況 |
|---|---:|---|
| 章 | ${chapters.length}章 | ${published.length}章を公開 |
| テキスト | ${chapters.flatMap(c=>c.lessons).length}レッスン | ${lessonIds.size}レッスンを公開 |
| 通常問題 | ${practice.length}問 | ${publishedPractice.length}問を公開、残り${practice.length-publishedPractice.length}問は原稿 |
| 模試1 | ${questions.filter(q=>q.exam==='mock1').length}問 / 計画65問 | ${released.filter(q=>q.exam==='mock1').length}問を公開 |
| 模試2 | ${questions.filter(q=>q.exam==='mock2').length}問 / 計画65問 | ${released.filter(q=>q.exam==='mock2').length}問を公開 |
| 細分化した知識単位 | ${units.length}単位 | 確認済み${reviewed}、確認待ち${units.length-reviewed} |
| ゲーム利用の分類 | ${items.length}件 | 取り込み済み${items.filter(i=>i.import_status==='imported').length}件（教材全体の分類完了ではない） |

公開範囲の確認記録は[先行版の確認記録](STARTER_REVIEW.md)、全体の未解決事項は[内容レビュー](CONTENT_REVIEW.md)を参照してください。公開数から全体の内容監査完了を推定しません。

## 章別の状況

「原稿」は公開分も含む保管総数です。公開の有無は配信設定に基づき、内容確認の完了判定ではありません。

| 章 | テキスト原稿 | テキスト公開 | 問題原稿 | 問題公開 | 配信状況 |
|---|---:|---:|---:|---:|---|
`;
for(const c of chapters){const qs=practice.filter(q=>q.chapterId===c.id),lp=c.lessons.filter(l=>lessonIds.has(l.id)).length,qp=qs.filter(q=>questionIds.has(q.id)).length;md+=`| ${c.id} ${c.title} | ${c.lessons.length} | ${lp} | ${qs.length} | ${qp} | ${lp||qp?'公開あり':'原稿保管・未公開'} |\n`;}
md+=`
## ゲーム利用の分類状況

| 分類 | 登録数 |
|---|---:|
`;
for(const [kind,label] of Object.entries({term:'用語',concept:'概念',system:'システム',combo:'役',build:'ビルド',case:'ケース'}))md+=`| ${label} | ${items.filter(i=>i.kind===kind).length} |\n`;
md+=`
分類0件は、その分野の教材本文が存在しないという意味ではありません。既存教材の一括分類は未実施です。

## 更新方法

教材追加・改訂・公開範囲変更・分類変更の後、materialsで pnpm progress:update を実行します。pnpm progress:check で元データとの一致を確認できます。この表は直接編集しません。

テキストと問題の保管数はsrc/content/part1.ts・part2.ts、公開数はsrc/content/index.ts、単位の確認状態はknowledge/units.json、分類数はknowledge/game-classifications.jsonから集計します。監査記録は自動で変更しません。
`;
const path='docs/CONTENT_PROGRESS.md';
if(process.argv.includes('--check')){if((await read(path)).replace(/\r\n/g,'\n')!==md)throw Error('進捗表が古くなっています。pnpm progress:update を実行してください。');}
else await writeFile(new URL(path,root),md);
console.log(`教材進捗: ${chapters.length}章 / ${practice.length}問 / 公開${publishedPractice.length}問 / 分類${items.length}件`);
