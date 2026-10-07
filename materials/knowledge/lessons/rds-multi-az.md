# RDS Multi-AZの待機系と接続復旧

## 到達目標

通常RDS PostgreSQLの単一スタンバイ型Multi-AZ DBインスタンスを対象に、可用性と読取り拡張を分ける。Aurora・Multi-AZ DBクラスターの説明へ一般化しない。

## 仕組み

プライマリから別AZのスタンバイへ同期複製し、障害時の切替に備える。スタンバイは通常の読取り先ではない。分析負荷を分離するなら読取り用リードレプリカと、その接続先・許容遅延を検討する。

切替ではDBエンドポイントのDNS参照先が変更される。既存接続を再確立し、DNSキャッシュや接続プールの動作を確認する。IPを固定すると切替先へ追従できない。接続切断時の書込みが完了したかは別問題なので、結果確認と再実行の安全性をアプリで設計する。

## 比較・条件

| 構成 | 主な役割 | 注意 |
| --- | --- | --- |
| 単一スタンバイ型Multi-AZ DBインスタンス | 同期複製と可用性 | 待機系は読取り先ではない |
| 通常PostgreSQLのリードレプリカ | 非同期複製と読取り分離 | 最新データがまだ反映されていない場合がある |
| Multi-AZ DBクラスター / Aurora | 別の配置・接続モデル | この教材の待機系の制限を一律適用しない |

ForceFailoverを指定した再起動はMulti-AZが条件であり、単一AZのインスタンスには有効化できない。CreateDBInstanceではMultiAZとAvailabilityZoneの同時指定は不可。クラスターの再起動は別APIである。

## 限界

同期複製には書込み遅延への影響があり得る。切替は無停止や固定秒数の復旧を保証する説明ではない。論理的な誤更新も複製されるため、バックアップ・PITRによる復元設計は別途必要。最新のエンジン対応、数値上限、料金、復旧時間は確認範囲外。アーカイブ版のガイドを現行の提供条件の根拠に使わない。

## ケース問題・誤答理由

正本は `knowledge/game-cases.json` の `rds-multi-az-standby`。第1問は待機系へ分析を送れるという誤解、第2問は切替後も古い接続・固定IPを使えるという誤解を確認する。各問に配置の種類と必要な条件を明記し、ケースの制約欄を見なくても判断できる。

## 用語・補足

**AZ**はリージョン内の分離された配置先。**スタンバイ**は切替に備える待機系。**同期複製**はプライマリと待機系の更新を同期させる方式。**フェイルオーバー**は障害等に伴う稼働先の切替。**エンドポイント**は接続先を表す名前。**DNSキャッシュ**は名前とIPの対応を一定期間保持する仕組み。

## 根拠と確認状態

2026-10-07に原稿作成後の内容確認を実施。同一担当確認、独立監査・実AWS実験・本人理解評価は未実施。ゲーム取り込みと公開は別管理。AWS公式リポジトリの固定コミットを無料で閲覧。

- [Concepts.MultiAZSingleStandby.md](https://github.com/awsdocs/amazon-rds-user-guide/blob/f2e9ed35fba2cb7e3942a1c23ed5b37162222d41/doc_source/Concepts.MultiAZSingleStandby.md) — AWS公式アーカイブ版：単一スタンバイのMulti-AZ DBインスタンスは別AZへ同期複製し、スタンバイは読取りに使えない。切替時にDNSを変更し既存接続の再確立が必要。現行エンジン対応・時間・料金の根拠には用いない。
- [api_op_RebootDBInstance.go](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/rds/api_op_RebootDBInstance.go) — 再起動は一時的な停止を伴う。ForceFailoverはMulti-AZの切替による再起動で、Multi-AZでないインスタンスには有効化できない。DBクラスターの再起動は別API。
- [api_op_CreateDBInstance.go](https://github.com/aws/aws-sdk-go-v2/blob/2ba0e39015ddf9c91c6c378f8a4fb79dcb4353da/service/rds/api_op_CreateDBInstance.go) — MultiAZとAvailabilityZoneを同時指定できない。AuroraのAZはクラスターで管理し、この指定は適用しない。
