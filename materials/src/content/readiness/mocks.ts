import type { Question } from '../../types';
export const mock1: Question[] = [
  {
    "id": "m1-001",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "iam-role"
    ],
    "prompt": "EC2上の監査集計がS3へ書き込む。ソースやAMIに秘密を残さず、短期認証情報を自動取得したい。最適な認可方式は。",
    "options": [
      {
        "id": "a",
        "text": "EC2へ最小権限のインスタンスロールを関連付ける",
        "explanation": "EC2上のワークロードが一時認証情報を取得する方式。外部担当者の直接委任とは用途が異なる。"
      },
      {
        "id": "b",
        "text": "利用先にクロスアカウントロールを作りAssumeRoleを許可する",
        "explanation": "外部の主体への委任では信頼ポリシーと呼出し側の許可を整える。"
      },
      {
        "id": "c",
        "text": "人用IAMユーザーのアクセスキーを共通配布する",
        "explanation": "長期認証情報の配布と共有を増やし短期認証の条件に合わない。"
      },
      {
        "id": "d",
        "text": "S3バケットを匿名書込み可能にする",
        "explanation": "本人確認と対象を絞る認可をなくしてしまう。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「EC2へ最小権限のインスタンスロールを関連付ける」を選ぶ。EC2上のワークロードが一時認証情報を取得する方式。外部担当者の直接委任とは用途が異なる。",
    "sources": [
      {
        "title": "IAM最小権限・一時認証情報",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
        "checked": "2026-10-08"
      },
      {
        "title": "主体とリソースのポリシー",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-002",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "explicit-deny"
    ],
    "prompt": "同一アカウントのIAMユーザーにS3読取りAllowがあり、同じ対象へ適用される明示的Denyもある。SCP等の他条件は満たす。結果は。",
    "options": [
      {
        "id": "a",
        "text": "明示的Denyによって拒否",
        "explanation": "適用される明示的Denyがある場合はAllowより優先する。"
      },
      {
        "id": "b",
        "text": "許可がないため暗黙的に拒否",
        "explanation": "適用される許可がない場合の既定の結果である。"
      },
      {
        "id": "c",
        "text": "Allowの件数が多ければ許可",
        "explanation": "評価は許可と拒否の票数比較ではない。"
      },
      {
        "id": "d",
        "text": "作成日の新しい方で決める",
        "explanation": "ポリシー更新日時は許可と拒否の優先基準ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「明示的Denyによって拒否」を選ぶ。適用される明示的Denyがある場合はAllowより優先する。",
    "sources": [
      {
        "title": "IAMポリシー評価",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-003",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "scp"
    ],
    "prompt": "本番OU配下の全メンバーで監査ログ停止を禁止し、各アカウントの管理者によるAllowでも回避させたくない。どの層で制限するか。",
    "options": [
      {
        "id": "a",
        "text": "OUへ対象操作を拒否するSCP",
        "explanation": "メンバーアカウントに一貫した権限上限を適用する。SCPだけでは権限を付与しない。"
      },
      {
        "id": "b",
        "text": "作成ロールへのアクセス許可の境界を必須にする",
        "explanation": "主体ごとの最大権限を制約し、境界の除去や迂回も防ぐ設計にする。"
      },
      {
        "id": "c",
        "text": "全ロールへ同じAdministratorAccessを付ける",
        "explanation": "上限を設けず不要な操作まで許可する。"
      },
      {
        "id": "d",
        "text": "CloudTrailで監査するだけにする",
        "explanation": "実行の記録とAPIの禁止は別である。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「OUへ対象操作を拒否するSCP」を選ぶ。メンバーアカウントに一貫した権限上限を適用する。SCPだけでは権限を付与しない。",
    "sources": [
      {
        "title": "Organizationsの権限上限",
        "url": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html",
        "checked": "2026-10-08"
      },
      {
        "title": "IAMポリシー評価",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-004",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "identity-center"
    ],
    "prompt": "全社員が既存社内IDで開発・本番アカウントを使う。部署ごとにアクセス範囲を一括管理し、一時認証情報を使いたい。選ぶ基盤は。",
    "options": [
      {
        "id": "a",
        "text": "IAM Identity Center",
        "explanation": "従業員のアカウント・業務アプリへのアクセスを集約する。"
      },
      {
        "id": "b",
        "text": "Amazon Cognitoユーザープール",
        "explanation": "アプリ利用者のサインアップや認証を扱う。"
      },
      {
        "id": "c",
        "text": "OrganizationsのSCPだけ",
        "explanation": "権限上限でありユーザー認証の基盤そのものではない。"
      },
      {
        "id": "d",
        "text": "EC2のインスタンスプロファイル",
        "explanation": "EC2ワークロード用であり人の会員管理の代替ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「IAM Identity Center」を選ぶ。従業員のアカウント・業務アプリへのアクセスを集約する。",
    "sources": [
      {
        "title": "社内IdP連携",
        "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-idp.html",
        "checked": "2026-10-08"
      },
      {
        "title": "IAM最小権限・一時認証情報",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Cognitoユーザープールの認証",
        "url": "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-005",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "identity-center"
    ],
    "prompt": "SAMLで社内IdPの認証は成功するが、新入社員がIdentity Centerの割当に現れない。まず確認する同期は。",
    "options": [
      {
        "id": "a",
        "text": "SCIM等によるユーザー・グループのプロビジョニング",
        "explanation": "SAMLだけではIdPのユーザー一覧を自動取得しない。割当前にIDを認識させる。"
      },
      {
        "id": "b",
        "text": "グループへのアカウントと許可セットの割当",
        "explanation": "存在する社員がどのAWSアカウントで何を行うかを指定する。"
      },
      {
        "id": "c",
        "text": "SCPに全サービスAllowを追加して認証する",
        "explanation": "SCPではユーザー作成やログイン先の割当を代行しない。"
      },
      {
        "id": "d",
        "text": "ルートユーザーの認証情報を新入社員へ配る",
        "explanation": "個人別の最小権限と社内ID連携の要件を損なう。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「SCIM等によるユーザー・グループのプロビジョニング」を選ぶ。SAMLだけではIdPのユーザー一覧を自動取得しない。割当前にIDを認識させる。",
    "sources": [
      {
        "title": "社内IdP連携",
        "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-idp.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Organizationsの権限上限",
        "url": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-006",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "resource-policy"
    ],
    "prompt": "AのIAMロールがBのSSE-S3オブジェクトを直接読む。AのGetObject許可は設定済みで拒否要因はないがBが未許可。追加すべきものは。",
    "options": [
      {
        "id": "a",
        "text": "Bのバケットポリシーで対象ロールと範囲を許可",
        "explanation": "別アカウントからの直接アクセスではリソース側の許可が必要。"
      },
      {
        "id": "b",
        "text": "Aのロールへ対象GetObjectを許可する権限ポリシー",
        "explanation": "クロスアカウントでは利用元の主体側の許可も必要。"
      },
      {
        "id": "c",
        "text": "BのSCPでS3をAllowするだけ",
        "explanation": "権限上限の設定はバケットへの許可を付与しない。"
      },
      {
        "id": "d",
        "text": "S3ストレージクラスをStandardへ変更",
        "explanation": "保管クラスはIAM主体への権限付与ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「Bのバケットポリシーで対象ロールと範囲を許可」を選ぶ。別アカウントからの直接アクセスではリソース側の許可が必要。",
    "sources": [
      {
        "title": "主体とリソースのポリシー",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-007",
    "chapterId": "ch03",
    "domain": 1,
    "conceptIds": [
      "security-group"
    ],
    "prompt": "ALBからアプリへのTCP通信をSGで許可した。NACLとルートは正しい。確立済み接続の応答を通すためのSGの考え方は。",
    "options": [
      {
        "id": "a",
        "text": "SGは状態を追跡するため許可した接続の応答を通す",
        "explanation": "SGのステートフル性についての説明でありNACLにはそのまま適用できない。"
      },
      {
        "id": "b",
        "text": "NACLの戻り方向のエフェメラルポート等を許可する",
        "explanation": "NACLは状態を追跡せず方向ごとの通過条件が必要。"
      },
      {
        "id": "c",
        "text": "戻り通信はすべての制御を無条件で通る",
        "explanation": "SGの状態追跡があっても別のNACLや経路の制約は残る。"
      },
      {
        "id": "d",
        "text": "受信した宛先ポートだけを逆方向にも許可する",
        "explanation": "クライアント側の戻り先ポートを考慮せず正しい応答許可にならない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「SGは状態を追跡するため許可した接続の応答を通す」を選ぶ。SGのステートフル性についての説明でありNACLにはそのまま適用できない。",
    "sources": [
      {
        "title": "SGの状態追跡",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html",
        "checked": "2026-10-08"
      },
      {
        "title": "NACLのステートレス制御",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-008",
    "chapterId": "ch03",
    "domain": 1,
    "conceptIds": [
      "network-acl"
    ],
    "prompt": "悪意あるCIDRをサブネット境界で明示的に拒否したい。TCP以外も含むIP通信が対象である。設定するものは。",
    "options": [
      {
        "id": "a",
        "text": "NACLの適切な優先順位にDenyルールを設定",
        "explanation": "サブネット境界で許可と明示的拒否を使える。戻りも別途設計する。"
      },
      {
        "id": "b",
        "text": "DBのSGの送信元にアプリSGを指定",
        "explanation": "アプリ層の変動するIPごとの管理を避けて通信許可を限定できる。"
      },
      {
        "id": "c",
        "text": "SGへDenyルールを追加",
        "explanation": "SGに明示的Denyルールはなく許可ルールで制御する。"
      },
      {
        "id": "d",
        "text": "WAFだけで任意のDBポートのパケットを拒否",
        "explanation": "WAFはWebリクエスト向けで任意のIP通信の境界制御ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「NACLの適切な優先順位にDenyルールを設定」を選ぶ。サブネット境界で許可と明示的拒否を使える。戻りも別途設計する。",
    "sources": [
      {
        "title": "SGの状態追跡",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html",
        "checked": "2026-10-08"
      },
      {
        "title": "NACLのステートレス制御",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html",
        "checked": "2026-10-08"
      },
      {
        "title": "WAFのWebリクエスト保護",
        "url": "https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-009",
    "chapterId": "ch03",
    "domain": 1,
    "conceptIds": [
      "vpc-endpoint"
    ],
    "prompt": "非公開EC2から同一リージョンのS3へ接続したい。インターネット出口を設けず、エンドポイント自体の追加課金も避けたい。選択は。",
    "options": [
      {
        "id": "a",
        "text": "S3 Gateway endpointと対象ルートテーブルの関連付け",
        "explanation": "S3へのサービス向け経路を提供しエンドポイント追加料金はない。"
      },
      {
        "id": "b",
        "text": "Secrets ManagerのInterface endpoint",
        "explanation": "対応サービスへPrivateLink経由のプライベートIP接続を提供する。"
      },
      {
        "id": "c",
        "text": "S3 Gateway endpointを全サービスに共用",
        "explanation": "Gateway endpointは任意のAWSサービス向け出口ではない。"
      },
      {
        "id": "d",
        "text": "S3を匿名公開して認証不要にする",
        "explanation": "到達経路の条件を満たすために公開する必要はない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「S3 Gateway endpointと対象ルートテーブルの関連付け」を選ぶ。S3へのサービス向け経路を提供しエンドポイント追加料金はない。",
    "sources": [
      {
        "title": "Gateway endpointの経路と費用",
        "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Secrets ManagerのInterface endpoint",
        "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/vpc-endpoint-overview.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-010",
    "chapterId": "ch07",
    "domain": 1,
    "conceptIds": [
      "hybrid-network"
    ],
    "prompt": "専用のDirect Connect接続を既に構築した。機密データは通信中も暗号化する必要がある。必要な追加判断を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "TLSやVPN等の暗号化方式を設計する",
        "explanation": "Direct Connectの採用だけで既定の通信暗号化は得られない。"
      },
      {
        "id": "b",
        "text": "対応する接続・区間ではMACsecの適用範囲も比較する",
        "explanation": "MACsecは条件付きのリンク暗号化で、保護範囲を確認して採用する。"
      },
      {
        "id": "c",
        "text": "装置・回線・接続場所の単一障害点を分ける",
        "explanation": "冗長接続は同じ故障原因で同時に失わないよう設計する。"
      },
      {
        "id": "d",
        "text": "切替先の帯域で業務負荷を処理できるか測定する",
        "explanation": "接続が残ることと必要な処理量を維持できることは別。"
      },
      {
        "id": "e",
        "text": "専用線1本なら暗号化も無停止も完了したとする",
        "explanation": "専用接続だけで両方を保証することはできない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "本問では「TLSやVPN等の暗号化方式を設計する」「対応する接続・区間ではMACsecの適用範囲も比較する」を選ぶ。Direct Connectの採用だけで既定の通信暗号化は得られない。 MACsecは条件付きのリンク暗号化で、保護範囲を確認して採用する。",
    "sources": [
      {
        "title": "専用線の暗号化条件",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html",
        "checked": "2026-10-08"
      },
      {
        "title": "静的安定性と残存容量",
        "url": "https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_withstand_component_failures_static_stability.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-011",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "kms-rotation"
    ],
    "prompt": "KMS生成の対称カスタマーマネージドキーの素材を更新し、同じキーIDと既存データの復号を維持したい。方式は。",
    "options": [
      {
        "id": "a",
        "text": "対応するキーで素材の自動またはオンデマンドローテーションを使う",
        "explanation": "論理キーを保ち、過去の暗号文には対応する素材を使える。"
      },
      {
        "id": "b",
        "text": "旧キーの復号権限と利用可能性を維持する",
        "explanation": "エイリアス変更だけでは旧暗号文が新キーで復号できるわけではない。"
      },
      {
        "id": "c",
        "text": "新しいキーができたので旧キーを即削除する",
        "explanation": "旧暗号文の復号に必要な素材を失うおそれがある。"
      },
      {
        "id": "d",
        "text": "キー名だけ変更して暗号化済みデータを書き換えたとする",
        "explanation": "名称変更は鍵素材更新でも再暗号化でもない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「対応するキーで素材の自動またはオンデマンドローテーションを使う」を選ぶ。論理キーを保ち、過去の暗号文には対応する素材を使える。",
    "sources": [
      {
        "title": "鍵更新の効果と限界",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html",
        "checked": "2026-10-08"
      },
      {
        "title": "KMS削除と復号",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-012",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "kms-rotation"
    ],
    "prompt": "監査規定はKMS鍵素材の定期更新を求める。既存暗号文の作り直しは要求していない。ローテーション後の正しい理解は。",
    "options": [
      {
        "id": "a",
        "text": "旧暗号文は対応素材で復号でき、データ自体の再暗号化は起きない",
        "explanation": "ローテーションは鍵素材の更新で既存データを自動変更しない。"
      },
      {
        "id": "b",
        "text": "漏えいデータキーへの対処とデータ再暗号化を別に検討する",
        "explanation": "KMSローテーションだけでは漏えいしたデータキーの影響を解消しない。"
      },
      {
        "id": "c",
        "text": "旧データは更新のたびに必ず読めなくなる",
        "explanation": "同じ論理キーのローテーションでは対応素材が保持される。"
      },
      {
        "id": "d",
        "text": "ACM証明書を更新すれば保存暗号文も作り直される",
        "explanation": "TLS証明書と保存時暗号化のデータキーは別である。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「旧暗号文は対応素材で復号でき、データ自体の再暗号化は起きない」を選ぶ。ローテーションは鍵素材の更新で既存データを自動変更しない。",
    "sources": [
      {
        "title": "鍵更新の効果と限界",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-013",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "acm-renewal"
    ],
    "prompt": "ALBに関連付けたACM発行のDNS検証済み公開証明書を継続運用する。更新のため維持する設定は。",
    "options": [
      {
        "id": "a",
        "text": "DNS検証用CNAMEと更新適格な利用状態を維持する",
        "explanation": "ACM発行のDNS検証証明書の自動更新に必要な条件を保つ。"
      },
      {
        "id": "b",
        "text": "外部CAで更新し証明書を再インポートする",
        "explanation": "インポート証明書はACMのマネージド更新の対象ではない。"
      },
      {
        "id": "c",
        "text": "発行済みなら検証CNAMEを削除して放置する",
        "explanation": "DNS検証の更新条件を損なう可能性がある。"
      },
      {
        "id": "d",
        "text": "KMSキー素材の更新だけを実行する",
        "explanation": "保存鍵の更新ではTLS証明書の期限は延びない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「DNS検証用CNAMEと更新適格な利用状態を維持する」を選ぶ。ACM発行のDNS検証証明書の自動更新に必要な条件を保つ。",
    "sources": [
      {
        "title": "ACMの更新対象",
        "url": "https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DNS検証更新",
        "url": "https://docs.aws.amazon.com/acm/latest/userguide/dns-renewal-validation.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-014",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "secrets-manager"
    ],
    "prompt": "DBパスワードを自動で変更し、アプリが新しい値を取得できるようにしたい。選ぶ機能は。",
    "options": [
      {
        "id": "a",
        "text": "Secrets Managerの対応するローテーション",
        "explanation": "DBと秘密値の整合性、アプリの取得・再接続まで確認する。"
      },
      {
        "id": "b",
        "text": "ACM発行証明書と対応サービスの連携",
        "explanation": "TLS証明書のライフサイクルを扱い、DB資格情報の変更とは異なる。"
      },
      {
        "id": "c",
        "text": "KMS素材更新だけ",
        "explanation": "鍵素材を更新する機能でDBパスワードや証明書の期限管理ではない。"
      },
      {
        "id": "d",
        "text": "新しい値をソースへ直接書いて公開する",
        "explanation": "秘密の配布範囲を広げて保護と運用の条件に合わない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「Secrets Managerの対応するローテーション」を選ぶ。DBと秘密値の整合性、アプリの取得・再接続まで確認する。",
    "sources": [
      {
        "title": "秘密情報ローテーション",
        "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html",
        "checked": "2026-10-08"
      },
      {
        "title": "ACMの更新対象",
        "url": "https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html",
        "checked": "2026-10-08"
      },
      {
        "title": "鍵更新の効果と限界",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-015",
    "chapterId": "ch07",
    "domain": 1,
    "conceptIds": [
      "cloudfront-oac"
    ],
    "prompt": "有料画像のS3 RESTオリジンを非公開にし、特定CloudFront配信だけが取得できるようにする。必要な構成は。",
    "options": [
      {
        "id": "a",
        "text": "OACと対象配信を許可するバケットポリシー",
        "explanation": "CloudFrontからS3へのオリジンアクセスを制御する。視聴者認可は別。"
      },
      {
        "id": "b",
        "text": "期限を指定するCloudFront署名付きURL",
        "explanation": "単一コンテンツに対する利用者のアクセス条件を付けられる。"
      },
      {
        "id": "c",
        "text": "S3の公開URLを知る人だけへ教える",
        "explanation": "URLの秘匿は認可の代替にならない。"
      },
      {
        "id": "d",
        "text": "Route 53加重設定で一部要求だけ通す",
        "explanation": "利用権限や有効期限を検証する仕組みではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「OACと対象配信を許可するバケットポリシー」を選ぶ。CloudFrontからS3へのオリジンアクセスを制御する。視聴者認可は別。",
    "sources": [
      {
        "title": "OACとS3のオリジン制限",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html",
        "checked": "2026-10-08"
      },
      {
        "title": "署名付きURLとCookieの選択",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-choosing-signed-urls-cookies.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-016",
    "chapterId": "ch07",
    "domain": 1,
    "conceptIds": [
      "signed-url"
    ],
    "prompt": "会員動画が多数のセグメントを読み込む。個々のURLを変更せず一括で利用条件を渡したい。何を使うか。",
    "options": [
      {
        "id": "a",
        "text": "CloudFront署名付きCookie",
        "explanation": "複数の対象ファイルのアクセス権をCookieでまとめて扱う。"
      },
      {
        "id": "b",
        "text": "CloudFront署名付きURL",
        "explanation": "対象ファイルへの制限をURLへ含める方式である。"
      },
      {
        "id": "c",
        "text": "OACだけ",
        "explanation": "CloudFrontとオリジン間の保護で、利用者の購入条件ではない。"
      },
      {
        "id": "d",
        "text": "Originのファイル名だけ変更",
        "explanation": "名前変更だけでは利用権や期限を検証しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「CloudFront署名付きCookie」を選ぶ。複数の対象ファイルのアクセス権をCookieでまとめて扱う。",
    "sources": [
      {
        "title": "署名付きURLとCookieの選択",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-choosing-signed-urls-cookies.html",
        "checked": "2026-10-08"
      },
      {
        "title": "OACとS3のオリジン制限",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-017",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "cloudtrail"
    ],
    "prompt": "誰が昨日セキュリティグループを変更したか、API呼出し主体を調査する。まず参照するものは。",
    "options": [
      {
        "id": "a",
        "text": "CloudTrailの管理イベント",
        "explanation": "主体とAPI操作を追う監査記録に使う。"
      },
      {
        "id": "b",
        "text": "AWS Configの構成履歴とルール",
        "explanation": "リソースの構成と準拠状態を継続評価する。"
      },
      {
        "id": "c",
        "text": "CloudWatchのCPUメトリクスだけ",
        "explanation": "CPU推移から変更したAPI主体や構成履歴は分からない。"
      },
      {
        "id": "d",
        "text": "ALBアクセスログだけ",
        "explanation": "Web要求の記録は任意の管理APIや全リソース構成の台帳ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「CloudTrailの管理イベント」を選ぶ。主体とAPI操作を追う監査記録に使う。",
    "sources": [
      {
        "title": "API監査",
        "url": "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Configの設定記録",
        "url": "https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html",
        "checked": "2026-10-08"
      },
      {
        "title": "CloudWatchの運用観測",
        "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-018",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "waf"
    ],
    "prompt": "SQLインジェクションと過剰なHTTP要求をALBの前で制御したい。アプリの修正も継続する。適した防御は。",
    "options": [
      {
        "id": "a",
        "text": "AWS WAFのWeb ACLとルール",
        "explanation": "HTTP要求の検査やレートルールに使い、任意のIP通信の境界制御とは違う。"
      },
      {
        "id": "b",
        "text": "ネットワークACLのDeny",
        "explanation": "サブネットのIP通信に許可・拒否を適用できる。"
      },
      {
        "id": "c",
        "text": "CloudTrailで記録するだけ",
        "explanation": "監査ログを取るだけでは通信を拒否しない。"
      },
      {
        "id": "d",
        "text": "KMSで保存データを暗号化するだけ",
        "explanation": "保存時暗号化は悪意ある要求の遮断ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「AWS WAFのWeb ACLとルール」を選ぶ。HTTP要求の検査やレートルールに使い、任意のIP通信の境界制御とは違う。",
    "sources": [
      {
        "title": "WAFのWebリクエスト保護",
        "url": "https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html",
        "checked": "2026-10-08"
      },
      {
        "title": "NACLのステートレス制御",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-019",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "least-privilege"
    ],
    "prompt": "会計チームはreportプレフィックスのS3オブジェクトを読むだけでよい。最小権限の施策を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "必要なオブジェクトARNへGetObjectを限定する",
        "explanation": "読み取る対象と操作を業務範囲へ絞る。"
      },
      {
        "id": "b",
        "text": "必要なList操作も対象プレフィックス等で制約する",
        "explanation": "一覧が必要な場合も不要な範囲を許可しない。"
      },
      {
        "id": "c",
        "text": "主体とリソースのタグ条件を照合する",
        "explanation": "属性によって操作可能な範囲を決める。"
      },
      {
        "id": "d",
        "text": "認可に使うタグを自由に変更できないよう制約する",
        "explanation": "タグを変えて上限を回避する権限昇格を防ぐ。"
      },
      {
        "id": "e",
        "text": "運用が簡単なので全サービスへ管理者権限を付与する",
        "explanation": "業務以上の権限を与え最小権限に反する。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "本問では「必要なオブジェクトARNへGetObjectを限定する」「必要なList操作も対象プレフィックス等で制約する」を選ぶ。読み取る対象と操作を業務範囲へ絞る。 一覧が必要な場合も不要な範囲を許可しない。",
    "sources": [
      {
        "title": "IAM最小権限・一時認証情報",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
        "checked": "2026-10-08"
      },
      {
        "title": "IAMポリシー評価",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
        "checked": "2026-10-08"
      },
      {
        "title": "属性に基づく認可",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-020",
    "chapterId": "ch12",
    "domain": 1,
    "conceptIds": [
      "lake-formation"
    ],
    "prompt": "S3データレイクを複数部署が分析する。部署ごとにテーブルや列の権限を集約したい。中心となる仕組みは。",
    "options": [
      {
        "id": "a",
        "text": "Lake Formationと必要なIAM・S3権限の整理",
        "explanation": "データレイクの細かな権限管理を行い、関連するアクセス条件も整える。"
      },
      {
        "id": "b",
        "text": "KMSキーのポリシー等による利用権限管理",
        "explanation": "暗号操作とキー利用を制御する。分析テーブルの業務権限とは別。"
      },
      {
        "id": "c",
        "text": "Glueカタログ登録だけで全認可完了とする",
        "explanation": "メタデータ登録はすべてのアクセス権の付与や制約ではない。"
      },
      {
        "id": "d",
        "text": "データを全世界へ公開してクエリ側で隠す",
        "explanation": "読取り権限を公開してから画面だけで隠しても保護できない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「Lake Formationと必要なIAM・S3権限の整理」を選ぶ。データレイクの細かな権限管理を行い、関連するアクセス条件も整える。",
    "sources": [
      {
        "title": "データレイク権限",
        "url": "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html",
        "checked": "2026-10-08"
      },
      {
        "title": "鍵更新の効果と限界",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-021",
    "chapterId": "ch01",
    "domain": 2,
    "conceptIds": [
      "availability"
    ],
    "prompt": "3AZへ均等配置し、1台200件/秒、ピーク800件/秒を処理する。1AZ喪失直後も増設せずピークを維持する最小台数は。",
    "options": [
      {
        "id": "a",
        "text": "各AZ2台、計6台",
        "explanation": "1AZ喪失後は4台が残り800件/秒となる。余裕の要否は実測で評価する。"
      },
      {
        "id": "b",
        "text": "各AZ3台、計9台",
        "explanation": "1AZ喪失後は6台が残り1200件/秒となる。"
      },
      {
        "id": "c",
        "text": "各AZ1台、計3台",
        "explanation": "1AZ喪失後は2台で400件/秒となる。"
      },
      {
        "id": "d",
        "text": "単一AZへ6台集約",
        "explanation": "平常時の容量はあってもそのAZの喪失で全停止する。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「各AZ2台、計6台」を選ぶ。1AZ喪失後は4台が残り800件/秒となる。余裕の要否は実測で評価する。",
    "sources": [
      {
        "title": "静的安定性と残存容量",
        "url": "https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_withstand_component_failures_static_stability.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-022",
    "chapterId": "ch04",
    "domain": 2,
    "conceptIds": [
      "health-check"
    ],
    "prompt": "ALBの一部ターゲットが異常、別AZの正常ターゲットには十分な容量がある。登録設定は正しい。通常の転送先は。",
    "options": [
      {
        "id": "a",
        "text": "正常なターゲットへ送る",
        "explanation": "正常な登録先がある場合のヘルスチェックに基づく転送である。"
      },
      {
        "id": "b",
        "text": "fail-openで異常ターゲットにも送る",
        "explanation": "全登録先が異常の場合にALBはfail-openとなる。"
      },
      {
        "id": "c",
        "text": "ALBがDBのバックアップを復元する",
        "explanation": "ヘルスチェックはDB復元を実施する機能ではない。"
      },
      {
        "id": "d",
        "text": "ALBだけでEC2台数が自動的に増える",
        "explanation": "負荷分散とAuto Scalingの容量調整は別に設定する。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「正常なターゲットへ送る」を選ぶ。正常な登録先がある場合のヘルスチェックに基づく転送である。",
    "sources": [
      {
        "title": "ALBヘルスチェック",
        "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-023",
    "chapterId": "ch06",
    "domain": 2,
    "conceptIds": [
      "rds-multi-az"
    ],
    "prompt": "PostgreSQLの単一DBインスタンスを、AZ障害時にマネージドの自動切替ができる構成へ変更したい。読み取り分散は不要。",
    "options": [
      {
        "id": "a",
        "text": "Multi-AZ DBインスタンス配置",
        "explanation": "別AZの同期スタンバイを維持し自動切替に備える。単一スタンバイは読取り用ではない。"
      },
      {
        "id": "b",
        "text": "読取り用のリードレプリカへレポートを向ける",
        "explanation": "非同期複製の遅延を許容する参照負荷を分散する。"
      },
      {
        "id": "c",
        "text": "毎日スナップショットだけ取る",
        "explanation": "履歴復旧には有効だが常時稼働の切替やSELECT処理先ではない。"
      },
      {
        "id": "d",
        "text": "DB名のDNS別名だけ追加する",
        "explanation": "実体のある待機DBや処理容量を用意しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「Multi-AZ DBインスタンス配置」を選ぶ。別AZの同期スタンバイを維持し自動切替に備える。単一スタンバイは読取り用ではない。",
    "sources": [
      {
        "title": "Multi-AZ DBインスタンス",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html",
        "checked": "2026-10-08"
      },
      {
        "title": "RDSリードレプリカ",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-024",
    "chapterId": "ch06",
    "domain": 2,
    "conceptIds": [
      "point-in-time-recovery"
    ],
    "prompt": "誤更新がMulti-AZの両側へ反映された。更新前へ戻すために既存の自動バックアップを使う。適切な方針は。",
    "options": [
      {
        "id": "a",
        "text": "指定時点の別DBへ復元し検証して接続を切り替える",
        "explanation": "誤更新前の状態へ戻すには履歴を復元し復元先を確認する。"
      },
      {
        "id": "b",
        "text": "スタンバイへの切替とアプリの再接続を確認する",
        "explanation": "正常な最新状態を別AZの待機先で引き継ぐ経路である。"
      },
      {
        "id": "c",
        "text": "同期レプリカには誤更新が伝わらないと考える",
        "explanation": "複製は業務上の正誤を識別しない。"
      },
      {
        "id": "d",
        "text": "Webの台数だけを増やす",
        "explanation": "DBの状態復元や切替先の準備にはならない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「指定時点の別DBへ復元し検証して接続を切り替える」を選ぶ。誤更新前の状態へ戻すには履歴を復元し復元先を確認する。",
    "sources": [
      {
        "title": "Multi-AZ DBインスタンス",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DR方式・IaC・復元検証",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-08"
      },
      {
        "title": "RDSの時点復元は新しいDBを作成する",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-025",
    "chapterId": "ch03",
    "domain": 2,
    "conceptIds": [
      "nat-gateway"
    ],
    "prompt": "2AZの非公開EC2がAZ-Aのゾーン型NATを共用する。Aの停止後もBから外部IPv4 APIへ接続するには。",
    "options": [
      {
        "id": "a",
        "text": "各AZのゾーン型NATへ同じAZの経路を向ける",
        "explanation": "外部IPv4への出口をAZごとに分け、別AZの出口停止から分離する。"
      },
      {
        "id": "b",
        "text": "両AZのルートをS3 Gateway endpointへ関連付ける",
        "explanation": "対象S3アクセスではNATを必要としない経路を利用できる。"
      },
      {
        "id": "c",
        "text": "S3 Gateway endpointで任意の外部APIも中継する",
        "explanation": "S3向け経路は外部APIへの出口にはならない。"
      },
      {
        "id": "d",
        "text": "BのCPUを倍増する",
        "explanation": "計算資源の変更は失われたネットワーク出口を復旧しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「各AZのゾーン型NATへ同じAZの経路を向ける」を選ぶ。外部IPv4への出口をAZごとに分け、別AZの出口停止から分離する。",
    "sources": [
      {
        "title": "NAT配置と可用性",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Gateway endpointの経路と費用",
        "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-026",
    "chapterId": "ch09",
    "domain": 2,
    "conceptIds": [
      "visibility-timeout"
    ],
    "prompt": "独自SQSワーカーの処理が通常90秒かかるのに可視性が30秒で、処理途中に別ワーカーが同じ注文を受け取る。まず行う対策は。",
    "options": [
      {
        "id": "a",
        "text": "処理時間に合わせ可視性を延長し必要ならハートビート更新する",
        "explanation": "短すぎる不可視期間による処理途中の再受信を抑える。冪等性は別途必要。"
      },
      {
        "id": "b",
        "text": "復旧待ち要件に合わせ過大な可視性を短縮する",
        "explanation": "障害後の再出現を遅らせ過ぎないよう実処理時間と合わせる。"
      },
      {
        "id": "c",
        "text": "処理前に必ずメッセージを削除する",
        "explanation": "途中停止で作業が失われるため安全な再処理にならない。"
      },
      {
        "id": "d",
        "text": "可視性だけで二重の業務更新が絶対起きないとする",
        "explanation": "再配信や削除失敗を考慮し業務の冪等性も必要。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「処理時間に合わせ可視性を延長し必要ならハートビート更新する」を選ぶ。短すぎる不可視期間による処理途中の再受信を抑える。冪等性は別途必要。",
    "sources": [
      {
        "title": "SQS可視性と再配信",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-027",
    "chapterId": "ch09",
    "domain": 2,
    "conceptIds": [
      "queue-scaling"
    ],
    "prompt": "到着150件/秒に対し処理100件/秒が4分続いた。処理を250件/秒へ増やし到着150件/秒が続く時、滞留解消に必要な時間は。",
    "options": [
      {
        "id": "a",
        "text": "120秒",
        "explanation": "到着継続なら差分250-150=100件/秒で12000件を減らす。"
      },
      {
        "id": "b",
        "text": "48秒",
        "explanation": "到着ゼロなら全能力250件/秒を滞留へ使える。"
      },
      {
        "id": "c",
        "text": "240秒",
        "explanation": "変更前の増加期間と増強後の解消時間は同じとは限らない。"
      },
      {
        "id": "d",
        "text": "無期限に解消しない",
        "explanation": "処理率が到着率を上回る条件では滞留は減る。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「120秒」を選ぶ。到着継続なら差分250-150=100件/秒で12000件を減らす。",
    "sources": [
      {
        "title": "SQS負荷とスケーリング",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-028",
    "chapterId": "ch09",
    "domain": 2,
    "conceptIds": [
      "dlq"
    ],
    "prompt": "形式不正のメッセージが繰返し失敗する。通常注文を進めつつ原因調査し、修正後に回復したい。対策を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "適切な受信回数でDLQへ隔離する",
        "explanation": "永続エラーを通常処理から分離する。隔離だけでは業務成功ではない。"
      },
      {
        "id": "b",
        "text": "原因修正後に流量を抑えて再投入し結果を照合する",
        "explanation": "再投入で同じ障害や下流過負荷を繰り返さない運用にする。"
      },
      {
        "id": "c",
        "text": "同じ業務IDによる決済の冪等性を設計する",
        "explanation": "再受信が新しい決済として二重実行されることを防ぐ。"
      },
      {
        "id": "d",
        "text": "保存済みの決済結果を確認してから処理完了と削除を行う",
        "explanation": "成功済み副作用を繰り返さず再処理を終える設計にする。"
      },
      {
        "id": "e",
        "text": "全エラーを成功扱いして削除する",
        "explanation": "未処理注文を失い業務の回復ができなくなる。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "本問では「適切な受信回数でDLQへ隔離する」「原因修正後に流量を抑えて再投入し結果を照合する」を選ぶ。永続エラーを通常処理から分離する。隔離だけでは業務成功ではない。 再投入で同じ障害や下流過負荷を繰り返さない運用にする。",
    "sources": [
      {
        "title": "SQS可視性と再配信",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DLQ保持と再投入",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-029",
    "chapterId": "ch09",
    "domain": 2,
    "conceptIds": [
      "fanout"
    ],
    "prompt": "1つの注文を請求と配送がそれぞれ必ず独立に受け、片方が停止しても他方は進めたい。選ぶ構成は。",
    "options": [
      {
        "id": "a",
        "text": "SNSから担当別SQSへ配信する",
        "explanation": "各担当にコピーと保持先を分け、処理速度や障害を分離できる。"
      },
      {
        "id": "b",
        "text": "1つのSQSを同種ワーカー群で受信する",
        "explanation": "競合するコンシューマーで作業を分担する方式。重複は考慮する。"
      },
      {
        "id": "c",
        "text": "1つのSQSを請求と配送が読み全件が両方へ届くとする",
        "explanation": "競合受信は担当それぞれへの全件配信にならない。"
      },
      {
        "id": "d",
        "text": "SNS通知のみで停止中の全業務処理が完了するとする",
        "explanation": "通知配送と実際の業務処理・保持の設計は別である。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「SNSから担当別SQSへ配信する」を選ぶ。各担当にコピーと保持先を分け、処理速度や障害を分離できる。",
    "sources": [
      {
        "title": "メッセージ基盤の選択",
        "url": "https://docs.aws.amazon.com/decision-guides/latest/decision-guides/sns-or-sqs-or-eventbridge.html",
        "checked": "2026-10-08"
      },
      {
        "title": "SQS可視性と再配信",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-030",
    "chapterId": "ch08",
    "domain": 2,
    "conceptIds": [
      "lambda-concurrency"
    ],
    "prompt": "SQSバーストで下流APIが過負荷になる。受付はキューへ蓄積できる。下流へ流す並列数を抑える設定は。",
    "options": [
      {
        "id": "a",
        "text": "SQS最大同時実行と関数の予約済み枠を整合させる",
        "explanation": "イベントソースから流す同時処理数を制約し下流を守る。"
      },
      {
        "id": "b",
        "text": "プロビジョニング済み同時実行を比較する",
        "explanation": "初期化済み環境で開始遅延を抑える候補で、下流流量制限とは役割が違う。"
      },
      {
        "id": "c",
        "text": "同時実行を無制限に増やす",
        "explanation": "下流の上限を超える負荷には逆効果となる。"
      },
      {
        "id": "d",
        "text": "メッセージを受信前に削除する",
        "explanation": "正常な受付と業務処理を失う対処である。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「SQS最大同時実行と関数の予約済み枠を整合させる」を選ぶ。イベントソースから流す同時処理数を制約し下流を守る。",
    "sources": [
      {
        "title": "SQSイベントソースの同時実行",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Lambda方式別の上限",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html",
        "checked": "2026-10-08"
      },
      {
        "title": "初期化済み実行環境と予約済み枠の区別",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-031",
    "chapterId": "ch08",
    "domain": 2,
    "conceptIds": [
      "idempotency"
    ],
    "prompt": "SQSバッチ10件のうち1件だけ失敗する。成功済み9件の不要な再試行を減らしたい。機能は。",
    "options": [
      {
        "id": "a",
        "text": "失敗項目IDを返す部分バッチ応答",
        "explanation": "失敗項目だけの再処理へ絞るための機能である。"
      },
      {
        "id": "b",
        "text": "業務IDを用いた原子的な処理済み判定と冪等性",
        "explanation": "イベントが再配信されても業務の副作用を重ねないための設計である。"
      },
      {
        "id": "c",
        "text": "成功項目も毎回すべて再実行する",
        "explanation": "不要な再処理と二重副作用の可能性を増やす。"
      },
      {
        "id": "d",
        "text": "失敗項目を理由なしに破棄する",
        "explanation": "復旧対象を失い必要な処理が完了しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「失敗項目IDを返す部分バッチ応答」を選ぶ。失敗項目だけの再処理へ絞るための機能である。",
    "sources": [
      {
        "title": "SQS部分バッチ応答",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html",
        "checked": "2026-10-08"
      },
      {
        "title": "SQS可視性と再配信",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-032",
    "chapterId": "ch11",
    "domain": 2,
    "conceptIds": [
      "rto"
    ],
    "prompt": "RTO45分・RPO10分。候補Aは検知5分＋復元70分＋切替10分、バックアップ間隔24時間。妥当な評価は。",
    "options": [
      {
        "id": "a",
        "text": "今回の構成は両要件を満たさない",
        "explanation": "復旧85分は45分を超え、日次バックアップの損失幅も10分を超え得る。"
      },
      {
        "id": "b",
        "text": "今回の訓練では両要件を満たす",
        "explanation": "復旧35分、損失幅3分で要求内。ただし将来の保証ではなく再検証が必要。"
      },
      {
        "id": "c",
        "text": "RTOとRPOは同じ値なので片方だけ測る",
        "explanation": "時間軸が異なり復旧時間とデータ損失幅を別に評価する。"
      },
      {
        "id": "d",
        "text": "DNS切替だけを測れば全復旧時間になる",
        "explanation": "データ復旧や起動、検証の時間も含める必要がある。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「今回の構成は両要件を満たさない」を選ぶ。復旧85分は45分を超え、日次バックアップの損失幅も10分を超え得る。",
    "sources": [
      {
        "title": "DR方式・IaC・復元検証",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-033",
    "chapterId": "ch11",
    "domain": 2,
    "conceptIds": [
      "pilot-light"
    ],
    "prompt": "低い平常時費用を重視し、復旧時のアプリ起動時間を許容する。DB等の中核は継続稼働・複製するがアプリは起動していない。方式は。",
    "options": [
      {
        "id": "a",
        "text": "パイロットライト",
        "explanation": "中核を維持して復旧時に追加部分を起動する方式である。"
      },
      {
        "id": "b",
        "text": "ウォームスタンバイ",
        "explanation": "縮小した全体を維持して本番負荷へ拡張する方式である。"
      },
      {
        "id": "c",
        "text": "バックアップ・リストアだけ",
        "explanation": "継続稼働する中核や縮小系のある前提とは異なる。"
      },
      {
        "id": "d",
        "text": "全拠点で常時全量処理するアクティブ／アクティブ",
        "explanation": "待機系を主に使う前提とは異なる。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「パイロットライト」を選ぶ。中核を維持して復旧時に追加部分を起動する方式である。",
    "sources": [
      {
        "title": "DR方式・IaC・復元検証",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-034",
    "chapterId": "ch11",
    "domain": 2,
    "conceptIds": [
      "recovery-quota"
    ],
    "prompt": "復旧リージョンへ50台を追加したいがアカウントのvCPU上限が足りない。障害前に必要な準備は。",
    "options": [
      {
        "id": "a",
        "text": "必要なサービスクォータを確認し余裕を確保する",
        "explanation": "アカウントの利用上限に備える。実容量の予約と同じではない。"
      },
      {
        "id": "b",
        "text": "一致する属性のCapacity Reservation等を事前確保する",
        "explanation": "指定されたAZと属性の計算容量を確保する候補である。"
      },
      {
        "id": "c",
        "text": "Savings Plansだけ購入する",
        "explanation": "料金の割引はアカウント上限増加や指定容量の確保ではない。"
      },
      {
        "id": "d",
        "text": "CloudFormationテンプレートの名前だけ変える",
        "explanation": "定義の名称を変えても上限や実容量は増えない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「必要なサービスクォータを確認し余裕を確保する」を選ぶ。アカウントの利用上限に備える。実容量の予約と同じではない。",
    "sources": [
      {
        "title": "復旧先のクォータ余裕",
        "url": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_manage_service_limits_suff_buffer_limits.html",
        "checked": "2026-10-08"
      },
      {
        "title": "容量予約の役割",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-035",
    "chapterId": "ch11",
    "domain": 2,
    "conceptIds": [
      "restore-test"
    ],
    "prompt": "暗号化バックアップの復元権限、KMSキーの利用可能性、秘密情報の取得権限と到達性は復旧先で検証済み。しかしSGとアプリ用ロールを手作業で再作成し、構成漏れで業務再開が遅れる。未解決の設定再現性と業務再開時間を改善する施策を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "インフラ設定をIaC化し、対応するアプリの版と一緒に管理する",
        "explanation": "SG・ロール等の必要設定を再現可能にし、手作業による構成漏れを抑える。"
      },
      {
        "id": "b",
        "text": "IaCを使う復旧訓練で業務処理が再開するまでを計測する",
        "explanation": "作成成功だけでなく依存先接続と業務再開までの実時間を検証し、漏れを発見する。"
      },
      {
        "id": "c",
        "text": "検証済みのKMS復号権限の確認だけを繰り返す",
        "explanation": "KMS権限は必要な確認事項だが本問では検証済み。SG・アプリ用ロールの再現性や業務再開時間を改善しない。"
      },
      {
        "id": "d",
        "text": "検証済みの秘密情報の取得テストだけを追加する",
        "explanation": "秘密情報の権限・到達性は確認済みであり、未解決の手動構築の漏れと全体の復旧時間を検証できない。"
      },
      {
        "id": "e",
        "text": "バックアップの保存頻度だけを上げる",
        "explanation": "復旧時点は改善できるが、SGやロールを再作成する手順の再現性は改善しない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "確認済みの鍵・秘密情報を再確認すること自体は正しい。しかし今回残る問題は構成の再現と業務再開の検証なので、IaCと実測訓練を組み合わせる。",
    "sources": [
      {
        "title": "DR方式・IaC・復元検証",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-08"
      },
      {
        "title": "KMS削除と復号",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html",
        "checked": "2026-10-08"
      },
      {
        "title": "秘密情報ローテーション",
        "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-036",
    "chapterId": "ch01",
    "domain": 2,
    "conceptIds": [
      "region"
    ],
    "prompt": "単一リージョンが全面停止しても別の場所で再開したい。既に同一リージョンの複数AZは使う。次に必要な範囲は。",
    "options": [
      {
        "id": "a",
        "text": "別リージョンのデータ・容量・切替経路を用意する",
        "explanation": "リージョン全体の障害の外側へ復旧先を確保する。"
      },
      {
        "id": "b",
        "text": "同一リージョンの複数AZに配置し正常先へ切り替える",
        "explanation": "AZ単位の障害を分離する構成。データと残存容量も必要。"
      },
      {
        "id": "c",
        "text": "同一AZの同じサブネットへ台数だけ増やす",
        "explanation": "同じAZ障害を共有するため指定の分離にはならない。"
      },
      {
        "id": "d",
        "text": "リソースの名前へ予備と付ける",
        "explanation": "名称だけでは実体のある復旧先を用意しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「別リージョンのデータ・容量・切替経路を用意する」を選ぶ。リージョン全体の障害の外側へ復旧先を確保する。",
    "sources": [
      {
        "title": "静的安定性と残存容量",
        "url": "https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_withstand_component_failures_static_stability.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DR方式・IaC・復元検証",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-037",
    "chapterId": "ch10",
    "domain": 2,
    "conceptIds": [
      "tracing"
    ],
    "prompt": "注文APIのp95が悪化した。リクエストが通る複数サービスのどこで時間を費やすかを特定したい。必要な観測は。",
    "options": [
      {
        "id": "a",
        "text": "分散トレースの依存区間と処理時間",
        "explanation": "要求をサービス間で追跡し遅い区間を調査する。"
      },
      {
        "id": "b",
        "text": "CloudWatch等のメトリクスとアラーム",
        "explanation": "集計した稼働状態や時間的な変化を捉える。"
      },
      {
        "id": "c",
        "text": "CloudTrailのログイン履歴だけ",
        "explanation": "管理主体の記録だけでは処理中の各区間の時間を示さない。"
      },
      {
        "id": "d",
        "text": "バックアップの保持期間だけ",
        "explanation": "性能悪化の時刻や依存先の処理時間を観測しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「分散トレースの依存区間と処理時間」を選ぶ。要求をサービス間で追跡し遅い区間を調査する。",
    "sources": [
      {
        "title": "CloudWatchの運用観測",
        "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
        "checked": "2026-10-08"
      },
      {
        "title": "要求経路の分散トレース",
        "url": "https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-038",
    "chapterId": "ch04",
    "domain": 3,
    "conceptIds": [
      "instance-family"
    ],
    "prompt": "変換処理のCPUは継続95%、メモリとI/Oには余裕があり、コードは複数コアを使える。まず比較する資源は。",
    "options": [
      {
        "id": "a",
        "text": "必要CPU性能を持つコンピューティング最適化EC2",
        "explanation": "CPUがボトルネックの場合の候補で、実測して性能と費用を比較する。"
      },
      {
        "id": "b",
        "text": "作業集合を収容できるメモリ最適化EC2",
        "explanation": "メモリ不足を解消する候補。CPUだけの増加では不足が残り得る。"
      },
      {
        "id": "c",
        "text": "同じ容量のまま購入割引だけ変更する",
        "explanation": "単価は変わってもボトルネックの資源量は変わらない。"
      },
      {
        "id": "d",
        "text": "平均CPUだけを見て最小サイズへ縮小する",
        "explanation": "ピークとメモリ・I/Oの制約を確認しない縮小は遅延を悪化させる。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「必要CPU性能を持つコンピューティング最適化EC2」を選ぶ。CPUがボトルネックの場合の候補で、実測して性能と費用を比較する。",
    "sources": [
      {
        "title": "EC2資源特性",
        "url": "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-039",
    "chapterId": "ch05",
    "domain": 3,
    "conceptIds": [
      "storage-performance"
    ],
    "prompt": "ブロックI/Oは16KiBを毎秒16000回要求する。転送量の計算だけに注目すると必要帯域は。",
    "options": [
      {
        "id": "a",
        "text": "250MiB/秒",
        "explanation": "16×16000÷1024=250。KiBとMiBを区別する。"
      },
      {
        "id": "b",
        "text": "500MiB/秒",
        "explanation": "256×2000÷1024=500。回数だけでは帯域要求を比較できない。"
      },
      {
        "id": "c",
        "text": "16MiB/秒",
        "explanation": "I/Oサイズと毎秒回数の積を計算していない。"
      },
      {
        "id": "d",
        "text": "IOPSの値だけでは転送量が絶対に計算できない",
        "explanation": "I/Oサイズも与えられているため積から計算できる。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「250MiB/秒」を選ぶ。16×16000÷1024=250。KiBとMiBを区別する。",
    "sources": [
      {
        "title": "gp3性能設定",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-040",
    "chapterId": "ch05",
    "domain": 3,
    "conceptIds": [
      "gp3"
    ],
    "prompt": "200GiBで足りる汎用ブロック保存に、容量とは別にIOPSと転送量を設定したい。最初に比較するタイプは。",
    "options": [
      {
        "id": "a",
        "text": "gp3",
        "explanation": "容量とIOPS・スループットを独立して設定する汎用SSD。"
      },
      {
        "id": "b",
        "text": "io2 Block Express",
        "explanation": "厳しい遅延・IOPS条件のワークロード向け候補。費用とEC2上限も比較する。"
      },
      {
        "id": "c",
        "text": "sc1",
        "explanation": "低頻度のスループット志向HDDで、厳しいランダムI/O要件と異なる。"
      },
      {
        "id": "d",
        "text": "st1",
        "explanation": "連続転送中心のHDDで、汎用SSDや厳しい低遅延の要求とは異なる。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「gp3」を選ぶ。容量とIOPS・スループットを独立して設定する汎用SSD。",
    "sources": [
      {
        "title": "gp3性能設定",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
        "checked": "2026-10-08"
      },
      {
        "title": "io2の性能用途",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-041",
    "chapterId": "ch05",
    "domain": 3,
    "conceptIds": [
      "efs"
    ],
    "prompt": "複数AZのLinuxコンテナが同じNFSファイルへアクセスする。自前ファイルサーバーを減らしたい。候補は。",
    "options": [
      {
        "id": "a",
        "text": "Regional EFSを各AZのマウントターゲットから利用",
        "explanation": "共有NFSの要件に合う。通信許可と性能モードを設計する。"
      },
      {
        "id": "b",
        "text": "要件に合うEBS SSDをEC2へ接続",
        "explanation": "EC2のブロックI/O向け。一般的な複数AZ共有ファイルとは異なる。"
      },
      {
        "id": "c",
        "text": "S3を無変更でPOSIXブロックデバイスとして扱う",
        "explanation": "オブジェクトAPIはブロックやNFSと同じインターフェイスではない。"
      },
      {
        "id": "d",
        "text": "各コンテナの一時領域だけで共有する",
        "explanation": "複数環境からの共有正本や永続性を満たさない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「Regional EFSを各AZのマウントターゲットから利用」を選ぶ。共有NFSの要件に合う。通信許可と性能モードを設計する。",
    "sources": [
      {
        "title": "EFS性能モード",
        "url": "https://docs.aws.amazon.com/efs/latest/ug/performance.html",
        "checked": "2026-10-08"
      },
      {
        "title": "gp3性能設定",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-042",
    "chapterId": "ch06",
    "domain": 3,
    "conceptIds": [
      "database-selection"
    ],
    "prompt": "決済アプリは既存PostgreSQLの複数表JOINを維持する必要がある。移行時のアプリ改修を抑える候補は。",
    "options": [
      {
        "id": "a",
        "text": "RDS PostgreSQLやAurora PostgreSQL互換を比較",
        "explanation": "リレーショナルなアクセスと互換性を保つ候補。個別機能の互換性は検証する。"
      },
      {
        "id": "b",
        "text": "DynamoDBのキーと容量方式を設計",
        "explanation": "キー中心のアクセスと管理された拡張に向く候補。任意JOINの移植ではない。"
      },
      {
        "id": "c",
        "text": "S3のCSVファイルだけで既存DBトランザクションを代替",
        "explanation": "保存APIの変更だけでは既存のトランザクションやJOINを維持しない。"
      },
      {
        "id": "d",
        "text": "キャッシュだけを正本にしてDBを削除する",
        "explanation": "永続性と整合性を満たす正本の設計を省略している。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「RDS PostgreSQLやAurora PostgreSQL互換を比較」を選ぶ。リレーショナルなアクセスと互換性を保つ候補。個別機能の互換性は検証する。",
    "sources": [
      {
        "title": "DBデータモデル選択",
        "url": "https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/db-selection.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DynamoDB容量課金",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-043",
    "chapterId": "ch06",
    "domain": 3,
    "conceptIds": [
      "consistency"
    ],
    "prompt": "DynamoDBの注文IDで書込み成功直後の値をテーブルから確認する。適切な読取りは。",
    "options": [
      {
        "id": "a",
        "text": "テーブルの強い整合性読取り",
        "explanation": "成功済みの書込みを反映した読取りを求める場合に選べる。"
      },
      {
        "id": "b",
        "text": "結果整合性読取り",
        "explanation": "直後の古い値を許容する代わりに読取り費用を抑えられる。"
      },
      {
        "id": "c",
        "text": "GSIの強い整合性読取り",
        "explanation": "GSIは強い整合性に対応しない。"
      },
      {
        "id": "d",
        "text": "Scanなら設定に関係なく常に最新とする",
        "explanation": "QueryやScanの種類だけで整合性は決まらない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「テーブルの強い整合性読取り」を選ぶ。成功済みの書込みを反映した読取りを求める場合に選べる。",
    "sources": [
      {
        "title": "DynamoDB整合性",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-044",
    "chapterId": "ch06",
    "domain": 3,
    "conceptIds": [
      "read-replica"
    ],
    "prompt": "SQLの分析SELECTが本番RDSのCPUを圧迫している。数秒古い値を許容し、SQL自体を変更せず分離したい。選択は。",
    "options": [
      {
        "id": "a",
        "text": "分析SELECTをリードレプリカへ向ける",
        "explanation": "遅延を許容する読取り負荷をプライマリから分離できる。"
      },
      {
        "id": "b",
        "text": "最新値が必要な処理は適切なプライマリへ向ける",
        "explanation": "非同期レプリカの遅延を避け、トランザクション条件も確認する。"
      },
      {
        "id": "c",
        "text": "Multi-AZ DBインスタンスの単一スタンバイへSELECTする",
        "explanation": "このスタンバイは通常の読取り処理を提供しない。"
      },
      {
        "id": "d",
        "text": "DBへ接続せず古いキャッシュだけを永久に読む",
        "explanation": "鮮度要件を持つデータを更新せず使い続けることになる。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「分析SELECTをリードレプリカへ向ける」を選ぶ。遅延を許容する読取り負荷をプライマリから分離できる。",
    "sources": [
      {
        "title": "RDSリードレプリカ",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Multi-AZ DBインスタンス",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-045",
    "chapterId": "ch08",
    "domain": 3,
    "conceptIds": [
      "lambda-memory"
    ],
    "prompt": "標準LambdaのCPU中心処理でp95が目標を超えている。メモリには余裕があるが、メモリ変更に伴うCPU配分で実行時間が変わるかは未測定。性能目標を満たす設定の費用を比較するため、最初に行う測定は。",
    "options": [
      {
        "id": "a",
        "text": "同じ負荷と実行回数で複数メモリ設定の実行時間・p95・費用を測る",
        "explanation": "CPU配分により時間が短縮する可能性を実測し、性能を満たした候補の総額を比較する。"
      },
      {
        "id": "b",
        "text": "実行時間が変わらないと仮定し、メモリ時間積だけで元設定へ戻す",
        "explanation": "時間が同じなら費用増となる説明は正しいが、本問では時間変化が未測定で、元設定はp95要件を満たしていない。"
      },
      {
        "id": "c",
        "text": "実行時間だけが最短の設定を採り、費用は比較しない",
        "explanation": "性能改善は確認できるが、要求された性能を満たす候補間の費用比較を省いている。"
      },
      {
        "id": "d",
        "text": "メモリ設定は維持し、タイムアウトだけを上げてp95を再評価する",
        "explanation": "処理を長く待てるようにしてもCPU配分は増えず、p95の短縮策を比較できない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "時間変化が未知の段階では測定が必要。時間一定という条件下の費用説明を、まだ測っていない設定変更へ無条件で適用しない。",
    "sources": [
      {
        "title": "LambdaメモリとCPU",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Lambda方式別の上限",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-046",
    "chapterId": "ch08",
    "domain": 3,
    "conceptIds": [
      "lambda"
    ],
    "prompt": "ファイル到着時だけ4秒の変換コードを実行し、サーバー管理を避けたい。Managed Instancesを使わない標準実行でもよい。候補は。",
    "options": [
      {
        "id": "a",
        "text": "標準Lambdaのイベント起動",
        "explanation": "短いイベント処理に向き、実行時間等の制約内で利用する。"
      },
      {
        "id": "b",
        "text": "ECS/Fargateタスク",
        "explanation": "必要CPU・メモリを満たすコンテナで長時間処理を行う候補。"
      },
      {
        "id": "c",
        "text": "標準Lambdaの1回タイムアウトを50分へ設定",
        "explanation": "標準実行の900秒上限を超える設定にはできない。"
      },
      {
        "id": "d",
        "text": "ECRへ保存すれば処理は自動的に実行されるとする",
        "explanation": "イメージ保管とタスク実行は別の機能である。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「標準Lambdaのイベント起動」を選ぶ。短いイベント処理に向き、実行時間等の制約内で利用する。",
    "sources": [
      {
        "title": "Lambda方式別の上限",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html",
        "checked": "2026-10-08"
      },
      {
        "title": "EC2資源特性",
        "url": "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Fargateのホスト管理範囲",
        "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-047",
    "chapterId": "ch07",
    "domain": 3,
    "conceptIds": [
      "global-accelerator"
    ],
    "prompt": "世界からTCP/UDPで同じアプリへ接続する。固定IPを相手先許可リストへ登録し、正常なリージョンへ送る入口を求める。候補は。",
    "options": [
      {
        "id": "a",
        "text": "Global Accelerator",
        "explanation": "固定IPとAWSネットワークによる正常な到達先選択を提供する。画像キャッシュではない。"
      },
      {
        "id": "b",
        "text": "CloudFront",
        "explanation": "HTTPコンテンツのエッジ配信とキャッシュを利用する。汎用UDPの入口ではない。"
      },
      {
        "id": "c",
        "text": "Route 53のレイテンシールーティングで各リージョンのNLB名へ案内する",
        "explanation": "TCP/UDPのNLBへDNSで案内できるが、固定された共通の入口IPという条件を満たさない。"
      },
      {
        "id": "d",
        "text": "1リージョンのNLBへElastic IPを割り当て、遠隔地から直接接続する",
        "explanation": "単一リージョンの固定入口にはなるが、複数リージョンへの正常先選択を持たない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「Global Accelerator」を選ぶ。固定IPとAWSネットワークによる正常な到達先選択を提供する。画像キャッシュではない。",
    "sources": [
      {
        "title": "固定IPによる配信経路",
        "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html",
        "checked": "2026-10-08"
      },
      {
        "title": "CDN鮮度と要求削減",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-048",
    "chapterId": "ch12",
    "domain": 3,
    "conceptIds": [
      "analytics-pipeline"
    ],
    "prompt": "各イベントを複数処理者が独立に読み、過去48時間を再読込したい。秒単位の処理を設計する基盤は。",
    "options": [
      {
        "id": "a",
        "text": "Kinesis Data Streamsで保持とコンシューマーを設計",
        "explanation": "独立した読取りと設定保持期間内の再読込に対応する。"
      },
      {
        "id": "b",
        "text": "Data FirehoseのS3配信",
        "explanation": "対応する宛先へのバッファ配信の運用を減らす。"
      },
      {
        "id": "c",
        "text": "単一SQSで全担当に必ず同じ全件を配る",
        "explanation": "競合受信は全担当への独立配信やストリーム再読込とは違う。"
      },
      {
        "id": "d",
        "text": "年1回のバックアップだけ",
        "explanation": "秒単位の取り込みや継続配信に対応しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「Kinesis Data Streamsで保持とコンシューマーを設計」を選ぶ。独立した読取りと設定保持期間内の再読込に対応する。",
    "sources": [
      {
        "title": "ストリームの保持と処理者",
        "url": "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html",
        "checked": "2026-10-08"
      },
      {
        "title": "バッファ配信",
        "url": "https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html",
        "checked": "2026-10-08"
      },
      {
        "title": "SQS可視性と再配信",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-049",
    "chapterId": "ch12",
    "domain": 3,
    "conceptIds": [
      "athena"
    ],
    "prompt": "S3上の10年分ログから直近1日の特定列だけをSQLで読む。読込み量を減らす設定を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "日付パーティションを利用しWHEREで対象を絞る",
        "explanation": "不要な期間の走査を減らせる。"
      },
      {
        "id": "b",
        "text": "列指向形式で必要列だけを読む",
        "explanation": "SELECT *を避け、列単位の読込みを減らせる。"
      },
      {
        "id": "c",
        "text": "Lake Formation等と必要IAM/S3権限を設定する",
        "explanation": "データレイクへのアクセスを業務範囲へ絞る。"
      },
      {
        "id": "d",
        "text": "可視化側の取込・更新間隔を鮮度要件に合わせる",
        "explanation": "保存済みデータの時刻と画面更新時刻を区別する。"
      },
      {
        "id": "e",
        "text": "全期間を走査して画面だけで1日に絞る",
        "explanation": "クエリで読む量は減らず、表示の絞込みとは別である。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "本問では「日付パーティションを利用しWHEREで対象を絞る」「列指向形式で必要列だけを読む」を選ぶ。不要な期間の走査を減らせる。 SELECT *を避け、列単位の読込みを減らせる。",
    "sources": [
      {
        "title": "スキャン量最適化",
        "url": "https://docs.aws.amazon.com/athena/latest/ug/performance-tuning-data-optimization-techniques.html",
        "checked": "2026-10-08"
      },
      {
        "title": "データレイク権限",
        "url": "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-050",
    "chapterId": "ch11",
    "domain": 3,
    "conceptIds": [
      "datasync"
    ],
    "prompt": "拠点のNFS上の研究ファイルをS3へ初回転送し、その後は差分を移して移行を完了したい。適したサービスは。",
    "options": [
      {
        "id": "a",
        "text": "AWS DataSync",
        "explanation": "対応ファイル・オブジェクト保存先への転送と移行のためのサービス。"
      },
      {
        "id": "b",
        "text": "S3 File Gateway",
        "explanation": "既存NFS/SMBからS3へアクセスし、キャッシュとアップロードを使う。"
      },
      {
        "id": "c",
        "text": "DMS CDC",
        "explanation": "DBの変更データ移行が中心でNFSファイル移行と異なる。"
      },
      {
        "id": "d",
        "text": "S3 Lifecycleだけ",
        "explanation": "保管済みオブジェクトの管理で拠点ファイルの転送機構ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「AWS DataSync」を選ぶ。対応ファイル・オブジェクト保存先への転送と移行のためのサービス。",
    "sources": [
      {
        "title": "ファイルの転送",
        "url": "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html",
        "checked": "2026-10-08"
      },
      {
        "title": "NFS/SMBとS3",
        "url": "https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DB移行とCDC",
        "url": "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-051",
    "chapterId": "ch11",
    "domain": 3,
    "conceptIds": [
      "cdc"
    ],
    "prompt": "稼働中のDBを別エンジンへ移行し、切替停止を短くするため初期ロード後の更新を追随したい。候補は。",
    "options": [
      {
        "id": "a",
        "text": "DMSの初期ロードとCDCを使いスキーマ・アプリ互換も検証",
        "explanation": "変更データを追随するが全アプリ改修を自動解決するものではない。"
      },
      {
        "id": "b",
        "text": "DataSyncで転送と検証を実施",
        "explanation": "ファイル・オブジェクト移行に向き、DBトランザクションCDCとは異なる。"
      },
      {
        "id": "c",
        "text": "DNSを新DBへ向けるだけ",
        "explanation": "既存データや差分の移行と整合性検証が欠ける。"
      },
      {
        "id": "d",
        "text": "バックアップ保持期間を短くするだけ",
        "explanation": "移行先へ必要なデータを転送する処理にはならない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「DMSの初期ロードとCDCを使いスキーマ・アプリ互換も検証」を選ぶ。変更データを追随するが全アプリ改修を自動解決するものではない。",
    "sources": [
      {
        "title": "DB移行とCDC",
        "url": "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html",
        "checked": "2026-10-08"
      },
      {
        "title": "ファイルの転送",
        "url": "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-052",
    "chapterId": "ch07",
    "domain": 3,
    "conceptIds": [
      "cloudfront"
    ],
    "prompt": "公開の商品画像はURLごとに不変で、更新時は新URLを配る。個人情報は含まれず、CloudFrontで多くの利用者が同じ画像を取得する。オリジンへのアクセスを減らしながら新版を正しく取得させる設定は。",
    "options": [
      {
        "id": "a",
        "text": "共有可能な画像に適切な長いTTLと版付きURLを使う",
        "explanation": "不変のコンテンツを再利用し鮮度はURLの版で分けられる。"
      },
      {
        "id": "b",
        "text": "すべての画像でキャッシュを無効にし、取得ごとにオリジンへ問い合わせる",
        "explanation": "鮮度は保てるが、不変の公開画像を再利用できず、要求されたオリジンアクセス削減を満たさない。"
      },
      {
        "id": "c",
        "text": "内容に影響しない利用者別Cookieもすべてキャッシュキーへ含める",
        "explanation": "同じ公開画像でもキーが分かれて共有しにくくなり、不要なオリジン要求が残る。"
      },
      {
        "id": "d",
        "text": "同じURLの画像を上書きし、長いTTLのまま無効化も版変更もしない",
        "explanation": "キャッシュ中の旧画像が残り、新版を正しく取得させる条件を満たさない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「共有可能な画像に適切な長いTTLと版付きURLを使う」を選ぶ。不変のコンテンツを再利用し鮮度はURLの版で分けられる。",
    "sources": [
      {
        "title": "CDN鮮度と要求削減",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-053",
    "chapterId": "ch04",
    "domain": 4,
    "conceptIds": [
      "spot"
    ],
    "prompt": "遅くとも翌週までに終わればよい再開可能なレンダリング処理で、チェックポイントと再投入は実装済み。安い余剰容量を使う候補は。",
    "options": [
      {
        "id": "a",
        "text": "Spotを使い中断と容量不足へ再投入で対応する",
        "explanation": "実行時刻と中断に柔軟な処理で費用削減を検討できる。"
      },
      {
        "id": "b",
        "text": "必要なオンデマンド容量を用意して実測時間を確認する",
        "explanation": "Spotの都合による中断を避ける候補。インスタンス障害対策は別途必要。"
      },
      {
        "id": "c",
        "text": "Savings Plans購入だけで1回の処理の容量を保証する",
        "explanation": "割引契約は容量保証ではなく短期1回だけなら未消化にも注意。"
      },
      {
        "id": "d",
        "text": "全実行を中断可能な容量だけにして期限を保証する",
        "explanation": "再開不可と厳しい期限の条件を満たす根拠がない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「Spotを使い中断と容量不足へ再投入で対応する」を選ぶ。実行時刻と中断に柔軟な処理で費用削減を検討できる。",
    "sources": [
      {
        "title": "Spotの中断と容量",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html",
        "checked": "2026-10-08"
      },
      {
        "title": "容量予約の役割",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-054",
    "chapterId": "ch06",
    "domain": 4,
    "conceptIds": [
      "dynamodb-on-demand"
    ],
    "prompt": "新サービスはアクセス予測が難しく、週末以外はほぼ使われない。固定RCU/WCUの計画を避ける容量方式は。",
    "options": [
      {
        "id": "a",
        "text": "オンデマンド容量",
        "explanation": "要求ベースで課金し事前の固定スループット設定を減らす。"
      },
      {
        "id": "b",
        "text": "プロビジョンド容量",
        "explanation": "設定した読書き容量へ課金する。予測可能な負荷で余剰と追従を比較する。"
      },
      {
        "id": "c",
        "text": "要求がなくても常に最大容量を固定する",
        "explanation": "需要の少ない時間に無駄が出るため無条件で最安とは言えない。"
      },
      {
        "id": "d",
        "text": "容量方式ではキー偏りも無条件でなくなるとする",
        "explanation": "いずれの方式でもアクセス集中や制限への設計は必要。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「オンデマンド容量」を選ぶ。要求ベースで課金し事前の固定スループット設定を減らす。",
    "sources": [
      {
        "title": "DynamoDB容量課金",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-055",
    "chapterId": "ch12",
    "domain": 4,
    "conceptIds": [
      "database-cost"
    ],
    "prompt": "学習用の月額見積りでAurora候補Aは実行保存80単位＋I/O70単位、Bは実行保存120単位でI/O別料金なし。同じ要件を満たす。安い方は。",
    "options": [
      {
        "id": "a",
        "text": "Bが30単位安い",
        "explanation": "Aの総額150とBの120を比較した場合の結果。"
      },
      {
        "id": "b",
        "text": "Aが35単位安い",
        "explanation": "Aは80＋70＝150で、Bの120より30高い。Aが35安いという計算にはならない。"
      },
      {
        "id": "c",
        "text": "費用差はないので、どちらでもよい",
        "explanation": "提示された実行保存額とI/O額を加算すると総額は異なる。"
      },
      {
        "id": "d",
        "text": "Aが40単位安い",
        "explanation": "実行保存の80と120だけの差であり、AのI/O費を加算していない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「Bが30単位安い」を選ぶ。Aの総額150とBの120を比較した場合の結果。",
    "sources": [
      {
        "title": "Aurora費用要因",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/User_DBInstanceBilling.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-056",
    "chapterId": "ch03",
    "domain": 4,
    "conceptIds": [
      "network-cost"
    ],
    "prompt": "2AZで共有NATから各AZのNATへ変更する仮定。追加固定費50単位、回避するAZ間費80単位。他は同じ。月額差は。",
    "options": [
      {
        "id": "a",
        "text": "30単位減る",
        "explanation": "追加50から削減80を引くと-30になる。"
      },
      {
        "id": "b",
        "text": "30単位増える",
        "explanation": "追加50から削減20を引くと+30になる。"
      },
      {
        "id": "c",
        "text": "台数が増えるので転送量に関係なく常に50だけ増える",
        "explanation": "回避できる通信費を落としている。"
      },
      {
        "id": "d",
        "text": "共有か分散かだけで、条件なしに常に片方が安い",
        "explanation": "稼働時間・通信量・経路によって費用の大小は変わる。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「30単位減る」を選ぶ。追加50から削減80を引くと-30になる。",
    "sources": [
      {
        "title": "NAT費用要因",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-057",
    "chapterId": "ch03",
    "domain": 4,
    "conceptIds": [
      "vpc-endpoint"
    ],
    "prompt": "同一リージョンS3への大量通信がNATの処理量を占める。ネットワーク経路を変え要求量を保ったまま処理費を減らしたい。最初の候補は。",
    "options": [
      {
        "id": "a",
        "text": "S3 Gateway endpointを対象ルートへ関連付ける",
        "explanation": "対象S3通信をNATから外しエンドポイント自体の追加課金もない。"
      },
      {
        "id": "b",
        "text": "各AZの適切なNAT経路を維持し通信量を最適化する",
        "explanation": "任意の外部APIにはS3 endpointを代用できず出口の可用性も必要。"
      },
      {
        "id": "c",
        "text": "S3 Gateway endpointを外部決済の出口にする",
        "explanation": "対応先が違い任意のインターネットへ中継できない。"
      },
      {
        "id": "d",
        "text": "NATをすべて削除し必要経路を用意しない",
        "explanation": "費用は減っても必要な業務通信を維持できない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「S3 Gateway endpointを対象ルートへ関連付ける」を選ぶ。対象S3通信をNATから外しエンドポイント自体の追加課金もない。",
    "sources": [
      {
        "title": "Gateway endpointの経路と費用",
        "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html",
        "checked": "2026-10-08"
      },
      {
        "title": "NAT費用要因",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html",
        "checked": "2026-10-08"
      },
      {
        "title": "NAT配置と可用性",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-058",
    "chapterId": "ch05",
    "domain": 4,
    "conceptIds": [
      "storage-cost"
    ],
    "prompt": "監査記録は長期保持でめったに読まず、復元を1日待てる。保持義務を守って保存費を下げる候補は。",
    "options": [
      {
        "id": "a",
        "text": "S3 Glacier Deep Archiveを復元費等も含め比較する",
        "explanation": "長期保存と待ち時間を許容する場合の候補。即時取得には不適合。"
      },
      {
        "id": "b",
        "text": "S3 Standard-IA等の即時取得階層を比較する",
        "explanation": "低頻度でも即時取得を求める時に、取得費や最低期間を含めて比較する。"
      },
      {
        "id": "c",
        "text": "保存費だけを見てすべて同じ最安階層へ移す",
        "explanation": "復元待ちや取得頻度を満たさない可能性がある。"
      },
      {
        "id": "d",
        "text": "法定保持期間前に削除する",
        "explanation": "費用以外の必須条件である保持義務に反する。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「S3 Glacier Deep Archiveを復元費等も含め比較する」を選ぶ。長期保存と待ち時間を許容する場合の候補。即時取得には不適合。",
    "sources": [
      {
        "title": "S3保存階層",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-059",
    "chapterId": "ch05",
    "domain": 4,
    "conceptIds": [
      "standard-ia"
    ],
    "prompt": "大量の小さいファイルを2日だけ保存し毎日読む。Standard-IAの低いGB単価だけで移行を決める提案への評価は。",
    "options": [
      {
        "id": "a",
        "text": "最低保存期間・課金サイズ・取得費から逆に高くなる可能性を評価",
        "explanation": "短期・小サイズ・頻繁な取得では保存単価だけで有利と判断できない。"
      },
      {
        "id": "b",
        "text": "期間条件を満たすので取得費を含む総額を比較する",
        "explanation": "長期・低頻度・即時取得はIAの候補だが総額で判断する。"
      },
      {
        "id": "c",
        "text": "Standard-IAには保存費以外が一切ないとする",
        "explanation": "最低期間や取得などの条件を無視している。"
      },
      {
        "id": "d",
        "text": "即時取得が必要でもDeep Archiveから直接読めるとする",
        "explanation": "復元待ちを必要とする階層は即時取得の条件と違う。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「最低保存期間・課金サイズ・取得費から逆に高くなる可能性を評価」を選ぶ。短期・小サイズ・頻繁な取得では保存単価だけで有利と判断できない。",
    "sources": [
      {
        "title": "S3保存階層",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-060",
    "chapterId": "ch05",
    "domain": 4,
    "conceptIds": [
      "noncurrent-version"
    ],
    "prompt": "S3のVersioningバケットでファイルを削除したのに保存費が残る。旧版も存在する。主な確認事項は。",
    "options": [
      {
        "id": "a",
        "text": "削除マーカーと旧バージョンの保存量を確認する",
        "explanation": "削除マーカーだけでは過去のオブジェクト版が消えるわけではない。"
      },
      {
        "id": "b",
        "text": "保持条件を分けて旧版のライフサイクルと保護を設計する",
        "explanation": "保持義務を満たす範囲で不要な旧版や保存階層を見直す。"
      },
      {
        "id": "c",
        "text": "削除した名前が見えなければ旧版の保存費も必ずゼロとする",
        "explanation": "現在の一覧と実際の旧版保存量は一致しない。"
      },
      {
        "id": "d",
        "text": "すべての旧版を即削除して保持義務を後回しにする",
        "explanation": "コスト削減の前に守るべき条件に反する。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「削除マーカーと旧バージョンの保存量を確認する」を選ぶ。削除マーカーだけでは過去のオブジェクト版が消えるわけではない。",
    "sources": [
      {
        "title": "S3保存階層",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DR方式・IaC・復元検証",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-08"
      },
      {
        "title": "S3旧版と削除マーカー",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-061",
    "chapterId": "ch12",
    "domain": 4,
    "conceptIds": [
      "athena"
    ],
    "prompt": "AthenaでS3の全期間・全列を走査し、表示後に当日分へ絞っている。毎回最新データを読み、実行回数・結果再利用の無効設定・共有方法は変更しない。1回のクエリが読む期間と列を減らす変更を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "日付パーティションを用意し、SQLのWHEREで当日を指定する",
        "explanation": "必要な期間を読み取る条件をクエリへ渡し、対象外のパーティションを除外できる。"
      },
      {
        "id": "b",
        "text": "列指向形式へ変換し、SQLで必要列だけをSELECTする",
        "explanation": "列指向ファイルの不要な列を読まずに済むようにし、1実行の読取り量を減らす。"
      },
      {
        "id": "c",
        "text": "前回の集計結果を再利用して今回の実行を省く",
        "explanation": "結果再利用は有効な費用削減策だが、本問は無効設定と毎回の実行を維持する条件なので除外する。"
      },
      {
        "id": "d",
        "text": "1時間ごとに1回だけ集計して全利用者へ共有する",
        "explanation": "実行回数と共有方法を変える案であり、本問が変更しないとした条件を満たさない。"
      },
      {
        "id": "e",
        "text": "元のSQLとCSVは維持し、表示画面だけで当日・必要列を選ぶ",
        "explanation": "取得後の表示制御では、S3から既に走査した不要な期間・列を減らせない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "変更対象は1実行内のデータ配置とSQLの読取り範囲である。再利用と実行回数削減も一般には有効だが、本問の制約外。正答は日付パーティションの除外と列指向形式の列選択。",
    "sources": [
      {
        "title": "スキャン量最適化",
        "url": "https://docs.aws.amazon.com/athena/latest/ug/performance-tuning-data-optimization-techniques.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Athenaの結果再利用と鮮度の制約",
        "url": "https://docs.aws.amazon.com/athena/latest/ug/reusing-query-results.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-062",
    "chapterId": "ch07",
    "domain": 4,
    "conceptIds": [
      "cloudfront"
    ],
    "prompt": "不変の商品画像のオリジン要求が多い。既にCDNを使うが不要な追跡クエリが毎回キャッシュキーを変える。改善は。",
    "options": [
      {
        "id": "a",
        "text": "内容に影響しない追跡値をキャッシュキーから外す",
        "explanation": "同じ応答を安全に共有できる対象ではキャッシュ分断を減らす。"
      },
      {
        "id": "b",
        "text": "個人別の認証・認可と共有キャッシュ設定を修正する",
        "explanation": "情報保護を必須条件として満たしてから最適化する。"
      },
      {
        "id": "c",
        "text": "すべての利用者の認証情報を無条件に無視して共有する",
        "explanation": "個人別データでは情報漏えいを引き起こす。"
      },
      {
        "id": "d",
        "text": "ヒット率向上のため旧値を期限なく保持する",
        "explanation": "鮮度や保護条件を無視した費用削減になる。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「内容に影響しない追跡値をキャッシュキーから外す」を選ぶ。同じ応答を安全に共有できる対象ではキャッシュ分断を減らす。",
    "sources": [
      {
        "title": "CDN鮮度と要求削減",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-063",
    "chapterId": "ch04",
    "domain": 4,
    "conceptIds": [
      "capacity-reservation"
    ],
    "prompt": "指定AZの起動容量が必須だが、割引だけ買えばよいという提案がある。正しい分離は。",
    "options": [
      {
        "id": "a",
        "text": "Capacity Reservation等で容量を確保し割引は別に評価する",
        "explanation": "特定属性の起動容量と料金割引は別の目的である。"
      },
      {
        "id": "b",
        "text": "適正化後の安定利用にSavings Plans等を比較する",
        "explanation": "利用コミットメントによる割引で、余剰や対象条件を確認する。"
      },
      {
        "id": "c",
        "text": "オンデマンド予約の未使用分は常に無料とする",
        "explanation": "使わない予約容量の費用を無視している。"
      },
      {
        "id": "d",
        "text": "割引を買うと障害時のすべての容量が自動確保されるとする",
        "explanation": "割引だけでは物理容量の確保を保証しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「Capacity Reservation等で容量を確保し割引は別に評価する」を選ぶ。特定属性の起動容量と料金割引は別の目的である。",
    "sources": [
      {
        "title": "容量予約の役割",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Spotの中断と容量",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Savings Plansの利用額コミットメント",
        "url": "https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-064",
    "chapterId": "ch12",
    "domain": 4,
    "conceptIds": [
      "cost-optimization"
    ],
    "prompt": "常時起動EC2の必要負荷は半分、余分なストレージもある。いきなり現状量の長期割引を契約する前に行うことは。",
    "options": [
      {
        "id": "a",
        "text": "性能と可用性を測りながら不要な使用量を減らす",
        "explanation": "不要な量を残したまま契約すると未消化コミットメントを作り得る。"
      },
      {
        "id": "b",
        "text": "適正化後の基礎使用量に合う割引方式を比較する",
        "explanation": "継続する使用量が分かってから契約条件と柔軟性を評価する。"
      },
      {
        "id": "c",
        "text": "現状の最大量を測定なしに長期契約する",
        "explanation": "余剰や需要変化を無視して契約することになる。"
      },
      {
        "id": "d",
        "text": "バックアップを削除してSLOの確認もやめる",
        "explanation": "費用と交換して必要な復旧性・性能を失ってしまう。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「性能と可用性を測りながら不要な使用量を減らす」を選ぶ。不要な量を残したまま契約すると未消化コミットメントを作り得る。",
    "sources": [
      {
        "title": "容量予約の役割",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "EC2資源特性",
        "url": "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Savings Plansの利用額コミットメント",
        "url": "https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  },
  {
    "id": "m1-065",
    "chapterId": "ch12",
    "domain": 4,
    "conceptIds": [
      "network-cost"
    ],
    "prompt": "設計Aは月100単位だが単一AZ出口、Bは月130単位で各AZに出口がある。片側AZ障害時も外部通信継続が必須。他の要件は同じ。選択は。",
    "options": [
      {
        "id": "a",
        "text": "Bを選ぶ",
        "explanation": "片側障害後も出口が残る必須条件を満たす候補を先に残す。"
      },
      {
        "id": "b",
        "text": "Aを選ぶ",
        "explanation": "Aは30単位安いが、単一AZ出口の障害で外部通信を失う。今回必須の継続条件を満たさない。"
      },
      {
        "id": "c",
        "text": "AのNATの帯域だけを増やす案を追加費用なしと仮定して採用する",
        "explanation": "帯域の増加はAZ依存を解消せず、提示されていない追加案の費用もゼロとは評価できない。"
      },
      {
        "id": "d",
        "text": "BのNATを1台減らし、可用性と料金は変更前のBとして比較する",
        "explanation": "出口構成を変えるなら障害範囲と見積りを再評価する必要があり、Bの条件をそのまま引き継げない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "本問では「Bを選ぶ」を選ぶ。片側障害後も出口が残る必須条件を満たす候補を先に残す。",
    "sources": [
      {
        "title": "NAT配置と可用性",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html",
        "checked": "2026-10-08"
      },
      {
        "title": "NAT費用要因",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock1"
  }
];
export const mock2: Question[] = [
  {
    "id": "m2-001",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "iam-role"
    ],
    "prompt": "外部監査会社が一時的に自社AWSアカウントから顧客環境を調査する。EC2を顧客側で起動することなく権限委任したい。最適な方式は。",
    "options": [
      {
        "id": "a",
        "text": "EC2へ最小権限のインスタンスロールを関連付ける",
        "explanation": "EC2上のワークロードが一時認証情報を取得する方式。外部担当者の直接委任とは用途が異なる。"
      },
      {
        "id": "b",
        "text": "利用先にクロスアカウントロールを作りAssumeRoleを許可する",
        "explanation": "外部の主体への委任では信頼ポリシーと呼出し側の許可を整える。"
      },
      {
        "id": "c",
        "text": "人用IAMユーザーのアクセスキーを共通配布する",
        "explanation": "長期認証情報の配布と共有を増やし短期認証の条件に合わない。"
      },
      {
        "id": "d",
        "text": "S3バケットを匿名書込み可能にする",
        "explanation": "本人確認と対象を絞る認可をなくしてしまう。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「利用先にクロスアカウントロールを作りAssumeRoleを許可する」を選ぶ。外部の主体への委任では信頼ポリシーと呼出し側の許可を整える。",
    "sources": [
      {
        "title": "IAM最小権限・一時認証情報",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
        "checked": "2026-10-08"
      },
      {
        "title": "主体とリソースのポリシー",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-002",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "explicit-deny"
    ],
    "prompt": "同一アカウントのIAMユーザーに対象読取りのAllowがなく、リソースポリシーにも許可がない。他の許可経路もない。結果と理由は。",
    "options": [
      {
        "id": "a",
        "text": "明示的Denyによって拒否",
        "explanation": "適用される明示的Denyがある場合はAllowより優先する。"
      },
      {
        "id": "b",
        "text": "許可がないため暗黙的に拒否",
        "explanation": "適用される許可がない場合の既定の結果である。"
      },
      {
        "id": "c",
        "text": "Allowの件数が多ければ許可",
        "explanation": "評価は許可と拒否の票数比較ではない。"
      },
      {
        "id": "d",
        "text": "作成日の新しい方で決める",
        "explanation": "ポリシー更新日時は許可と拒否の優先基準ではない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「許可がないため暗黙的に拒否」を選ぶ。適用される許可がない場合の既定の結果である。",
    "sources": [
      {
        "title": "IAMポリシー評価",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-003",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "scp"
    ],
    "prompt": "開発者にIAMロール作成を委任するが、作成するロールの権限上限を指定したい。組織全体ではなく委任された主体を対象にする方式は。",
    "options": [
      {
        "id": "a",
        "text": "OUへ対象操作を拒否するSCP",
        "explanation": "メンバーアカウントに一貫した権限上限を適用する。SCPだけでは権限を付与しない。"
      },
      {
        "id": "b",
        "text": "作成ロールへのアクセス許可の境界を必須にする",
        "explanation": "主体ごとの最大権限を制約し、境界の除去や迂回も防ぐ設計にする。"
      },
      {
        "id": "c",
        "text": "全ロールへ同じAdministratorAccessを付ける",
        "explanation": "上限を設けず不要な操作まで許可する。"
      },
      {
        "id": "d",
        "text": "CloudTrailで監査するだけにする",
        "explanation": "実行の記録とAPIの禁止は別である。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「作成ロールへのアクセス許可の境界を必須にする」を選ぶ。主体ごとの最大権限を制約し、境界の除去や迂回も防ぐ設計にする。",
    "sources": [
      {
        "title": "Organizationsの権限上限",
        "url": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html",
        "checked": "2026-10-08"
      },
      {
        "title": "IAMポリシー評価",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-004",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "identity-center"
    ],
    "prompt": "一般消費者向け会員アプリを開発する。顧客のサインアップとログインが目的で、AWS管理者の統合ログインではない。選ぶ基盤は。",
    "options": [
      {
        "id": "a",
        "text": "IAM Identity Center",
        "explanation": "従業員のアカウント・業務アプリへのアクセスを集約する。"
      },
      {
        "id": "b",
        "text": "Amazon Cognitoユーザープール",
        "explanation": "アプリ利用者のサインアップや認証を扱う。"
      },
      {
        "id": "c",
        "text": "OrganizationsのSCPだけ",
        "explanation": "権限上限でありユーザー認証の基盤そのものではない。"
      },
      {
        "id": "d",
        "text": "EC2のインスタンスプロファイル",
        "explanation": "EC2ワークロード用であり人の会員管理の代替ではない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「Amazon Cognitoユーザープール」を選ぶ。アプリ利用者のサインアップや認証を扱う。",
    "sources": [
      {
        "title": "社内IdP連携",
        "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-idp.html",
        "checked": "2026-10-08"
      },
      {
        "title": "IAM最小権限・一時認証情報",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Cognitoユーザープールの認証",
        "url": "https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-005",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "identity-center"
    ],
    "prompt": "社員とグループはIdentity Centerに存在するが、本番アカウントがアクセスポータルに表示されない。次に確認する設定は。",
    "options": [
      {
        "id": "a",
        "text": "SCIM等によるユーザー・グループのプロビジョニング",
        "explanation": "SAMLだけではIdPのユーザー一覧を自動取得しない。割当前にIDを認識させる。"
      },
      {
        "id": "b",
        "text": "グループへのアカウントと許可セットの割当",
        "explanation": "存在する社員がどのAWSアカウントで何を行うかを指定する。"
      },
      {
        "id": "c",
        "text": "SCPに全サービスAllowを追加して認証する",
        "explanation": "SCPではユーザー作成やログイン先の割当を代行しない。"
      },
      {
        "id": "d",
        "text": "ルートユーザーの認証情報を新入社員へ配る",
        "explanation": "個人別の最小権限と社内ID連携の要件を損なう。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「グループへのアカウントと許可セットの割当」を選ぶ。存在する社員がどのAWSアカウントで何を行うかを指定する。",
    "sources": [
      {
        "title": "社内IdP連携",
        "url": "https://docs.aws.amazon.com/singlesignon/latest/userguide/manage-your-identity-source-idp.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Organizationsの権限上限",
        "url": "https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-006",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "resource-policy"
    ],
    "prompt": "AのIAMロールがBのSSE-S3オブジェクトを直接読む。BのバケットポリシーはAのロールを許可済み。他の制限はないがAの権限がない。追加すべきものは。",
    "options": [
      {
        "id": "a",
        "text": "Bのバケットポリシーで対象ロールと範囲を許可",
        "explanation": "別アカウントからの直接アクセスではリソース側の許可が必要。"
      },
      {
        "id": "b",
        "text": "Aのロールへ対象GetObjectを許可する権限ポリシー",
        "explanation": "クロスアカウントでは利用元の主体側の許可も必要。"
      },
      {
        "id": "c",
        "text": "BのSCPでS3をAllowするだけ",
        "explanation": "権限上限の設定はバケットへの許可を付与しない。"
      },
      {
        "id": "d",
        "text": "S3ストレージクラスをStandardへ変更",
        "explanation": "保管クラスはIAM主体への権限付与ではない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「Aのロールへ対象GetObjectを許可する権限ポリシー」を選ぶ。クロスアカウントでは利用元の主体側の許可も必要。",
    "sources": [
      {
        "title": "主体とリソースのポリシー",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identity-vs-resource.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-007",
    "chapterId": "ch03",
    "domain": 1,
    "conceptIds": [
      "security-group"
    ],
    "prompt": "独自NACLでアプリのTCP受信だけを許可した。ルートとSGは正しいが応答が通らない。戻り方向に必要な確認は。",
    "options": [
      {
        "id": "a",
        "text": "SGは状態を追跡するため許可した接続の応答を通す",
        "explanation": "SGのステートフル性についての説明でありNACLにはそのまま適用できない。"
      },
      {
        "id": "b",
        "text": "NACLの戻り方向のエフェメラルポート等を許可する",
        "explanation": "NACLは状態を追跡せず方向ごとの通過条件が必要。"
      },
      {
        "id": "c",
        "text": "戻り通信はすべての制御を無条件で通る",
        "explanation": "SGの状態追跡があっても別のNACLや経路の制約は残る。"
      },
      {
        "id": "d",
        "text": "受信した宛先ポートだけを逆方向にも許可する",
        "explanation": "クライアント側の戻り先ポートを考慮せず正しい応答許可にならない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「NACLの戻り方向のエフェメラルポート等を許可する」を選ぶ。NACLは状態を追跡せず方向ごとの通過条件が必要。",
    "sources": [
      {
        "title": "SGの状態追跡",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html",
        "checked": "2026-10-08"
      },
      {
        "title": "NACLのステートレス制御",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-008",
    "chapterId": "ch03",
    "domain": 1,
    "conceptIds": [
      "network-acl"
    ],
    "prompt": "DBの5432/TCPを、同じVPCで台数が変わるアプリ層のEC2だけから受けたい。最小範囲を管理しやすい設定は。",
    "options": [
      {
        "id": "a",
        "text": "NACLの適切な優先順位にDenyルールを設定",
        "explanation": "サブネット境界で許可と明示的拒否を使える。戻りも別途設計する。"
      },
      {
        "id": "b",
        "text": "DBのSGの送信元にアプリSGを指定",
        "explanation": "アプリ層の変動するIPごとの管理を避けて通信許可を限定できる。"
      },
      {
        "id": "c",
        "text": "SGへDenyルールを追加",
        "explanation": "SGに明示的Denyルールはなく許可ルールで制御する。"
      },
      {
        "id": "d",
        "text": "WAFだけで任意のDBポートのパケットを拒否",
        "explanation": "WAFはWebリクエスト向けで任意のIP通信の境界制御ではない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「DBのSGの送信元にアプリSGを指定」を選ぶ。アプリ層の変動するIPごとの管理を避けて通信許可を限定できる。",
    "sources": [
      {
        "title": "SGの状態追跡",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html",
        "checked": "2026-10-08"
      },
      {
        "title": "NACLのステートレス制御",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html",
        "checked": "2026-10-08"
      },
      {
        "title": "WAFのWebリクエスト保護",
        "url": "https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-009",
    "chapterId": "ch03",
    "domain": 1,
    "conceptIds": [
      "vpc-endpoint"
    ],
    "prompt": "非公開EC2からSecrets Manager APIへプライベートIPで接続する。DNSとSGの設定も行う。必要な方式は。",
    "options": [
      {
        "id": "a",
        "text": "S3 Gateway endpointと対象ルートテーブルの関連付け",
        "explanation": "S3へのサービス向け経路を提供しエンドポイント追加料金はない。"
      },
      {
        "id": "b",
        "text": "Secrets ManagerのInterface endpoint",
        "explanation": "対応サービスへPrivateLink経由のプライベートIP接続を提供する。"
      },
      {
        "id": "c",
        "text": "S3 Gateway endpointを全サービスに共用",
        "explanation": "Gateway endpointは任意のAWSサービス向け出口ではない。"
      },
      {
        "id": "d",
        "text": "S3を匿名公開して認証不要にする",
        "explanation": "到達経路の条件を満たすために公開する必要はない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「Secrets ManagerのInterface endpoint」を選ぶ。対応サービスへPrivateLink経由のプライベートIP接続を提供する。",
    "sources": [
      {
        "title": "Gateway endpointの経路と費用",
        "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Secrets ManagerのInterface endpoint",
        "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/vpc-endpoint-overview.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-010",
    "chapterId": "ch07",
    "domain": 1,
    "conceptIds": [
      "hybrid-network"
    ],
    "prompt": "Direct Connect専用接続を運用し、拠点装置1台の故障にも耐えたい。暗号化は構築済みで、帯域要件も明示されている。必要な確認を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "TLSやVPN等の暗号化方式を設計する",
        "explanation": "Direct Connectの採用だけで既定の通信暗号化は得られない。"
      },
      {
        "id": "b",
        "text": "対応する接続・区間ではMACsecの適用範囲も比較する",
        "explanation": "MACsecは条件付きのリンク暗号化で、保護範囲を確認して採用する。"
      },
      {
        "id": "c",
        "text": "装置・回線・接続場所の単一障害点を分ける",
        "explanation": "冗長接続は同じ故障原因で同時に失わないよう設計する。"
      },
      {
        "id": "d",
        "text": "切替先の帯域で業務負荷を処理できるか測定する",
        "explanation": "接続が残ることと必要な処理量を維持できることは別。"
      },
      {
        "id": "e",
        "text": "専用線1本なら暗号化も無停止も完了したとする",
        "explanation": "専用接続だけで両方を保証することはできない。"
      }
    ],
    "answers": [
      "c",
      "d"
    ],
    "explanation": "本問では「装置・回線・接続場所の単一障害点を分ける」「切替先の帯域で業務負荷を処理できるか測定する」を選ぶ。冗長接続は同じ故障原因で同時に失わないよう設計する。 接続が残ることと必要な処理量を維持できることは別。",
    "sources": [
      {
        "title": "専用線の暗号化条件",
        "url": "https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html",
        "checked": "2026-10-08"
      },
      {
        "title": "静的安定性と残存容量",
        "url": "https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_withstand_component_failures_static_stability.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-011",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "kms-rotation"
    ],
    "prompt": "新しいKMSキーへエイリアスを付け替えたが、旧キーの暗号化バックアップを長期保持している。追加で必要な対応は。",
    "options": [
      {
        "id": "a",
        "text": "対応するキーで素材の自動またはオンデマンドローテーションを使う",
        "explanation": "論理キーを保ち、過去の暗号文には対応する素材を使える。"
      },
      {
        "id": "b",
        "text": "旧キーの復号権限と利用可能性を維持する",
        "explanation": "エイリアス変更だけでは旧暗号文が新キーで復号できるわけではない。"
      },
      {
        "id": "c",
        "text": "新しいキーができたので旧キーを即削除する",
        "explanation": "旧暗号文の復号に必要な素材を失うおそれがある。"
      },
      {
        "id": "d",
        "text": "キー名だけ変更して暗号化済みデータを書き換えたとする",
        "explanation": "名称変更は鍵素材更新でも再暗号化でもない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「旧キーの復号権限と利用可能性を維持する」を選ぶ。エイリアス変更だけでは旧暗号文が新キーで復号できるわけではない。",
    "sources": [
      {
        "title": "鍵更新の効果と限界",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html",
        "checked": "2026-10-08"
      },
      {
        "title": "KMS削除と復号",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-012",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "kms-rotation"
    ],
    "prompt": "エンベロープ暗号化で使う平文データキーが漏えいした。KMS鍵素材のローテーションは完了したが、まだ同じデータキーを使っている。過去に持ち出された平文は回収できない前提で、今後の利用と保持データへの影響を抑えるために追加で計画すべき対応は。",
    "options": [
      {
        "id": "a",
        "text": "旧暗号文は対応素材で復号でき、データ自体の再暗号化は起きないと確認する",
        "explanation": "技術的に正しい説明だが、漏えいキーの使用停止や保持データの保護変更を実施する計画がない。"
      },
      {
        "id": "b",
        "text": "漏えい経路を封じ、漏えいデータキーの使用を止め、新しいキーで必要なデータを再暗号化する計画を立てる",
        "explanation": "鍵素材ローテーションは漏えいデータキーを変えない。封じ込め・キー交換・再暗号化の範囲を別に検討する。既に漏れた平文を回収できる意味ではない。"
      },
      {
        "id": "c",
        "text": "KMSのローテーション周期だけをさらに短くする",
        "explanation": "包む側の鍵素材を頻繁に変えても、漏えいしたデータキー自体の使用は継続する。"
      },
      {
        "id": "d",
        "text": "KMSキーのエイリアスだけを変更し、既存データキーの利用を続ける",
        "explanation": "エイリアスの変更だけでは漏えいデータキーや保持暗号文の保護は変更されない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "正しい性質の説明と、漏えいに対処する追加計画を区別する。Aは事実だが要求された対処を行わない。Bを検討し、権限・漏えい経路とデータキーの双方を扱う。",
    "sources": [
      {
        "title": "鍵更新の効果と限界",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-013",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "acm-renewal"
    ],
    "prompt": "外部CAが発行した証明書をACMへインポートしてALBに使う。期限が迫っている。実施すべき作業は。",
    "options": [
      {
        "id": "a",
        "text": "DNS検証用CNAMEと更新適格な利用状態を維持する",
        "explanation": "ACM発行のDNS検証証明書の自動更新に必要な条件を保つ。"
      },
      {
        "id": "b",
        "text": "外部CAで更新し証明書を再インポートする",
        "explanation": "インポート証明書はACMのマネージド更新の対象ではない。"
      },
      {
        "id": "c",
        "text": "発行済みなら検証CNAMEを削除して放置する",
        "explanation": "DNS検証の更新条件を損なう可能性がある。"
      },
      {
        "id": "d",
        "text": "KMSキー素材の更新だけを実行する",
        "explanation": "保存鍵の更新ではTLS証明書の期限は延びない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「外部CAで更新し証明書を再インポートする」を選ぶ。インポート証明書はACMのマネージド更新の対象ではない。",
    "sources": [
      {
        "title": "ACMの更新対象",
        "url": "https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DNS検証更新",
        "url": "https://docs.aws.amazon.com/acm/latest/userguide/dns-renewal-validation.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-014",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "secrets-manager"
    ],
    "prompt": "HTTPS入口の証明書の期限管理を統合サービスで減らしたい。DBパスワード更新ではない。選ぶ機能は。",
    "options": [
      {
        "id": "a",
        "text": "Secrets Managerの対応するローテーション",
        "explanation": "DBと秘密値の整合性、アプリの取得・再接続まで確認する。"
      },
      {
        "id": "b",
        "text": "ACM発行証明書と対応サービスの連携",
        "explanation": "TLS証明書のライフサイクルを扱い、DB資格情報の変更とは異なる。"
      },
      {
        "id": "c",
        "text": "KMS素材更新だけ",
        "explanation": "鍵素材を更新する機能でDBパスワードや証明書の期限管理ではない。"
      },
      {
        "id": "d",
        "text": "新しい値をソースへ直接書いて公開する",
        "explanation": "秘密の配布範囲を広げて保護と運用の条件に合わない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「ACM発行証明書と対応サービスの連携」を選ぶ。TLS証明書のライフサイクルを扱い、DB資格情報の変更とは異なる。",
    "sources": [
      {
        "title": "秘密情報ローテーション",
        "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html",
        "checked": "2026-10-08"
      },
      {
        "title": "ACMの更新対象",
        "url": "https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html",
        "checked": "2026-10-08"
      },
      {
        "title": "鍵更新の効果と限界",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-015",
    "chapterId": "ch07",
    "domain": 1,
    "conceptIds": [
      "cloudfront-oac"
    ],
    "prompt": "オリジンの制限は設定済み。有料画像のうち単一ファイルを購入者へ20分だけ配信したい。視聴者側で必要な機能は。",
    "options": [
      {
        "id": "a",
        "text": "OACと対象配信を許可するバケットポリシー",
        "explanation": "CloudFrontからS3へのオリジンアクセスを制御する。視聴者認可は別。"
      },
      {
        "id": "b",
        "text": "期限を指定するCloudFront署名付きURL",
        "explanation": "単一コンテンツに対する利用者のアクセス条件を付けられる。"
      },
      {
        "id": "c",
        "text": "S3の公開URLを知る人だけへ教える",
        "explanation": "URLの秘匿は認可の代替にならない。"
      },
      {
        "id": "d",
        "text": "Route 53加重設定で一部要求だけ通す",
        "explanation": "利用権限や有効期限を検証する仕組みではない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「期限を指定するCloudFront署名付きURL」を選ぶ。単一コンテンツに対する利用者のアクセス条件を付けられる。",
    "sources": [
      {
        "title": "OACとS3のオリジン制限",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html",
        "checked": "2026-10-08"
      },
      {
        "title": "署名付きURLとCookieの選択",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-choosing-signed-urls-cookies.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-016",
    "chapterId": "ch07",
    "domain": 1,
    "conceptIds": [
      "signed-url"
    ],
    "prompt": "外部アプリへ単一PDFの一時ダウンロードリンクを渡す。Cookieを扱わずURLだけで制御したい。何を使うか。",
    "options": [
      {
        "id": "a",
        "text": "CloudFront署名付きCookie",
        "explanation": "複数の対象ファイルのアクセス権をCookieでまとめて扱う。"
      },
      {
        "id": "b",
        "text": "CloudFront署名付きURL",
        "explanation": "対象ファイルへの制限をURLへ含める方式である。"
      },
      {
        "id": "c",
        "text": "OACだけ",
        "explanation": "CloudFrontとオリジン間の保護で、利用者の購入条件ではない。"
      },
      {
        "id": "d",
        "text": "Originのファイル名だけ変更",
        "explanation": "名前変更だけでは利用権や期限を検証しない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「CloudFront署名付きURL」を選ぶ。対象ファイルへの制限をURLへ含める方式である。",
    "sources": [
      {
        "title": "署名付きURLとCookieの選択",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-choosing-signed-urls-cookies.html",
        "checked": "2026-10-08"
      },
      {
        "title": "OACとS3のオリジン制限",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-017",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "cloudtrail"
    ],
    "prompt": "暗号化されていないボリュームがいつから存在し、構成がどう変わったかを追跡してルール評価したい。中心となるサービスは。",
    "options": [
      {
        "id": "a",
        "text": "CloudTrailの管理イベント",
        "explanation": "主体とAPI操作を追う監査記録に使う。"
      },
      {
        "id": "b",
        "text": "AWS Configの構成履歴とルール",
        "explanation": "リソースの構成と準拠状態を継続評価する。"
      },
      {
        "id": "c",
        "text": "CloudWatchのCPUメトリクスだけ",
        "explanation": "CPU推移から変更したAPI主体や構成履歴は分からない。"
      },
      {
        "id": "d",
        "text": "ALBアクセスログだけ",
        "explanation": "Web要求の記録は任意の管理APIや全リソース構成の台帳ではない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「AWS Configの構成履歴とルール」を選ぶ。リソースの構成と準拠状態を継続評価する。",
    "sources": [
      {
        "title": "API監査",
        "url": "https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Configの設定記録",
        "url": "https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html",
        "checked": "2026-10-08"
      },
      {
        "title": "CloudWatchの運用観測",
        "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-018",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "waf"
    ],
    "prompt": "特定CIDRの任意のIPパケットをサブネット境界で拒否したい。Web以外の通信も対象。適した防御は。",
    "options": [
      {
        "id": "a",
        "text": "AWS WAFのWeb ACLとルール",
        "explanation": "HTTP要求の検査やレートルールに使い、任意のIP通信の境界制御とは違う。"
      },
      {
        "id": "b",
        "text": "ネットワークACLのDeny",
        "explanation": "サブネットのIP通信に許可・拒否を適用できる。"
      },
      {
        "id": "c",
        "text": "CloudTrailで記録するだけ",
        "explanation": "監査ログを取るだけでは通信を拒否しない。"
      },
      {
        "id": "d",
        "text": "KMSで保存データを暗号化するだけ",
        "explanation": "保存時暗号化は悪意ある要求の遮断ではない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「ネットワークACLのDeny」を選ぶ。サブネットのIP通信に許可・拒否を適用できる。",
    "sources": [
      {
        "title": "WAFのWebリクエスト保護",
        "url": "https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html",
        "checked": "2026-10-08"
      },
      {
        "title": "NACLのステートレス制御",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-019",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "least-privilege"
    ],
    "prompt": "開発者がProjectタグ一致のリソースを操作するABACを導入する。任意の権限拡大を防ぐ施策を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "必要なオブジェクトARNへGetObjectを限定する",
        "explanation": "読み取る対象と操作を業務範囲へ絞る。"
      },
      {
        "id": "b",
        "text": "必要なList操作も対象プレフィックス等で制約する",
        "explanation": "一覧が必要な場合も不要な範囲を許可しない。"
      },
      {
        "id": "c",
        "text": "主体とリソースのタグ条件を照合する",
        "explanation": "属性によって操作可能な範囲を決める。"
      },
      {
        "id": "d",
        "text": "認可に使うタグを自由に変更できないよう制約する",
        "explanation": "タグを変えて上限を回避する権限昇格を防ぐ。"
      },
      {
        "id": "e",
        "text": "運用が簡単なので全サービスへ管理者権限を付与する",
        "explanation": "業務以上の権限を与え最小権限に反する。"
      }
    ],
    "answers": [
      "c",
      "d"
    ],
    "explanation": "本問では「主体とリソースのタグ条件を照合する」「認可に使うタグを自由に変更できないよう制約する」を選ぶ。属性によって操作可能な範囲を決める。 タグを変えて上限を回避する権限昇格を防ぐ。",
    "sources": [
      {
        "title": "IAM最小権限・一時認証情報",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
        "checked": "2026-10-08"
      },
      {
        "title": "IAMポリシー評価",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html",
        "checked": "2026-10-08"
      },
      {
        "title": "属性に基づく認可",
        "url": "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction_attribute-based-access-control.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-020",
    "chapterId": "ch12",
    "domain": 1,
    "conceptIds": [
      "lake-formation"
    ],
    "prompt": "S3データレイクで保存時の暗号操作を制御し、復号可能な主体を制限する。中心となる仕組みは。",
    "options": [
      {
        "id": "a",
        "text": "Lake Formationと必要なIAM・S3権限の整理",
        "explanation": "データレイクの細かな権限管理を行い、関連するアクセス条件も整える。"
      },
      {
        "id": "b",
        "text": "KMSキーのポリシー等による利用権限管理",
        "explanation": "暗号操作とキー利用を制御する。分析テーブルの業務権限とは別。"
      },
      {
        "id": "c",
        "text": "Glueカタログ登録だけで全認可完了とする",
        "explanation": "メタデータ登録はすべてのアクセス権の付与や制約ではない。"
      },
      {
        "id": "d",
        "text": "データを全世界へ公開してクエリ側で隠す",
        "explanation": "読取り権限を公開してから画面だけで隠しても保護できない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「KMSキーのポリシー等による利用権限管理」を選ぶ。暗号操作とキー利用を制御する。分析テーブルの業務権限とは別。",
    "sources": [
      {
        "title": "データレイク権限",
        "url": "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html",
        "checked": "2026-10-08"
      },
      {
        "title": "鍵更新の効果と限界",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-021",
    "chapterId": "ch01",
    "domain": 2,
    "conceptIds": [
      "availability"
    ],
    "prompt": "3AZへ均等配置し、1台200件/秒、ピーク1200件/秒を処理する。1AZ喪失後も増設せず維持する最小台数は。",
    "options": [
      {
        "id": "a",
        "text": "各AZ2台、計6台",
        "explanation": "1AZ喪失後は4台が残り800件/秒となる。余裕の要否は実測で評価する。"
      },
      {
        "id": "b",
        "text": "各AZ3台、計9台",
        "explanation": "1AZ喪失後は6台が残り1200件/秒となる。"
      },
      {
        "id": "c",
        "text": "各AZ1台、計3台",
        "explanation": "1AZ喪失後は2台で400件/秒となる。"
      },
      {
        "id": "d",
        "text": "単一AZへ6台集約",
        "explanation": "平常時の容量はあってもそのAZの喪失で全停止する。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「各AZ3台、計9台」を選ぶ。1AZ喪失後は6台が残り1200件/秒となる。",
    "sources": [
      {
        "title": "静的安定性と残存容量",
        "url": "https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_withstand_component_failures_static_stability.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-022",
    "chapterId": "ch04",
    "domain": 2,
    "conceptIds": [
      "health-check"
    ],
    "prompt": "ALBの有効な全AZで登録ターゲットがすべて異常になった。ターゲットグループは空ではない。挙動は。",
    "options": [
      {
        "id": "a",
        "text": "正常なターゲットへ送る",
        "explanation": "正常な登録先がある場合のヘルスチェックに基づく転送である。"
      },
      {
        "id": "b",
        "text": "fail-openで異常ターゲットにも送る",
        "explanation": "全登録先が異常の場合にALBはfail-openとなる。"
      },
      {
        "id": "c",
        "text": "ALBがDBのバックアップを復元する",
        "explanation": "ヘルスチェックはDB復元を実施する機能ではない。"
      },
      {
        "id": "d",
        "text": "ALBだけでEC2台数が自動的に増える",
        "explanation": "負荷分散とAuto Scalingの容量調整は別に設定する。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「fail-openで異常ターゲットにも送る」を選ぶ。全登録先が異常の場合にALBはfail-openとなる。",
    "sources": [
      {
        "title": "ALBヘルスチェック",
        "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-023",
    "chapterId": "ch06",
    "domain": 2,
    "conceptIds": [
      "rds-multi-az"
    ],
    "prompt": "DBは既にMulti-AZ DBインスタンス配置である。遅延を許容する月次レポートのSELECTを本番プライマリから分離したい。",
    "options": [
      {
        "id": "a",
        "text": "Multi-AZ DBインスタンス配置",
        "explanation": "別AZの同期スタンバイを維持し自動切替に備える。単一スタンバイは読取り用ではない。"
      },
      {
        "id": "b",
        "text": "読取り用のリードレプリカへレポートを向ける",
        "explanation": "非同期複製の遅延を許容する参照負荷を分散する。"
      },
      {
        "id": "c",
        "text": "毎日スナップショットだけ取る",
        "explanation": "履歴復旧には有効だが常時稼働の切替やSELECT処理先ではない。"
      },
      {
        "id": "d",
        "text": "DB名のDNS別名だけ追加する",
        "explanation": "実体のある待機DBや処理容量を用意しない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「読取り用のリードレプリカへレポートを向ける」を選ぶ。非同期複製の遅延を許容する参照負荷を分散する。",
    "sources": [
      {
        "title": "Multi-AZ DBインスタンス",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html",
        "checked": "2026-10-08"
      },
      {
        "title": "RDSリードレプリカ",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-024",
    "chapterId": "ch06",
    "domain": 2,
    "conceptIds": [
      "point-in-time-recovery"
    ],
    "prompt": "AZ障害でプライマリが利用不能になったが、業務上の誤更新はない。Multi-AZ DBインスタンス構成の復旧経路として適切なのは。",
    "options": [
      {
        "id": "a",
        "text": "指定時点の別DBへ復元し検証して接続を切り替える",
        "explanation": "誤更新前の状態へ戻すには履歴を復元し復元先を確認する。"
      },
      {
        "id": "b",
        "text": "スタンバイへの切替とアプリの再接続を確認する",
        "explanation": "正常な最新状態を別AZの待機先で引き継ぐ経路である。"
      },
      {
        "id": "c",
        "text": "同期レプリカには誤更新が伝わらないと考える",
        "explanation": "複製は業務上の正誤を識別しない。"
      },
      {
        "id": "d",
        "text": "Webの台数だけを増やす",
        "explanation": "DBの状態復元や切替先の準備にはならない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「スタンバイへの切替とアプリの再接続を確認する」を選ぶ。正常な最新状態を別AZの待機先で引き継ぐ経路である。",
    "sources": [
      {
        "title": "Multi-AZ DBインスタンス",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DR方式・IaC・復元検証",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-08"
      },
      {
        "title": "RDSの時点復元は新しいDBを作成する",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-025",
    "chapterId": "ch03",
    "domain": 2,
    "conceptIds": [
      "nat-gateway"
    ],
    "prompt": "2AZの非公開EC2がゾーン型NATを共用している。必要な通信先は同一リージョンのS3だけであり、外部APIも更新サイトも使わない。NAT依存をなくす構成は。",
    "options": [
      {
        "id": "a",
        "text": "各AZのゾーン型NATへ同じAZの経路を向ける",
        "explanation": "外部IPv4への出口をAZごとに分け、別AZの出口停止から分離する。"
      },
      {
        "id": "b",
        "text": "両AZのルートをS3 Gateway endpointへ関連付ける",
        "explanation": "対象S3アクセスではNATを必要としない経路を利用できる。"
      },
      {
        "id": "c",
        "text": "S3 Gateway endpointで任意の外部APIも中継する",
        "explanation": "S3向け経路は外部APIへの出口にはならない。"
      },
      {
        "id": "d",
        "text": "BのCPUを倍増する",
        "explanation": "計算資源の変更は失われたネットワーク出口を復旧しない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「両AZのルートをS3 Gateway endpointへ関連付ける」を選ぶ。対象S3アクセスではNATを必要としない経路を利用できる。",
    "sources": [
      {
        "title": "NAT配置と可用性",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Gateway endpointの経路と費用",
        "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-026",
    "chapterId": "ch09",
    "domain": 2,
    "conceptIds": [
      "visibility-timeout"
    ],
    "prompt": "ワーカーが受信直後に停止することがあり、可視性が12時間なので再処理が最大12時間遅れる。処理自体は通常90秒。まず見直す点は。",
    "options": [
      {
        "id": "a",
        "text": "処理時間に合わせ可視性を延長し必要ならハートビート更新する",
        "explanation": "短すぎる不可視期間による処理途中の再受信を抑える。冪等性は別途必要。"
      },
      {
        "id": "b",
        "text": "復旧待ち要件に合わせ過大な可視性を短縮する",
        "explanation": "障害後の再出現を遅らせ過ぎないよう実処理時間と合わせる。"
      },
      {
        "id": "c",
        "text": "処理前に必ずメッセージを削除する",
        "explanation": "途中停止で作業が失われるため安全な再処理にならない。"
      },
      {
        "id": "d",
        "text": "可視性だけで二重の業務更新が絶対起きないとする",
        "explanation": "再配信や削除失敗を考慮し業務の冪等性も必要。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「復旧待ち要件に合わせ過大な可視性を短縮する」を選ぶ。障害後の再出現を遅らせ過ぎないよう実処理時間と合わせる。",
    "sources": [
      {
        "title": "SQS可視性と再配信",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-027",
    "chapterId": "ch09",
    "domain": 2,
    "conceptIds": [
      "queue-scaling"
    ],
    "prompt": "12000件の滞留を250件/秒で処理するが、新規受付を止めている。解消時間は。",
    "options": [
      {
        "id": "a",
        "text": "120秒",
        "explanation": "到着継続なら差分250-150=100件/秒で12000件を減らす。"
      },
      {
        "id": "b",
        "text": "48秒",
        "explanation": "到着ゼロなら全能力250件/秒を滞留へ使える。"
      },
      {
        "id": "c",
        "text": "240秒",
        "explanation": "変更前の増加期間と増強後の解消時間は同じとは限らない。"
      },
      {
        "id": "d",
        "text": "無期限に解消しない",
        "explanation": "処理率が到着率を上回る条件では滞留は減る。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「48秒」を選ぶ。到着ゼロなら全能力250件/秒を滞留へ使える。",
    "sources": [
      {
        "title": "SQS負荷とスケーリング",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-using-sqs-queue.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-028",
    "chapterId": "ch09",
    "domain": 2,
    "conceptIds": [
      "dlq"
    ],
    "prompt": "メッセージは正常だが決済後に削除失敗して再受信される。二重請求を避けて回復したい。対策を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "適切な受信回数でDLQへ隔離する",
        "explanation": "永続エラーを通常処理から分離する。隔離だけでは業務成功ではない。"
      },
      {
        "id": "b",
        "text": "原因修正後に流量を抑えて再投入し結果を照合する",
        "explanation": "再投入で同じ障害や下流過負荷を繰り返さない運用にする。"
      },
      {
        "id": "c",
        "text": "同じ業務IDによる決済の冪等性を設計する",
        "explanation": "再受信が新しい決済として二重実行されることを防ぐ。"
      },
      {
        "id": "d",
        "text": "保存済みの決済結果を確認してから処理完了と削除を行う",
        "explanation": "成功済み副作用を繰り返さず再処理を終える設計にする。"
      },
      {
        "id": "e",
        "text": "全エラーを成功扱いして削除する",
        "explanation": "未処理注文を失い業務の回復ができなくなる。"
      }
    ],
    "answers": [
      "c",
      "d"
    ],
    "explanation": "本問では「同じ業務IDによる決済の冪等性を設計する」「保存済みの決済結果を確認してから処理完了と削除を行う」を選ぶ。再受信が新しい決済として二重実行されることを防ぐ。 成功済み副作用を繰り返さず再処理を終える設計にする。",
    "sources": [
      {
        "title": "SQS可視性と再配信",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DLQ保持と再投入",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-029",
    "chapterId": "ch09",
    "domain": 2,
    "conceptIds": [
      "fanout"
    ],
    "prompt": "1つの変換キューに届く作業を複数の同種ワーカーで分担する。全ワーカーへ同じ作業コピーを配る必要はない。選ぶ構成は。",
    "options": [
      {
        "id": "a",
        "text": "SNSから担当別SQSへ配信する",
        "explanation": "各担当にコピーと保持先を分け、処理速度や障害を分離できる。"
      },
      {
        "id": "b",
        "text": "1つのSQSを同種ワーカー群で受信する",
        "explanation": "競合するコンシューマーで作業を分担する方式。重複は考慮する。"
      },
      {
        "id": "c",
        "text": "1つのSQSを請求と配送が読み全件が両方へ届くとする",
        "explanation": "競合受信は担当それぞれへの全件配信にならない。"
      },
      {
        "id": "d",
        "text": "SNS通知のみで停止中の全業務処理が完了するとする",
        "explanation": "通知配送と実際の業務処理・保持の設計は別である。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「1つのSQSを同種ワーカー群で受信する」を選ぶ。競合するコンシューマーで作業を分担する方式。重複は考慮する。",
    "sources": [
      {
        "title": "メッセージ基盤の選択",
        "url": "https://docs.aws.amazon.com/decision-guides/latest/decision-guides/sns-or-sqs-or-eventbridge.html",
        "checked": "2026-10-08"
      },
      {
        "title": "SQS可視性と再配信",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-030",
    "chapterId": "ch08",
    "domain": 2,
    "conceptIds": [
      "lambda-concurrency"
    ],
    "prompt": "Lambda関数の処理は数百ミリ秒で終わり下流には余裕があるが、初期化時の遅延だけがSLOを超える。対策候補は。",
    "options": [
      {
        "id": "a",
        "text": "SQS最大同時実行と関数の予約済み枠を整合させる",
        "explanation": "イベントソースから流す同時処理数を制約し下流を守る。"
      },
      {
        "id": "b",
        "text": "プロビジョニング済み同時実行を比較する",
        "explanation": "初期化済み環境で開始遅延を抑える候補で、下流流量制限とは役割が違う。"
      },
      {
        "id": "c",
        "text": "同時実行を無制限に増やす",
        "explanation": "下流の上限を超える負荷には逆効果となる。"
      },
      {
        "id": "d",
        "text": "メッセージを受信前に削除する",
        "explanation": "正常な受付と業務処理を失う対処である。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「プロビジョニング済み同時実行を比較する」を選ぶ。初期化済み環境で開始遅延を抑える候補で、下流流量制限とは役割が違う。",
    "sources": [
      {
        "title": "SQSイベントソースの同時実行",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Lambda方式別の上限",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html",
        "checked": "2026-10-08"
      },
      {
        "title": "初期化済み実行環境と予約済み枠の区別",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/provisioned-concurrency.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-031",
    "chapterId": "ch08",
    "domain": 2,
    "conceptIds": [
      "idempotency"
    ],
    "prompt": "イベントが重複して届いても同じ在庫引当を二重に実施させたくない。バッチの成否とは別に必要な設計は。",
    "options": [
      {
        "id": "a",
        "text": "失敗項目IDを返す部分バッチ応答",
        "explanation": "失敗項目だけの再処理へ絞るための機能である。"
      },
      {
        "id": "b",
        "text": "業務IDを用いた原子的な処理済み判定と冪等性",
        "explanation": "イベントが再配信されても業務の副作用を重ねないための設計である。"
      },
      {
        "id": "c",
        "text": "成功項目も毎回すべて再実行する",
        "explanation": "不要な再処理と二重副作用の可能性を増やす。"
      },
      {
        "id": "d",
        "text": "失敗項目を理由なしに破棄する",
        "explanation": "復旧対象を失い必要な処理が完了しない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「業務IDを用いた原子的な処理済み判定と冪等性」を選ぶ。イベントが再配信されても業務の副作用を重ねないための設計である。",
    "sources": [
      {
        "title": "SQS部分バッチ応答",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html",
        "checked": "2026-10-08"
      },
      {
        "title": "SQS可視性と再配信",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-032",
    "chapterId": "ch11",
    "domain": 2,
    "conceptIds": [
      "rto"
    ],
    "prompt": "RTO45分・RPO10分が要件である。候補Bは検知5分＋昇格5分＋拡張15分＋検証10分、複製遅延3分と実測された。妥当な評価は。",
    "options": [
      {
        "id": "a",
        "text": "今回の構成は両要件を満たさない",
        "explanation": "復旧85分は45分を超え、日次バックアップの損失幅も10分を超え得る。"
      },
      {
        "id": "b",
        "text": "今回の訓練では両要件を満たす",
        "explanation": "復旧35分、損失幅3分で要求内。ただし将来の保証ではなく再検証が必要。"
      },
      {
        "id": "c",
        "text": "RTOとRPOは同じ値なので片方だけ測る",
        "explanation": "時間軸が異なり復旧時間とデータ損失幅を別に評価する。"
      },
      {
        "id": "d",
        "text": "DNS切替だけを測れば全復旧時間になる",
        "explanation": "データ復旧や起動、検証の時間も含める必要がある。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「今回の訓練では両要件を満たす」を選ぶ。復旧35分、損失幅3分で要求内。ただし将来の保証ではなく再検証が必要。",
    "sources": [
      {
        "title": "DR方式・IaC・復元検証",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-033",
    "chapterId": "ch11",
    "domain": 2,
    "conceptIds": [
      "pilot-light"
    ],
    "prompt": "縮小したアプリを含む全体が待機先で稼働しており、障害時は主に容量を拡張して切り替える。方式は。",
    "options": [
      {
        "id": "a",
        "text": "パイロットライト",
        "explanation": "中核を維持して復旧時に追加部分を起動する方式である。"
      },
      {
        "id": "b",
        "text": "ウォームスタンバイ",
        "explanation": "縮小した全体を維持して本番負荷へ拡張する方式である。"
      },
      {
        "id": "c",
        "text": "バックアップ・リストアだけ",
        "explanation": "継続稼働する中核や縮小系のある前提とは異なる。"
      },
      {
        "id": "d",
        "text": "全拠点で常時全量処理するアクティブ／アクティブ",
        "explanation": "待機系を主に使う前提とは異なる。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「ウォームスタンバイ」を選ぶ。縮小した全体を維持して本番負荷へ拡張する方式である。",
    "sources": [
      {
        "title": "DR方式・IaC・復元検証",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-034",
    "chapterId": "ch11",
    "domain": 2,
    "conceptIds": [
      "recovery-quota"
    ],
    "prompt": "アカウント上限は十分だが指定AZと種類で容量不足エラーが出る。起動容量の確保として検討するものは。",
    "options": [
      {
        "id": "a",
        "text": "必要なサービスクォータを確認し余裕を確保する",
        "explanation": "アカウントの利用上限に備える。実容量の予約と同じではない。"
      },
      {
        "id": "b",
        "text": "一致する属性のCapacity Reservation等を事前確保する",
        "explanation": "指定されたAZと属性の計算容量を確保する候補である。"
      },
      {
        "id": "c",
        "text": "Savings Plansだけ購入する",
        "explanation": "料金の割引はアカウント上限増加や指定容量の確保ではない。"
      },
      {
        "id": "d",
        "text": "CloudFormationテンプレートの名前だけ変える",
        "explanation": "定義の名称を変えても上限や実容量は増えない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「一致する属性のCapacity Reservation等を事前確保する」を選ぶ。指定されたAZと属性の計算容量を確保する候補である。",
    "sources": [
      {
        "title": "復旧先のクォータ余裕",
        "url": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_manage_service_limits_suff_buffer_limits.html",
        "checked": "2026-10-08"
      },
      {
        "title": "容量予約の役割",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-035",
    "chapterId": "ch11",
    "domain": 2,
    "conceptIds": [
      "restore-test"
    ],
    "prompt": "インフラはIaC化済みだが暗号化バックアップの復元がAccessDeniedとなり、復旧先アプリも秘密を取得できない。調べるものを2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "IaCとアプリの版を復旧先へ再現できるよう維持する",
        "explanation": "手動設定の漏れを減らし復旧の再現性を高める。"
      },
      {
        "id": "b",
        "text": "業務処理の再開まで復旧訓練で計測する",
        "explanation": "テンプレート作成だけでなく実際の復元可能性を確認する。"
      },
      {
        "id": "c",
        "text": "復旧主体がKMSキーを利用できるか確認する",
        "explanation": "暗号化バックアップは復号する権限と鍵の利用可能性が必要。"
      },
      {
        "id": "d",
        "text": "復旧先の秘密情報と取得権限・到達性を確認する",
        "explanation": "データだけでなくアプリの依存する認証情報も必要。"
      },
      {
        "id": "e",
        "text": "保存データがあるので残りの依存設定は不要とする",
        "explanation": "設定・鍵・認証情報が欠ければ業務は復旧しない。"
      }
    ],
    "answers": [
      "c",
      "d"
    ],
    "explanation": "本問では「復旧主体がKMSキーを利用できるか確認する」「復旧先の秘密情報と取得権限・到達性を確認する」を選ぶ。暗号化バックアップは復号する権限と鍵の利用可能性が必要。 データだけでなくアプリの依存する認証情報も必要。",
    "sources": [
      {
        "title": "DR方式・IaC・復元検証",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-08"
      },
      {
        "title": "KMS削除と復号",
        "url": "https://docs.aws.amazon.com/kms/latest/developerguide/deleting-keys.html",
        "checked": "2026-10-08"
      },
      {
        "title": "秘密情報ローテーション",
        "url": "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-036",
    "chapterId": "ch01",
    "domain": 2,
    "conceptIds": [
      "region"
    ],
    "prompt": "リージョン災害は今回の範囲外で、単一AZの障害に耐えるWeb配置をまず整えたい。最小の障害範囲の分離は。",
    "options": [
      {
        "id": "a",
        "text": "別リージョンのデータ・容量・切替経路を用意する",
        "explanation": "リージョン全体の障害の外側へ復旧先を確保する。"
      },
      {
        "id": "b",
        "text": "同一リージョンの複数AZに配置し正常先へ切り替える",
        "explanation": "AZ単位の障害を分離する構成。データと残存容量も必要。"
      },
      {
        "id": "c",
        "text": "同一AZの同じサブネットへ台数だけ増やす",
        "explanation": "同じAZ障害を共有するため指定の分離にはならない。"
      },
      {
        "id": "d",
        "text": "リソースの名前へ予備と付ける",
        "explanation": "名称だけでは実体のある復旧先を用意しない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「同一リージョンの複数AZに配置し正常先へ切り替える」を選ぶ。AZ単位の障害を分離する構成。データと残存容量も必要。",
    "sources": [
      {
        "title": "静的安定性と残存容量",
        "url": "https://docs.aws.amazon.com/wellarchitected/latest/framework/rel_withstand_component_failures_static_stability.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DR方式・IaC・復元検証",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-037",
    "chapterId": "ch10",
    "domain": 2,
    "conceptIds": [
      "tracing"
    ],
    "prompt": "注文APIの遅延障害で、先に発生時刻と全体のエラー率・遅延推移を把握したい。必要な観測は。",
    "options": [
      {
        "id": "a",
        "text": "分散トレースの依存区間と処理時間",
        "explanation": "要求をサービス間で追跡し遅い区間を調査する。"
      },
      {
        "id": "b",
        "text": "CloudWatch等のメトリクスとアラーム",
        "explanation": "集計した稼働状態や時間的な変化を捉える。"
      },
      {
        "id": "c",
        "text": "CloudTrailのログイン履歴だけ",
        "explanation": "管理主体の記録だけでは処理中の各区間の時間を示さない。"
      },
      {
        "id": "d",
        "text": "バックアップの保持期間だけ",
        "explanation": "性能悪化の時刻や依存先の処理時間を観測しない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「CloudWatch等のメトリクスとアラーム」を選ぶ。集計した稼働状態や時間的な変化を捉える。",
    "sources": [
      {
        "title": "CloudWatchの運用観測",
        "url": "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
        "checked": "2026-10-08"
      },
      {
        "title": "要求経路の分散トレース",
        "url": "https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-038",
    "chapterId": "ch04",
    "domain": 3,
    "conceptIds": [
      "instance-family"
    ],
    "prompt": "変換処理でCPUは25%だが作業集合がメモリへ収まらずスワップしている。まず比較する資源は。",
    "options": [
      {
        "id": "a",
        "text": "必要CPU性能を持つコンピューティング最適化EC2",
        "explanation": "CPUがボトルネックの場合の候補で、実測して性能と費用を比較する。"
      },
      {
        "id": "b",
        "text": "作業集合を収容できるメモリ最適化EC2",
        "explanation": "メモリ不足を解消する候補。CPUだけの増加では不足が残り得る。"
      },
      {
        "id": "c",
        "text": "同じ容量のまま購入割引だけ変更する",
        "explanation": "単価は変わってもボトルネックの資源量は変わらない。"
      },
      {
        "id": "d",
        "text": "平均CPUだけを見て最小サイズへ縮小する",
        "explanation": "ピークとメモリ・I/Oの制約を確認しない縮小は遅延を悪化させる。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「作業集合を収容できるメモリ最適化EC2」を選ぶ。メモリ不足を解消する候補。CPUだけの増加では不足が残り得る。",
    "sources": [
      {
        "title": "EC2資源特性",
        "url": "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-039",
    "chapterId": "ch05",
    "domain": 3,
    "conceptIds": [
      "storage-performance"
    ],
    "prompt": "ブロックI/Oでアプリが256KiBを毎秒2000回要求する方式へ変わる。転送量の計算だけに注目すると必要帯域は。",
    "options": [
      {
        "id": "a",
        "text": "250MiB/秒",
        "explanation": "16×16000÷1024=250。KiBとMiBを区別する。"
      },
      {
        "id": "b",
        "text": "500MiB/秒",
        "explanation": "256×2000÷1024=500。回数だけでは帯域要求を比較できない。"
      },
      {
        "id": "c",
        "text": "16MiB/秒",
        "explanation": "I/Oサイズと毎秒回数の積を計算していない。"
      },
      {
        "id": "d",
        "text": "IOPSの値だけでは転送量が絶対に計算できない",
        "explanation": "I/Oサイズも与えられているため積から計算できる。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「500MiB/秒」を選ぶ。256×2000÷1024=500。回数だけでは帯域要求を比較できない。",
    "sources": [
      {
        "title": "gp3性能設定",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-040",
    "chapterId": "ch05",
    "domain": 3,
    "conceptIds": [
      "gp3"
    ],
    "prompt": "実測で汎用SSDの遅延特性が重要DBの要件を満たさない。より低い遅延と安定した高IOPSを重視する。比較するタイプは。",
    "options": [
      {
        "id": "a",
        "text": "gp3",
        "explanation": "容量とIOPS・スループットを独立して設定する汎用SSD。"
      },
      {
        "id": "b",
        "text": "io2 Block Express",
        "explanation": "厳しい遅延・IOPS条件のワークロード向け候補。費用とEC2上限も比較する。"
      },
      {
        "id": "c",
        "text": "sc1",
        "explanation": "低頻度のスループット志向HDDで、厳しいランダムI/O要件と異なる。"
      },
      {
        "id": "d",
        "text": "st1",
        "explanation": "連続転送中心のHDDで、汎用SSDや厳しい低遅延の要求とは異なる。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「io2 Block Express」を選ぶ。厳しい遅延・IOPS条件のワークロード向け候補。費用とEC2上限も比較する。",
    "sources": [
      {
        "title": "gp3性能設定",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
        "checked": "2026-10-08"
      },
      {
        "title": "io2の性能用途",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/provisioned-iops.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-041",
    "chapterId": "ch05",
    "domain": 3,
    "conceptIds": [
      "efs"
    ],
    "prompt": "単一AZのEC2で既存のブロックデバイス向けDBを動かす。共有NFSは不要で低遅延ブロックI/Oを求める。候補は。",
    "options": [
      {
        "id": "a",
        "text": "Regional EFSを各AZのマウントターゲットから利用",
        "explanation": "共有NFSの要件に合う。通信許可と性能モードを設計する。"
      },
      {
        "id": "b",
        "text": "要件に合うEBS SSDをEC2へ接続",
        "explanation": "EC2のブロックI/O向け。一般的な複数AZ共有ファイルとは異なる。"
      },
      {
        "id": "c",
        "text": "S3を無変更でPOSIXブロックデバイスとして扱う",
        "explanation": "オブジェクトAPIはブロックやNFSと同じインターフェイスではない。"
      },
      {
        "id": "d",
        "text": "各コンテナの一時領域だけで共有する",
        "explanation": "複数環境からの共有正本や永続性を満たさない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「要件に合うEBS SSDをEC2へ接続」を選ぶ。EC2のブロックI/O向け。一般的な複数AZ共有ファイルとは異なる。",
    "sources": [
      {
        "title": "EFS性能モード",
        "url": "https://docs.aws.amazon.com/efs/latest/ug/performance.html",
        "checked": "2026-10-08"
      },
      {
        "title": "gp3性能設定",
        "url": "https://docs.aws.amazon.com/ebs/latest/userguide/general-purpose.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-042",
    "chapterId": "ch06",
    "domain": 3,
    "conceptIds": [
      "database-selection"
    ],
    "prompt": "新規のセッションサービスはIDによる取得と更新が中心で、JOIN不要、要求量は不規則でサーバー保守を避けたい。候補は。",
    "options": [
      {
        "id": "a",
        "text": "RDS PostgreSQLやAurora PostgreSQL互換を比較",
        "explanation": "リレーショナルなアクセスと互換性を保つ候補。個別機能の互換性は検証する。"
      },
      {
        "id": "b",
        "text": "DynamoDBのキーと容量方式を設計",
        "explanation": "キー中心のアクセスと管理された拡張に向く候補。任意JOINの移植ではない。"
      },
      {
        "id": "c",
        "text": "S3のCSVファイルだけで既存DBトランザクションを代替",
        "explanation": "保存APIの変更だけでは既存のトランザクションやJOINを維持しない。"
      },
      {
        "id": "d",
        "text": "キャッシュだけを正本にしてDBを削除する",
        "explanation": "永続性と整合性を満たす正本の設計を省略している。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「DynamoDBのキーと容量方式を設計」を選ぶ。キー中心のアクセスと管理された拡張に向く候補。任意JOINの移植ではない。",
    "sources": [
      {
        "title": "DBデータモデル選択",
        "url": "https://docs.aws.amazon.com/prescriptive-guidance/latest/saas-multitenant-managed-postgresql/db-selection.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DynamoDB容量課金",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-043",
    "chapterId": "ch06",
    "domain": 3,
    "conceptIds": [
      "consistency"
    ],
    "prompt": "DynamoDBの集計表示は数秒古くてもよく、同じサイズの読取り費用を抑えたい。適切な読取りは。",
    "options": [
      {
        "id": "a",
        "text": "テーブルの強い整合性読取り",
        "explanation": "成功済みの書込みを反映した読取りを求める場合に選べる。"
      },
      {
        "id": "b",
        "text": "結果整合性読取り",
        "explanation": "直後の古い値を許容する代わりに読取り費用を抑えられる。"
      },
      {
        "id": "c",
        "text": "GSIの強い整合性読取り",
        "explanation": "GSIは強い整合性に対応しない。"
      },
      {
        "id": "d",
        "text": "Scanなら設定に関係なく常に最新とする",
        "explanation": "QueryやScanの種類だけで整合性は決まらない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「結果整合性読取り」を選ぶ。直後の古い値を許容する代わりに読取り費用を抑えられる。",
    "sources": [
      {
        "title": "DynamoDB整合性",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-044",
    "chapterId": "ch06",
    "domain": 3,
    "conceptIds": [
      "read-replica"
    ],
    "prompt": "更新直後の確定残高を参照する処理で、非同期レプリカの遅延は許容できない。読取り先の方針は。",
    "options": [
      {
        "id": "a",
        "text": "分析SELECTをリードレプリカへ向ける",
        "explanation": "遅延を許容する読取り負荷をプライマリから分離できる。"
      },
      {
        "id": "b",
        "text": "最新値が必要な処理は適切なプライマリへ向ける",
        "explanation": "非同期レプリカの遅延を避け、トランザクション条件も確認する。"
      },
      {
        "id": "c",
        "text": "Multi-AZ DBインスタンスの単一スタンバイへSELECTする",
        "explanation": "このスタンバイは通常の読取り処理を提供しない。"
      },
      {
        "id": "d",
        "text": "DBへ接続せず古いキャッシュだけを永久に読む",
        "explanation": "鮮度要件を持つデータを更新せず使い続けることになる。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「最新値が必要な処理は適切なプライマリへ向ける」を選ぶ。非同期レプリカの遅延を避け、トランザクション条件も確認する。",
    "sources": [
      {
        "title": "RDSリードレプリカ",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Multi-AZ DBインスタンス",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-045",
    "chapterId": "ch08",
    "domain": 3,
    "conceptIds": [
      "lambda-memory"
    ],
    "prompt": "標準Lambdaのメモリを倍にして測定したが、実行時間は変わらず、元の設定も応答目標と必要メモリを満たした。実行数とGB秒単価は同じで、無料枠等の割引は除く。今回の2設定のメモリ時間による実行料金の評価は。",
    "options": [
      {
        "id": "a",
        "text": "実行時間が同じなので、メモリ時間による料金も同じ",
        "explanation": "同じ時間でも割当メモリが倍ならGB秒は倍になる。"
      },
      {
        "id": "b",
        "text": "変更後のメモリ時間料金は倍で、要件を満たす元の設定の方が安い",
        "explanation": "測定結果と同じ実行数・単価を前提に、割当GB×秒を比較する。"
      },
      {
        "id": "c",
        "text": "実行時間が同じなので、メモリ時間による料金は半分",
        "explanation": "割当GBが増えており、同じ秒数なら半分ではなく倍になる。"
      },
      {
        "id": "d",
        "text": "メモリが増えた分は時間料金に含まれず、リクエスト料金だけが倍になる",
        "explanation": "実行数は同じなので要求回数は倍にならない。今回変わるのは割当メモリによるGB秒。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「メモリ時間積が増えるため元の設定との比較を行う」を選ぶ。時間が短縮しないなら同じ実行数でメモリ時間の費用が増え得る。",
    "sources": [
      {
        "title": "LambdaメモリとCPU",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/configuration-memory.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Lambda方式別の上限",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-046",
    "chapterId": "ch08",
    "domain": 3,
    "conceptIds": [
      "lambda"
    ],
    "prompt": "既存コンテナの処理は50分、分割不可。比較対象のLambdaはManaged Instancesを使わない標準実行に限定しホスト管理を避けたい。候補は。",
    "options": [
      {
        "id": "a",
        "text": "標準Lambdaのイベント起動",
        "explanation": "短いイベント処理に向き、実行時間等の制約内で利用する。"
      },
      {
        "id": "b",
        "text": "ECS/Fargateタスク",
        "explanation": "必要CPU・メモリを満たすコンテナで長時間処理を行う候補。"
      },
      {
        "id": "c",
        "text": "標準Lambdaの1回タイムアウトを50分へ設定",
        "explanation": "標準実行の900秒上限を超える設定にはできない。"
      },
      {
        "id": "d",
        "text": "ECRへ保存すれば処理は自動的に実行されるとする",
        "explanation": "イメージ保管とタスク実行は別の機能である。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「ECS/Fargateタスク」を選ぶ。必要CPU・メモリを満たすコンテナで長時間処理を行う候補。",
    "sources": [
      {
        "title": "Lambda方式別の上限",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html",
        "checked": "2026-10-08"
      },
      {
        "title": "EC2資源特性",
        "url": "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Fargateのホスト管理範囲",
        "url": "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-047",
    "chapterId": "ch07",
    "domain": 3,
    "conceptIds": [
      "global-accelerator"
    ],
    "prompt": "世界から同じHTTP画像を繰返し取得する。エッジに内容を置いてオリジン読取りを減らしたい。候補は。",
    "options": [
      {
        "id": "a",
        "text": "Global Accelerator",
        "explanation": "固定IPとAWSネットワークによる正常な到達先選択を提供する。画像キャッシュではない。"
      },
      {
        "id": "b",
        "text": "CloudFront",
        "explanation": "HTTPコンテンツのエッジ配信とキャッシュを利用する。汎用UDPの入口ではない。"
      },
      {
        "id": "c",
        "text": "Route 53のレイテンシールーティングで各リージョンのNLB名へ案内する",
        "explanation": "TCP/UDPのNLBへDNSで案内できるが、固定された共通の入口IPや画像本文のキャッシュを提供する構成ではない。"
      },
      {
        "id": "d",
        "text": "1リージョンのNLBへElastic IPを割り当て、遠隔地から直接接続する",
        "explanation": "単一リージョンの固定入口にはなるが、複数リージョンへの正常先選択も画像キャッシュも持たない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「CloudFront」を選ぶ。HTTPコンテンツのエッジ配信とキャッシュを利用する。汎用UDPの入口ではない。",
    "sources": [
      {
        "title": "固定IPによる配信経路",
        "url": "https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html",
        "checked": "2026-10-08"
      },
      {
        "title": "CDN鮮度と要求削減",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-048",
    "chapterId": "ch12",
    "domain": 3,
    "conceptIds": [
      "analytics-pipeline"
    ],
    "prompt": "イベントをS3へまとめて配送し、バッファ待ちは許容できる。独立コンシューマーのリプレイより配送管理の削減を重視する。基盤は。",
    "options": [
      {
        "id": "a",
        "text": "Kinesis Data Streamsで保持とコンシューマーを設計",
        "explanation": "独立した読取りと設定保持期間内の再読込に対応する。"
      },
      {
        "id": "b",
        "text": "Data FirehoseのS3配信",
        "explanation": "対応する宛先へのバッファ配信の運用を減らす。"
      },
      {
        "id": "c",
        "text": "単一SQSで全担当に必ず同じ全件を配る",
        "explanation": "競合受信は全担当への独立配信やストリーム再読込とは違う。"
      },
      {
        "id": "d",
        "text": "年1回のバックアップだけ",
        "explanation": "秒単位の取り込みや継続配信に対応しない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「Data FirehoseのS3配信」を選ぶ。対応する宛先へのバッファ配信の運用を減らす。",
    "sources": [
      {
        "title": "ストリームの保持と処理者",
        "url": "https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html",
        "checked": "2026-10-08"
      },
      {
        "title": "バッファ配信",
        "url": "https://docs.aws.amazon.com/firehose/latest/dev/basic-deliver.html",
        "checked": "2026-10-08"
      },
      {
        "title": "SQS可視性と再配信",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-049",
    "chapterId": "ch12",
    "domain": 3,
    "conceptIds": [
      "athena"
    ],
    "prompt": "データの整形は済んだが、分析者に必要な列だけを許可し、ダッシュボードの鮮度も管理したい。施策を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "日付パーティションを利用しWHEREで対象を絞る",
        "explanation": "不要な期間の走査を減らせる。"
      },
      {
        "id": "b",
        "text": "列指向形式で必要列だけを読む",
        "explanation": "SELECT *を避け、列単位の読込みを減らせる。"
      },
      {
        "id": "c",
        "text": "Lake Formation等と必要IAM/S3権限を設定する",
        "explanation": "データレイクへのアクセスを業務範囲へ絞る。"
      },
      {
        "id": "d",
        "text": "可視化側の取込・更新間隔を鮮度要件に合わせる",
        "explanation": "保存済みデータの時刻と画面更新時刻を区別する。"
      },
      {
        "id": "e",
        "text": "全期間を走査して画面だけで1日に絞る",
        "explanation": "クエリで読む量は減らず、表示の絞込みとは別である。"
      }
    ],
    "answers": [
      "c",
      "d"
    ],
    "explanation": "本問では「Lake Formation等と必要IAM/S3権限を設定する」「可視化側の取込・更新間隔を鮮度要件に合わせる」を選ぶ。データレイクへのアクセスを業務範囲へ絞る。 保存済みデータの時刻と画面更新時刻を区別する。",
    "sources": [
      {
        "title": "スキャン量最適化",
        "url": "https://docs.aws.amazon.com/athena/latest/ug/performance-tuning-data-optimization-techniques.html",
        "checked": "2026-10-08"
      },
      {
        "title": "データレイク権限",
        "url": "https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-050",
    "chapterId": "ch11",
    "domain": 3,
    "conceptIds": [
      "datasync"
    ],
    "prompt": "既存のNFS/SMBアプリは拠点で使い続け、S3を背景の保存先にしてローカルキャッシュ経由でアクセスしたい。候補は。",
    "options": [
      {
        "id": "a",
        "text": "AWS DataSync",
        "explanation": "対応ファイル・オブジェクト保存先への転送と移行のためのサービス。"
      },
      {
        "id": "b",
        "text": "S3 File Gateway",
        "explanation": "既存NFS/SMBからS3へアクセスし、キャッシュとアップロードを使う。"
      },
      {
        "id": "c",
        "text": "DMS CDC",
        "explanation": "DBの変更データ移行が中心でNFSファイル移行と異なる。"
      },
      {
        "id": "d",
        "text": "S3 Lifecycleだけ",
        "explanation": "保管済みオブジェクトの管理で拠点ファイルの転送機構ではない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「S3 File Gateway」を選ぶ。既存NFS/SMBからS3へアクセスし、キャッシュとアップロードを使う。",
    "sources": [
      {
        "title": "ファイルの転送",
        "url": "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html",
        "checked": "2026-10-08"
      },
      {
        "title": "NFS/SMBとS3",
        "url": "https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DB移行とCDC",
        "url": "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-051",
    "chapterId": "ch11",
    "domain": 3,
    "conceptIds": [
      "cdc"
    ],
    "prompt": "DBの変更追随は不要で、数千万の静的ファイルを対応ストレージ間で移したい。候補は。",
    "options": [
      {
        "id": "a",
        "text": "DMSの初期ロードとCDCを使いスキーマ・アプリ互換も検証",
        "explanation": "変更データを追随するが全アプリ改修を自動解決するものではない。"
      },
      {
        "id": "b",
        "text": "DataSyncで転送と検証を実施",
        "explanation": "ファイル・オブジェクト移行に向き、DBトランザクションCDCとは異なる。"
      },
      {
        "id": "c",
        "text": "DNSを新DBへ向けるだけ",
        "explanation": "既存データや差分の移行と整合性検証が欠ける。"
      },
      {
        "id": "d",
        "text": "バックアップ保持期間を短くするだけ",
        "explanation": "移行先へ必要なデータを転送する処理にはならない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「DataSyncで転送と検証を実施」を選ぶ。ファイル・オブジェクト移行に向き、DBトランザクションCDCとは異なる。",
    "sources": [
      {
        "title": "DB移行とCDC",
        "url": "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html",
        "checked": "2026-10-08"
      },
      {
        "title": "ファイルの転送",
        "url": "https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-052",
    "chapterId": "ch07",
    "domain": 3,
    "conceptIds": [
      "cloudfront"
    ],
    "prompt": "認証済み利用者の口座画面が別利用者へ誤配信された。HTTP応答はユーザーごとに異なる。優先する方針は。",
    "options": [
      {
        "id": "a",
        "text": "共有可能な画像に適切な長いTTLと版付きURLを使う",
        "explanation": "不変のコンテンツを再利用し鮮度はURLの版で分けられる。"
      },
      {
        "id": "b",
        "text": "個人別の認証・認可と共有キャッシュしない設定を確認",
        "explanation": "個人固有の応答を他の利用者へ再利用させない。"
      },
      {
        "id": "c",
        "text": "すべてのCookieを無条件に除去して全応答を共有する",
        "explanation": "個人別応答で情報漏えいの原因になり得る。"
      },
      {
        "id": "d",
        "text": "全コンテンツを更新方針なしに永久保存する",
        "explanation": "変わる内容の鮮度や失効を制御できない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「個人別の認証・認可と共有キャッシュしない設定を確認」を選ぶ。個人固有の応答を他の利用者へ再利用させない。",
    "sources": [
      {
        "title": "CDN鮮度と要求削減",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-053",
    "chapterId": "ch04",
    "domain": 4,
    "conceptIds": [
      "spot"
    ],
    "prompt": "レンダリング処理が1回4時間で、分割・再開ができず明朝までの期限が厳しい。今回のジョブだけで長期契約もしない。候補は。",
    "options": [
      {
        "id": "a",
        "text": "Spotを使い中断と容量不足へ再投入で対応する",
        "explanation": "実行時刻と中断に柔軟な処理で費用削減を検討できる。"
      },
      {
        "id": "b",
        "text": "必要なオンデマンド容量を用意して実測時間を確認する",
        "explanation": "Spotの都合による中断を避ける候補。インスタンス障害対策は別途必要。"
      },
      {
        "id": "c",
        "text": "Savings Plans購入だけで1回の処理の容量を保証する",
        "explanation": "割引契約は容量保証ではなく短期1回だけなら未消化にも注意。"
      },
      {
        "id": "d",
        "text": "全実行を中断可能な容量だけにして期限を保証する",
        "explanation": "再開不可と厳しい期限の条件を満たす根拠がない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「必要なオンデマンド容量を用意して実測時間を確認する」を選ぶ。Spotの都合による中断を避ける候補。インスタンス障害対策は別途必要。",
    "sources": [
      {
        "title": "Spotの中断と容量",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html",
        "checked": "2026-10-08"
      },
      {
        "title": "容量予約の役割",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-054",
    "chapterId": "ch06",
    "domain": 4,
    "conceptIds": [
      "dynamodb-on-demand"
    ],
    "prompt": "既存サービスは継続的な一定負荷が計測済みで必要量を予測できる。設定容量での課金とAuto Scalingを比較したい。方式は。",
    "options": [
      {
        "id": "a",
        "text": "オンデマンド容量",
        "explanation": "要求ベースで課金し事前の固定スループット設定を減らす。"
      },
      {
        "id": "b",
        "text": "プロビジョンド容量",
        "explanation": "設定した読書き容量へ課金する。予測可能な負荷で余剰と追従を比較する。"
      },
      {
        "id": "c",
        "text": "要求がなくても常に最大容量を固定する",
        "explanation": "需要の少ない時間に無駄が出るため無条件で最安とは言えない。"
      },
      {
        "id": "d",
        "text": "容量方式ではキー偏りも無条件でなくなるとする",
        "explanation": "いずれの方式でもアクセス集中や制限への設計は必要。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「プロビジョンド容量」を選ぶ。設定した読書き容量へ課金する。予測可能な負荷で余剰と追従を比較する。",
    "sources": [
      {
        "title": "DynamoDB容量課金",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-055",
    "chapterId": "ch12",
    "domain": 4,
    "conceptIds": [
      "database-cost"
    ],
    "prompt": "学習用の月額見積りで、Aurora候補Aは実行保存80単位＋I/O5単位、Bは実行保存120単位でI/O別料金なし。同じ性能要件を満たす。安い方は。",
    "options": [
      {
        "id": "a",
        "text": "Bが30単位安い",
        "explanation": "Aは80＋5＝85で、Bの120より35安い。Bが30安いという計算にはならない。"
      },
      {
        "id": "b",
        "text": "Aが35単位安い",
        "explanation": "Aの総額85とBの120を比較した場合の結果。"
      },
      {
        "id": "c",
        "text": "費用差はないので、どちらでもよい",
        "explanation": "提示された実行保存額とI/O額を加算すると総額は異なる。"
      },
      {
        "id": "d",
        "text": "Aが40単位安い",
        "explanation": "実行保存の80と120だけの差であり、AのI/O費を加算していない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「Aが35単位安い」を選ぶ。Aの総額85とBの120を比較した場合の結果。",
    "sources": [
      {
        "title": "Aurora費用要因",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/User_DBInstanceBilling.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-056",
    "chapterId": "ch03",
    "domain": 4,
    "conceptIds": [
      "network-cost"
    ],
    "prompt": "2AZの共有NATを各AZのNATへ変える仮定。追加固定費50単位、回避するAZ間費20単位だった。他は同じ。月額差は。",
    "options": [
      {
        "id": "a",
        "text": "30単位減る",
        "explanation": "追加50から削減80を引くと-30になる。"
      },
      {
        "id": "b",
        "text": "30単位増える",
        "explanation": "追加50から削減20を引くと+30になる。"
      },
      {
        "id": "c",
        "text": "台数が増えるので転送量に関係なく常に50だけ増える",
        "explanation": "回避できる通信費を落としている。"
      },
      {
        "id": "d",
        "text": "共有か分散かだけで、条件なしに常に片方が安い",
        "explanation": "稼働時間・通信量・経路によって費用の大小は変わる。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「30単位増える」を選ぶ。追加50から削減20を引くと+30になる。",
    "sources": [
      {
        "title": "NAT費用要因",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-057",
    "chapterId": "ch03",
    "domain": 4,
    "conceptIds": [
      "vpc-endpoint"
    ],
    "prompt": "任意の外部IPv4決済APIが通信量を占める。S3との通信ではない。片側AZ障害時も必要な出口設計は。",
    "options": [
      {
        "id": "a",
        "text": "S3 Gateway endpointを対象ルートへ関連付ける",
        "explanation": "対象S3通信をNATから外しエンドポイント自体の追加課金もない。"
      },
      {
        "id": "b",
        "text": "各AZの適切なNAT経路を維持し通信量を最適化する",
        "explanation": "任意の外部APIにはS3 endpointを代用できず出口の可用性も必要。"
      },
      {
        "id": "c",
        "text": "S3 Gateway endpointを外部決済の出口にする",
        "explanation": "対応先が違い任意のインターネットへ中継できない。"
      },
      {
        "id": "d",
        "text": "NATをすべて削除し必要経路を用意しない",
        "explanation": "費用は減っても必要な業務通信を維持できない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「各AZの適切なNAT経路を維持し通信量を最適化する」を選ぶ。任意の外部APIにはS3 endpointを代用できず出口の可用性も必要。",
    "sources": [
      {
        "title": "Gateway endpointの経路と費用",
        "url": "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html",
        "checked": "2026-10-08"
      },
      {
        "title": "NAT費用要因",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html",
        "checked": "2026-10-08"
      },
      {
        "title": "NAT配置と可用性",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-058",
    "chapterId": "ch05",
    "domain": 4,
    "conceptIds": [
      "storage-cost"
    ],
    "prompt": "監査記録を緊急照会でミリ秒単位に取得する必要がある。読取りは低頻度で30日以上保持する。候補は。",
    "options": [
      {
        "id": "a",
        "text": "S3 Glacier Deep Archiveを復元費等も含め比較する",
        "explanation": "長期保存と待ち時間を許容する場合の候補。即時取得には不適合。"
      },
      {
        "id": "b",
        "text": "S3 Standard-IA等の即時取得階層を比較する",
        "explanation": "低頻度でも即時取得を求める時に、取得費や最低期間を含めて比較する。"
      },
      {
        "id": "c",
        "text": "保存費だけを見てすべて同じ最安階層へ移す",
        "explanation": "復元待ちや取得頻度を満たさない可能性がある。"
      },
      {
        "id": "d",
        "text": "法定保持期間前に削除する",
        "explanation": "費用以外の必須条件である保持義務に反する。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「S3 Standard-IA等の即時取得階層を比較する」を選ぶ。低頻度でも即時取得を求める時に、取得費や最低期間を含めて比較する。",
    "sources": [
      {
        "title": "S3保存階層",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-059",
    "chapterId": "ch05",
    "domain": 4,
    "conceptIds": [
      "standard-ia"
    ],
    "prompt": "S3に各10MiBのオブジェクトを必ず180日保持し、月1回程度読み、即時取得が必要である。期間・サイズの最低課金条件を満たすことは確認した。StandardとStandard-IAの次の比較として最も適切なのは。",
    "options": [
      {
        "id": "a",
        "text": "2日で削除する場合の最低保存期間料金だけを比較する",
        "explanation": "短期削除時の料金は重要な一般論だが、本問では180日の保持が確定している。提示条件と異なる期間だけでは今回の候補を選べない。"
      },
      {
        "id": "b",
        "text": "180日分の保存と想定する取得・リクエスト等を含め、同じデータ量で総額を比較する",
        "explanation": "保持条件を満たしていても取得・要求などの費用差は残る。即時取得を満たす候補同士で総額を比較する。"
      },
      {
        "id": "c",
        "text": "保存GB単価だけを比較し、低い方を選ぶ",
        "explanation": "即時取得という条件は満たしても、実際に月1回読む取得費と要求費を見落とす。"
      },
      {
        "id": "d",
        "text": "Deep Archiveの保存費だけで選び、復元は照会の後に開始する",
        "explanation": "保存費は低くできても、復元待ちが必要なため即時取得を満たさない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "最低課金条件を無視しない。今回は期間とサイズを確認済みなので、想定利用の総額比較へ進む。取得費等の検討は引き続き必要。",
    "sources": [
      {
        "title": "S3保存階層",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-060",
    "chapterId": "ch05",
    "domain": 4,
    "conceptIds": [
      "noncurrent-version"
    ],
    "prompt": "S3のVersioningバケットで古い版を減らしたいが監査で7年保持が必要なデータもある。適切な管理方針は。",
    "options": [
      {
        "id": "a",
        "text": "削除マーカーと旧バージョンの保存量を確認する",
        "explanation": "削除マーカーだけでは過去のオブジェクト版が消えるわけではない。"
      },
      {
        "id": "b",
        "text": "保持条件を分けて旧版のライフサイクルと保護を設計する",
        "explanation": "保持義務を満たす範囲で不要な旧版や保存階層を見直す。"
      },
      {
        "id": "c",
        "text": "削除した名前が見えなければ旧版の保存費も必ずゼロとする",
        "explanation": "現在の一覧と実際の旧版保存量は一致しない。"
      },
      {
        "id": "d",
        "text": "すべての旧版を即削除して保持義務を後回しにする",
        "explanation": "コスト削減の前に守るべき条件に反する。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「保持条件を分けて旧版のライフサイクルと保護を設計する」を選ぶ。保持義務を満たす範囲で不要な旧版や保存階層を見直す。",
    "sources": [
      {
        "title": "S3保存階層",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DR方式・IaC・復元検証",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-08"
      },
      {
        "title": "S3旧版と削除マーカー",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-061",
    "chapterId": "ch12",
    "domain": 4,
    "conceptIds": [
      "athena"
    ],
    "prompt": "分析データは必要期間・列に絞れているが、部署全員が同じ集計を1分ごとに独立実行する。鮮度は1時間でよい。比較する施策を2つ選べ。（2つ選択）",
    "options": [
      {
        "id": "a",
        "text": "日付パーティションとクエリ条件を使う",
        "explanation": "不必要な期間の走査を減らす。"
      },
      {
        "id": "b",
        "text": "列指向形式でSELECTする列を絞る",
        "explanation": "必要列に絞って読み込む量を減らす。"
      },
      {
        "id": "c",
        "text": "集計結果の再利用と更新間隔を要件内で見直す",
        "explanation": "同じデータを繰返し集計する頻度を下げる候補となる。"
      },
      {
        "id": "d",
        "text": "可視化側で共有する集計・取込方式を比較する",
        "explanation": "複数利用者の同じ要求を毎回独立の全計算にしない。"
      },
      {
        "id": "e",
        "text": "画面の行数だけ減らせば読取り量も必ず減るとする",
        "explanation": "表示件数とクエリが読む量は別である。"
      }
    ],
    "answers": [
      "c",
      "d"
    ],
    "explanation": "本問では「集計結果の再利用と更新間隔を要件内で見直す」「可視化側で共有する集計・取込方式を比較する」を選ぶ。同じデータを繰返し集計する頻度を下げる候補となる。 複数利用者の同じ要求を毎回独立の全計算にしない。",
    "sources": [
      {
        "title": "スキャン量最適化",
        "url": "https://docs.aws.amazon.com/athena/latest/ug/performance-tuning-data-optimization-techniques.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-062",
    "chapterId": "ch07",
    "domain": 4,
    "conceptIds": [
      "cloudfront"
    ],
    "prompt": "口座残高の個人別応答を共通キャッシュにしたところ他人の値が返った。費用より先に行う改善は。",
    "options": [
      {
        "id": "a",
        "text": "内容に影響しない追跡値をキャッシュキーから外す",
        "explanation": "同じ応答を安全に共有できる対象ではキャッシュ分断を減らす。"
      },
      {
        "id": "b",
        "text": "個人別の認証・認可と共有キャッシュ設定を修正する",
        "explanation": "情報保護を必須条件として満たしてから最適化する。"
      },
      {
        "id": "c",
        "text": "すべての利用者の認証情報を無条件に無視して共有する",
        "explanation": "個人別データでは情報漏えいを引き起こす。"
      },
      {
        "id": "d",
        "text": "ヒット率向上のため旧値を期限なく保持する",
        "explanation": "鮮度や保護条件を無視した費用削減になる。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「個人別の認証・認可と共有キャッシュ設定を修正する」を選ぶ。情報保護を必須条件として満たしてから最適化する。",
    "sources": [
      {
        "title": "CDN鮮度と要求削減",
        "url": "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-063",
    "chapterId": "ch04",
    "domain": 4,
    "conceptIds": [
      "capacity-reservation"
    ],
    "prompt": "指定AZの容量要件はなく、長期に安定して使うEC2の支払額を減らしたい。まず比較する契約は。",
    "options": [
      {
        "id": "a",
        "text": "Capacity Reservation等で容量を確保し割引は別に評価する",
        "explanation": "特定属性の起動容量と料金割引は別の目的である。"
      },
      {
        "id": "b",
        "text": "適正化後の安定利用にSavings Plans等を比較する",
        "explanation": "利用コミットメントによる割引で、余剰や対象条件を確認する。"
      },
      {
        "id": "c",
        "text": "オンデマンド予約の未使用分は常に無料とする",
        "explanation": "使わない予約容量の費用を無視している。"
      },
      {
        "id": "d",
        "text": "割引を買うと障害時のすべての容量が自動確保されるとする",
        "explanation": "割引だけでは物理容量の確保を保証しない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「適正化後の安定利用にSavings Plans等を比較する」を選ぶ。利用コミットメントによる割引で、余剰や対象条件を確認する。",
    "sources": [
      {
        "title": "容量予約の役割",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Spotの中断と容量",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Savings Plansの利用額コミットメント",
        "url": "https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-064",
    "chapterId": "ch12",
    "domain": 4,
    "conceptIds": [
      "cost-optimization"
    ],
    "prompt": "既にサイズと稼働時間を適正化し、1年以上の一定使用量が実測されている。次に比較することは。",
    "options": [
      {
        "id": "a",
        "text": "性能と可用性を測りながら不要な使用量を減らす",
        "explanation": "不要な量を残したまま契約すると未消化コミットメントを作り得る。"
      },
      {
        "id": "b",
        "text": "適正化後の基礎使用量に合う割引方式を比較する",
        "explanation": "継続する使用量が分かってから契約条件と柔軟性を評価する。"
      },
      {
        "id": "c",
        "text": "現状の最大量を測定なしに長期契約する",
        "explanation": "余剰や需要変化を無視して契約することになる。"
      },
      {
        "id": "d",
        "text": "バックアップを削除してSLOの確認もやめる",
        "explanation": "費用と交換して必要な復旧性・性能を失ってしまう。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「適正化後の基礎使用量に合う割引方式を比較する」を選ぶ。継続する使用量が分かってから契約条件と柔軟性を評価する。",
    "sources": [
      {
        "title": "容量予約の役割",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "EC2資源特性",
        "url": "https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-types.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Savings Plansの利用額コミットメント",
        "url": "https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  },
  {
    "id": "m2-065",
    "chapterId": "ch12",
    "domain": 4,
    "conceptIds": [
      "network-cost"
    ],
    "prompt": "設計Aは月100単位で単一AZ出口、Bは月130単位で各AZに出口がある。一時検証環境で単一AZ停止時の復旧待ちは許容され、他の要件はどちらも満たす。費用最小が優先。選択は。",
    "options": [
      {
        "id": "a",
        "text": "Bを選ぶ",
        "explanation": "片側障害後も出口が残る必須条件を満たす候補を先に残す。"
      },
      {
        "id": "b",
        "text": "Aを選ぶ",
        "explanation": "単一AZ依存を明示的に許容する条件なら、提示された費用で小さい方を選べる。"
      },
      {
        "id": "c",
        "text": "AのNATの帯域だけを増やす案を追加費用なしと仮定して採用する",
        "explanation": "帯域の増加はAZ依存を解消せず、提示されていない追加案の費用もゼロとは評価できない。"
      },
      {
        "id": "d",
        "text": "BのNATを1台減らし、可用性と料金は変更前のBとして比較する",
        "explanation": "出口構成を変えるなら障害範囲と見積りを再評価する必要があり、Bの条件をそのまま引き継げない。"
      }
    ],
    "answers": [
      "b"
    ],
    "explanation": "本問では「Aを選ぶ」を選ぶ。単一AZ依存を明示的に許容する条件なら、提示された費用で小さい方を選べる。",
    "sources": [
      {
        "title": "NAT配置と可用性",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html",
        "checked": "2026-10-08"
      },
      {
        "title": "NAT費用要因",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html",
        "checked": "2026-10-08"
      }
    ],
    "exam": "mock2"
  }
];
