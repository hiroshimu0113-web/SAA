import type {Question} from "../../types";
export const assessment: Question[] = [
  {
    "id": "assessment-001",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "iam-role"
    ],
    "prompt": "外部保守会社が多数の顧客へ同じ運用サービスを提供する。顧客Aの監査ロールは保守会社のアカウントを信頼しているが、別顧客がAのロールARNを指定して操作を誘導するリスクを防ぎたい。長期キーを配らず、委任先を保守会社に限定したうえで追加する条件は。",
    "options": [
      {
        "id": "a",
        "text": "保守会社が顧客ごとに発行するExternal IDをAの信頼ポリシーで要求し、AssumeRole時に一致させる",
        "explanation": "信頼する主体の制約と顧客別External IDを組み合わせ、他顧客の委任要求との取り違えを防ぐ。"
      },
      {
        "id": "b",
        "text": "信頼先を保守会社の実行ロールに限定し、AssumeRoleの送信元を同社の固定IPに制限する",
        "explanation": "保守会社とその経路を制限できるが、同じ実行ロール・経路を使う別顧客の委任要求を区別しない。"
      },
      {
        "id": "c",
        "text": "監査ロールの許可をreports/のGetObjectに限定し、保守会社の各顧客に共通のExternal IDを設定する",
        "explanation": "操作範囲は絞れるが、共通のExternal IDでは顧客Aと他顧客を区別できない。"
      },
      {
        "id": "d",
        "text": "保守会社の実行ロールを信頼し、セッション時間を15分に制限してCloudTrailで追跡する",
        "explanation": "一時認証と短い有効期間、事後追跡は実現するが、別顧客によるAのロール指定を認可時に区別しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "信頼する主体の制約と顧客別External IDを組み合わせ、他顧客の委任要求との取り違えを防ぐ。",
    "sources": [
      {
        "title": "AWS公式: iam",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: role",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: sts",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_temp.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-002",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "scp",
      "organizations"
    ],
    "prompt": "開発用OUでは特定リージョンへの新規EC2作成を禁止したい。各メンバーアカウントの管理者がAdministratorAccessを持っても制限を維持し、既存社員への実際の利用許可は今のIAMで管理する。選ぶ統制は。",
    "options": [
      {
        "id": "a",
        "text": "OUに対象リージョンでの作成を拒否するSCPを適用し、IAMの許可と合わせて評価する",
        "explanation": "SCPはメンバーの許可上限を制約し、IAMのAllowだけでは明示的拒否を回避できない。"
      },
      {
        "id": "b",
        "text": "各開発ロールのIAMポリシーで対象リージョンの作成をDenyし、ポリシー管理は各アカウント管理者へ委任する",
        "explanation": "対象ロールでは拒否できるが、AdministratorAccessを持つ管理者がそのポリシーを変更でき、OU全体の上限にならない。"
      },
      {
        "id": "c",
        "text": "標準開発ロールに対象リージョンを除外した境界を付け、新規ロール作成は各アカウント管理者へ委任する",
        "explanation": "境界付きロールの上限は設定できるが、OU全主体や管理者の作成する別ロールまで共通に制約していない。"
      },
      {
        "id": "d",
        "text": "Configで対象リージョンのEC2を検出し、自動修復で停止して担当者へ通知する",
        "explanation": "違反の発見と是正はできるが、作成要求を認可時に禁止する要件に対して事後対応となる。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "SCPはメンバーの許可上限を制約し、IAMのAllowだけでは明示的拒否を回避できない。",
    "sources": [
      {
        "title": "AWS公式: policy",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: scp",
        "url": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: boundary",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: abac",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html",
        "checked": "2026-10-05"
      },
      {
        "title": "Control Towerによる複数アカウント統制",
        "url": "https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html",
        "checked": "2026-10-08"
      },
      {
        "title": "SAML認証とSCIMプロビジョニング",
        "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-idp.html",
        "checked": "2026-10-08"
      },
      {
        "title": "主体ポリシーとリソースポリシー",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-003",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "identity-center"
    ],
    "prompt": "買収した会社を含む社員が既存IdPで複数AWSアカウントを利用する。入退社はIdP側で管理し、部署グループ単位で本番の読取りと開発の更新権限を分けたい。個別IAMユーザーを各アカウントに大量作成せず構成するには。",
    "options": [
      {
        "id": "a",
        "text": "Identity CenterをIdPと連携し、ユーザー・グループ同期とアカウント別許可セット割当を管理する",
        "explanation": "認証、プロビジョニング、権限割当をそれぞれ設定し、複数アカウントへの一時アクセスをまとめて管理できる。"
      },
      {
        "id": "b",
        "text": "IdPと各アカウントをSAML連携し、全社員へ共通の読取りロールを割り当てる",
        "explanation": "既存IdPと一時アクセスは利用できるが、部署別・開発更新という権限差を表現していない。"
      },
      {
        "id": "c",
        "text": "各アカウントに部署別IAMユーザーを作り、IdPの人事データからキーを定期更新する",
        "explanation": "部署別権限は分けられるが、各アカウントの個別IAMユーザーを大量作成しない条件に反する。"
      },
      {
        "id": "d",
        "text": "Identity CenterをIdPと同期し、部署グループに本番・開発共通のAdministratorAccess許可セットを割り当てる",
        "explanation": "IDの一元管理はできるが、本番読取りと開発更新の区別より権限が広い。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "認証、プロビジョニング、権限割当をそれぞれ設定し、複数アカウントへの一時アクセスをまとめて管理できる。",
    "sources": [
      {
        "title": "AWS公式: external",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: identity",
        "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: cognito",
        "url": "https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: access",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: s3block",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: cognitoid",
        "url": "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html",
        "checked": "2026-10-05"
      },
      {
        "title": "SCPは付与ではなく上限、管理アカウントは対象外",
        "url": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Control Towerによる複数アカウント統制",
        "url": "https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html",
        "checked": "2026-10-08"
      },
      {
        "title": "SAML認証とSCIMプロビジョニング",
        "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-idp.html",
        "checked": "2026-10-08"
      },
      {
        "title": "主体ポリシーとリソースポリシー",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-004",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "resource-policy"
    ],
    "prompt": "分析アカウントのロールから別アカウントのSSE-S3バケットのreports/だけを読みたい。SCP等の拒否はなく、ロールの信頼関係も有効である。別アカウントのロールへ切り替えず直接GetObjectする構成で、両側に必要な許可を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "分析ロールに対象reports/*のGetObjectを許可する",
        "explanation": "主体側で要求操作とリソース範囲を許可する必要がある。"
      },
      {
        "id": "b",
        "text": "保存側バケットポリシーでその分析ロールのreports/*読取りを許可する",
        "explanation": "リソース所有側も当該外部主体を許可し、直接のクロスアカウントアクセスを成立させる。"
      },
      {
        "id": "c",
        "text": "保存側バケットポリシーで、保存側の監査ロールへreports/*のGetObjectを許可する",
        "explanation": "保存側監査ロールの読取りは許可するが、実際に直接要求する分析アカウントのロールとは主体が異なる。"
      },
      {
        "id": "d",
        "text": "分析ロールに対象バケットのListBucketをreports/のprefix条件付きで許可する",
        "explanation": "reports/の一覧取得はできるが、オブジェクト本体のGetObjectは別の操作である。"
      },
      {
        "id": "e",
        "text": "保存側監査ロールの信頼ポリシーで、分析ロールからのAssumeRoleを許可する",
        "explanation": "ロール切替の経路は構成できるが、本問は切り替えず直接GetObjectする条件である。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "主体側で要求操作とリソース範囲を許可する必要がある。 リソース所有側も当該外部主体を許可し、直接のクロスアカウントアクセスを成立させる。",
    "sources": [
      {
        "title": "SCPは付与ではなく上限、管理アカウントは対象外",
        "url": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Control Towerによる複数アカウント統制",
        "url": "https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html",
        "checked": "2026-10-08"
      },
      {
        "title": "SAML認証とSCIMプロビジョニング",
        "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-idp.html",
        "checked": "2026-10-08"
      },
      {
        "title": "主体ポリシーとリソースポリシー",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-005",
    "chapterId": "ch03",
    "domain": 1,
    "conceptIds": [
      "security-group"
    ],
    "prompt": "ALB配下のアプリはAuto ScalingでIPが変わる。DBは同じVPC内にあり、アプリのTCP5432だけを受けたい。ルートは正しく、運用者は増減のたびにIP一覧を更新したくない。最小範囲を保つ構成は。",
    "options": [
      {
        "id": "a",
        "text": "ALB→アプリはALBのSG、アプリ→DBはアプリのSGを送信元に指定して必要ポートを許可する",
        "explanation": "階層ごとにSGを参照し、IP増減に追随しながら必要な通信元だけを許可できる。"
      },
      {
        "id": "b",
        "text": "DBのSGでVPC全体のCIDRから5432を許可する",
        "explanation": "増減には追随できるが、同じVPCの他の層からも接続可能となり最小範囲を超える。"
      },
      {
        "id": "c",
        "text": "DBのSGでALBのSGだけを5432の送信元にする",
        "explanation": "DBへの接続を開始するのはアプリであり、ALBのSGだけではアプリからの接続を許可しない。"
      },
      {
        "id": "d",
        "text": "DBのSGで現時点のアプリのプライベートIPを個別登録する",
        "explanation": "現在の範囲は絞れるが、台数増減時のIP更新を避ける運用要件を満たさない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。階層ごとにSGを参照し、IP増減に追随しながら必要な通信元だけを許可できる。",
    "sources": [
      {
        "title": "AWS公式: sg",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: acl",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: flow",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: ssm",
        "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-006",
    "chapterId": "ch03",
    "domain": 1,
    "conceptIds": [
      "network-acl"
    ],
    "prompt": "公開WebサブネットのSGとルートは検証済み。独自NACLで443の受信だけを許可したところ、利用者のTLS接続がタイムアウトする。既定Denyは維持し、正当なHTTPS要求への応答を通す修正は。",
    "options": [
      {
        "id": "a",
        "text": "NACLの送信側で利用者のエフェメラルポート宛ての戻り通信を必要な範囲で許可する",
        "explanation": "NACLはステートレスなので、受信許可だけでは応答方向が許可されない。"
      },
      {
        "id": "b",
        "text": "NACLの送信側で利用者CIDRの宛先443を許可する",
        "explanation": "外部HTTPSサーバーへ発信する通信には使えるが、今回の応答先は利用者のエフェメラルポートであり宛先が違う。"
      },
      {
        "id": "c",
        "text": "NACLの受信側で利用者CIDRの宛先エフェメラルポートを許可する",
        "explanation": "このサブネットがクライアントとして発信した接続の戻りには使えるが、今回はWebサーバーから利用者への送信許可が必要。"
      },
      {
        "id": "d",
        "text": "NACLの送信側でVPC内CIDRの全ポートを許可する",
        "explanation": "VPC内への応答は通せるが、公開Webを利用するVPC外のクライアント宛ての応答は対象にならない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "NACLはステートレスなので、受信許可だけでは応答方向が許可されない。",
    "sources": [
      {
        "title": "AWS公式: sg",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: acl",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: flow",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: ssm",
        "url": "https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-007",
    "chapterId": "ch03",
    "domain": 1,
    "conceptIds": [
      "private-link"
    ],
    "prompt": "インターネット出口のないVPC内のECSタスクがSecrets Managerを呼ぶ。タスクロールには対象Secretの読取り許可があり、既定のサービスDNS名を使い続けたい。インターネット出口を新設せず、Secrets Managerへの通信をプライベートな経路に限定したい。必要なネットワーク構成は。",
    "options": [
      {
        "id": "a",
        "text": "Secrets ManagerのInterface endpointを作り、プライベートDNSとタスクからの443を許可するSGを設定する",
        "explanation": "Interface endpointとプライベートDNSにより、インターネット出口を新設せず既定のサービスDNS名で接続できる。タスクからの443をSGで許可し、プライベートな通信経路を成立させる。"
      },
      {
        "id": "b",
        "text": "Secrets ManagerのInterface endpointを作り、タスクの設定をエンドポイント固有DNS名へ変更する",
        "explanation": "インターネットを通らない接続はできるが、既定のサービスDNS名を使い続ける条件に反する。"
      },
      {
        "id": "c",
        "text": "Public NAT Gateway、IGWと必要な経路を構成し、既定DNS名でSecrets Managerの公開エンドポイントへ接続する",
        "explanation": "Public NAT、IGWと必要な経路を整えれば既定DNS名でAPIへ接続できる。しかし本問では出口の新設を禁じ、通信をプライベートな経路に限定しているため除外する。"
      },
      {
        "id": "d",
        "text": "Interface endpointとプライベートDNSを有効にし、エンドポイントのSGでは運用端末のSGから443を許可する",
        "explanation": "DNSと私設経路は用意できるが、接続元であるタスクのSGからの通信が許可されていない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "Interface endpointとプライベートDNSにより、インターネット出口を新設せず既定のサービスDNS名で接続できる。タスクからの443をSGで許可し、プライベートな通信経路を成立させる。",
    "sources": [
      {
        "title": "Secrets ManagerのInterface endpointとプライベートDNS",
        "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/vpc-endpoint-overview.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Public NAT Gateway・IGW・経路による外向き接続",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-008",
    "chapterId": "ch07",
    "domain": 1,
    "conceptIds": [
      "cloudfront-oac"
    ],
    "prompt": "教材動画をCloudFrontで会員へ配信する。S3 RESTオリジンは非公開で、オリジンURLからの直接取得と未購入会員の視聴をどちらも防ぎたい。TLSは設定済み。必要な組合せは。",
    "options": [
      {
        "id": "a",
        "text": "OACと配信を限定したバケットポリシーに加え、購入者へ期限付きの署名付きCookie等を発行する",
        "explanation": "オリジン側と視聴者側の認可を別々に構成し、複数セグメントの会員配信を保護する。"
      },
      {
        "id": "b",
        "text": "OACと非公開バケットを設定し、CloudFrontには通常の公開URLで配信する",
        "explanation": "オリジン迂回は防げるが、配信側で購入者の認可を行わず未購入者も取得できる。"
      },
      {
        "id": "c",
        "text": "購入者には署名付きCookieを配り、S3オリジンは匿名読取りも許可する",
        "explanation": "会員の配信経路は制限できるが、オリジン直アクセスで購入確認を迂回できる。"
      },
      {
        "id": "d",
        "text": "非公開S3とOACを構成し、CloudFrontでは国別制限だけを追加する",
        "explanation": "地域の制約は購入資格を区別しない。同じ地域の未購入者への認可が不足する。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。オリジン側と視聴者側の認可を別々に構成し、複数セグメントの会員配信を保護する。",
    "sources": [
      {
        "title": "CloudFront オリジン",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/DownloadDistS3AndCustomOrigins.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-009",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "kms"
    ],
    "prompt": "別リージョンへコピー済みの暗号化バックアップを隔離アカウントで復元する。保存先S3には到達できるが、KMSのAccessDeniedで失敗した。キーは利用可能で、SCP等の拒否はない。最初に整合させる権限は。",
    "options": [
      {
        "id": "a",
        "text": "実際にバックアップを保護するキーのポリシー等と復元主体のIAMに、必要な復号利用を許可する",
        "explanation": "S3読取りだけでなく、暗号文に対応するKMSキーをその主体が利用できる必要がある。"
      },
      {
        "id": "b",
        "text": "コピー時のロールに宛先キーのEncryptとGenerateDataKeyを許可する",
        "explanation": "暗号化コピーの作成には役立つが、復元主体のDecryptという今回の失敗操作を許可していない。"
      },
      {
        "id": "c",
        "text": "復元主体に保存先S3のGetObjectを許可し、バケットポリシーにも同じ主体を登録する",
        "explanation": "バックアップ本体へのアクセスは整うが、S3とは別のKMSキー利用許可の不足は解消しない。"
      },
      {
        "id": "d",
        "text": "元アカウントのバックアップ作成ロールに、コピー先キーのDecryptを許可する",
        "explanation": "そのロールによる復号には役立つが、隔離アカウントで実行する復元ロールの許可ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "S3読取りだけでなく、暗号文に対応するKMSキーをその主体が利用できる必要がある。",
    "sources": [
      {
        "title": "AWS KMS",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/overview.html",
        "checked": "2026-10-05"
      },
      {
        "title": "Secrets Manager",
        "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html",
        "checked": "2026-10-05"
      },
      {
        "title": "KMSローテーションは既存データを再暗号化しない",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html",
        "checked": "2026-10-08"
      },
      {
        "title": "KMSキー削除と復号不能の影響",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html",
        "checked": "2026-10-08"
      },
      {
        "title": "ACMの更新対象とインポート証明書",
        "url": "https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DNS検証証明書の更新条件",
        "url": "https://docs.aws.amazon.com/acm/latest/userguide/dns-renewal-validation.html",
        "checked": "2026-10-08"
      },
      {
        "title": "分散トレースによる要求経路の調査",
        "url": "https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-010",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "secrets-manager"
    ],
    "prompt": "Fargate上のアプリがDBパスワードをイメージへ焼き込んでいる。イメージへの埋込みを解消し、30日以内ごとの秘密変更と取得経路を整えたい。ホストを管理せず、パスワード更新後にアプリが新しい値を使える設計は。",
    "options": [
      {
        "id": "a",
        "text": "Secrets Managerで対応するローテーションを構成し、タスクロールで限定取得し、アプリの再取得や再起動方針を決める",
        "explanation": "保管場所の変更だけでなく、実DBと秘密の更新、アプリが新値を利用するタイミングまで設計する。"
      },
      {
        "id": "b",
        "text": "Secrets Managerでローテーションし、秘密をタスク起動時の環境変数へ注入して長期稼働させる",
        "explanation": "秘密の定期変更と起動時取得はできるが、稼働済みコンテナの環境変数は自動更新されず、新値への切替手順が不足する。"
      },
      {
        "id": "c",
        "text": "タスクロールでSecrets Managerを毎回参照し、パスワード変更は年1回の定期保守で行う",
        "explanation": "新しい値を再取得できるが、問題で指定する30日以内の定期変更には間隔が長い。"
      },
      {
        "id": "d",
        "text": "DBパスワードを30日ごとに変更して新イメージへ含め、ECSサービスを更新する",
        "explanation": "定期変更と新値利用はできるが、問題で求めるイメージへの秘密の埋込み解消を満たさない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "保管場所の変更だけでなく、実DBと秘密の更新、アプリが新値を利用するタイミングまで設計する。",
    "sources": [
      {
        "title": "AWS KMS",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/overview.html",
        "checked": "2026-10-05"
      },
      {
        "title": "Secrets Manager",
        "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html",
        "checked": "2026-10-05"
      },
      {
        "title": "ECS環境変数への秘密注入と更新",
        "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/secrets-envvar-secrets-manager.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-011",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "acm-renewal"
    ],
    "prompt": "2つのALBで、AはACM発行のDNS検証済み証明書、Bは外部CAの証明書をインポートして使う。毎年の更新漏れを防ぎ、ドメイン検証を維持したい。適切な運用は。",
    "options": [
      {
        "id": "a",
        "text": "AはDNS検証レコードと更新適格な利用状態を維持し、Bは期限を監視して外部CAで更新後に再インポートする",
        "explanation": "ACM発行の管理更新と、インポート証明書の更新責任を区別する。"
      },
      {
        "id": "b",
        "text": "A・Bの更新通知を監視し、両ALBへの関連付けを維持する。更新作業はACMの管理更新へ任せる",
        "explanation": "監視と利用状態の維持はできるが、インポート証明書BはACM管理更新の対象ではなく外部CAでの更新が必要。"
      },
      {
        "id": "c",
        "text": "AのDNS検証レコードは発行完了後に削除し、Bは期限前に外部CAで更新して再インポートする",
        "explanation": "Bの更新手順は適切だが、Aの継続的なDNS検証による更新条件を維持できない。"
      },
      {
        "id": "d",
        "text": "Aの検証レコードを維持し、Bは外部CAの更新証明書をS3へ保管して更新済みと記録する",
        "explanation": "Aの更新条件とBの新証明書の保管は満たすが、BをACMへ再インポートしてALBの提供証明書を更新する工程が足りない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "ACM発行の管理更新と、インポート証明書の更新責任を区別する。",
    "sources": [
      {
        "title": "KMSローテーションは既存データを再暗号化しない",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html",
        "checked": "2026-10-08"
      },
      {
        "title": "KMSキー削除と復号不能の影響",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html",
        "checked": "2026-10-08"
      },
      {
        "title": "ACMの更新対象とインポート証明書",
        "url": "https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DNS検証証明書の更新条件",
        "url": "https://docs.aws.amazon.com/acm/latest/userguide/dns-renewal-validation.html",
        "checked": "2026-10-08"
      },
      {
        "title": "分散トレースによる要求経路の調査",
        "url": "https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-012",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "cloudtrail",
      "aws-config"
    ],
    "prompt": "監査担当は「誰がSGを開放したか」と「開放状態がいつから続いたか」を調べたい。API履歴の記録と構成変更の記録はあらかじめ有効にしている。直近1週間の構成スナップショットの履歴で開放期間を裏付ける場合、適切な調査先の組合せは。",
    "options": [
      {
        "id": "a",
        "text": "CloudTrailで変更主体と操作を調べ、ConfigでSGの構成履歴を確認する",
        "explanation": "操作の証跡と、資源の設定がどう変化したかを別の記録から突き合わせる。"
      },
      {
        "id": "b",
        "text": "ConfigのSG構成タイムラインとVPC Flow Logsの通信記録を突き合わせる",
        "explanation": "開放状態の期間やその間の通信は調べられるが、SG変更APIの実行主体を特定する証跡として不足する。"
      },
      {
        "id": "c",
        "text": "CloudTrailのSG変更イベントとALBアクセスログの要求数を突き合わせる",
        "explanation": "変更主体と操作は追えるが、SGのルール構成がどの期間続いたかを確認する既存の構成履歴を利用していない。"
      },
      {
        "id": "d",
        "text": "現在のSG設定と直近1時間のCloudTrailイベントを照合する",
        "explanation": "現在の状態と最近の操作は調べられるが、1時間より前から続く設定の期間・変更主体を見落とし得る。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "操作の証跡と、資源の設定がどう変化したかを別の記録から突き合わせる。",
    "sources": [
      {
        "title": "CloudWatch",
        "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
        "checked": "2026-10-05"
      },
      {
        "title": "CloudTrail",
        "url": "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS Config",
        "url": "https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-013",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "waf"
    ],
    "prompt": "公開APIはALBで受け、SQLインジェクションと同一送信元からの大量HTTP要求が問題になっている。正常ユーザーのTCP接続は維持したい。アプリ修正と並行して導入する最も直接的な防御は。",
    "options": [
      {
        "id": "a",
        "text": "ALBにWAFのWeb ACLを関連付け、該当する検査ルールとレートベースルールを調整する",
        "explanation": "HTTP内容の検査と要求頻度の制御を入口に適用できる。誤検知も確認する。"
      },
      {
        "id": "b",
        "text": "ALBにWAFのIP許可リストを関連付け、提携企業の固定IPだけを許可する",
        "explanation": "入口で送信元を限定できるが、一般の正常ユーザーも利用する公開APIの継続条件に合わない。"
      },
      {
        "id": "c",
        "text": "ALBにWAFのSQL攻撃検査ルールを関連付け、バックエンドをAuto Scalingで増減する",
        "explanation": "SQL攻撃を検査し処理余力を増やせるが、同一送信元の大量要求を制御する対策が不足する。"
      },
      {
        "id": "d",
        "text": "ALBにWAFのレートベースルールを関連付け、SQL攻撃の内容検査はアプリの次回改修で導入する",
        "explanation": "大量要求には対処するが、改修と並行してSQL攻撃も入口で抑える今回の目的を満たさない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "HTTP内容の検査と要求頻度の制御を入口に適用できる。誤検知も確認する。",
    "sources": [
      {
        "title": "セキュリティサービス",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/security-services.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS WAF",
        "url": "https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-014",
    "chapterId": "ch05",
    "domain": 1,
    "conceptIds": [
      "object-lock",
      "versioning"
    ],
    "prompt": "元バケットの監査ファイル各バージョンは保存後7年間、管理者の操作でも保持期間を短くして消せないことが要件である。上書き前の版も残したい。新規バケットの設計として必要な施策を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "S3 VersioningとObject LockのCompliance保持を要件に合わせて設定する",
        "explanation": "バージョンと保持期限を組み合わせ、保持期間中の削除・短縮を制限する。"
      },
      {
        "id": "b",
        "text": "保持対象バージョンと期間を確認し、期限前の削除を前提にしないライフサイクルを設計する",
        "explanation": "保護単位はバージョンであり、保存費や移行・削除の時期も保持条件へ合わせる。"
      },
      {
        "id": "c",
        "text": "Versioningと7年のGovernance保持を設定し、緊急運用ロールに保持回避権限を許可する",
        "explanation": "通常の削除を制限し版も残せるが、保持回避ができる管理者にも短縮・削除を許さない条件に反する。"
      },
      {
        "id": "d",
        "text": "Versioningと7年保持のバックアップを別アカウントへ作成し、元バケットの旧版は30日で削除する",
        "explanation": "別コピーを長期保持できるが、元の保持対象バージョンを7年間消せないという要件を満たさない。"
      },
      {
        "id": "e",
        "text": "Versioningを有効にし、旧版を30日後にGlacierへ移行して7年後に期限切れとする",
        "explanation": "版の長期保存と階層移行は計画できるが、ライフサイクルだけでは管理者の期限前削除を禁止しない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "バージョンと保持期限を組み合わせ、保持期間中の削除・短縮を制限する。 保護単位はバージョンであり、保存費や移行・削除の時期も保持条件へ合わせる。",
    "sources": [
      {
        "title": "AWS公式: version",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: lock",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: replication",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: signed",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: fsx",
        "url": "https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: snapshot",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-015",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "abac"
    ],
    "prompt": "Projectタグが一致するリソースだけを開発者が更新できるABACを導入する。開発者は自分の主体タグや資源タグも自由に書き換えられる現状である。認可条件の迂回を防ぐ追加設計は。",
    "options": [
      {
        "id": "a",
        "text": "認可に使うタグの付与・変更権限を制約し、主体タグと資源タグの条件を必要な操作に適用する",
        "explanation": "一致条件だけでなく、その条件値を誰が変更できるかも統制する。"
      },
      {
        "id": "b",
        "text": "Projectタグ一致を更新のAllow条件とし、タグ編集は既存の開発者ポリシーで管理する",
        "explanation": "一致条件による絞込みはできるが、現状の自由なタグ編集権限が残り、条件値を書き換えて迂回できる。"
      },
      {
        "id": "c",
        "text": "主体のProjectタグ変更を管理専用ロールへ限定し、開発者にはリソースのProjectタグ編集を許可する",
        "explanation": "主体側の変更は制限するが、リソース側を自分に合わせる迂回経路が残る。"
      },
      {
        "id": "d",
        "text": "リソースのProjectタグ変更を管理専用ロールへ限定し、開発者には自分の主体タグ編集を許可する",
        "explanation": "リソース側の変更は制限するが、主体側を対象リソースに合わせる迂回経路が残る。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "一致条件だけでなく、その条件値を誰が変更できるかも統制する。",
    "sources": [
      {
        "title": "AWS公式: policy",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: scp",
        "url": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: boundary",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: abac",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-016",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "permissions-boundary"
    ],
    "prompt": "運用チームにロール作成を委任するが、作成したロールで自分以上の権限へ昇格させたくない。チームはポリシーを付け替えられる。アクセス許可の境界を使う場合、抜け道を避ける設計は。",
    "options": [
      {
        "id": "a",
        "text": "指定境界付きの作成だけを許可し、委任先が境界を外す・変更する操作も制限する",
        "explanation": "上限を付けるだけでなく、その上限を委任先自身が解除できないようにする。"
      },
      {
        "id": "b",
        "text": "ロール作成時に指定境界を要求し、作成後の境界変更・削除は委任チームへ許可する",
        "explanation": "作成時の上限は強制できるが、後から境界を解除して権限を広げられる。"
      },
      {
        "id": "c",
        "text": "指定境界の削除を拒否し、別の境界ポリシーへの変更は委任チームへ許可する",
        "explanation": "境界なしにはできなくても、より広い境界への付替えで指定上限を迂回できる。"
      },
      {
        "id": "d",
        "text": "境界のARNを固定して削除・付替えを拒否し、その管理ポリシーの新バージョン作成は委任する",
        "explanation": "ARN自体は固定できるが、境界ポリシーの内容を広げることで上限を変更できる。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "上限を付けるだけでなく、その上限を委任先自身が解除できないようにする。",
    "sources": [
      {
        "title": "AWS公式: policy",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: scp",
        "url": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: boundary",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: abac",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-017",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "cognito",
      "cognito-identity"
    ],
    "prompt": "スマートフォン会員アプリでログイン後、利用者ごとに限定したS3領域へ直接アップロードさせたい。AWSの長期キーは端末へ埋め込まない。選ぶ構成は。",
    "options": [
      {
        "id": "a",
        "text": "Cognitoユーザープール等で認証し、IDプールから限定ロールの一時認証情報を取得する",
        "explanation": "会員認証とAWS資源への一時認可を分け、対象プレフィックス等を権限で制約する。"
      },
      {
        "id": "b",
        "text": "IDプールから全会員共通の一時ロールを払い出し、会員用バケット全体のPutObjectを許可する",
        "explanation": "端末に長期キーを置かず直接アップロードできるが、利用者ごとの領域への限定がない。"
      },
      {
        "id": "c",
        "text": "ユーザープールで認証し、アップロード本文をAPIサーバー経由でS3へ保存する",
        "explanation": "会員認証とサーバー側の権限管理はできるが、端末からS3へ直接アップロードする条件に合わない。"
      },
      {
        "id": "d",
        "text": "会員ごとのIAMユーザーにS3プレフィックスを割り当て、そのキーを端末の安全な保存領域へ配る",
        "explanation": "会員別の範囲は限定できるが、長期キーを端末へ配らない条件に反する。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "会員認証とAWS資源への一時認可を分け、対象プレフィックス等を権限で制約する。",
    "sources": [
      {
        "title": "AWS公式: external",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios_third-party.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: identity",
        "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: cognito",
        "url": "https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: access",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: s3block",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: cognitoid",
        "url": "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-018",
    "chapterId": "ch07",
    "domain": 1,
    "conceptIds": [
      "direct-connect"
    ],
    "prompt": "工場とAWS間に専用線がある。回線の帯域は十分だが、機密データについてアプリ端点間の暗号化が監査要件である。専用線の利用を継続しながら要件を満たす方針は。",
    "options": [
      {
        "id": "a",
        "text": "アプリ端点間のTLS等を構成し、専用線の冗長性と暗号化の範囲を別々に検証する",
        "explanation": "専用接続そのものを端点間暗号化と同一視せず、指定された範囲を保護する。"
      },
      {
        "id": "b",
        "text": "Direct Connect接続へ対応するMACsecを設定し、アプリ間は既存のHTTPを利用する",
        "explanation": "対応する回線区間は暗号化できるが、アプリ端点までの区間全体の暗号化にはならない。"
      },
      {
        "id": "c",
        "text": "専用線の上に拠点ルーターからAWS VPN終端までのIPsecを構成し、終端後はHTTPで通信する",
        "explanation": "トンネル区間は保護できるが、VPN終端からアプリまでを含む端点間暗号化の条件を満たさない。"
      },
      {
        "id": "d",
        "text": "TLSをAWSのALBで終端し、ALBからアプリへはHTTPで転送する",
        "explanation": "工場からALBまでは暗号化できるが、AWSアプリ端点までの暗号化が連続しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "専用接続そのものを端点間暗号化と同一視せず、指定された範囲を保護する。",
    "sources": [
      {
        "title": "Direct Connectの既定は通信暗号化なし",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Direct Connectの冗長経路設計",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/resiliency_toolkit.html",
        "checked": "2026-10-08"
      },
      {
        "title": "CloudFront TTLとオリジン負荷",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Global Acceleratorの固定IPと正常な到達先",
        "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-019",
    "chapterId": "ch03",
    "domain": 1,
    "conceptIds": [
      "vpc-endpoint"
    ],
    "prompt": "S3へのGateway endpointを作りネットワーク経路は通る。監査では特定バケットだけをGetObjectさせたいが、対象ロールにS3権限はまだない。エンドポイントポリシーで対象をAllowした後の正しい理解は。",
    "options": [
      {
        "id": "a",
        "text": "エンドポイント側の制約に加えてIAM等で対象バケット操作を許可する必要がある",
        "explanation": "経路のポリシーだけで主体の利用権限が付与されるわけではない。"
      },
      {
        "id": "b",
        "text": "対象バケットをAllowするエンドポイントポリシーを設定し、ロールにはListBucketを許可する",
        "explanation": "経路制約と一覧取得は整うが、データを読むGetObjectの許可を満たさない。"
      },
      {
        "id": "c",
        "text": "ロールに全バケットのGetObjectを許可し、エンドポイントはデフォルトの全許可ポリシーへ戻す",
        "explanation": "読取りはできるが、今回指定する特定バケットへの利用限定を失う。"
      },
      {
        "id": "d",
        "text": "エンドポイントポリシーを維持し、ロールには対象バケットのPutObjectを許可する",
        "explanation": "同じバケットへ書き込む経路は構成できるが、要求されたGetObjectは別の操作である。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "経路のポリシーだけで主体の利用権限が付与されるわけではない。",
    "sources": [
      {
        "title": "AWS公式: endpoint",
        "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: privatelink",
        "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: peering",
        "url": "https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: tgw",
        "url": "https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: vpn",
        "url": "https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: direct",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html",
        "checked": "2026-10-05"
      },
      {
        "title": "NATの時間・処理量・AZ間転送の費用要因",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html",
        "checked": "2026-10-08"
      },
      {
        "title": "ゾーン型NATのAZ障害と同一AZ経路",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-020",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "kms"
    ],
    "prompt": "暗号化バックアップを10年保持する一方、KMSキーの削除を検討している。復元試験は旧キーを利用して成功しており、別キーへの再暗号化はしていない。削除前の判断として適切なのは。",
    "options": [
      {
        "id": "a",
        "text": "そのキーに依存する暗号文と復元要件を棚卸しし、必要なバックアップが残る間はキーの利用可能性を確保する",
        "explanation": "バックアップ本体があっても必要なキーを失うと復号できないため、保持と鍵の寿命を整合させる。"
      },
      {
        "id": "b",
        "text": "旧キーのエイリアスを新キーへ向け、以後のバックアップを新キーで作成して旧キーの削除を予約する",
        "explanation": "新規バックアップの依存先は切り替えられるが、保持中の旧暗号文の復号には旧キーが必要である。"
      },
      {
        "id": "c",
        "text": "旧キーの利用ログを直近30日調べ、Decryptがなければ削除を予約する",
        "explanation": "最近の使用は把握できるが、長期保持バックアップは最近復元していなくても将来そのキーを必要とする。"
      },
      {
        "id": "d",
        "text": "同じ暗号化バックアップを別バケットへ複製し、オブジェクト数を照合してから旧キーを削除する",
        "explanation": "データのコピーは増やせるが、同じキーで暗号化されたコピーは鍵の喪失に対して独立ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "バックアップ本体があっても必要なキーを失うと復号できないため、保持と鍵の寿命を整合させる。",
    "sources": [
      {
        "title": "AWS KMS",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/overview.html",
        "checked": "2026-10-05"
      },
      {
        "title": "Secrets Manager",
        "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html",
        "checked": "2026-10-05"
      },
      {
        "title": "KMSローテーションは既存データを再暗号化しない",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html",
        "checked": "2026-10-08"
      },
      {
        "title": "KMSキー削除と復号不能の影響",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html",
        "checked": "2026-10-08"
      },
      {
        "title": "ACMの更新対象とインポート証明書",
        "url": "https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DNS検証証明書の更新条件",
        "url": "https://docs.aws.amazon.com/acm/latest/userguide/dns-renewal-validation.html",
        "checked": "2026-10-08"
      },
      {
        "title": "分散トレースによる要求経路の調査",
        "url": "https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-021",
    "chapterId": "ch01",
    "domain": 2,
    "conceptIds": [
      "residual-capacity",
      "availability"
    ],
    "prompt": "注文APIはピーク毎秒1,000件で、単一AZ停止後も同じ量を処理する。障害時の追加起動は計画に含めない。入口・状態・DBは要件を満たし、計算費は確保する総処理能力に比例する学習用モデルとする。平常時と障害後の容量を満たす、最も低費用の配置は。",
    "options": [
      {
        "id": "a",
        "text": "3 AZに各毎秒600件の能力を確保する",
        "explanation": "通常1,800件/秒、1 AZ停止後1,200件/秒で要件を満たし、各AZで1,000件/秒を確保する適合案より常設容量が少ない。"
      },
      {
        "id": "b",
        "text": "2 AZに各毎秒600件の能力を確保する",
        "explanation": "通常1,200件/秒でピークを満たすが、1 AZ停止後600件/秒となり不足する。"
      },
      {
        "id": "c",
        "text": "3 AZに各毎秒400件の能力を確保する",
        "explanation": "通常1,200件/秒でピークを満たすが、1 AZ停止後800件/秒となり不足する。"
      },
      {
        "id": "d",
        "text": "3 AZに各毎秒1,000件の能力を確保する",
        "explanation": "停止後も2,000件/秒で継続できるが、各AZで600件/秒を確保する適合案より常設容量と仮定の費用が大きい。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "通常1,800件/秒、1 AZ停止後1,200件/秒で要件を満たし、各AZで1,000件/秒を確保する適合案より常設容量が少ない。",
    "sources": [
      {
        "title": "AWS公式: regions",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: ec2",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: spot",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html",
        "checked": "2026-10-05"
      },
      {
        "title": "EC2インスタンスストア",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html",
        "checked": "2026-10-05"
      },
      {
        "title": "障害後も新規起動に依存しない残存容量",
        "url": "https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_withstand_component_failures_static_stability.html",
        "checked": "2026-10-08"
      },
      {
        "title": "ALBの正常ターゲット選択と全異常時のfail-open",
        "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-022",
    "chapterId": "ch04",
    "domain": 2,
    "conceptIds": [
      "stateless",
      "auto-scaling"
    ],
    "prompt": "チケット販売サイトは2 AZのALB配下で自動増減するが、カートを各EC2のローカルメモリに置いている。通常時の粘着セッションは有効でも、インスタンス障害でカートが消える。障害後の別ノードで、運用者の作業を待たずカート内容を引き継げる構成は。",
    "options": [
      {
        "id": "a",
        "text": "カートを要件に合う共有の永続ストアへ移し、アプリノードを交換可能にする",
        "explanation": "振分け先が変わっても状態を読み直せるようにし、ノード障害と利用者の状態を切り離す。"
      },
      {
        "id": "b",
        "text": "カートをローカルメモリに保持し、粘着セッションの有効期間を購入完了の想定時間まで延ばす",
        "explanation": "正常ノードへの再訪では同じ状態を利用できるが、障害で失ったノードの状態を別ノードへ引き継げない。"
      },
      {
        "id": "c",
        "text": "カートをEC2のEBSへ定期保存し、障害時に運用者がボリュームを別ノードへ付け替える",
        "explanation": "メモリだけより永続性は高いが、自動増減する別ノードで直ちに継続する共有状態の設計ではなく、保存間隔や付替え待ちが残る。"
      },
      {
        "id": "d",
        "text": "ALBのヘルスチェックを短くし、異常時は別ノードに新しい空のカートを作成する",
        "explanation": "入口は正常ノードへ切り替わるが、利用者の既存カート内容が引き継がれない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "振分け先が変わっても状態を読み直せるようにし、ノード障害と利用者の状態を切り離す。",
    "sources": [
      {
        "title": "AWS公式: asg",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: scaling",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scheduled-scaling.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: health",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-023",
    "chapterId": "ch06",
    "domain": 2,
    "conceptIds": [
      "rds-multi-az",
      "read-replica"
    ],
    "prompt": "受注DBは単一リージョンのRDS for PostgreSQLで、AZ障害時の自動切替を優先する。読取り負荷は十分低く、アプリは再接続に対応する。同期スタンバイを使う従来型構成として適切なのは。",
    "options": [
      {
        "id": "a",
        "text": "Multi-AZ DBインスタンス構成を使い、切替時の接続再試行を実装する",
        "explanation": "別AZの同期スタンバイへの切替と、アプリ側の接続回復を組み合わせる。スタンバイは読取り用ではない。"
      },
      {
        "id": "b",
        "text": "同じAZにRead Replicaを置き、障害時は監視通知を受けて手動昇格する",
        "explanation": "読取り先は増やせるがAZ障害を共有し、指定された同期スタンバイの自動切替でもない。"
      },
      {
        "id": "c",
        "text": "別AZに非同期Read Replicaを置き、手動昇格と接続先変更の手順を用意する",
        "explanation": "AZは分離できるが、指定された同期スタンバイと自動切替の構成を満たさない。"
      },
      {
        "id": "d",
        "text": "単一AZのDBを維持し、別リージョンへバックアップを複製して復元する",
        "explanation": "地域障害の備えにはなるが、今回必要なAZ障害時の自動切替ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。別AZの同期スタンバイへの切替と、アプリ側の接続回復を組み合わせる。スタンバイは読取り用ではない。",
    "sources": [
      {
        "title": "AWS公式: multi",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: replica",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-024",
    "chapterId": "ch09",
    "domain": 2,
    "conceptIds": [
      "sqs",
      "visibility-timeout",
      "idempotency"
    ],
    "prompt": "決済ワーカーはSQS Standardから受信後、DBへの記録には成功したがDeleteMessage前に停止した。再配信で二重計上を防ぎながら未処理の要求は再実行したい。選ぶ設計は。",
    "options": [
      {
        "id": "a",
        "text": "要求IDの一意制約等で業務更新を冪等にし、正常処理後にメッセージを削除する",
        "explanation": "少なくとも1回の配信を前提に、受信回数と業務上の計上回数を切り離す。"
      },
      {
        "id": "b",
        "text": "受信直後にDeleteMessageし、DB更新は失敗時にプロセス内で再試行する",
        "explanation": "通常時の重複配信を減らせるが、削除後にプロセスが停止すると未計上要求をキューから復旧できない。"
      },
      {
        "id": "c",
        "text": "可視性タイムアウトを処理時間より長く設定し、DB記録後にDeleteMessageする",
        "explanation": "処理中の再受信は抑えられるが、DB成功後・削除前の停止による再配信と二重計上は残る。"
      },
      {
        "id": "d",
        "text": "各ワーカーのメモリに処理済み要求IDを保存し、受信時に同じワーカー内で重複を除く",
        "explanation": "同じプロセス内では重複を除けるが、停止後や別ワーカーへの再配信で記録が引き継がれない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "少なくとも1回の配信を前提に、受信回数と業務上の計上回数を切り離す。",
    "sources": [
      {
        "title": "SQS の可視性タイムアウト",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-05"
      },
      {
        "title": "SQS・SNS・EventBridge の選択",
        "url": "https://docs.aws.amazon.com/decision-guides/latest/decision-guides/sns-or-sqs-or-eventbridge.html",
        "checked": "2026-10-05"
      },
      {
        "title": "DLQの調査・再投入・保持期間",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html",
        "checked": "2026-10-08"
      },
      {
        "title": "1台当たりバックログによるスケーリング",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html",
        "checked": "2026-10-08"
      },
      {
        "title": "LambdaのSQS部分バッチ応答",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-025",
    "chapterId": "ch09",
    "domain": 2,
    "conceptIds": [
      "dlq",
      "partial-batch"
    ],
    "prompt": "LambdaがSQS Standardの10件をまとめて処理し、バッチ全体の成否を返している。1件の形式不正で成功した9件も再処理される。処理時間は上限内でタイムアウトはない。10件のバッチサイズを維持し、成功済み項目を再配信対象から外し、不正メッセージ本体を自動隔離して後で再投入したい。組み合わせる施策を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "部分バッチ応答を有効にし、失敗したメッセージIDを正しく返す",
        "explanation": "バッチ全体の失敗として扱わず、成功済みのメッセージの不要な再試行を減らす。"
      },
      {
        "id": "b",
        "text": "適切な最大受信回数とDLQを設定し、移動後の監視・修正・再投入手順を整える",
        "explanation": "繰り返し失敗する項目を隔離して調査可能にし、修正後の復旧まで設計する。"
      },
      {
        "id": "c",
        "text": "バッチサイズを1件へ変更し、各実行の成否で個別に再試行する",
        "explanation": "成功項目を巻き込む再試行は減らせるが、10件のバッチサイズを維持する条件に反する。"
      },
      {
        "id": "d",
        "text": "可視性タイムアウトを延ばし、バッチ全体の失敗を返して再試行間隔を長くする",
        "explanation": "再試行の頻度は下げられるが、形式不正は解消せず、成功済み項目もバッチごと再配信される。"
      },
      {
        "id": "e",
        "text": "不正項目の例外をログへ記録し、バッチ全体の成功を返す",
        "explanation": "成功済み項目の反復は止まるが、元メッセージ本体をキューへ隔離して再投入する経路が残らない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "バッチ全体の失敗として扱わず、成功済みのメッセージの不要な再試行を減らす。 繰り返し失敗する項目を隔離して調査可能にし、修正後の復旧まで設計する。",
    "sources": [
      {
        "title": "SQS のデッドレターキュー",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html",
        "checked": "2026-10-05"
      },
      {
        "title": "CloudWatch",
        "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
        "checked": "2026-10-05"
      },
      {
        "title": "SQSの不可視期間・再受信と削除",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-08"
      },
      {
        "title": "1台当たりバックログによるスケーリング",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html",
        "checked": "2026-10-08"
      },
      {
        "title": "LambdaのSQS部分バッチ応答",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-026",
    "chapterId": "ch09",
    "domain": 2,
    "conceptIds": [
      "fanout",
      "sns",
      "sqs"
    ],
    "prompt": "注文イベントを請求・発送・分析の3サービスがそれぞれ全件処理する。分析は毎晩8時間停止するが、他のサービスは継続し、分析は翌朝追い付く必要がある。適切な構成は。",
    "options": [
      {
        "id": "a",
        "text": "SNSからサービスごとのSQSへ配信し、各サービスが自分のキューを消費する",
        "explanation": "全サービスへの複製と、個別の蓄積・再試行を両立できる。"
      },
      {
        "id": "b",
        "text": "注文イベントを単一SQSへ入れ、3サービスのワーカーで並行消費する",
        "explanation": "蓄積と消費の並列化はできるが、競合消費では各サービスが全件を受け取らない。"
      },
      {
        "id": "c",
        "text": "SNSから請求・発送のキューへ配信し、分析には夜間停止中のHTTPエンドポイントへ同期転送する",
        "explanation": "請求・発送は独立して処理できるが、分析の計画停止を翌朝まで吸収する専用の蓄積経路がない。"
      },
      {
        "id": "d",
        "text": "SNSから3つの専用SQSへ配信し、分析キューの保持期間を1時間に設定する",
        "explanation": "全サービスへの複製と分離は実現するが、翌朝までの停止が1時間を超えると分析分が期限切れになる。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "全サービスへの複製と、個別の蓄積・再試行を両立できる。",
    "sources": [
      {
        "title": "SQS の可視性タイムアウト",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-05"
      },
      {
        "title": "SQS・SNS・EventBridge の選択",
        "url": "https://docs.aws.amazon.com/decision-guides/latest/decision-guides/sns-or-sqs-or-eventbridge.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-027",
    "chapterId": "ch11",
    "domain": 2,
    "conceptIds": [
      "rpo",
      "rto"
    ],
    "prompt": "店舗システムはRPO15分・RTO60分が要件である。バックアップ間隔が最大データ損失幅に相当し、復元・設定再現・業務確認は順次実行する学習用モデルとする。検証値どおりに復旧できる場合、両要件を満たす案は。",
    "options": [
      {
        "id": "a",
        "text": "15分間隔で保護し、復元25分・設定20分・業務確認10分で復旧する",
        "explanation": "データ損失は最大15分、復旧は合計55分で両方の目標以内。"
      },
      {
        "id": "b",
        "text": "60分間隔で保護し、復元25分・設定20分・業務確認10分で復旧する",
        "explanation": "復旧55分はRTO内だが、最大60分のデータ損失がRPOを超える。"
      },
      {
        "id": "c",
        "text": "15分間隔で保護し、復元45分・設定20分・業務確認10分で復旧する",
        "explanation": "RPOは満たすが、復旧合計75分がRTO60分を超える。"
      },
      {
        "id": "d",
        "text": "60分間隔で保護し、復元15分・設定10分・業務確認10分で復旧する",
        "explanation": "復旧35分は十分速いが、保護の間隔がRPO15分を超える。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "データ損失は最大15分、復旧は合計55分で両方の目標以内。",
    "sources": [
      {
        "title": "災害復旧戦略",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-05"
      },
      {
        "title": "S3 File GatewayのNFS/SMBとキャッシュ",
        "url": "https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html",
        "checked": "2026-10-08"
      },
      {
        "title": "容量予約とクォータの区別",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DataSyncの移行・継続転送",
        "url": "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Transfer Familyのファイル転送プロトコル",
        "url": "https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-028",
    "chapterId": "ch11",
    "domain": 2,
    "conceptIds": [
      "warm-standby",
      "pilot-light",
      "recovery-quota"
    ],
    "prompt": "リージョン障害後のRTOは10分である。全環境の新規構築には40分、縮小稼働環境の拡張と切替は訓練で8分だった。複製遅延はRPO以内で、復旧先のクォータ・容量も検証済み。適切な戦略は。",
    "options": [
      {
        "id": "a",
        "text": "縮小したアプリ全体を復旧先で稼働させるWarm Standbyを選び、8分の手順を定期検証する",
        "explanation": "稼働済みの環境を拡張する測定値がRTO内であり、複製と容量の前提も満たしている。"
      },
      {
        "id": "b",
        "text": "バックアップを別リージョンへ保持し、障害後にIaCで40分かけて全環境を構築する",
        "explanation": "構成再現性は高められても、検証された40分はRTO10分を超える。"
      },
      {
        "id": "c",
        "text": "DBだけを常時動かすPilot Lightへ削減し、40分かかるアプリの新規構築を障害後に行う",
        "explanation": "待機費は下げられても、提示されたアプリ構築時間がRTOを超える。"
      },
      {
        "id": "d",
        "text": "同じリージョンの3 AZへ本番を増やし、別リージョンの待機環境は廃止する",
        "explanation": "AZ耐障害性は高められるが、対象のリージョン障害に対する復旧先を失う。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。稼働済みの環境を拡張する測定値がRTO内であり、複製と容量の前提も満たしている。",
    "sources": [
      {
        "title": "災害復旧戦略",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-05"
      },
      {
        "title": "S3 File GatewayのNFS/SMBとキャッシュ",
        "url": "https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html",
        "checked": "2026-10-08"
      },
      {
        "title": "容量予約とクォータの区別",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DataSyncの移行・継続転送",
        "url": "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Transfer Familyのファイル転送プロトコル",
        "url": "https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-029",
    "chapterId": "ch11",
    "domain": 2,
    "conceptIds": [
      "restore-test",
      "backup"
    ],
    "prompt": "暗号化バックアップを別アカウントへ隔離した。削除耐性と復元手順の実効性を確かめたい。復元時の鍵利用を含め、本番障害前に行う最も適切な確認は。",
    "options": [
      {
        "id": "a",
        "text": "隔離先の実際の復元ロールで復元し、鍵・ネットワーク・依存先・業務読書きまで試験する",
        "explanation": "オブジェクトの存在だけでなく、別アカウントの権限と業務再開まで検証できる。"
      },
      {
        "id": "b",
        "text": "元アカウントの作成ロールでバックアップ一覧と復元用オブジェクトの読取りを確認する",
        "explanation": "バックアップの存在と元の主体の読取りは確認できるが、隔離先の実際の復元主体・復号・業務再開を試していない。"
      },
      {
        "id": "c",
        "text": "隔離先の復元ロールでDBを復元し、管理画面の利用可能ステータスを記録する",
        "explanation": "実際の主体による復号・DB復元は確認できるが、業務からの接続・依存先・読書きまでは検証できない。"
      },
      {
        "id": "d",
        "text": "隔離先の管理者ロールで復元し、業務の読書きテストを実行する",
        "explanation": "復元データと業務動作は検証できるが、実運用の限定された復元ロールでも成功することを確認できない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "オブジェクトの存在だけでなく、別アカウントの権限と業務再開まで検証できる。",
    "sources": [
      {
        "title": "災害復旧戦略",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-05"
      },
      {
        "title": "S3 File GatewayのNFS/SMBとキャッシュ",
        "url": "https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html",
        "checked": "2026-10-08"
      },
      {
        "title": "容量予約とクォータの区別",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DataSyncの移行・継続転送",
        "url": "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Transfer Familyのファイル転送プロトコル",
        "url": "https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-030",
    "chapterId": "ch05",
    "domain": 2,
    "conceptIds": [
      "versioning",
      "s3-replication"
    ],
    "prompt": "ファイルの誤上書きから直前版へ戻すことと、リージョン障害時に別リージョンで利用することを両立したい。非同期複製の未反映時間は許容する。必要な構成として適切なのは。",
    "options": [
      {
        "id": "a",
        "text": "Versioningで世代を保持し、要件に合うS3レプリケーションと復旧時の参照先切替を設計する",
        "explanation": "論理的な上書きとリージョン障害を別々の仕組みで扱い、複製遅延も前提に含める。"
      },
      {
        "id": "b",
        "text": "Versioningを有効にし、同一リージョンの別バケットへ全世代を定期コピーする",
        "explanation": "誤上書きの前の版は残せるが、リージョン障害に対する別リージョンの利用先を用意していない。"
      },
      {
        "id": "c",
        "text": "別リージョンに最新オブジェクトを定期コピーし、両側の旧版をコピー完了時に削除する",
        "explanation": "別リージョンで最新データを利用できるが、誤上書きもコピーされると直前版が残らない。"
      },
      {
        "id": "d",
        "text": "Versioningを有効にし、リージョン障害を検出してから別リージョンへのコピーを開始する",
        "explanation": "通常時の版復元はできるが、元リージョンへアクセスできない障害中には必要なコピーを新たに作れない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "論理的な上書きとリージョン障害を別々の仕組みで扱い、複製遅延も前提に含める。",
    "sources": [
      {
        "title": "AWS公式: classes",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: lifecycle",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: glacier",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/restoring-objects.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: replication",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: s3encrypt",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingServerSideEncryption.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: version",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: lock",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: signed",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: fsx",
        "url": "https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: snapshot",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-031",
    "chapterId": "ch03",
    "domain": 2,
    "conceptIds": [
      "nat-gateway",
      "route"
    ],
    "prompt": "2 AZのプライベートワーカーが外部のライセンスAPIへ定期通信する。片方のAZが失われても残ったワーカーが外へ出られることを求める。AZ間転送も避けたい。最も適切な出口構成は。",
    "options": [
      {
        "id": "a",
        "text": "AZごとにNAT Gatewayを配置し、各プライベートサブネットは同じAZのNATへルーティングする",
        "explanation": "出口のAZ依存を分離し、平常時のAZをまたぐNAT経路も避けられる。"
      },
      {
        "id": "b",
        "text": "AZ-AにだけNAT Gatewayを置き、両AZの全外向き経路を集約する",
        "explanation": "NATのあるAZが失われると残存AZの出口も失い、平常時のAZ間転送も生じる。"
      },
      {
        "id": "c",
        "text": "両AZにNAT Gatewayを置き、両サブネットの既定経路はAZ-Aへ向け、障害時に手動で変更する",
        "explanation": "代替の出口自体はあるが、手動切替まで継続できず、平常時はAZ-BからAZ間転送が生じる。"
      },
      {
        "id": "d",
        "text": "各AZのNAT Gatewayへ、反対側AZのプライベートサブネットから既定経路を向ける",
        "explanation": "両AZに出口を配置できるが、平常時にAZ越境し、片方の停止で残存ワーカーの宛先NATも失う。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "出口のAZ依存を分離し、平常時のAZをまたぐNAT経路も避けられる。",
    "sources": [
      {
        "title": "AWS公式: route",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/subnet-route-tables.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: nat",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: egress",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/egress-only-internet-gateway.html",
        "checked": "2026-10-05"
      },
      {
        "title": "NATの時間・処理量・AZ間転送の費用要因",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html",
        "checked": "2026-10-08"
      },
      {
        "title": "ゾーン型NATのAZ障害と同一AZ経路",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Gateway endpointの対象・ルート・追加料金なし",
        "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-032",
    "chapterId": "ch07",
    "domain": 2,
    "conceptIds": [
      "dns-ttl",
      "route53"
    ],
    "prompt": "2リージョンのAPIをDNSフェイルオーバーで切り替える。セカンダリは復旧済みでも、一部クライアントは旧アドレスへ接続して失敗する。ヘルスチェックが正常に検出している場合の説明と対策は。",
    "options": [
      {
        "id": "a",
        "text": "DNSキャッシュが残る時間と接続再試行を考慮し、TTL設定・クライアント挙動を含めて切替時間を検証する",
        "explanation": "権威DNSで応答が変わっても、全利用者が同時に再解決するわけではない。"
      },
      {
        "id": "b",
        "text": "ヘルスチェックの間隔を短くし、DNSレコードとクライアントの再解決間隔は維持する",
        "explanation": "新たな障害の検出は速まるが、今回は既に検出済みであり旧アドレスのキャッシュ保持を解消しない。"
      },
      {
        "id": "c",
        "text": "セカンダリの台数を増やし、DNSレコードとクライアントの接続管理は維持する",
        "explanation": "切替先の処理能力は増えるが、旧アドレスを保持したクライアントの接続先は変わらない。"
      },
      {
        "id": "d",
        "text": "TTLを1日に延ばし、クライアントはキャッシュ期限が来てから名前を再解決する",
        "explanation": "DNS照会回数を減らせるが、障害時も旧応答を長く保持し、早い切替の目的に劣る。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "権威DNSで応答が変わっても、全利用者が同時に再解決するわけではない。",
    "sources": [
      {
        "title": "Route 53 ルーティング",
        "url": "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-033",
    "chapterId": "ch07",
    "domain": 2,
    "conceptIds": [
      "direct-connect",
      "site-to-site-vpn"
    ],
    "prompt": "拠点はDirect Connectを使い、切断時はSite-to-Site VPNへ切り替わる。重要通信300Mbpsを障害時も維持し、回線変更は必要最小限にしたい。単一VPN経路は試験で安定して200Mbpsまでだった。学習用の実測値に基づき次に進める案は。",
    "options": [
      {
        "id": "a",
        "text": "代替経路の分散・増強を検証し、重要通信300Mbpsを運べる容量を確保する",
        "explanation": "必要なのは切断後の代替帯域である。複数経路も分散条件とフロー上限を実測して300Mbpsを満たす必要がある。"
      },
      {
        "id": "b",
        "text": "通常時のDirect Connect帯域を倍増し、切断時は現状のVPN経路へ切り替える",
        "explanation": "通常時の余力は増えるが、障害時の200Mbps制約は残る。"
      },
      {
        "id": "c",
        "text": "VPNへ重要通信を優先するQoSを適用し、総帯域200Mbpsで運用する",
        "explanation": "重要通信の優先順位は上げられるが、重要通信だけでも300Mbps必要なので不足する。"
      },
      {
        "id": "d",
        "text": "VPNの経路優先度を上げて常時使用し、Direct Connectを待機経路にする",
        "explanation": "切替方式は変えられるが、常用時から200Mbpsの経路で300Mbpsを運ぶことになり不足する。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必要なのは切断後の代替帯域である。複数経路も分散条件とフロー上限を実測して300Mbpsを満たす必要がある。",
    "sources": [
      {
        "title": "Direct Connectの既定は通信暗号化なし",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Direct Connectの冗長経路設計",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/resiliency_toolkit.html",
        "checked": "2026-10-08"
      },
      {
        "title": "CloudFront TTLとオリジン負荷",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Global Acceleratorの固定IPと正常な到達先",
        "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-034",
    "chapterId": "ch08",
    "domain": 2,
    "conceptIds": [
      "lambda-concurrency",
      "lambda"
    ],
    "prompt": "Lambdaから接続するDBは安全に同時100接続まで処理できる。1実行1接続で、イベントが急増するとDBが過負荷になる。バッファと再試行は設計済み。下流を守る施策は。",
    "options": [
      {
        "id": "a",
        "text": "同時実行数を下流能力に合わせて制限し、滞留とエラーを監視して処理速度を調整する",
        "explanation": "Lambdaの増加余地だけでなくDB制約を上限に含め、急増をバッファで吸収する。"
      },
      {
        "id": "b",
        "text": "プロビジョンド同時実行数を100へ設定し、予約済み同時実行数は未設定で運用する",
        "explanation": "100実行の起動準備はできるが、プロビジョンド同時実行は実行数の上限ではなく、追加実行でDB能力を超え得る。"
      },
      {
        "id": "c",
        "text": "Lambdaメモリを増やして1件の処理を短縮し、イベントソースの並列化上限を200へ設定する",
        "explanation": "処理時間短縮は期待できるが、1実行1接続で最大200実行では同時100接続の制約を保証しない。"
      },
      {
        "id": "d",
        "text": "DB接続失敗時にバックオフを行い、Lambdaの同時実行はリージョンクォータの範囲で増やす",
        "explanation": "再試行の集中は緩和できるが、最初の試行による同時接続が下流の上限を超える問題は残る。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "Lambdaの増加余地だけでなくDB制約を上限に含め、急増をバッファで吸収する。",
    "sources": [
      {
        "title": "Lambda",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
        "checked": "2026-10-05"
      },
      {
        "title": "SQS の可視性タイムアウト",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-05"
      },
      {
        "title": "標準Lambdaの900秒とManaged Instancesの条件付き例外",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Lambdaのメモリに比例するCPU配分",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html",
        "checked": "2026-10-08"
      },
      {
        "title": "SQSイベントソースの最大同時実行制御",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Batchのジョブキューと実行基盤",
        "url": "https://docs.aws.amazon.com/batch/latest/userguide/what-is-batch.html",
        "checked": "2026-10-08"
      },
      {
        "title": "予約済み同時実行とプロビジョニング済み同時実行",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-035",
    "chapterId": "ch06",
    "domain": 2,
    "conceptIds": [
      "rds-proxy",
      "point-in-time-recovery"
    ],
    "prompt": "業務アプリが誤ったUPDATEを大量実行した。Multi-AZへの同期は正常で、接続数にも余裕がある。事故前の時刻へデータを戻し、内容を確認してからアプリを切り替えたい。適切な対応は。",
    "options": [
      {
        "id": "a",
        "text": "有効なPITRで事故前時刻の新しいDBへ復元し、整合性・接続先を検証して切り替える",
        "explanation": "同期冗長化では誤更新も反映されるため、過去の保護時点へ復元する手段を使う。"
      },
      {
        "id": "b",
        "text": "現在のMulti-AZスタンバイへフェイルオーバーし、アプリを再接続する",
        "explanation": "DBノードやAZ障害の切替には使えるが、同期済みの誤更新も切替先へ反映されている。"
      },
      {
        "id": "c",
        "text": "事故後の最新スナップショットを新しいDBへ復元し、内容を検証して接続先を変更する",
        "explanation": "分離したDBで確認できるが、事故後の保護時点では取り消したい更新を含んでいる。"
      },
      {
        "id": "d",
        "text": "事故後にRead Replicaを新設して追随を待ち、昇格したDBへ切り替える",
        "explanation": "移行・昇格の経路は用意できるが、事故後の状態を複製するため事故前のデータへ戻らない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "同期冗長化では誤更新も反映されるため、過去の保護時点へ復元する手段を使う。",
    "sources": [
      {
        "title": "AWS公式: backup",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: proxy",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: cache",
        "url": "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: dax",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-036",
    "chapterId": "ch11",
    "domain": 2,
    "conceptIds": [
      "iac",
      "recovery-quota"
    ],
    "prompt": "バックアップと秘密・鍵の復元は確認済みだが、災害訓練で復旧先のSG再現とEC2上限調整に長時間を要した。データ複製方式は維持する。手作業の再作成と障害後の増枠待ちを減らす施策を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "SG等の構成をIaCで管理し、復旧先でも展開・差分検証する",
        "explanation": "手作業の設定漏れと再現時間を減らし、復旧先で使えることを確認する。"
      },
      {
        "id": "b",
        "text": "復旧時の必要台数とサービスクォータを事前に確認し、必要な増枠や容量確保を計画する",
        "explanation": "平常時の利用量ではなく障害時の拡張量から制約を先に解消する。"
      },
      {
        "id": "c",
        "text": "バックアップ間隔を短縮し、復旧先への複製遅延を監視する",
        "explanation": "RPOやデータ鮮度は改善できるが、確認済みのデータ保護とは別のSG再現・起動上限の問題は解決しない。"
      },
      {
        "id": "d",
        "text": "元リージョンのEC2クォータを増枠し、その値を復旧手順の台数として記載する",
        "explanation": "元リージョンでは拡張できるが、実際に起動する復旧先リージョンの適用値は別途整える必要がある。"
      },
      {
        "id": "e",
        "text": "復旧先SGの作成後にConfigで差分を検知し、通知を受けた運用者が手修正する",
        "explanation": "設定差分の発見には役立つが、毎回の手作業での作成・修正を減らす再現性の改善には劣る。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "手作業の設定漏れと再現時間を減らし、復旧先で使えることを確認する。 平常時の利用量ではなく障害時の拡張量から制約を先に解消する。",
    "sources": [
      {
        "title": "S3 File GatewayのNFS/SMBとキャッシュ",
        "url": "https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DR方式・IaC・復元検証の条件",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-08"
      },
      {
        "title": "容量予約とクォータの区別",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DataSyncの移行・継続転送",
        "url": "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Transfer Familyのファイル転送プロトコル",
        "url": "https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-037",
    "chapterId": "ch04",
    "domain": 2,
    "conceptIds": [
      "spot",
      "capacity-reservation"
    ],
    "prompt": "夜間の画像解析はチェックポイントから再開でき、翌日までに完了すればよい。一方、制御APIには中断が許されず、特定AZの起動容量も確保したい。適切な役割分担は。",
    "options": [
      {
        "id": "a",
        "text": "解析は中断対応したSpotを活用し、制御APIは要件に合う通常実行とCapacity Reservation等で必要容量を確保する",
        "explanation": "中断許容性と起動容量の要求をワークロードごとに分ける。割引契約だけでは容量の代替にならない。"
      },
      {
        "id": "b",
        "text": "解析と制御APIをSpotで実行し、制御APIは2分前の中断通知で再起動する",
        "explanation": "解析の中断対策には使えるが、制御APIの中断不可と指定AZの容量確保を満たさない。"
      },
      {
        "id": "c",
        "text": "解析は中断対応したSpot、制御APIはリージョンRIに適合するEC2で実行する",
        "explanation": "解析の割引とAPIの通常実行は選べるが、リージョンRIは指定AZの起動容量を予約しない。"
      },
      {
        "id": "d",
        "text": "解析はチェックポイント付きSpot、制御APIはCompute Savings Plansの対象EC2で実行する",
        "explanation": "対象利用への割引は得られるが、Savings Plans単独では指定AZの容量確保にならない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "中断許容性と起動容量の要求をワークロードごとに分ける。割引契約だけでは容量の代替にならない。",
    "sources": [
      {
        "title": "AWS公式: ec2",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: store",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: capacity",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-05"
      },
      {
        "title": "資源特性によるEC2ファミリー選択",
        "url": "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html",
        "checked": "2026-10-08"
      },
      {
        "title": "負荷と台数に対応するターゲット追跡指標",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html",
        "checked": "2026-10-08"
      },
      {
        "title": "クラスタ・パーティション・スプレッド配置",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html",
        "checked": "2026-10-08"
      },
      {
        "title": "RIの属性・期間・支払い",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html",
        "checked": "2026-10-08"
      },
      {
        "title": "RIのリージョン・AZスコープ",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/reserved-instances-scope.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Savings Plansの種類と対象",
        "url": "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-038",
    "chapterId": "ch05",
    "domain": 3,
    "conceptIds": [
      "gp3",
      "storage-performance"
    ],
    "prompt": "分析EC2はgp3の容量に余裕があるが、連続読取りでボリュームの転送量上限に達している。必要IOPSは既に満たし、EC2側のEBS帯域にも余裕がある。最初の調整は。",
    "options": [
      {
        "id": "a",
        "text": "必要な転送量を見積もり、gp3のスループット設定を上限内で増やして実測する",
        "explanation": "容量・IOPS・MiB/sを分け、測定で特定したボリューム側の転送量を調整する。"
      },
      {
        "id": "b",
        "text": "gp3の容量を2倍にし、設定IOPSとスループットは現在値を維持する",
        "explanation": "保存領域は増えるが、今回の制約であるgp3の設定スループットは増えない。"
      },
      {
        "id": "c",
        "text": "gp3のIOPSを上げ、容量とスループット設定は現在値を維持する",
        "explanation": "小さいI/Oの処理回数は増やせるが、既にIOPSは足りており転送量の上限が残る。"
      },
      {
        "id": "d",
        "text": "EBS帯域の大きいEC2へ変更し、接続するgp3の設定は現在値を維持する",
        "explanation": "EC2側の帯域は増えるが、余裕のある側を増強してもボリュームの転送量制約を解消しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "容量・IOPS・MiB/sを分け、測定で特定したボリューム側の転送量を調整する。",
    "sources": [
      {
        "title": "gp3は容量とIOPS・スループットを独立設定",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
        "checked": "2026-10-08"
      },
      {
        "title": "io2の低遅延・IOPS用途",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html",
        "checked": "2026-10-08"
      },
      {
        "title": "EFS性能とスループットモード",
        "url": "https://docs.aws.amazon.com/efs/latest/ug/performance.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-039",
    "chapterId": "ch05",
    "domain": 3,
    "conceptIds": [
      "efs",
      "fsx-windows"
    ],
    "prompt": "Windowsの業務サーバーを複数AZへ移す。共有サービスも単一AZ障害に耐える必要がある。既存アプリはSMB共有とActive Directoryのアクセス制御を使い、Linux向けへの改修はできない。適切な共有ストレージは。",
    "options": [
      {
        "id": "a",
        "text": "FSx for Windows File Serverの対応するMulti-AZ構成を使い、AD・SMB要件を確認する",
        "explanation": "既存のWindowsファイル共有と認証方式を保ち、AZをまたぐ可用性要件を扱える。"
      },
      {
        "id": "b",
        "text": "EFSをマウントするLinuxゲートウェイを追加し、アプリをNFS利用へ改修する",
        "explanation": "共有ファイルは提供できるが、既存Windowsアプリを改修できない条件に反する。"
      },
      {
        "id": "c",
        "text": "EBSへSMBサーバーを自前構築し、単一AZの1台だけで提供する",
        "explanation": "SMBは提供できても、複数AZのサーバーへ移す際の共有サービスの可用性が単一AZに依存する。"
      },
      {
        "id": "d",
        "text": "S3のオブジェクトAPIへアプリを改修し、IAMでファイルアクセスを置き換える",
        "explanation": "オブジェクト利用への改修と既存AD・SMBの変更が必要で、指定された互換性を満たさない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。既存のWindowsファイル共有と認証方式を保ち、AZをまたぐ可用性要件を扱える。",
    "sources": [
      {
        "title": "AWS公式: s3",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: ebs",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: efs",
        "url": "https://docs.aws.amazon.com/efs/latest/ug/features.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: fsx",
        "url": "https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: multipart",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: transfer",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: s3consistency",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: version",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: lock",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: replication",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: signed",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: snapshot",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html",
        "checked": "2026-10-05"
      },
      {
        "title": "gp3は容量とIOPS・スループットを独立設定",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
        "checked": "2026-10-08"
      },
      {
        "title": "io2の低遅延・IOPS用途",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html",
        "checked": "2026-10-08"
      },
      {
        "title": "EFS性能とスループットモード",
        "url": "https://docs.aws.amazon.com/efs/latest/ug/performance.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-040",
    "chapterId": "ch05",
    "domain": 3,
    "conceptIds": [
      "multipart-upload",
      "transfer-acceleration"
    ],
    "prompt": "海外拠点からS3へ2GiBのファイルをアップロードする。回線の瞬断で全体の再送が多い。転送高速化サービスの効果は拠点別に計測する方針である。まず再送範囲を小さくする手段は。",
    "options": [
      {
        "id": "a",
        "text": "Multipart uploadで分割・並列化し、失敗したパートを再送する。未完了パートの掃除も設定する",
        "explanation": "大きな1リクエストのやり直しを避け、再試行をパート単位へ限定できる。"
      },
      {
        "id": "b",
        "text": "Transfer Accelerationを有効にし、2GiBを1回のPutObjectで送信する",
        "explanation": "長距離経路の改善を検証できるが、単一要求が失敗した場合の再送範囲はファイル全体である。"
      },
      {
        "id": "c",
        "text": "複数ファイルのPutObjectを並列実行し、各2GiBファイルは単一要求として送信する",
        "explanation": "ファイル間の並列性は増えるが、1ファイルの失敗時に再送する単位は小さくならない。"
      },
      {
        "id": "d",
        "text": "単一PutObjectのタイムアウトを長くし、失敗時は指数バックオフで再送する",
        "explanation": "一時的な遅延への待機と再試行は改善できるが、瞬断した要求の再送範囲は依然ファイル全体となる。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "大きな1リクエストのやり直しを避け、再試行をパート単位へ限定できる。",
    "sources": [
      {
        "title": "AWS公式: s3",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: ebs",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: efs",
        "url": "https://docs.aws.amazon.com/efs/latest/ug/features.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: fsx",
        "url": "https://docs.aws.amazon.com/fsx/latest/WindowsGuide/what-is.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: multipart",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: transfer",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/transfer-acceleration.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: s3consistency",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel",
        "checked": "2026-10-05"
      },
      {
        "title": "S3単一PUTとマルチパートアップロード",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/upload-objects.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-041",
    "chapterId": "ch06",
    "domain": 3,
    "conceptIds": [
      "partition-key",
      "dynamodb"
    ],
    "prompt": "DynamoDBの書込みを増やしたところ、全体の設定容量には余裕があるのに、同じ顧客IDへ集中する処理がスロットリングされる。ほかの顧客は正常である。優先する改善は。",
    "options": [
      {
        "id": "a",
        "text": "アクセスの集中を計測し、キー分散や書込みシャーディングと読取り統合の設計を検討する",
        "explanation": "全体容量だけでなくホットなキーの集中を解消する必要がある。読取り側の影響も評価する。"
      },
      {
        "id": "b",
        "text": "パーティションキーを維持し、テーブル全体のプロビジョンド書込み容量を倍増する",
        "explanation": "全体の処理枠は増えるが、既に全体は余裕があり、同一キーに集中するアクセス特性を変えない。"
      },
      {
        "id": "c",
        "text": "顧客IDを主キーに維持し、履歴項目へTTLを設定して保管量を削減する",
        "explanation": "保存量と寿命は管理できるが、現在の同一キーへの書込み集中を分散しない。"
      },
      {
        "id": "d",
        "text": "顧客IDを主キーに維持し、書込み元の並列数をさらに増やす",
        "explanation": "書込み側の待機は短縮できても、同じキーへ同時到着する負荷が増え、集中の原因を残す。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "全体容量だけでなくホットなキーの集中を解消する必要がある。読取り側の影響も評価する。",
    "sources": [
      {
        "title": "AWS公式: dynamo",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: key",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: index",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: ttl",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: transactions",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transactions.html",
        "checked": "2026-10-05"
      },
      {
        "title": "DynamoDBの読取り・書込み単位",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DynamoDBプロビジョンド容量",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-042",
    "chapterId": "ch06",
    "domain": 3,
    "conceptIds": [
      "read-replica",
      "cache"
    ],
    "prompt": "商品検索の読取り負荷がRDSを圧迫する。商品説明は最大30秒の古さを許容するが、購入直後の注文確認は完了済み更新を反映する必要がある。非同期Read Replicaの遅延は最大60秒を観測した。商品と注文の読取り経路として、検索負荷を減らし両方の鮮度を満たす構成は。",
    "options": [
      {
        "id": "a",
        "text": "商品説明はプライマリから補充する最長30秒TTLのキャッシュへ、注文確認はコミット後にプライマリへ読む",
        "explanation": "商品検索をキャッシュで分散し、商品は最長30秒、注文はコミット後のプライマリ読取りでそれぞれの鮮度を満たす。"
      },
      {
        "id": "b",
        "text": "商品説明と注文確認をRead Replicaへ送り、プライマリは書込みを担当する",
        "explanation": "読取り負荷を分離できるが、最大60秒の遅延は商品の30秒許容と注文の最新確認を満たさない。"
      },
      {
        "id": "c",
        "text": "商品説明はプライマリへ、注文確認はRead Replicaへ読む",
        "explanation": "注文読取りは分離できるが、重い検索をプライマリに残し、最新必須の注文を遅延し得るReplicaへ置いている。"
      },
      {
        "id": "d",
        "text": "商品説明と注文確認を、更新時無効化を持たない最長30秒TTLのキャッシュへ読む",
        "explanation": "商品説明の鮮度と負荷軽減は満たすが、注文確認にも最大30秒前の値を返すため購入直後の要件に合わない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "商品検索をキャッシュで分散し、商品は最長30秒、注文はコミット後のプライマリ読取りでそれぞれの鮮度を満たす。",
    "sources": [
      {
        "title": "AWS公式: multi",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: replica",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: backup",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: proxy",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: cache",
        "url": "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/WhatIs.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: dax",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DAX.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-043",
    "chapterId": "ch06",
    "domain": 3,
    "conceptIds": [
      "gsi",
      "consistency"
    ],
    "prompt": "DynamoDBで商品IDを主キーにしているが、カテゴリ別一覧のため毎回全表Scanして遅くなった。一覧は結果整合でよく、カテゴリと価格範囲を索引のキー条件で絞り、返す前に読む量を減らしたい。適切な設計は。",
    "options": [
      {
        "id": "a",
        "text": "カテゴリをパーティションキー、価格をソートキーとするGSIを作り、Queryのキー条件で範囲指定する",
        "explanation": "必要な検索条件へ索引を用意して読取り対象を絞る。GSIの結果整合性は今回許容される。"
      },
      {
        "id": "b",
        "text": "主キーを維持し、ScanにカテゴリのFilterExpressionと必要属性のProjectionExpressionを付ける",
        "explanation": "返す項目・属性は絞れるが、フィルター前に走査する範囲は残り、索引による読取り対象の縮小にはならない。"
      },
      {
        "id": "c",
        "text": "主キーを維持し、Parallel Scanのセグメント数と読取り容量を増やす",
        "explanation": "全表走査を並行化できるが、毎回読む対象をカテゴリ・価格範囲へ絞る仕組みではなく消費も増え得る。"
      },
      {
        "id": "d",
        "text": "カテゴリをパーティションキーとするGSIを作り、価格は索引に投影せず、全件を取得してテーブルから価格を照会する",
        "explanation": "カテゴリでは絞れるが、価格範囲を索引のキー条件で絞れず、追加の本表読取りと絞込みが必要になる。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必要な検索条件へ索引を用意して読取り対象を絞る。GSIの結果整合性は今回許容される。",
    "sources": [
      {
        "title": "AWS公式: dynamo",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: key",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: index",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SecondaryIndexes.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: ttl",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: transactions",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transactions.html",
        "checked": "2026-10-05"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-044",
    "chapterId": "ch08",
    "domain": 3,
    "conceptIds": [
      "lambda-memory",
      "lambda"
    ],
    "prompt": "画像変換LambdaのCPU処理が長く、p95の応答目標を超えている。入出力待ちは短く、メモリ使用量だけではCPU配分を判断できない。費用も含めて設定を決める方法は。",
    "options": [
      {
        "id": "a",
        "text": "複数のメモリ設定で時間・p95・実行費を計測し、応答目標を満たす候補を比較する",
        "explanation": "メモリ設定によるCPU配分と実行時間の変化を測定し、割当量×時間の費用を評価する。"
      },
      {
        "id": "b",
        "text": "現在と同じメモリで予約済み同時実行数を増やし、バッチ全体の完了時間を比較する",
        "explanation": "並行処理できる件数は増やせるが、1件のCPU処理が支配するp95の改善を直接比較する方法ではない。"
      },
      {
        "id": "c",
        "text": "現在と同じメモリでタイムアウトを延ばし、完了率とエラー件数を比較する",
        "explanation": "時間切れは減らせる可能性があるが、応答目標を超えているCPU処理の実行時間を短縮しない。"
      },
      {
        "id": "d",
        "text": "低いメモリ設定を選び、使用メモリの余裕率とGB秒単価を基準に費用を比較する",
        "explanation": "割当量の削減には注目できるが、CPU配分に伴う実行時間とp95の変化を測らず、応答条件と総費用を比較できない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "メモリ設定によるCPU配分と実行時間の変化を測定し、割当量×時間の費用を評価する。",
    "sources": [
      {
        "title": "Lambda",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
        "checked": "2026-10-05"
      },
      {
        "title": "SQS の可視性タイムアウト",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-05"
      },
      {
        "title": "標準Lambdaの900秒とManaged Instancesの条件付き例外",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Lambdaのメモリに比例するCPU配分",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html",
        "checked": "2026-10-08"
      },
      {
        "title": "SQSイベントソースの最大同時実行制御",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Batchのジョブキューと実行基盤",
        "url": "https://docs.aws.amazon.com/batch/latest/userguide/what-is-batch.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-045",
    "chapterId": "ch08",
    "domain": 3,
    "conceptIds": [
      "fargate",
      "batch"
    ],
    "prompt": "既存コンテナの科学計算は1ジョブ平均40分で、ジョブごとのCPU・メモリ要求も異なる。標準Lambdaの実行時間制限に合わせた分割は難しい。FargateのCPU・メモリ・機能の対応範囲に収まることは検証済みである。ホスト管理を抑えてキューで順次投入する候補は。",
    "options": [
      {
        "id": "a",
        "text": "AWS Batchと対応するFargate実行環境を、必要なリソース・機能が適合する範囲で使う",
        "explanation": "長いコンテナジョブのスケジューリングと実行資源の管理を分担できる。Fargateの対応条件は確認する。"
      },
      {
        "id": "b",
        "text": "コンテナイメージを標準Lambdaで起動し、タイムアウトを15分、エラー時の再試行を2回に設定する",
        "explanation": "ホスト管理は抑えられるが、分割できない40分の処理は1回の実行上限内に完了せず、再試行でも継続実行にはならない。"
      },
      {
        "id": "c",
        "text": "固定1台のEC2上でジョブキューとDockerを運用し、必要CPU・メモリに合わせて同時起動数を制御する",
        "explanation": "長時間ジョブと資源調整は実現できるが、ホストとキュー実行基盤の管理が必要で、管理負担を抑える目的ではAに劣る。"
      },
      {
        "id": "d",
        "text": "BatchのEC2計算環境を使い、専用AMIとコンテナホストの更新を自社で管理する",
        "explanation": "長時間ジョブのスケジューリングは実現できるが、今回はFargateで満たせる処理のためホスト・AMIの管理負担を増やす。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "長いコンテナジョブのスケジューリングと実行資源の管理を分担できる。Fargateの対応条件は確認する。",
    "sources": [
      {
        "title": "Amazon ECS",
        "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html",
        "checked": "2026-10-05"
      },
      {
        "title": "標準Lambdaの900秒とManaged Instancesの条件付き例外",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Lambdaのメモリに比例するCPU配分",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html",
        "checked": "2026-10-08"
      },
      {
        "title": "SQSイベントソースの最大同時実行制御",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Batchのジョブキューと実行基盤",
        "url": "https://docs.aws.amazon.com/batch/latest/userguide/what-is-batch.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-046",
    "chapterId": "ch07",
    "domain": 3,
    "conceptIds": [
      "cloudfront",
      "cache-key"
    ],
    "prompt": "同じ公開画像をCloudFrontで配信するが、追跡用Cookieを全てキャッシュキーへ含めたためヒット率が低い。Cookie値で画像内容は変わらず、画像は版付きURLで更新する。適切な改善は。",
    "options": [
      {
        "id": "a",
        "text": "内容に影響しないCookieをキャッシュキーから除き、版付きURLと適切なTTLで共有する",
        "explanation": "表現が同じ要求をまとめ、更新はURLの版で分けられる。個人別内容では同じ判断はできない。"
      },
      {
        "id": "b",
        "text": "追跡Cookieを全てキーに含めたまま、画像のTTLだけを長くする",
        "explanation": "各利用者の再訪には効いても、同一画像を利用者間で共有できない原因を残す。"
      },
      {
        "id": "c",
        "text": "TTLを短くし、毎回の条件付き確認でオリジンの鮮度を優先する",
        "explanation": "版付き不変画像で不要な再確認を増やし、今回の低ヒット率の原因を解消しない。"
      },
      {
        "id": "d",
        "text": "全画像を同じキャッシュキーへ正規化し、URLの版番号も取り除く",
        "explanation": "共有範囲は広がるが、異なる版や画像が区別できず必要な内容の正しさを失う。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。表現が同じ要求をまとめ、更新はURLの版で分けられる。個人別内容では同じ判断はできない。",
    "sources": [
      {
        "title": "CloudFront",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html",
        "checked": "2026-10-05"
      },
      {
        "title": "Global Accelerator",
        "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html",
        "checked": "2026-10-05"
      },
      {
        "title": "Direct Connectの既定は通信暗号化なし",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Direct Connectの冗長経路設計",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/resiliency_toolkit.html",
        "checked": "2026-10-08"
      },
      {
        "title": "CloudFront TTLとオリジン負荷",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-047",
    "chapterId": "ch07",
    "domain": 3,
    "conceptIds": [
      "global-accelerator",
      "cloudfront"
    ],
    "prompt": "多地域の利用者がリアルタイム対戦サーバーへUDP接続する。クライアントはリージョン追加時も変更しない共通の固定入口IPを許可リストに登録し、正常なリージョンへ新規接続を誘導したい。コンテンツキャッシュは不要である。適切な入口は。",
    "options": [
      {
        "id": "a",
        "text": "Global Acceleratorで対応するリージョンのエンドポイントを構成し、固定Anycast IPを使う",
        "explanation": "UDPのグローバル入口と静的IP、ヘルスに基づくエンドポイント選択が要求に合う。"
      },
      {
        "id": "b",
        "text": "各リージョンのNLBをRoute 53のレイテンシー応答とヘルスチェックで選び、NLBのIPを許可リストへ登録する",
        "explanation": "UDPの地域分散はできるが、リージョンをまたぐ共通の固定入口IPではなく、エンドポイント追加で許可リストを変更する必要がある。"
      },
      {
        "id": "c",
        "text": "単一リージョンのNLBに固定IPを割り当て、同リージョン内の複数AZへ対戦サーバーを配置する",
        "explanation": "UDPと固定IP・AZ分散は満たすが、リージョン障害時に別リージョンへ新規接続を誘導できない。"
      },
      {
        "id": "d",
        "text": "CloudFrontでHTTPSの接続先案内APIを配信し、クライアントは案内された対戦サーバーへUDP接続する",
        "explanation": "接続先案内をグローバル配信できるが、UDP本体は地域ごとのサーバーIPへ向かい、共通の固定IP入口という条件に合わない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "UDPのグローバル入口と静的IP、ヘルスに基づくエンドポイント選択が要求に合う。",
    "sources": [
      {
        "title": "CloudFront",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html",
        "checked": "2026-10-05"
      },
      {
        "title": "Global Accelerator",
        "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html",
        "checked": "2026-10-05"
      },
      {
        "title": "Direct Connectの既定は通信暗号化なし",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Direct Connectの冗長経路設計",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/resiliency_toolkit.html",
        "checked": "2026-10-08"
      },
      {
        "title": "CloudFront TTLとオリジン負荷",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-048",
    "chapterId": "ch12",
    "domain": 3,
    "conceptIds": [
      "kinesis",
      "firehose"
    ],
    "prompt": "センサーを秒単位で監視し、2つの独立処理系が同じイベントを読み、正常処理済みのイベントも保持期間内で任意時点から再読取りする。障害後のリプレイ期間を設定し、S3への配送だけでは足りない。適切な中心サービスは。",
    "options": [
      {
        "id": "a",
        "text": "Kinesis Data Streamsの保持期間とコンシューマー容量を設計して、複数処理系が読む",
        "explanation": "ストリーム上の保持・再読取りと独立したコンシューマーを利用できる。"
      },
      {
        "id": "b",
        "text": "FirehoseからS3へ配送し、両処理系は5分間隔で到着オブジェクトを検索する",
        "explanation": "保存済みデータを両方で再読取りできるが、5分間隔は秒単位の監視に間に合わない。"
      },
      {
        "id": "c",
        "text": "SNSから処理系ごとのSQSへ配信し、正常処理したイベントは各キューから削除する",
        "explanation": "全イベントを両処理系へすぐ配信できるが、正常処理・削除済みのイベントを後で任意時点からリプレイする保存先がない。"
      },
      {
        "id": "d",
        "text": "イベントをS3へ日次ファイルとしてまとめ、両処理系が日次ファイルを繰り返し読む",
        "explanation": "長期保管と全件の再読取りはできるが、日次のまとめ待ちが秒単位監視の条件に合わない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "ストリーム上の保持・再読取りと独立したコンシューマーを利用できる。",
    "sources": [
      {
        "title": "分析サービス",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html",
        "checked": "2026-10-05"
      },
      {
        "title": "Athena の最適化",
        "url": "https://docs.aws.amazon.com/athena/latest/ug/performance-tuning-data-optimization-techniques.html",
        "checked": "2026-10-05"
      },
      {
        "title": "Kinesisのストリーム保持と複数コンシューマー",
        "url": "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Firehoseの宛先へのバッファ配信",
        "url": "https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html",
        "checked": "2026-10-08"
      },
      {
        "title": "QuickSightの対応データソース",
        "url": "https://docs.aws.amazon.com/quicksight/latest/user/supported-data-sources.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Lake Formationのデータレイク権限",
        "url": "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-049",
    "chapterId": "ch12",
    "domain": 3,
    "conceptIds": [
      "athena",
      "glue"
    ],
    "prompt": "S3のクリックログをAthenaで分析する。毎日のクエリは特定の日付と数列だけを読むが、現状は非圧縮CSVを全件走査する。結果再利用と実行頻度は変えず、読取り対象を減らす施策を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "日付でパーティション化し、クエリで対象日付を絞れるようにする",
        "explanation": "パーティション条件により不要な日付範囲の読取りを避ける。"
      },
      {
        "id": "b",
        "text": "Parquet等の列指向形式へ変換し、必要な列だけをSELECTする",
        "explanation": "列単位の読み出しを使い、全列を読むCSVより対象量を絞れる。"
      },
      {
        "id": "c",
        "text": "CSVに日付条件を含むビューを作成し、保存先の単一プレフィックスとファイル形式は維持する",
        "explanation": "SQL結果を日付で絞れるが、非パーティションのCSVを読んでから評価するため、保存上の走査範囲を減らす施策にはならない。"
      },
      {
        "id": "d",
        "text": "結果再利用の最大経過時間を1時間に設定し、同じSQLの結果を再利用する",
        "explanation": "条件が合えばクエリの読取りを省けるが、今回固定した結果再利用の方針を変更する案である。"
      },
      {
        "id": "e",
        "text": "CSVを大きな非圧縮ファイルへ結合し、1回で全期間・全列を読むSQLを維持する",
        "explanation": "小ファイルの管理や要求のオーバーヘッドは減らせるが、日付・列に対応する読取りデータ量は減らさない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "パーティション条件により不要な日付範囲の読取りを避ける。 列単位の読み出しを使い、全列を読むCSVより対象量を絞れる。",
    "sources": [
      {
        "title": "分析サービス",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html",
        "checked": "2026-10-05"
      },
      {
        "title": "Athena の最適化",
        "url": "https://docs.aws.amazon.com/athena/latest/ug/performance-tuning-data-optimization-techniques.html",
        "checked": "2026-10-05"
      },
      {
        "title": "Kinesisのストリーム保持と複数コンシューマー",
        "url": "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Firehoseの宛先へのバッファ配信",
        "url": "https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html",
        "checked": "2026-10-08"
      },
      {
        "title": "QuickSightの対応データソース",
        "url": "https://docs.aws.amazon.com/quicksight/latest/user/supported-data-sources.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Lake Formationのデータレイク権限",
        "url": "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-050",
    "chapterId": "ch09",
    "domain": 3,
    "conceptIds": [
      "queue-scaling"
    ],
    "prompt": "変換ワーカー1台の処理能力は毎秒20件、到着は毎秒100件である。滞留3,000件を新規到着も処理しながら5分以内に解消したい。下流容量と並列化には余裕があり、能力は一定とする。必要最小台数は。",
    "options": [
      {
        "id": "a",
        "text": "ワーカーを6台にする",
        "explanation": "毎秒120件から到着100件を引いて滞留が20件/秒減り、150秒で解消する。5台では純減せず、最小は6台。"
      },
      {
        "id": "b",
        "text": "ワーカーを5台にする",
        "explanation": "毎秒100件で新規到着は処理できるが、余剰がないため既存滞留は減らない。"
      },
      {
        "id": "c",
        "text": "ワーカーを4台にして、可視性タイムアウトを長く設定する",
        "explanation": "処理中の再受信は抑えられるが、毎秒80件では到着100件に追い付かず滞留が増える。"
      },
      {
        "id": "d",
        "text": "ワーカーを10台にする",
        "explanation": "毎秒200件で滞留は30秒で解消し時間条件は満たすが、6台で十分なので必要最小台数ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "毎秒120件から到着100件を引いて滞留が20件/秒減り、150秒で解消する。5台では純減せず、最小は6台。",
    "sources": [
      {
        "title": "SQS のデッドレターキュー",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html",
        "checked": "2026-10-05"
      },
      {
        "title": "CloudWatch",
        "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
        "checked": "2026-10-05"
      },
      {
        "title": "SQSの不可視期間・再受信と削除",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-08"
      },
      {
        "title": "1台当たりバックログによるスケーリング",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html",
        "checked": "2026-10-08"
      },
      {
        "title": "LambdaのSQS部分バッチ応答",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-051",
    "chapterId": "ch06",
    "domain": 3,
    "conceptIds": [
      "database-selection"
    ],
    "prompt": "会計アプリは複数表JOINと複数行トランザクションを使い、PostgreSQL互換SQLの変更を最小化したい。ミリ秒の単一キー参照だけでなく既存の整合性を維持する。第一候補は。",
    "options": [
      {
        "id": "a",
        "text": "RDS for PostgreSQLまたは互換要件を確認したAurora PostgreSQLを評価する",
        "explanation": "関係モデルと既存SQL・トランザクションの適合を先に確認できる。"
      },
      {
        "id": "b",
        "text": "DynamoDBのキー設計に合わせてデータを非正規化し、JOINはアプリ側へ移す",
        "explanation": "単一キー参照や拡張性には向くが、既存PostgreSQLのSQLとJOINを最小変更で使う条件に劣る。"
      },
      {
        "id": "c",
        "text": "RDS for MySQLへ移し、PostgreSQL固有の型・SQLを変換してアプリを改修する",
        "explanation": "関係DBとトランザクションは使えるが、既存のPostgreSQL互換性を維持する案より変換が必要。"
      },
      {
        "id": "d",
        "text": "S3へ更新履歴を連携し、Athenaの定期集計結果を会計アプリへ返す",
        "explanation": "大量履歴の分析はできるが、既存の複数行トランザクションによるオンライン更新を置き換える設計ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "関係モデルと既存SQL・トランザクションの適合を先に確認できる。",
    "sources": [
      {
        "title": "アクセスパターンとデータモデルによるDB選択",
        "url": "https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/db-selection.html",
        "checked": "2026-10-08"
      },
      {
        "title": "RDS単一スタンバイの同期複製と読取り不可",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DynamoDB容量方式の課金と負荷特性",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DynamoDBテーブル・GSI・リージョン間整合性",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Aurora StandardとI/O-Optimizedの課金要素",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/User_DBInstanceBilling.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-052",
    "chapterId": "ch08",
    "domain": 3,
    "conceptIds": [
      "step-functions",
      "lambda"
    ],
    "prompt": "申請処理は承認待ち、課金、失敗時の補償、最大数日の待機からなる。実行状態と再試行を追跡し、待機中の計算資源を占有したくない。適切な構成は。",
    "options": [
      {
        "id": "a",
        "text": "Step Functions Standardの待機・再試行・補償分岐を使い、各処理をLambda等で実行する",
        "explanation": "業務状態を実行基盤で追跡し、数日の待機を計算プロセスに保持せず、再試行と補償を明示できる。"
      },
      {
        "id": "b",
        "text": "常駐EC2上のワーカーで状態をDBへ保存し、承認完了までポーリングする",
        "explanation": "状態と再試行は自作できるが、待機中もポーリング用計算資源を占有する。"
      },
      {
        "id": "c",
        "text": "Step Functions Expressの単一実行に課金と承認待ちをまとめ、タイムアウト時に再実行する",
        "explanation": "短時間の複数処理は追跡できるが、単一Express実行の時間上限では最大数日の待機を収容できない。"
      },
      {
        "id": "d",
        "text": "SQSで承認待ち要求を保持し、可視性タイムアウト1回分を承認期限として管理する",
        "explanation": "メッセージを蓄積してワーカーを解放できるが、可視性タイムアウトの上限では数日を覆えず、補償を含む業務状態も別設計が必要。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "業務状態を実行基盤で追跡し、数日の待機を計算プロセスに保持せず、再試行と補償を明示できる。",
    "sources": [
      {
        "title": "Lambda",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
        "checked": "2026-10-05"
      },
      {
        "title": "SQS の可視性タイムアウト",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-05"
      },
      {
        "title": "API Gateway",
        "url": "https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html",
        "checked": "2026-10-05"
      },
      {
        "title": "Step Functions",
        "url": "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html",
        "checked": "2026-10-05"
      },
      {
        "title": "標準Lambdaの900秒とManaged Instancesの条件付き例外",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Lambdaのメモリに比例するCPU配分",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html",
        "checked": "2026-10-08"
      },
      {
        "title": "SQSイベントソースの最大同時実行制御",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Batchのジョブキューと実行基盤",
        "url": "https://docs.aws.amazon.com/batch/latest/userguide/what-is-batch.html",
        "checked": "2026-10-08"
      },
      {
        "title": "StandardとExpressの実行時間・用途",
        "url": "https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-053",
    "chapterId": "ch12",
    "domain": 4,
    "conceptIds": [
      "cost-explorer",
      "budgets",
      "cur"
    ],
    "prompt": "財務部は月次の費用増加サービスを対話的に調べ、予測額が予算を超えそうなら担当へ通知したい。詳細な独自配賦は今回不要で、通知を利用停止の保証とは扱わない。最も直接的な組合せは。",
    "options": [
      {
        "id": "a",
        "text": "Cost Explorerで傾向と内訳を分析し、AWS Budgetsで実績・予測のしきい値通知を設定する",
        "explanation": "分析と予算監視を分ける。請求データには反映遅延があり、通知だけで即時停止するわけではない。"
      },
      {
        "id": "b",
        "text": "Cost Explorerで内訳を分析し、Budgetsの実績額が予算を超えた時点で通知する",
        "explanation": "費用の分析と実績超過通知はできるが、超過しそうな予測段階で通知する条件を満たさない。"
      },
      {
        "id": "c",
        "text": "CURを月締め後にSQL集計し、集計結果が予算を超えていたらメール通知する",
        "explanation": "詳細な費用分析と実績報告はできるが、対話的な調査と月中の予測超過通知に合わない。"
      },
      {
        "id": "d",
        "text": "Budgetsで予測超過を通知し、費用調査はアカウントごとの請求総額を月次で手集計する",
        "explanation": "予測通知は満たすが、サービス別増加原因を対話的に調べる分析画面がない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "分析と予算監視を分ける。請求データには反映遅延があり、通知だけで即時停止するわけではない。",
    "sources": [
      {
        "title": "Cost Explorerの費用分析",
        "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Budgetsの実績・予測通知と遅延",
        "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Cost and Usage Reportの明細",
        "url": "https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Data ExportsとCUR 2.0",
        "url": "https://docs.aws.amazon.com/cur/latest/userguide/what-is-data-exports.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-054",
    "chapterId": "ch12",
    "domain": 4,
    "conceptIds": [
      "cur",
      "cost-allocation"
    ],
    "prompt": "複数アカウントの費用を部門別に配賦し、社内の配賦表とSQLで結合したい。管理対象タグを有効化し、サービス別・部門別の小計だけでなく、個々の使用明細を保持したS3上のデータから再計算できることが必要である。適切な基盤は。",
    "options": [
      {
        "id": "a",
        "text": "Data ExportsのCUR 2.0等をS3へ出力し、有効化したコスト配分タグやアカウント情報を使って集計する",
        "explanation": "詳細な費用データと独自配賦規則を結合できる。共有費とタグ未設定の扱いも決める。"
      },
      {
        "id": "b",
        "text": "Cost Explorerで部門タグ別の月次小計をCSV出力し、S3へ保存して配賦表とSQL結合する",
        "explanation": "部門小計と社内表のSQL結合はできるが、個々の使用明細から配賦規則を変えて再計算する粒度が残らない。"
      },
      {
        "id": "c",
        "text": "Budgets Reportsで部門別の実績・予算差を配信し、帳票をS3へ保存してSQLで集計する",
        "explanation": "部門別の予算実績を保存・比較できるが、予算レポートは使用明細ベースの独自再配賦データではない。"
      },
      {
        "id": "d",
        "text": "請求画面のアカウント別・サービス別月額をS3へ保存し、アカウントと部門の対応表を結合する",
        "explanation": "アカウントを部門へ割り当てる集計はできるが、同一アカウント内の部門タグや個々の使用明細による再計算ができない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "詳細な費用データと独自配賦規則を結合できる。共有費とタグ未設定の扱いも決める。",
    "sources": [
      {
        "title": "Cost Explorerの費用分析",
        "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Budgetsの実績・予測通知と遅延",
        "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Cost and Usage Reportの明細",
        "url": "https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Data ExportsとCUR 2.0",
        "url": "https://docs.aws.amazon.com/cur/latest/userguide/what-is-data-exports.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-055",
    "chapterId": "ch04",
    "domain": 4,
    "conceptIds": [
      "reserved-instances",
      "savings-plans"
    ],
    "prompt": "安定した計算利用を1年間コミットできるが、今後EC2のファミリーやリージョンを変え、一部をFargate・Lambdaへ移す予定がある。固定AZの容量確保は別途扱う。柔軟な割引対象として第一候補は。",
    "options": [
      {
        "id": "a",
        "text": "Compute Savings Plansを安定利用の範囲で検討し、移行後も対象利用へ割引を適用する",
        "explanation": "対象のEC2・Fargate・Lambdaをまたぐ柔軟性があり、使い切れるコミット額を選ぶ。"
      },
      {
        "id": "b",
        "text": "現在のEC2属性に合う1年のStandard RIを、今の安定利用量に合わせて購入する",
        "explanation": "現在のEC2には割引を適用できるが、リージョン・属性変更やFargate/Lambda移行後に対象が残るとは限らない。"
      },
      {
        "id": "c",
        "text": "現在のリージョンとファミリーでEC2 Instance Savings Plansを1年契約する",
        "explanation": "そのリージョン・ファミリー内のEC2利用には柔軟性があるが、今回のリージョン変更や他サービス移行を覆わない。"
      },
      {
        "id": "d",
        "text": "指定AZへCapacity Reservationを作成し、オンデマンド使用料で運用する",
        "explanation": "起動容量は確保できるが、これは別途扱う要件であり、柔軟な対象利用への期間コミット割引を選んだことにならない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "対象のEC2・Fargate・Lambdaをまたぐ柔軟性があり、使い切れるコミット額を選ぶ。",
    "sources": [
      {
        "title": "AWS公式: ec2",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: store",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: capacity",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-05"
      },
      {
        "title": "RIの属性・期間・支払い",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html",
        "checked": "2026-10-08"
      },
      {
        "title": "RIのリージョン・AZスコープ",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/reserved-instances-scope.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Savings Plansの種類と対象",
        "url": "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-056",
    "chapterId": "ch04",
    "domain": 4,
    "conceptIds": [
      "ec2-stop",
      "ec2-hibernation"
    ],
    "prompt": "平日だけ使う対応EC2で、翌朝にプロセスのRAM状態を復元したい。休止条件は満たし暗号化EBSにも空きがある。未使用のコミット契約はない。RAM状態を保持しながら、夜間の通常の計算利用料を抑える運用は。",
    "options": [
      {
        "id": "a",
        "text": "休止でRAMをEBSへ保存して再開する。停止状態の通常の計算利用料は止まるがEBS等の料金は残る",
        "explanation": "停止と休止の差はRAM状態の保持であり、ディスク等の保存費まで無料になるわけではない。"
      },
      {
        "id": "b",
        "text": "夜間は通常停止し、朝は保持したEBSからOSとアプリを起動する",
        "explanation": "停止中の通常の実行料金は減らせるが、RAM上のプロセス状態は復元されない。"
      },
      {
        "id": "c",
        "text": "夜間もインスタンスを稼働させ、アプリへの新規処理を停止して朝に受付を再開する",
        "explanation": "RAM状態は維持できるが、インスタンス実行料金が継続し、夜間費用を抑える休止案に劣る。"
      },
      {
        "id": "d",
        "text": "夜間にEBSのスナップショットを取得して終了し、朝は新規EC2へ復元して起動する",
        "explanation": "ディスク上のデータを保存して再起動できるが、実行中プロセスのRAMをそのまま復元する方式ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "停止と休止の差はRAM状態の保持であり、ディスク等の保存費まで無料になるわけではない。",
    "sources": [
      {
        "title": "EC2休止の状態保持と課金",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Hibernate.html",
        "checked": "2026-10-08"
      },
      {
        "title": "EC2の状態遷移",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-057",
    "chapterId": "ch06",
    "domain": 4,
    "conceptIds": [
      "rcu",
      "wcu"
    ],
    "prompt": "DynamoDBの容量計画で、8KiB項目の強い整合性GetItemを毎秒60件、1.2KiB項目の非トランザクションPutItemを毎秒40件実行する。GSI・再試行・余裕率を除いた必要最小のRCU/WCUを2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "読取りは120 RCU",
        "explanation": "8KiBは4KiB単位で2、強い整合性なので2×60＝120 RCU。"
      },
      {
        "id": "b",
        "text": "書込みは80 WCU",
        "explanation": "1.2KiBを1KiB単位で切り上げて2、2×40＝80 WCU。"
      },
      {
        "id": "c",
        "text": "読取りを240 RCUに設定する",
        "explanation": "必要な強い読取りは処理できるが、ceil(8/4)×60＝120 RCUの2倍で、余裕率を除く必要最小ではない。"
      },
      {
        "id": "d",
        "text": "書込みを40 WCUに設定する",
        "explanation": "1KiB以下の項目なら毎秒40件分だが、今回は1.2KiBを2単位へ切り上げるため80 WCU必要。"
      },
      {
        "id": "e",
        "text": "書込みを160 WCUに設定する",
        "explanation": "必要な通常書込みは処理できるが、今回は非トランザクションで80 WCUが最小。160は2倍の余剰となる。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "8KiBは4KiB単位で2、強い整合性なので2×60＝120 RCU。 1.2KiBを1KiB単位で切り上げて2、2×40＝80 WCU。",
    "sources": [
      {
        "title": "DynamoDBの読取り・書込み単位",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DynamoDBプロビジョンド容量",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-058",
    "chapterId": "ch05",
    "domain": 4,
    "conceptIds": [
      "standard-ia",
      "storage-cost"
    ],
    "prompt": "短命な小オブジェクトをStandard-IAへ移す案を検討する。仮定として1個40KiB、保存は10日、移行・取得も発生する。即時読取りが必要である。適切な費用比較は。",
    "options": [
      {
        "id": "a",
        "text": "128KBの最小課金サイズと30日の最低保存期間、移行・取得リクエスト費等を含めStandardと比較する",
        "explanation": "実データ量と実保存日数だけを掛けると、IAの最低課金と追加費を見落とす。"
      },
      {
        "id": "b",
        "text": "StandardとStandard-IAの双方を、40KiB・10日分の保存費と実際の取得回数で見積もる",
        "explanation": "データ量・期間・取得回数は比較に入るが、IAの128KB最小課金サイズと30日最低保存期間を反映していない。"
      },
      {
        "id": "c",
        "text": "StandardとDeep Archiveの保存・要求・復元費を比較し、閲覧時に復元要求を出す",
        "explanation": "保存と復元を含む総費用は比較できるが、取得までの復元待ちが即時読取りという条件を満たさない。"
      },
      {
        "id": "d",
        "text": "Standard-IAの128KB・30日分の保存料金を求め、現在のStandardの請求総額と比較する",
        "explanation": "IAの最低課金は反映するが、IA側の取得・要求等を含めず、Standardの総額と比較範囲が揃っていない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "実データ量と実保存日数だけを掛けると、IAの最低課金と追加費を見落とす。",
    "sources": [
      {
        "title": "S3階層のアクセス・最小期間・取得費",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-059",
    "chapterId": "ch06",
    "domain": 4,
    "conceptIds": [
      "database-cost"
    ],
    "prompt": "Auroraの学習用見積りで、同じ性能・可用性を満たすStandardは計算70・保存20・I/O45単位/月、I/O-Optimizedは計算90・保存25・I/O0単位/月である。Standardの小型案は計算50・保存20・I/O45だが応答目標を超過する。分析用Replicaを追加するとどちらも月30単位増え、今回は不要である。目標を満たす最小費用の案は。",
    "options": [
      {
        "id": "a",
        "text": "I/O-Optimizedを採用し、分析用Replicaは追加しない",
        "explanation": "月115単位で性能・可用性を満たす。Standard通常案135より20安く、不要なReplicaの費用も発生しない。"
      },
      {
        "id": "b",
        "text": "Standardの通常サイズを採用し、分析用Replicaは追加しない",
        "explanation": "性能・可用性は満たすが、70＋20＋45＝135単位で、I/O-OptimizedのReplica追加なし案より20高い。"
      },
      {
        "id": "c",
        "text": "Standardを小型化し、分析用Replicaは追加しない",
        "explanation": "月115単位まで下げられるが、明示された応答目標を満たさない。"
      },
      {
        "id": "d",
        "text": "I/O-Optimizedを採用し、分析用Replicaを追加する",
        "explanation": "性能・可用性と分析の分離は実現できるが、不要な追加30を含む145単位で最小費用ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "月115単位で性能・可用性を満たす。Standard通常案135より20安く、不要なReplicaの費用も発生しない。",
    "sources": [
      {
        "title": "アクセスパターンとデータモデルによるDB選択",
        "url": "https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/db-selection.html",
        "checked": "2026-10-08"
      },
      {
        "title": "RDS単一スタンバイの同期複製と読取り不可",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DynamoDB容量方式の課金と負荷特性",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DynamoDBテーブル・GSI・リージョン間整合性",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Aurora StandardとI/O-Optimizedの課金要素",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/User_DBInstanceBilling.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-060",
    "chapterId": "ch03",
    "domain": 4,
    "conceptIds": [
      "vpc-endpoint",
      "network-cost"
    ],
    "prompt": "プライベートEC2のS3転送が大きく、同一リージョンのS3通信がNAT Gatewayを通っている。外部API通信は引き続きNATを使う。到達性を維持してS3部分のNAT処理費を減らすには。",
    "options": [
      {
        "id": "a",
        "text": "対応するルートにS3 Gateway endpointを関連付け、ポリシーを確認する。外部API用NAT経路は残す",
        "explanation": "対象のS3経路をNATから分離できる。エンドポイントポリシーとS3/IAM認可も確認する。"
      },
      {
        "id": "b",
        "text": "S3 Gateway endpointを追加して全NAT Gatewayを削除する",
        "explanation": "同一リージョンS3への私設経路は作れるが、引き続き必要な外部API向けのNAT出口を失う。"
      },
      {
        "id": "c",
        "text": "S3の保存クラスを見直し、S3と外部APIの通信は現在のNAT経路を使う",
        "explanation": "保存費を改善できる可能性はあるが、対象のS3転送がNATを通る処理費は減らない。"
      },
      {
        "id": "d",
        "text": "NAT Gatewayを別AZの1か所へ集約し、S3と外部APIの通信を集約先へ送る",
        "explanation": "NATの固定費を減らせる場合はあるが、S3分のNAT処理費は残り、AZ間転送も生じ得る。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "対象のS3経路をNATから分離できる。エンドポイントポリシーとS3/IAM認可も確認する。",
    "sources": [
      {
        "title": "AWS公式: endpoint",
        "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: privatelink",
        "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: peering",
        "url": "https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: tgw",
        "url": "https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: vpn",
        "url": "https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: direct",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html",
        "checked": "2026-10-05"
      },
      {
        "title": "NATの時間・処理量・AZ間転送の費用要因",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html",
        "checked": "2026-10-08"
      },
      {
        "title": "ゾーン型NATのAZ障害と同一AZ経路",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-061",
    "chapterId": "ch04",
    "domain": 4,
    "conceptIds": [
      "auto-scaling",
      "instance-family"
    ],
    "prompt": "Webサービスは平日の昼にCPU負荷が高く、夜間はほぼ無通信である。メモリは常時余裕があり、2 AZの最低台数と応答目標を維持したい。適切な費用改善は。",
    "options": [
      {
        "id": "a",
        "text": "CPU特性に合う候補を負荷試験し、AZごとの必要最小容量を保ちながら需要に合わせて台数を増減する",
        "explanation": "インスタンス選定とスケーリングを組み合わせ、安さより先に性能・可用性条件を満たす。"
      },
      {
        "id": "b",
        "text": "昼のピークに合わせたCPU最適化インスタンスを2 AZで常時同じ台数だけ動かす",
        "explanation": "性能とAZ分散の候補にはなるが、夜間の未使用容量を減らす需要追随を設計していない。"
      },
      {
        "id": "c",
        "text": "メモリ最適化の大きなインスタンスを2 AZへ配置し、台数は昼のピークに合わせて固定する",
        "explanation": "AZ分散とメモリ余裕は維持できるが、余っているメモリと夜間容量を増やすため、CPU特性・需要追随を使う費用改善に劣る。"
      },
      {
        "id": "d",
        "text": "夜間は全台を1 AZの1台へ集約し、朝の予定時刻にだけ2 AZへ戻す",
        "explanation": "夜間も維持すべき2 AZの最低容量を満たさない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "インスタンス選定とスケーリングを組み合わせ、安さより先に性能・可用性条件を満たす。",
    "sources": [
      {
        "title": "AWS公式: asg",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-target-tracking.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: scaling",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scheduled-scaling.html",
        "checked": "2026-10-05"
      },
      {
        "title": "AWS公式: health",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/health-checks-overview.html",
        "checked": "2026-10-05"
      },
      {
        "title": "資源特性によるEC2ファミリー選択",
        "url": "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html",
        "checked": "2026-10-08"
      },
      {
        "title": "容量予約と割引方式の違い",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "クラスタ・パーティション・スプレッド配置",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-062",
    "chapterId": "ch07",
    "domain": 4,
    "conceptIds": [
      "cloudfront",
      "cache-key"
    ],
    "prompt": "世界向けの公開マニュアルはURLごとに同じ内容で、1日以内の更新反映を許容する。S3オリジンへの反復取得を減らし、費用は配信量とリクエストを含め評価したい。適切な施策を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "CloudFrontで公開コンテンツをキャッシュし、更新要件内のTTLまたは版付きURLを設計する",
        "explanation": "同じコンテンツの反復要求をエッジで処理し、鮮度の上限も守る。"
      },
      {
        "id": "b",
        "text": "内容に無関係な追跡パラメーターをキャッシュキーから除き、ヒット率と総費用を計測する",
        "explanation": "不要なキー分割を避ける。ただし配信費を含め総額で効果を検証する。"
      },
      {
        "id": "c",
        "text": "利用者ごとの追跡パラメーターをキャッシュキーに含め、TTLを12時間にする",
        "explanation": "1日以内の更新と同じ利用者の再訪には対応できるが、同一文書を利用者間で共有しにくく、不要なキャッシュ分割が残る。"
      },
      {
        "id": "d",
        "text": "URLを据え置いて上書き更新し、TTLを7日に設定する",
        "explanation": "反復取得をキャッシュできるが、旧版が1日を超えて残る可能性があり更新反映要件に合わない。"
      },
      {
        "id": "e",
        "text": "TTLを0にして各要求をオリジンへ再検証し、変更されていなければ保存済み本文を返す",
        "explanation": "鮮度と本文転送量は改善できるが、オリジンへの反復要求自体を減らす目的には劣る。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "同じコンテンツの反復要求をエッジで処理し、鮮度の上限も守る。 不要なキー分割を避ける。ただし配信費を含め総額で効果を検証する。",
    "sources": [
      {
        "title": "CloudFront",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html",
        "checked": "2026-10-05"
      },
      {
        "title": "Global Accelerator",
        "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html",
        "checked": "2026-10-05"
      },
      {
        "title": "Direct Connectの既定は通信暗号化なし",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Direct Connectの冗長経路設計",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/resiliency_toolkit.html",
        "checked": "2026-10-08"
      },
      {
        "title": "CloudFront TTLとオリジン負荷",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-063",
    "chapterId": "ch11",
    "domain": 4,
    "conceptIds": [
      "backup",
      "restore-test"
    ],
    "prompt": "DBのバックアップ費を減らしたい。規程は日次復元点を35日、月末復元点を7年保持し、旧月末データは24時間以内の復元でよい。適切な見直しは。",
    "options": [
      {
        "id": "a",
        "text": "必要な日次・月次世代を区別し、対応する保存階層・保持設定と24時間以内の復元を検証する",
        "explanation": "全世代を同じ高頻度階層で保持する必要はないが、保持期間と復元可能時間を先に満たす。"
      },
      {
        "id": "b",
        "text": "日次復元点を35日、月末復元点を1年保持し、全世代を即時復元できる階層に置く",
        "explanation": "日次保持と復元速度は満たすが、月末復元点を7年保持する規程に不足する。"
      },
      {
        "id": "c",
        "text": "日次復元点を35日、月末復元点を7年保持し、月末分を復元最大48時間の低費用階層へ移す",
        "explanation": "要求された期間は保持できるが、月末データの復元24時間以内という条件を超える。"
      },
      {
        "id": "d",
        "text": "日次復元点を7年分すべて即時復元できる階層に保持する",
        "explanation": "保持期間と復元条件は満たすが、古い日次分も高い階層で残すため、必要な月末世代に絞る適合案より費用を減らしにくい。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "全世代を同じ高頻度階層で保持する必要はないが、保持期間と復元可能時間を先に満たす。",
    "sources": [
      {
        "title": "災害復旧戦略",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-05"
      },
      {
        "title": "S3 File GatewayのNFS/SMBとキャッシュ",
        "url": "https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html",
        "checked": "2026-10-08"
      },
      {
        "title": "容量予約とクォータの区別",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DataSyncの移行・継続転送",
        "url": "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Transfer Familyのファイル転送プロトコル",
        "url": "https://docs.aws.amazon.com/transfer/latest/userguide/what-is-aws-transfer-family.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-064",
    "chapterId": "ch06",
    "domain": 4,
    "conceptIds": [
      "dynamodb-on-demand",
      "dynamodb-capacity"
    ],
    "prompt": "新規サービスのDynamoDB利用は日による変動が大きく、まだ安定利用量を予測できない。初期は余剰の固定容量・長期コミットと容量管理を抑え、実績が固まった後に購入・容量方式を見直す方針である。適切な進め方は。",
    "options": [
      {
        "id": "a",
        "text": "オンデマンドを候補にして利用量・スロットリング・キー偏り・費用を監視し、安定後にプロビジョンド等と比較する",
        "explanation": "予測困難な初期運用を扱いつつ、上限やホットキーがなくなるとは考えず、実績で再評価する。"
      },
      {
        "id": "b",
        "text": "プロビジョンドを使い、初月の最大想定容量を常時確保する",
        "explanation": "ピークへの備えは作れるが、予測不能な段階の最大想定に固定すると未使用容量への費用が増え、実績を見て方式を選ぶ方針に劣る。"
      },
      {
        "id": "c",
        "text": "プロビジョンドを小さく開始し、担当者が毎時の利用量を見て手動で容量を変更する",
        "explanation": "使用量に合わせた見直しはできるが、初期の容量管理を抑える方針に反し、毎時の間の急増対応も遅れ得る。"
      },
      {
        "id": "d",
        "text": "安定負荷向けに1年分の予約容量を購入し、将来のピーク予測へ合わせて追加する",
        "explanation": "適合する安定利用なら割引を得られるが、現時点では利用量が不明で、実績が固まる前のコミットとなる。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "予測困難な初期運用を扱いつつ、上限やホットキーがなくなるとは考えず、実績で再評価する。",
    "sources": [
      {
        "title": "アクセスパターンとデータモデルによるDB選択",
        "url": "https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/db-selection.html",
        "checked": "2026-10-08"
      },
      {
        "title": "RDS単一スタンバイの同期複製と読取り不可",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DynamoDB容量方式の課金と負荷特性",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DynamoDBテーブル・GSI・リージョン間整合性",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Aurora StandardとI/O-Optimizedの課金要素",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/User_DBInstanceBilling.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DynamoDBの読取り・書込み単位",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DynamoDBプロビジョンド容量",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  },
  {
    "id": "assessment-065",
    "chapterId": "ch03",
    "domain": 4,
    "conceptIds": [
      "network-cost",
      "nat-gateway"
    ],
    "prompt": "2 AZのプライベートワーカーが外部APIへ通信する。学習用の各月額は必要な費用をすべて含み、NATの能力は十分、障害時の経路自動変更は行わない。AZ-A停止中もAZ-Bの通信を継続できる、最も低費用の案を選べ。",
    "options": [
      {
        "id": "a",
        "text": "各AZにNATを1台ずつ置き、各ワーカーは同じAZのNATへ送る。月90単位",
        "explanation": "残ったAZ-BはAZ-Bの出口を使用できる。各AZにNATを2台置く適合案より安く、この条件下で最小費用。"
      },
      {
        "id": "b",
        "text": "AZ-AにNATを1台置き、両AZのワーカーを集約する。月60単位",
        "explanation": "通常時は両方から通信できて安いが、AZ-A停止でAZ-Bの出口も失う。"
      },
      {
        "id": "c",
        "text": "各AZにNATを置き、両AZのワーカーの既定経路はAZ-Aへ向ける。月85単位",
        "explanation": "代替NAT自体はあるが、経路自動変更なしではAZ-A停止後もAZ-Bが失われた出口へ向かう。"
      },
      {
        "id": "d",
        "text": "各AZにNATを2台ずつ置き、各ワーカーは同じAZのNATへ送る。月120単位",
        "explanation": "AZ-A停止時もAZ-Bの出口は残るが、能力は十分という前提で各AZにNATを1台置く案より30高く最小費用ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "残ったAZ-BはAZ-Bの出口を使用できる。各AZにNATを2台置く適合案より安く、この条件下で最小費用。",
    "sources": [
      {
        "title": "NATの時間・処理量・AZ間転送の費用要因",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html",
        "checked": "2026-10-08"
      },
      {
        "title": "ゾーン型NATのAZ障害と同一AZ経路",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Gateway endpointの対象・ルート・追加料金なし",
        "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "assessment1"
  }
];
