import type { Lesson, Question } from '../../types';
export const lessons: Lesson[] = [
  {
    "id": "ch12-l04",
    "title": "取り込み頻度から可視化までを設計する",
    "analogy": "収集箱、整理台、集計机、掲示板の間で、いつ何が届くかを決めます。",
    "explanation": "前提はS3の保存、SQL、ストリームとバッチの違いです。到達目標は到着速度・必要鮮度・再処理・権限から分析経路を選ぶことです。翌朝までに集計できればよい日次ファイルはS3へ収集し、Glue等で型を整え、Parquet等の列形式と日付パーティションを使ってAthenaで必要部分だけ読みます。ダッシュボードにはQuickSight等で対応データソースを接続します。インポート型の更新間隔を決めずに最新データと表示してはいけません。\n\n複数の処理者が独立に読み、保持期間内に再読込する秒単位のストリームはKinesis Data Streamsを比較します。S3等への配信管理を減らし、バッファ待ちを許容するならData Firehoseを比較します。Firehoseのバッファ設定は配信の遅延とオブジェクト数へ影響し、サブ秒応答を無条件に保証しません。独立した長期リプレイの基盤として同一視しないことが重要です。\n\n分析者へS3全体の管理権限を与える代わりに、IAM・S3・KMSの必要権限と、Lake Formationで管理するテーブル/列等の権限を整理します。Glue Data Catalogはスキーマや場所のメタデータであり、データ本体の移動や全権限付与を自動で行うものではありません。業務DBの重い集計を切り離すならRedshift等も比較し、SQL要件、同時実行、鮮度、運用費を測定します。",
    "diagram": [
      "日次ファイル → S3 → Glueで整形/カタログ → Athena → 可視化",
      "継続イベント → Kinesis → 独立コンシューマー/再読込",
      "配信重視 → Firehoseのバッファ → S3等 → 権限制御"
    ],
    "points": [
      "頻度・鮮度・再読込の要件から取り込み経路を選べる。",
      "カタログ登録だけではデータ転送やアクセス許可は完了しない。",
      "確認：数分の配信待ちを許容できない時にFirehoseだけで保証してよい？ → 遅延要件から再比較する。"
    ],
    "comparison": [
      {
        "name": "Kinesis Data Streams",
        "use": "独立した処理・保持期間内の再読込",
        "caution": "キー分散と容量・遅延を評価"
      },
      {
        "name": "Data Firehose",
        "use": "対応先への管理された配信",
        "caution": "バッファ待ちと配信先条件"
      },
      {
        "name": "Athena + QuickSight",
        "use": "S3のSQL分析と可視化",
        "caution": "スキャン量・権限・更新頻度を設計"
      }
    ],
    "conceptIds": [
      "analytics-pipeline",
      "kinesis",
      "firehose",
      "athena",
      "glue",
      "lake-formation",
      "quicksight"
    ],
    "sources": [
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
        "title": "Athenaのパーティション・列形式・読込削減",
        "url": "https://docs.aws.amazon.com/athena/latest/ug/performance-tuning-data-optimization-techniques.html",
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
    ]
  },
  {
    "id": "ch12-l05",
    "title": "可用性を満たす候補の総費用を比較する",
    "analogy": "定期券の割引率より先に、必要な移動回数と区間を確かめます。",
    "explanation": "前提は第3・5・6章の費用要因です。到達目標は必要条件を守ったまま、使う量の削減と単価の割引を分けて評価することです。比較表には稼働時間、容量、IOPS、転送GB、要求数、バックアップ保持、レプリカ、運用負荷を並べます。通貨やリージョン、比較月、可用性条件を合わせ、固定費だけの比較を避けます。\n\n学習用にDB構成Aは実行と保存100単位＋I/O60単位、構成Bは実行と保存140単位でI/O別料金なしなら、同じ要件を満たす場合Bが20単位安くなります。I/Oが10単位ならAが30単位安く、負荷条件で結論が変わります。これは実際のAWS単価ではありません。使用量を測り、Auroraの保存構成やDynamoDB容量方式を比較する練習です。\n\nNATの時間料金削減のため出口を1AZへ集約する提案は、AZ障害でも処理継続という条件なら先に除外します。同一リージョンS3への転送はGateway endpoint、画像配信はキャッシュを比較します。DBバックアップやS3旧版を削減する時も保持義務と復旧可能性を維持します。安定利用への割引は、不要な容量を適正化した後に比較し、余剰コミットメントを作らないようにします。",
    "diagram": [
      "必須条件で除外 → 使用量を測る → 同じ条件で見積もる",
      "候補A: 100 + I/O60 = 160 / 候補B: 140",
      "負荷変更: A 100 + I/O10 = 110 → 選択が逆転"
    ],
    "points": [
      "費用の式と必須条件を使って候補を比較できる。",
      "最安案でも復旧や保持条件を満たさなければ選ばない。",
      "確認：I/Oが少ない時もI/O別料金なしが常に安い？ → 固定費込みで比較する。"
    ],
    "comparison": [
      {
        "name": "利用量削減",
        "use": "不要処理・全走査・余剰資源を減らす",
        "caution": "保持や性能の必須条件を維持"
      },
      {
        "name": "購入方式変更",
        "use": "安定利用を割引",
        "caution": "未消化コミットメントに注意"
      },
      {
        "name": "経路変更",
        "use": "不要なNAT/AZ間転送を減らす",
        "caution": "可用性・認可を維持"
      }
    ],
    "conceptIds": [
      "cost-optimization",
      "database-cost",
      "network-cost",
      "storage-cost"
    ],
    "sources": [
      {
        "title": "NAT経路の費用要因",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Auroraの実行・保存・I/O課金",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/User_DBInstanceBilling.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DynamoDBの容量課金",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html",
        "checked": "2026-10-08"
      },
      {
        "title": "S3保存階層の取得・保持条件",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
        "checked": "2026-10-08"
      }
    ]
  }
];
export const questions: Question[] = [
  {
    "id": "rr12-01",
    "chapterId": "ch12",
    "domain": 3,
    "conceptIds": [
      "analytics-pipeline"
    ],
    "prompt": "センサーイベントを複数アプリが独立に数秒単位で処理し、翌日に保持期間内のデータを再読込したい。最も合う取り込み方式はどれか。",
    "options": [
      {
        "id": "a",
        "text": "Kinesis Data Streamsで保持期間とコンシューマーを設計",
        "explanation": "独立した読取りとストリーム再読込の要件に対応できる。"
      },
      {
        "id": "b",
        "text": "FirehoseからS3へのバッファ配信だけで即時処理を保証",
        "explanation": "配信待ちがあり独立ストリーム処理と同じ保証ではない。"
      },
      {
        "id": "c",
        "text": "単一SQSを全アプリが競合して読む",
        "explanation": "全アプリへ同じ全イベントを独立配信する構成ではない。"
      },
      {
        "id": "d",
        "text": "日次バッチのCSVだけを翌朝公開する",
        "explanation": "数秒単位の処理という鮮度の要件を満たさない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "独立した読取りとストリーム再読込の要件に対応できる。 条件変更：数分待ててS3配信管理を減らしたいならFirehoseを比較する。",
    "sources": [
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
        "title": "Athenaのパーティション・列形式・読込削減",
        "url": "https://docs.aws.amazon.com/athena/latest/ug/performance-tuning-data-optimization-techniques.html",
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
    ]
  },
  {
    "id": "rr12-02",
    "chapterId": "ch12",
    "domain": 4,
    "conceptIds": [
      "athena"
    ],
    "prompt": "日次の売上ログをS3で保持し、Athenaでは直近1日・特定列だけ集計する。結果は翌朝のダッシュボードに使う。費用と読取り量を減らす施策を2つ選べ。",
    "options": [
      {
        "id": "a",
        "text": "日付でパーティション分割しクエリで日付を絞る",
        "explanation": "対象期間のデータだけを読む設計にできる。"
      },
      {
        "id": "b",
        "text": "必要に応じParquet等の列形式へ変換する",
        "explanation": "対象列の読込みを減らす設計にできる。"
      },
      {
        "id": "c",
        "text": "毎回SELECT *で全期間を走査する",
        "explanation": "必要量以上を読み速度とスキャン費を増やす。"
      },
      {
        "id": "d",
        "text": "日付で絞らず、全件走査後の画面表示だけを直近1日にする",
        "explanation": "表示段階の絞込みだけではSQLが読み込む対象量を減らせない。"
      },
      {
        "id": "e",
        "text": "小さいCSVをさらに細分化しファイル数を大幅に増やす",
        "explanation": "小ファイル数の増大は処理負担を増やし必要列の読込み削減にもならない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "対象期間のデータだけを読む設計にできる。 対象列の読込みを減らす設計にできる。 条件変更：頻繁な多次元集計と高同時実行ならデータウェアハウスも実測比較する。",
    "sources": [
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
        "title": "Athenaのパーティション・列形式・読込削減",
        "url": "https://docs.aws.amazon.com/athena/latest/ug/performance-tuning-data-optimization-techniques.html",
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
    ]
  },
  {
    "id": "rr12-03",
    "chapterId": "ch12",
    "domain": 4,
    "conceptIds": [
      "database-cost"
    ],
    "prompt": "学習用の見積り：同じ性能・可用性のDB構成Aは固定100単位＋I/O60単位、Bは固定140単位でI/O別料金なし。現在最安の候補と、I/Oが10単位に減る場合の候補はどれか。",
    "options": [
      {
        "id": "a",
        "text": "現在B、減少後A",
        "explanation": "現在160対140でB、減少後110対140でAとなる。"
      },
      {
        "id": "b",
        "text": "どちらもB",
        "explanation": "低I/O時のAの総額110を比較から落としている。"
      },
      {
        "id": "c",
        "text": "どちらもA",
        "explanation": "現在AのI/O込み160はBの140より高い。"
      },
      {
        "id": "d",
        "text": "現在A、減少後B",
        "explanation": "合計費用の大小を逆に評価している。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "現在160対140でB、減少後110対140でAとなる。 仮定の単位でありAWSの実料金表ではない。実際は構成ごとの全費用を見積もる。",
    "sources": [
      {
        "title": "NAT経路の費用要因",
        "url": "https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Auroraの実行・保存・I/O課金",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/User_DBInstanceBilling.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DynamoDBの容量課金",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html",
        "checked": "2026-10-08"
      },
      {
        "title": "S3保存階層の取得・保持条件",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html",
        "checked": "2026-10-08"
      }
    ]
  }
];
