# ゲーム内問題の全件確認一覧

対象main：8fecd44d062c520684c32e9cf14e6db65808ed30。カタログ版：77114896a8f256de。2026-10-08 JST。

全228問の問題文・選択肢・正答・個別解説を読解し、全件で選択肢参照・正答範囲・解説数・教材変換の整合を確認した。本一覧は確認対象の漏れを防ぐ索引であり、全115出典の最新版独立照合済みという意味ではない。合格対策の十分性、修正優先度、検証範囲は[SAA_GAME_READINESS_REVIEW.md](SAA_GAME_READINESS_REVIEW.md)を参照。

分野は元教材のタグ。元教材IDがない7問は未付与。出典はゲーム画面で利用するURL。正答自体は本一覧に記載しない。

| ゲーム問題ID | 元教材ID | 分野 | 選択肢数 | 問題文 | 出典 |
|---|---|---:|---:|---|---|
| az | ゲーム補助 | 未付与 | 3 | リージョンとAZの関係として正しいものは？ | [AWS公式](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions-availability-zones.html) |
| shared | ゲーム補助 | 未付与 | 3 | 同じAZにEC2が2台。AZ全体が停止した場合は？ | [AWS公式](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions-availability-zones.html) |
| routing | ゲーム補助 | 未付与 | 3 | 1つのAZが停止しても新しいHTTP要求を処理したい。必要データと残存容量は確保済み。適した構成は？ | [AWS公式](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html) |
| capacity | ゲーム補助 | 未付与 | 3 | 2つのAZに処理能力が各100件/秒のサーバー。全体で160件/秒が必要。片方のAZ停止後、残った1台で維持できる？（この問題の仮定値） | [AWS公式](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions-availability-zones.html) |
| study-region-failure | ゲーム補助 | 未付与 | 3 | 同じリージョンの複数AZにEC2を配置しました。リージョン全体の停止への備えとして、この配置だけで十分ですか？ | [AWS公式](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions-availability-zones.html) |
| study-alb-failopen | ゲーム補助 | 未付与 | 3 | ALBの全ターゲットが異常と判定された場合、どうなり得ますか？ | [AWS公式](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html) |
| study-data-access | ゲーム補助 | 未付与 | 3 | 別AZの正常なEC2へ要求を切り替えましたが、必要な写真は停止中のEC2にしかありません。何が不足していますか？ | [AWS公式](https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions-availability-zones.html) |
| study-q001 | q001 | 2 | 4 | 同じAZにEC2を2台置いた予約サイトがAZ障害で停止した。再発時にも稼働させる改善は？ | [AWS公式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html) |
| study-q002 | q002 | 1 | 4 | EC2上のWebアプリでゲストOSの脆弱性が見つかった。修正を計画する主体は？ | [AWS公式](https://aws.amazon.com/compliance/shared-responsibility-model/) |
| study-q003 | q003 | 1 | 4 | S3に機密ファイルを保存する。利用者が引き続き管理すべき項目は？ | [AWS公式](https://aws.amazon.com/compliance/shared-responsibility-model/) |
| study-q004 | q004 | 2 | 4 | 大阪のEC2が東京リージョンのコンソールに表示されない。最初に確認することは？ | [AWS公式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html) |
| study-q005 | q005 | 3 | 4 | 日本の利用者向けサービスで往復通信時間を短くしたい。リージョン選定で優先して評価する項目は？ | [AWS公式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html) |
| study-q006 | q006 | 2 | 4 | 単一リージョン全体が使えない場合にも業務を継続したい。追加すべき設計範囲は？ | [AWS公式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html) |
| study-q007 | q007 | 2 | 4 | 再起動可能な分析処理で一時ファイルは再生成できるが、処理結果は失いたくない。適切な保存は？ | [AWS公式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html) |
| study-q008 | q008 | 4 | 4 | チェックポイントから再開できる夜間の画像変換を安価に実行したい。どれが適する？ | [AWS公式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html) |
| study-q009 | q009 | 2 | 4 | EC2上の自前DBをRDSに移す主な運用上の効果は？ | [AWS公式](https://aws.amazon.com/compliance/shared-responsibility-model/) |
| study-q010 | q010 | 2 | 4 | 同一リージョンに複数AZを置く価値を説明するならどれか？ | [AWS公式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html) |
| study-q011 | q011 | 1 | 4 | EC2が毎日S3へレポートを保存する。固定キーを配布せずに認可するには？ | [AWS公式](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html) |
| study-q012 | q012 | 1 | 4 | 同じ操作にAllowと明示的Denyが適用されている。結果は？ | [AWS公式](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html) |
| study-q013 | q013 | 1 | 4 | OUへS3のAllowだけを記載したSCPを付けた。IAM権限がない新規ユーザーはS3を使えるか？ | [AWS公式](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) |
| study-q014 | q014 | 1 | 4 | 運用者は特定バケット内のレポートを読むだけでよい。適切な権限設計は？ | [AWS公式](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) |
| study-q015 | q015 | 1 | 4 | 新しいIAMロールを作成している。信頼ポリシーで決めるものは？ | [AWS公式](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html) |
| study-q016 | q016 | 1 | 4 | 複数顧客を扱う外部監視業者へロールを委任する。顧客の取り違えを防ぐ追加条件は？ | [AWS公式](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html) |
| study-q017 | q017 | 1 | 4 | 社員が複数AWSアカウントを社内IDで利用したい。中心となるサービスは？ | [AWS公式](https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html) |
| study-q018 | q018 | 1 | 4 | 一般顧客向けアプリにサインアップとログインを加えたい。どれを検討する？ | [AWS公式](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) |
| study-q019 | q019 | 1 | 4 | 一時認証情報を使う利点として適切なものは？ | [AWS公式](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html) |
| study-q021 | q021 | 1 | 4 | 開発者がIAMロールを作成できるが、付与する権限の上限を制限したい。どれが適切か？ | [AWS公式](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) |
| study-q022 | q022 | 1 | 4 | 部署が頻繁に増える。Projectタグが一致するリソースだけ操作させたい。適切な考え方は？ | [AWS公式](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html) |
| study-q023 | q023 | 1 | 4 | 意図しない外部アカウントへのS3共有を検出したい。適した分析機能は？ | [AWS公式](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html) |
| study-q024 | q024 | 1 | 4 | 別アカウントへ特定S3バケットの読み取りを許可したい。リソース側で主体を指定する仕組みは？ | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-policy-language-overview.html) |
| study-q025 | q025 | 1 | 4 | 管理画面への不正ログイン対策として、パスワード漏えい時の追加防御になるものは？ | [AWS公式](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) |
| study-q026 | q026 | 1 | 4 | 組織のメンバーアカウントで特定操作を禁止したい。各IAM管理者がAllowしても禁止を維持するには？ | [AWS公式](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) |
| study-q027 | q027 | 1 | 4 | Aアカウントの担当者がBのロールを引き受けられない。確認すべき組合せは？ | [AWS公式](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html) |
| study-q028 | q028 | 1 | 4 | 機密文書用バケットで誤ってパブリックポリシーを設定する事故を防ぎたい。どれを有効にする？ | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html) |
| study-q029 | q029 | 1 | 4 | 同一アカウントのIAMユーザーに対象操作のAllowがなく、許可するリソースポリシーもない。結果は？ | [AWS公式](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html) |
| study-q030 | q030 | 1 | 4 | モバイルアプリの認証済みユーザーへ限定したAWS一時認証情報を渡したい。どの機能か？ | [AWS公式](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html) |
| study-q031 | q031 | 2 | 4 | AZ-AとAZ-BへEC2を分散したい。サブネット構成は？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html) |
| study-q032 | q032 | 1 | 4 | IGWへのルートがあるサブネットのEC2へIPv4で直接接続できない。SG等が正しい場合、確認する項目は？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html) |
| study-q033 | q033 | 1 | 4 | 非公開EC2が外部のIPv4更新サイトへ接続したい。外部からの新規接続は不要。適切な構成は？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html) |
| study-q034 | q034 | 2 | 4 | AZごとのプライベートアプリが1台のゾーン型NAT Gatewayに依存する。AZ障害の影響を減らすには？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html) |
| study-q035 | q035 | 1 | 4 | アプリEC2のHTTPS受信をSGで許可した。戻り通信の扱いは？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) |
| study-q036 | q036 | 1 | 4 | 特定の悪意あるIPv4範囲をサブネット境界で明示的に拒否したい。利用できるものは？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html) |
| study-q037 | q037 | 1 | 4 | ACLでHTTP受信を許可したが応答が返らない。確認すべき追加設定は？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html) |
| study-q038 | q038 | 1 | 4 | DBの5432番ポートはアプリ層からだけ受けたい。IPの変化にも対応する設定は？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) |
| study-q039 | q039 | 4 | 4 | 非公開EC2から同一リージョンのS3へ大量転送している。NAT経由を減らす適切な方法は？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html) |
| study-q040 | q040 | 1 | 4 | Secrets ManagerのAPIへプライベートIP経由で接続したい。対応する方式は？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html) |
| study-q041 | q041 | 2 | 4 | A-BとB-CにVPCピアリングがある。AからCへの推移的な通信は？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html) |
| study-q042 | q042 | 3 | 4 | 数十のVPCとオンプレミス接続をハブ形式で管理したい。どれが適する？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html) |
| study-q043 | q043 | 1 | 4 | オンプレミスとVPCをインターネット上の暗号化トンネルで結びたい。適するサービスは？ | [AWS公式](https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html) |
| study-q044 | q044 | 3 | 4 | オンプレミスからAWSへの専用接続を求めている。どれを検討する？ | [AWS公式](https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html) |
| study-q045 | q045 | 1 | 4 | IPv6を持つプライベートEC2からインターネットへ接続し、外からの新規着信を防ぎたい。どれか？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/userguide/egress-only-internet-gateway.html) |
| study-q046 | q046 | 1 | 4 | VPCで送信元・宛先やACCEPT/REJECTを調べたい。どのログを有効化する？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html) |
| study-q047 | q047 | 3 | 4 | 宛先10.1.2.3について、10.0.0.0/8と10.1.0.0/16の静的ルートがある。優先するのは？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html) |
| study-q048 | q048 | 1 | 4 | VPCピアリング候補の2つのVPCが同じ10.0.0.0/16を使う。どの問題がある？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html) |
| study-q049 | q049 | 1 | 4 | S3エンドポイントを作れば、IAMで禁止されたオブジェクトも読めるか？ | [AWS公式](https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html) |
| study-q050 | q050 | 1 | 4 | 非公開EC2の管理でSSH受信ポートと踏み台を減らしたい。権限・Agent・到達性を整えた上で使う機能は？ | [AWS公式](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html) |
| study-q051 | q051 | 3 | 4 | 同じドメインの/apiと/imagesを別のEC2群へ送るには？ | [AWS公式](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html) |
| study-q052 | q052 | 3 | 4 | UDPを使うゲームサーバーの前にロードバランサーを置きたい。どれか？ | [AWS公式](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html) |
| study-q053 | q053 | 2 | 4 | EC2自体は起動中だがアプリが応答しない。ASGにアプリ異常を反映して置換したい。どうする？ | [AWS公式](https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html) |
| study-q054 | q054 | 3 | 4 | 平均CPU使用率を目標値付近へ保つよう台数を調整したい。どの方針か？ | [AWS公式](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html) |
| study-q055 | q055 | 3 | 4 | 毎朝9時ちょうどにアクセスが集中し、起動に数分かかる。事前の準備として適切なのは？ | [AWS公式](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scheduled-scaling.html) |
| study-q056 | q056 | 4 | 4 | 中断通知に備えたバッチで計算費用を抑えたい。適切な実装は？ | [AWS公式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html) |
| study-q057 | q057 | 4 | 4 | 毎時一定の計算利用があり、インスタンスの種類も将来変わりうる。Compute Savings Plansの特徴は？ | [AWS公式](https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html) |
| study-q058 | q058 | 2 | 4 | イベント当日に特定AZのEC2起動容量を確保したい。料金割引とは別に検討するものは？ | [AWS公式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html) |
| study-q059 | q059 | 2 | 4 | インスタンスストアに置いた唯一のデータを失わない設計へ変えるには？ | [AWS公式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html) |
| study-q060 | q060 | 3 | 4 | 同じ構成のEC2を繰り返し素早く起動したい。OSと必要ソフトを事前にまとめるものは？ | [AWS公式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html) |
| study-q061 | q061 | 3 | 4 | アプリ初期化が長く、ASG増台時の準備時間を減らしたい。検討する機能は？ | [AWS公式](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-warm-pools.html) |
| study-q062 | q062 | 3 | 4 | 同一AZのHPC処理でノード間の低遅延が重要。適する配置戦略は？ | [AWS公式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html) |
| study-q063 | q063 | 2 | 4 | ALB配下のEC2が入れ替わるとログイン状態が消える。根本対策は？ | [AWS公式](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html) |
| study-q064 | q064 | 3 | 4 | 接続先のIPを許可リスト登録する取引先へTCPサービスを提供する。固定IPが必要なロードバランサーは？ | [AWS公式](https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html) |
| study-q065 | q065 | 2 | 4 | ASGの最大台数が2台で、すでに2台稼働している。負荷が増えても3台にならない理由は？ | [AWS公式](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html) |
| study-q066 | q066 | 3 | 4 | Webアプリの画像をAPI経由で大量保存し、サーバー台数と独立させたい。適切な保存先は？ | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) |
| study-q067 | q067 | 3 | 4 | EC2上のOSが通常のブロックデバイスを必要とする。適切なのは？ | [AWS公式](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html) |
| study-q068 | q068 | 3 | 4 | 複数AZのLinux Webサーバーで同じNFSファイルを共有したい。どれを選ぶ？ | [AWS公式](https://docs.aws.amazon.com/efs/latest/ug/features.html) |
| study-q069 | q069 | 3 | 4 | 既存WindowsアプリがSMBとActive Directory連携を必要とする。適する管理サービスは？ | [AWS公式](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is.html) |
| study-q070 | q070 | 2 | 4 | S3で同じキーのファイルを誤って上書きしたとき戻したい。事前に有効にする機能は？ | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html) |
| study-q071 | q071 | 1 | 4 | 監査記録の特定バージョンを保持期間中に削除できないWORM形式で保護したい。どれか？ | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html) |
| study-q072 | q072 | 1 | 4 | 非公開S3の請求書を顧客へ短時間だけダウンロード可能にしたい。どれか？ | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) |
| study-q073 | q073 | 4 | 4 | アクセス頻度を予測できない大量オブジェクトを、監視に基づいて階層移動したい。どれか？ | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html) |
| study-q074 | q074 | 4 | 4 | 保存後ほとんど読まないが、読むときはミリ秒単位の取得が必要で複数AZ保護も必要。候補は？ | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html) |
| study-q075 | q075 | 4 | 4 | 10年保存する記録を年に一度読む。取り出しに半日以上待てる。低コスト候補は？ | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects.html) |
| study-q076 | q076 | 4 | 4 | ログを一定日数後に低頻度クラスへ移し、期限後に削除したい。運用を自動化する機能は？ | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) |
| study-q077 | q077 | 2 | 4 | S3の新規オブジェクトを別リージョンにも継続的に複製したい。必要な構成は？ | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html) |
| study-q078 | q078 | 3 | 4 | 汎用SSDで容量とは独立してIOPSやスループットを調整したい。適切なEBSタイプは？ | [AWS公式](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html) |
| study-q079 | q079 | 3 | 4 | EC2上の重要DBで高く安定したIOPSを明示的に用意したい。候補は？ | [AWS公式](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html) |
| study-q080 | q080 | 2 | 4 | EBSデータを別AZで復元してEC2へ接続したい。適切な手順は？ | [AWS公式](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html) |
| study-q081 | q081 | 3 | 4 | 大きな動画のアップロードで失敗箇所だけ再転送したい。どれか？ | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html) |
| study-q082 | q082 | 3 | 4 | 世界各地から遠い単一S3バケットへアップロードする速度を評価改善したい。候補は？ | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html) |
| study-q083 | q083 | 1 | 4 | S3の保存時暗号化を使えば、アクセス権を広くしても安全か？ | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingServerSideEncryption.html) |
| study-q084 | q084 | 3 | 4 | S3への新規PUTが成功した直後にGETする。整合性の説明として正しいのは？ | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel) |
| study-q085 | q085 | 4 | 4 | Versioningを使うバケットの古い版が増え費用が上がった。適切な管理は？ | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html) |
| study-q086 | q086 | 2 | 4 | RDS PostgreSQLでDBインスタンスのAZ障害に備え、自動切り替えを求める。どれか？ | [AWS公式](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html) |
| study-q087 | q087 | 3 | 4 | RDSの読み取りが多く、多少古いデータでもよい分析SQLを分離したい。適切な方法は？ | [AWS公式](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html) |
| study-q088 | q088 | 2 | 4 | RDS Multi-AZ DBインスタンス配置のスタンバイでSELECTを実行したい。正しい説明は？ | [AWS公式](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html) |
| study-q089 | q089 | 2 | 4 | 10時にテーブルを誤更新した。自動バックアップ保持期間内の9時59分へ戻したい。適切な方法は？ | [AWS公式](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html) |
| study-q090 | q090 | 3 | 4 | LambdaからRDSへの短命な接続が急増する。接続の再利用を管理したい。どれか？ | [AWS公式](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html) |
| study-q091 | q091 | 3 | 4 | DynamoDBで全注文のパーティションキーを同じ固定文字列にして負荷が集中した。改善は？ | [AWS公式](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html) |
| study-q092 | q092 | 3 | 4 | DynamoDBの主キーは注文ID。顧客IDでも効率よく注文を検索したい。追加候補は？ | [AWS公式](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html) |
| study-q093 | q093 | 3 | 4 | DynamoDBで更新直後の最新値をテーブルから読みたい。どれを選ぶ？ | [AWS公式](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html) |
| study-q094 | q094 | 4 | 4 | DynamoDBのアクセスが不規則で事前の容量見積もりを避けたい。課金方式の候補は？ | [AWS公式](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/on-demand-capacity-mode.html) |
| study-q095 | q095 | 4 | 4 | 期限切れの一時レコードをDynamoDBから自動削除したい。即時削除でなくてよい。どれか？ | [AWS公式](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html) |
| study-q096 | q096 | 3 | 4 | DynamoDBで同じ項目への結果整合性読み取りが多く、キャッシュで短縮したい。どれか？ | [AWS公式](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html) |
| study-q097 | q097 | 1 | 4 | DynamoDBの在庫更新と注文登録を全件成功または全件失敗にしたい。どれを使う？ | [AWS公式](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transactions.html) |
| study-q098 | q098 | 3 | 4 | 商品一覧を繰り返しDBから読む。キャッシュ導入時に追加で設計すべきものは？ | [AWS公式](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html) |
| study-q099 | q099 | 2 | 4 | Auroraの障害時に昇格先を用意し、読み取りも分散したい。どれを追加する？ | [AWS公式](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraHighAvailability.html) |
| study-q100 | q100 | 2 | 4 | 複数リージョンの利用者が近い場所でDynamoDBへ読み書きしたい。管理された複製方式は？ | [AWS公式](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html) |
| study-rr01-01 | rr01-01 | 2 | 4 | 学習用の仮定：各AZに毎秒300件処理できるサーバーが2台ずつある。通常負荷は毎秒900件。片側AZ停止直後も同じ負荷を処理する最小の事前配置はどれか。 | [AWS公式](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_withstand_component_failures_static_stability.html) |
| study-rr02-02 | rr02-02 | 1 | 4 | アカウントAの既存IAMロールがBのS3オブジェクトを直接読む。暗号化はSSE-S3で、SCP等の拒否はない。AのロールにはGetObjectのAllowがあるがBから拒否される。最小の追加はどれか。 | [AWS公式](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) |
| study-rr03-02 | rr03-02 | 4 | 4 | 学習用の仮定：NAT追加の固定費は月40単位、共有時だけ発生するAZ間転送費は月60単位。他の費用と負荷は同じ。AZごとのNATへ変更すると月額はどうなるか。 | [AWS公式](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html) |
| study-rr04-01 | rr04-01 | 3 | 4 | 夜間集計は分割できず、CPU使用率30%、メモリ不足で大量のスワップが発生する。処理は中断不可で期限も厳しい。最初に比較すべき構成はどれか。 | [AWS公式](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html) |
| study-rr05-01 | rr05-01 | 3 | 4 | EBSを使うEC2で保存容量100GiBは足りる。実測から6000IOPS・250MiB/秒が必要で、EC2側の上限には余裕がある。必要以上の容量を買わない改善はどれか。 | [AWS公式](https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html) |
| study-rr06-01 | rr06-01 | 3 | 4 | 注文システムは複数表のJOINと既存PostgreSQLアプリを大きく変えずに移す必要がある。AZ障害時の自動切替も必要。最適な出発点はどれか。 | [AWS公式](https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/db-selection.html) |
| study-nr04-01 | nr04-01 | 4 | 4 | 今後1年は一定の計算利用額が見込まれるが、EC2の一部をFargateへ移す。EC2以外も含む同一の割引コミットメントを比較したい。どれが適切か。 | [AWS公式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html) |
| study-nr04-02 | nr04-02 | 4 | 4 | 夜間停止する解析EC2は翌朝RAMの処理状態から再開したい。対応AMI・種類で休止を有効化し、暗号化EBS容量も確保済み。適切な運用と費用の説明は。 | [AWS公式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Hibernate.html) |
| study-nr06-01 | nr06-01 | 3 | 4 | 学習用の容量計算。6KB項目を強いGetItemで毎秒100回読み、別の1.5KB新規項目を通常PutItemで毎秒80回書く。GSI・複製・余裕分を除く基礎容量は。 | [AWS公式](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html) |
| study-nr05-01 | nr05-01 | 4 | 4 | RDSの保存量は増加中で、対応するストレージ自動拡張を有効にした。月末に古い行を削除する運用で、割当容量と費用をどう計画するべきか。 | [AWS公式](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIOPS.Autoscaling.html) |
| study-nr04-03 | nr04-03 | 4 | 4 | 既存の仮想検査アプライアンスを複数台へ分散したい。HTTPのパス振分けではなく、検査装置への透過的なIPトラフィックの分配が目的である。第一候補は。 | [AWS公式](https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/introduction.html) |
| study-nr06-03 | nr06-03 | 4 | 4 | PostgreSQLの会計DBを単価の安い別エンジンへ移す案がある。拡張機能と独自SQLを利用しており、業務停止を短くしたい。移行費を含めた判断は。 | [AWS公式](https://docs.aws.amazon.com/redshift/latest/dg/c_columnar_storage_disk_mem_mgmnt.html) |
| study-q101 | q101 | 3 | 4 | 東京と欧州に同等の Web アプリがある。利用者ごとにネットワーク遅延が小さいリージョンへ DNS で案内したい。どのポリシーか。 | [AWS公式](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html) |
| study-q102 | q102 | 2 | 4 | 新環境へ DNS 応答のおよそ10%を向け、問題がなければ段階的に増やしたい。適切な設定は。 | [AWS公式](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html) |
| study-q103 | q103 | 2 | 4 | DNS レコードを正常な待機系に変更したが一部の端末が数分間旧 IP に接続する。最も妥当な説明は。 | [AWS公式](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html) |
| study-q104 | q104 | 2 | 4 | 主サイト障害時だけ別リージョンの待機サイトへ案内したい。データ同期は完了している。DNS に追加する構成は。 | [AWS公式](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html) |
| study-q105 | q105 | 3 | 4 | 日本の S3 に置いた公開画像を世界中に配信する。読取り遅延とオリジンへの要求を減らすには。 | [AWS公式](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) |
| study-q106 | q106 | 3 | 4 | 全員に同じ商品画像を配る CDN で、追跡用クエリが毎回異なりヒット率が低い。最も直接的な改善は。 | [AWS公式](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) |
| study-q107 | q107 | 1 | 4 | S3 の有料教材は CloudFront 経由だけで配信したい。バケットの直接公開を避けるには。 | [AWS公式](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html) |
| study-q108 | q108 | 1 | 4 | 会員が一つの PDF を30分だけ取得できるリンクを発行したい。CloudFront で使う機能は。 | [AWS公式](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html) |
| study-q109 | q109 | 1 | 4 | 会員向け動画は多数の小さなセグメントで構成される。各 URL を変更せずまとめて利用権を与えたい。 | [AWS公式](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html) |
| study-q110 | q110 | 3 | 4 | 世界中から UDP を使うゲームサーバーへ接続する。利用者側の許可リスト用に固定 IP も必要。何を検討するか。 | [AWS公式](https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html) |
| study-q111 | q111 | 3 | 4 | 公開した CSS を更新したがエッジに旧版が残る。今後の更新を明確に区別する一般的な方式は。 | [AWS公式](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) |
| study-q112 | q112 | 1 | 4 | アカウント名を含むマイページが CloudFront で別利用者に返った。最優先で見直す設計は。 | [AWS公式](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) |
| study-q113 | q113 | 3 | 4 | example.com のゾーン頂点を CloudFront 配信へ向けたい。Route 53 で選ぶ適切なレコードは。 | [AWS公式](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html) |
| study-q114 | q114 | 1 | 4 | S3 静的ウェブサイトエンドポイントを CloudFront のオリジンにしている。OAC を使って S3 を非公開にしたい場合の対応は。 | [AWS公式](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html) |
| study-q115 | q115 | 3 | 4 | カナダの利用者には現地向けコンテンツ、その他には標準サイトを DNS で案内したい。国別条件を直接表せるのは。 | [AWS公式](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html) |
| study-q116 | q116 | 3 | 4 | 画像が S3 にアップロードされた直後、数秒でサムネイルを作りたい。常時サーバーは管理したくない。 | [AWS公式](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) |
| study-q117 | q117 | 2 | 4 | Lambda のローカルファイルに注文履歴を置いたところ、別の呼出しで履歴がない。設計上必要な変更は。 | [AWS公式](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) |
| study-q118 | q118 | 3 | 4 | 既存コンテナの変換処理は1件45分かかり分割できない。Managed Instancesを使わない標準Lambdaとコンテナ基盤を比較し、ホスト管理を減らしたい。 | [AWS公式](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) |
| study-q119 | q119 | 1 | 4 | ECS タスク内のアプリが特定の S3 バケットだけを読みたい。アクセスキーを埋め込まず権限を渡すには。 | [AWS公式](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) |
| study-q120 | q120 | 3 | 4 | Web コンテナを常に4タスク維持し、異常終了したタスクを置換したい。ECS のどの構成か。 | [AWS公式](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) |
| study-q121 | q121 | 3 | 4 | 既存運用は Kubernetes のマニフェストとカスタムコントローラーに依存している。管理された制御プレーンを AWS で使うには。 | [AWS公式](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) |
| study-q122 | q122 | 3 | 4 | CI が作成したコンテナイメージを AWS 上のプライベートなレジストリへ保管し、ECS が取得したい。 | [AWS公式](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) |
| study-q123 | q123 | 2 | 4 | Lambda の処理が急増し、接続先の小さな DB を過負荷にしている。この関数の並列実行上限を抑えるには。 | [AWS公式](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) |
| study-q124 | q124 | 3 | 4 | 対話 API の初回呼出しの初期化遅延を抑えたい。Lambda で事前に実行環境を準備する機能は。 | [AWS公式](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) |
| study-q125 | q125 | 2 | 4 | 決済通知で Lambda が再試行されると同じ注文が二重計上される。防ぐ設計は。 | [AWS公式](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) |
| study-q126 | q126 | 3 | 4 | モバイルアプリ向け HTTPS API を公開し、Lambda と接続して流量を制御したい。入口に使うサービスは。 | [AWS公式](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html) |
| study-q127 | q127 | 1 | 4 | 会員制 REST API が API キーだけで本人確認している。改善として適切なのは。 | [AWS公式](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html) |
| study-q128 | q128 | 2 | 4 | 本人確認→審査→決済を順に実行し、審査エラー時は別処理へ分岐したい。順序を管理するサービスは。 | [AWS公式](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html) |
| study-q129 | q129 | 2 | 4 | 申請後に担当者の承認を最大2日待ちたい。関数を動かし続けず進行を保存するには。 | [AWS公式](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html) |
| study-q130 | q130 | 2 | 4 | 在庫 API の一時的なエラーには待って再試行し、回数超過後は取消処理へ進めたい。 | [AWS公式](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html) |
| study-q131 | q131 | 2 | 4 | 【基礎復習：q001の転用】Fargate Web タスク1個がある AZ 障害で停止した。AZ 障害への耐性を高める構成は。 | [AWS公式](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) |
| study-q132 | q132 | 3 | 4 | ECS コンテナを作り直すたびアップロード済みファイルが消える。複数タスクで共有する永続ファイルシステムが必要。 | [AWS公式](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) |
| study-q133 | q133 | 1 | 4 | ECS のアプリ用タスクロールに加え、エージェントが ECR からイメージを取得してログを送信する権限が必要。この役割は。 | [AWS公式](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) |
| study-q134 | q134 | 4 | 4 | 毎時1回だけ数秒で動く小さな整形処理がある。専用 EC2 の待機時間を減らしたい。 | [AWS公式](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) |
| study-q135 | q135 | 3 | 4 | 動画を複数解像度へ変換し、全変換が完了した時点で通知したい。フローの設計は。 | [AWS公式](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html) |
| study-q136 | q136 | 2 | 4 | セールで注文受付が急増するが梱包システムは一定速度でしか処理できない。受付と処理を分離するには。 | [AWS公式](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/sns-or-sqs-or-eventbridge.html) |
| study-q137 | q137 | 2 | 4 | SQS ワーカーの平均処理時間は90秒。可視性タイムアウト30秒で同じ作業が並行実行される。改善は。 | [AWS公式](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) |
| study-q138 | q138 | 2 | 4 | SQS メッセージを受信後、DB 更新成功前に削除している。ワーカー停止時に注文が失われる。必要な変更は。 | [AWS公式](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) |
| study-q139 | q139 | 2 | 4 | 口座ごとの振替イベントに順序が必要だが、別口座は並列処理したい。SQS FIFO の設定は。 | [AWS公式](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/sns-or-sqs-or-eventbridge.html) |
| study-q140 | q140 | 4 | 4 | SQS の利用件数が少なく、空の受信要求が大量にある。無駄なポーリングを減らすには。 | [AWS公式](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) |
| study-q141 | q141 | 2 | 4 | 一つの注文を請求・配送・分析がそれぞれ必ず独立に処理したい。適切な構成は。 | [AWS公式](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/sns-or-sqs-or-eventbridge.html) |
| study-q142 | q142 | 3 | 4 | AWS サービスの状態変更と SaaS イベントを受け、イベント内容に合う対象へ送信したい。 | [AWS公式](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/sns-or-sqs-or-eventbridge.html) |
| study-q143 | q143 | 2 | 4 | 特定の不正な注文だけ解析が失敗し再受信を繰り返す。後続処理を進めつつ調査するには。 | [AWS公式](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) |
| study-q144 | q144 | 2 | 4 | バグを直したので DLQ に溜まった注文を処理し直したい。適切な運用は。 | [AWS公式](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) |
| study-q145 | q145 | 3 | 4 | ワーカーの CPU は低いが外部 API 待ちで SQS の最古メッセージが古くなっている。監視すべき指標は。 | [AWS公式](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) |
| study-q146 | q146 | 3 | 4 | 画像ファイルそのものをメッセージに含めているため転送負荷が大きい。サイズ制約への依存を減らすには。 | [AWS公式](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/sns-or-sqs-or-eventbridge.html) |
| study-q147 | q147 | 2 | 4 | Standard SQS のメッセージがまれに再配信される。業務処理で採るべき対策は。 | [AWS公式](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) |
| study-q148 | q148 | 3 | 4 | SNS の購読者が自分に関係する注文種別だけを受信したい。送信者を購読者ごとの分岐コードで複雑にしたくない。 | [AWS公式](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/sns-or-sqs-or-eventbridge.html) |
| study-q149 | q149 | 2 | 4 | 分析担当が数時間停止しても請求処理を止めず、分析用イベントを後で再開したい。適切な構成は。 | [AWS公式](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/sns-or-sqs-or-eventbridge.html) |
| study-q150 | q150 | 2 | 4 | キュー滞留を解消するためワーカーを急増させた結果、外部 API のレート上限に達した。必要な調整は。 | [AWS公式](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) |
| study-q151 | q151 | 1 | 4 | 保存データに使う暗号鍵の利用権限を管理し、暗号操作を監査したい。適切なサービスは。 | [AWS公式](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html) |
| study-q152 | q152 | 1 | 4 | S3 オブジェクトの読取り権限があるのに SSE-KMS 暗号化データを読めない。確認すべき追加権限は。 | [AWS公式](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html) |
| study-q153 | q153 | 1 | 4 | アプリに埋め込んだ RDS パスワードを集中管理し、定期更新も組み込みたい。 | [AWS公式](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) |
| study-q154 | q154 | 1 | 4 | ALB で HTTPS を終端したい。AWS のマネージド証明書を取得・管理するサービスは。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/security-services.html) |
| study-q155 | q155 | 1 | 4 | Web フォームに SQL インジェクションのリクエストが来ている。ALB 前段で HTTP 内容を検査したい。 | [AWS公式](https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html) |
| study-q156 | q156 | 1 | 4 | 特定送信元からログイン API へ大量の HTTP 要求が来る。時間当たりの要求に基づき制限したい。 | [AWS公式](https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html) |
| study-q157 | q157 | 1 | 4 | インターネット公開サービスが DDoS 攻撃対策を検討している。AWS の DDoS 保護に対応する名称は。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/security-services.html) |
| study-q158 | q158 | 1 | 4 | AWS 環境で認証情報の不審な利用や脅威の兆候を継続検出したい。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/security-services.html) |
| study-q159 | q159 | 1 | 4 | EC2 やコンテナイメージの既知ソフトウェア脆弱性を継続的に調査したい。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/security-services.html) |
| study-q160 | q160 | 1 | 4 | 大量の S3 オブジェクトに個人情報が含まれるか分類・検出したい。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/security-services.html) |
| study-q161 | q161 | 1 | 4 | GuardDuty の検出を有効にした。検出された不審なインスタンスを自動隔離したい。正しい理解は。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/security-services.html) |
| study-q162 | q162 | 1 | 4 | セキュリティグループを誰が何時変更したかを調べたい。まず参照するサービスは。 | [AWS公式](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) |
| study-q163 | q163 | 1 | 4 | 過去のセキュリティグループ設定と、会社の構成ルールへの準拠状態を確認したい。 | [AWS公式](https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html) |
| study-q164 | q164 | 3 | 4 | EC2 のメモリ使用率が監視画面にない。OS のメモリ指標を収集する一般的な方法は。 | [AWS公式](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) |
| study-q165 | q165 | 2 | 4 | ALB の 5xx エラー増加を運用担当へ通知したい。どの組合せが適切か。 | [AWS公式](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) |
| study-q166 | q166 | 1 | 4 | 監査担当は S3 オブジェクトの GetObject 操作も記録したい。通常の管理イベント記録に加えて必要なのは。 | [AWS公式](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) |
| study-q167 | q167 | 1 | 4 | KMS 鍵を誤って無効化した後、暗号化データをアプリが読めなくなった。考えられる理由は。 | [AWS公式](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html) |
| study-q168 | q168 | 1 | 4 | パスワード更新後もアプリが古い値を無期限にメモリ保持し接続失敗する。必要な変更は。 | [AWS公式](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) |
| study-q169 | q169 | 1 | 4 | S3 は保存時暗号化済みだが、クライアントとの通信も暗号化したい。必要な設計は。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/security-services.html) |
| study-q170 | q170 | 1 | 4 | Config で「公開禁止」ルールに違反したバケットを見つけた。評価機能だけを有効にした場合の理解は。 | [AWS公式](https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html) |
| study-q171 | q171 | 2 | 4 | 業務要件は「障害から2時間以内にサービスを再開」。この指標は。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) |
| study-q172 | q172 | 2 | 4 | 取引システムは最大5分前までのデータ損失を許容する。この5分が表すのは。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) |
| study-q173 | q173 | 4 | 4 | 小規模社内システムは数時間の復旧を許容する。平常時の DR 費用を最小限にする基本方式は。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) |
| study-q174 | q174 | 2 | 4 | DR リージョンではデータベースの同期だけ維持し、アプリサーバーは障害時に起動する。この方式は。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) |
| study-q175 | q175 | 2 | 4 | 別リージョンに縮小した全システムが常時稼働し、障害時は容量を増やす。適切な名称は。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) |
| study-q176 | q176 | 2 | 4 | 本番 DB の誤更新が待機レプリカにも反映された。誤更新前へ戻すため追加すべき備えは。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) |
| study-q177 | q177 | 2 | 4 | バックアップ成功の通知は毎日届く。RTO 内に復旧できるか確認する最も確実な方法は。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) |
| study-q178 | q178 | 2 | 4 | 複数サービスのバックアップ頻度と保持期間を統一して管理したい。対応リソースを集約管理するサービスは。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) |
| study-q179 | q179 | 2 | 4 | オンプレミス DB の稼働を続けながら初期データと変更差分を AWS 側へ送り、切替停止を短くしたい。 | [AWS公式](https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html) |
| study-q180 | q180 | 3 | 4 | Oracle から PostgreSQL へ移行する。DMS でデータを転送できればストアドプロシージャも無変更で動くか。 | [AWS公式](https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html) |
| study-q181 | q181 | 3 | 4 | NAS の大量ファイルを EFS へオンライン転送し、転送処理の管理負荷を減らしたい。 | [AWS公式](https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html) |
| study-q182 | q182 | 2 | 4 | 既存オンプレミスのサーバーアプリを大きく改修せず EC2 へリホストしたい。適切な移行サービスは。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) |
| study-q183 | q183 | 2 | 4 | オンプレミスのサーバーを継続的に複製し、災害時に AWS で復旧させたい。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) |
| study-q184 | q184 | 2 | 4 | リージョン障害へ備えて別リージョンへデータを複製したが、アプリ設定とインフラ手順が残っていない。必要な追加作業は。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) |
| study-q185 | q185 | 1 | 4 | 管理者アカウント侵害で本番と同じ権限範囲のバックアップも削除されることを懸念している。改善は。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) |
| study-q186 | q186 | 3 | 4 | アプリの応答が遅い。Web の CPU は低く DB の読取り待ちが長い。最初に行うべきことは。 | [AWS公式](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) |
| study-q187 | q187 | 3 | 4 | 商品カタログは繰り返し読まれ、数分の古さを許容できる。DB の負荷削減に適切なのは。 | [AWS公式](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html) |
| study-q188 | q188 | 2 | 4 | アプリがキャッシュを正本として扱い、消失すると注文が復元できない。必要な変更は。 | [AWS公式](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html) |
| study-q189 | q189 | 4 | 4 | 適正化後も毎時一定のコンピューティング利用が続く。利用額のコミットメントで割引を受ける方式は。 | [AWS公式](https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html) |
| study-q190 | q190 | 4 | 4 | 【基礎復習：q008の転用】チェックポイントから再開できる大量の画像変換バッチがある。時間に余裕があり中断を許容できる。コストを抑える選択は。 | [AWS公式](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html) |
| study-q191 | q191 | 4 | 4 | 開発用 EC2 が夜間・休日にも稼働し、誰も利用していない。契約割引の前に検討することは。 | [AWS公式](https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html) |
| study-q192 | q192 | 4 | 4 | 監査文書は7年保存しほぼ読まない。取出しに半日かかってもよい。保管クラス選択で重視するのは。 | [AWS公式](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html) |
| study-q193 | q193 | 3 | 4 | S3 に貯めたアクセスログを週に数回 SQL で調べたい。常時 DB サーバーを運用したくない。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html) |
| study-q194 | q194 | 4 | 4 | Athena は毎日1日分しか必要ないのに全期間の CSV を読んでいる。スキャン量を減らすには。 | [AWS公式](https://docs.aws.amazon.com/athena/latest/ug/performance-tuning-data-optimization-techniques.html) |
| study-q195 | q195 | 3 | 4 | データレイクのテーブル定義を共通カタログにし、データ変換ジョブも管理したい。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html) |
| study-q196 | q196 | 3 | 4 | 売上明細と複数の大規模テーブルを継続的に集計する分析基盤が必要。データウェアハウスとして適切なのは。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html) |
| study-q197 | q197 | 3 | 4 | センサーデータをストリームで受け、複数の処理アプリが保持期間内に再読込したい。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html) |
| study-q198 | q198 | 3 | 4 | ストリームデータをバッファリングして S3 に届けたい。配信ワーカーの運用を最小化するには。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html) |
| study-q199 | q199 | 3 | 4 | 商品名の全文検索と検索結果の絞込みを提供したい。検索用の索引を扱うサービスは。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html) |
| study-q200 | q200 | 1 | 4 | S3 データレイクのテーブルへの分析者アクセスをまとめて管理したい。データレイク権限管理に特化したサービスは。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html) |
| study-rr07-02 | rr07-02 | 4 | 4 | 世界中へ同じ版付き商品画像をHTTP配信する。更新は新URLで行い、同一URLの内容は変えない。オリジンへの転送と要求を減らす構成はどれか。 | [AWS公式](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) |
| study-rr08-01 | rr08-01 | 3 | 4 | 既存コンテナの1ジョブは40分かかり分割できない。ホストOSの保守を減らしたい。候補のLambdaはManaged Instancesを使わない標準実行に限る。最も適するものはどれか。 | [AWS公式](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html) |
| study-rr09-01 | rr09-01 | 2 | 4 | 学習用の仮定：SQS到着率120件/秒、処理能力80件/秒で5分経過した。その後160件/秒へ増強した。到着は120件/秒のまま、初期滞留ゼロなら、増強後の解消時間はどれか。 | [AWS公式](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) |
| study-rr10-02 | rr10-02 | 1 | 4 | ALBで使う証明書AはACM発行・DNS検証済み、証明書Bは外部CAからインポートした。期限切れを防ぐ運用として適切なのはどれか。 | [AWS公式](https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html) |
| study-rr11-01 | rr11-01 | 2 | 4 | 学習用の実測：RTO30分・RPO5分に対し、障害検知3分、昇格5分、拡張8分、切替と業務確認6分、直前の複製遅延2分だった。適切な評価はどれか。 | [AWS公式](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) |
| study-rr12-01 | rr12-01 | 3 | 4 | センサーイベントを複数アプリが独立に数秒単位で処理し、翌日に保持期間内のデータを再読込したい。最も合う取り込み方式はどれか。 | [AWS公式](https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html) |
| study-rr12-03 | rr12-03 | 4 | 4 | 学習用の見積り：同じ性能・可用性のDB構成Aは固定100単位＋I/O60単位、Bは固定140単位でI/O別料金なし。現在最安の候補と、I/Oが10単位に減る場合の候補はどれか。 | [AWS公式](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html) |
| study-nr12-01 | nr12-01 | 4 | 4 | 先月の費用増の内訳をサービス別に調べ、今月の予測額が予算を超える場合に担当者へ通知したい。最も直接的な組合せは。 | [AWS公式](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html) |
| study-nr12-02 | nr12-02 | 4 | 4 | 経理が複数アカウントの費用を顧客コードと独自の共有費比率で配賦する。部門小計ではなく個々の使用明細をS3に保存しSQL処理したい。最適な出発点は。 | [AWS公式](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) |
| study-nr07-01 | nr07-01 | 4 | 4 | API Gateway配下の注文APIで429が増え、クライアントの即時無制限再試行がさらに負荷を上げている。下流の能力は今すぐ増やせない。受付後の応答喪失に備え、注文の二重登録も防ぐ改善は。 | [AWS公式](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html) |

## 別ゲームの設計課題

学習アプリ内の旧「設計クエスト」も確認した。主ゲームの228問とは別であり、231問の選択式問題と混同しない。

| 課題 | 要件と選択 | 評価 |
|---|---|---|
| MISSION 01 | EC2処理・S3結果保持・IAMロール、設計ポイント5 | 保存と一時認証の基礎。正答構成と説明は整合 |
| MISSION 02 | 複数AZ EC2・ALB・S3・IAMロール、設計ポイント9 | AZ分離・入口・状態の基礎。容量比較やリージョンDRは別演習が必要 |
| MISSION 03 | 非公開S3・IAMロール・フェデレーション/MFA、設計ポイント4 | 従業員認証と認可の基礎。全試験範囲の補完にはならない |
