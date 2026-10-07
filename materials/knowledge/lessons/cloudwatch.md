# CloudWatchアラームの評価窓と通知動作

## 仕組み

CloudWatchアラームは対象メトリクス、統計、期間、閾値と評価条件を設定する。M out of NではEvaluationPeriodsが評価する期間数N、DatapointsToAlarmが必要な超過点数M。欠測のない評価窓で2/3なら、3期間中2点の超過が条件となる。全3点や連続3点を要求する説明へ読み替えない。

アラーム状態とアクションは別。状態がALARMへ変わった場合でも、ActionsEnabledがfalseなら状態変化時のアクション実行は無効である。通知先を設定したことだけで届くとは判断せず、アクション有効化、宛先、権限、状態変化と実際の受信を確認する。

## 比較・条件

| 設定 | 役割 | 混同を避けるもの |
| --- | --- | --- |
| EvaluationPeriods | 評価期間数N | 必要超過数M |
| DatapointsToAlarm | 必要超過数M | 呼出し回数や全N点超過 |
| ActionsEnabled | 状態変化時の動作を有効化 | 状態の評価そのもの |
| TreatMissingData | 欠測の評価方針 | 実測値0 |

## 欠測・限界

欠測の扱いはbreaching、notBreaching、ignore、missingから選ぶ。データがないことと実値0は別で、メトリクスの発生条件を見て設計する。AWS/DynamoDBメトリクスの欠測には指定と異なる例外があるため、全サービスへ一律適用しない。実際の取得範囲、欠測を含む全評価規則、異常検知・複合アラーム、通知の再試行、最新料金は未確認。

静的閾値は業務の正常値・期間・対象ディメンションとそろえる。アクションを有効化しただけで過去の状態変化が自動再送されるとは扱わない。設定の存在、アラーム状態、通知到達、対処完了を順に分けて観測する。

## ケース問題・誤答理由

第1問は欠測なしの2/3、第2問は別アラームの無効なアクション。Nを必要超過数にする誤答、ALARMと通知を同一視する誤答の理由を説明する。条件変更はケース正本で扱う。

## 用語・補足

**メトリクス**は時系列の観測値。**ディメンション**は観測対象を区別する属性。**評価窓**は判断に使う期間。**欠測**は必要な観測値がない状態。**アラームアクション**は状態変化に応じて行う通知等の動作。

## 根拠と確認状態

2026-10-07に原稿作成後の内容確認を実施。同一担当確認、独立監査・実AWS実験・本人理解評価は未実施。ゲーム取り込みと公開は別管理。AWS公式リポジトリの固定コミットを無料で閲覧。

- [api_op_PutMetricAlarm.go](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/cloudwatch/api_op_PutMetricAlarm.go) — DatapointsToAlarmはM、EvaluationPeriodsはN。ActionsEnabledは状態変化時のアクション実行を制御。TreatMissingDataはbreaching/notBreaching/ignore/missingで、DynamoDBには例外がある。
