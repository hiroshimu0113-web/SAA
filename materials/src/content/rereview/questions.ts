import type { Question } from "../../types";
export const questions: Question[] = [
  {
    "id": "nr04-01",
    "chapterId": "ch04",
    "domain": 4,
    "conceptIds": [
      "reserved-instances",
      "savings-plans"
    ],
    "prompt": "今後1年は一定の計算利用額が見込まれるが、EC2の一部をFargateへ移す。EC2以外も含む同一の割引コミットメントを比較したい。どれが適切か。",
    "options": [
      {
        "id": "a",
        "text": "Compute Savings Plans",
        "explanation": "EC2からFargateへの対象利用の変化も含め比較できる。"
      },
      {
        "id": "b",
        "text": "ゾーンRIだけを購入",
        "explanation": "EC2の指定属性への割引でFargate利用への同じ契約の適用ではない。"
      },
      {
        "id": "c",
        "text": "リージョンRIだけを購入",
        "explanation": "AZ柔軟性はあるがFargateへ適用する契約ではない。"
      },
      {
        "id": "d",
        "text": "容量予約だけを購入",
        "explanation": "容量確保と利用割引は別でありFargateも含む割引の要求を満たさない。"
      }
    ],
    "answers": [
      "a"
    ],
    "sources": [
      {
        "title": "RIの属性・期間・支払い",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Savings Plansの種類と対象",
        "url": "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html",
        "checked": "2026-10-08"
      }
    ],
    "explanation": "移行先まで含む適用範囲を確認する。容量が必要なら別の設計として扱い、長期コミットメントは適正化後の実利用で決める。"
  },
  {
    "id": "nr04-02",
    "chapterId": "ch04",
    "domain": 4,
    "conceptIds": [
      "ec2-hibernation",
      "ec2-stop"
    ],
    "prompt": "夜間停止する解析EC2は翌朝RAMの処理状態から再開したい。対応AMI・種類で休止を有効化し、暗号化EBS容量も確保済み。適切な運用と費用の説明は。",
    "options": [
      {
        "id": "a",
        "text": "休止して再開し、EBS保持費も見積る",
        "explanation": "RAMをEBSへ保存して再開し、保存費は残る。"
      },
      {
        "id": "b",
        "text": "通常停止でRAMを保ち、EBS費だけ見積る",
        "explanation": "通常停止はRAM内容を再開しない。"
      },
      {
        "id": "c",
        "text": "休止してstoppedになれば保存費もゼロとする",
        "explanation": "EBSに保存する内容の費用が残る。"
      },
      {
        "id": "d",
        "text": "終了して同じプロセスを自動再開する",
        "explanation": "終了は休止の代替ではなく、RAM状態を再開できない。"
      }
    ],
    "answers": [
      "a"
    ],
    "sources": [
      {
        "title": "EC2休止の状態保持と課金",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Hibernate.html",
        "checked": "2026-10-08"
      },
      {
        "title": "EC2の状態遷移",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html",
        "checked": "2026-10-08"
      }
    ],
    "explanation": "RAMの再開と費用削減を分け、対応条件を先に満たす。休止はバックアップの代わりではない。"
  },
  {
    "id": "nr06-01",
    "chapterId": "ch06",
    "domain": 3,
    "conceptIds": [
      "rcu",
      "wcu"
    ],
    "prompt": "学習用の容量計算。6KB項目を強いGetItemで毎秒100回読み、別の1.5KB新規項目を通常PutItemで毎秒80回書く。GSI・複製・余裕分を除く基礎容量は。",
    "options": [
      {
        "id": "a",
        "text": "200RCU・160WCU",
        "explanation": "読取りceil(6/4)×100、書込みceil(1.5/1)×80で求める。"
      },
      {
        "id": "b",
        "text": "100RCU・160WCU",
        "explanation": "100RCUはこの条件なら結果整合性の読取り相当。"
      },
      {
        "id": "c",
        "text": "200RCU・80WCU",
        "explanation": "1.5KBは1KBを超えるので書込みは1回2単位。"
      },
      {
        "id": "d",
        "text": "150RCU・120WCU",
        "explanation": "サイズの切上げを省いた計算で不足する。"
      }
    ],
    "answers": [
      "a"
    ],
    "sources": [
      {
        "title": "DynamoDBの読取り・書込み単位",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html",
        "checked": "2026-10-08"
      }
    ],
    "explanation": "平均KBの比例計算ではなく、各操作で項目サイズを単位境界へ切り上げる。"
  },
  {
    "id": "nr06-02",
    "chapterId": "ch06",
    "domain": 4,
    "conceptIds": [
      "rcu",
      "wcu"
    ],
    "prompt": "DynamoDBの単一項目読取りは結果整合性でも業務を満たし、書込みは通常PutItemのままでよい。容量・費用の見積りとして正しいものを2つ選べ。",
    "options": [
      {
        "id": "a",
        "text": "同じサイズ・読取り回数なら結果整合性は強い読取りの半分の読取り単位",
        "explanation": "整合性要件を満たす前提で比較できる。"
      },
      {
        "id": "b",
        "text": "PutItemは1KB境界へ切り上げて単位を見積る",
        "explanation": "書込みでは4KBではなく1KB単位の切上げを使う。"
      },
      {
        "id": "c",
        "text": "返す属性を半分にすればGetItemの読取り単位も必ず半分",
        "explanation": "取得する属性を減らすだけで項目サイズ計算が半分になるわけではない。"
      },
      {
        "id": "d",
        "text": "合計RCUを満たせばキーの偏りは調べなくてよい",
        "explanation": "局所的な負荷はテーブル合計の数字だけでは判定できない。"
      },
      {
        "id": "e",
        "text": "通常PutItemでも全てトランザクションの2倍係数を使う",
        "explanation": "トランザクションを使わないという明示条件と異なる見積り。"
      }
    ],
    "answers": [
      "a",
      "b"
    ],
    "sources": [
      {
        "title": "DynamoDBの読取り・書込み単位",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/read-write-operations.html",
        "checked": "2026-10-08"
      },
      {
        "title": "DynamoDBプロビジョンド容量",
        "url": "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/provisioned-capacity-mode.html",
        "checked": "2026-10-08"
      }
    ],
    "explanation": "整合性と操作種別を条件として固定したうえで、サイズ・頻度・キー分布を見積る。"
  },
  {
    "id": "nr12-01",
    "chapterId": "ch12",
    "domain": 4,
    "conceptIds": [
      "cost-explorer",
      "budgets"
    ],
    "prompt": "先月の費用増の内訳をサービス別に調べ、今月の予測額が予算を超える場合に担当者へ通知したい。最も直接的な組合せは。",
    "options": [
      {
        "id": "a",
        "text": "Cost Explorerで調査し、Budgetsで予測通知する",
        "explanation": "費用内訳の分析と条件通知をそれぞれ担う。"
      },
      {
        "id": "b",
        "text": "Budgetsの通知だけで過去の全明細を独自集計する",
        "explanation": "通知は過去明細の独自集計機能の代替ではない。"
      },
      {
        "id": "c",
        "text": "Cost Explorerの画面を見るだけで担当者への通知を設定済みとする",
        "explanation": "分析画面の閲覧だけでは要求された予測通知を構成しない。"
      },
      {
        "id": "d",
        "text": "CloudWatchのCPUアラームを予算超過通知に使う",
        "explanation": "CPU使用率と請求額の実績・予測は別の指標である。"
      }
    ],
    "answers": [
      "a"
    ],
    "sources": [
      {
        "title": "Cost Explorerの費用分析",
        "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Budgetsの実績・予測通知と遅延",
        "url": "https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html",
        "checked": "2026-10-08"
      }
    ],
    "explanation": "用途を分けて組み合わせる。Budgetsの通知には請求データ反映による遅れがある。"
  },
  {
    "id": "nr12-02",
    "chapterId": "ch12",
    "domain": 4,
    "conceptIds": [
      "cur",
      "cost-allocation"
    ],
    "prompt": "経理が複数アカウントの費用を顧客コードと独自の共有費比率で配賦する。詳細明細をS3に保存しSQL処理したい。最適な出発点は。",
    "options": [
      {
        "id": "a",
        "text": "Data ExportsのCUR 2.0と有効化した配分タグ、独自の集計処理",
        "explanation": "詳細データを保存し独自ルールと結合する用途に適する。"
      },
      {
        "id": "b",
        "text": "月額予算の通知メールだけを保存する",
        "explanation": "予算通知だけでは配賦に必要な使用明細が不足する。"
      },
      {
        "id": "c",
        "text": "EC2のCPUメトリクスだけから全サービスの請求額を求める",
        "explanation": "使用種類や割引等を含む請求明細の代替にならない。"
      },
      {
        "id": "d",
        "text": "RIを購入して配賦台帳の作成も完了とする",
        "explanation": "購入方式の変更は顧客別明細の作成や共有費の割当ではない。"
      }
    ],
    "answers": [
      "a"
    ],
    "sources": [
      {
        "title": "Cost and Usage Reportの明細",
        "url": "https://docs.aws.amazon.com/cur/latest/userguide/what-is-cur.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Data ExportsとCUR 2.0",
        "url": "https://docs.aws.amazon.com/cur/latest/userguide/what-is-data-exports.html",
        "checked": "2026-10-08"
      }
    ],
    "explanation": "明細分析と費用削減策を区別する。タグのない費用や共有費は配賦ルールを明示して処理する。"
  },
  {
    "id": "nr05-01",
    "chapterId": "ch05",
    "domain": 4,
    "conceptIds": [
      "storage-autoscaling",
      "storage-sizing"
    ],
    "prompt": "RDSの保存量は増加中で、対応するストレージ自動拡張を有効にした。月末に古い行を削除する運用で、割当容量と費用をどう計画するべきか。",
    "options": [
      {
        "id": "a",
        "text": "増加時の上限と空き容量を監視し、行削除後も割当容量が自動縮小しない前提で見積もる",
        "explanation": "自動拡張は空き不足への備えだが、縮小と費用の巻戻しまで保証しない。"
      },
      {
        "id": "b",
        "text": "行削除に比例して割当容量も自動で減る前提で、上限監視を省く",
        "explanation": "削除で論理的な空きが増えても割当済み容量は自動縮小しない。"
      },
      {
        "id": "c",
        "text": "CPU使用率だけで保存容量の不足を判断する",
        "explanation": "CPUと空き容量は別の資源指標である。"
      },
      {
        "id": "d",
        "text": "自動拡張があれば急な一括投入でも空き不足は起きないとする",
        "explanation": "拡張条件・上限・実行間隔等があり、急増を無条件に吸収する保証はない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "自動拡張は空き不足への備えだが、縮小と費用の巻戻しまで保証しない。",
    "sources": [
      {
        "title": "RDSストレージ自動拡張",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIOPS.Autoscaling.html",
        "checked": "2026-10-08"
      },
      {
        "title": "S3 Requester Pays",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/RequesterPaysBuckets.html",
        "checked": "2026-10-08"
      },
      {
        "title": "S3転送の設計",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/optimizing-performance-design-patterns.html",
        "checked": "2026-10-08"
      }
    ]
  },
  {
    "id": "nr04-03",
    "chapterId": "ch04",
    "domain": 4,
    "conceptIds": [
      "gwlb",
      "alb",
      "nlb"
    ],
    "prompt": "既存の仮想検査アプライアンスを複数台へ分散したい。HTTPのパス振分けではなく、検査装置への透過的なIPトラフィックの分配が目的である。第一候補は。",
    "options": [
      {
        "id": "a",
        "text": "Gateway Load Balancerと対応するアプライアンス・エンドポイント経路を評価する",
        "explanation": "検査アプライアンスへの透過分配という役割が一致する。装置の対応と経路の設計は別途必要。"
      },
      {
        "id": "b",
        "text": "ALBのパスルールだけで全IPトラフィックを透過分配する",
        "explanation": "HTTPのルール分岐と全IPの検査経路は異なる。"
      },
      {
        "id": "c",
        "text": "CloudFrontのキャッシュを検査装置の分配器に置き換える",
        "explanation": "コンテンツ配信キャッシュは仮想アプライアンスへの透過分配の代替ではない。"
      },
      {
        "id": "d",
        "text": "Route 53だけで既存IPフローを装置へ透過的に挿入する",
        "explanation": "DNSで宛先を選ぶ機能だけでは通信経路へ透過的に検査装置を挿入できない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "検査アプライアンスへの透過分配という役割が一致する。装置の対応と経路の設計は別途必要。",
    "sources": [
      {
        "title": "Gateway Load Balancerの役割",
        "url": "https://docs.aws.amazon.com/elasticloadbalancing/latest/gateway/introduction.html",
        "checked": "2026-10-08"
      },
      {
        "title": "EC2 Auto Scaling",
        "url": "https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html",
        "checked": "2026-10-08"
      }
    ]
  },
  {
    "id": "nr06-03",
    "chapterId": "ch06",
    "domain": 4,
    "conceptIds": [
      "database-selection",
      "database-cost"
    ],
    "prompt": "PostgreSQLの会計DBを単価の安い別エンジンへ移す案がある。拡張機能と独自SQLを利用しており、業務停止を短くしたい。移行費を含めた判断は。",
    "options": [
      {
        "id": "a",
        "text": "SQL・型・拡張の変換とアプリ修正、CDC後の切替検証を見積もり、同種移行とも総費用を比較する",
        "explanation": "実行単価だけでなく互換性の確保と移行作業の費用・停止条件を評価する。"
      },
      {
        "id": "b",
        "text": "DBインスタンス単価だけで決定し、SQL互換性は問わない",
        "explanation": "要求された業務を継続できるかと移行費用を評価していない。"
      },
      {
        "id": "c",
        "text": "CDCを有効にすれば独自SQLも自動で全て変換済みとする",
        "explanation": "データ変更の複製はアプリのSQL・拡張互換を保証しない。"
      },
      {
        "id": "d",
        "text": "索引と制約を全て削除すれば移行が速いので業務検証は省く",
        "explanation": "性能や整合性の要件を失う可能性があり、停止時間だけでは選べない。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "実行単価だけでなく互換性の確保と移行作業の費用・停止条件を評価する。",
    "sources": [
      {
        "title": "Redshift列指向ストレージ",
        "url": "https://docs.aws.amazon.com/redshift/latest/dg/c_columnar_storage_disk_mem_mgmnt.html",
        "checked": "2026-10-08"
      },
      {
        "title": "時系列DBの保持・分析",
        "url": "https://docs.aws.amazon.com/timestream/latest/developerguide/what-is-timestream.html",
        "checked": "2026-10-08"
      },
      {
        "title": "AWS DMS",
        "url": "https://docs.aws.amazon.com/dms/latest/userguide/Welcome.html",
        "checked": "2026-10-08"
      }
    ]
  },
  {
    "id": "nr07-01",
    "chapterId": "ch07",
    "domain": 4,
    "conceptIds": [
      "throttling"
    ],
    "prompt": "API Gateway配下の注文APIで429が増え、クライアントの即時無制限再試行がさらに負荷を上げている。下流の能力は今すぐ増やせない。適切な改善は。",
    "options": [
      {
        "id": "a",
        "text": "下流に合わせてレート・バーストを調整し、回数を制限したバックオフと冪等性を実装する",
        "explanation": "入口制御と再試行の集中回避、二重注文の防止を組み合わせる。"
      },
      {
        "id": "b",
        "text": "429時は待たずに全クライアントが同時再試行し続ける",
        "explanation": "過負荷時の再試行が負荷を増幅する。"
      },
      {
        "id": "c",
        "text": "入口の制限だけを解除し、下流の処理能力を超える要求も全て同時実行する",
        "explanation": "入口の拒否を減らしても下流の障害を誘発する。"
      },
      {
        "id": "d",
        "text": "予算通知を設定すれば、APIの同時実行数も厳密に制限済みとする",
        "explanation": "費用通知とAPIの流量制御は別の仕組みである。"
      }
    ],
    "answers": [
      "a"
    ],
    "explanation": "入口制御と再試行の集中回避、二重注文の防止を組み合わせる。",
    "sources": [
      {
        "title": "API Gatewayスロットリング",
        "url": "https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Site-to-Site VPN",
        "url": "https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html",
        "checked": "2026-10-08"
      }
    ]
  }
];
