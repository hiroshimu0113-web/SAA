import type {Question} from "../../types";
// Independent scenarios; no counterpart with shared options in the transfer sets.
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
        "text": "AのロールARNを秘密として扱うだけで、信頼ポリシーは保守会社全体のままにする",
        "explanation": "ARNの秘匿だけでは、別顧客が指定した委任要求をポリシーで区別できない。"
      },
      {
        "id": "c",
        "text": "Aの監査ロールにS3のGetObjectだけを許可し、信頼条件は変更しない",
        "explanation": "最小権限は被害範囲を絞るが、委任要求の顧客取り違えという認可条件を解決しない。"
      },
      {
        "id": "d",
        "text": "Aのアクセスキーを保守会社の全担当へ共有し、90日ごとに更新する",
        "explanation": "顧客を区別した一時権限委任という要件から外れ、長期キー共有を導入する。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。信頼する主体の制約と顧客別External IDを組み合わせ、他顧客の委任要求との取り違えを防ぐ。",
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
        "text": "OUに作成を許可するSCPだけを設定し、それを社員への利用権限として扱う",
        "explanation": "SCPは利用権限を付与しない。禁止対象を除外する条件も表現していない。"
      },
      {
        "id": "c",
        "text": "一人の開発者にアクセス許可の境界を設定し、他の管理者も同じ制限を受けるとする",
        "explanation": "境界の対象はその主体であり、OU全体の管理者へ共通制限を適用していない。"
      },
      {
        "id": "d",
        "text": "Cost Explorerでリージョン別費用を確認し、作成後に担当者へ連絡する",
        "explanation": "事後の費用確認であり、作成要求を拒否する統制ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。SCPはメンバーの許可上限を制約し、IAMのAllowだけでは明示的拒否を回避できない。",
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
        "text": "SAML認証だけを有効にし、許可セット割当とユーザー同期は不要とする",
        "explanation": "認証成功だけでは、利用可能アカウントや部署別の権限が割り当てられない。"
      },
      {
        "id": "c",
        "text": "各アカウントの管理者ユーザーを共有し、IdPはメールアドレス一覧にだけ使う",
        "explanation": "個別の権限分離と退職者の統制が難しく、共有された長期資格情報に依存する。"
      },
      {
        "id": "d",
        "text": "Cognitoユーザープールだけで社員の全AWSアカウント管理権限を配る",
        "explanation": "アプリ会員認証とAWSアカウントへの社員用権限割当を混同している。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。認証、プロビジョニング、権限割当をそれぞれ設定し、複数アカウントへの一時アクセスをまとめて管理できる。",
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
        "text": "保存側の全オブジェクトをパブリックにし、分析ロール側の許可を省く",
        "explanation": "特定ロールとreports/に限定した読取りという範囲を破る。"
      },
      {
        "id": "d",
        "text": "分析ロールにS3一覧表示だけを許可する",
        "explanation": "一覧表示とオブジェクト本体のGetObjectは異なる操作。"
      },
      {
        "id": "e",
        "text": "保存側ロールの信頼ポリシーだけを更新する",
        "explanation": "保存側ロールへAssumeRoleしないという構成では、バケットへの直接許可の代わりにならない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。主体側で要求操作とリソース範囲を許可する必要がある。 リソース所有側も当該外部主体を許可し、直接のクロスアカウントアクセスを成立させる。",
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
        "text": "受信443の同じAllowルールを高い番号でもう1つ追加する",
        "explanation": "受信の重複許可では送信側のDenyを解消しない。"
      },
      {
        "id": "c",
        "text": "SGの送信ルールだけを増やし、NACLの送信は全拒否にする",
        "explanation": "NACLの明示的な送信制限はSGの許可で回避できない。"
      },
      {
        "id": "d",
        "text": "NACLで受信80だけを追加し、HTTPSの応答も通るとする",
        "explanation": "別ポートの受信許可であり、443接続の戻り方向の問題を解決しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。NACLはステートレスなので、受信許可だけでは応答方向が許可されない。",
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
    "prompt": "インターネット出口のないVPC内のECSタスクがSecrets Managerを呼ぶ。タスクロールには対象Secretの読取り許可があり、既定のサービスDNS名を使い続けたい。必要なネットワーク構成は。",
    "options": [
      {
        "id": "a",
        "text": "Secrets ManagerのInterface endpointを作り、プライベートDNSとタスクからの443を許可するSGを設定する",
        "explanation": "IAM許可に加えてプライベートな到達経路とDNS・通信許可を整える。"
      },
      {
        "id": "b",
        "text": "S3 Gateway endpointだけを作り、Secrets ManagerのDNSはそのままにする",
        "explanation": "S3用の経路はSecrets Manager APIへのInterface endpointの代替ではない。"
      },
      {
        "id": "c",
        "text": "IGWへの経路だけをタスクのプライベートサブネットへ追加し、IPは変更しない",
        "explanation": "インターネット出口を設けない要件と異なり、私設IPのタスクはその変更だけで外部へ出られない。"
      },
      {
        "id": "d",
        "text": "タスクロールのSecrets Manager権限を管理者権限へ広げる",
        "explanation": "権限は既に満たしており、経路がない問題を解決しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。IAM許可に加えてプライベートな到達経路とDNS・通信許可を整える。",
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
        "text": "同じ表示名の新規キーを復旧先に作り、その新規キーだけを許可する",
        "explanation": "名前が同じでも既存バックアップを暗号化したキーと同じではなく、復号許可を代替しない。"
      },
      {
        "id": "c",
        "text": "S3のListBucket権限だけを全バケットへ広げる",
        "explanation": "S3の一覧取得範囲を増やしてもKMS復号の拒否は解消しない。"
      },
      {
        "id": "d",
        "text": "元キーの自動ローテーションだけを有効にして再試行する",
        "explanation": "ローテーションは権限不足を修正しない。必要なキー利用権限を確認する。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。S3読取りだけでなく、暗号文に対応するKMSキーをその主体が利用できる必要がある。",
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
    "prompt": "Fargate上のアプリがDBパスワードをイメージへ焼き込んでいる。秘密の定期変更とアプリへの取得経路を整えたい。ホストを管理せず、パスワード更新後にアプリが新しい値を使える設計は。",
    "options": [
      {
        "id": "a",
        "text": "Secrets Managerで対応するローテーションを構成し、タスクロールで限定取得し、アプリの再取得や再起動方針を決める",
        "explanation": "保管場所の変更だけでなく、実DBと秘密の更新、アプリが新値を利用するタイミングまで設計する。"
      },
      {
        "id": "b",
        "text": "ECRのイメージタグだけを毎月変更し、内部のパスワードは維持する",
        "explanation": "タグ変更はDBパスワードの変更や秘密取得方式の改善にならない。"
      },
      {
        "id": "c",
        "text": "Secrets Managerへ初回値を保存し、ローテーションもアプリの更新手順も省略する",
        "explanation": "保管は改善するが、要求された定期変更と新値利用を成立させていない。"
      },
      {
        "id": "d",
        "text": "DBの証明書だけをACMで更新し、イメージ内のパスワードを使い続ける",
        "explanation": "通信証明書の更新と認証用パスワードの更新は別である。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。保管場所の変更だけでなく、実DBと秘密の更新、アプリが新値を利用するタイミングまで設計する。",
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
        "text": "AもBもACMに登録した時点で外部CA側の更新が不要になるとする",
        "explanation": "インポートした証明書はACMの管理更新の対象として扱えない。"
      },
      {
        "id": "c",
        "text": "Aの検証用CNAMEを発行後に削除し、Bだけを監視する",
        "explanation": "AのDNS検証による更新条件を壊す可能性がある。"
      },
      {
        "id": "d",
        "text": "AとBのDNS名だけを新しい名前へ変え、同じ証明書を期限後も使う",
        "explanation": "名前の変更では有効期限が延びず、TLS証明書の更新を実施していない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。ACM発行の管理更新と、インポート証明書の更新責任を区別する。",
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
    "prompt": "監査担当は「誰がSGを開放したか」と「開放状態がいつから続いたか」を調べたい。API履歴の記録と構成変更の記録はあらかじめ有効にしている。適切な調査先の組合せは。",
    "options": [
      {
        "id": "a",
        "text": "CloudTrailで変更主体と操作を調べ、ConfigでSGの構成履歴を確認する",
        "explanation": "操作の証跡と、資源の設定がどう変化したかを別の記録から突き合わせる。"
      },
      {
        "id": "b",
        "text": "CloudWatchのCPUグラフだけで変更主体とSGルールの履歴を特定する",
        "explanation": "CPUの時系列だけではAPI主体やSGの具体的な変更内容を得られない。"
      },
      {
        "id": "c",
        "text": "CloudTrailで現在の全SGルールを常に完全復元できるとし、Configは見ない",
        "explanation": "API操作の記録と構成履歴の役割を分けず、要求された状態確認の記録を利用していない。"
      },
      {
        "id": "d",
        "text": "Configの非準拠通知だけで変更主体を断定し、操作履歴は見ない",
        "explanation": "状態評価だけでは、誰のどのAPI操作だったかを十分に裏付けない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。操作の証跡と、資源の設定がどう変化したかを別の記録から突き合わせる。",
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
        "text": "NACLで443を全て拒否し、ALBの正常判定だけを維持する",
        "explanation": "悪意ある内容だけでなく正当なAPI利用も停止してしまう。"
      },
      {
        "id": "c",
        "text": "SGで443を許可したまま、SQL文字列に応じた拒否をSGだけで表現する",
        "explanation": "SGはHTTP内容をSQL攻撃として検査する機能を持たない。"
      },
      {
        "id": "d",
        "text": "ALBのターゲットを増やすだけで、攻撃内容の検査を省く",
        "explanation": "処理余力は増やせても要求された悪意あるHTTP内容の制御にはならない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。HTTP内容の検査と要求頻度の制御を入口に適用できる。誤検知も確認する。",
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
    "prompt": "監査ファイルは保存後7年間、管理者の操作でも保持期間を短くして消せないことが要件である。上書き前の版も残したい。新規バケットの設計として必要な施策を2つ選べ。（2つ選択）",
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
        "text": "Governanceモードを使い、全管理者に保持回避の権限を付ける",
        "explanation": "管理者も回避できないという本問の必須条件に適さない。"
      },
      {
        "id": "d",
        "text": "Versioningだけを有効にし、旧版を自由に永久削除できる権限を残す",
        "explanation": "履歴は作れるが、7年間消せないという保持制約を付与していない。"
      },
      {
        "id": "e",
        "text": "別リージョン複製だけで保持期間の短縮も禁止されたとする",
        "explanation": "複製はコピーの作成であり、保持モードと期間の設定を代替しない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。バージョンと保持期限を組み合わせ、保持期間中の削除・短縮を制限する。 保護単位はバージョンであり、保存費や移行・削除の時期も保持条件へ合わせる。",
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
        "text": "タグが一致するAllowだけを追加し、タグ変更は全員自由のままにする",
        "explanation": "開発者が認可用タグを変更して条件を満たせてしまう。"
      },
      {
        "id": "c",
        "text": "リソース名の先頭へProject名を付けるだけで認可用タグの制約を削除する",
        "explanation": "名前の付け方だけでは、必要な認可ルールや変更権限を設定したことにならない。"
      },
      {
        "id": "d",
        "text": "対象サービスへの全操作をAllowし、タグ不一致は請求時に調べる",
        "explanation": "事後の費用確認では他プロジェクトの更新を認可時に防げない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。一致条件だけでなく、その条件値を誰が変更できるかも統制する。",
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
        "text": "ロール作成後に境界を付ける運用メモだけを配り、削除権限は残す",
        "explanation": "強制力がなく、作成直後や境界削除後に上限を回避できる。"
      },
      {
        "id": "c",
        "text": "境界を付けたので、ロール本体の許可ポリシーは不要とする",
        "explanation": "境界は権限付与ではなく上限であり、実際のAllowは別に必要。"
      },
      {
        "id": "d",
        "text": "請求アラームだけを設定し、管理権限を自由に委任する",
        "explanation": "費用監視は権限昇格を認可時に制限する仕組みではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。上限を付けるだけでなく、その上限を委任先自身が解除できないようにする。",
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
        "text": "ユーザープールのログイン用パスワードをS3のアクセスキーとして使う",
        "explanation": "アプリのログイン情報はS3 APIへ署名するAWS認証情報ではない。"
      },
      {
        "id": "c",
        "text": "全会員が同じIAMユーザーの長期キーを端末に保存する",
        "explanation": "長期キーを端末へ埋め込まない要件と会員別の範囲限定を満たさない。"
      },
      {
        "id": "d",
        "text": "S3をパブリック書込みにし、ユーザープールのログインだけをアプリ画面で確認する",
        "explanation": "S3へ直接アクセスする経路を画面のログイン確認で保護できない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。会員認証とAWS資源への一時認可を分け、対象プレフィックス等を権限で制約する。",
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
        "text": "専用線であることだけを根拠に、アプリの平文通信を維持する",
        "explanation": "専用であることと暗号化されていることは別であり、要件を裏付けない。"
      },
      {
        "id": "c",
        "text": "接続の帯域を倍増し、暗号化の設定を省略する",
        "explanation": "帯域は処理量の条件であり、通信内容の暗号化を実現しない。"
      },
      {
        "id": "d",
        "text": "対応区間のMACsecだけで、工場アプリからAWSアプリまで全区間を保護したと扱う",
        "explanation": "MACsecの適用区間を超える端点間の保護まで自動的に保証するものではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。専用接続そのものを端点間暗号化と同一視せず、指定された範囲を保護する。",
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
    "prompt": "S3へのGateway endpointを作りネットワーク経路は通る。監査では特定バケットだけを利用させたいが、対象ロールにS3権限はまだない。エンドポイントポリシーで対象をAllowした後の正しい理解は。",
    "options": [
      {
        "id": "a",
        "text": "エンドポイント側の制約に加えてIAM等で対象バケット操作を許可する必要がある",
        "explanation": "経路のポリシーだけで主体の利用権限が付与されるわけではない。"
      },
      {
        "id": "b",
        "text": "エンドポイントポリシーのAllowだけでロールのS3利用権限も付与されたとする",
        "explanation": "ネットワーク経路を制約するポリシーと主体への権限付与を混同している。"
      },
      {
        "id": "c",
        "text": "IAM権限がないのでNATへ戻せば同じロールで読めるとする",
        "explanation": "経路を変えても主体の権限不足は解消しない。"
      },
      {
        "id": "d",
        "text": "バケットを公開して、エンドポイント経由以外からも同じデータを読ませる",
        "explanation": "特定主体の利用許可を整える課題を公開で回避し、アクセス範囲を広げている。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。経路のポリシーだけで主体の利用権限が付与されるわけではない。",
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
        "text": "キーのエイリアスを新しいキーへ向ければ、既存バックアップも自動で移行済みとする",
        "explanation": "参照名の変更だけでは既存暗号文を新しいキーへ再暗号化しない。"
      },
      {
        "id": "c",
        "text": "削除待機期間に入れれば、10年間いつでも元のキーを復元できるとする",
        "explanation": "削除待機の取消可能期間と長期の復旧保証は別である。"
      },
      {
        "id": "d",
        "text": "S3に複製が2つあるため、元キーは直ちに不要とする",
        "explanation": "同じキーに依存するコピーを増やしても、復号の依存は残る。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。バックアップ本体があっても必要なキーを失うと復号できないため、保持と鍵の寿命を整合させる。",
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
    "prompt": "注文APIは3 AZに均等配置し、各AZの処理能力は毎秒600件である。ピークは毎秒1,000件、障害時の追加起動は保証されない。単一AZ停止後もピークを処理するという条件について、正しい評価は。",
    "options": [
      {
        "id": "a",
        "text": "残る2 AZの合計は毎秒1,200件なので容量条件を満たす。入口と状態の冗長性は別途確認する",
        "explanation": "600×2＝1,200件で要求以上。ただし容量の計算だけではDBや入口の単一障害点までは判定できない。"
      },
      {
        "id": "b",
        "text": "通常時1,800件なので、2 AZ同時停止でも毎秒1,000件を維持できる",
        "explanation": "2 AZ停止時は600件しか残らず、通常時の合計能力を障害時に流用している。"
      },
      {
        "id": "c",
        "text": "3 AZへ分散した時点で、各AZの能力に関係なくピーク対応が保証される",
        "explanation": "AZ分散は配置の冗長性であり、障害後の処理容量の計算を省略できない。"
      },
      {
        "id": "d",
        "text": "不足分は障害後の新規起動で必ず補えるため、事前容量を計算しない",
        "explanation": "問題は追加起動を保証しない条件であり、残存容量で評価する必要がある。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。600×2＝1,200件で要求以上。ただし容量の計算だけではDBや入口の単一障害点までは判定できない。",
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
    "prompt": "チケット販売サイトは2 AZのALB配下で自動増減するが、カートを各EC2のローカルメモリに置いている。通常時の粘着セッションは有効でも、インスタンス障害でカートが消える。障害後の別ノードで継続できる構成は。",
    "options": [
      {
        "id": "a",
        "text": "カートを要件に合う共有の永続ストアへ移し、アプリノードを交換可能にする",
        "explanation": "振分け先が変わっても状態を読み直せるようにし、ノード障害と利用者の状態を切り離す。"
      },
      {
        "id": "b",
        "text": "ALBの粘着時間を延ばし、メモリ上のカートだけを使い続ける",
        "explanation": "停止したノードのメモリは粘着時間を延ばしても別ノードから復元できない。"
      },
      {
        "id": "c",
        "text": "各EC2を大きくしてカートを格納できる件数を増やす",
        "explanation": "容量は増えるが、ノード喪失時の状態消失という障害範囲は変わらない。"
      },
      {
        "id": "d",
        "text": "ヘルスチェック間隔を短くし、共有ストアを使わず再振分けする",
        "explanation": "故障検知は速まるが、振分け先にカートの状態がない問題は残る。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。振分け先が変わっても状態を読み直せるようにし、ノード障害と利用者の状態を切り離す。",
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
        "text": "受信直後に削除し、その後のDB更新に失敗しても再試行しない",
        "explanation": "重複を減らしても、未処理要求を失うため復旧要件を満たさない。"
      },
      {
        "id": "c",
        "text": "可視性タイムアウトを長くするだけで、二重計上が絶対に起きないとする",
        "explanation": "重複受信の可能性や削除前停止を排除しないので業務処理の冪等性が必要。"
      },
      {
        "id": "d",
        "text": "ワーカーの台数を1台に固定し、障害後も同じメッセージを通常どおり加算する",
        "explanation": "同時実行を減らしても再配信後の二重更新は防げない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。少なくとも1回の配信を前提に、受信回数と業務上の計上回数を切り離す。",
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
    "prompt": "LambdaがSQS Standardの10件をまとめて処理する。1件だけ形式不正で、成功した9件まで毎回再処理される。障害メッセージを調査用に残し、正常処理の反復を減らす施策を2つ選べ。（2つ選択）",
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
        "text": "形式不正を含む全件を成功扱いで返し、ログも保存しない",
        "explanation": "再試行は止まるが、不正な要求を調査・復旧できる形で保持していない。"
      },
      {
        "id": "d",
        "text": "全件を失敗として返し続け、DLQへの移動も無効にする",
        "explanation": "正常な9件の反復処理と、不正な1件の滞留を継続させる。"
      },
      {
        "id": "e",
        "text": "Lambdaのメモリだけを増やし、不正形式の検証は変えない",
        "explanation": "性能変更だけではデータ形式のエラーとバッチ単位の再試行を解決しない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。バッチ全体の失敗として扱わず、成功済みのメッセージの不要な再試行を減らす。 繰り返し失敗する項目を隔離して調査可能にし、修正後の復旧まで設計する。",
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
    "prompt": "注文イベントを請求・発送・分析の3サービスがそれぞれ全件処理する。分析は夜間停止するが、他のサービスは継続し、分析は翌朝追い付く必要がある。適切な構成は。",
    "options": [
      {
        "id": "a",
        "text": "SNSからサービスごとのSQSへ配信し、各サービスが自分のキューを消費する",
        "explanation": "全サービスへの複製と、個別の蓄積・再試行を両立できる。"
      },
      {
        "id": "b",
        "text": "単一SQSを3サービスが競合して消費し、各サービスが全件受信するとする",
        "explanation": "競合コンシューマーでは通常1件をいずれかが処理するため、各サービスへの全件複製にならない。"
      },
      {
        "id": "c",
        "text": "注文APIから3サービスへ同期呼出しし、夜間停止中の分析にも即時成功を要求する",
        "explanation": "停止中の利用先と注文処理が密結合になり、停止中の蓄積要件を満たさない。"
      },
      {
        "id": "d",
        "text": "SNSから分析のHTTPエンドポイントだけへ送り、分析停止中の蓄積設計を省く",
        "explanation": "他サービスへの複製と、長い計画停止を吸収するサービス別キューを構成していない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。全サービスへの複製と、個別の蓄積・再試行を両立できる。",
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
    "prompt": "店舗システムはRPO15分・RTO60分が要件である。現状は毎時バックアップ、復元25分、設定再現20分、業務確認10分で、工程は順次実行する。検証値どおりに復旧できるとした場合の評価は。",
    "options": [
      {
        "id": "a",
        "text": "復旧55分はRTO内だが、最大約60分のデータ損失はRPOを満たさず、保存・複製頻度の改善が必要",
        "explanation": "RTOは25＋20＋10＝55分、RPOは最後の保護時点からの損失で別々に判定する。"
      },
      {
        "id": "b",
        "text": "復元25分が60分以内なので、RPOとRTOの両方を満たす",
        "explanation": "後続工程を除いており、データ損失間隔も評価していない。"
      },
      {
        "id": "c",
        "text": "毎時バックアップがあるため、障害時刻によらずRPO15分を満たす",
        "explanation": "バックアップ直前の障害では最後の保護時点から約60分空く可能性がある。"
      },
      {
        "id": "d",
        "text": "設定再現を10分短縮すれば、バックアップ頻度を変えずRPOも15分になる",
        "explanation": "復旧作業時間の短縮は、既に失われた更新の時間幅を変えない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。RTOは25＋20＋10＝55分、RPOは最後の保護時点からの損失で別々に判定する。",
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
        "text": "バックアップ一覧の件数だけ確認し、復元ロールでの操作は省く",
        "explanation": "ファイルの存在だけでは復号・復元・依存先接続を検証できない。"
      },
      {
        "id": "c",
        "text": "元アカウントの管理者でバックアップ作成に成功したことを復元証明とする",
        "explanation": "隔離先の主体や権限・経路は異なるため、本番と同じ復元条件を検証していない。"
      },
      {
        "id": "d",
        "text": "保持日数を長くするだけで、復元訓練の代わりにする",
        "explanation": "世代数は増えても、鍵や設定漏れによる復元失敗は発見できない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。オブジェクトの存在だけでなく、別アカウントの権限と業務再開まで検証できる。",
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
        "text": "Versioningだけを設定し、同一リージョンの版が常に他リージョンから利用できるとする",
        "explanation": "版管理は行うが、別リージョンへの配置と参照先の復旧を設計していない。"
      },
      {
        "id": "c",
        "text": "レプリケーションだけをバックアップと同一視し、旧版の保持・復旧確認を省く",
        "explanation": "複製の存在だけでは誤操作から必要な版へ戻す保持方針を説明できない。"
      },
      {
        "id": "d",
        "text": "全利用者に同じキーへの上書きを許可し、最新の1個だけ保持する",
        "explanation": "直前版へ戻すための世代が残らない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。論理的な上書きとリージョン障害を別々の仕組みで扱い、複製遅延も前提に含める。",
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
        "text": "S3 Gateway endpointだけを追加し、外部ライセンスAPIの経路も代替する",
        "explanation": "S3のサービス経路は任意の外部APIへのインターネット出口にはならない。"
      },
      {
        "id": "d",
        "text": "プライベートIPだけのワーカーをIGWへ直接ルーティングする",
        "explanation": "IPv4のインターネット通信に必要なアドレス変換等がなく、出口要件を満たさない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。出口のAZ依存を分離し、平常時のAZをまたぐNAT経路も避けられる。",
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
        "text": "Route 53の検出が成功した瞬間に、既存TCP接続も全て新リージョンへ移るとする",
        "explanation": "DNSの名前解決と、確立済みの接続やクライアントキャッシュを混同している。"
      },
      {
        "id": "c",
        "text": "セカンダリのCPUだけを増やせば、旧アドレスを使うクライアントも即座に移る",
        "explanation": "接続先選択の問題をセカンダリの処理容量だけでは解決できない。"
      },
      {
        "id": "d",
        "text": "TTLを長くして、クライアントが旧応答を保持する時間をさらに延ばす",
        "explanation": "DNS負荷を下げても、障害切替の追随を速める目的には逆方向である。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。権威DNSで応答が変わっても、全利用者が同時に再解決するわけではない。",
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
    "prompt": "拠点はDirect Connectを使い、切断時はSite-to-Site VPNへ切り替わる。重要通信は毎秒300 Mbps、VPNは試験で安定して200 Mbpsまでしか処理できなかった。適切な評価は。",
    "options": [
      {
        "id": "a",
        "text": "経路の冗長性はあっても代替帯域が不足する。重要通信の制御または代替経路の容量を改善して再検証する",
        "explanation": "切替の成功と切替後の必要帯域の確保は別であり、300に対して200では不足する。"
      },
      {
        "id": "b",
        "text": "VPNが接続済みなら、通常回線と同じ帯域を無条件に保証できる",
        "explanation": "実測された代替経路の容量制約を無視している。"
      },
      {
        "id": "c",
        "text": "通常時のDirect Connectを高速化するだけで、切断中のVPN帯域も増える",
        "explanation": "障害中に使えない通常回線の増強ではVPN側の制約は改善しない。"
      },
      {
        "id": "d",
        "text": "ルート優先度だけを変更し、VPNの実測結果は復旧計画から除外する",
        "explanation": "経路選択は変更できるが、代替経路の処理能力の不足は残る。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。切替の成功と切替後の必要帯域の確保は別であり、300に対して200では不足する。",
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
        "text": "リージョンの同時実行クォータだけを増やし、無制限にDB接続を増やす",
        "explanation": "入口の処理枠を増やすほど下流DBの接続上限を超える可能性が高まる。"
      },
      {
        "id": "c",
        "text": "メモリだけを最大へ増やし、同時接続数の制限は考えない",
        "explanation": "処理時間改善の可能性はあるが、同時100接続という制約を保証しない。"
      },
      {
        "id": "d",
        "text": "DBのタイムアウトだけを長くし、待機接続をさらに蓄積する",
        "explanation": "応答待ちを長引かせても接続容量は増えず、過負荷を解決しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。Lambdaの増加余地だけでなくDB制約を上限に含め、急増をバッファで吸収する。",
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
        "text": "Multi-AZのスタンバイへ切り替えれば、同期済みの誤更新だけ消えるとする",
        "explanation": "スタンバイも誤更新を反映するため、障害切替は論理障害からの時点復旧ではない。"
      },
      {
        "id": "c",
        "text": "RDS Proxyを追加するだけで、過去の正しいレコードを復元する",
        "explanation": "接続管理は改善しても、データを事故前の状態へ戻す機能ではない。"
      },
      {
        "id": "d",
        "text": "現在のDBを高性能なクラスへ変更し、そのまま業務を再開する",
        "explanation": "性能変更では誤った更新内容を取り消せない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。同期冗長化では誤更新も反映されるため、過去の保護時点へ復元する手段を使う。",
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
    "prompt": "バックアップと秘密・鍵の復元は確認済みだが、災害訓練で復旧先のSG再現とEC2上限調整に長時間を要した。データ複製方式は維持する。再発を減らす施策を2つ選べ。（2つ選択）",
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
        "text": "バックアップ回数だけを増やし、復旧先のネットワーク設定は毎回手書きにする",
        "explanation": "データ損失は減らせても、明示された構成再現とクォータの問題は残る。"
      },
      {
        "id": "d",
        "text": "元リージョンのクォータだけを確認し、復旧先も必ず同じとみなす",
        "explanation": "復旧先の適用値・使用量を検証せず、訓練で起きた制約を解消していない。"
      },
      {
        "id": "e",
        "text": "復旧手順から設定と上限確認を省略して、記録上のRTOだけ短くする",
        "explanation": "業務が復旧するために必要な工程を削っても実効的な復旧時間は改善しない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。手作業の設定漏れと再現時間を減らし、復旧先で使えることを確認する。 平常時の利用量ではなく障害時の拡張量から制約を先に解消する。",
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
        "text": "両方をSpotだけにし、中断通知があるのでAPIも停止しないとする",
        "explanation": "通知は中断をなくさず、APIの継続要件を満たさない。"
      },
      {
        "id": "c",
        "text": "Compute Savings Plansの契約だけで、特定AZの容量確保まで済ませる",
        "explanation": "料金のコミットメントと、起動に必要な容量の予約は別である。"
      },
      {
        "id": "d",
        "text": "解析のチェックポイントをなくし、Spotが中断したら処理結果を全て捨てる運用だけにする",
        "explanation": "再開可能という利点を失い、限られた完了時間の中で再処理が増える。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。中断許容性と起動容量の要求をワークロードごとに分ける。割引契約だけでは容量の代替にならない。",
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
        "text": "ファイル保存容量だけを増やし、スループット設定は固定する",
        "explanation": "gp3では容量増だけをボトルネック解消の根拠にはできない。"
      },
      {
        "id": "c",
        "text": "IOPSだけを増やし、転送量の上限はそのままにする",
        "explanation": "今回既に満たしている軸を増やしても、連続転送量の上限は解消しない。"
      },
      {
        "id": "d",
        "text": "EC2を大きくするだけで、ボリュームのスループット上限は変えない",
        "explanation": "EC2側は余裕があり、特定されたボリューム側の制約を残している。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。容量・IOPS・MiB/sを分け、測定で特定したボリューム側の転送量を調整する。",
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
    "prompt": "海外拠点からS3へ数十GiBのファイルをアップロードする。回線の瞬断で全体の再送が多い。転送高速化サービスの効果は拠点別に計測する方針である。まず再送範囲を小さくする手段は。",
    "options": [
      {
        "id": "a",
        "text": "Multipart uploadで分割・並列化し、失敗したパートを再送する。未完了パートの掃除も設定する",
        "explanation": "大きな1リクエストのやり直しを避け、再試行をパート単位へ限定できる。"
      },
      {
        "id": "b",
        "text": "Transfer Accelerationだけを有効にし、単一リクエストの失敗時も部分再送できるとする",
        "explanation": "経路高速化とマルチパートの再送単位は別の機能である。"
      },
      {
        "id": "c",
        "text": "アップロード先を低頻度クラスにするだけで、瞬断後の再送範囲を小さくする",
        "explanation": "保存クラスの変更はアップロード方式の分割を代替しない。"
      },
      {
        "id": "d",
        "text": "リクエストタイムアウトを無期限にし、失敗検知も再試行もやめる",
        "explanation": "瞬断に対して確実に完了させる再試行設計になっていない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。大きな1リクエストのやり直しを避け、再試行をパート単位へ限定できる。",
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
        "text": "全体容量だけを大幅に増やせば、単一キー集中も必ず解消するとする",
        "explanation": "パーティションやキーの偏りという制約を無視しており、総容量の増加だけで保証できない。"
      },
      {
        "id": "c",
        "text": "TTLで期限切れを削除するだけで、現在の同一キー書込みを分散させる",
        "explanation": "保持データは減らせても、現在の書込み先が集中する性質は変わらない。"
      },
      {
        "id": "d",
        "text": "結果表示する属性を減らし、書込みのパーティションキーは固定する",
        "explanation": "表示列の変更では書込み先の集中を解消しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。全体容量だけでなくホットなキーの集中を解消する必要がある。読取り側の影響も評価する。",
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
    "prompt": "商品検索の読取り負荷がRDSを圧迫する。商品説明は数十秒の古さを許容するが、購入直後の注文確認は最新が必要である。適切な分離は。",
    "options": [
      {
        "id": "a",
        "text": "商品検索はキャッシュやRead Replicaへ分散し、最新の注文確認は整合性要件を満たす書込み側へ読む",
        "explanation": "読取りの鮮度条件で経路を分け、非同期複製・キャッシュの遅れを許容できる処理だけを移す。"
      },
      {
        "id": "b",
        "text": "ScanのProjectionExpressionで表示属性を減らすだけで、読取り範囲も索引検索になるとする",
        "explanation": "返す属性を減らしても全表を探す方式は変わらない。"
      },
      {
        "id": "c",
        "text": "検索はプライマリDB、注文確認はRead Replicaへ分け、キャッシュは使わない",
        "explanation": "負荷を減らしたい検索を移さず、最新必須の確認を非同期Replicaへ置くため要件と逆になる。"
      },
      {
        "id": "d",
        "text": "商品と注文の両方を更新無効化なしの5分TTLキャッシュへ送り、読取りは全てそこで処理する",
        "explanation": "商品説明の数十秒許容と購入直後の最新確認を超える古さが残り得る。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。読取りの鮮度条件で経路を分け、非同期複製・キャッシュの遅れを許容できる処理だけを移す。",
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
    "prompt": "DynamoDBで商品IDを主キーにしているが、カテゴリ別一覧のため毎回全表Scanして遅くなった。一覧は結果整合でよく、カテゴリと価格範囲で絞りたい。適切な設計は。",
    "options": [
      {
        "id": "a",
        "text": "アクセスパターンに合わせカテゴリ等をキーにしたGSIを設計し、Queryと書込み費・キー偏りを評価する",
        "explanation": "必要な検索条件へ索引を用意して読取り対象を絞る。GSIの結果整合性は今回許容される。"
      },
      {
        "id": "b",
        "text": "ScanのProjectionExpressionで表示属性を減らすだけで、読取り範囲も索引検索になるとする",
        "explanation": "返す属性を減らしても全表を探す方式は変わらない。"
      },
      {
        "id": "c",
        "text": "GSIを作らず、存在しないカテゴリキーを指定したQueryで全表を検索する",
        "explanation": "Queryはキー条件を持つため、現在の主キー設計のまま任意属性を効率的に検索できない。"
      },
      {
        "id": "d",
        "text": "TTLを短くし、現役の商品を削除して一覧を高速化する",
        "explanation": "必要な商品データを失い、一覧の機能要件を満たさない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。必要な検索条件へ索引を用意して読取り対象を絞る。GSIの結果整合性は今回許容される。",
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
        "text": "使用メモリが少ないので最小メモリへ固定し、CPUの実測を省く",
        "explanation": "CPUの配分と処理時間が変わる可能性を無視し、既存の遅延問題を検証しない。"
      },
      {
        "id": "c",
        "text": "タイムアウトだけを長くし、p95の処理時間が短くなるとする",
        "explanation": "完了を待てる上限を変えてもCPU処理を高速化しない。"
      },
      {
        "id": "d",
        "text": "最大メモリなら必ず総費用も最小とし、計測を省く",
        "explanation": "高速化の程度と割当量の増加を比較しなければ総費用は判断できない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。メモリ設定によるCPU配分と実行時間の変化を測定し、割当量×時間の費用を評価する。",
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
    "prompt": "既存コンテナの科学計算は1ジョブ平均40分で、ジョブごとのCPU・メモリ要求も異なる。標準Lambdaの実行時間制限に合わせた分割は難しい。ホスト管理を抑えてキューで順次投入する候補は。",
    "options": [
      {
        "id": "a",
        "text": "AWS Batchと対応するFargate実行環境を、必要なリソース・機能が適合する範囲で使う",
        "explanation": "長いコンテナジョブのスケジューリングと実行資源の管理を分担できる。Fargateの対応条件は確認する。"
      },
      {
        "id": "b",
        "text": "標準Lambdaのタイムアウトを40分へ設定して、同じコンテナをそのまま実行する",
        "explanation": "標準Lambdaの最大実行時間を超える設定はできず、分割しない条件に合わない。"
      },
      {
        "id": "c",
        "text": "SQSだけを作り、コンテナの実行先とスケジューラは不要とする",
        "explanation": "待ち行列は計算資源でジョブを実行する仕組みそのものではない。"
      },
      {
        "id": "d",
        "text": "常時1台のEC2で全ジョブを同時起動し、CPU・メモリ要求を考慮しない",
        "explanation": "資源の異なるジョブの配置・過負荷管理をせず、ホスト管理を抑える目的にも合わない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。長いコンテナジョブのスケジューリングと実行資源の管理を分担できる。Fargateの対応条件は確認する。",
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
    "prompt": "多地域の利用者がリアルタイム対戦サーバーへUDP接続する。クライアントは固定IPを許可リストに登録し、正常なリージョンへ新規接続を誘導したい。コンテンツキャッシュは不要である。適切な入口は。",
    "options": [
      {
        "id": "a",
        "text": "Global Acceleratorで対応するリージョンのエンドポイントを構成し、固定Anycast IPを使う",
        "explanation": "UDPのグローバル入口と静的IP、ヘルスに基づくエンドポイント選択が要求に合う。"
      },
      {
        "id": "b",
        "text": "CloudFrontだけで任意のUDP対戦通信を画像と同様に配信する",
        "explanation": "HTTP系コンテンツ配信のキャッシュ入口と任意のUDP通信は異なる。"
      },
      {
        "id": "c",
        "text": "Route 53のレイテンシールーティングだけで、利用者の固定IP許可リストも不要にする",
        "explanation": "DNSの経路選択は提供できるが、要求された固定IPの入口を提供する設計ではない。"
      },
      {
        "id": "d",
        "text": "単一リージョンのNLBだけを固定IPで公開し、他リージョンの障害切替は構成しない",
        "explanation": "固定IPの地域入口は用意できても、複数リージョンの正常先への誘導を満たさない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。UDPのグローバル入口と静的IP、ヘルスに基づくエンドポイント選択が要求に合う。",
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
    "prompt": "センサーを秒単位で監視し、2つの独立処理系が同じイベントを再読取りする。障害後のリプレイ期間を設定し、S3への配送だけでは足りない。適切な中心サービスは。",
    "options": [
      {
        "id": "a",
        "text": "Kinesis Data Streamsの保持期間とコンシューマー容量を設計して、複数処理系が読む",
        "explanation": "ストリーム上の保持・再読取りと独立したコンシューマーを利用できる。"
      },
      {
        "id": "b",
        "text": "FirehoseによるS3配送だけで、独立コンシューマーの任意リプレイも全て代替する",
        "explanation": "配送サービスだけでは要求されたストリームの読取り・再読取り方式を構成していない。"
      },
      {
        "id": "c",
        "text": "1つのSQSを2処理系が競合消費し、両方が全イベントを受け取るとする",
        "explanation": "競合消費では全件をそれぞれへ届ける方式にならない。"
      },
      {
        "id": "d",
        "text": "1日1回のS3集計だけを行い、秒単位の監視を省く",
        "explanation": "日次分析には使えても今回の監視頻度を満たさない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。ストリーム上の保持・再読取りと独立したコンシューマーを利用できる。",
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
        "text": "ダッシュボードの色だけを変え、同じ全件SQLを実行する",
        "explanation": "表示変更はデータ読み出し範囲を変えない。"
      },
      {
        "id": "d",
        "text": "結果再利用を有効にし、元データを読まない実行へ変える",
        "explanation": "有効な場合もあるが、今回固定した結果再利用の条件に反する。"
      },
      {
        "id": "e",
        "text": "クエリ回数を半分にして、1回は引き続き全件・全列を走査する",
        "explanation": "実行頻度を固定する条件を破り、1回あたりの対象量も減らさない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。パーティション条件により不要な日付範囲の読取りを避ける。 列単位の読み出しを使い、全列を読むCSVより対象量を絞れる。",
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
        "text": "6台。毎秒120件の処理から到着100件を引き、滞留を150秒で解消する",
        "explanation": "必要な総処理は毎秒110件以上。5台では差分0なので6台が最小で、3,000÷20＝150秒。"
      },
      {
        "id": "b",
        "text": "5台。到着100件と同じ速度で処理すれば滞留も減る",
        "explanation": "新規到着と処理が同じでは滞留の純減がない。"
      },
      {
        "id": "c",
        "text": "4台。3,000件だけを80件/秒で割り、38秒で終わる",
        "explanation": "同時に到着する100件/秒を無視しており、実際には滞留が増える。"
      },
      {
        "id": "d",
        "text": "10台未満では絶対に5分以内に終わらない",
        "explanation": "10台は余裕があるが、6台でも条件を満たすため最小台数ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。必要な総処理は毎秒110件以上。5台では差分0なので6台が最小で、3,000÷20＝150秒。",
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
        "text": "DynamoDBへ表をそのまま移し、JOINも既存SQLのまま実行する",
        "explanation": "アクセスパターンとデータモデルの変更が必要で、SQL改修を最小化する前提に合わない。"
      },
      {
        "id": "c",
        "text": "ElastiCacheだけを唯一の会計台帳に置き換え、永続性・整合性の設計を省く",
        "explanation": "キャッシュの低遅延だけでは台帳の要件を満たす設計にならない。"
      },
      {
        "id": "d",
        "text": "S3にCSVを置いてAthenaで更新トランザクションをそのまま代替する",
        "explanation": "分析クエリの用途と、既存アプリの頻繁なOLTP更新を混同している。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。関係モデルと既存SQL・トランザクションの適合を先に確認できる。",
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
        "text": "Step Functionsの要件に合うワークフロー種別で状態・待機・再試行を管理し、各処理を呼び出す",
        "explanation": "長い待機を1回のLambda実行に閉じ込めず、処理の状態と失敗経路を明示できる。"
      },
      {
        "id": "b",
        "text": "1回の標準Lambdaを数日間sleepさせ、状態もメモリだけに置く",
        "explanation": "実行時間制限と状態喪失の問題があり、待機中の資源占有も避けられない。"
      },
      {
        "id": "c",
        "text": "SNS通知だけを送り、承認状態や補償の進行を保存しない",
        "explanation": "通知配送だけでは要求された複数段階の状態・再試行を管理していない。"
      },
      {
        "id": "d",
        "text": "API Gatewayの1つの接続を承認まで開き続け、再試行設計を省く",
        "explanation": "長期間の業務状態を同期接続に依存させ、失敗時の追跡と回復を満たさない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。長い待機を1回のLambda実行に閉じ込めず、処理の状態と失敗経路を明示できる。",
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
        "text": "Budgetsのメール通知だけで、支出が1円でも超える前に全資源が必ず停止するとする",
        "explanation": "通知は即時のハード上限ではなく、要求された対話的な費用分析の代替にもならない。"
      },
      {
        "id": "c",
        "text": "CURを毎月1回だけ手作業で集計し、予算超過は月締め後に連絡する",
        "explanation": "独自分析は可能だが、実績・予測による事前の予算通知と対話的な調査を実装していない。"
      },
      {
        "id": "d",
        "text": "Cost Explorerで毎月の内訳を確認し、通知は先月の総額だけを固定条件にする",
        "explanation": "分析はできるが、今月の予測が予算を超えることを通知する要件を満たさない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。分析と予算監視を分ける。請求データには反映遅延があり、通知だけで即時停止するわけではない。",
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
    "prompt": "複数アカウントの費用を部門別に配賦し、社内の配賦表とSQLで結合したい。管理対象タグを有効化し、S3上の詳細データから再計算できることが必要である。適切な基盤は。",
    "options": [
      {
        "id": "a",
        "text": "Data ExportsのCUR 2.0等をS3へ出力し、有効化したコスト配分タグやアカウント情報を使って集計する",
        "explanation": "詳細な費用データと独自配賦規則を結合できる。共有費とタグ未設定の扱いも決める。"
      },
      {
        "id": "b",
        "text": "Cost Explorerの画面を一度見るだけで、詳細データの保存と社内表との結合を省く",
        "explanation": "対話的な分析には使えるが、要求されたS3基盤での再計算手順を実装していない。"
      },
      {
        "id": "c",
        "text": "タグ名を資源へ付けるだけで、費用配分への有効化と欠損確認を省く",
        "explanation": "タグ付与だけで必要な費用データが完全に揃うとは限らず、配賦の前提を検証していない。"
      },
      {
        "id": "d",
        "text": "予算通知のメール件数を部門の費用額として配賦する",
        "explanation": "通知件数は請求額や部門別利用量ではなく、詳細配賦の根拠にならない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。詳細な費用データと独自配賦規則を結合できる。共有費とタグ未設定の扱いも決める。",
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
        "text": "特定AZ・属性に固定したStandard RIだけで、FargateとLambdaへも同じように適用する",
        "explanation": "EC2 RIの適用範囲とコンテナ・関数実行の割引範囲を混同している。"
      },
      {
        "id": "c",
        "text": "EC2 Instance Savings Plansを選び、リージョンとファミリーの制約がないとする",
        "explanation": "Compute型より適用範囲が狭く、指定リージョン・ファミリーの条件を考慮する必要がある。"
      },
      {
        "id": "d",
        "text": "Capacity Reservationだけを割引契約とみなし、利用料のコミットは考えない",
        "explanation": "容量の確保と割引購入は別であり、要求された柔軟な割引対象を選んでいない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。対象のEC2・Fargate・Lambdaをまたぐ柔軟性があり、使い切れるコミット額を選ぶ。",
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
    "prompt": "平日だけ使う対応EC2で、翌朝にプロセスのRAM状態を復元したい。休止条件は満たし暗号化EBSにも空きがある。未使用のコミット契約はない。夜間費用と状態保持の評価として適切なのは。",
    "options": [
      {
        "id": "a",
        "text": "休止でRAMをEBSへ保存して再開する。停止状態の通常の計算利用料は止まるがEBS等の料金は残る",
        "explanation": "停止と休止の差はRAM状態の保持であり、ディスク等の保存費まで無料になるわけではない。"
      },
      {
        "id": "b",
        "text": "通常停止でも全てのRAM状態が必ずEBSへ保存されるので、休止条件は不要とする",
        "explanation": "通常停止はRAM状態を休止と同じ方式で保存・復元しない。"
      },
      {
        "id": "c",
        "text": "再起動だけを行えば夜間ずっと停止料金になり、翌朝もRAMが残る",
        "explanation": "再起動は夜間停止の代替ではなく、プロセスのRAM保持も保証しない。"
      },
      {
        "id": "d",
        "text": "終了してルートEBSも削除し、翌朝は同じプロセスをそのまま再開する",
        "explanation": "保存先と実行状態を失う構成で、RAM状態の復元要件を満たさない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。停止と休止の差はRAM状態の保持であり、ディスク等の保存費まで無料になるわけではない。",
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
    "prompt": "DynamoDBの容量計画で、8KiB項目の強い整合性GetItemを毎秒60件、1.2KiB項目の非トランザクションPutItemを毎秒40件実行する。GSI・再試行・余裕率を除いたRCU/WCUを2つ選べ。（2つ選択）",
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
        "text": "読取りは60 RCU",
        "explanation": "項目が4KiBを超える分を無視しており、強い整合性で必要な容量に不足する。"
      },
      {
        "id": "d",
        "text": "書込みは48 WCU",
        "explanation": "項目単位の1KiB切上げをせず、小数のまま乗算している。"
      },
      {
        "id": "e",
        "text": "読取りも書込みも毎秒リクエスト数だけあればよい",
        "explanation": "データサイズ・整合性・トランザクション条件による必要単位の違いを無視している。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。8KiBは4KiB単位で2、強い整合性なので2×60＝120 RCU。 1.2KiBを1KiB単位で切り上げて2、2×40＝80 WCU。",
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
        "text": "40KiB×10日と保存単価だけを比べ、必ずIAの方が安いとする",
        "explanation": "最小課金サイズ・最低期間・リクエスト費を無視している。"
      },
      {
        "id": "c",
        "text": "Deep Archiveへ直ちに移し、復元待ちなしで直接読めるとする",
        "explanation": "保存単価が低くても即時読取りの要件を満たさない。"
      },
      {
        "id": "d",
        "text": "取得要求を行う利用者がいるので、ストレージと取得費は発生しないとする",
        "explanation": "アクセスがあることは料金がなくなる根拠にはならない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。実データ量と実保存日数だけを掛けると、IAの最低課金と追加費を見落とす。",
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
    "prompt": "同じ性能・可用性を満たすAuroraの2候補を比較する。仮定の月額はStandardが計算70・保存20・I/O45単位、I/O-Optimizedが計算90・保存25・I/O0単位で、他費用は同額である。選ぶ評価は。",
    "options": [
      {
        "id": "a",
        "text": "合計135対115なので、今回の仮定ではI/O-Optimizedが20単位安い",
        "explanation": "計算・保存・I/Oを全て合計し、同じ機能要件の候補間で比較している。"
      },
      {
        "id": "b",
        "text": "計算だけが70対90なので、Standardが20単位安い",
        "explanation": "保存とI/Oの差を無視しており、月額全体の比較になっていない。"
      },
      {
        "id": "c",
        "text": "Standardが45単位安い。I/O-Optimizedの計算費だけを同額に揃えて比較する",
        "explanation": "実際に与えられた計算・保存費の差を改変しており、提示条件の合計比較にならない。"
      },
      {
        "id": "d",
        "text": "I/O-Optimizedが45単位安い。削減されるI/O費だけを差額とする",
        "explanation": "I/O削減45に対し計算費20・保存費5が増えるため、差額は20である。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。計算・保存・I/Oを全て合計し、同じ機能要件の候補間で比較している。",
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
        "text": "NATを削除するだけで、外部APIにもS3にも自動的に到達できるとする",
        "explanation": "代替経路を整えず、継続が必要な外部API通信まで失う。"
      },
      {
        "id": "c",
        "text": "S3保存クラスだけを変更し、全転送を同じNAT経路へ流し続ける",
        "explanation": "保存費の検討にはなるが、今回対象のNAT処理経路を変えない。"
      },
      {
        "id": "d",
        "text": "全通信を別AZの1つのNATへ集中し、AZ間転送は比較から除外する",
        "explanation": "S3通信がNATを通る問題を残し、追加の転送費も見落とす。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。対象のS3経路をNATから分離できる。エンドポイントポリシーとS3/IAM認可も確認する。",
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
        "text": "メモリ最適化の大きなインスタンスを選び、CPU負荷に合わせた台数の見直しは行わない",
        "explanation": "メモリは余裕があり、ボトルネックや昼夜の変動と購入資源が一致していない。"
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
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。インスタンス選定とスケーリングを組み合わせ、安さより先に性能・可用性条件を満たす。",
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
        "text": "利用者ごとの全追跡値をキーに含め、同じ文書でも別キャッシュにする",
        "explanation": "キャッシュ共有を弱め、同じ内容の反復取得を減らす目的に逆行する。"
      },
      {
        "id": "d",
        "text": "許容更新間隔を超える長いTTLを固定し、無効化やURL更新も行わない",
        "explanation": "ヒット率は上がっても1日以内の更新反映条件を満たさない。"
      },
      {
        "id": "e",
        "text": "キャッシュを無効化して毎回S3へ取得し、オリジン要求数を削減したとする",
        "explanation": "キャッシュで反復取得を減らす要求を満たしていない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。同じコンテンツの反復要求をエッジで処理し、鮮度の上限も守る。 不要なキー分割を避ける。ただし配信費を含め総額で効果を検証する。",
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
        "text": "全バックアップを35日で削除し、日次要件だけを満たす",
        "explanation": "7年の月末保持という必須条件を破る。"
      },
      {
        "id": "c",
        "text": "全世代を最も安い階層へ移し、復元時間と対応するバックアップ種別を確認しない",
        "explanation": "階層の利用可否・復元待ちが要件に適合することを検証していない。"
      },
      {
        "id": "d",
        "text": "バックアップ作成を止め、DBのMulti-AZだけを7年分の履歴として扱う",
        "explanation": "冗長化は時点ごとの長期バックアップ保持を代替しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。全世代を同じ高頻度階層で保持する必要はないが、保持期間と復元可能時間を先に満たす。",
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
    "prompt": "新規サービスのDynamoDB利用は日による変動が大きく、まだ安定利用量を予測できない。初期は容量管理を抑え、実績が固まった後に購入・容量方式を見直す方針である。適切な進め方は。",
    "options": [
      {
        "id": "a",
        "text": "オンデマンドを候補にして利用量・スロットリング・キー偏り・費用を監視し、安定後にプロビジョンド等と比較する",
        "explanation": "予測困難な初期運用を扱いつつ、上限やホットキーがなくなるとは考えず、実績で再評価する。"
      },
      {
        "id": "b",
        "text": "初月の最小値だけで固定容量を決め、急増時も増量しない",
        "explanation": "予測困難な変動を吸収する方針に合わず、不足が起きる。"
      },
      {
        "id": "c",
        "text": "オンデマンドならキー集中やサービス上限も無制限になるので監視を省く",
        "explanation": "容量方式を変えてもキー設計や適用上限などの制約がなくなるわけではない。"
      },
      {
        "id": "d",
        "text": "実績がないまま最大想定量へ長期コミットし、未使用分の費用は評価しない",
        "explanation": "安定利用が未確認であり、使い切れない購入のリスクを見落とす。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。予測困難な初期運用を扱いつつ、上限やホットキーがなくなるとは考えず、実績で再評価する。",
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
    "prompt": "2 AZの外向き経路を比較する。候補AはAZ-AのNATへ集約し月60単位、候補Bは各AZのNATを使い月90単位。必要な費用を全て含む仮定で、AZ-A障害中もAZ-Bの外部通信を継続することが必須である。適切な判断は。",
    "options": [
      {
        "id": "a",
        "text": "候補Bを選ぶ。30単位高いが、候補Aは要求されたAZ-A障害時の継続を満たさない",
        "explanation": "まず障害範囲の必須条件で候補を絞り、その中で費用を比較する。"
      },
      {
        "id": "b",
        "text": "候補Aを選び、30単位の削減だけを理由に障害時の出口を確認しない",
        "explanation": "最安でも必須の継続条件を満たさない構成は選べない。"
      },
      {
        "id": "c",
        "text": "候補AのNAT帯域だけを増やし、AZ-Aの全停止にも耐えるとする",
        "explanation": "性能余力を増やしても、出口が同一AZへ依存する障害範囲は変わらない。"
      },
      {
        "id": "d",
        "text": "候補BからAZ-BのNATを削除しても、同じ継続性と月額90を維持するとする",
        "explanation": "構成を変えたら経路・障害範囲・費用も再評価が必要で、候補Bの前提を保てない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "必須条件をそれぞれの構成へ当てはめ、部分的に満たす候補と全条件を満たす候補を区別する。まず障害範囲の必須条件で候補を絞り、その中で費用を比較する。",
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
