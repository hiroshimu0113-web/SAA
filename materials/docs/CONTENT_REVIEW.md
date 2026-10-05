# 教材独立レビュー

確認日：2026-10-05。レビュー担当：UI担当エージェント（教材作成担当とは別）。

## 判定と確認範囲

現時点の判定は **教材完成版として検証待ち**。12章36レッスンの存在と、試験タスク14項目への割当は確認したが、詳細スキルを説明できることとは区別する。入門用の短い教材としては有用。ゲーム開始の前提となる教材全体の監査は未完了。

- 読了：`src/content/part1.ts` の第1〜6章本文・比較・用語生成、`part2.ts` の第7〜12章本文・比較・用語。
- 公式照合：試験ガイド分野1〜4の全タスク、RDS Multi-AZ DBインスタンス、DynamoDB読み取り整合性、CloudFront OAC、Lambda実行上限。
- 未確認：追記中の全330問の正解・誤答理由・重複、全出典URLの本文対応、すべてのサービスの最新仕様。問題作成完了後に追記する。
- 指摘の P1 は完成版の判定前に解決、P2 は不足や誤解の修正。未確認を「誤り」と断定しない。

## 個別指摘

| ID | 場所 | 重大度 | 根拠・影響 | 修正案 | 状態 |
|---|---|---|---|---|---|
| CR-001 | part1.ts / terms1 | P1 | 比較表からの自動生成だけではリージョン・AZ・VPC・サブネット・最小権限など章で導入する重要語に説明がない。比較名の重複が残り、概念IDとも一致しない。「全導入用語」「重複解消」「概念で教材連携」の受入条件に未達 | terms2と同様に概念IDを使う明示的な用語一覧へ変更。各主要概念の存在と用語名重複を検査 | 未解決 |
| CR-002 | ch05、ch06、ch12 / 詳細スキル | P1 | 名前・用途の導入だけで、性能や費用の条件から選択する説明が薄い。3.1/3.3/4.1/4.3の学習に不足 | EBS IOPS/スループット、EFS性能、AuroraとRDS/DynamoDBの選択、DynamoDB容量方式、DB保持・移行の比較を短い追加レッスンとして制作 | 未解決 |
| CR-003 | ch03、ch07、ch12 / 4.4 | P1 | Interface endpointの課金注意はあるが、AZ間・NAT・拠点接続・CDNの経路ごとの費用比較を学ぶ先がない | NAT共有/分散、同一AZ経路、ゲートウェイエンドポイント、DX/VPNの要件・費用要因を具体構成で比較。料金固定値は必須にしない | 未解決 |
| CR-004 | ch02 / 1.1 | P2 | SCPとロールは説明済みだが、Organizations/Control Towerでの複数アカウント設計、ディレクトリ連携、リソースポリシーの選択が不足 | 組織・OU・SCP・Control Tower、従業員フェデレーションとリソースポリシーを例で説明 | 未解決 |
| CR-005 | ch10-l01 / 1.3 | P2 | 鍵を守る・秘密を更新する説明はあるが、鍵ローテーションと証明書更新という詳細スキルの学習先がない。ACMの説明に直接対応するACM出典もない | 鍵ローテーションと既存暗号文の関係、ACM更新の前提、鍵の削除・復旧影響を補い、該当公式資料を付ける | 未解決 |
| CR-006 | ch11、ch10 / 2.2 | P2 | DRの用語と戦略は説明済み。一方、待機先のクォータ、再現可能なインフラ、分散トレースの具体判断が未説明 | 復旧時の容量・クォータ事前確認、IaCによる再作成、メトリクスとトレースの使い分けを追加 | 未解決 |
| CR-007 | ch12-l03、ch11-l03 / 3.5 | P2 | 分析サービス列挙はあるが、可視化の選択、取り込み頻度/速度、ハイブリッド継続アクセスと一括転送の違いが不足 | データの取り込み→変換→権限→可視化の流れを追加し、DataSync/Storage Gateway/Transfer Familyを区別 | 未解決 |
| CR-008 | ch08-l01および関連問題 / Lambda上限 | P2 | 公式上限ページには15分に加え、Managed Instancesの特定呼出しで90分の例外がある。「通常」は曖昧で、問題で無条件に15分とすると誤答判定を生む | 基本学習は標準Lambdaに限定し、長時間処理の問題も実行方式と分割不可等を明記。例外と最新資料参照の補足を付ける | 未解決 |
| CR-009 | part2.ts / ch07〜12の確認問題 | P2 | part1のpointsには確認質問と回答があるが、part2のpointsは要点のみ。「たとえ→仕組み→構成図→使い分け→確認問題」の共通形式が不統一 | 各レッスンへ短い確認質問と答えを追加するか、関連演習問題への対応を監査して明示する | 未解決 |

