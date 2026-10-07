import type { Lesson, Question } from '../../types';
export const lessons: Lesson[] = [
  {
    "id": "ch08-l04",
    "title": "実行時間・資源・下流制約で処理基盤を選ぶ",
    "analogy": "受付を増やすだけでは、奥の作業場の処理上限を超えられません。",
    "explanation": "前提はイベント処理とコンテナです。到達目標は、実行方式を明記して時間上限・運用負荷・下流制約を比較することです。本教材で標準Lambdaと呼ぶのはManaged Instancesを使わない関数実行で、1回の上限は900秒です。公式にはManaged Instancesの非同期呼出しおよび一部イベントソースマッピングで90分の例外があります。Amazon MQ/DocumentDBを除くなど条件があるため「Lambdaはどんな方式でも15分」と覚えません。\n\n標準Lambdaで分割できない40分の既存コンテナを処理する要件なら、ECS/Fargateタスク等を比較します。多数の計算ジョブをキューへ投入し依存関係や資源の割当を管理するならAWS Batchを比較します。Batch自体が専用のCPUを提供するのではなく、対応する実行基盤と組み合わせます。\n\n標準Lambdaではメモリ設定に応じCPU配分も変わります。増やすと実行時間が短縮する場合があるため、メモリ量だけでなく実行時間との積、要求料金、p95遅延を比較します。プロビジョニング済み同時実行は初期化遅延、予約済み同時実行は枠の確保と上限で役割が違います。SQSではイベントソースの最大同時実行と関数側の枠を整合させ、下流API/DBの能力を超えないようにします。同時実行の上限だけで厳密な毎秒呼出し数を保証できるとは限りません。",
    "diagram": [
      "処理時間・分割可能性 → 標準Lambda / コンテナ / Batch",
      "SQS → 最大同時実行 → Lambda → 下流DB/API",
      "メモリ変更 → CPUと時間を計測 → 費用・遅延を比較"
    ],
    "points": [
      "実行方式と下流の上限を明示して基盤を選べる。",
      "同時実行を無制限に増やしても下流は無限に処理できない。",
      "確認：標準Lambdaの40分の1回実行は？ → 900秒上限を超える。"
    ],
    "comparison": [
      {
        "name": "標準Lambda",
        "use": "短いイベント処理",
        "caution": "900秒と同時実行・下流制約"
      },
      {
        "name": "ECS/Fargate",
        "use": "分割しにくい長時間コンテナ",
        "caution": "必要資源と終了・再試行を設計"
      },
      {
        "name": "AWS Batch",
        "use": "大量ジョブのキュー・依存・資源割当",
        "caution": "実行基盤の条件も比較"
      }
    ],
    "conceptIds": [
      "lambda",
      "lambda-concurrency",
      "lambda-memory",
      "batch",
      "fargate"
    ],
    "sources": [
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
    ]
  }
];
export const questions: Question[] = [
  {
    "id": "rr08-01",
    "chapterId": "ch08",
    "domain": 3,
    "conceptIds": [
      "lambda"
    ],
    "prompt": "既存コンテナの1ジョブは40分かかり分割できない。ホストOSの保守を減らしたい。候補のLambdaはManaged Instancesを使わない標準実行に限る。最も適するものはどれか。",
    "options": [
      {
        "id": "a",
        "text": "ECSのFargateタスクとして必要CPU・メモリを設定する",
        "explanation": "コンテナの長時間実行とホスト管理削減の条件に合う。"
      },
      {
        "id": "b",
        "text": "標準Lambdaのタイムアウトを2400秒にする",
        "explanation": "標準実行の上限900秒を超える設定にはできない。"
      },
      {
        "id": "c",
        "text": "標準Lambdaのメモリだけ増やして時間制限を解除する",
        "explanation": "メモリ設定は実行時間の上限解除ではない。"
      },
      {
        "id": "d",
        "text": "EC2へ移しホストOS保守をすべて不要とする",
        "explanation": "EC2のゲストOS保守は利用者側に残る。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "コンテナの長時間実行とホスト管理削減の条件に合う。 条件変更：数秒で終わるイベント処理なら標準Lambdaが有力候補になる。",
    "sources": [
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
    ]
  },
  {
    "id": "rr08-02",
    "chapterId": "ch08",
    "domain": 2,
    "conceptIds": [
      "lambda-concurrency"
    ],
    "prompt": "SQSを処理するLambdaが急増すると下流DBの接続上限に達する。バーストはキューで待たせてよい。必要な施策を2つ選べ。",
    "options": [
      {
        "id": "a",
        "text": "SQSイベントソースの最大同時実行を下流の能力から設定する",
        "explanation": "一度に処理する数を制限し下流への負荷を抑える。"
      },
      {
        "id": "b",
        "text": "関数の予約済み同時実行と複数イベントソースの枠を整合させる",
        "explanation": "イベントソース側だけ増やして関数の枠不足になることを避ける。"
      },
      {
        "id": "c",
        "text": "プロビジョニング済み同時実行だけでDB接続数を制限する",
        "explanation": "初期化対策であり下流接続上限の設定そのものではない。"
      },
      {
        "id": "d",
        "text": "キューを削除してすべて同期で再試行する",
        "explanation": "負荷を吸収する仕組みがなくなり下流を圧迫する。"
      },
      {
        "id": "e",
        "text": "失敗した要求を待ち時間なしで一斉再送する",
        "explanation": "再試行の集中で下流障害を悪化させる。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "一度に処理する数を制限し下流への負荷を抑える。 イベントソース側だけ増やして関数の枠不足になることを避ける。 条件変更：下流に余裕がありキュー遅延だけが問題なら制限を段階的に見直す。",
    "sources": [
      {
        "title": "SQSイベントソースの最大同時実行制御",
        "url": "https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-scaling.html",
        "checked": "2026-10-08"
      }
    ]
  }
];
