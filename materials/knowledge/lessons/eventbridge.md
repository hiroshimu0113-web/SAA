# EventBridgeのルール選別とイベント取込み結果

## 仕組み

EventBridgeのルールは一つのイベントバスを監視する。EventPatternは到着イベントの内容が条件に一致したときに起動し、ScheduleExpressionは設定した予定に基づいて起動する。sourceやdetail-typeで注文イベントを選別したいならパターンを使い、バス・ターゲット・権限もそろえる。表示名は内容の選別条件ではない。

PutEventsはエントリごとの取込み結果を返す。FailedEntryCountだけでなく、EntriesのEventIdまたはErrorCode/ErrorMessageを確認する。成功分と失敗分を分け、失敗理由に応じて修正・再送を検討する。取込み成功はターゲットの業務完了を保証する結果ではない。

## 比較・条件

| 情報・設定 | 判断すること | 注意 |
| --- | --- | --- |
| EventPattern | 到着イベントの内容の一致 | スケジュールとは別 |
| ScheduleExpression | 予定に基づく起動 | 内容の選別を代替しない |
| FailedEntryCount / Entries | 要求内の取込み成功・失敗 | 下流処理の完了とは別 |
| ターゲットの観測 | 配信・業務の結果 | 取込み応答だけで省略しない |

## 更新・限界

PutRuleで既存ルールを更新する際、省略した引数は以前の値を維持せずnullへ置換される。変更した項目だけを送れば他設定が常に残るという部分更新の前提を置かず、最終的な設定を確認する。反映直後の一回だけで判定せず、反映と配信を観測する。

再送の可否は失敗理由による。成功分を無条件に再送して業務を二重実行しないよう、既存の冪等性教材を再利用する。全パターン演算子、ターゲット配信再試行/DLQ、アーカイブとリプレイ、Scheduler/Pipes、料金、実AWS試験は未確認。

## ケース問題・誤答理由

第1問は到着内容の選別、第2問は別要求の取込み部分失敗。予定起動を内容の選別へ読み替える誤答、API応答を全成功・業務完了へ読み替える誤答を確認する。

## 用語・補足

**イベントバス**はイベントを受ける経路。**イベントパターン**はイベント内容の一致条件。**ターゲット**はルールから送る処理先。**エントリ**は一要求に含めた個々のイベント。**取込み**はイベントを受け付ける工程で、業務処理の完了とは別。

## 根拠と確認状態

2026-10-07に原稿作成後の内容確認を実施。同一担当確認、独立監査・実AWS実験・本人理解評価は未実施。ゲーム取り込みと公開は別管理。AWS公式リポジトリの固定コミットを無料で閲覧。

- [api_op_PutRule.go](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/eventbridge/api_op_PutRule.go) — ルールは単一イベントバスのイベントを監視。EventPatternは一致時、ScheduleExpressionは予定時刻で起動。PutRule更新時に省略した引数は旧値を維持せずnullへ置換。更新の反映は即時とは限らない。
- [api_op_PutEvents.go](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/eventbridge/api_op_PutEvents.go) — PutEventsの応答はFailedEntryCountと各Entriesの成功イベントID/失敗理由を持つ。取込み結果をエントリごとに判断する。