## 試験タスク別の説明カバレッジ

以下は公式詳細スキルと本文の比較。サービス名が列挙されているだけの場合、選択を学べる状態とは判定しない。

| 公式タスク | 現在の主な学習先 | 監査結果・追加が必要な判断 |
|---|---|---|
| 1.1 安全なアクセス | ch01、ch02 | 基本はあり。CR-004の組織設計・連携・リソースポリシーを補う |
| 1.2 安全なワークロード | ch03、ch08、ch10 | SG/NACL・アプリ認証・保護はあり。DXとVPNの暗号化・冗長化を補う |
| 1.3 データ保護 | ch05、ch10、ch11 | 保持・暗号化・復旧の概要あり。CR-005の鍵更新・証明書更新を補う |
| 2.1 スケーラブルな疎結合 | ch04、ch08、ch09 | 状態分離・コンテナ・イベントの基本を扱う。再試行/流量の定量判断は問題で監査予定 |
| 2.2 高可用性・耐障害性 | ch01、ch04、ch06、ch11 | 冗長化・DRはあり。CR-006のクォータと再現性・観測を補う |
| 3.1 ストレージ性能 | ch05 | 形式の比較のみでは性能要件への選択が不足。CR-002 |
| 3.2 計算性能 | ch04、ch08、ch12 | ASG・サーバーレスはあり。CPU/メモリ最適化ファミリー、LambdaメモリとCPU、Batchの判断を補う |
| 3.3 DB性能 | ch06 | RDSの冗長化、DynamoDBキー、キャッシュはあり。Aurora・容量・エンジン選択を補う |
| 3.4 ネットワーク性能 | ch03、ch04、ch07 | ALB/NLB・CDN・ルーティングはあり。ハイブリッド構成と帯域/配置判断を補う |
| 3.5 取り込み・変換 | ch09、ch11、ch12 | 取り込みと分析の基本あり。CR-007の可視化・構成要件を補う |
| 4.1 ストレージ費用 | ch05、ch12 | 保存階層の概要あり。小オブジェクト/取得/リクエスト/移行の費用要因、管理ツールを補う |
| 4.2 計算費用 | ch04、ch08、ch12 | Spot/Savings Plansあり。RIとの区別、サイズと実利用の見直し・計測ツールを補う |
| 4.3 DB費用 | ch06、ch12 | 対応章はあるが容量・購入・保持方法を費用で選ぶ説明が不足。CR-002 |
| 4.4 ネットワーク費用 | ch03、ch07、ch12 | 対応章はあるが構成ごとの転送コスト比較が不足。CR-003 |

## 公式照合で妥当と確認した主張

- ch06-l01：Multi-AZ DBインスタンスのスタンバイは読み取りに使わない。読み取り可能なMulti-AZ DBクラスターと区別する説明は適切。[RDS公式](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html)
- ch06-l02：テーブル/LSIの強い整合性とGSIの結果整合性の区別は適切。[DynamoDB公式](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html)
- ch07-l03：S3ウェブサイトエンドポイントはOACを使う通常のS3オリジンと区別する説明が適切。[CloudFront公式](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
- ch08-l01：15分の説明には実行方式の限定が必要。[Lambda公式上限](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)

## カバレッジの根拠

- [公式分野1](https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain1.html)
- [公式分野2](https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain2.html)
- [公式分野3](https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain3.html)
- [公式分野4](https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03-domain4.html)

「checked: 2026-10-05」というデータ項目の存在だけでは出典照合の証拠とは扱わない。問題レビューでは、実際の主張を支える該当節を確認する。
