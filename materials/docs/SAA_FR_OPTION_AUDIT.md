# FR-002 選択肢単位の点検記録

2026-10-08 JST。対象：[再レビュー指摘](SAA_REREVIEW_RESPONSE_REVIEW.md)、独立セット65問。**正答と解説を含むため、初回未読の受験前には読まない。**

作成者が問題文の必須条件、候補の成立する部分、採用・除外理由を点検。59問を改訂、005/008/023/028/039/046の6問は候補と解説を維持。以下は点検後の全候補を再掲した記録であり、生成や重複検査だけで内容の妥当性を認定したものではない。独立した技術監査、実受験者による難度・識別力の評価は未実施。

選択肢IDは保存用。画面の表示順・A/B/C/Dと同一とは限らない。複数選択の「採用」は必要な構成要素を表し、単独で全要件を満たす意味ではない。

## assessment-001

判断軸：委任先制限と顧客間の要求識別。改訂。

外部保守会社が多数の顧客へ同じ運用サービスを提供する。顧客Aの監査ロールは保守会社のアカウントを信頼しているが、別顧客がAのロールARNを指定して操作を誘導するリスクを防ぎたい。長期キーを配らず、委任先を保守会社に限定したうえで追加する条件は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 保守会社が顧客ごとに発行するExternal IDをAの信頼ポリシーで要求し、AssumeRole時に一致させる | 信頼する主体の制約と顧客別External IDを組み合わせ、他顧客の委任要求との取り違えを防ぐ。 |
| b | 除外 | 信頼先を保守会社の実行ロールに限定し、AssumeRoleの送信元を同社の固定IPに制限する | 保守会社とその経路を制限できるが、同じ実行ロール・経路を使う別顧客の委任要求を区別しない。 |
| c | 除外 | 監査ロールの許可をreports/のGetObjectに限定し、保守会社の各顧客に共通のExternal IDを設定する | 操作範囲は絞れるが、共通のExternal IDでは顧客Aと他顧客を区別できない。 |
| d | 除外 | 保守会社の実行ロールを信頼し、セッション時間を15分に制限してCloudTrailで追跡する | 一時認証と短い有効期間、事後追跡は実現するが、別顧客によるAのロール指定を認可時に区別しない。 |

出典：[AWS公式: iam](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) / [AWS公式: role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html) / [AWS公式: sts](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html)

## assessment-002

判断軸：メンバー管理者でも越えられない許可上限。改訂。

開発用OUでは特定リージョンへの新規EC2作成を禁止したい。各メンバーアカウントの管理者がAdministratorAccessを持っても制限を維持し、既存社員への実際の利用許可は今のIAMで管理する。選ぶ統制は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | OUに対象リージョンでの作成を拒否するSCPを適用し、IAMの許可と合わせて評価する | SCPはメンバーの許可上限を制約し、IAMのAllowだけでは明示的拒否を回避できない。 |
| b | 除外 | 各開発ロールのIAMポリシーで対象リージョンの作成をDenyし、ポリシー管理は各アカウント管理者へ委任する | 対象ロールでは拒否できるが、AdministratorAccessを持つ管理者がそのポリシーを変更でき、OU全体の上限にならない。 |
| c | 除外 | 標準開発ロールに対象リージョンを除外した境界を付け、新規ロール作成は各アカウント管理者へ委任する | 境界付きロールの上限は設定できるが、OU全主体や管理者の作成する別ロールまで共通に制約していない。 |
| d | 除外 | Configで対象リージョンのEC2を検出し、自動修復で停止して担当者へ通知する | 違反の発見と是正はできるが、作成要求を認可時に禁止する要件に対して事後対応となる。 |

出典：[AWS公式: policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html) / [AWS公式: scp](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) / [AWS公式: boundary](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) / [AWS公式: abac](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html) / [Control Towerによる複数アカウント統制](https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html) / [SAML認証とSCIMプロビジョニング](https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-idp.html) / [主体ポリシーとリソースポリシー](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html)

## assessment-003

判断軸：社内IdPと複数アカウントへの適切な権限配布。改訂。

買収した会社を含む社員が既存IdPで複数AWSアカウントを利用する。入退社はIdP側で管理し、部署グループ単位で本番の読取りと開発の更新権限を分けたい。個別IAMユーザーを各アカウントに大量作成せず構成するには。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | Identity CenterをIdPと連携し、ユーザー・グループ同期とアカウント別許可セット割当を管理する | 認証、プロビジョニング、権限割当をそれぞれ設定し、複数アカウントへの一時アクセスをまとめて管理できる。 |
| b | 除外 | IdPと各アカウントをSAML連携し、全社員へ共通の読取りロールを割り当てる | 既存IdPと一時アクセスは利用できるが、部署別・開発更新という権限差を表現していない。 |
| c | 除外 | 各アカウントに部署別IAMユーザーを作り、IdPの人事データからキーを定期更新する | 部署別権限は分けられるが、各アカウントの個別IAMユーザーを大量作成しない条件に反する。 |
| d | 除外 | Identity CenterをIdPと同期し、部署グループに本番・開発共通のAdministratorAccess許可セットを割り当てる | IDの一元管理はできるが、本番読取りと開発更新の区別より権限が広い。 |

出典：[AWS公式: external](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html) / [AWS公式: identity](https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html) / [AWS公式: cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) / [AWS公式: access](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html) / [AWS公式: s3block](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html) / [AWS公式: cognitoid](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html) / [SCPは付与ではなく上限、管理アカウントは対象外](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) / [Control Towerによる複数アカウント統制](https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html) / [SAML認証とSCIMプロビジョニング](https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-idp.html) / [主体ポリシーとリソースポリシー](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html)

## assessment-004

判断軸：直接クロスアカウントGetObjectの両側許可。改訂。

