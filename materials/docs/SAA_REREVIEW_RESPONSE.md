# SAA再レビュー対応記録

対応日：2026-10-08 JST。対象：[SAA_REREVIEW.md](SAA_REREVIEW.md)、着手時のmain `a85243f`。前回記録：[SAA_REVISION_LOG.md](SAA_REVISION_LOG.md)。元の報告書は評価時点の記録として変更しない。

## 対応結果

| 指摘 | 実施した変更 | 作成者の確認・残る確認 |
|---|---|---|
| NR-001 複数選択の限定条件 | m1-061は結果再利用・実行回数・共有方法を固定し、最新データを読む1回の走査範囲に限定。m1-035はKMS・秘密取得を確認済みとし、設定再現と業務再開の検証を問う | 各正答2つと全誤答を明示条件に照らして確認。正答IDは維持。独立した再監査は未実施 |
| NR-002 正しい説明と要件適合の混同 | m2-012は漏えい後の追加対応、m2-059は180日保持・最低条件確認後の総費用比較、m1-045は未測定のCPU負荷改善を問う。類似のm2-045も測定済み2設定のGB秒料金比較へ限定 | 一般に正しいが今回の目的を満たさない理由を明記。既に漏れた平文を暗号化で取り戻せるとは説明しない |
| NR-003 セットの独立性 | 既存2回を「条件変更演習1/2」へ改称。新規65問を「到達度確認（独立セット）」として追加。業務状況・候補・条件の組合せを新規作成 | 選択肢一式の再利用なしを構造検査。初回未読は自己申告として、既読不明・再回答と区別。測定上の独立性・本試験相当の難度は未検証 |
| NR-004 詳細スキルと補助本文 | RI/SP、停止/休止、RCU/WCU、費用管理の4本文に加え、保存量と自動拡張、GWLBと増減、DB形式と移行、流量制御の4本文を補足。通常10問・用語12件を追加 | [詳細スキル表](SAA_DETAIL_SKILLS.md)で分野4のSkills in 28項目へ学習先と確認課題を対応。全分野の全Knowledge ofの網羅は未監査 |
| NR-005 候補比較の質 | m1-047/052/055/065と関連するm2-047/055/065の候補・理由を改訂。DNSに画像を置く等の候補を、経路・キャッシュ・費用計算・障害範囲で比較する候補へ変更。独立セットでも複数条件の設計比較を追加 | 例：assessment-008はOACだけ/視聴者認可だけ/地域制限、-023は同期切替/非同期昇格/バックアップ、-028は待機費とRTOを比較。全問を高難度化したとは扱わない |

修正した既存13問：m1-035/045/047/052/055/061/065、m2-012/045/047/055/059/065。[正本](../src/content/readiness/mocks.ts)。採点キーと問題IDを維持しつつ、問題条件が変わった旧版回答を現行版の到達度へ再採点しない。

## 保存場所と章別の変更

| 章 | 今回の変更 |
|---|---|
| 1 | 独立セットでAZ障害後の残存容量を確認 |
| 2 | 独立セットで委任、組織統制、認証、タグ・境界の変更権限を確認 |
| 3 | 独立セットでNACL・私設経路・NATの費用/障害範囲を確認 |
| 4 | ch04-l05/l06/l07、nr04-01〜03。購入範囲、停止/休止、負荷分散・増減を追加 |
| 5 | ch05-l06、nr05-01。保存量・バッチ化・自動拡張・Requester Paysを追加 |
| 6 | ch06-l05/l06、nr06-01〜03。容量計算、形式・互換性・移行費を追加 |
| 7 | ch07-l05、nr07-01。流量制御・再試行・代替帯域を追加 |
| 8 | 独立セットでLambda実測、長時間コンテナ、下流能力、ワークフローを確認 |
| 9 | 独立セットで冪等性、部分バッチ、ファンアウト、滞留回復を確認 |
| 10 | 独立セットで鍵、秘密、証明書、監査証跡、HTTP防御を確認 |
| 11 | 独立セットでRTO/RPO、復元主体、設定再現、クォータ、保存世代を確認 |
| 12 | ch12-l06、nr12-01/02。Cost Explorer/Budgets/CURと配賦を追加 |

- 追加本文：[src/content/rereview/lessons.ts](../src/content/rereview/lessons.ts)。本文ごとに図・比較・確認問答・出典を収録。
- 追加通常問題：[questions.ts](../src/content/rereview/questions.ts)、追加用語：[terms.ts](../src/content/rereview/terms.ts)。
- 独立65問：[assessment.ts](../src/content/rereview/assessment.ts)、判断軸と復習先：[SAA_ASSESSMENT_BLUEPRINT.md](SAA_ASSESSMENT_BLUEPRINT.md)。この索引は解答内容に触れるため初回受験前は読まない。
- 記録と採点：[exams.ts](../src/exams.ts)、表示：[App.tsx](../src/App.tsx)、バックアップ互換：[storage.ts](../src/storage.ts)。

