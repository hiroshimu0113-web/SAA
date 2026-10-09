# 教材の棚卸し（自動生成）

`pnpm exec tsx scripts/export-knowledge.ts` で更新。教材数は内容監査や理解度を意味しません。既存原稿の概念タグも未監査を含みます。

| 章 | レッスン（公開 / 全体） | 問題（公開 / 全体） | 関連する詳細単位 | 既存監査の関連指摘（改訂履歴参照） |
|---|---:|---:|---|---|
| ch01 AWSの全体像 | 4 / 4 | 17 / 17 | ec2, instance-store, durability, s3, region, az, availability | CR-001 |
| ch02 IAMとアクセス制御 | 4 / 4 | 43 / 43 | authentication, authorization, temporary-credentials, iam-role, least-privilege, mfa | CR-001, CR-004 |
| ch03 VPCとネットワーク | 4 / 4 | 41 / 41 | 未細分化 | CR-003 |
| ch04 EC2・負荷分散・Auto Scaling | 7 / 7 | 33 / 33 | alb, checkpoint | 個別指摘なし（監査済みとは限らない） |
| ch05 ストレージを選ぶ | 6 / 6 | 41 / 41 | 未細分化 | CR-002 |
| ch06 データベースとキャッシュ | 6 / 6 | 41 / 41 | elasticache | CR-002 |
| ch07 名前解決と世界への配信 | 5 / 5 | 37 / 37 | 未細分化 | CR-003, CR-009 |
| ch08 サーバーレスとコンテナ | 4 / 4 | 34 / 34 | 未細分化 | CR-008, CR-009 |
| ch09 疎結合とメッセージ | 4 / 4 | 29 / 29 | circuit-breaker, exponential-backoff, jitter, request-timeout | CR-009 |
| ch10 暗号化・保護・監視 | 4 / 4 | 42 / 42 | cloudwatch-alarm | CR-005, CR-006, CR-009 |
| ch11 災害復旧と移行 | 4 / 4 | 34 / 34 | iac, cloudformation, change-set, drift-detection, aws-backup | CR-006, CR-007, CR-009 |
| ch12 性能・コスト・分析の総合設計 | 6 / 6 | 38 / 38 | 未細分化 | CR-002, CR-003, CR-007, CR-009 |

指摘本文は [CONTENT_REVIEW.md](../docs/CONTENT_REVIEW.md)。章別の補強と自己照合は [SAA_REVISION_LOG.md](../docs/SAA_REVISION_LOG.md) に記録。独立した全体監査は未実施。詳細単位のない概念は `inventory_only` として保持しています。

## レッスンタグとの対応を要確認の概念ID

以下は問題・細分化単位にあるが、既存レッスンのconceptIdsにはないIDです。本文中に説明がないという断定ではありません。自動統合せず対応を確認してください。

- authentication: 今回追加した判断単位
- authorization: 今回追加した判断単位
