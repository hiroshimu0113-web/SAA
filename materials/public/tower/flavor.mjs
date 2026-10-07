export const BASE_FLAVOR={
  "strike": {
    "note": "AWSと利用者で安全性や運用の責任を分担する考え方。利用するサービスで境界が変わる。",
    "source": "https://aws.amazon.com/compliance/shared-responsibility-model/",
    "limit": "教材の用語を復習するカードです。攻撃・防御・回復・状態異常などの数値効果はゲーム固有であり、AWSの機能・性能・保証を表しません。"
  },
  "guard": {
    "note": "必要な対象に必要な操作だけを許可する原則。Action、Resource、Conditionなどを絞る。",
    "source": "https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html",
    "limit": "教材の用語を復習するカードです。攻撃・防御・回復・状態異常などの数値効果はゲーム固有であり、AWSの機能・性能・保証を表しません。"
  },
  "probe": {
    "note": "ヘルスチェックは処理先の応答を定期的に確認します。異常検出には時間がかかり、全ターゲット異常時にはALBのフェイルオープンという例外もあります。",
    "source": "https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html",
    "limit": "教材の用語を復習するカードです。攻撃・防御・回復・状態異常などの数値効果はゲーム固有であり、AWSの機能・性能・保証を表しません。"
  },
  "burst": {
    "note": "ワークロードの要件に合わせ、資源の種類や大きさを選びます。",
    "limit": "集中処理の攻撃値は、特定インスタンスの処理性能ではありません。",
    "source": "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/PerformanceEfficiencyPillar.html"
  },
  "parallel": {
    "note": "複数の小さな資源へ処理を分散し、共通の障害点を避ける考え方があります。",
    "limit": "2回攻撃はゲーム上の表現で、性能が必ず2倍になる意味ではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  },
  "retry": {
    "note": "このカードは0エナジーで攻撃できます。",
    "limit": "実際の再試行が無料・無制限・常に安全という意味ではありません。",
    "source": null
  },
  "reserve": {
    "note": "需要と使用量を監視し、必要な容量を考えます。",
    "limit": "予備容量の確保だけで、すべての障害に耐えられるわけではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  },
  "restore": {
    "note": "復旧手順は、障害を想定して実際に試験します。",
    "limit": "HP回復量は現実の復旧時間やデータ復元量を表しません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  },
  "foresight": {
    "note": "平常時の指標を基準に、変化を捉えます。",
    "limit": "ドローは情報を得る比喩で、将来の障害を確実に予言する機能ではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operate.html"
  },
  "isolate": {
    "note": "共通の障害点を避け、単一障害の影響を小さくする設計を考えます。",
    "limit": "過負荷のターン数は現実の障害隔離時間ではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  },
  "detour": {
    "note": "障害を回避・修復する復旧の手順を設計し、試験します。",
    "limit": "カードを使うだけで現実の代替経路が自動的に用意されるわけではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  },
  "analysis": {
    "note": "ログや指標を調査と原因分析に利用します。",
    "limit": "ログがあるだけで原因を断定できるわけではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/operational-excellence-pillar/operate.html"
  },
  "overload": {
    "note": "性能試験で基準を作り、負荷をかけたときの指標を確認します。",
    "limit": "自傷3は架空の代償で、本番環境へ無計画に負荷をかける推奨ではありません。",
    "source": "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/PerformanceEfficiencyPillar.html"
  },
  "redundant": {
    "note": "資源を複数に分ける際は、共通の障害点も確認します。",
    "limit": "毎ターン防御は比喩です。複製するだけで可用性が保証されるわけではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  },
  "optimize": {
    "note": "指標を観察し、ワークロードに合う改善を選びます。",
    "limit": "強化値は実際の性能改善率ではありません。",
    "source": "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/PerformanceEfficiencyPillar.html"
  },
  "cache": {
    "note": "キャッシュの効果や性能を監視し、使い方を見直します。",
    "limit": "エナジー回復はゲーム上の報酬で、キャッシュが無条件に有効という意味ではありません。",
    "source": "https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/PerformanceEfficiencyPillar.html"
  },
  "patch": {
    "note": "インフラの変更は自動化し、その変更自体も追跡・レビューします。",
    "limit": "緊急パッチのブロック値は、脆弱性の解消度を表しません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  },
  "balance": {
    "note": "リクエストを複数の資源へ分散する考え方です。",
    "limit": "攻撃と防御を同時に得るのはゲーム固有の効果です。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  },
  "reversal": {
    "note": "このカードは、使用時のブロックを攻撃に加えます。",
    "limit": "防御を攻撃へ変える計算はゲーム固有で、AWSの機能ではありません。",
    "source": null
  },
  "quarantine": {
    "note": "一つの障害が全体へ与える影響を小さくすることを考えます。",
    "limit": "過負荷の付与はゲーム上の比喩で、具体的な隔離設定を代わりに実施するものではありません。",
    "source": "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/design-principles.html"
  }
};

export const FLAVOR=JSON.parse(JSON.stringify(BASE_FLAVOR));
