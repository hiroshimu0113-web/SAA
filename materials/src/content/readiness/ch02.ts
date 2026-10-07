import type { Lesson, Question } from '../../types';
export const lessons: Lesson[] = [
  {
    "id": "ch02-l04",
    "title": "複数アカウントの統制と従業員アクセス",
    "analogy": "社員の入館証、部署の立入禁止、部屋の受付を別々に管理します。",
    "explanation": "前提はロールの信頼と権限、明示的Denyです。到達目標は、社員のログインと組織全体の権限上限を分けて構成することです。Organizationsで本番と開発のアカウントを分離し、同じ統制を適用するアカウントをOUにまとめます。本番OUへのSCPで禁止操作を定めても、社員へ権限を付与したことにはなりません。管理アカウントはSCPの制限対象ではないため、通常の業務ワークロードはメンバーアカウントへ置きます。Control Towerはランディングゾーン、アカウント払い出し、統制の適用を支援しますが、業務に必要な最小権限は別途設計します。\n\n既存の社内IdPとIdentity Centerを連携し、グループにアカウントと許可セットを割り当てます。SAMLは認証の連携、SCIMはユーザー・グループのプロビジョニングです。SAMLで認証できてもユーザーと割当がなければ目的のアカウントへアクセスできません。\n\nリソースポリシーはS3バケットなどの側からPrincipalを指定します。別アカウントのIAM主体へ直接S3アクセスを認める例では、利用元の権限とバケット側の許可をそろえ、適用されるDeny等も確認します。ロールを引き受ける方式では信頼ポリシーとAssumeRole許可を確認します。机上演習：本番OUにDenyを追加した時、既存の管理者Allowが上書きできるか追ってください。",
    "diagram": [
      "社内IdP → SAML認証 / SCIMでID同期 → Identity Center",
      "グループ → 許可セット → 開発・本番の各アカウント",
      "組織ルート → OU → アカウント：SCPは上限"
    ],
    "points": [
      "認証・権限付与・上限を別の設定として説明できる。",
      "SCPのAllowだけで操作権限を得るわけではない。",
      "確認：本番OUのDenyはメンバーの管理者Allowで解除できる？ → できない。"
    ],
    "comparison": [
      {
        "name": "SCP",
        "use": "メンバーアカウントの権限上限",
        "caution": "管理アカウントには適用されない"
      },
      {
        "name": "許可セット",
        "use": "社員のアカウント別アクセス",
        "caution": "SCPのDenyを回避しない"
      },
      {
        "name": "バケットポリシー",
        "use": "リソース側で主体を制約",
        "caution": "クロスアカウントでは利用元の許可も確認"
      }
    ],
    "conceptIds": [
      "organizations",
      "control-tower",
      "identity-center",
      "scp",
      "resource-policy"
    ],
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
    ]
  }
];
export const questions: Question[] = [
  {
    "id": "rr02-01",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "scp"
    ],
    "prompt": "本番OUのメンバーアカウントでCloudTrail停止を禁止したい。同時に社員は社内IDで複数アカウントへアクセスする。適切な施策を2つ選べ。",
    "options": [
      {
        "id": "a",
        "text": "本番OUに対象操作をDenyするSCPを適用",
        "explanation": "メンバーの管理者Allowにも権限上限が働く。"
      },
      {
        "id": "b",
        "text": "Identity Centerと社内IdPを連携しグループへ許可セットを割り当てる",
        "explanation": "従業員の認証と必要なAWSアクセスをまとめて管理できる。"
      },
      {
        "id": "c",
        "text": "SCPにAllowだけを書いて社員の権限付与を完了する",
        "explanation": "上限の設定だけでは操作権限を付与しない。"
      },
      {
        "id": "d",
        "text": "管理アカウントへ業務を集約し同じSCPで制限する",
        "explanation": "管理アカウントはSCPの制限対象ではない。"
      },
      {
        "id": "e",
        "text": "本番管理者へAdministratorAccessを付けてSCPのDenyを回避する",
        "explanation": "明示的Denyを管理者Allowで回避できない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "メンバーの管理者Allowにも権限上限が働く。 従業員の認証と必要なAWSアクセスをまとめて管理できる。 条件変更：利用者が一般消費者なら従業員向けアクセスと分けてCognito等を比較する。",
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
    ]
  },
  {
    "id": "rr02-02",
    "chapterId": "ch02",
    "domain": 1,
    "conceptIds": [
      "resource-policy"
    ],
    "prompt": "アカウントAの既存IAMロールがBのS3オブジェクトを直接読む。暗号化はSSE-S3で、SCP等の拒否はない。AのロールにはGetObjectのAllowがあるがBから拒否される。最小の追加はどれか。",
    "options": [
      {
        "id": "a",
        "text": "BのバケットポリシーでAの対象ロールへ対象プレフィックスのGetObjectを許可",
        "explanation": "クロスアカウントのリソース側の許可を具体的な主体と範囲へ付与する。"
      },
      {
        "id": "b",
        "text": "Aのロールに同じAllowをもう1件付ける",
        "explanation": "利用元の許可を重ねてもB側の許可は追加されない。"
      },
      {
        "id": "c",
        "text": "BのSCPにS3のAllowを追加する",
        "explanation": "SCPはバケットへのアクセス権を付与しない。"
      },
      {
        "id": "d",
        "text": "Bのバケットを暗号化し直す",
        "explanation": "保存時暗号化とクロスアカウント認可は別の判断である。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "クロスアカウントのリソース側の許可を具体的な主体と範囲へ付与する。 条件変更：SSE-KMSならKMSキー側の利用許可も確認する。",
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
    ]
  }
];
