import type { Lesson, Question } from '../../types';
export const lessons: Lesson[] = [
  {
    "id": "ch10-l04",
    "title": "鍵・証明書の更新と障害調査を分ける",
    "analogy": "金庫の鍵、入口の身分証明、窓口の暗証番号は更新手順も影響も違います。",
    "explanation": "前提は保存時暗号化、通信のTLS、認証情報の違いです。到達目標は更新対象ごとに旧データと接続への影響を説明することです。KMSの対応する対称暗号鍵で鍵素材をローテーションしても同じ論理キーを使い続け、旧暗号文は対応する旧素材で復号されます。既存データやデータキーを自動で再暗号化する操作ではありません。漏えいしたデータキーで保護されたデータを守り直す要件なら再暗号化等を別途検討します。\n\n新しいKMSキーを作ってエイリアスを向け替える方式では、古い暗号文の復号に旧キーが必要です。鍵を削除するとバックアップを持っていても復号できなくなる可能性があります。キー権限を最小化し、無効化・削除の前に利用先と復元手順を確認します。これはDBパスワードの更新とは異なり、Secrets ManagerのローテーションではDB側とアプリの資格情報利用の整合性が必要です。\n\nACMのDNS検証済み公開証明書を統合サービスで利用する場合、更新対象となる利用状態と検証用CNAMEの維持を確認します。CNAMEを不要と考えて消さず、更新失敗と有効期限を監視します。インポート証明書はACMによる自動更新の対象ではなく、自分で更新して再インポートします。証明書更新はKMS保存鍵やDB秘密の更新と別です。\n\n性能障害ではCloudWatchのメトリクスでいつ悪化したか、ログで詳細、X-Ray等の分散トレースでどの依存先に時間を使ったかを追います。CloudTrailの管理操作履歴だけでは1リクエスト内の遅延区間を測れません。機密値をログへ残さず、収集範囲と保持期間も設計します。",
    "diagram": [
      "保存データ → データキー → KMS（旧素材も復号に利用）",
      "TLS証明書 → ACM更新条件 / インポートなら自分で更新",
      "遅延 → メトリクス → トレースの依存区間 → ログで原因"
    ],
    "points": [
      "更新する対象と旧データ・接続への影響を説明できる。",
      "鍵ローテーションを全データ再暗号化と混同しない。",
      "確認：インポート証明書もACM任せで更新される？ → 自分で更新・再インポートする。"
    ],
    "comparison": [
      {
        "name": "KMS鍵素材更新",
        "use": "暗号操作で使う素材を更新",
        "caution": "既存データを再暗号化しない"
      },
      {
        "name": "ACM証明書更新",
        "use": "TLS接続の証明書を維持",
        "caution": "更新適格性とDNS検証を維持"
      },
      {
        "name": "分散トレース",
        "use": "要求内の依存先遅延を追う",
        "caution": "管理API監査とは異なる"
      }
    ],
    "conceptIds": [
      "kms-rotation",
      "acm-renewal",
      "tracing",
      "kms",
      "tls"
    ],
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
    ]
  }
];
export const questions: Question[] = [
  {
    "id": "rr10-01",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "kms-rotation"
    ],
    "prompt": "AWS KMS生成の対称カスタマーマネージドキーで自動ローテーションを有効にした。前年の暗号化バックアップを今後も復元したい。正しい説明を2つ選べ。",
    "options": [
      {
        "id": "a",
        "text": "同じ論理キーで旧暗号文の復号を続けられる",
        "explanation": "KMSが暗号化時の対応する鍵素材を使って復号する。"
      },
      {
        "id": "b",
        "text": "既存バックアップ自体の再暗号化は別処理である",
        "explanation": "鍵素材更新は保存済みデータを自動で再暗号化しない。"
      },
      {
        "id": "c",
        "text": "旧暗号文は更新直後にすべて読めなくなる",
        "explanation": "対応する旧素材が保持されるためこの断定は誤り。"
      },
      {
        "id": "d",
        "text": "新素材ができたので論理キーを削除してよい",
        "explanation": "復号に必要なキーを削除すると復元できなくなり得る。"
      },
      {
        "id": "e",
        "text": "DBパスワードも同時に自動変更される",
        "explanation": "KMSの鍵素材更新とDB認証情報の更新は別である。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "KMSが暗号化時の対応する鍵素材を使って復号する。 鍵素材更新は保存済みデータを自動で再暗号化しない。 条件変更：キーを作り直してエイリアスだけ変えた場合、旧キーも必要。",
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
      }
    ]
  },
  {
    "id": "rr10-02",
    "chapterId": "ch10",
    "domain": 1,
    "conceptIds": [
      "acm-renewal"
    ],
    "prompt": "ALBで使う証明書AはACM発行・DNS検証済み、証明書Bは外部CAからインポートした。期限切れを防ぐ運用として適切なのはどれか。",
    "options": [
      {
        "id": "a",
        "text": "Aは更新条件とCNAMEを維持し、Bは外部で更新して再インポートする",
        "explanation": "ACM発行とインポートでは更新責任が異なる。"
      },
      {
        "id": "b",
        "text": "AもBも設定なしで必ず自動更新される",
        "explanation": "インポート証明書はACM自動更新の対象ではない。"
      },
      {
        "id": "c",
        "text": "AのCNAMEを発行直後に削除しておく",
        "explanation": "DNS検証による更新条件を損なう。"
      },
      {
        "id": "d",
        "text": "KMSのローテーションだけを設定する",
        "explanation": "保存鍵の更新はTLS証明書の有効期限を延長しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "ACM発行とインポートでは更新責任が異なる。 期限監視と更新後の接続確認も行う。",
    "sources": [
      {
        "title": "ACMの更新対象とインポート証明書",
        "url": "https://docs.aws.amazon.com/acm/latest/userguide/managed-renewal.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DNS検証証明書の更新条件",
        "url": "https://docs.aws.amazon.com/acm/latest/userguide/dns-renewal-validation.html",
        "checked": "2026-10-08"
      }
    ]
  }
];
