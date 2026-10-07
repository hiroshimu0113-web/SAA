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
| 詳細単位の補足本文 | [lessons](../knowledge/lessons/) | units.jsonのIDから参照する正本。作成後の内容確認と本人理解を区別する |
| ゲーム用の連続2問ケース | [game-cases.json](../knowledge/game-cases.json) | 状況・条件・全誤答理由・条件変更を保管。確認済みだけgame-content:exportでゲーム用データへ生成。releaseでPages公開確認と配信参照を別管理する |
| カード等へ再利用する分類 | [game-classifications.json](../knowledge/game-classifications.json) | 用語・概念・システム・役・ビルド・ケースを記録し、本文の保管先へ参照をつなぐ |
| 12章のテーマ別デッキ計画 | [deck-plan.json](../knowledge/deck-plan.json) | 判断方針・代償・共有章・大きな追加の別提案。decks:updateで候補JSONとDECK_CANDIDATES.mdを生成する |
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

次回の教材拡充は[EXPANSION_PLAN.md](../knowledge/EXPANSION_PLAN.md)に従い、まずCHECKPOINTに残る確認待ち・取り込み待ちを優先し、公式根拠を取得できる不足範囲を細分化します。新しい原稿を増やす作業と、既存原稿を公開できる品質へ整える作業を分けて計画します。

## 今回詳述した共有教材

- [SQS再配信と業務更新の冪等性](../knowledge/lessons/idempotency.md)：第6/8/9章で共有。確定後・削除前の停止と10分間のトークン保証を扱う。
- [DLQの隔離と再投入](../knowledge/lessons/dlq.md)：第9/11章で共有。移動元・先・固定レート・送信元の適用条件を扱う。

両単位の原稿・内容確認・分類は完了。ケースの取り込み状態は分類台帳、公開状態はgame-cases.jsonのreleaseを参照。カード効果は設計待ち。

- [SG参照と新規接続の許可境界](../knowledge/lessons/security-group.md)：確認範囲と対象外を本文で明示。ケースは分類台帳へ対応し、公開状態は別管理。

- [NACLの方向別ルールとプロトコル指定](../knowledge/lessons/network-acl.md)：確認範囲と対象外を本文で明示。ケースは分類台帳へ対応し、公開状態は別管理。

- [ルートの最長プレフィックス一致](../knowledge/lessons/route.md)：確認範囲と対象外を本文で明示。ケースは分類台帳へ対応し、公開状態は別管理。

- [KMS鍵素材の更新と旧暗号文の復号](../knowledge/lessons/kms.md)：確認範囲と対象外を本文で明示。ケースは分類台帳へ対応し、公開状態は別管理。

- [シークレットの現在版と更新後の再取得](../knowledge/lessons/secrets-manager.md)：確認範囲と対象外を本文で明示。ケースは分類台帳へ対応し、公開状態は別管理。

- [EBSのスナップショット復元とAZ配置](../knowledge/lessons/ebs.md)：確認範囲と対象外を本文で明示。ケースは分類台帳へ対応し、公開状態は別管理。

- [EBSスナップショットの取得時点と未書込みデータ](../knowledge/lessons/ebs-snapshot.md)：確認範囲と対象外を本文で明示。ケースは分類台帳へ対応し、公開状態は別管理。

- [DMSの初期ロードと変更追従の開始](../knowledge/lessons/dms.md)：確認範囲と対象外を本文で明示。ケースは分類台帳へ対応し、公開状態は別管理。

- [CDCの開始位置とソース固有の再開条件](../knowledge/lessons/cdc.md)：確認範囲と対象外を本文で明示。ケースは分類台帳へ対応し、公開状態は別管理。

- [Athenaの結果再利用と最新性の判断](../knowledge/lessons/athena.md)：確認範囲と対象外を本文で明示。ケースは分類台帳へ対応し、公開状態は別管理。

- [Athenaの結果出力と取得経路の制御](../knowledge/lessons/athena-output-access.md)：確認・分類済みの構成本文。既存athena/least-privilegeを共有し、カード素材・詳細単位へ重複計上しない。ケース取り込み済み、公開未実施。

- [Auto Scalingの希望容量と最小・最大境界](../knowledge/lessons/auto-scaling.md)：確認範囲と対象外を本文で明示。ケースは分類台帳へ対応し、公開状態は別管理。

- [ターゲット追跡の目標指標と縮退の範囲](../knowledge/lessons/target-tracking.md)：確認範囲と対象外を本文で明示。ケースは分類台帳へ対応し、公開状態は別管理。

- [EFSの共有ファイルとマウントターゲット配置](../knowledge/lessons/efs.md)：確認範囲と対象外を本文で明示。ケースは分類台帳へ対応し、公開状態は別管理。

- [EFSアクセスポイントのユーザーとルート制御](../knowledge/lessons/efs-access-point.md)：確認・分類済みの構成本文。efs/least-privilegeを共有し、新カード素材・詳細単位へ重複計上しない。ケース取り込み済み、公開未実施。

- [Lambdaの同期・非同期呼出しと成功判定](../knowledge/lessons/lambda.md)：確認範囲と対象外を本文で明示。ケースは分類台帳へ対応し、公開状態は別管理。

- [Lambdaの同時実行上限と割当状態](../knowledge/lessons/lambda-concurrency.md)：確認範囲と対象外を本文で明示。ケースは分類台帳へ対応し、公開状態は別管理。

- [第6章RDS Multi-AZ](../knowledge/lessons/rds-multi-az.md)：確認範囲と対象外を本文で明示。ケースは分類台帳へ対応し、公開状態は別管理。