分析アカウントのロールから別アカウントのSSE-S3バケットのreports/だけを読みたい。SCP等の拒否はなく、ロールの信頼関係も有効である。別アカウントのロールへ切り替えず直接GetObjectする構成で、両側に必要な許可を2つ選べ。（2つ選択）

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 分析ロールに対象reports/*のGetObjectを許可する | 主体側で要求操作とリソース範囲を許可する必要がある。 |
| b | 採用 | 保存側バケットポリシーでその分析ロールのreports/*読取りを許可する | リソース所有側も当該外部主体を許可し、直接のクロスアカウントアクセスを成立させる。 |
| c | 除外 | 保存側バケットポリシーで、保存側の監査ロールへreports/*のGetObjectを許可する | 保存側監査ロールの読取りは許可するが、実際に直接要求する分析アカウントのロールとは主体が異なる。 |
| d | 除外 | 分析ロールに対象バケットのListBucketをreports/のprefix条件付きで許可する | reports/の一覧取得はできるが、オブジェクト本体のGetObjectは別の操作である。 |
| e | 除外 | 保存側監査ロールの信頼ポリシーで、分析ロールからのAssumeRoleを許可する | ロール切替の経路は構成できるが、本問は切り替えず直接GetObjectする条件である。 |

出典：[SCPは付与ではなく上限、管理アカウントは対象外](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) / [Control Towerによる複数アカウント統制](https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html) / [SAML認証とSCIMプロビジョニング](https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-idp.html) / [主体ポリシーとリソースポリシー](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html)

## assessment-005

判断軸：変動するアプリ層だけからDB接続。候補維持。

ALB配下のアプリはAuto ScalingでIPが変わる。DBは同じVPC内にあり、アプリのTCP5432だけを受けたい。ルートは正しく、運用者は増減のたびにIP一覧を更新したくない。最小範囲を保つ構成は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | ALB→アプリはALBのSG、アプリ→DBはアプリのSGを送信元に指定して必要ポートを許可する | 階層ごとにSGを参照し、IP増減に追随しながら必要な通信元だけを許可できる。 |
| b | 除外 | DBのSGでVPC全体のCIDRから5432を許可する | 増減には追随できるが、同じVPCの他の層からも接続可能となり最小範囲を超える。 |
| c | 除外 | DBのSGでALBのSGだけを5432の送信元にする | DBへの接続を開始するのはアプリであり、ALBのSGだけではアプリからの接続を許可しない。 |
| d | 除外 | DBのSGで現時点のアプリのプライベートIPを個別登録する | 現在の範囲は絞れるが、台数増減時のIP更新を避ける運用要件を満たさない。 |

出典：[AWS公式: sg](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) / [AWS公式: acl](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html) / [AWS公式: flow](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html) / [AWS公式: ssm](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)

## assessment-006

判断軸：NACLの受信443と戻り通信。改訂。

公開WebサブネットのSGとルートは検証済み。独自NACLで443の受信だけを許可したところ、利用者のTLS接続がタイムアウトする。既定Denyは維持し、正当なHTTPS要求への応答を通す修正は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | NACLの送信側で利用者のエフェメラルポート宛ての戻り通信を必要な範囲で許可する | NACLはステートレスなので、受信許可だけでは応答方向が許可されない。 |
| b | 除外 | NACLの送信側で利用者CIDRの宛先443を許可する | 外部HTTPSサーバーへ発信する通信には使えるが、今回の応答先は利用者のエフェメラルポートであり宛先が違う。 |
| c | 除外 | NACLの受信側で利用者CIDRの宛先エフェメラルポートを許可する | このサブネットがクライアントとして発信した接続の戻りには使えるが、今回はWebサーバーから利用者への送信許可が必要。 |
| d | 除外 | NACLの送信側でVPC内CIDRの全ポートを許可する | VPC内への応答は通せるが、公開Webを利用するVPC外のクライアント宛ての応答は対象にならない。 |

出典：[AWS公式: sg](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) / [AWS公式: acl](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html) / [AWS公式: flow](https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html) / [AWS公式: ssm](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html)

## assessment-007

判断軸：アプリの名前変更なし・インターネット経由なしの秘密取得。改訂。

インターネット出口のないVPC内のECSタスクがSecrets Managerを呼ぶ。タスクロールには対象Secretの読取り許可があり、既定のサービスDNS名を使い続けたい。必要なネットワーク構成は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | Secrets ManagerのInterface endpointを作り、プライベートDNSとタスクからの443を許可するSGを設定する | IAM許可に加えてプライベートな到達経路とDNS・通信許可を整える。 |
| b | 除外 | Secrets ManagerのInterface endpointを作り、タスクの設定をエンドポイント固有DNS名へ変更する | インターネットを通らない接続はできるが、既定のサービスDNS名を使い続ける条件に反する。 |
| c | 除外 | タスク用のNAT Gatewayを配置し、既定DNS名でSecrets Managerの公開エンドポイントへ接続する | 既定DNS名でAPIへ接続できるが、インターネット出口を設けない条件を満たさない。 |
| d | 除外 | Interface endpointとプライベートDNSを有効にし、エンドポイントのSGでは運用端末のSGから443を許可する | DNSと私設経路は用意できるが、接続元であるタスクのSGからの通信が許可されていない。 |

出典：[AWS公式: endpoint](https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html) / [AWS公式: privatelink](https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html) / [AWS公式: peering](https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html) / [AWS公式: tgw](https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html) / [AWS公式: vpn](https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html) / [AWS公式: direct](https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html)

## assessment-008

判断軸：オリジン保護と会員の複数ファイル認可。候補維持。

教材動画をCloudFrontで会員へ配信する。S3 RESTオリジンは非公開で、オリジンURLからの直接取得と未購入会員の視聴をどちらも防ぎたい。TLSは設定済み。必要な組合せは。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | OACと配信を限定したバケットポリシーに加え、購入者へ期限付きの署名付きCookie等を発行する | オリジン側と視聴者側の認可を別々に構成し、複数セグメントの会員配信を保護する。 |
| b | 除外 | OACと非公開バケットを設定し、CloudFrontには通常の公開URLで配信する | オリジン迂回は防げるが、配信側で購入者の認可を行わず未購入者も取得できる。 |
| c | 除外 | 購入者には署名付きCookieを配り、S3オリジンは匿名読取りも許可する | 会員の配信経路は制限できるが、オリジン直アクセスで購入確認を迂回できる。 |
| d | 除外 | 非公開S3とOACを構成し、CloudFrontでは国別制限だけを追加する | 地域の制約は購入資格を区別しない。同じ地域の未購入者への認可が不足する。 |

出典：[CloudFront オリジン](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html)

## assessment-009

判断軸：S3権限と対象KMSキーの復号権限。改訂。

別リージョンへコピー済みの暗号化バックアップを隔離アカウントで復元する。保存先S3には到達できるが、KMSのAccessDeniedで失敗した。キーは利用可能で、SCP等の拒否はない。最初に整合させる権限は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 実際にバックアップを保護するキーのポリシー等と復元主体のIAMに、必要な復号利用を許可する | S3読取りだけでなく、暗号文に対応するKMSキーをその主体が利用できる必要がある。 |
| b | 除外 | コピー時のロールに宛先キーのEncryptとGenerateDataKeyを許可する | 暗号化コピーの作成には役立つが、復元主体のDecryptという今回の失敗操作を許可していない。 |
| c | 除外 | 復元主体に保存先S3のGetObjectを許可し、バケットポリシーにも同じ主体を登録する | バックアップ本体へのアクセスは整うが、S3とは別のKMSキー利用許可の不足は解消しない。 |
| d | 除外 | 元アカウントのバックアップ作成ロールに、コピー先キーのDecryptを許可する | そのロールによる復号には役立つが、隔離アカウントで実行する復元ロールの許可ではない。 |

出典：[AWS KMS](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html) / [Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) / [KMSローテーションは既存データを再暗号化しない](https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html) / [KMSキー削除と復号不能の影響](https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html) / [ACMの更新対象とインポート証明書](https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html) / [DNS検証証明書の更新条件](https://docs.aws.amazon.com/acm/latest/userguide/dns-renewal-validation.html) / [分散トレースによる要求経路の調査](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html)

## assessment-010

判断軸：30日ローテーションと稼働アプリへの新値反映。改訂。

Fargate上のアプリがDBパスワードをイメージへ焼き込んでいる。イメージへの埋込みを解消し、30日以内ごとの秘密変更と取得経路を整えたい。ホストを管理せず、パスワード更新後にアプリが新しい値を使える設計は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | Secrets Managerで対応するローテーションを構成し、タスクロールで限定取得し、アプリの再取得や再起動方針を決める | 保管場所の変更だけでなく、実DBと秘密の更新、アプリが新値を利用するタイミングまで設計する。 |
| b | 除外 | Secrets Managerでローテーションし、秘密をタスク起動時の環境変数へ注入して長期稼働させる | 秘密の定期変更と起動時取得はできるが、稼働済みコンテナの環境変数は自動更新されず、新値への切替手順が不足する。 |
| c | 除外 | タスクロールでSecrets Managerを毎回参照し、パスワード変更は年1回の定期保守で行う | 新しい値を再取得できるが、問題で指定する30日以内の定期変更には間隔が長い。 |
| d | 除外 | DBパスワードを30日ごとに変更して新イメージへ含め、ECSサービスを更新する | 定期変更と新値利用はできるが、問題で求めるイメージへの秘密の埋込み解消を満たさない。 |

出典：[AWS KMS](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html) / [Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) / [ECS環境変数への秘密注入と更新](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html)

## assessment-011

判断軸：ACM発行とインポート証明書の更新責任。改訂。

2つのALBで、AはACM発行のDNS検証済み証明書、Bは外部CAの証明書をインポートして使う。毎年の更新漏れを防ぎ、ドメイン検証を維持したい。適切な運用は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | AはDNS検証レコードと更新適格な利用状態を維持し、Bは期限を監視して外部CAで更新後に再インポートする | ACM発行の管理更新と、インポート証明書の更新責任を区別する。 |
| b | 除外 | A・Bの更新通知を監視し、両ALBへの関連付けを維持する。更新作業はACMの管理更新へ任せる | 監視と利用状態の維持はできるが、インポート証明書BはACM管理更新の対象ではなく外部CAでの更新が必要。 |
| c | 除外 | AのDNS検証レコードは発行完了後に削除し、Bは期限前に外部CAで更新して再インポートする | Bの更新手順は適切だが、Aの継続的なDNS検証による更新条件を維持できない。 |
| d | 除外 | Aの検証レコードを維持し、Bは外部CAの更新証明書をS3へ保管して更新済みと記録する | Aの更新条件とBの新証明書の保管は満たすが、BをACMへ再インポートしてALBの提供証明書を更新する工程が足りない。 |

出典：[KMSローテーションは既存データを再暗号化しない](https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html) / [KMSキー削除と復号不能の影響](https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html) / [ACMの更新対象とインポート証明書](https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html) / [DNS検証証明書の更新条件](https://docs.aws.amazon.com/acm/latest/userguide/dns-renewal-validation.html) / [分散トレースによる要求経路の調査](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html)

## assessment-012

判断軸：変更主体と過去1週間の構成履歴。改訂。

監査担当は「誰がSGを開放したか」と「開放状態がいつから続いたか」を調べたい。API履歴の記録と構成変更の記録はあらかじめ有効にしている。直近1週間の構成スナップショットの履歴で開放期間を裏付ける場合、適切な調査先の組合せは。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | CloudTrailで変更主体と操作を調べ、ConfigでSGの構成履歴を確認する | 操作の証跡と、資源の設定がどう変化したかを別の記録から突き合わせる。 |
| b | 除外 | ConfigのSG構成タイムラインとVPC Flow Logsの通信記録を突き合わせる | 開放状態の期間やその間の通信は調べられるが、SG変更APIの実行主体を特定する証跡として不足する。 |
| c | 除外 | CloudTrailのSG変更イベントとALBアクセスログの要求数を突き合わせる | 変更主体と操作は追えるが、SGのルール構成がどの期間続いたかを確認する既存の構成履歴を利用していない。 |
| d | 除外 | 現在のSG設定と直近1時間のCloudTrailイベントを照合する | 現在の状態と最近の操作は調べられるが、1時間より前から続く設定の期間・変更主体を見落とし得る。 |

出典：[CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) / [CloudTrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html) / [AWS Config](https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html)

## assessment-013

判断軸：通常利用を保ちSQL注入と高頻度アクセスを抑止。改訂。

公開APIはALBで受け、SQLインジェクションと同一送信元からの大量HTTP要求が問題になっている。正常ユーザーのTCP接続は維持したい。アプリ修正と並行して導入する最も直接的な防御は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | ALBにWAFのWeb ACLを関連付け、該当する検査ルールとレートベースルールを調整する | HTTP内容の検査と要求頻度の制御を入口に適用できる。誤検知も確認する。 |
| b | 除外 | ALBにWAFのIP許可リストを関連付け、提携企業の固定IPだけを許可する | 入口で送信元を限定できるが、一般の正常ユーザーも利用する公開APIの継続条件に合わない。 |
| c | 除外 | ALBにWAFのSQL攻撃検査ルールを関連付け、バックエンドをAuto Scalingで増減する | SQL攻撃を検査し処理余力を増やせるが、同一送信元の大量要求を制御する対策が不足する。 |
| d | 除外 | ALBにWAFのレートベースルールを関連付け、SQL攻撃の内容検査はアプリの次回改修で導入する | 大量要求には対処するが、改修と並行してSQL攻撃も入口で抑える今回の目的を満たさない。 |

出典：[セキュリティサービス](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/security-services.html) / [AWS WAF](https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html)

## assessment-014

判断軸：元バケットの全対象バージョンを7年保護。改訂。

元バケットの監査ファイル各バージョンは保存後7年間、管理者の操作でも保持期間を短くして消せないことが要件である。上書き前の版も残したい。新規バケットの設計として必要な施策を2つ選べ。（2つ選択）

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | S3 VersioningとObject LockのCompliance保持を要件に合わせて設定する | バージョンと保持期限を組み合わせ、保持期間中の削除・短縮を制限する。 |
| b | 採用 | 保持対象バージョンと期間を確認し、期限前の削除を前提にしないライフサイクルを設計する | 保護単位はバージョンであり、保存費や移行・削除の時期も保持条件へ合わせる。 |
| c | 除外 | Versioningと7年のGovernance保持を設定し、緊急運用ロールに保持回避権限を許可する | 通常の削除を制限し版も残せるが、保持回避ができる管理者にも短縮・削除を許さない条件に反する。 |
| d | 除外 | Versioningと7年保持のバックアップを別アカウントへ作成し、元バケットの旧版は30日で削除する | 別コピーを長期保持できるが、元の保持対象バージョンを7年間消せないという要件を満たさない。 |
| e | 除外 | Versioningを有効にし、旧版を30日後にGlacierへ移行して7年後に期限切れとする | 版の長期保存と階層移行は計画できるが、ライフサイクルだけでは管理者の期限前削除を禁止しない。 |

出典：[AWS公式: version](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html) / [AWS公式: lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html) / [AWS公式: replication](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html) / [AWS公式: signed](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) / [AWS公式: fsx](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is.html) / [AWS公式: snapshot](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html)

## assessment-015

判断軸：タグ一致と両側のタグ変更統制。改訂。

Projectタグが一致するリソースだけを開発者が更新できるABACを導入する。開発者は自分の主体タグや資源タグも自由に書き換えられる現状である。認可条件の迂回を防ぐ追加設計は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 認可に使うタグの付与・変更権限を制約し、主体タグと資源タグの条件を必要な操作に適用する | 一致条件だけでなく、その条件値を誰が変更できるかも統制する。 |
| b | 除外 | Projectタグ一致を更新のAllow条件とし、タグ編集は既存の開発者ポリシーで管理する | 一致条件による絞込みはできるが、現状の自由なタグ編集権限が残り、条件値を書き換えて迂回できる。 |
| c | 除外 | 主体のProjectタグ変更を管理専用ロールへ限定し、開発者にはリソースのProjectタグ編集を許可する | 主体側の変更は制限するが、リソース側を自分に合わせる迂回経路が残る。 |
| d | 除外 | リソースのProjectタグ変更を管理専用ロールへ限定し、開発者には自分の主体タグ編集を許可する | リソース側の変更は制限するが、主体側を対象リソースに合わせる迂回経路が残る。 |

出典：[AWS公式: policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html) / [AWS公式: scp](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) / [AWS公式: boundary](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) / [AWS公式: abac](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html)

## assessment-016

判断軸：権限委任と境界の解除・差替え防止。改訂。

運用チームにロール作成を委任するが、作成したロールで自分以上の権限へ昇格させたくない。チームはポリシーを付け替えられる。アクセス許可の境界を使う場合、抜け道を避ける設計は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 指定境界付きの作成だけを許可し、委任先が境界を外す・変更する操作も制限する | 上限を付けるだけでなく、その上限を委任先自身が解除できないようにする。 |
| b | 除外 | ロール作成時に指定境界を要求し、作成後の境界変更・削除は委任チームへ許可する | 作成時の上限は強制できるが、後から境界を解除して権限を広げられる。 |
| c | 除外 | 指定境界の削除を拒否し、別の境界ポリシーへの変更は委任チームへ許可する | 境界なしにはできなくても、より広い境界への付替えで指定上限を迂回できる。 |
| d | 除外 | 境界のARNを固定して削除・付替えを拒否し、その管理ポリシーの新バージョン作成は委任する | ARN自体は固定できるが、境界ポリシーの内容を広げることで上限を変更できる。 |

出典：[AWS公式: policy](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html) / [AWS公式: scp](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html) / [AWS公式: boundary](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html) / [AWS公式: abac](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html)

## assessment-017

判断軸：ブラウザーから直接・利用者別範囲・一時認証。改訂。

スマートフォン会員アプリでログイン後、利用者ごとに限定したS3領域へ直接アップロードさせたい。AWSの長期キーは端末へ埋め込まない。選ぶ構成は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | Cognitoユーザープール等で認証し、IDプールから限定ロールの一時認証情報を取得する | 会員認証とAWS資源への一時認可を分け、対象プレフィックス等を権限で制約する。 |
| b | 除外 | IDプールから全会員共通の一時ロールを払い出し、会員用バケット全体のPutObjectを許可する | 端末に長期キーを置かず直接アップロードできるが、利用者ごとの領域への限定がない。 |
| c | 除外 | ユーザープールで認証し、アップロード本文をAPIサーバー経由でS3へ保存する | 会員認証とサーバー側の権限管理はできるが、端末からS3へ直接アップロードする条件に合わない。 |
| d | 除外 | 会員ごとのIAMユーザーにS3プレフィックスを割り当て、そのキーを端末の安全な保存領域へ配る | 会員別の範囲は限定できるが、長期キーを端末へ配らない条件に反する。 |

出典：[AWS公式: external](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html) / [AWS公式: identity](https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html) / [AWS公式: cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html) / [AWS公式: access](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html) / [AWS公式: s3block](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html) / [AWS公式: cognitoid](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html)

## assessment-018

判断軸：端点間全区間の暗号化。改訂。

工場とAWS間に専用線がある。回線の帯域は十分だが、機密データについてアプリ端点間の暗号化が監査要件である。専用線の利用を継続しながら要件を満たす方針は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | アプリ端点間のTLS等を構成し、専用線の冗長性と暗号化の範囲を別々に検証する | 専用接続そのものを端点間暗号化と同一視せず、指定された範囲を保護する。 |
| b | 除外 | Direct Connect接続へ対応するMACsecを設定し、アプリ間は既存のHTTPを利用する | 対応する回線区間は暗号化できるが、アプリ端点までの区間全体の暗号化にはならない。 |
| c | 除外 | 専用線の上に拠点ルーターからAWS VPN終端までのIPsecを構成し、終端後はHTTPで通信する | トンネル区間は保護できるが、VPN終端からアプリまでを含む端点間暗号化の条件を満たさない。 |
| d | 除外 | TLSをAWSのALBで終端し、ALBからアプリへはHTTPで転送する | 工場からALBまでは暗号化できるが、AWSアプリ端点までの暗号化が連続しない。 |

出典：[Direct Connectの既定は通信暗号化なし](https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html) / [Direct Connectの冗長経路設計](https://docs.aws.amazon.com/directconnect/latest/UserGuide/resiliency_toolkit.html) / [CloudFront TTLとオリジン負荷](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) / [Global Acceleratorの固定IPと正常な到達先](https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html)

## assessment-019

判断軸：エンドポイント経路とGetObject主体権限。改訂。

S3へのGateway endpointを作りネットワーク経路は通る。監査では特定バケットだけをGetObjectさせたいが、対象ロールにS3権限はまだない。エンドポイントポリシーで対象をAllowした後の正しい理解は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | エンドポイント側の制約に加えてIAM等で対象バケット操作を許可する必要がある | 経路のポリシーだけで主体の利用権限が付与されるわけではない。 |
| b | 除外 | 対象バケットをAllowするエンドポイントポリシーを設定し、ロールにはListBucketを許可する | 経路制約と一覧取得は整うが、データを読むGetObjectの許可を満たさない。 |
| c | 除外 | ロールに全バケットのGetObjectを許可し、エンドポイントはデフォルトの全許可ポリシーへ戻す | 読取りはできるが、今回指定する特定バケットへの利用限定を失う。 |
| d | 除外 | エンドポイントポリシーを維持し、ロールには対象バケットのPutObjectを許可する | 同じバケットへ書き込む経路は構成できるが、要求されたGetObjectは別の操作である。 |

出典：[AWS公式: endpoint](https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html) / [AWS公式: privatelink](https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html) / [AWS公式: peering](https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html) / [AWS公式: tgw](https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html) / [AWS公式: vpn](https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html) / [AWS公式: direct](https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html) / [NATの時間・処理量・AZ間転送の費用要因](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html) / [ゾーン型NATのAZ障害と同一AZ経路](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html)

## assessment-020

判断軸：バックアップ保持期間と復号鍵の寿命。改訂。

暗号化バックアップを10年保持する一方、KMSキーの削除を検討している。復元試験は旧キーを利用して成功しており、別キーへの再暗号化はしていない。削除前の判断として適切なのは。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | そのキーに依存する暗号文と復元要件を棚卸しし、必要なバックアップが残る間はキーの利用可能性を確保する | バックアップ本体があっても必要なキーを失うと復号できないため、保持と鍵の寿命を整合させる。 |
| b | 除外 | 旧キーのエイリアスを新キーへ向け、以後のバックアップを新キーで作成して旧キーの削除を予約する | 新規バックアップの依存先は切り替えられるが、保持中の旧暗号文の復号には旧キーが必要である。 |
| c | 除外 | 旧キーの利用ログを直近30日調べ、Decryptがなければ削除を予約する | 最近の使用は把握できるが、長期保持バックアップは最近復元していなくても将来そのキーを必要とする。 |
| d | 除外 | 同じ暗号化バックアップを別バケットへ複製し、オブジェクト数を照合してから旧キーを削除する | データのコピーは増やせるが、同じキーで暗号化されたコピーは鍵の喪失に対して独立ではない。 |

出典：[AWS KMS](https://docs.aws.amazon.com/kms/latest/developerguide/overview.html) / [Secrets Manager](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html) / [KMSローテーションは既存データを再暗号化しない](https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html) / [KMSキー削除と復号不能の影響](https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html) / [ACMの更新対象とインポート証明書](https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html) / [DNS検証証明書の更新条件](https://docs.aws.amazon.com/acm/latest/userguide/dns-renewal-validation.html) / [分散トレースによる要求経路の調査](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html)

## assessment-021

判断軸：1AZ喪失後1000件/秒と最小の常設容量。改訂。

注文APIはピーク毎秒1,000件で、単一AZ停止後も同じ量を処理する。障害時の追加起動は計画に含めない。入口・状態・DBは要件を満たし、計算費は確保する総処理能力に比例する学習用モデルとする。平常時と障害後の容量を満たす、最も低費用の配置は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 3 AZに各毎秒600件の能力を確保する | 通常1,800件/秒、1 AZ停止後1,200件/秒で要件を満たし、各AZで1,000件/秒を確保する適合案より常設容量が少ない。 |
| b | 除外 | 2 AZに各毎秒600件の能力を確保する | 通常1,200件/秒でピークを満たすが、1 AZ停止後600件/秒となり不足する。 |
| c | 除外 | 3 AZに各毎秒400件の能力を確保する | 通常1,200件/秒でピークを満たすが、1 AZ停止後800件/秒となり不足する。 |
| d | 除外 | 3 AZに各毎秒1,000件の能力を確保する | 停止後も2,000件/秒で継続できるが、各AZで600件/秒を確保する適合案より常設容量と仮定の費用が大きい。 |

出典：[AWS公式: regions](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html) / [AWS公式: ec2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html) / [AWS公式: spot](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html) / [EC2インスタンスストア](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html) / [障害後も新規起動に依存しない残存容量](https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_withstand_component_failures_static_stability.html) / [ALBの正常ターゲット選択と全異常時のfail-open](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html)

## assessment-022

判断軸：別インスタンスで直ちにカートを引継ぐ。改訂。

チケット販売サイトは2 AZのALB配下で自動増減するが、カートを各EC2のローカルメモリに置いている。通常時の粘着セッションは有効でも、インスタンス障害でカートが消える。障害後の別ノードで、運用者の作業を待たずカート内容を引き継げる構成は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | カートを要件に合う共有の永続ストアへ移し、アプリノードを交換可能にする | 振分け先が変わっても状態を読み直せるようにし、ノード障害と利用者の状態を切り離す。 |
| b | 除外 | カートをローカルメモリに保持し、粘着セッションの有効期間を購入完了の想定時間まで延ばす | 正常ノードへの再訪では同じ状態を利用できるが、障害で失ったノードの状態を別ノードへ引き継げない。 |
| c | 除外 | カートをEC2のEBSへ定期保存し、障害時に運用者がボリュームを別ノードへ付け替える | メモリだけより永続性は高いが、自動増減する別ノードで直ちに継続する共有状態の設計ではなく、保存間隔や付替え待ちが残る。 |
| d | 除外 | ALBのヘルスチェックを短くし、異常時は別ノードに新しい空のカートを作成する | 入口は正常ノードへ切り替わるが、利用者の既存カート内容が引き継がれない。 |

出典：[AWS公式: asg](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html) / [AWS公式: scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scheduled-scaling.html) / [AWS公式: health](https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html)

## assessment-023

判断軸：AZ障害の自動切替とコミット済みデータ。候補維持。

受注DBは単一リージョンのRDS for PostgreSQLで、AZ障害時の自動切替を優先する。読取り負荷は十分低く、アプリは再接続に対応する。同期スタンバイを使う従来型構成として適切なのは。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | Multi-AZ DBインスタンス構成を使い、切替時の接続再試行を実装する | 別AZの同期スタンバイへの切替と、アプリ側の接続回復を組み合わせる。スタンバイは読取り用ではない。 |
| b | 除外 | 同じAZにRead Replicaを置き、障害時は監視通知を受けて手動昇格する | 読取り先は増やせるがAZ障害を共有し、指定された同期スタンバイの自動切替でもない。 |
| c | 除外 | 別AZに非同期Read Replicaを置き、手動昇格と接続先変更の手順を用意する | AZは分離できるが、指定された同期スタンバイと自動切替の構成を満たさない。 |
| d | 除外 | 単一AZのDBを維持し、別リージョンへバックアップを複製して復元する | 地域障害の備えにはなるが、今回必要なAZ障害時の自動切替ではない。 |

出典：[AWS公式: multi](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html) / [AWS公式: replica](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html)

## assessment-024

判断軸：コミット後の重複配送でも業務効果を一度にする。改訂。

決済ワーカーはSQS Standardから受信後、DBへの記録には成功したがDeleteMessage前に停止した。再配信で二重計上を防ぎながら未処理の要求は再実行したい。選ぶ設計は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 要求IDの一意制約等で業務更新を冪等にし、正常処理後にメッセージを削除する | 少なくとも1回の配信を前提に、受信回数と業務上の計上回数を切り離す。 |
| b | 除外 | 受信直後にDeleteMessageし、DB更新は失敗時にプロセス内で再試行する | 通常時の重複配信を減らせるが、削除後にプロセスが停止すると未計上要求をキューから復旧できない。 |
| c | 除外 | 可視性タイムアウトを処理時間より長く設定し、DB記録後にDeleteMessageする | 処理中の再受信は抑えられるが、DB成功後・削除前の停止による再配信と二重計上は残る。 |
| d | 除外 | 各ワーカーのメモリに処理済み要求IDを保存し、受信時に同じワーカー内で重複を除く | 同じプロセス内では重複を除けるが、停止後や別ワーカーへの再配信で記録が引き継がれない。 |

出典：[SQS の可視性タイムアウト](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) / [SQS・SNS・EventBridge の選択](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/sns-or-sqs-or-eventbridge.html) / [DLQの調査・再投入・保持期間](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) / [1台当たりバックログによるスケーリング](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html) / [LambdaのSQS部分バッチ応答](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html)

## assessment-025

判断軸：10件バッチ維持・成功項目の除外・失敗本文の自動隔離。改訂。

LambdaがSQS Standardの10件をまとめて処理し、バッチ全体の成否を返している。1件の形式不正で成功した9件も再処理される。処理時間は上限内でタイムアウトはない。10件のバッチサイズを維持し、成功済み項目を再配信対象から外し、不正メッセージ本体を自動隔離して後で再投入したい。組み合わせる施策を2つ選べ。（2つ選択）

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 部分バッチ応答を有効にし、失敗したメッセージIDを正しく返す | バッチ全体の失敗として扱わず、成功済みのメッセージの不要な再試行を減らす。 |
| b | 採用 | 適切な最大受信回数とDLQを設定し、移動後の監視・修正・再投入手順を整える | 繰り返し失敗する項目を隔離して調査可能にし、修正後の復旧まで設計する。 |
| c | 除外 | バッチサイズを1件へ変更し、各実行の成否で個別に再試行する | 成功項目を巻き込む再試行は減らせるが、10件のバッチサイズを維持する条件に反する。 |
| d | 除外 | 可視性タイムアウトを延ばし、バッチ全体の失敗を返して再試行間隔を長くする | 再試行の頻度は下げられるが、形式不正は解消せず、成功済み項目もバッチごと再配信される。 |
| e | 除外 | 不正項目の例外をログへ記録し、バッチ全体の成功を返す | 成功済み項目の反復は止まるが、元メッセージ本体をキューへ隔離して再投入する経路が残らない。 |

出典：[SQS のデッドレターキュー](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) / [CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) / [SQSの不可視期間・再受信と削除](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) / [1台当たりバックログによるスケーリング](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html) / [LambdaのSQS部分バッチ応答](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html)

## assessment-026

判断軸：全購読者へ独立配送し夜間8時間分を保持。改訂。

注文イベントを請求・発送・分析の3サービスがそれぞれ全件処理する。分析は毎晩8時間停止するが、他のサービスは継続し、分析は翌朝追い付く必要がある。適切な構成は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | SNSからサービスごとのSQSへ配信し、各サービスが自分のキューを消費する | 全サービスへの複製と、個別の蓄積・再試行を両立できる。 |
| b | 除外 | 注文イベントを単一SQSへ入れ、3サービスのワーカーで並行消費する | 蓄積と消費の並列化はできるが、競合消費では各サービスが全件を受け取らない。 |
| c | 除外 | SNSから請求・発送のキューへ配信し、分析には夜間停止中のHTTPエンドポイントへ同期転送する | 請求・発送は独立して処理できるが、分析の計画停止を翌朝まで吸収する専用の蓄積経路がない。 |
| d | 除外 | SNSから3つの専用SQSへ配信し、分析キューの保持期間を1時間に設定する | 全サービスへの複製と分離は実現するが、翌朝までの停止が1時間を超えると分析分が期限切れになる。 |

出典：[SQS の可視性タイムアウト](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) / [SQS・SNS・EventBridge の選択](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/sns-or-sqs-or-eventbridge.html)

## assessment-027

判断軸：RPO15分と復旧工程合計60分。改訂。

店舗システムはRPO15分・RTO60分が要件である。バックアップ間隔が最大データ損失幅に相当し、復元・設定再現・業務確認は順次実行する学習用モデルとする。検証値どおりに復旧できる場合、両要件を満たす案は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 15分間隔で保護し、復元25分・設定20分・業務確認10分で復旧する | データ損失は最大15分、復旧は合計55分で両方の目標以内。 |
| b | 除外 | 60分間隔で保護し、復元25分・設定20分・業務確認10分で復旧する | 復旧55分はRTO内だが、最大60分のデータ損失がRPOを超える。 |
| c | 除外 | 15分間隔で保護し、復元45分・設定20分・業務確認10分で復旧する | RPOは満たすが、復旧合計75分がRTO60分を超える。 |
| d | 除外 | 60分間隔で保護し、復元15分・設定10分・業務確認10分で復旧する | 復旧35分は十分速いが、保護の間隔がRPO15分を超える。 |

出典：[災害復旧戦略](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) / [S3 File GatewayのNFS/SMBとキャッシュ](https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html) / [容量予約とクォータの区別](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html) / [DataSyncの移行・継続転送](https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html) / [Transfer Familyのファイル転送プロトコル](https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html)

## assessment-028

判断軸：リージョン障害後10分以内の業務再開。候補維持。

リージョン障害後のRTOは10分である。全環境の新規構築には40分、縮小稼働環境の拡張と切替は訓練で8分だった。複製遅延はRPO以内で、復旧先のクォータ・容量も検証済み。適切な戦略は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 縮小したアプリ全体を復旧先で稼働させるWarm Standbyを選び、8分の手順を定期検証する | 稼働済みの環境を拡張する測定値がRTO内であり、複製と容量の前提も満たしている。 |
| b | 除外 | バックアップを別リージョンへ保持し、障害後にIaCで40分かけて全環境を構築する | 構成再現性は高められても、検証された40分はRTO10分を超える。 |
| c | 除外 | DBだけを常時動かすPilot Lightへ削減し、40分かかるアプリの新規構築を障害後に行う | 待機費は下げられても、提示されたアプリ構築時間がRTOを超える。 |
| d | 除外 | 同じリージョンの3 AZへ本番を増やし、別リージョンの待機環境は廃止する | AZ耐障害性は高められるが、対象のリージョン障害に対する復旧先を失う。 |

出典：[災害復旧戦略](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) / [S3 File GatewayのNFS/SMBとキャッシュ](https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html) / [容量予約とクォータの区別](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html) / [DataSyncの移行・継続転送](https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html) / [Transfer Familyのファイル転送プロトコル](https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html)

## assessment-029

判断軸：本番用復旧権限で業務操作まで検証。改訂。

暗号化バックアップを別アカウントへ隔離した。削除耐性と復元手順の実効性を確かめたい。復元時の鍵利用を含め、本番障害前に行う最も適切な確認は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 隔離先の実際の復元ロールで復元し、鍵・ネットワーク・依存先・業務読書きまで試験する | オブジェクトの存在だけでなく、別アカウントの権限と業務再開まで検証できる。 |
| b | 除外 | 元アカウントの作成ロールでバックアップ一覧と復元用オブジェクトの読取りを確認する | バックアップの存在と元の主体の読取りは確認できるが、隔離先の実際の復元主体・復号・業務再開を試していない。 |
| c | 除外 | 隔離先の復元ロールでDBを復元し、管理画面の利用可能ステータスを記録する | 実際の主体による復号・DB復元は確認できるが、業務からの接続・依存先・読書きまでは検証できない。 |
| d | 除外 | 隔離先の管理者ロールで復元し、業務の読書きテストを実行する | 復元データと業務動作は検証できるが、実運用の限定された復元ロールでも成功することを確認できない。 |

出典：[災害復旧戦略](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) / [S3 File GatewayのNFS/SMBとキャッシュ](https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html) / [容量予約とクォータの区別](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html) / [DataSyncの移行・継続転送](https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html) / [Transfer Familyのファイル転送プロトコル](https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html)

## assessment-030

判断軸：リージョン障害と誤上書きの両方に備える。改訂。

ファイルの誤上書きから直前版へ戻すことと、リージョン障害時に別リージョンで利用することを両立したい。非同期複製の未反映時間は許容する。必要な構成として適切なのは。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | Versioningで世代を保持し、要件に合うS3レプリケーションと復旧時の参照先切替を設計する | 論理的な上書きとリージョン障害を別々の仕組みで扱い、複製遅延も前提に含める。 |
| b | 除外 | Versioningを有効にし、同一リージョンの別バケットへ全世代を定期コピーする | 誤上書きの前の版は残せるが、リージョン障害に対する別リージョンの利用先を用意していない。 |
| c | 除外 | 別リージョンに最新オブジェクトを定期コピーし、両側の旧版をコピー完了時に削除する | 別リージョンで最新データを利用できるが、誤上書きもコピーされると直前版が残らない。 |
| d | 除外 | Versioningを有効にし、リージョン障害を検出してから別リージョンへのコピーを開始する | 通常時の版復元はできるが、元リージョンへアクセスできない障害中には必要なコピーを新たに作れない。 |

出典：[AWS公式: classes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html) / [AWS公式: lifecycle](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html) / [AWS公式: glacier](https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects.html) / [AWS公式: replication](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html) / [AWS公式: s3encrypt](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingServerSideEncryption.html) / [AWS公式: version](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html) / [AWS公式: lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html) / [AWS公式: signed](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) / [AWS公式: fsx](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is.html) / [AWS公式: snapshot](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html)

## assessment-031

判断軸：NAT障害範囲と既存ルートによるAZ別継続。改訂。

2 AZのプライベートワーカーが外部のライセンスAPIへ定期通信する。片方のAZが失われても残ったワーカーが外へ出られることを求める。AZ間転送も避けたい。最も適切な出口構成は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | AZごとにNAT Gatewayを配置し、各プライベートサブネットは同じAZのNATへルーティングする | 出口のAZ依存を分離し、平常時のAZをまたぐNAT経路も避けられる。 |
| b | 除外 | AZ-AにだけNAT Gatewayを置き、両AZの全外向き経路を集約する | NATのあるAZが失われると残存AZの出口も失い、平常時のAZ間転送も生じる。 |
| c | 除外 | 両AZにNAT Gatewayを置き、両サブネットの既定経路はAZ-Aへ向け、障害時に手動で変更する | 代替の出口自体はあるが、手動切替まで継続できず、平常時はAZ-BからAZ間転送が生じる。 |
| d | 除外 | 各AZのNAT Gatewayへ、反対側AZのプライベートサブネットから既定経路を向ける | 両AZに出口を配置できるが、平常時にAZ越境し、片方の停止で残存ワーカーの宛先NATも失う。 |

出典：[AWS公式: route](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html) / [AWS公式: nat](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html) / [AWS公式: egress](https://docs.aws.amazon.com/vpc/latest/userguide/egress-only-internet-gateway.html) / [NATの時間・処理量・AZ間転送の費用要因](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html) / [ゾーン型NATのAZ障害と同一AZ経路](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html) / [Gateway endpointの対象・ルート・追加料金なし](https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html)

## assessment-032

判断軸：障害検知とDNSキャッシュ残存時間。改訂。

2リージョンのAPIをDNSフェイルオーバーで切り替える。セカンダリは復旧済みでも、一部クライアントは旧アドレスへ接続して失敗する。ヘルスチェックが正常に検出している場合の説明と対策は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | DNSキャッシュが残る時間と接続再試行を考慮し、TTL設定・クライアント挙動を含めて切替時間を検証する | 権威DNSで応答が変わっても、全利用者が同時に再解決するわけではない。 |
| b | 除外 | ヘルスチェックの間隔を短くし、DNSレコードとクライアントの再解決間隔は維持する | 新たな障害の検出は速まるが、今回は既に検出済みであり旧アドレスのキャッシュ保持を解消しない。 |
| c | 除外 | セカンダリの台数を増やし、DNSレコードとクライアントの接続管理は維持する | 切替先の処理能力は増えるが、旧アドレスを保持したクライアントの接続先は変わらない。 |
| d | 除外 | TTLを1日に延ばし、クライアントはキャッシュ期限が来てから名前を再解決する | DNS照会回数を減らせるが、障害時も旧応答を長く保持し、早い切替の目的に劣る。 |

出典：[Route 53 ルーティング](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html)

## assessment-033

判断軸：通常DXと退避時300Mbpsの継続。改訂。

拠点はDirect Connectを使い、切断時はSite-to-Site VPNへ切り替わる。重要通信300Mbpsを障害時も維持し、回線変更は必要最小限にしたい。単一VPN経路は試験で安定して200Mbpsまでだった。学習用の実測値に基づき次に進める案は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 代替経路の分散・増強を検証し、重要通信300Mbpsを運べる容量を確保する | 必要なのは切断後の代替帯域である。複数経路も分散条件とフロー上限を実測して300Mbpsを満たす必要がある。 |
| b | 除外 | 通常時のDirect Connect帯域を倍増し、切断時は現状のVPN経路へ切り替える | 通常時の余力は増えるが、障害時の200Mbps制約は残る。 |
| c | 除外 | VPNへ重要通信を優先するQoSを適用し、総帯域200Mbpsで運用する | 重要通信の優先順位は上げられるが、重要通信だけでも300Mbps必要なので不足する。 |
| d | 除外 | VPNの経路優先度を上げて常時使用し、Direct Connectを待機経路にする | 切替方式は変えられるが、常用時から200Mbpsの経路で300Mbpsを運ぶことになり不足する。 |

出典：[Direct Connectの既定は通信暗号化なし](https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html) / [Direct Connectの冗長経路設計](https://docs.aws.amazon.com/directconnect/latest/UserGuide/resiliency_toolkit.html) / [CloudFront TTLとオリジン負荷](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html) / [Global Acceleratorの固定IPと正常な到達先](https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html)

## assessment-034

判断軸：Lambda同時実行100の上限と下流保護。改訂。

Lambdaから接続するDBは安全に同時100接続まで処理できる。1実行1接続で、イベントが急増するとDBが過負荷になる。バッファと再試行は設計済み。下流を守る施策は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 同時実行数を下流能力に合わせて制限し、滞留とエラーを監視して処理速度を調整する | Lambdaの増加余地だけでなくDB制約を上限に含め、急増をバッファで吸収する。 |
| b | 除外 | プロビジョンド同時実行数を100へ設定し、予約済み同時実行数は未設定で運用する | 100実行の起動準備はできるが、プロビジョンド同時実行は実行数の上限ではなく、追加実行でDB能力を超え得る。 |
| c | 除外 | Lambdaメモリを増やして1件の処理を短縮し、イベントソースの並列化上限を200へ設定する | 処理時間短縮は期待できるが、1実行1接続で最大200実行では同時100接続の制約を保証しない。 |
| d | 除外 | DB接続失敗時にバックオフを行い、Lambdaの同時実行はリージョンクォータの範囲で増やす | 再試行の集中は緩和できるが、最初の試行による同時接続が下流の上限を超える問題は残る。 |

出典：[Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) / [SQS の可視性タイムアウト](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) / [標準Lambdaの900秒とManaged Instancesの条件付き例外](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html) / [Lambdaのメモリに比例するCPU配分](https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html) / [SQSイベントソースの最大同時実行制御](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html) / [Batchのジョブキューと実行基盤](https://docs.aws.amazon.com/batch/latest/userguide/what-is-batch.html) / [予約済み同時実行とプロビジョニング済み同時実行](https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html)

## assessment-035

判断軸：誤更新を複製したDBを更新前へ戻す。改訂。

業務アプリが誤ったUPDATEを大量実行した。Multi-AZへの同期は正常で、接続数にも余裕がある。事故前の時刻へデータを戻し、内容を確認してからアプリを切り替えたい。適切な対応は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 有効なPITRで事故前時刻の新しいDBへ復元し、整合性・接続先を検証して切り替える | 同期冗長化では誤更新も反映されるため、過去の保護時点へ復元する手段を使う。 |
| b | 除外 | 現在のMulti-AZスタンバイへフェイルオーバーし、アプリを再接続する | DBノードやAZ障害の切替には使えるが、同期済みの誤更新も切替先へ反映されている。 |
| c | 除外 | 事故後の最新スナップショットを新しいDBへ復元し、内容を検証して接続先を変更する | 分離したDBで確認できるが、事故後の保護時点では取り消したい更新を含んでいる。 |
| d | 除外 | 事故後にRead Replicaを新設して追随を待ち、昇格したDBへ切り替える | 移行・昇格の経路は用意できるが、事故後の状態を複製するため事故前のデータへ戻らない。 |

出典：[AWS公式: backup](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html) / [AWS公式: proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html) / [AWS公式: cache](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html) / [AWS公式: dax](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html)

## assessment-036

判断軸：別リージョン手作業と障害後の増枠待ちを削減。改訂。

バックアップと秘密・鍵の復元は確認済みだが、災害訓練で復旧先のSG再現とEC2上限調整に長時間を要した。データ複製方式は維持する。手作業の再作成と障害後の増枠待ちを減らす施策を2つ選べ。（2つ選択）

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | SG等の構成をIaCで管理し、復旧先でも展開・差分検証する | 手作業の設定漏れと再現時間を減らし、復旧先で使えることを確認する。 |
| b | 採用 | 復旧時の必要台数とサービスクォータを事前に確認し、必要な増枠や容量確保を計画する | 平常時の利用量ではなく障害時の拡張量から制約を先に解消する。 |
| c | 除外 | バックアップ間隔を短縮し、復旧先への複製遅延を監視する | RPOやデータ鮮度は改善できるが、確認済みのデータ保護とは別のSG再現・起動上限の問題は解決しない。 |
| d | 除外 | 元リージョンのEC2クォータを増枠し、その値を復旧手順の台数として記載する | 元リージョンでは拡張できるが、実際に起動する復旧先リージョンの適用値は別途整える必要がある。 |
| e | 除外 | 復旧先SGの作成後にConfigで差分を検知し、通知を受けた運用者が手修正する | 設定差分の発見には役立つが、毎回の手作業での作成・修正を減らす再現性の改善には劣る。 |

出典：[S3 File GatewayのNFS/SMBとキャッシュ](https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html) / [DR方式・IaC・復元検証の条件](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) / [容量予約とクォータの区別](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html) / [DataSyncの移行・継続転送](https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html) / [Transfer Familyのファイル転送プロトコル](https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html)

## assessment-037

判断軸：中断可能分析と中断困難APIの購入方式。改訂。

夜間の画像解析はチェックポイントから再開でき、翌日までに完了すればよい。一方、制御APIには中断が許されず、特定AZの起動容量も確保したい。適切な役割分担は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 解析は中断対応したSpotを活用し、制御APIは要件に合う通常実行とCapacity Reservation等で必要容量を確保する | 中断許容性と起動容量の要求をワークロードごとに分ける。割引契約だけでは容量の代替にならない。 |
| b | 除外 | 解析と制御APIをSpotで実行し、制御APIは2分前の中断通知で再起動する | 解析の中断対策には使えるが、制御APIの中断不可と指定AZの容量確保を満たさない。 |
| c | 除外 | 解析は中断対応したSpot、制御APIはリージョンRIに適合するEC2で実行する | 解析の割引とAPIの通常実行は選べるが、リージョンRIは指定AZの起動容量を予約しない。 |
| d | 除外 | 解析はチェックポイント付きSpot、制御APIはCompute Savings Plansの対象EC2で実行する | 対象利用への割引は得られるが、Savings Plans単独では指定AZの容量確保にならない。 |

出典：[AWS公式: ec2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html) / [AWS公式: store](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html) / [AWS公式: capacity](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html) / [資源特性によるEC2ファミリー選択](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html) / [負荷と台数に対応するターゲット追跡指標](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html) / [クラスタ・パーティション・スプレッド配置](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html) / [RIの属性・期間・支払い](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html) / [RIのリージョン・AZスコープ](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/reserved-instances-scope.html) / [Savings Plansの種類と対象](https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html)

## assessment-038

判断軸：gp3の実測ボトルネックと帯域設定。改訂。

分析EC2はgp3の容量に余裕があるが、連続読取りでボリュームの転送量上限に達している。必要IOPSは既に満たし、EC2側のEBS帯域にも余裕がある。最初の調整は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 必要な転送量を見積もり、gp3のスループット設定を上限内で増やして実測する | 容量・IOPS・MiB/sを分け、測定で特定したボリューム側の転送量を調整する。 |
| b | 除外 | gp3の容量を2倍にし、設定IOPSとスループットは現在値を維持する | 保存領域は増えるが、今回の制約であるgp3の設定スループットは増えない。 |
| c | 除外 | gp3のIOPSを上げ、容量とスループット設定は現在値を維持する | 小さいI/Oの処理回数は増やせるが、既にIOPSは足りており転送量の上限が残る。 |
| d | 除外 | EBS帯域の大きいEC2へ変更し、接続するgp3の設定は現在値を維持する | EC2側の帯域は増えるが、余裕のある側を増強してもボリュームの転送量制約を解消しない。 |

出典：[gp3は容量とIOPS・スループットを独立設定](https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html) / [io2の低遅延・IOPS用途](https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html) / [EFS性能とスループットモード](https://docs.aws.amazon.com/efs/latest/ug/performance.html)

## assessment-039

判断軸：Windows SMB互換とMulti-AZ可用性。候補維持。

Windowsの業務サーバーを複数AZへ移す。共有サービスも単一AZ障害に耐える必要がある。既存アプリはSMB共有とActive Directoryのアクセス制御を使い、Linux向けへの改修はできない。適切な共有ストレージは。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | FSx for Windows File Serverの対応するMulti-AZ構成を使い、AD・SMB要件を確認する | 既存のWindowsファイル共有と認証方式を保ち、AZをまたぐ可用性要件を扱える。 |
| b | 除外 | EFSをマウントするLinuxゲートウェイを追加し、アプリをNFS利用へ改修する | 共有ファイルは提供できるが、既存Windowsアプリを改修できない条件に反する。 |
| c | 除外 | EBSへSMBサーバーを自前構築し、単一AZの1台だけで提供する | SMBは提供できても、複数AZのサーバーへ移す際の共有サービスの可用性が単一AZに依存する。 |
| d | 除外 | S3のオブジェクトAPIへアプリを改修し、IAMでファイルアクセスを置き換える | オブジェクト利用への改修と既存AD・SMBの変更が必要で、指定された互換性を満たさない。 |

出典：[AWS公式: s3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) / [AWS公式: ebs](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html) / [AWS公式: efs](https://docs.aws.amazon.com/efs/latest/ug/features.html) / [AWS公式: fsx](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is.html) / [AWS公式: multipart](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html) / [AWS公式: transfer](https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html) / [AWS公式: s3consistency](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel) / [AWS公式: version](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html) / [AWS公式: lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html) / [AWS公式: replication](https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html) / [AWS公式: signed](https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html) / [AWS公式: snapshot](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html) / [gp3は容量とIOPS・スループットを独立設定](https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html) / [io2の低遅延・IOPS用途](https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html) / [EFS性能とスループットモード](https://docs.aws.amazon.com/efs/latest/ug/performance.html)

## assessment-040

判断軸：2GiBファイルの途中失敗後の再送量。改訂。

海外拠点からS3へ2GiBのファイルをアップロードする。回線の瞬断で全体の再送が多い。転送高速化サービスの効果は拠点別に計測する方針である。まず再送範囲を小さくする手段は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | Multipart uploadで分割・並列化し、失敗したパートを再送する。未完了パートの掃除も設定する | 大きな1リクエストのやり直しを避け、再試行をパート単位へ限定できる。 |
| b | 除外 | Transfer Accelerationを有効にし、2GiBを1回のPutObjectで送信する | 長距離経路の改善を検証できるが、単一要求が失敗した場合の再送範囲はファイル全体である。 |
| c | 除外 | 複数ファイルのPutObjectを並列実行し、各2GiBファイルは単一要求として送信する | ファイル間の並列性は増えるが、1ファイルの失敗時に再送する単位は小さくならない。 |
| d | 除外 | 単一PutObjectのタイムアウトを長くし、失敗時は指数バックオフで再送する | 一時的な遅延への待機と再試行は改善できるが、瞬断した要求の再送範囲は依然ファイル全体となる。 |

出典：[AWS公式: s3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html) / [AWS公式: ebs](https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html) / [AWS公式: efs](https://docs.aws.amazon.com/efs/latest/ug/features.html) / [AWS公式: fsx](https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is.html) / [AWS公式: multipart](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html) / [AWS公式: transfer](https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html) / [AWS公式: s3consistency](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel) / [S3単一PUTとマルチパートアップロード](https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html)

## assessment-041

判断軸：ホットキー分散と表全体の容量。改訂。

DynamoDBの書込みを増やしたところ、全体の設定容量には余裕があるのに、同じ顧客IDへ集中する処理がスロットリングされる。ほかの顧客は正常である。優先する改善は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | アクセスの集中を計測し、キー分散や書込みシャーディングと読取り統合の設計を検討する | 全体容量だけでなくホットなキーの集中を解消する必要がある。読取り側の影響も評価する。 |
| b | 除外 | パーティションキーを維持し、テーブル全体のプロビジョンド書込み容量を倍増する | 全体の処理枠は増えるが、既に全体は余裕があり、同一キーに集中するアクセス特性を変えない。 |
| c | 除外 | 顧客IDを主キーに維持し、履歴項目へTTLを設定して保管量を削減する | 保存量と寿命は管理できるが、現在の同一キーへの書込み集中を分散しない。 |
| d | 除外 | 顧客IDを主キーに維持し、書込み元の並列数をさらに増やす | 書込み側の待機は短縮できても、同じキーへ同時到着する負荷が増え、集中の原因を残す。 |

出典：[AWS公式: dynamo](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html) / [AWS公式: key](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html) / [AWS公式: index](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html) / [AWS公式: ttl](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html) / [AWS公式: transactions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transactions.html) / [DynamoDBの読取り・書込み単位](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html) / [DynamoDBプロビジョンド容量](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html)

## assessment-042

判断軸：商品30秒以内の鮮度と注文確定直後の整合性。改訂。

商品検索の読取り負荷がRDSを圧迫する。商品説明は最大30秒の古さを許容するが、購入直後の注文確認は完了済み更新を反映する必要がある。非同期Read Replicaの遅延は最大60秒を観測した。商品と注文の読取り経路として、検索負荷を減らし両方の鮮度を満たす構成は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 商品説明はプライマリから補充する最長30秒TTLのキャッシュへ、注文確認はコミット後にプライマリへ読む | 商品検索をキャッシュで分散し、商品は最長30秒、注文はコミット後のプライマリ読取りでそれぞれの鮮度を満たす。 |
| b | 除外 | 商品説明と注文確認をRead Replicaへ送り、プライマリは書込みを担当する | 読取り負荷を分離できるが、最大60秒の遅延は商品の30秒許容と注文の最新確認を満たさない。 |
| c | 除外 | 商品説明はプライマリへ、注文確認はRead Replicaへ読む | 注文読取りは分離できるが、重い検索をプライマリに残し、最新必須の注文を遅延し得るReplicaへ置いている。 |
| d | 除外 | 商品説明と注文確認を、更新時無効化を持たない最長30秒TTLのキャッシュへ読む | 商品説明の鮮度と負荷軽減は満たすが、注文確認にも最大30秒前の値を返すため購入直後の要件に合わない。 |

出典：[AWS公式: multi](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html) / [AWS公式: replica](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html) / [AWS公式: backup](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html) / [AWS公式: proxy](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html) / [AWS公式: cache](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html) / [AWS公式: dax](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html)

## assessment-043

判断軸：カテゴリと価格範囲をキー条件で絞る。改訂。

DynamoDBで商品IDを主キーにしているが、カテゴリ別一覧のため毎回全表Scanして遅くなった。一覧は結果整合でよく、カテゴリと価格範囲を索引のキー条件で絞り、返す前に読む量を減らしたい。適切な設計は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | カテゴリをパーティションキー、価格をソートキーとするGSIを作り、Queryのキー条件で範囲指定する | 必要な検索条件へ索引を用意して読取り対象を絞る。GSIの結果整合性は今回許容される。 |
| b | 除外 | 主キーを維持し、ScanにカテゴリのFilterExpressionと必要属性のProjectionExpressionを付ける | 返す項目・属性は絞れるが、フィルター前に走査する範囲は残り、索引による読取り対象の縮小にはならない。 |
| c | 除外 | 主キーを維持し、Parallel Scanのセグメント数と読取り容量を増やす | 全表走査を並行化できるが、毎回読む対象をカテゴリ・価格範囲へ絞る仕組みではなく消費も増え得る。 |
| d | 除外 | カテゴリをパーティションキーとするGSIを作り、価格は索引に投影せず、全件を取得してテーブルから価格を照会する | カテゴリでは絞れるが、価格範囲を索引のキー条件で絞れず、追加の本表読取りと絞込みが必要になる。 |

出典：[AWS公式: dynamo](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html) / [AWS公式: key](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html) / [AWS公式: index](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html) / [AWS公式: ttl](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html) / [AWS公式: transactions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transactions.html)

## assessment-044

判断軸：Lambdaメモリ変更後の時間と総費用を実測。改訂。

画像変換LambdaのCPU処理が長く、p95の応答目標を超えている。入出力待ちは短く、メモリ使用量だけではCPU配分を判断できない。費用も含めて設定を決める方法は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 複数のメモリ設定で時間・p95・実行費を計測し、応答目標を満たす候補を比較する | メモリ設定によるCPU配分と実行時間の変化を測定し、割当量×時間の費用を評価する。 |
| b | 除外 | 現在と同じメモリで予約済み同時実行数を増やし、バッチ全体の完了時間を比較する | 並行処理できる件数は増やせるが、1件のCPU処理が支配するp95の改善を直接比較する方法ではない。 |
| c | 除外 | 現在と同じメモリでタイムアウトを延ばし、完了率とエラー件数を比較する | 時間切れは減らせる可能性があるが、応答目標を超えているCPU処理の実行時間を短縮しない。 |
| d | 除外 | 低いメモリ設定を選び、使用メモリの余裕率とGB秒単価を基準に費用を比較する | 割当量の削減には注目できるが、CPU配分に伴う実行時間とp95の変化を測らず、応答条件と総費用を比較できない。 |

出典：[Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) / [SQS の可視性タイムアウト](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) / [標準Lambdaの900秒とManaged Instancesの条件付き例外](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html) / [Lambdaのメモリに比例するCPU配分](https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html) / [SQSイベントソースの最大同時実行制御](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html) / [Batchのジョブキューと実行基盤](https://docs.aws.amazon.com/batch/latest/userguide/what-is-batch.html)

## assessment-045

判断軸：40分コンテナ・キュー管理・ホスト管理負担。改訂。

既存コンテナの科学計算は1ジョブ平均40分で、ジョブごとのCPU・メモリ要求も異なる。標準Lambdaの実行時間制限に合わせた分割は難しい。FargateのCPU・メモリ・機能の対応範囲に収まることは検証済みである。ホスト管理を抑えてキューで順次投入する候補は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | AWS Batchと対応するFargate実行環境を、必要なリソース・機能が適合する範囲で使う | 長いコンテナジョブのスケジューリングと実行資源の管理を分担できる。Fargateの対応条件は確認する。 |
| b | 除外 | コンテナイメージを標準Lambdaで起動し、タイムアウトを15分、エラー時の再試行を2回に設定する | ホスト管理は抑えられるが、分割できない40分の処理は1回の実行上限内に完了せず、再試行でも継続実行にはならない。 |
| c | 除外 | 固定1台のEC2上でジョブキューとDockerを運用し、必要CPU・メモリに合わせて同時起動数を制御する | 長時間ジョブと資源調整は実現できるが、ホストとキュー実行基盤の管理が必要で、管理負担を抑える目的ではAに劣る。 |
| d | 除外 | BatchのEC2計算環境を使い、専用AMIとコンテナホストの更新を自社で管理する | 長時間ジョブのスケジューリングは実現できるが、今回はFargateで満たせる処理のためホスト・AMIの管理負担を増やす。 |

出典：[Amazon ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) / [標準Lambdaの900秒とManaged Instancesの条件付き例外](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html) / [Lambdaのメモリに比例するCPU配分](https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html) / [SQSイベントソースの最大同時実行制御](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html) / [Batchのジョブキューと実行基盤](https://docs.aws.amazon.com/batch/latest/userguide/what-is-batch.html)

## assessment-046

判断軸：Cookieとファイルバージョンを区別したキャッシュキー。候補維持。

同じ公開画像をCloudFrontで配信するが、追跡用Cookieを全てキャッシュキーへ含めたためヒット率が低い。Cookie値で画像内容は変わらず、画像は版付きURLで更新する。適切な改善は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 内容に影響しないCookieをキャッシュキーから除き、版付きURLと適切なTTLで共有する | 表現が同じ要求をまとめ、更新はURLの版で分けられる。個人別内容では同じ判断はできない。 |
| b | 除外 | 追跡Cookieを全てキーに含めたまま、画像のTTLだけを長くする | 各利用者の再訪には効いても、同一画像を利用者間で共有できない原因を残す。 |
| c | 除外 | TTLを短くし、毎回の条件付き確認でオリジンの鮮度を優先する | 版付き不変画像で不要な再確認を増やし、今回の低ヒット率の原因を解消しない。 |
| d | 除外 | 全画像を同じキャッシュキーへ正規化し、URLの版番号も取り除く | 共有範囲は広がるが、異なる版や画像が区別できず必要な内容の正しさを失う。 |

出典：[CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) / [Global Accelerator](https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html) / [Direct Connectの既定は通信暗号化なし](https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html) / [Direct Connectの冗長経路設計](https://docs.aws.amazon.com/directconnect/latest/UserGuide/resiliency_toolkit.html) / [CloudFront TTLとオリジン負荷](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)

## assessment-047

判断軸：UDP・複数リージョン・共通固定IP。改訂。

多地域の利用者がリアルタイム対戦サーバーへUDP接続する。クライアントはリージョン追加時も変更しない共通の固定入口IPを許可リストに登録し、正常なリージョンへ新規接続を誘導したい。コンテンツキャッシュは不要である。適切な入口は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | Global Acceleratorで対応するリージョンのエンドポイントを構成し、固定Anycast IPを使う | UDPのグローバル入口と静的IP、ヘルスに基づくエンドポイント選択が要求に合う。 |
| b | 除外 | 各リージョンのNLBをRoute 53のレイテンシー応答とヘルスチェックで選び、NLBのIPを許可リストへ登録する | UDPの地域分散はできるが、リージョンをまたぐ共通の固定入口IPではなく、エンドポイント追加で許可リストを変更する必要がある。 |
| c | 除外 | 単一リージョンのNLBに固定IPを割り当て、同リージョン内の複数AZへ対戦サーバーを配置する | UDPと固定IP・AZ分散は満たすが、リージョン障害時に別リージョンへ新規接続を誘導できない。 |
| d | 除外 | CloudFrontでHTTPSの接続先案内APIを配信し、クライアントは案内された対戦サーバーへUDP接続する | 接続先案内をグローバル配信できるが、UDP本体は地域ごとのサーバーIPへ向かい、共通の固定IP入口という条件に合わない。 |

出典：[CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) / [Global Accelerator](https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html) / [Direct Connectの既定は通信暗号化なし](https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html) / [Direct Connectの冗長経路設計](https://docs.aws.amazon.com/directconnect/latest/UserGuide/resiliency_toolkit.html) / [CloudFront TTLとオリジン負荷](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)

## assessment-048

判断軸：複数の独立利用者と処理済みレコードの再読。改訂。

センサーを秒単位で監視し、2つの独立処理系が同じイベントを読み、正常処理済みのイベントも保持期間内で任意時点から再読取りする。障害後のリプレイ期間を設定し、S3への配送だけでは足りない。適切な中心サービスは。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | Kinesis Data Streamsの保持期間とコンシューマー容量を設計して、複数処理系が読む | ストリーム上の保持・再読取りと独立したコンシューマーを利用できる。 |
| b | 除外 | FirehoseからS3へ配送し、両処理系は5分間隔で到着オブジェクトを検索する | 保存済みデータを両方で再読取りできるが、5分間隔は秒単位の監視に間に合わない。 |
| c | 除外 | SNSから処理系ごとのSQSへ配信し、正常処理したイベントは各キューから削除する | 全イベントを両処理系へすぐ配信できるが、正常処理・削除済みのイベントを後で任意時点からリプレイする保存先がない。 |
| d | 除外 | イベントをS3へ日次ファイルとしてまとめ、両処理系が日次ファイルを繰り返し読む | 長期保管と全件の再読取りはできるが、日次のまとめ待ちが秒単位監視の条件に合わない。 |

出典：[分析サービス](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html) / [Athena の最適化](https://docs.aws.amazon.com/athena/latest/ug/performance-tuning-data-optimization-techniques.html) / [Kinesisのストリーム保持と複数コンシューマー](https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html) / [Firehoseの宛先へのバッファ配信](https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html) / [QuickSightの対応データソース](https://docs.aws.amazon.com/quicksight/latest/user/supported-data-sources.html) / [Lake Formationのデータレイク権限](https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html)

## assessment-049

判断軸：期間列絞り込みとAthena読取データ量。改訂。

S3のクリックログをAthenaで分析する。毎日のクエリは特定の日付と数列だけを読むが、現状は非圧縮CSVを全件走査する。結果再利用と実行頻度は変えず、読取り対象を減らす施策を2つ選べ。（2つ選択）

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 日付でパーティション化し、クエリで対象日付を絞れるようにする | パーティション条件により不要な日付範囲の読取りを避ける。 |
| b | 採用 | Parquet等の列指向形式へ変換し、必要な列だけをSELECTする | 列単位の読み出しを使い、全列を読むCSVより対象量を絞れる。 |
| c | 除外 | CSVに日付条件を含むビューを作成し、保存先の単一プレフィックスとファイル形式は維持する | SQL結果を日付で絞れるが、非パーティションのCSVを読んでから評価するため、保存上の走査範囲を減らす施策にはならない。 |
| d | 除外 | 結果再利用の最大経過時間を1時間に設定し、同じSQLの結果を再利用する | 条件が合えばクエリの読取りを省けるが、今回固定した結果再利用の方針を変更する案である。 |
| e | 除外 | CSVを大きな非圧縮ファイルへ結合し、1回で全期間・全列を読むSQLを維持する | 小ファイルの管理や要求のオーバーヘッドは減らせるが、日付・列に対応する読取りデータ量は減らさない。 |

出典：[分析サービス](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html) / [Athena の最適化](https://docs.aws.amazon.com/athena/latest/ug/performance-tuning-data-optimization-techniques.html) / [Kinesisのストリーム保持と複数コンシューマー](https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html) / [Firehoseの宛先へのバッファ配信](https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html) / [QuickSightの対応データソース](https://docs.aws.amazon.com/quicksight/latest/user/supported-data-sources.html) / [Lake Formationのデータレイク権限](https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html)

## assessment-050

判断軸：時間内に終わる最小ワーカー数と可視性。改訂。

変換ワーカー1台の処理能力は毎秒20件、到着は毎秒100件である。滞留3,000件を新規到着も処理しながら5分以内に解消したい。下流容量と並列化には余裕があり、能力は一定とする。必要最小台数は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | ワーカーを6台にする | 毎秒120件から到着100件を引いて滞留が20件/秒減り、150秒で解消する。5台では純減せず、最小は6台。 |
| b | 除外 | ワーカーを5台にする | 毎秒100件で新規到着は処理できるが、余剰がないため既存滞留は減らない。 |
| c | 除外 | ワーカーを4台にして、可視性タイムアウトを長く設定する | 処理中の再受信は抑えられるが、毎秒80件では到着100件に追い付かず滞留が増える。 |
| d | 除外 | ワーカーを10台にする | 毎秒200件で滞留は30秒で解消し時間条件は満たすが、6台で十分なので必要最小台数ではない。 |

出典：[SQS のデッドレターキュー](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) / [CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html) / [SQSの不可視期間・再受信と削除](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) / [1台当たりバックログによるスケーリング](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html) / [LambdaのSQS部分バッチ応答](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html)

## assessment-051

判断軸：既存PostgreSQL SQLと移行改修量。改訂。

会計アプリは複数表JOINと複数行トランザクションを使い、PostgreSQL互換SQLの変更を最小化したい。ミリ秒の単一キー参照だけでなく既存の整合性を維持する。第一候補は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | RDS for PostgreSQLまたは互換要件を確認したAurora PostgreSQLを評価する | 関係モデルと既存SQL・トランザクションの適合を先に確認できる。 |
| b | 除外 | DynamoDBのキー設計に合わせてデータを非正規化し、JOINはアプリ側へ移す | 単一キー参照や拡張性には向くが、既存PostgreSQLのSQLとJOINを最小変更で使う条件に劣る。 |
| c | 除外 | RDS for MySQLへ移し、PostgreSQL固有の型・SQLを変換してアプリを改修する | 関係DBとトランザクションは使えるが、既存のPostgreSQL互換性を維持する案より変換が必要。 |
| d | 除外 | S3へ更新履歴を連携し、Athenaの定期集計結果を会計アプリへ返す | 大量履歴の分析はできるが、既存の複数行トランザクションによるオンライン更新を置き換える設計ではない。 |

出典：[アクセスパターンとデータモデルによるDB選択](https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/db-selection.html) / [RDS単一スタンバイの同期複製と読取り不可](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html) / [DynamoDB容量方式の課金と負荷特性](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html) / [DynamoDBテーブル・GSI・リージョン間整合性](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html) / [Aurora StandardとI/O-Optimizedの課金要素](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/User_DBInstanceBilling.html)

## assessment-052

判断軸：数日待機・状態追跡・再試行の管理。改訂。

申請処理は承認待ち、課金、失敗時の補償、最大数日の待機からなる。実行状態と再試行を追跡し、待機中の計算資源を占有したくない。適切な構成は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | Step Functions Standardの待機・再試行・補償分岐を使い、各処理をLambda等で実行する | 業務状態を実行基盤で追跡し、数日の待機を計算プロセスに保持せず、再試行と補償を明示できる。 |
| b | 除外 | 常駐EC2上のワーカーで状態をDBへ保存し、承認完了までポーリングする | 状態と再試行は自作できるが、待機中もポーリング用計算資源を占有する。 |
| c | 除外 | Step Functions Expressの単一実行に課金と承認待ちをまとめ、タイムアウト時に再実行する | 短時間の複数処理は追跡できるが、単一Express実行の時間上限では最大数日の待機を収容できない。 |
| d | 除外 | SQSで承認待ち要求を保持し、可視性タイムアウト1回分を承認期限として管理する | メッセージを蓄積してワーカーを解放できるが、可視性タイムアウトの上限では数日を覆えず、補償を含む業務状態も別設計が必要。 |

出典：[Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) / [SQS の可視性タイムアウト](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) / [API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html) / [Step Functions](https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html) / [標準Lambdaの900秒とManaged Instancesの条件付き例外](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html) / [Lambdaのメモリに比例するCPU配分](https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html) / [SQSイベントソースの最大同時実行制御](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html) / [Batchのジョブキューと実行基盤](https://docs.aws.amazon.com/batch/latest/userguide/what-is-batch.html) / [StandardとExpressの実行時間・用途](https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html)

## assessment-053

判断軸：日常のサービス別分析と予測超過通知。改訂。

財務部は月次の費用増加サービスを対話的に調べ、予測額が予算を超えそうなら担当へ通知したい。詳細な独自配賦は今回不要で、通知を利用停止の保証とは扱わない。最も直接的な組合せは。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | Cost Explorerで傾向と内訳を分析し、AWS Budgetsで実績・予測のしきい値通知を設定する | 分析と予算監視を分ける。請求データには反映遅延があり、通知だけで即時停止するわけではない。 |
| b | 除外 | Cost Explorerで内訳を分析し、Budgetsの実績額が予算を超えた時点で通知する | 費用の分析と実績超過通知はできるが、超過しそうな予測段階で通知する条件を満たさない。 |
| c | 除外 | CURを月締め後にSQL集計し、集計結果が予算を超えていたらメール通知する | 詳細な費用分析と実績報告はできるが、対話的な調査と月中の予測超過通知に合わない。 |
| d | 除外 | Budgetsで予測超過を通知し、費用調査はアカウントごとの請求総額を月次で手集計する | 予測通知は満たすが、サービス別増加原因を対話的に調べる分析画面がない。 |

出典：[Cost Explorerの費用分析](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html) / [Budgetsの実績・予測通知と遅延](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html) / [Cost and Usage Reportの明細](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) / [Data ExportsとCUR 2.0](https://docs.aws.amazon.com/cur/latest/userguide/what-is-data-exports.html)

## assessment-054

判断軸：利用明細行を独自台帳とSQL結合。改訂。

複数アカウントの費用を部門別に配賦し、社内の配賦表とSQLで結合したい。管理対象タグを有効化し、サービス別・部門別の小計だけでなく、個々の使用明細を保持したS3上のデータから再計算できることが必要である。適切な基盤は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | Data ExportsのCUR 2.0等をS3へ出力し、有効化したコスト配分タグやアカウント情報を使って集計する | 詳細な費用データと独自配賦規則を結合できる。共有費とタグ未設定の扱いも決める。 |
| b | 除外 | Cost Explorerで部門タグ別の月次小計をCSV出力し、S3へ保存して配賦表とSQL結合する | 部門小計と社内表のSQL結合はできるが、個々の使用明細から配賦規則を変えて再計算する粒度が残らない。 |
| c | 除外 | Budgets Reportsで部門別の実績・予算差を配信し、帳票をS3へ保存してSQLで集計する | 部門別の予算実績を保存・比較できるが、予算レポートは使用明細ベースの独自再配賦データではない。 |
| d | 除外 | 請求画面のアカウント別・サービス別月額をS3へ保存し、アカウントと部門の対応表を結合する | アカウントを部門へ割り当てる集計はできるが、同一アカウント内の部門タグや個々の使用明細による再計算ができない。 |

出典：[Cost Explorerの費用分析](https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html) / [Budgetsの実績・予測通知と遅延](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html) / [Cost and Usage Reportの明細](https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html) / [Data ExportsとCUR 2.0](https://docs.aws.amazon.com/cur/latest/userguide/what-is-data-exports.html)

## assessment-055

判断軸：リージョン/ファミリー/計算方式変更への割引柔軟性。改訂。

安定した計算利用を1年間コミットできるが、今後EC2のファミリーやリージョンを変え、一部をFargate・Lambdaへ移す予定がある。固定AZの容量確保は別途扱う。柔軟な割引対象として第一候補は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | Compute Savings Plansを安定利用の範囲で検討し、移行後も対象利用へ割引を適用する | 対象のEC2・Fargate・Lambdaをまたぐ柔軟性があり、使い切れるコミット額を選ぶ。 |
| b | 除外 | 現在のEC2属性に合う1年のStandard RIを、今の安定利用量に合わせて購入する | 現在のEC2には割引を適用できるが、リージョン・属性変更やFargate/Lambda移行後に対象が残るとは限らない。 |
| c | 除外 | 現在のリージョンとファミリーでEC2 Instance Savings Plansを1年契約する | そのリージョン・ファミリー内のEC2利用には柔軟性があるが、今回のリージョン変更や他サービス移行を覆わない。 |
| d | 除外 | 指定AZへCapacity Reservationを作成し、オンデマンド使用料で運用する | 起動容量は確保できるが、これは別途扱う要件であり、柔軟な対象利用への期間コミット割引を選んだことにならない。 |

出典：[AWS公式: ec2](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html) / [AWS公式: store](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html) / [AWS公式: capacity](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html) / [RIの属性・期間・支払い](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html) / [RIのリージョン・AZスコープ](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/reserved-instances-scope.html) / [Savings Plansの種類と対象](https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html)

## assessment-056

判断軸：再開時RAM状態と計算料金の節約。改訂。

平日だけ使う対応EC2で、翌朝にプロセスのRAM状態を復元したい。休止条件は満たし暗号化EBSにも空きがある。未使用のコミット契約はない。RAM状態を保持しながら、夜間の通常の計算利用料を抑える運用は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 休止でRAMをEBSへ保存して再開する。停止状態の通常の計算利用料は止まるがEBS等の料金は残る | 停止と休止の差はRAM状態の保持であり、ディスク等の保存費まで無料になるわけではない。 |
| b | 除外 | 夜間は通常停止し、朝は保持したEBSからOSとアプリを起動する | 停止中の通常の実行料金は減らせるが、RAM上のプロセス状態は復元されない。 |
| c | 除外 | 夜間もインスタンスを稼働させ、アプリへの新規処理を停止して朝に受付を再開する | RAM状態は維持できるが、インスタンス実行料金が継続し、夜間費用を抑える休止案に劣る。 |
| d | 除外 | 夜間にEBSのスナップショットを取得して終了し、朝は新規EC2へ復元して起動する | ディスク上のデータを保存して再起動できるが、実行中プロセスのRAMをそのまま復元する方式ではない。 |

出典：[EC2休止の状態保持と課金](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Hibernate.html) / [EC2の状態遷移](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html)

## assessment-057

判断軸：指定した単一GetItemと書込みの最小容量。改訂。

DynamoDBの容量計画で、8KiB項目の強い整合性GetItemを毎秒60件、1.2KiB項目の非トランザクションPutItemを毎秒40件実行する。GSI・再試行・余裕率を除いた必要最小のRCU/WCUを2つ選べ。（2つ選択）

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 読取りは120 RCU | 8KiBは4KiB単位で2、強い整合性なので2×60＝120 RCU。 |
| b | 採用 | 書込みは80 WCU | 1.2KiBを1KiB単位で切り上げて2、2×40＝80 WCU。 |
| c | 除外 | 読取りを240 RCUに設定する | 必要な強い読取りは処理できるが、ceil(8/4)×60＝120 RCUの2倍で、余裕率を除く必要最小ではない。 |
| d | 除外 | 書込みを40 WCUに設定する | 1KiB以下の項目なら毎秒40件分だが、今回は1.2KiBを2単位へ切り上げるため80 WCU必要。 |
| e | 除外 | 書込みを160 WCUに設定する | 必要な通常書込みは処理できるが、今回は非トランザクションで80 WCUが最小。160は2倍の余剰となる。 |

出典：[DynamoDBの読取り・書込み単位](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html) / [DynamoDBプロビジョンド容量](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html)

## assessment-058

判断軸：小ファイル短期保存の最低課金と取得時間。改訂。

短命な小オブジェクトをStandard-IAへ移す案を検討する。仮定として1個40KiB、保存は10日、移行・取得も発生する。即時読取りが必要である。適切な費用比較は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 128KBの最小課金サイズと30日の最低保存期間、移行・取得リクエスト費等を含めStandardと比較する | 実データ量と実保存日数だけを掛けると、IAの最低課金と追加費を見落とす。 |
| b | 除外 | StandardとStandard-IAの双方を、40KiB・10日分の保存費と実際の取得回数で見積もる | データ量・期間・取得回数は比較に入るが、IAの128KB最小課金サイズと30日最低保存期間を反映していない。 |
| c | 除外 | StandardとDeep Archiveの保存・要求・復元費を比較し、閲覧時に復元要求を出す | 保存と復元を含む総費用は比較できるが、取得までの復元待ちが即時読取りという条件を満たさない。 |
| d | 除外 | Standard-IAの128KB・30日分の保存料金を求め、現在のStandardの請求総額と比較する | IAの最低課金は反映するが、IA側の取得・要求等を含めず、Standardの総額と比較範囲が揃っていない。 |

出典：[S3階層のアクセス・最小期間・取得費](https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html)

## assessment-059

判断軸：性能条件を満たすAurora構成のI/O込み総額。改訂。

Auroraの学習用見積りで、同じ性能・可用性を満たすStandardは計算70・保存20・I/O45単位/月、I/O-Optimizedは計算90・保存25・I/O0単位/月である。Standardの小型案は計算50・保存20・I/O45だが応答目標を超過する。分析用Replicaを追加するとどちらも月30単位増え、今回は不要である。目標を満たす最小費用の案は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | I/O-Optimizedを採用し、分析用Replicaは追加しない | 月115単位で性能・可用性を満たす。Standard通常案135より20安く、不要なReplicaの費用も発生しない。 |
| b | 除外 | Standardの通常サイズを採用し、分析用Replicaは追加しない | 性能・可用性は満たすが、70＋20＋45＝135単位で、I/O-OptimizedのReplica追加なし案より20高い。 |
| c | 除外 | Standardを小型化し、分析用Replicaは追加しない | 月115単位まで下げられるが、明示された応答目標を満たさない。 |
| d | 除外 | I/O-Optimizedを採用し、分析用Replicaを追加する | 性能・可用性と分析の分離は実現できるが、不要な追加30を含む145単位で最小費用ではない。 |

出典：[アクセスパターンとデータモデルによるDB選択](https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/db-selection.html) / [RDS単一スタンバイの同期複製と読取り不可](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html) / [DynamoDB容量方式の課金と負荷特性](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html) / [DynamoDBテーブル・GSI・リージョン間整合性](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html) / [Aurora StandardとI/O-Optimizedの課金要素](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/User_DBInstanceBilling.html)

## assessment-060

判断軸：S3経路のNAT従量削減と他の外向き通信。改訂。

プライベートEC2のS3転送が大きく、同一リージョンのS3通信がNAT Gatewayを通っている。外部API通信は引き続きNATを使う。到達性を維持してS3部分のNAT処理費を減らすには。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 対応するルートにS3 Gateway endpointを関連付け、ポリシーを確認する。外部API用NAT経路は残す | 対象のS3経路をNATから分離できる。エンドポイントポリシーとS3/IAM認可も確認する。 |
| b | 除外 | S3 Gateway endpointを追加して全NAT Gatewayを削除する | 同一リージョンS3への私設経路は作れるが、引き続き必要な外部API向けのNAT出口を失う。 |
| c | 除外 | S3の保存クラスを見直し、S3と外部APIの通信は現在のNAT経路を使う | 保存費を改善できる可能性はあるが、対象のS3転送がNATを通る処理費は減らない。 |
| d | 除外 | NAT Gatewayを別AZの1か所へ集約し、S3と外部APIの通信を集約先へ送る | NATの固定費を減らせる場合はあるが、S3分のNAT処理費は残り、AZ間転送も生じ得る。 |

出典：[AWS公式: endpoint](https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html) / [AWS公式: privatelink](https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html) / [AWS公式: peering](https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html) / [AWS公式: tgw](https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html) / [AWS公式: vpn](https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html) / [AWS公式: direct](https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html) / [NATの時間・処理量・AZ間転送の費用要因](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html) / [ゾーン型NATのAZ障害と同一AZ経路](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html)

## assessment-061

判断軸：CPU負荷連動と常時2AZ。改訂。

Webサービスは平日の昼にCPU負荷が高く、夜間はほぼ無通信である。メモリは常時余裕があり、2 AZの最低台数と応答目標を維持したい。適切な費用改善は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | CPU特性に合う候補を負荷試験し、AZごとの必要最小容量を保ちながら需要に合わせて台数を増減する | インスタンス選定とスケーリングを組み合わせ、安さより先に性能・可用性条件を満たす。 |
| b | 除外 | 昼のピークに合わせたCPU最適化インスタンスを2 AZで常時同じ台数だけ動かす | 性能とAZ分散の候補にはなるが、夜間の未使用容量を減らす需要追随を設計していない。 |
| c | 除外 | メモリ最適化の大きなインスタンスを2 AZへ配置し、台数は昼のピークに合わせて固定する | AZ分散とメモリ余裕は維持できるが、余っているメモリと夜間容量を増やすため、CPU特性・需要追随を使う費用改善に劣る。 |
| d | 除外 | 夜間は全台を1 AZの1台へ集約し、朝の予定時刻にだけ2 AZへ戻す | 夜間も維持すべき2 AZの最低容量を満たさない。 |

出典：[AWS公式: asg](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html) / [AWS公式: scaling](https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scheduled-scaling.html) / [AWS公式: health](https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html) / [資源特性によるEC2ファミリー選択](https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html) / [容量予約と割引方式の違い](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html) / [クラスタ・パーティション・スプレッド配置](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html)

## assessment-062

判断軸：1日以内の鮮度・キャッシュキー・オリジン要求数。改訂。

世界向けの公開マニュアルはURLごとに同じ内容で、1日以内の更新反映を許容する。S3オリジンへの反復取得を減らし、費用は配信量とリクエストを含め評価したい。適切な施策を2つ選べ。（2つ選択）

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | CloudFrontで公開コンテンツをキャッシュし、更新要件内のTTLまたは版付きURLを設計する | 同じコンテンツの反復要求をエッジで処理し、鮮度の上限も守る。 |
| b | 採用 | 内容に無関係な追跡パラメーターをキャッシュキーから除き、ヒット率と総費用を計測する | 不要なキー分割を避ける。ただし配信費を含め総額で効果を検証する。 |
| c | 除外 | 利用者ごとの追跡パラメーターをキャッシュキーに含め、TTLを12時間にする | 1日以内の更新と同じ利用者の再訪には対応できるが、同一文書を利用者間で共有しにくく、不要なキャッシュ分割が残る。 |
| d | 除外 | URLを据え置いて上書き更新し、TTLを7日に設定する | 反復取得をキャッシュできるが、旧版が1日を超えて残る可能性があり更新反映要件に合わない。 |
| e | 除外 | TTLを0にして各要求をオリジンへ再検証し、変更されていなければ保存済み本文を返す | 鮮度と本文転送量は改善できるが、オリジンへの反復要求自体を減らす目的には劣る。 |

出典：[CloudFront](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html) / [Global Accelerator](https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html) / [Direct Connectの既定は通信暗号化なし](https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html) / [Direct Connectの冗長経路設計](https://docs.aws.amazon.com/directconnect/latest/UserGuide/resiliency_toolkit.html) / [CloudFront TTLとオリジン負荷](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html)

## assessment-063

判断軸：復旧可能な保持期間と即時層の保存費。改訂。

DBのバックアップ費を減らしたい。規程は日次復元点を35日、月末復元点を7年保持し、旧月末データは24時間以内の復元でよい。適切な見直しは。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 必要な日次・月次世代を区別し、対応する保存階層・保持設定と24時間以内の復元を検証する | 全世代を同じ高頻度階層で保持する必要はないが、保持期間と復元可能時間を先に満たす。 |
| b | 除外 | 日次復元点を35日、月末復元点を1年保持し、全世代を即時復元できる階層に置く | 日次保持と復元速度は満たすが、月末復元点を7年保持する規程に不足する。 |
| c | 除外 | 日次復元点を35日、月末復元点を7年保持し、月末分を復元最大48時間の低費用階層へ移す | 要求された期間は保持できるが、月末データの復元24時間以内という条件を超える。 |
| d | 除外 | 日次復元点を7年分すべて即時復元できる階層に保持する | 保持期間と復元条件は満たすが、古い日次分も高い階層で残すため、必要な月末世代に絞る適合案より費用を減らしにくい。 |

出典：[災害復旧戦略](https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html) / [S3 File GatewayのNFS/SMBとキャッシュ](https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html) / [容量予約とクォータの区別](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html) / [DataSyncの移行・継続転送](https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html) / [Transfer Familyのファイル転送プロトコル](https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html)

## assessment-064

判断軸：変動需要の余剰/長期契約と容量管理負担。改訂。

新規サービスのDynamoDB利用は日による変動が大きく、まだ安定利用量を予測できない。初期は余剰の固定容量・長期コミットと容量管理を抑え、実績が固まった後に購入・容量方式を見直す方針である。適切な進め方は。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | オンデマンドを候補にして利用量・スロットリング・キー偏り・費用を監視し、安定後にプロビジョンド等と比較する | 予測困難な初期運用を扱いつつ、上限やホットキーがなくなるとは考えず、実績で再評価する。 |
| b | 除外 | プロビジョンドを使い、初月の最大想定容量を常時確保する | ピークへの備えは作れるが、予測不能な段階の最大想定に固定すると未使用容量への費用が増え、実績を見て方式を選ぶ方針に劣る。 |
| c | 除外 | プロビジョンドを小さく開始し、担当者が毎時の利用量を見て手動で容量を変更する | 使用量に合わせた見直しはできるが、初期の容量管理を抑える方針に反し、毎時の間の急増対応も遅れ得る。 |
| d | 除外 | 安定負荷向けに1年分の予約容量を購入し、将来のピーク予測へ合わせて追加する | 適合する安定利用なら割引を得られるが、現時点では利用量が不明で、実績が固まる前のコミットとなる。 |

出典：[アクセスパターンとデータモデルによるDB選択](https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/db-selection.html) / [RDS単一スタンバイの同期複製と読取り不可](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html) / [DynamoDB容量方式の課金と負荷特性](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html) / [DynamoDBテーブル・GSI・リージョン間整合性](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html) / [Aurora StandardとI/O-Optimizedの課金要素](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/User_DBInstanceBilling.html) / [DynamoDBの読取り・書込み単位](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html) / [DynamoDBプロビジョンド容量](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html)

## assessment-065

判断軸：AZ-A停止後のBの出口と最小月額。改訂。

2 AZのプライベートワーカーが外部APIへ通信する。学習用の各月額は必要な費用をすべて含み、NATの能力は十分、障害時の経路自動変更は行わない。AZ-A停止中もAZ-Bの通信を継続できる、最も低費用の案を選べ。

| 保存ID | 判定 | 候補 | 条件との照合・理由 |
|---|---|---|---|
| a | 採用 | 各AZにNATを1台ずつ置き、各ワーカーは同じAZのNATへ送る。月90単位 | 残ったAZ-BはAZ-Bの出口を使用できる。各AZにNATを2台置く適合案より安く、この条件下で最小費用。 |
| b | 除外 | AZ-AにNATを1台置き、両AZのワーカーを集約する。月60単位 | 通常時は両方から通信できて安いが、AZ-A停止でAZ-Bの出口も失う。 |
| c | 除外 | 各AZにNATを置き、両AZのワーカーの既定経路はAZ-Aへ向ける。月85単位 | 代替NAT自体はあるが、経路自動変更なしではAZ-A停止後もAZ-Bが失われた出口へ向かう。 |
| d | 除外 | 各AZにNATを2台ずつ置き、各ワーカーは同じAZのNATへ送る。月120単位 | AZ-A停止時もAZ-Bの出口は残るが、能力は十分という前提で各AZにNATを1台置く案より30高く最小費用ではない。 |

出典：[NATの時間・処理量・AZ間転送の費用要因](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html) / [ゾーン型NATのAZ障害と同一AZ経路](https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html) / [Gateway endpointの対象・ルート・追加料金なし](https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html)

## FR-001 対の設問の全候補確認

### m1-065

設計Aは月100単位だが単一AZ出口、Bは月130単位で各AZに出口がある。片側AZ障害時も外部通信継続が必須。他の要件は同じ。選択は。

| 保存ID | 判定 | 候補 | 本問の条件に対する理由 |
|---|---|---|---|
| a | 採用 | Bを選ぶ | BはAZ障害後の出口を維持し、今回必須の継続条件を満たす。単一AZのAは満たさない。 |
| b | 除外 | Aを選ぶ | Aは30単位安いが、単一AZ出口の障害で外部通信を失い、今回必須の継続性を満たさない。 |
| c | 除外 | AのNATの帯域だけを増やす案を追加費用なしと仮定して採用する | 帯域の増加はAZ依存を解消せず、提示されていない追加案の費用もゼロとは評価できない。 |
| d | 除外 | BのNATを1台減らし、可用性と料金は変更前のBとして比較する | 出口構成を変えるなら障害範囲と見積りを再評価する必要があり、Bの条件をそのまま引き継げない。 |

### m2-065

設計Aは月100単位で単一AZ出口、Bは月130単位で各AZに出口がある。一時検証環境で単一AZ停止時の復旧待ちは許容され、他の要件はどちらも満たす。費用最小が優先。選択は。

| 保存ID | 判定 | 候補 | 本問の条件に対する理由 |
|---|---|---|---|
| a | 除外 | Bを選ぶ | Bは継続性に優れるが、この一時検証環境では復旧待ちを許容している。Aも今回の要件を満たし、Bは30単位高いため最小費用の目的に劣る。 |
| b | 採用 | Aを選ぶ | 単一AZ停止時の復旧待ちを明示的に許容するため、同じ要件を満たす候補のうち月100単位のAを選べる。 |
| c | 除外 | AのNATの帯域だけを増やす案を追加費用なしと仮定して採用する | 今回Aは必要な要件をすでに満たす。帯域増加を追加する必要は示されておらず、提示されていない追加案を費用ゼロとして最小費用と判定できない。 |
| d | 除外 | BのNATを1台減らし、可用性と料金は変更前のBとして比較する | 出口構成を変えるなら障害範囲と見積りを再評価する必要があり、Bの条件をそのまま引き継げない。 |
