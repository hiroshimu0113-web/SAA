# 教材の保管先と更新手順

教材はこのリポジトリのmaterialsに蓄積します。既存のテキスト・問題・知識単位を正本として育て、Gitの履歴で変更を残します。別の場所へ同じ本文を複製して管理する必要はありません。

現在どこまで作成・公開しているかは、[教材制作の進捗表](CONTENT_PROGRESS.md)で確認できます。

## 何をどこに保管するか

| 資料 | 保管先 | 扱い |
|---|---|---|
| テキストと問題の全体原稿 | [part1.ts](../src/content/part1.ts)・[part2.ts](../src/content/part2.ts) | 未公開原稿も削除せず保持する |
| 先行公開版の範囲と補足 | [index.ts](../src/content/index.ts)・[starter.ts](../src/content/starter.ts) | 現在の配信設定。公開版の補足も確認してから改訂する |
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
