# 教材の保管先と更新手順

教材はこのリポジトリのmaterialsに蓄積します。既存のテキスト・問題・知識単位を正本として育て、Gitの履歴で変更を残します。別の場所へ同じ本文を複製して管理する必要はありません。

現在どこまで作成・公開しているかは、[教材制作の進捗表](CONTENT_PROGRESS.md)で確認できます。

## 何をどこに保管するか

| 資料 | 保管先 | 扱い |
|---|---|---|
| テキストと問題の全体原稿 | [part1.ts](../src/content/part1.ts)・[part2.ts](../src/content/part2.ts) | 未公開原稿も削除せず保持する |
| 公開版の範囲と補足 | [index.ts](../src/content/index.ts)・[starter.ts](../src/content/starter.ts) | 現在の配信設定。公開版の補足も確認してから改訂する |
| 章別レビュー補填と独自模試 | [readiness](../src/content/readiness/) | 12章の追加本文・25問・模試65問×2・用語・確認問答。part1/part2から取り込む |
| 細分化した知識と確認問題 | [units.json](../knowledge/units.json) | 1単位1目標で蓄積し、確認待ちと確認済みを区別する |
| 知識同士の関係 | [relations.json](../knowledge/relations.json) | 前提・比較・組み合わせを記録する |
| カード等へ再利用する分類 | [game-classifications.json](../knowledge/game-classifications.json) | 用語・概念・システム・役・ビルド・ケースを記録し、本文の保管先へ参照をつなぐ |
| 出典と内容確認 | 教材のsources、単位のreview、[CONTENT_REVIEW.md](CONTENT_REVIEW.md)、[STARTER_REVIEW.md](STARTER_REVIEW.md) | 対象範囲・根拠・確認者を残す。過去の確認を新原稿へ流用しない |
| 元の配布物 | [deliverables](../deliverables/) | 元ZIP・EPUB等を保管。通常の改訂では上書きしない |
| 音声台本と公開音声 | [audio](../audio/)・[public/audio](../public/audio/) | 現時点の成果物を保持。今回の教材拡充とは別に管理する |
| 制作の記録 | [CHECKPOINT.md](CHECKPOINT.md)・[TASKS.md](TASKS.md) | 完了・未完了・検証結果・次の着手点を残す |

public/knowledge/graph.jsonやknowledge/INVENTORY.mdは生成物です。正本を更新して再生成し、直接編集しません。配布物は書き出した時点の版なので、最新内容は正本と進捗表を確認します。

## 今後の蓄積ルール

1. AGENTS.mdと[分類ガイド](CONTENT_CLASSIFICATION_GUIDE.md)を読み、[進捗表](CONTENT_PROGRESS.md)・[棚卸し](../knowledge/INVENTORY.md)で重複を確認する。
2. 作るテキスト・問題・知識単位へ安定したIDを付け、上記の正本へ保存する。出典のURLだけでなく、支える主張と確認記録を残す。調査メモや不足は分類台帳のopen_questions等へ記録する。
3. 新規内容は確認待ちとして扱い、分類・内容確認・公開・ゲーム取り込みを別々に進める。既存の公開設定を暗黙に広げない。
4. 変更対象に応じた検証を行い、知識データを変えた場合はknowledge:exportとknowledge:checkを実行する。
5. `pnpm progress:update`と`pnpm progress:check`で進捗表を更新し、CHECKPOINTとTASKSに作業を記録する。GitHubにも保存したか、ローカルのみかを報告する。

次回の教材拡充は[EXPANSION_PLAN.md](../knowledge/EXPANSION_PLAN.md)に従い、まず既存14単位の確認や先行2章の細分化から進めます。新しい原稿を増やす作業と、既存原稿を公開できる品質へ整える作業を分けて計画します。

## ゲームへの反映

公開済み教材はテスト/ビルド時にカード・クイズへ変換し、ゲーム画面の更新ボタンで取得できる。[連携仕様と教材担当の手順](GAME_CONTENT_UPDATE.md)を参照。独立HTMLは構造化補足の登録が必要。未公開原稿は取り込まない。

今回のレビュー対応は [SAA_REVISION_LOG.md](SAA_REVISION_LOG.md)、提供された報告書は [SAA_READINESS_REVIEW.md](SAA_READINESS_REVIEW.md)。報告書は改訂前の評価として保存する。

再レビュー [SAA_REREVIEW.md](SAA_REREVIEW.md) への対応：[SAA_REREVIEW_RESPONSE.md](SAA_REREVIEW_RESPONSE.md)。追加本文・通常問・独立セットは [src/content/rereview](../src/content/rereview/) に保管し、part1/part2から公開へ統合。詳細スキルは [SAA_DETAIL_SKILLS.md](SAA_DETAIL_SKILLS.md)。

## FRレビュー対応記録

- [SAA_FR_RESPONSE.md](SAA_FR_RESPONSE.md)：FR-001/002の対応表、検証・公開記録。
- [SAA_FR_OPTION_AUDIT.md](SAA_FR_OPTION_AUDIT.md)：独立65問267候補とm1/m2-065の候補点検。作成者確認であり独立監査ではない。正答を含む。

