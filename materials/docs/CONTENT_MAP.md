# 試験範囲・教材対応表

確認日: 2026-10-05。対象: SAA-C03。全14タスクを以下の教材で扱う。タスクへの割当はカバレッジ計画であり、全詳細スキルの監査完了とは区別する。

| 公式タスク | 主な章 | 学ぶ判断 |
|---|---|---|
| 1.1 リソースへの安全なアクセス | 01,02 | 責任共有、IAM、認証連携、マルチアカウント |
| 1.2 安全なワークロード | 03,08,10 | 分離、通信、認証、脅威対策 |
| 1.3 データ保護 | 05,06,10,11 | 暗号化、鍵、アクセス、保存・復旧 |
| 2.1 スケーラブルな疎結合 | 04,08,09 | 状態分離、キュー、サーバーレス |
| 2.2 高可用性・耐障害性 | 01,04,06,07,11 | AZ、フェイルオーバー、RTO/RPO |
| 3.1 ストレージ性能 | 05 | オブジェクト・ブロック・ファイル |
| 3.2 コンピューティング性能 | 04,08,12 | スケール、コンテナ、計算資源 |
| 3.3 データベース性能 | 06 | アクセスパターン、レプリカ、キャッシュ |
| 3.4 ネットワーク性能 | 03,07 | 接続方式、配信、負荷分散 |
| 3.5 取り込みと変換 | 09,11,12 | ストリーム、移行、分析、ETL |
| 4.1 ストレージ費用 | 05,11,12 | 保存クラス、ライフサイクル、転送 |
| 4.2 計算費用 | 04,08,12 | 購入方式、適正化、稼働率 |
| 4.3 データベース費用 | 06,12 | エンジン、容量、課金方式 |
| 4.4 ネットワーク費用 | 03,07,12 | NAT、エンドポイント、配信、転送 |

## 章と通常問題の割当

| 章 | 内容 | 問題数 | ID |
|---|---|---:|---|
| 01 | AWS全体像 | 10 | q001–q010 |
| 02 | IAM | 20 | q011–q030 |
| 03 | VPC | 20 | q031–q050 |
| 04 | EC2・負荷分散・スケーリング | 15 | q051–q065 |
| 05 | ストレージ | 20 | q066–q085 |
| 06 | データベース | 15 | q086–q100 |
| 07 | 名前解決・配信 | 15 | q101–q115 |
| 08 | サーバーレス・コンテナ | 20 | q116–q135 |
| 09 | 疎結合・イベント | 15 | q136–q150 |
| 10 | セキュリティ・監視 | 20 | q151–q170 |
| 11 | DR・移行 | 15 | q171–q185 |
| 12 | 性能・コスト・分析 | 15 | q186–q200 |

通常問題バッチP01=q001–020、P02=q021–040、…P10=q181–200。Bの最小20問は章01の10問と章02から10問を使用。バッチは制作・検証管理単位で、画面では章別に表示。

模試はM1/M2各65問、通常演習とは別ID。各回の分野1/2/3/4を20/17/15/13問に割り当てる。本試験の重み30/26/24/20%に近い構成であり、本試験の採点方式を再現するものではない。

## 一次資料

- [試験ガイド](https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html)
- [分野1](https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain1.html)
- [分野2](https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain2.html)
- [分野3](https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain3.html)
- [分野4](https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain4.html)

教材・問題ごとの技術的根拠は各 `sources` に保持する。
