# SNSの配信分岐と購読フィルター

## 仕組み

SNSトピックは発行されたメッセージを購読先へ分岐する。複数の処理系がそれぞれ全イベントを保持・処理するなら、各SQSキューを購読先として独立させる。同じキューを複数処理系が消費する競合処理と、購読先ごとのファンアウトを区別する。

購読のFilterPolicyは配信する部分集合を選ぶ。FilterPolicyScopeの既定はMessageAttributesで、本文を対象にする場合はMessageBodyを選ぶ。JSON本文にしかないcategoryを属性のフィルターで探しても、意図した対象と一致しない。本文・属性の構造とポリシーをそろえる。

## 比較・条件

| 設定・構成 | 役割 | 注意 |
| --- | --- | --- |
| 購読先ごとのSQSキュー | 独立した受信・保持・消費 | 同じキューの競合消費とは別 |
| FilterPolicy / Scope | 配信先の部分集合と対象 | 本文と属性を区別 |
| RawMessageDelivery | SNSメタデータ包装の省略 | フィルター対象は変えない |
| 購読RedrivePolicy | 配信できないメッセージの退避 | 消費後の業務失敗とは別 |

## 障害・限界

トピックへの発行、購読先への配信、キューからの受信、業務完了を分けて確認する。SNSの購読DLQは配信の失敗を扱い、SQS消費側のDLQと役割が異なる。既存の可視性タイムアウト・DLQ・冪等性教材を共有し、受理だけで一回の業務完了を保証しない。

配信形式はプロトコルで異なる。包装を省略する場合は消費側のデコードを合わせる。FIFOの順序/重複排除、全権限、配信再試行と反映時間の詳細、料金、実AWS試験は未確認。購読とフィルターの設定だけで全障害を吸収するとは主張しない。

## ケース問題・誤答理由

第1問は全イベントを独立処理する構成、第2問は別購読の本文フィルター。競合消費を配信分岐へ読み替える誤答、本文と属性を混同する誤答を説明する。第2問は第1問の正解に依存しない。

## 用語・補足

**トピック**は発行先、**購読**は受信先への関連付け。**ファンアウト**は複数の独立した配信先へ分岐すること。**メッセージ属性**は本文と別に付ける情報。**包装**はSNSが配信用に付けるメタデータの形式。

## 根拠と確認状態

2026-10-07に原稿作成後の内容確認を実施。同一担当確認、独立監査・実AWS実験・本人理解評価は未実施。ゲーム取り込みと公開は別管理。AWS公式リポジトリの固定コミットを無料で閲覧。

- [api_op_Publish.go](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/sns/api_op_Publish.go) — トピックへの発行は購読した各エンドポイントへ配信する。エンドポイントにより形式が異なる。
- [api_op_ReceiveMessage.go](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/sqs/api_op_ReceiveMessage.go) — 受信メッセージには可視性タイムアウトが適用され、同じキューでの消費と購読先ごとの分岐を区別する。
- [api_op_Subscribe.go](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/sns/api_op_Subscribe.go) — SQS購読先はキューARN。FilterPolicyは部分集合の配信、FilterPolicyScopeはMessageAttributes既定またはMessageBody。RawMessageDeliveryはSNSのJSONメタデータ包装を省く。RedrivePolicyは配信できないメッセージをDLQへ送る。