- [SAA_GR_RESPONSE.md](SAA_GR_RESPONSE.md)：assessment-007の条件明記（GR-001）の対応・検証・公開記録。

## ゲーム内学習室の教材・対応記録

- 正本：[ゲーム設計演習26問](../knowledge/game-design-questions.json)。通常教材と合わせ、学習室用カタログへ生成。
- [レビュー対応表](SAA_GAME_READINESS_RESPONSE.md)、[詳細スキル・候補点検](SAA_GAME_SKILL_MAP.md)、[更新後全件索引](SAA_GAME_QUESTION_INVENTORY_UPDATED.md)。独立監査・本人理解度とは区別する。

役の追加効果設計資料： [HTML](../public/design/role-effects.html) / [構造化JSON](../public/design/role-effects.json)。2/3/4枚ごとに20案・計60案。公開先は `/SAA/design/role-effects.html`、設計段階でゲーム未実装。

- [ゲーム内問題・受入レビュー対応表](SAA_GAME_READINESS_RESPONSE_REVIEW_RESPONSE.md)：GQR-001/002、練習終了とバックアップの結果・履歴整合性修正（2026-10-08）。

- [クイズ一巡出題の変更記録](GAME_QUIZ_CYCLE_CHANGE.md)：250問の出題フラグ・冒険間継続・全問後のリセット（2026-10-08）。

キャラ・ビルド相談資料：[単一HTML](../public/design/character-builds.html)。ビルド59案・複合16案・現行3キャラと割り振り案。設計段階の提案でゲーム未実装、SAA学習教材の追加ではない。公開先 `/SAA/design/character-builds.html`。

役のジャンル/別軸の組み合わせ相談： [HTML](../public/design/role-combinations.html) / [JSON](../public/design/role-combinations.json)。重複のない2〜4枚パターンとレア度等12軸を比較。ゲーム未実装の設計資料。

AWS構築手法からビルドへの調査設計：[単一HTML](../public/design/aws-builds.html)。正本はknowledge/game-supplement.jsonのarchitectureBuildResearch、生成はscripts/export-aws-build-design.py。18構築ビルド・8ケース16問・29公式出典・評価原理とキャラ設計。27分類はdraft/candidate、ゲーム未取り込み。

- [クイズの正解済みフラグ](GAME_QUIZ_CORRECT_CYCLE_CHANGE.md)：誤答を正解まで再出題し、全問正解で一巡する仕様と移行記録（2026-10-09）。

## 6キャラ・18ビルドとカード候補の仕分け（2026-10-09）
- public/design/card-build-allocation.html / JSON。公開教材165用語＋補足3用語の全168候補。所属151候補・重複込み215接続、未所属17候補へremainder-ID。中核・補助・条件付きで分類。
- 正本game-supplement.json characterCardAllocation、生成scripts/export-card-build-allocation.py。分類concept-character-card-build-allocationはdraft/candidate。IaCの中核候補不足を明記。ゲームカード30種類・性能・キャラ・保存は変更なし。
- 次：未所属の用途、各専用スターター、実効果・最終プール・排出率を検討。ローカル検証とGitHub同期・公開確認は後記。


## カード仕分けを役割×用途の2軸へ更新（2026-10-09）
- 同じHTML/JSONを更新。役割＝中核／強化・安定化／別構成への橋渡し、用途＝幅広く使える／特定条件で使える。215所属ごとに適用条件を表示し、旧条件付きは役割へ個別再分類。
- 全168候補・151所属候補・未所属17件・candidate/remainder-IDとビルド所属は維持。中核でも条件向けになり得ること、条件向け＝不要ではないことを説明。
- 分類concept-character-card-build-allocationはdraft/candidateのまま。ゲーム効果・排出率・保存は変更なし。検証・公開結果は後記。

- カード仕分け表記変更（2026-10-09）：役割＝キー／オプション／コネクション、分類＝汎用／特化。分類の意味・215所属・168候補・追跡IDを維持。既存分類concept-character-card-build-allocationはdraft/candidate。公開確認は後記。


## ビルド不足教材のAWS公式調査と拡充（2026-10-09）
- 12用語：IaC、CloudFormation、変更セット、ドリフト検出、サーキットブレーカー、指数バックオフ、ジッター、リクエストタイムアウト、チェックポイント、ElastiCache、AWS Backup、CloudWatchアラーム。既存本文の言及と用語未登録を区別。
- 正本knowledge/build-gap-expansion.jsonとunits/relations、src/content/build-gap-expansion.tsで既存6レッスンへ適用例・境界・公式出典を追加。知識単位12件（計26）、説明/適用確認24件。元168候補・未所属17IDを維持し、180候補・235所属へ拡充。IaCキー不足解消。
- 分類term-build-gap-* 12件はdraft/candidate、公式自己照合、独立監査・本人理解・ゲーム効果実装は未実施。教材語彙追加はゲーム通常カードの自動追加を意味しない。検証/公開は後記。
