import type { Lesson, Question } from '../../types';
export const lessons: Lesson[] = [
  {
    "id": "ch11-l04",
    "title": "RTO/RPOから復旧手順と移行方式を検証する",
    "analogy": "避難先の地図だけでなく、電気・鍵・収容人数まで確かめて初めて使えます。",
    "explanation": "前提は復旧時間と失える更新の時間幅の違いです。到達目標は、方式名を覚えるだけでなく計測値で合否を判断することです。学習用にRTO30分・RPO5分の要求がある時、毎日バックアップして復元90分の構成は両方を満たしません。継続複製の遅延2分、障害検知3分、昇格5分、拡張8分、切替と動作確認6分なら、この訓練では復旧22分、失い得る更新2分で条件内です。数値はサービスの保証ではなく、実際の業務処理再開までを繰り返し測ります。\n\n復旧先で起動するインスタンスのvCPU、ENI、IPアドレス、DB、接続先の上限と実容量を事前に確認します。クォータを引き上げても物理容量の予約にはなりません。IaCとAMI・アプリの版で再現し、鍵の復号権限、秘密情報、名前解決、外部依存も復旧先で検証します。誤更新が待機先へ複製される場合に備え、独立した履歴バックアップも残します。\n\n移行ではDataSyncで対応ファイル/オブジェクトの初回・差分転送を行い、最終切替時には書込み停止、残差分、件数/整合性、戻し方を確認します。DBトランザクションの差分追随にはDMS CDCを比較し、DataSyncを同じ機能として扱いません。取引先が既存SFTPクライアントを維持したいならTransfer Familyの対応する入口を比較します。既存のNFS/SMBアプリがS3を背景に継続アクセスするならS3 File Gatewayを比較します。ローカルキャッシュと非同期アップロードを使うため、未転送データやキャッシュ障害の扱いを確認し、一括移行のDataSyncと区別します。転送路の帯域と必要な完了期限から初回移行時間を概算し、実測でプロトコルの効率を確認します。",
    "diagram": [
      "RTO/RPO要求 → 復旧候補 → 障害訓練の実測",
      "検知 → 昇格 → 拡張 → 切替 → 業務検証",
      "移行：初回転送 → 差分 → 書込み停止 → 照合 → 切替"
    ],
    "points": [
      "復旧手順の時間とデータ遅延から要件達成を評価できる。",
      "バックアップがあっても鍵・設定・容量がなければ復旧できない。",
      "確認：復元90分の方式はRTO30分を満たす？ → 満たさない。"
    ],
    "comparison": [
      {
        "name": "バックアップ復元",
        "use": "低い待機費で履歴を復元",
        "caution": "復元と再構築時間を計測"
      },
      {
        "name": "ウォームスタンバイ",
        "use": "縮小稼働系を拡張",
        "caution": "拡張の上限・容量とデータ遅延を検証"
      },
      {
        "name": "DataSync / DMS / Transfer Family",
        "use": "ファイル転送 / DB差分 / プロトコル入口",
        "caution": "利用者とデータの種類で使い分け"
      }
    ],
    "conceptIds": [
      "rto",
      "rpo",
      "restore-test",
      "recovery-quota",
      "iac",
      "datasync",
      "transfer-family", "storage-gateway"
    ],
    "sources": [
{"title":"S3 File GatewayのNFS/SMBとキャッシュ","url":"https://docs.aws.amazon.com/filegateway/latest/files3/what-is-file-s3.html","checked":"2026-10-08"},
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
    ]
  }
];
export const questions: Question[] = [
  {
    "id": "rr11-01",
    "chapterId": "ch11",
    "domain": 2,
    "conceptIds": [
      "rto"
    ],
    "prompt": "学習用の実測：RTO30分・RPO5分に対し、障害検知3分、昇格5分、拡張8分、切替と業務確認6分、直前の複製遅延2分だった。適切な評価はどれか。",
    "options": [
      {
        "id": "a",
        "text": "今回の訓練ではRTO22分・データ遅延2分で両要件内",
        "explanation": "復旧手順を合算しデータ損失の時間幅を別に評価する。"
      },
      {
        "id": "b",
        "text": "復旧は複製遅延2分だけなのでRTO2分",
        "explanation": "検知・昇格・拡張・検証の時間を無視している。"
      },
      {
        "id": "c",
        "text": "RPOは手順合計22分なので不合格",
        "explanation": "復旧の所要時間とデータ損失の時間幅を混同している。"
      },
      {
        "id": "d",
        "text": "一度成功したので今後も必ず同じ時間を保証できる",
        "explanation": "負荷・依存先・容量・変更によって実際の時間は変わる。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "復旧手順を合算しデータ損失の時間幅を別に評価する。 条件変更：拡張が20分かかれば合計34分でRTOを超える。",
    "sources": [
      {
        "title": "DR方式・IaC・復元検証の条件",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-08"
      },
      {
        "title": "容量予約とクォータの区別",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      }
    ]
  },
  {
    "id": "rr11-02",
    "chapterId": "ch11",
    "domain": 2,
    "conceptIds": [
      "recovery-quota"
    ],
    "prompt": "別リージョンの待機DBには複製済みだが、訓練でEC2増設に失敗した。復旧準備として必要な確認を2つ選べ。",
    "options": [
      {
        "id": "a",
        "text": "復旧先のサービスクォータと必要な実容量を事前確認",
        "explanation": "アカウント上限と起動可能な容量の両面を満たす。"
      },
      {
        "id": "b",
        "text": "IaC・アプリ版・鍵権限を含め業務再開まで訓練する",
        "explanation": "データだけでなく稼働に必要な依存要素を検証する。"
      },
      {
        "id": "c",
        "text": "DNSのTTLを短くすればEC2容量不足も解決する",
        "explanation": "DNS更新は計算容量や上限を増やさない。"
      },
      {
        "id": "d",
        "text": "バックアップがあるのでKMSキーを削除する",
        "explanation": "復号に必要なキーを失えばバックアップを利用できない。"
      },
      {
        "id": "e",
        "text": "クォータ増加だけで特定AZの実容量も予約済みとする",
        "explanation": "利用上限と物理容量の確保は別の条件である。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "アカウント上限と起動可能な容量の両面を満たす。 データだけでなく稼働に必要な依存要素を検証する。 条件変更：事前稼働容量だけで処理を賄えるなら障害中の新規起動への依存を減らせる。",
    "sources": [
      {
        "title": "DR方式・IaC・復元検証の条件",
        "url": "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html",
        "checked": "2026-10-08"
      },
      {
        "title": "容量予約とクォータの区別",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-reservations.html",
        "checked": "2026-10-08"
      }
    ]
  }
];