## 数量と成績の扱い

12章58レッスン、通常235問（複数選択14問）、条件変更演習65問×2、独立セット65問（複数選択7問）、計430問、公開用語165件。3セットとも130分、分野1/2/3/4＝20/17/15/13問。

開始時に未読の自己申告を取り、独立セットの初回だけ適用する。途中再開は同じ試行、別の開始は中断も含め再回答として扱う。前回の回答・版・開始回数・申告を履歴へ移し、初回結果を上書きしない。結果画面には4分野の正答数と復習先を表示する。

以前のversion 1バックアップはそのまま復元できる。改訂版識別情報のない試験記録は「旧版」とし、回答は保持するが現行得点・分野別得点を表示しない。解説は現行版であることを明示する。端末外の閲覧・記録削除を検知できず、未読や学力をシステムが保証するものではない。

## 公式資料との照合

無料公開のAWS公式資料を参照。追加本文内に用途別のリンクと確認日を保存した。主要な照合内容は次のとおり。

- [Athena結果再利用](https://docs.aws.amazon.com/athena/latest/ug/reusing-query-results.html)：再利用条件と鮮度を固定して、走査量削減の正答を限定。
- [KMSローテーション](https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html)：既存データ・データキーの再暗号化とは別。
- [RIスコープ](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/reserved-instances-scope.html)、[Savings Plans](https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html)：割引対象と容量予約を分離。
- [EC2休止](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Hibernate.html)：RAM保存、対応条件、停止状態でも残る保存費。
- [DynamoDB容量単位](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html)：項目サイズの切上げ、整合性・トランザクション倍率、操作別の違い。
- [Cost Explorer](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html)、[Budgets](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html)、[Data Exports](https://docs.aws.amazon.com/cur/latest/userguide/what-is-data-exports.html)：分析・予算通知・詳細明細の役割。
- [RDS自動拡張](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIOPS.Autoscaling.html)、[GWLB](https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/introduction.html)、[API流量制御](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html)：追加の詳細スキルを補足。

## 分類と監査状態

[分類台帳](../knowledge/game-classifications.json)に95件を追加し、既存13ケースを更新。

- `concept-rereview-ch04-l05/l06/l07`、`ch05-l06`、`ch06-l05/l06`、`ch07-l05`、`ch12-l06`：8概念。分類確認済み、内容はdraft、ゲームはcandidate。
- `term-rereview-*`：追加12用語。用語集へ公開、ゲームはcandidate。別担当が設定した通常カード30種類を維持し、追加用語を自動採用しない。
- `case-rereview-nr*`：通常10ケース。単一選択9件を既存変換へ反映、複数選択1件はdeferred。
- `case-rereview-assessment-001`〜`065`：独立セット65ケース。未読利用を保つためゲーム抽選から除外、deferred。
- `case-readiness-m1-*` / `m2-*`の該当13件：条件・理由・レビュー履歴を更新。draftを維持。

台帳は合計454件。分類・公開/変換・作成者確認は独立した内容監査と別であり、新規項目のcontent_statusをreviewedに引き上げていない。既存14知識単位の監査状態と本人理解度も変更していない。別担当のゲーム設計・操作・マップは変更せず、通常教材の既存自動変換によるカタログ更新のみ。

## 検証と公開

- 統合前105件、別担当のmain統合後は自動テスト108件成功。既存回帰に加え、独立セットの候補非共有、初回/既読/再回答、中断と再開、初回結果保持、旧版復元、破損履歴拒否を確認。
- TypeScript・配信用ビルド成功。バンドル容量のVite警告あり（JS約941kB、gzip約262kB）。構文・配信ビルドの失敗ではない。
- `knowledge:check`、`game:check`、`progress:check`成功。12章58本文430問と台帳・生成物が一致。
- Chromiumの390px幅で、本文リンク、5択複数選択、65問移動、表示順維持、130分期限と自動提出、4分野結果、独立セット初回/再回答履歴、旧版採点除外を確認。
- 既存のブラウザー検証で読了、回答解説、オフライン再読込、バックアップ拒否・復元が成功。
- GitHub同期前に別担当のmain `a0e4bd2`（通常カード30種類・スターター名称更新等）を統合。ゲームの選定・操作変更を維持し、カタログを現行生成器で再作成。統合後108テスト・build・生成物照合成功。Pages公開確認：実施中。完了後にコミット・Actions・実配信照合結果を追記する。

独立した全430問・全主張の技術監査、初心者の実読評価、本人の未読成績、iPhone実機での操作は未実施。NR対応の実装・作成者確認を、レビュー25観点の独立した合格判定へ置き換えない。
