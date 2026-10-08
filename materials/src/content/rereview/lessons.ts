import type { Lesson } from "../../types";
export const lessons: Lesson[] = [
  {
    "id": "ch04-l05",
    "title": "購入方式は適用範囲・契約期間・容量確保で比較する",
    "analogy": "定期券は移動費を割り引きますが、座席指定とは別です。",
    "explanation": "前提はEC2の従量課金とSpot中断です。目標は、安定利用の割引と起動容量の確保を区別し、変更予定に合う購入方式を選ぶことです。Reserved Instances（RI）は別種の仮想サーバーではなく、適合する実行使用量への割引です。1年・3年、前払い方式、属性、Standard/Convertible等を比較します。使わない時間が増えても契約の支払いは残り得ます。\n\nリージョンRIは指定リージョン内の対象使用に割引を適用しますが容量を予約しません。ゾーンRIは指定AZの一致する属性の容量も予約します。サイズ柔軟性はOS・テナンシー等の条件付きで、全RI共通ではありません。別途Capacity Reservationを使う設計でも割引と容量を分けて評価します。\n\nSavings Plansは一定の対象利用額/時をコミットする割引です。Compute Savings PlansはEC2のファミリーやリージョン変更、FargateやLambdaへの移行も対象範囲内で柔軟です。EC2 Instance Savings Plansは指定ファミリー・リージョンに範囲を絞ります。どちらも単独で指定AZの容量を確保するものではありません。既存EC2を半年後にFargateへ移す計画ならCompute Savings Plansを比較し、移行後の利用額も見積ります。購入前に不要な稼働時間とサイズを削り、安定した基礎使用量だけを契約候補にします。Database Savings Plans等も別の対象範囲を持つため、Computeの割引をDBへ流用しません。",
    "diagram": [
      "利用実測 → 不要な時間・サイズを削減",
      "残る安定利用 → RI / Savings Plansの適用範囲を比較",
      "指定AZの容量要件 → ゾーンRI / Capacity Reservation等を別途評価"
    ],
    "points": [
      "確認：Compute Savings PlansだけでAZの台数を保証できる？ → 容量確保を別途検討する。",
      "確認：EC2からFargateへ移るなら全てのRI割引を持ち越せる？ → EC2 RIの適用対象ではない。",
      "前払いの有無だけでなく、契約期間の総額・利用率・変更予定で判断する。"
    ],
    "comparison": [
      {
        "name": "リージョンRI",
        "use": "対象EC2の継続使用への割引",
        "caution": "容量予約はない。属性と柔軟性の条件を確認"
      },
      {
        "name": "ゾーンRI",
        "use": "指定AZの対象EC2使用と容量",
        "caution": "AZ・種類等の一致が必要"
      },
      {
        "name": "Compute Savings Plans",
        "use": "EC2/Fargate/Lambda間も含む対象利用の割引",
        "caution": "利用額コミットメントと容量は別"
      }
    ],
    "conceptIds": [
      "reserved-instances",
      "savings-plans",
      "capacity-reservation"
    ],
    "sources": [
      {
        "title": "RIの属性・期間・支払い",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html",
        "checked": "2026-10-08"
      },
      {
        "title": "RIのリージョン・AZスコープ",
        "url": "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/reserved-instances-scope.html",
        "checked": "2026-10-08"
      },
      {
        "title": "Savings Plansの種類と対象",
        "url": "https://docs.aws.amazon.com/savingsplans/latest/userguide/plan-types.html",
        "checked": "2026-10-08"
      }
    ]
  },
  {
    "id": "ch04-l06",
    "title": "停止と休止を状態保持・再開時間・残る費用で選ぶ",
    "analogy": "普通の閉店は作業台を片付け、休止は作業途中の状態を保管して再開します。",
    "explanation": "EBS-backed EC2を通常停止するとEBSのデータは保持できますが、RAM上のプロセス状態は復元しません。次の起動ではOSとアプリの起動をやり直します。休止（hibernation）はRAM内容をEBSルートへ保存し、再開時に戻します。毎朝大きな作業集合を作る解析端末で、夜間は使わず、プロセス状態の再開が必要なら比較対象になります。\n\n休止は有効化済みで、OS・AMI・インスタンスタイプ・RAM・暗号化ルート容量等の対応条件を満たす必要があります。どのEC2でも後から無条件に使えるわけではありません。休止によりstoppedになった期間のインスタンス実行料金は止まっても、EBSに保持するRAM分を含む保存費は残ります。休止の保存処理中など状態遷移も見積りに含めます。割引契約の支払いが停止と連動して消えるわけでもありません。\n\n作業結果は別途永続化し、休止だけをバックアップやAZ障害対策にしません。再起動・停止・休止・終了で何を残すかを分け、再開時間を実測します。終了後のEBS保持はDeleteOnTermination等の設定を確認します。",
    "diagram": [
      "通常停止 → RAMは保存しない → 起動・初期化",
      "休止 → RAMを対応EBSへ保存 → 再開",
      "どちらもEBS等の保持費・契約費を別に確認"
    ],
    "points": [
      "確認：停止だけでRAMの計算途中から再開する？ → しない。",
      "確認：休止中のEBSは無料？ → 保持するストレージの費用は残る。"
    ],
    "comparison": [
      {
        "name": "停止",
        "use": "初期化し直せる夜間未使用環境",
        "caution": "RAM状態を保持しない"
      },
      {
        "name": "休止",
        "use": "長い初期化後の状態を再開",
        "caution": "対応条件とRAMを保存する容量が必要"
      },
      {
        "name": "終了",
        "use": "不要な実行環境を廃止",
        "caution": "保持するボリュームとデータの設定を確認"
      }
    ],
    "conceptIds": [
      "ec2-hibernation",
      "ec2-stop",
      "ec2"
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
    ]
  },
  {
    "id": "ch06-l05",
    "title": "RCU/WCUを項目サイズと整合性から見積もる",
    "analogy": "荷物の個数だけでなく、規定の箱に何箱分入るかで必要な便数が変わります。",
    "explanation": "前提はDynamoDBのキーによるアクセスと容量方式です。プロビジョンド容量ではRCU（Read Capacity Unit）とWCU（Write Capacity Unit）を毎秒の処理能力として指定します。単一項目GetItemではサイズを4KB単位で切り上げ、強い整合性はその単位数、結果整合性は半分、トランザクション読取りは2倍として見積ります。通常の書込みは項目サイズを1KB単位で切り上げ、トランザクション書込みは2倍です。\n\n学習用の前提：各6KBの項目をGetItemで毎秒100回強く読むなら、ceil(6/4)×100＝200RCU。結果整合性なら100RCUです。各1.5KBの新規項目をPutItemで毎秒80回書くならceil(1.5/1)×80＝160WCU。トランザクション書込みなら320WCUです。更新は変更した属性サイズだけでなく、更新前後の大きい項目サイズを基準にします。これらはインデックス・複製等を除いた基礎計算です。\n\n実環境ではGSIの書込み、ピーク、再試行、キー偏り、必要な余裕も見ます。テーブル合計の容量を増やすだけではホットキーを解決できません。Scan後のフィルターやProjectionExpressionで返す属性を減らしても、そのまま消費単位が減るとは限りません。オンデマンドでもデータサイズや整合性は要求単位と費用に影響します。予測可能な使用量はプロビジョンド＋Auto Scaling、不規則な使用量はオンデマンドを比較し、上限や急増特性も確認します。",
    "diagram": [
      "1項目サイズを切り上げ → 整合性・トランザクション倍率",
      "1操作の単位 × 毎秒操作数 → 基礎RCU/WCU",
      "インデックス・偏り・ピーク → 追加余裕と監視"
    ],
    "points": [
      "確認：6KBを強く毎秒50回読む → 100RCU。結果整合性なら50RCU。",
      "確認：1.5KBを通常毎秒20回書く → 40WCU。トランザクションなら80WCU。",
      "Query/Scan/Batchは操作別の計算がある。単一GetItemの式をそのまま全APIに流用しない。"
    ],
    "comparison": [
      {
        "name": "強い整合性の単一読取り",
        "use": "4KBごとに1単位",
        "caution": "項目ごとの切上げを考慮"
      },
      {
        "name": "結果整合性の単一読取り",
        "use": "同じサイズの強い読取りの半分",
        "caution": "最新値が必須なら置換できない"
      },
      {
        "name": "通常書込み",
        "use": "1KBごとに1単位",
        "caution": "トランザクションは2倍、GSI等は別"
      }
    ],
    "conceptIds": [
      "rcu",
      "wcu",
      "dynamodb-capacity",
      "dynamodb"
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
    ]
  },
  {
    "id": "ch12-l06",
    "title": "費用の調査・予算通知・配賦分析を使い分ける",
    "analogy": "家計簿を見る、予算超過に気付く、領収書を部門へ配る作業は別です。",
    "explanation": "Cost Explorerはサービス・アカウント・タグ等で費用と使用量を可視化し、増加の原因や傾向を調べる入口です。AWS Budgetsは実績や予測が予算条件へ達したことを通知します。通知にはデータ反映の遅れがあり、予算値を設定しただけで支出を必ずその金額に止めるものではありません。必要な自動アクションは別途設定し、停止の業務影響も検討します。\n\nCost and Usage Report（CUR）はS3へ詳細な使用・費用明細を渡し、独自の配賦ルールやAthena等の分析に使えます。新規ではData ExportsのCUR 2.0が推奨されており、列・行を選んで出力できます。部署コード等のコスト配分タグを有効化し、複数アカウントの請求と組み合わせます。タグが付いていない費用や共有費の配賦ルールも必要です。\n\n例：先月増えたNAT費をまずCost Explorerで確認する。月末の予測が予算を超える場合はBudgetsで担当者へ通知する。顧客別の共有費を独自比率で配る経理処理はCUR明細と台帳を使う。ツールを1つ選んだだけで最適化は完了しないので、使用量の原因と性能・可用性の制約を確認して設計を変更します。",
    "diagram": [
      "費用増加の発見 → Cost Explorerで分析",
      "実績・予測と予算比較 → Budgetsで通知",
      "詳細明細をS3へ → CUR 2.0と独自配賦"
    ],
    "points": [
      "確認：予算通知は支出の即時・絶対上限？ → 遅れがあり、通知だけでは停止しない。",
      "確認：明細を独自ルールで集計したい → CUR / Data Exportsを比較する。"
    ],
    "comparison": [
      {
        "name": "Cost Explorer",
        "use": "傾向・内訳を画面で調べる",
        "caution": "通知や独自明細処理と分ける"
      },
      {
        "name": "AWS Budgets",
        "use": "実績・予測等を条件に通知",
        "caution": "反映遅れと別設定のアクションを考慮"
      },
      {
        "name": "CUR / CUR 2.0",
        "use": "詳細明細を保存して独自分析",
        "caution": "分析処理・権限・配賦ルールが必要"
      }
    ],
    "conceptIds": [
      "cost-explorer",
      "budgets",
      "cur",
      "cost-allocation"
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
      },
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
    ]
  },
  {
    "id": "ch05-l06",
    "title": "保存量の増加・転送単位・費用負担を見積もる",
    "analogy": "倉庫の面積、荷物を送る便数、運賃を払う人は別の設計です。",
    "explanation": "現在の使用量だけでなく、増加量×保持期間、版・ログ・バックアップ・作業領域を含めて容量を見積ります。例えば毎日10GiB増え90日保持なら生データだけで900GiBであり、索引等と余裕は別です。S3のように利用分が増えるサービスと、割当容量を持つストレージを区別します。RDSのストレージ自動拡張は増加を吸収する手段ですが、上限、拡張条件、急増時の空き不足を監視します。割当済み容量は自動で縮まないため、CPUのAuto Scalingと同一視しません。\n\n小さなログを一定時間まとめて送る案は要求回数を減らせますが、待ち時間、再送範囲、個別検索や削除の粒度が変わります。即時処理が必要ならまとめる時間を短くします。大きなファイルのMultipart uploadは失敗部分の再送に有効ですが、複数の小ファイルを1オブジェクトへまとめる処理とは別です。圧縮・バッチ化・転送経路・移行サービスの処理費を合計し、S3 Gateway endpointやDataSync等を要件で比較します。\n\nRequester Paysは、対応するS3要求とダウンロードの費用負担を要求者へ分ける設定です。バケット所有者の保存費までなくなりません。匿名利用には対応せず、要求者の認証と課金への同意が必要です。これはAWS全体の請求額を消す最適化ではなく、誰が負担するかの設計です。",
    "diagram": [
      "増加量 × 保持期間 ＋ 世代・索引・余裕 → 容量",
      "即時性・検索粒度 → 個別転送 / バッチ化",
      "経路・サービス処理費・要求回数 → 転送総費用"
    ],
    "points": [
      "確認：RDSのデータを消したら割当容量も自動縮小？ → しない。",
      "確認：1分の鮮度が必要なログを1時間まとめる？ → 要件違反。"
    ],
    "comparison": [
      {
        "name": "容量の自動拡張",
        "use": "空き容量減少に対応",
        "caution": "最大値と急増、縮小不可を確認"
      },
      {
        "name": "バッチ化",
        "use": "要求回数を減らす",
        "caution": "鮮度と検索・再送の単位が変わる"
      },
      {
        "name": "Requester Pays",
        "use": "利用者へ対象費用を配分",
        "caution": "所有者の保存費と匿名不可を考慮"
      }
    ],
    "conceptIds": [
      "storage-sizing",
      "storage-autoscaling",
      "batch-upload",
      "requester-pays",
      "storage-cost"
    ],
    "sources": [
      {
        "title": "S3 Requester Pays",
        "url": "https://docs.aws.amazon.com/AmazonS3/latest/userguide/RequesterPaysBuckets.html",
        "checked": "2026-10-08"
      },
      {
        "title": "RDSストレージ自動拡張",
        "url": "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIOPS.Autoscaling.html",
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
    "id": "ch04-l07",
    "title": "負荷分散の役割と増減方法を費用へ結び付ける",
    "analogy": "受付の分岐、荷物の中継、保安検査の分配を同じ窓口とは考えません。",
    "explanation": "ALBはHTTPのホストやパスなどアプリ層の条件で振り分け、NLBはTCP/UDP等の接続を扱います。Gateway Load Balancerは仮想ファイアウォール等へ通信を透過的に分配する用途で、一般Webのパス振分けを安く置き換えるものではありません。導入する負荷分散器・アプライアンス・経路と転送の費用まで比較します。\n\n水平拡張は台数を増やして分散するため、状態共有や下流容量が前提です。垂直拡張は1台のCPU・メモリ等を増やし、アプリ変更が少ない一方で上限や切替影響を確認します。夜間不要な開発機なら停止・対応する休止、本番の継続要求があれば最低台数を維持した増減を選びます。CPU負荷にメモリだけを足すなど、ボトルネックと違う資源を買わないことが先です。EC2・Fargate・Lambdaは実行時間、制約、管理負担と使用量を合わせて比較します。",
    "diagram": [
      "HTTPの条件分岐 → ALB",
      "TCP/UDPの接続 → NLB",
      "仮想検査装置へ透過分配 → GWLB",
      "必要可用性 → 最低台数 → 水平 / 垂直 / 停止・休止"
    ],
    "points": [
      "確認：GWLBを選べばWebのパス別振分けを代替？ → 役割が異なる。",
      "確認：夜間未使用の開発機と24時間本番を同じ停止方針にする？ → 要求可用性を先に分ける。"
    ],
    "comparison": [
      {
        "name": "水平拡張",
        "use": "複数台で処理",
        "caution": "状態と下流容量が条件"
      },
      {
        "name": "垂直拡張",
        "use": "1台の能力を変更",
        "caution": "上限・切替・費用を確認"
      },
      {
        "name": "GWLB",
        "use": "仮想アプライアンスの分配",
        "caution": "ALBのHTTPルールと役割が異なる"
      }
    ],
    "conceptIds": [
      "gwlb",
      "alb",
      "nlb",
      "scaling",
      "instance-family"
    ],
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
    "id": "ch06-l06",
    "title": "DBの形式・エンジン・移行費用を比較する",
    "analogy": "伝票の1件更新、売上の全体集計、温度の時間変化では探しやすい整理方法が違います。",
    "explanation": "PostgreSQLとMySQLを比較するときは単価だけでなく、既存のSQL、型、拡張、ドライバー、トランザクションと運用の互換性を先に確認します。同種移行は変更を抑えやすく、異種移行はスキーマ変換とアプリ修正、検証の費用が増え得ます。DMSのデータ移行・CDCとスキーマ変換を別工程にし、切替時の差分とデータ整合性を検証します。\n\n大量行の少数列を集計する分析には、Redshift等の列指向方式で不要な列のI/Oを避ける候補があります。少数行の頻繁な更新というOLTPと同じ基準で選びません。センサー時系列では時刻範囲、集約間隔、タグ数、書込み量、保存期間を比較し、時系列向けDBの保持階層とクエリ費を評価します。例えばTimestream系サービスは候補の一つですが、製品ごとの提供条件と新規利用可否を購入前に確認します。名前だけで常に最安とは判断しません。\n\nサーバーレスも実際の稼働量、最低・最大容量、再開特性等で比較し、常時高負荷なら固定容量が有利な場合もあります。バックアップ頻度はRPO、保持は監査・復元時点、復元待ちはRTOに対応させ、不要な世代を削る前に条件を確認します。",
    "diagram": [
      "SQL・更新・JOIN → 関係DBの互換性",
      "多数行・少数列の集計 → 列指向",
      "時刻範囲・間引き・長期保持 → 時系列",
      "移行 → スキーマ変換 ＋ データ移行 ＋ 整合性検証"
    ],
    "points": [
      "確認：DMSのコピー完了だけで異種移行の全SQLが動く？ → スキーマ・アプリ互換と切替検証は別。",
      "確認：時系列なら保持期間に関係なく最安？ → 書込み・クエリ・保持の総量で評価する。"
    ],
    "comparison": [
      {
        "name": "関係DB",
        "use": "SQLとトランザクション",
        "caution": "既存エンジンの互換性を確認"
      },
      {
        "name": "列指向",
        "use": "多数行・必要列の集計",
        "caution": "少数行更新とは特性が異なる"
      },
      {
        "name": "時系列",
        "use": "時刻範囲の集計と保持",
        "caution": "タグ数・期間・提供条件を比較"
      }
    ],
    "conceptIds": [
      "database-selection",
      "columnar",
      "time-series",
      "database-cost"
    ],
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
    "id": "ch07-l05",
    "title": "流量制御と帯域を下流の能力・再試行から決める",
    "analogy": "入口の整理券は一度に入る人数を調整しますが、建物の最大収容数そのものを増やしません。",
    "explanation": "API Gatewayでは継続レートとバーストを設定し、急な要求からバックエンドを守ります。スロットリングやクォータはベストエフォートであり、支出の絶対上限ではありません。429への指数バックオフとジッター、再試行回数、業務操作の冪等性を設計し、再試行が負荷をさらに増やす循環を避けます。即時応答が不要ならSQS等のバッファとワーカーの同時実行制御も候補になります。WAFのレート制御は攻撃・不要トラフィック対策の層として別途比較します。\n\n帯域は平常時だけでなく代替回線でも必要量を満たすか確認します。Direct Connect、VPN、インターネット経路は帯域、暗号化、可用性、固定費・転送費で比較します。VPNを複数に増やす案でも、ルーティング・分散対応・フロー単位の上限を確認し、単に回線本数を掛けた性能を保証しません。既存経路の通信量、往復・AZ越境、不要な反復取得を調べ、CDN・エンドポイント・圧縮・配置変更で減らせる部分を測定します。",
    "diagram": [
      "到着量 → レート・バースト制御 → 下流能力",
      "429 → 制限付きバックオフ → 再試行",
      "通常 / 代替の必要帯域 → 実測 → 経路と費用を再評価"
    ],
    "points": [
      "確認：API Gatewayのしきい値は課金のハード上限？ → ベストエフォート。",
      "確認：VPNを2本にすれば1接続も必ず2倍？ → 分散条件・フロー制約の検証が必要。"
    ],
    "comparison": [
      {
        "name": "スロットリング",
        "use": "過大な到着を抑える",
        "caution": "再試行が集中しない設計が必要"
      },
      {
        "name": "キュー",
        "use": "非同期処理で平準化",
        "caution": "滞留時間と処理速度を監視"
      },
      {
        "name": "帯域増強",
        "use": "必要な転送能力を確保",
        "caution": "代替時・フロー上限・費用を確認"
      }
    ],
    "conceptIds": [
      "throttling",
      "hybrid-network",
      "network-cost"
    ],
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
