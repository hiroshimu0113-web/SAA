# 教材の棚卸し（自動生成）

`pnpm exec tsx scripts/export-knowledge.ts` で更新。教材数は内容監査や理解度を意味しません。既存原稿の概念タグも未監査を含みます。

| 章 | レッスン（公開 / 全体） | 問題（公開 / 全体） | 関連する詳細単位 | 既存監査の未解決指摘 |
|---|---:|---:|---|---|
| ch01 AWSの全体像 | 3 / 3 | 10 / 10 | ec2, instance-store, durability, s3, region, az, availability | CR-001 |
| ch02 IAMとアクセス制御 | 3 / 3 | 10 / 20 | authentication, authorization, temporary-credentials, iam-role, least-privilege, mfa | CR-001, CR-004 |
| ch03 VPCとネットワーク | 0 / 3 | 0 / 20 | 未細分化 | CR-003 |
| ch04 EC2・負荷分散・Auto Scaling | 0 / 3 | 0 / 15 | alb | 個別指摘なし（監査済みとは限らない） |
| ch05 ストレージを選ぶ | 0 / 3 | 0 / 20 | 未細分化 | CR-002 |
| ch06 データベースとキャッシュ | 0 / 3 | 0 / 15 | 未細分化 | CR-002 |
| ch07 名前解決と世界への配信 | 0 / 3 | 0 / 15 | 未細分化 | CR-003, CR-009 |
| ch08 サーバーレスとコンテナ | 0 / 3 | 0 / 20 | 未細分化 | CR-008, CR-009 |
| ch09 疎結合とメッセージ | 0 / 3 | 0 / 15 | 未細分化 | CR-009 |
| ch10 暗号化・保護・監視 | 0 / 3 | 0 / 20 | 未細分化 | CR-005, CR-006, CR-009 |
| ch11 災害復旧と移行 | 0 / 3 | 0 / 15 | 未細分化 | CR-006, CR-007, CR-009 |
| ch12 性能・コスト・分析の総合設計 | 0 / 3 | 0 / 15 | 未細分化 | CR-002, CR-003, CR-007, CR-009 |

指摘本文は [CONTENT_REVIEW.md](../docs/CONTENT_REVIEW.md)。第3章以降は全体監査待ち。詳細単位のない概念は `inventory_only` として保持しています。

## レッスンタグとの対応を要確認の概念ID

以下は問題・細分化単位にあるが、既存レッスンのconceptIdsにはないIDです。本文中に説明がないという断定ではありません。自動統合せず対応を確認してください。

- abac: q022
- access-analyzer: q023
- ami: q060
- archive: q075
- aurora-replica: q099
- authentication: 今回追加した判断単位
- authorization: 今回追加した判断単位
- block-public-access: q028
- capacity-reservation: q058
- cidr: q048
- cognito-identity: q030
- dax: q096
- direct-connect: q044
- dynamodb-on-demand: q094
- dynamodb-transactions: q097
- dynamodb-ttl: q095
- ebs-snapshot: q080
- endpoint-policy: q049
- fsx-windows: q069
- global-tables: q100
- gp3: q078
- implicit-deny: q029
- intelligent-tiering: q073
- ipv6-egress: q045
- longest-prefix: q047
- multipart-upload: q081
- nat-gateway: q033, q034
- noncurrent-version: q085
- permissions-boundary: q021
- placement-group: q062
- private-link: q040
- provisioned-iops: q079
- public-subnet: q032
- rds-standby: q088
- resource-policy: q024
- s3-consistency: q084
- s3-encryption: q083
- s3-replication: q077
- scheduled-scaling: q055
- session-manager: q050
- site-to-site-vpn: q043
- standard-ia: q074
- target-tracking: q054
- transfer-acceleration: q082
- vpc-flow-logs: q046
- warm-pool: q061
