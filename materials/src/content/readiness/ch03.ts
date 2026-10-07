import type { Lesson, Question } from '../../types';
export const lessons: Lesson[] = [
  {
    "id": "ch03-l04",
    "title": "NATとエンドポイントを経路・障害・費用で比較する",
    "analogy": "出口を1か所にまとめると窓口代は減っても、遠回りと閉鎖時の影響が増えます。",
    "explanation": "前提はルートテーブルとIAMの違いです。到達目標は通信先ごとに経路を描き、同じ可用性条件で費用要因を比較することです。ここではAZを指定して作るゾーン型NATを比較します。2AZの非公開EC2がAZ-AのNATだけを使うと、AZ-BからはAZをまたぐ通信が生じ、AZ-A停止時には両側の外向き通信が影響されます。各AZにNATを置き同じAZのNATへ向ける構成は出口の依存を分離しますが、NATの時間料金は増えます。\n\n月額を比較する時は、NAT台数×稼働時間×時間単価、NAT処理GB×処理単価、対象経路のAZ間転送、インターネット転送等を分けます。単価はリージョンと時点ごとに調べ、往復のデータ量と課金対象を見積もります。共有が常に安い、分散が必ず安いとは言えません。\n\n同一リージョンのS3への大量通信にはGateway endpointを比較します。対象サブネットのルートテーブルにサービス向け経路を関連付ければNATを通さず、エンドポイント自体の追加料金もありません。ただしS3の保存・要求等が無料になる意味ではありません。他の外部APIには別の出口が必要です。Interface endpointは対応サービスへのプライベートIP接続で、時間・処理量などの費用とDNS/SG設定を比較します。いずれもIAMやバケットポリシーの拒否を打ち消しません。",
    "diagram": [
      "AZ-A EC2 → NAT-A → IGW → 外部API",
      "AZ-B EC2 → NAT-B → IGW → 外部API",
      "両AZの対象ルート → S3 Gateway endpoint → 同一リージョンS3"
    ],
    "points": [
      "出口の可用性を満たしてから時間料金と通信量を比較できる。",
      "経路の追加はIAMの権限付与ではない。",
      "机上確認：AZ-Aを停止した時にBの外部APIとS3への経路をそれぞれ追う。"
    ],
    "comparison": [
      {
        "name": "共有ゾーン型NAT",
        "use": "出口数を減らす",
        "caution": "単一AZ依存とAZ間転送を評価"
      },
      {
        "name": "AZごとのゾーン型NAT",
        "use": "他AZの出口障害への依存を減らす",
        "caution": "時間料金が増える"
      },
      {
        "name": "Gateway endpoint",
        "use": "同一リージョンのS3/DynamoDB接続",
        "caution": "任意の外部APIには使えない"
      }
    ],
    "conceptIds": [
      "nat-gateway",
      "vpc-endpoint",
      "endpoint-policy",
      "network-cost"
    ],
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
    ]
  }
];
export const questions: Question[] = [
  {
    "id": "rr03-01",
    "chapterId": "ch03",
    "domain": 4,
    "conceptIds": [
      "network-cost"
    ],
    "prompt": "2AZの非公開EC2が同一リージョンのS3へ大量転送し、外部決済APIも呼ぶ。S3通信のNAT処理費を減らしつつ、片側AZ障害後も外部API接続を維持する施策を2つ選べ。",
    "options": [
      {
        "id": "a",
        "text": "S3 Gateway endpointを作り両サブネットのルートテーブルに関連付ける",
        "explanation": "対象S3通信がNATを迂回し処理費を減らせる。"
      },
      {
        "id": "b",
        "text": "各AZのゾーン型NATへ同じAZの外向き経路を設定する",
        "explanation": "片側のNATが停止しても残存AZの出口を維持できる。"
      },
      {
        "id": "c",
        "text": "S3 Gateway endpointへ外部APIのデフォルトルートも向ける",
        "explanation": "Gateway endpointは任意のインターネット宛先を中継しない。"
      },
      {
        "id": "d",
        "text": "AZ-Aのゾーン型NATだけに両AZを集約する",
        "explanation": "AZ-A停止後に残存AZの出口も失う。"
      },
      {
        "id": "e",
        "text": "S3を公開しIAM設定を削除する",
        "explanation": "公開してもNAT経路の費用問題を解消しない。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "explanation": "対象S3通信がNATを迂回し処理費を減らせる。 片側のNATが停止しても残存AZの出口を維持できる。 条件変更：外部APIが不要ならNATの撤去可能性を依存先ごとに評価する。",
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
    ]
  },
  {
    "id": "rr03-02",
    "chapterId": "ch03",
    "domain": 4,
    "conceptIds": [
      "network-cost"
    ],
    "prompt": "学習用の仮定：NAT追加の固定費は月40単位、共有時だけ発生するAZ間転送費は月60単位。他の費用と負荷は同じ。AZごとのNATへ変更すると月額はどうなるか。",
    "options": [
      {
        "id": "a",
        "text": "20単位減る",
        "explanation": "追加40から回避60を引くと差額は-20となる。"
      },
      {
        "id": "b",
        "text": "40単位増える",
        "explanation": "固定費だけを見て回避できる転送費を落としている。"
      },
      {
        "id": "c",
        "text": "60単位減る",
        "explanation": "追加するNATの固定費40を落としている。"
      },
      {
        "id": "d",
        "text": "100単位減る",
        "explanation": "増加費と削減費を両方削減として足している。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "追加40から回避60を引くと差額は-20となる。 実料金ではなく比較式の演習。転送費が10なら月30単位増えるが可用性条件は別に満たす必要がある。",
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
    ]
  }
];
