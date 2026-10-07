import type { Lesson, Question } from '../../types';
export const lessons: Lesson[] = [
  {
    "id": "ch09-l04",
    "title": "キューの増加率・回復時間・重複を計算する",
    "analogy": "待合室を大きくしても診察速度は上がりません。到着と処理の差を測ります。",
    "explanation": "前提は受信、不可視、成功後削除の流れです。到達目標はキューを置くだけで解決とせず、待ち時間と下流上限から処理能力を決めることです。学習用に到着120件/秒、ワーカー1台20件/秒で4台なら、処理80件/秒に対し40件/秒ずつ増え、5分で12000件たまります。8台へ増やせば160件/秒になり、到着が120のままなら差の40件/秒で減り、滞留解消にはさらに300秒かかります。下流が100件/秒までなら増員だけでは解決せず、受付制御・まとめ処理・下流拡張を検討します。\n\nメッセージ数だけでなく最古の待ち時間、1台当たりバックログ、失敗率、DLQを観測します。可視性タイムアウトを処理より短くすると同時再処理を招き、長すぎると障害時の再受信を遅らせます。独自ワーカーでは必要に応じ延長し、Lambda連携では関数タイムアウトとバッチ待機を含むサービス固有の推奨条件も確認します。\n\n決済後に削除だけ失敗すると再受信され得るので、注文IDの記録と副作用を整合させた冪等設計が必要です。Lambdaの部分バッチ応答は失敗項目だけを再処理させるために使えますが、成功項目に対する冪等性も捨てません。DLQは成功扱いの箱ではありません。原因修正後に負荷を制限して再投入し、業務結果を照合します。",
    "diagram": [
      "到着120/秒 → キュー → 4台×20/秒：毎秒40増加",
      "8台×20/秒 → 差分40/秒で滞留を解消",
      "成功→削除 / 失敗→再試行→DLQ→修正・再投入"
    ],
    "points": [
      "到着率と処理率の差から滞留と回復時間を計算できる。",
      "FIFOや可視性タイムアウトだけで決済の副作用を一度に限定できるとは限らない。",
      "確認：8台でも下流上限100/秒なら120/秒の到着を処理し切れる？ → できない。"
    ],
    "comparison": [
      {
        "name": "ワーカー増員",
        "use": "処理率を上げる",
        "caution": "下流上限を超えない"
      },
      {
        "name": "部分バッチ応答",
        "use": "成功済み項目の不要な再処理を減らす",
        "caution": "失敗IDを正しく返す"
      },
      {
        "name": "DLQ再投入",
        "use": "修正後に業務を回復",
        "caution": "無制限の再投入は再障害を招く"
      }
    ],
    "conceptIds": [
      "queue-scaling",
      "visibility-timeout",
      "idempotency",
      "dlq",
      "partial-batch"
    ],
    "sources": [
      {
        "title": "SQSの不可視期間・再受信と削除",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-08"
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
    ]
  }
];
export const questions: Question[] = [
  {
    "id": "rr09-01",
    "chapterId": "ch09",
    "domain": 2,
    "conceptIds": [
      "queue-scaling"
    ],
    "prompt": "学習用の仮定：SQS到着率120件/秒、処理能力80件/秒で5分経過した。その後160件/秒へ増強した。到着は120件/秒のまま、初期滞留ゼロなら、増強後の解消時間はどれか。",
    "options": [
      {
        "id": "a",
        "text": "300秒",
        "explanation": "滞留40×300=12000件を差分160-120=40件/秒で解消する。"
      },
      {
        "id": "b",
        "text": "75秒",
        "explanation": "到着が継続する条件を落とし12000÷160と計算している。"
      },
      {
        "id": "c",
        "text": "100秒",
        "explanation": "処理率と到着率の差を使っていない。"
      },
      {
        "id": "d",
        "text": "解消しない",
        "explanation": "増強後は到着率より処理率が高く有限時間で減る。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "滞留40×300=12000件を差分160-120=40件/秒で解消する。 条件変更：増強後に新規到着ゼロなら12000÷160=75秒。",
    "sources": [
      {
        "title": "SQSの不可視期間・再受信と削除",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-08"
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
    ]
  },
  {
    "id": "rr09-02",
    "chapterId": "ch09",
    "domain": 2,
    "conceptIds": [
      "idempotency"
    ],
    "prompt": "SQSから受けた注文で決済成功後にワーカーが停止し、メッセージ削除に失敗した。再処理しても二重請求しないために妥当な対策を2つ選べ。",
    "options": [
      {
        "id": "a",
        "text": "決済APIへ同じ注文IDを冪等キーとして渡す",
        "explanation": "再試行を同じ業務操作として識別できるようにする。"
      },
      {
        "id": "b",
        "text": "処理済み状態と決済結果を照合して成功後に削除する",
        "explanation": "重複受信時に新規決済を繰り返さず結果を確認できる。"
      },
      {
        "id": "c",
        "text": "受信した直後に必ず削除し、その後で決済する",
        "explanation": "途中停止で未決済の注文が失われる危険がある。"
      },
      {
        "id": "d",
        "text": "可視性タイムアウトを延ばせば重複が絶対なくなるとする",
        "explanation": "削除失敗や重複配信への業務上の対策は残る。"
      },
      {
        "id": "e",
        "text": "DLQへ移した時点で決済成功と記録する",
        "explanation": "隔離は業務の成功を意味しない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "再試行を同じ業務操作として識別できるようにする。 重複受信時に新規決済を繰り返さず結果を確認できる。 実装では処理済みフラグと外部決済の間のクラッシュも考慮し、外部APIの冪等性を検証する。",
    "sources": [
      {
        "title": "SQSの不可視期間・再受信と削除",
        "url": "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html",
        "checked": "2026-10-08"
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
    ]
  }
];
