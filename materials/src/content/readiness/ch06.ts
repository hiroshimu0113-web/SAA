import type { Lesson, Question } from '../../types';
export const lessons: Lesson[] = [
  {
    "id": "ch06-l04",
    "title": "データモデル・整合性・容量方式でDBを選ぶ",
    "analogy": "帳簿の使い方を変えずに棚の価格だけで選ぶと、必要な集計ができなくなります。",
    "explanation": "前提は主キー、SQLの結合、可用性と読み取り拡張の区別です。到達目標はデータモデルを満たす候補の中で性能と総費用を比較することです。既存SQLや複数表の結合を維持するならRDSの互換エンジンやAurora MySQL/PostgreSQL互換を比較します。AuroraはRDSファミリーの一部で、専用ストレージとレプリカを使います。キーで取得するセッションなどにはDynamoDBが候補ですが、既存の任意JOINをそのまま移せるとは考えません。DynamoDBにもトランザクションがあるので「NoSQLだから原子性がない」とは判断しません。\n\nRDS Multi-AZ DBインスタンスの単一スタンバイは同期複製と切替用で読取り先ではありません。読取り分散と遅延許容にはリードレプリカを比較し、Aurora Replicaでは読取りと昇格先の役割を持たせられます。可用性構成でも誤更新は複製されるためバックアップは別に必要です。\n\nDynamoDBオンデマンドは変動・予測困難な要求量をリクエスト単位で扱い、プロビジョンドは予測可能な継続負荷で設定容量の費用を比較します。どちらも偏ったキー、上限、急増への事前準備を無視できません。テーブル/LSIの強い整合性とGSIの結果整合性を区別します。グローバルテーブルにはMRECとMRSCがあり、複数リージョンなら常に結果整合性だと断定せず、対応リージョンと機能制約を確認します。\n\nDB費用は実行資源、ストレージ、I/O、レプリカ、バックアップ保持、転送を合算します。Aurora StandardはI/O要求も課金要素、I/O-Optimizedは読書きI/O別料金がない構成ですが実行・保存料金を含めて比較します。低I/Oで常に後者が安いとは限りません。接続増加にはProxy、繰返し読取りにはキャッシュを比較し、キャッシュの古さを許容できない取引の正本を置き換えません。",
    "diagram": [
      "要件：SQL/キーアクセス・整合性・停止許容",
      "→ DB候補 → 容量方式・HA/読取り分散",
      "→ 実行 + 保存 + I/O + レプリカ + バックアップ + 転送"
    ],
    "points": [
      "DBのデータモデルと容量課金を負荷に合わせて比較できる。",
      "Multi-AZ・読み取り拡張・バックアップを同じものと扱わない。",
      "確認：GSIで最新値必須の強い読取りを設定する？ → 不可。テーブル/キー設計を見直す。"
    ],
    "comparison": [
      {
        "name": "RDS/Aurora",
        "use": "SQLやリレーショナルな設計",
        "caution": "互換性・HA構成・I/O費用を比較"
      },
      {
        "name": "DynamoDBオンデマンド",
        "use": "キー中心で要求量が不規則",
        "caution": "上限やキー偏りは残る"
      },
      {
        "name": "DynamoDBプロビジョンド",
        "use": "予測可能な継続負荷",
        "caution": "余剰容量と増加時の追従を評価"
      }
    ],
    "conceptIds": [
      "database-selection",
      "dynamodb-on-demand",
      "rds-standby",
      "aurora-replica",
      "global-tables",
      "database-cost"
    ],
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
    ]
  }
];
export const questions: Question[] = [
  {
    "id": "rr06-01",
    "chapterId": "ch06",
    "domain": 3,
    "conceptIds": [
      "database-selection"
    ],
    "prompt": "注文システムは複数表のJOINと既存PostgreSQLアプリを大きく変えずに移す必要がある。AZ障害時の自動切替も必要。最適な出発点はどれか。",
    "options": [
      {
        "id": "a",
        "text": "RDS PostgreSQLのMulti-AZ構成で互換性と切替を検証",
        "explanation": "SQL要件を維持しAZ障害への切替を設計できる。"
      },
      {
        "id": "b",
        "text": "DynamoDBへSQLをそのままコピーする",
        "explanation": "キー中心のデータモデルに既存JOINをそのまま移せない。"
      },
      {
        "id": "c",
        "text": "単一AZのRDSで夜間スナップショットだけ設定",
        "explanation": "互換性は満たし得るが自動切替先がない。"
      },
      {
        "id": "d",
        "text": "EC2上の単一DBを大型化する",
        "explanation": "性能は上がってもAZ障害への自動切替を用意しない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "SQL要件を維持しAZ障害への切替を設計できる。 条件変更：新規のキー取得中心で不規則負荷ならDynamoDBオンデマンドも比較する。",
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
    ]
  },
  {
    "id": "rr06-02",
    "chapterId": "ch06",
    "domain": 4,
    "conceptIds": [
      "dynamodb-on-demand"
    ],
    "prompt": "イベント時だけアクセスが急増するDynamoDBアプリを設計する。要求量は予測しにくいが、更新成功直後に注文IDで最新値を確認したい。適切な選択を2つ選べ。",
    "options": [
      {
        "id": "a",
        "text": "オンデマンド容量を候補とし上限・急増条件を確認",
        "explanation": "事前の固定容量管理を減らしつつ制約を評価できる。"
      },
      {
        "id": "b",
        "text": "テーブルの注文IDを使う強い整合性の読取り",
        "explanation": "成功済み書込みを反映するテーブル読取りを選べる。"
      },
      {
        "id": "c",
        "text": "GSIへConsistentReadを指定する",
        "explanation": "GSIは強い整合性の読取りに対応しない。"
      },
      {
        "id": "d",
        "text": "キャッシュだけで常に最新値を保証する",
        "explanation": "失効や更新反映を設計しなければ古い値を返し得る。"
      },
      {
        "id": "e",
        "text": "最大想定容量を常時固定すれば必ず最安とする",
        "explanation": "低負荷時間の余剰費用を無視している。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "事前の固定容量管理を減らしつつ制約を評価できる。 成功済み書込みを反映するテーブル読取りを選べる。 条件変更：負荷が一定で予測できればプロビジョンドと料金比較する。",
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
    ]
  }
];
