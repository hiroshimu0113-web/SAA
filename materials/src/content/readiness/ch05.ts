import type { Lesson, Question } from '../../types';
export const lessons: Lesson[] = [
  {
    "id": "ch05-l04",
    "title": "IOPS・スループット・容量を切り分ける",
    "analogy": "棚の大きさ、荷物を運ぶ回数、通路を通せる総量は別です。",
    "explanation": "前提はブロック・ファイル・オブジェクトの違いです。到達目標は必要容量とI/Oの回数・大きさから性能設定を選ぶことです。IOPSは秒当たりのI/O回数、スループットは秒当たりの転送量です。学習用に16KiBを8000回/秒なら125MiB/秒、256KiBを1000回/秒なら250MiB/秒です。回数が少なくても転送量の限界に達する場合があります。\n\ngp3は保存容量と性能を別々に設定できます。容量100GiBで足りるが6000IOPSと250MiB/秒が必要なら、容量をむやみに増やさず必要な性能を設定する候補です。ボリュームの設定だけでなくEC2側のEBS帯域・IOPSやI/Oサイズ、キュー長も検証します。要求がgp3の特性に合わない低遅延・高IOPSの重要DBではio2を比較します。上限値は機種や配置によるため最新仕様を確認します。\n\n複数AZのLinuxから共有ファイルへアクセスするならRegional EFSを比較します。EFSはマウントターゲットとNFSの通信許可を必要とし、単一EBSを一般的な共有ファイルサーバーとして扱うこととは異なります。General Purpose/Max I/Oの性能モードと、Elastic/Provisioned/Burstingのスループットモードを区別し、予測しにくい負荷ではElasticを比較します。対応しない組合せや最低容量依存の挙動も仕様で確認します。",
    "diagram": [
      "I/Oサイズ × IOPS → 必要転送量",
      "アプリ → EC2のEBS上限 → ボリュームのIOPS/転送上限",
      "複数AZ Linux → 各AZのマウントターゲット → Regional EFS"
    ],
    "points": [
      "容量不足・IOPS不足・転送帯域不足を区別できる。",
      "ディスク容量を増やすだけで全種類の性能が上がるとは限らない。",
      "確認：256KiB×1000IOPSは？ → 250MiB/秒。"
    ],
    "comparison": [
      {
        "name": "gp3",
        "use": "容量と性能を個別に選ぶ",
        "caution": "EC2側の帯域制限も確認"
      },
      {
        "name": "io2",
        "use": "厳しい遅延と高IOPS",
        "caution": "必要性と追加費用を比較"
      },
      {
        "name": "Regional EFS",
        "use": "複数AZから共有NFS",
        "caution": "モードとネットワーク条件を確認"
      }
    ],
    "conceptIds": [
      "gp3",
      "provisioned-iops",
      "ebs",
      "efs",
      "storage-performance"
    ],
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
    ]
  },
  {
    "id": "ch05-l05",
    "title": "保存単価だけでストレージ階層を選ばない",
    "analogy": "倉庫の賃料が安くても、出庫のたびに費用と時間がかかります。",
    "explanation": "前提はS3のストレージクラスです。到達目標はアクセス頻度・復元待ち時間・保持期間で費用を比較することです。Standardは頻繁な利用、Standard-IAは低頻度でもミリ秒取得が必要なデータの候補です。IAには取得費や最低保存期間、小さいオブジェクトの課金条件があり、短期間だけ保存する小ファイルでは単価の低さが総額削減になりません。Glacier Flexible Retrieval/Deep Archiveは復元処理と待ち時間を許容できるか先に確認します。Glacier Instant Retrievalとの違いを省略しません。\n\n頻度が読めないデータではIntelligent-Tieringの監視費と移動対象条件を比較します。任意のアーカイブ階層を有効にすれば取り出し待ちの条件が変わります。保存GBだけでなく、PUT/GET、取得GB、移行リクエスト、早期削除、旧バージョンの保持、レプリカ側の保存も見積もります。Versioningで削除マーカーが付いても旧版の保存費が即座に消えるわけではありません。\n\n机上演習：毎日読み返すログ、年1回読む監査記録、翌日消す小画像を分け、待ち時間と最低保持条件で候補を除外してください。保存前に業務の保持義務を確認し、費用だけで削除しません。",
    "diagram": [
      "アクセス頻度・復元期限・保持義務",
      "→ 満たすクラスのみ残す",
      "→ 保存 + 要求 + 取得 + 移行 + 旧版/複製費"
    ],
    "points": [
      "保持期間と取得条件を含む総額を説明できる。",
      "最も安いGB単価が常に最安構成ではない。",
      "確認：即時取得が必須ならDeep Archiveを単独の取得元にする？ → 復元待ちが合わない。"
    ],
    "comparison": [
      {
        "name": "Standard-IA",
        "use": "低頻度・即時取得",
        "caution": "取得費・最低期間等を計算"
      },
      {
        "name": "Intelligent-Tiering",
        "use": "頻度が変動する保存",
        "caution": "監視費と対象サイズ・階層設定を確認"
      },
      {
        "name": "Deep Archive",
        "use": "長期保存・復元待ち可能",
        "caution": "即時取得の要件に不適合"
      }
    ],
    "conceptIds": [
      "standard-ia",
      "intelligent-tiering",
      "archive",
      "storage-cost",
      "noncurrent-version"
    ],
    "sources": [
      {
        "title": "S3階層のアクセス・最小期間・取得費",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
        "checked": "2026-10-08"
      }
    ]
  }
];
export const questions: Question[] = [
  {
    "id": "rr05-01",
    "chapterId": "ch05",
    "domain": 3,
    "conceptIds": [
      "gp3"
    ],
    "prompt": "EBSを使うEC2で保存容量100GiBは足りる。実測から6000IOPS・250MiB/秒が必要で、EC2側の上限には余裕がある。必要以上の容量を買わない改善はどれか。",
    "options": [
      {
        "id": "a",
        "text": "gp3の容量100GiBを維持しIOPSとスループットを必要量に設定",
        "explanation": "gp3は容量と性能を分けて設定できる。"
      },
      {
        "id": "b",
        "text": "gp3を1TiBへ増やすだけで性能設定は変えない",
        "explanation": "保存容量だけの増加では必要性能の設定にならない。"
      },
      {
        "id": "c",
        "text": "CPUだけ増やしてEBS設定は変えない",
        "explanation": "確認済みのストレージ要求に対する設定変更ではない。"
      },
      {
        "id": "d",
        "text": "同容量のHDDへ変更してIOPSを保証する",
        "explanation": "小さいランダムI/Oの要求をHDDで保証する根拠がない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "gp3は容量と性能を分けて設定できる。 条件変更：ボトルネックがEC2のEBS上限ならインスタンス側も見直す。",
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
      }
    ]
  },
  {
    "id": "rr05-02",
    "chapterId": "ch05",
    "domain": 4,
    "conceptIds": [
      "storage-cost"
    ],
    "prompt": "7年間保持する監査記録は年に数回だけ取得し、復元に12時間以上待てる。一方、直近30日分は毎日読み即時取得が必要。費用比較で適切な施策を2つ選べ。",
    "options": [
      {
        "id": "a",
        "text": "直近分と長期分を分け、長期分のアーカイブ移行を比較する",
        "explanation": "異なるアクセス要件へ同じ階層を強制せず保持条件も守れる。"
      },
      {
        "id": "b",
        "text": "移行・取得・早期削除条件を含む総額を計算する",
        "explanation": "保存単価以外の費用で結果が変わるため必要である。"
      },
      {
        "id": "c",
        "text": "直近分もDeep Archiveだけから即時配信する",
        "explanation": "復元待ちが即時取得の条件に合わない。"
      },
      {
        "id": "d",
        "text": "保持義務より先に削除して保存費だけを下げる",
        "explanation": "費用以前の必須条件である7年保持を満たさない。"
      },
      {
        "id": "e",
        "text": "低頻度なら取り出し料金は全クラスで無料と仮定する",
        "explanation": "クラスごとの取得費を無視した見積もりになる。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "異なるアクセス要件へ同じ階層を強制せず保持条件も守れる。 保存単価以外の費用で結果が変わるため必要である。 条件変更：全期間がミリ秒取得必須ならアーカイブの選択肢を変える。",
    "sources": [
      {
        "title": "S3階層のアクセス・最小期間・取得費",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
        "checked": "2026-10-08"
      }
    ]
  }
];
